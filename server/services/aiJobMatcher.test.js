import test from "node:test";
import assert from "node:assert/strict";
import { analyzeJobMatch, rankJobsByProfile } from "./aiJobMatcher.js";
import Job from "../models/Job.js";
import { analyzeSubmittedJob, getJobMatchDetails, getRecommendedJobs } from "../controllers/jobController.js";
import { buildLearningRecommendations, getLearningRecommendations, updateLearningPreferences, updateLearningProgress } from "../controllers/learningController.js";
import User from "../models/User.js";

const makeCandidate = (portfolio = {}) => ({
  bio: "",
  location: "",
  portfolio: { languages: [], libraries: [], frameworks: [], ...portfolio },
});

test("canonicalizes aliases and calculates the weighted required and desired coverage", () => {
  const candidate = makeCandidate({ languages: ["JS"], frameworks: ["ReactJS"] });
  const result = analyzeJobMatch(candidate, {
    title: "Frontend Engineer",
    requirements: ["JavaScript", "React", "Docker nice to have"],
  });

  assert.equal(result.score, 80);
  assert.deepEqual(result.matchedRequired, ["javascript", "react"]);
  assert.deepEqual(result.missingDesired, ["docker"]);
  assert.deepEqual(result.courses.map((course) => course.id), ["docker-get-started"]);
});

test("an empty candidate profile does not receive a misleading numeric score", () => {
  const result = analyzeJobMatch(makeCandidate(), {
    title: "Backend developer",
    requirements: ["Node.js", "MongoDB"],
  });

  assert.equal(result.score, null);
  assert.equal(result.profileIncomplete, true);
  assert.match(result.profileNotice, /não lista competências/i);
  assert.deepEqual(result.missingRequired, ["node.js", "mongodb"]);
});

test("secondary desirable skills cannot compensate for missing mandatory requirements", () => {
  const candidate = makeCandidate({ languages: ["Python", "Docker", "AWS"] });
  const result = analyzeJobMatch(candidate, {
    title: "Java engineer",
    requirements: ["Java", "Spring Boot", "Docker nice to have", "AWS preferred"],
  });

  assert.equal(result.score, 20);
  assert.deepEqual(result.missingRequired, ["java", "spring"]);
  assert.deepEqual(result.matchedDesired, ["docker", "aws"]);
});

test("jobs without recognizable skills are explicitly not comparable", () => {
  const result = analyzeJobMatch(makeCandidate({ languages: ["JavaScript"] }), {
    title: "Program manager",
    requirements: ["Five years managing regulated operations"],
  });

  assert.equal(result.score, null);
  assert.equal(result.comparable, false);
  assert.deepEqual(result.unassessedRequirements, ["Five years managing regulated operations"]);
});

test("skills are treated as declared, not as demonstrated project evidence", () => {
  const result = analyzeJobMatch(makeCandidate({ languages: ["Java"] }), {
    title: "Java developer",
    requirements: ["Java"],
  });

  assert.deepEqual(result.declaredSkills, ["java"]);
  assert.deepEqual(result.demonstratedSkills, []);
  assert.match(result.evidenceNotice, /não possui campos estruturados/i);
});

test("ranking orders comparable matches ahead of incomplete profiles and uses recency for ties", () => {
  const candidate = makeCandidate({ languages: ["JavaScript"] });
  const ranked = rankJobsByProfile(candidate, [
    { _id: "old", title: "JS developer", requirements: ["JavaScript"], createdAt: "2025-01-01" },
    { _id: "unknown", title: "Project manager", requirements: ["Industry experience"], createdAt: "2026-01-01" },
    { _id: "new", title: "Frontend developer", requirements: ["JavaScript"], createdAt: "2026-02-01" },
  ]);

  assert.deepEqual(ranked.map(({ job }) => job._id), ["new", "old", "unknown"]);
});

const responseRecorder = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

