import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import { createJob, deleteJob, getMyJobs, updateJob, validateAndNormalizeJob } from "./jobController.js";
import { analyzeJobMatch } from "../services/aiJobMatcher.js";
import { getAdminClerkOrganization } from "../services/companyAuthorization.js";

const originals = { companyFindOne: Company.findOne, companyFind: Company.find, companyFindById: Company.findById, jobCreate: Job.create, jobFind: Job.find, jobFindOne: Job.findOne, jobFindById: Job.findById, jobDelete: Job.findOneAndDelete };
afterEach(() => {
  Company.findOne = originals.companyFindOne;
  Company.find = originals.companyFind;
  Company.findById = originals.companyFindById;
  Job.create = originals.jobCreate;
  Job.find = originals.jobFind;
  Job.findOne = originals.jobFindOne;
  Job.findById = originals.jobFindById;
  Job.findOneAndDelete = originals.jobDelete;
});
const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
const company = { _id: "507f1f77bcf86cd799439011", ownerId: "user_owner", name: "Empresa Verificada" };
const queryForCompany = (result) => ({ sort: async () => result });
const queryForCompanies = (results) => {
  const sorted = { limit: async () => results, then: (resolve, reject) => Promise.resolve(results).then(resolve, reject) };
  return { sort: () => sorted };
};
const validPayload = {
  title: "Pessoa desenvolvedora", company: "Empresa falsificada", location: "Remoto",
  contractType: "Tempo Integral", experienceLevel: "Pleno", workMode: "remote",
  salaryMin: "5000", salaryMax: "8000", requirements: ["TypeScript", " TypeScript "],
  desiredRequirements: ["Docker"], description: "Desenvolver produto.", status: "published",
};

test("normaliza dados, deduplica requisitos e valida salários", () => {
  const { job, errors } = validateAndNormalizeJob(validPayload, { allowDraft: true, companyName: company.name });
  assert.deepEqual(errors, {});
  assert.equal(job.company, company.name);
  assert.deepEqual(job.requirements, ["TypeScript"]);
  assert.deepEqual(job.desiredRequirements, ["Docker"]);
  assert.equal(job.isRemote, true);
  assert.equal(job.workMode, "remote");
  assert.ok(validateAndNormalizeJob({ ...validPayload, salaryMin: "9000", salaryMax: "1000" }, { allowDraft: true }).errors.salaryMax);
  assert.ok(validateAndNormalizeJob({ ...validPayload, title: "   " }, { allowDraft: true }).errors.title);
});

test("usa requisitos desejáveis estruturados na compatibilidade sem misturá-los aos obrigatórios", () => {
  const match = analyzeJobMatch({ portfolio: { languages: ["TypeScript"] } }, {
    requirements: ["React"], desiredRequirements: ["TypeScript"],
  });
  assert.deepEqual(match.requiredSkills, ["react"]);
  assert.deepEqual(match.desiredSkills, ["typescript"]);
  assert.deepEqual(match.matchedDesired, ["typescript"]);
});