test("recommended jobs paginate and remain available when the external jobs source fails", async () => {
  const originalFind = Job.find;
  const originalCount = Job.countDocuments;
  const originalFetch = globalThis.fetch;
  const newest = { _id: "js-job", title: "Frontend developer", requirements: ["JavaScript"], createdAt: new Date("2026-02-01") };
  const older = { _id: "java-job", title: "Backend developer", requirements: ["Java"], createdAt: new Date("2026-01-01") };
  Job.find = () => ({ sort() { return this; }, limit() { return this; }, lean: async () => [newest, older] });
  Job.countDocuments = async () => 2;
  globalThis.fetch = async () => { throw new Error("Remotive unavailable"); };

  try {
    const res = responseRecorder();
    await getRecommendedJobs({
      dbUser: makeCandidate({ languages: ["JavaScript"] }),
      query: { page: "2", limit: "1" },
    }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.page, 2);
    assert.equal(res.body.jobs.length, 1);
    assert.equal(res.body.jobs[0]._id, "java-job");
    assert.equal(res.body.hasMore, false);
    assert.equal(res.body.usedAI, false);
  } finally {
    Job.find = originalFind;
    Job.countDocuments = originalCount;
    globalThis.fetch = originalFetch;
  }
});

test("match details use the authenticated candidate and only load published jobs", async () => {
  const originalFindOne = Job.findOne;
  let query;
  Job.findOne = (value) => {
    query = value;
    return { lean: async () => ({ _id: "job-1", title: "React developer", requirements: ["React"] }) };
  };
  try {
    const res = responseRecorder();
    await getJobMatchDetails({
      params: { jobId: "507f1f77bcf86cd799439011" },
      dbUser: makeCandidate({ frameworks: ["ReactJS"] }),
      body: { profileId: "someone-else" },
    }, res);
    assert.deepEqual(query, { _id: "507f1f77bcf86cd799439011", status: "published" });
    assert.equal(res.body.match.score, 100);
    assert.deepEqual(res.body.match.matchedRequired, ["react"]);
  } finally {
    Job.findOne = originalFindOne;
  }
});

test("closed or unavailable jobs do not return match data", async () => {
  const originalFindOne = Job.findOne;
  Job.findOne = () => ({ lean: async () => null });
  try {
    const res = responseRecorder();
    await getJobMatchDetails({ params: { jobId: "closed-job" }, dbUser: makeCandidate() }, res);
    assert.equal(res.statusCode, 404);
    assert.equal(res.body.success, false);
  } finally {
    Job.findOne = originalFindOne;
  }
});

test("external job analysis is authenticated, bounded, and uses only the supplied vacancy fields", async () => {
  const res = responseRecorder();
  await analyzeSubmittedJob({
    dbUser: makeCandidate({ languages: ["Docker"] }),
    body: {
      title: "Cloud engineer",
      description: "Work with containers",
      requirements: ["Docker", "Kubernetes"],
      userId: "another-candidate",
    },
  }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.match.matchedRequired, ["docker"]);
  assert.deepEqual(res.body.match.missingRequired, ["kubernetes"]);

  const invalid = responseRecorder();
  await analyzeSubmittedJob({ dbUser: makeCandidate(), body: { title: "", description: "" } }, invalid);
  assert.equal(invalid.statusCode, 400);
});

test("learning recommendations connect vacancy gaps to a verified course, portfolio project, and explicit progress", () => {
  const user = makeCandidate({ languages: ["JavaScript"] });
  const jobs = [{ _id: "react-role", title: "React developer", company: "Adapt", requirements: ["React", "JavaScript"] }];
  const result = buildLearningRecommendations(user, jobs);
  assert.deepEqual(result.diagnosis.skillsToDevelop, [{ skill: "react", vacancyCount: 1 }]);
  assert.equal(result.courses[0].id, "react-quick-start");
  assert.equal(result.courses[0].project.title, "Painel de oportunidades");
  assert.equal(result.courses[0].relatedJobs[0].id, "react-role");
  assert.equal(result.courses[0].progress.status, "want");

  user.learningProgress = [{ courseId: "react-quick-start", acquiredSkills: ["React"] }];
  const updated = buildLearningRecommendations(user, jobs);
  assert.equal(updated.diagnosis.skillsToDevelop.length, 0);
});