test("persiste vaga vinculada à empresa do usuário autenticado", async () => {
  let saved;
  Company.find = () => queryForCompanies([company]);
  Job.create = async (document) => { saved = document; return { ...document, _id: "507f1f77bcf86cd799439012" }; };
  const res = response();
  await createJob({ auth: () => ({ userId: "user_owner" }), body: validPayload }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(saved.company, company.name);
  assert.equal(saved.companyId, company._id);
  assert.equal(saved.user, "user_owner");
  assert.equal(res.body.job._id, "507f1f77bcf86cd799439012");
});

test("recruiter can create jobs for an authorized company and cannot override its identity from the request", async () => {
  let saved;
  const recruiterCompany = { ...company, ownerId: "another_owner", members: [{ userId: "recruiter_user", role: "recruiter", status: "active" }] };
  Company.find = (filter) => {
    assert.equal(filter.$or.some((condition) => condition["members.userId"] === "recruiter_user"), true);
    return queryForCompanies([recruiterCompany]);
  };
  Job.create = async (document) => { saved = document; return document; };
  const res = response();
  await createJob({ auth: () => ({ userId: "recruiter_user" }), body: { ...validPayload, companyId: "malicious-company-id" } }, res);
  assert.equal(res.statusCode, 403);
  assert.equal(saved, undefined);

  Company.find = () => queryForCompanies([recruiterCompany]);
  await createJob({ auth: () => ({ userId: "recruiter_user" }), body: validPayload }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(saved.companyId, recruiterCompany._id);
  assert.equal(saved.user, "recruiter_user");
});

test("viewer and users from another company cannot create company jobs", async () => {
  const res = response();
  Company.find = () => queryForCompanies([{ ...company, ownerId: "different_owner", members: [{ userId: "viewer_user", role: "viewer", status: "active" }] }]);
  await createJob({ auth: () => ({ userId: "viewer_user" }), body: validPayload }, res);
  assert.equal(res.statusCode, 403);
  Company.find = () => queryForCompanies([{ ...company, ownerId: "different_owner", members: [] }]);
  await createJob({ auth: () => ({ userId: "outsider" }), body: validPayload }, res);
  assert.equal(res.statusCode, 403);
});

test("refuses an implicit company choice when the user can recruit for multiple companies", async () => {
  const res = response();
  Company.find = () => queryForCompanies([
    { ...company, ownerId: "user_owner" },
    { _id: "507f1f77bcf86cd799439013", ownerId: "other_owner", name: "Other", members: [{ userId: "user_owner", role: "recruiter", status: "active" }] },
  ]);
  await createJob({ auth: () => ({ userId: "user_owner" }), body: validPayload }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, "COMPANY_SELECTION_REQUIRED");
});

test("recusa criação sem empresa controlada pelo usuário", async () => {
  Company.find = () => queryForCompanies([]);
  Job.create = async () => assert.fail("não deve persistir");
  const res = response();
  await createJob({ auth: () => ({ userId: "user_without_company" }), body: validPayload }, res);
  assert.equal(res.statusCode, 403);
});

test("persiste rascunhos sem exigir campos de publicação", async () => {
  let saved;
  Company.find = () => queryForCompanies([company]);
  Job.create = async (document) => { saved = document; return document; };
  const res = response();
  await createJob({ auth: () => ({ userId: "user_owner" }), body: { status: "draft", title: "Rascunho" } }, res);
  assert.equal(res.statusCode, 201);
  assert.equal(saved.status, "draft");
  assert.equal(saved.title, "Rascunho");
});

test("recusa dados inválidos antes de persistir", async () => {
  Company.find = () => queryForCompanies([company]);
  Job.create = async () => assert.fail("não deve persistir");
  const res = response();
  await createJob({ auth: () => ({ userId: "user_owner" }), body: { ...validPayload, salaryMin: "abc" } }, res);
  assert.equal(res.statusCode, 400);
  assert.ok(res.body.errors.salaryMin);
});

test("não atualiza nem exclui vagas de outra pessoa", async () => {
  Job.findById = async () => null;
  Job.findOneAndDelete = async () => null;
  const req = { auth: () => ({ userId: "user_owner" }), body: { jobId: "507f1f77bcf86cd799439012", ...validPayload } };
  const updateRes = response(); await updateJob(req, updateRes);
  const deleteRes = response(); await deleteJob(req, deleteRes);
  assert.equal(updateRes.statusCode, 404);
  assert.equal(deleteRes.statusCode, 404);
});

test("não edita vaga de usuário que não controla a empresa vinculada", async () => {
  let saved = false;
  const existingJob = { _id: "507f1f77bcf86cd799439012", user: "user_owner", companyId: company._id, save: async () => { saved = true; } };
  Job.findById = async () => existingJob;
  Company.findById = async () => null;
  const res = response();
  await updateJob({ auth: () => ({ userId: "user_owner" }), body: { jobId: existingJob._id, ...validPayload } }, res);
  assert.equal(res.statusCode, 403);
  assert.equal(saved, false);
});

test("lista somente vagas vinculadas ao usuário autenticado", async () => {
  let filter;
  Company.find = () => queryForCompanies([company]);
  Job.find = (query) => { filter = query; return { sort: async () => [{ _id: "mine" }] }; };
  const res = response();
  await getMyJobs({ auth: () => ({ userId: "user_owner" }) }, res);
  assert.ok(filter.$or.some((item) => item.companyId?.$in?.includes(company._id)));
  assert.equal(res.body.jobs[0]._id, "mine");
});

test("atualiza vaga apenas com identidade autenticada e empresa vinculada", async () => {
  let saved = false;
  const existingJob = { _id: "507f1f77bcf86cd799439012", user: "user_owner", companyId: company._id, save: async () => { saved = true; } };
  Job.findById = async (id) => { assert.equal(id, existingJob._id); return existingJob; };
  Company.findById = async (id) => { assert.equal(id, company._id); return company; };
  const res = response();
  await updateJob({ auth: () => ({ userId: "user_owner" }), body: { jobId: existingJob._id, ...validPayload } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(saved, true);
  assert.equal(existingJob.company, company.name);
  assert.deepEqual(existingJob.desiredRequirements, ["Docker"]);
});

test("reconciles an unlinked legacy job only when its authenticated owner has exactly one company", async () => {
  const legacyJob = { _id: "507f1f77bcf86cd799439012", user: "user_owner", company: "Old textual label", save: async () => {} };
  Job.findById = async () => legacyJob;
  Company.find = () => queryForCompanies([company]);
  const res = response();
  await updateJob({ auth: () => ({ userId: "user_owner" }), body: { jobId: legacyJob._id, ...validPayload } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(legacyJob.companyId, company._id);
  assert.equal(legacyJob.company, company.name);
});

test("does not guess a legacy vacancy company from its textual name when the owner is ambiguous", async () => {
  let saved = false;
  const legacyJob = { _id: "507f1f77bcf86cd799439012", user: "user_owner", company: company.name, save: async () => { saved = true; } };
  Job.findById = async () => legacyJob;
  Company.find = () => queryForCompanies([company, { ...company, _id: "507f1f77bcf86cd799439013", name: "Other company" }]);
  const res = response();
  await updateJob({ auth: () => ({ userId: "user_owner" }), body: { jobId: legacyJob._id, ...validPayload } }, res);
  assert.equal(res.statusCode, 403);
  assert.equal(saved, false);
  assert.equal(legacyJob.companyId, undefined);
});

test("não expõe detalhes internos quando MongoDB falha", async () => {
  Company.find = () => queryForCompanies([company]);
  Job.create = async () => { throw new Error("private database detail"); };
  const res = response();
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    await createJob({ auth: () => ({ userId: "user_owner" }), body: validPayload }, res);
  } finally {
    console.error = originalConsoleError;
  }
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.message.includes("private database detail"), false);
});

test("confirma no Clerk a associação e o papel de administrador antes de vincular uma empresa", async () => {
  const organization = { id: "org_verified", name: "Nome oficial no Clerk" };
  const client = { organizations: {
    getOrganization: async ({ organizationId }) => { assert.equal(organizationId, "org_verified"); return organization; },
    getOrganizationMembershipList: async ({ organizationId, userId, limit }) => {
      assert.equal(organizationId, "org_verified");
      assert.deepEqual(userId, ["user_owner"]);
      assert.equal(limit, 1);
      return { data: [{ role: "org:admin", publicUserData: { userId: "user_owner" } }] };
    },
  } };
  assert.equal(await getAdminClerkOrganization("user_owner", "org_verified", client), organization);
});

test("recusa associação falsa, organização inexistente e membro sem papel de administrador", async () => {
  const client = { organizations: {
    getOrganization: async ({ organizationId }) => ({ id: organizationId, name: "Clerk" }),
    getOrganizationMembershipList: async ({ userId }) => ({ data: [{ role: "org:member", publicUserData: { userId: "another_user" } }] }),
  } };
  assert.equal(await getAdminClerkOrganization("user_owner", "org_verified", client), null);
  assert.equal(await getAdminClerkOrganization("user_owner", "", client), null);
});