test("learning recommendations cover TypeScript, web foundations, Git, and testing gaps from actual vacancy requirements", () => {
  const user = makeCandidate({ languages: ["HTML", "CSS", "Git"] });
  const jobs = [{ _id: "frontend-role", title: "Frontend Engineer", company: "Example", requirements: ["TypeScript", "React", "HTML", "CSS", "Git", "Testing"] }];
  const result = buildLearningRecommendations(user, jobs);
  assert.ok(result.diagnosis.identifiedSkills.includes("HTML"));
  assert.deepEqual(result.diagnosis.skillsToDevelop.map(({ skill }) => skill), ["typescript", "react", "testing"]);
  assert.ok(result.courses.some((course) => course.id === "typescript-handbook" && course.project.technologies.includes("TypeScript")));
  assert.ok(result.courses.some((course) => course.id === "react-testing-library"));
  assert.ok(result.courses.every((course) => course.url.startsWith("https://") && course.reason && course.project?.title && course.project.technologies.length));
});

test("empty vacancy data still gives a transparent catalog recommendation and can use saved professional goals", () => {
  const user = makeCandidate({ languages: ["TypeScript"] });
  user.learningPreferences = { targetRole: "Frontend", desiredSkills: ["Testing"] };
  const result = buildLearningRecommendations(user, []);
  assert.ok(result.courses.length > 0);
  assert.equal(result.criteria.compatibleVacancies, 0);
  assert.equal(result.criteria.recommendationSource, "profile-goals");
  assert.match(result.diagnosis.vacancyNotice, /Não foram encontradas vagas/);
  assert.ok(result.courses.some((course) => course.id === "react-testing-library" && /interesse/.test(course.reason)));
});

test("learning recommendations endpoint queries only published vacancies and returns courses with projects", async () => {
  const originalFind = Job.find;
  let query;
  const vacancies = [{ _id: "frontend-role", title: "Frontend Engineer", company: "Example", requirements: ["JavaScript", "TypeScript"] }];
  Job.find = (filter) => {
    query = filter;
    return { sort() { return this; }, limit() { return this; }, lean: async () => vacancies };
  };
  try {
    const res = responseRecorder();
    await getLearningRecommendations({ dbUser: makeCandidate({ languages: ["JavaScript"] }) }, res);
    assert.deepEqual(query, { status: "published" });
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.courses.some((course) => course.id === "typescript-handbook"));
    assert.ok(res.body.courses.every((course) => course.reason && course.project));
  } finally {
    Job.find = originalFind;
  }
});

test("course progress and learning goals persist only against the authenticated user record", async () => {
  const originalFindById = User.findById;
  const stored = { _id: "auth-user", learningProgress: [], learningPreferences: {}, async save() { this.saved = true; } };
  let queriedUserId;
  User.findById = async (id) => { queriedUserId = id; return stored; };
  try {
    const courseRes = responseRecorder();
    await updateLearningProgress({ dbUser: { _id: "auth-user" }, body: { courseId: "typescript-handbook", status: "in_progress" } }, courseRes);
    assert.equal(queriedUserId, "auth-user");
    assert.equal(courseRes.body.progress.status, "in_progress");

    const preferenceRes = responseRecorder();
    await updateLearningPreferences({ dbUser: { _id: "auth-user" }, body: { targetRole: "Frontend", desiredSkills: ["TypeScript"] } }, preferenceRes);
    assert.equal(preferenceRes.body.preferences.targetRole, "Frontend");
    assert.deepEqual(preferenceRes.body.preferences.desiredSkills, ["TypeScript"]);
    assert.equal(stored.saved, true);
  } finally {
    User.findById = originalFindById;
  }
});
