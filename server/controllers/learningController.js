import Job from "../models/Job.js";
import User from "../models/User.js";
import { extractKnownSkills, rankJobsByProfile } from "../services/aiJobMatcher.js";
import { findCoursesForSkills, getCourseCatalog } from "../services/courseCatalog.js";

const unique = (values) => [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];

export const buildLearningRecommendations = (user, jobs) => {
  const confirmedSkills = (user.learningProgress || []).flatMap((item) => item.acquiredSkills || []);
  const candidate = { ...(user.toObject?.() || user), portfolio: { ...(user.portfolio || {}), languages: [...(user.portfolio?.languages || []), ...confirmedSkills] } };
  const targetRole = user.learningPreferences?.targetRole || "";
  const roleTokens = targetRole.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/[^a-z0-9+#]+/).filter((token) => token.length > 2);
  const roleFilteredJobs = roleTokens.length
    ? jobs.filter((job) => {
      const text = `${job.title || ""} ${job.description || ""} ${job.category || ""}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return roleTokens.some((token) => text.includes(token));
    })
    : [];
  const jobsForRole = roleFilteredJobs.length ? roleFilteredJobs : jobs;
  const ranked = rankJobsByProfile(candidate, jobsForRole).slice(0, 100);
  const comparableJobs = ranked.filter(({ aiMatch }) => aiMatch.comparable);
  const compatibleJobs = comparableJobs.filter(({ aiMatch }) => aiMatch.score > 0).slice(0, 20);
  const gapCorpus = compatibleJobs.length ? compatibleJobs : comparableJobs.slice(0, 20);
  const profileSkills = unique([...(user.portfolio?.languages || []), ...(user.portfolio?.libraries || []), ...(user.portfolio?.frameworks || []), ...confirmedSkills]);
  const desiredSkills = unique(user.learningPreferences?.desiredSkills || []);
  const canonicalDesiredSkills = extractKnownSkills(desiredSkills);
  const progress = new Map((user.learningProgress || []).map((item) => [item.courseId, item]));
  const completedSkills = [...user.learningProgress || []]
    .filter((item) => item.status === "completed")
    .flatMap((item) => item.acquiredSkills || []);
  const completedOrAcquired = new Set(extractKnownSkills([...confirmedSkills, ...completedSkills]));
  const frequency = new Map();
  for (const { aiMatch } of gapCorpus) {
    for (const skill of [...aiMatch.missingRequired, ...aiMatch.missingDesired, ...aiMatch.missingInferred]) {
      frequency.set(skill, (frequency.get(skill) || 0) + 1);
    }
  }
  const gapSkills = [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill)
    .filter((skill) => !completedOrAcquired.has(skill));
  const recommendationSkills = unique([...gapSkills, ...canonicalDesiredSkills])
    .filter((skill) => !completedOrAcquired.has(skill));
  const skillPriority = new Map(recommendationSkills.map((skill, index) => [skill.toLowerCase(), index]));
  const completedCourseIds = new Set((user.learningProgress || [])
    .filter((item) => item.status === "completed")
    .map((item) => item.courseId));
  const seenUrls = new Set();
  const courseScores = findCoursesForSkills(recommendationSkills)
    .filter((course) => !completedCourseIds.has(course.id))
    .map((course) => {
      const gapScore = course.relatedSkills.reduce((sum, skill) => sum + (frequency.get(skill) || 0), 0);
      const desiredScore = course.relatedSkills.filter((skill) => canonicalDesiredSkills.includes(skill)).length * 10;
      const profileScore = course.relatedSkills.filter((skill) => extractKnownSkills(profileSkills).includes(skill)).length;
      const priorityScore = Math.min(...course.relatedSkills.map((skill) => skillPriority.get(skill) ?? 999));
      const exactGapCount = course.relatedSkills.filter((skill) => gapSkills.includes(skill)).length;
      const breadthPenalty = course.skills.length;
      return { course, gapScore, desiredScore, profileScore, priorityScore, exactGapCount, breadthPenalty };
    })
    .sort((a, b) => b.desiredScore - a.desiredScore || b.gapScore - a.gapScore || b.exactGapCount - a.exactGapCount || a.breadthPenalty - b.breadthPenalty || a.priorityScore - b.priorityScore || a.course.title.localeCompare(b.course.title));
  const courses = [];
  const usedSkills = new Set();
  for (const candidateCourse of courseScores) {
    if (courses.length >= 12) break;
    const normalizedUrl = candidateCourse.course.url.trim().toLowerCase().replace(/\/$/, "");
    if (seenUrls.has(normalizedUrl)) continue;
    const primarySkill = candidateCourse.course.relatedSkills.find((skill) => recommendationSkills.includes(skill));
    if (candidateCourse.course.relatedSkills.length === 1 && usedSkills.has(primarySkill) && courses.length < 6) continue;
    seenUrls.add(normalizedUrl);
    if (primarySkill) usedSkills.add(primarySkill);
    courses.push(candidateCourse.course);
  }
  if (courses.length < 12) {
    for (const candidateCourse of courseScores) {
      if (courses.length >= 12) break;
      const normalizedUrl = candidateCourse.course.url.trim().toLowerCase().replace(/\/$/, "");
      if (seenUrls.has(normalizedUrl) || courses.some(({ id }) => id === candidateCourse.course.id)) continue;
      seenUrls.add(normalizedUrl);
      courses.push(candidateCourse.course);
    }
  }
  const source = compatibleJobs.length ? "compatible-jobs" : comparableJobs.length ? "published-job-requirements" : desiredSkills.length ? "profile-goals" : gapSkills.length ? "profile-requirements" : "insufficient-data";
  return {
    diagnosis: {
      identifiedSkills: profileSkills,
      skillsToDevelop: [...frequency.entries()].filter(([skill]) => !completedOrAcquired.has(skill)).sort((a, b) => b[1] - a[1]).map(([skill, vacancyCount]) => ({ skill, vacancyCount })),
      existingProjects: [],
      projectNotice: "O perfil atual não armazena projetos estruturados; as recomendações usam competências declaradas e requisitos das vagas.",
      vacancyNotice: compatibleJobs.length ? `Recomendações fundamentadas em ${compatibleJobs.length} vagas publicadas que compartilham competências com o perfil.` : comparableJobs.length ? "Nenhuma vaga teve correspondência positiva com as competências declaradas. As sugestões usam requisitos de vagas publicadas, não são apresentadas como vagas compatíveis." : "Não foram encontradas vagas comparáveis. As sugestões usam as competências do perfil, seus objetivos e materiais gerais de portfólio.",
      vacancyNoticeCode: compatibleJobs.length ? "compatible" : comparableJobs.length ? "requirements-only" : "no-comparable-jobs",
      vacancyCount: compatibleJobs.length || comparableJobs.length,
      evidenceNotice: "Competências ausentes são tratadas como não identificadas no perfil, não como desconhecidas pelo candidato.",
      targetRole,
      desiredSkills,
      recommendationSource: source,
    },
    courses: courses.map((course) => {
      const project = course.project;
      const matchedGaps = course.relatedSkills.filter((skill) => frequency.has(skill));
      const matches = gapCorpus.filter(({ aiMatch }) => [...aiMatch.missingRequired, ...aiMatch.missingDesired, ...aiMatch.missingInferred].some((skill) => course.relatedSkills.includes(skill)));
      const desiredMatch = course.relatedSkills.filter((skill) => desiredSkills.some((desired) => desired.toLowerCase() === skill));
      const profileMatch = course.relatedSkills.filter((skill) => profileSkills.some((known) => known.toLowerCase() === skill));
      const saved = progress.get(course.id);
      const reason = matchedGaps.length
        ? compatibleJobs.length
          ? `Desenvolve ${matchedGaps.join(", ")}, ainda não identificada em ${matches.length} vaga(s) comparável(is) que compartilham competências com seu perfil.`
          : `Desenvolve ${matchedGaps.join(", ")}, citada em ${matches.length} vaga(s) publicada(s). Nenhuma teve correspondência positiva com seu perfil, então esta sugestão se baseia na demanda observada, não em compatibilidade.`
        : desiredMatch.length
          ? `Recomendado porque você informou interesse em desenvolver ${desiredMatch.join(", ")}.`
          : profileMatch.length
            ? `Aproveita sua base declarada em ${profileMatch.join(", ")} para construir evidências práticas no portfólio.`
            : "Sugestão geral de aprendizagem para construir um portfólio web demonstrável; não foi baseada em vagas compatíveis nem em uma meta profissional informada.";
      const reasonKind = matchedGaps.length ? compatibleJobs.length ? "compatible-gap" : "published-gap" : desiredMatch.length ? "goal" : profileMatch.length ? "profile" : "general";
      return { ...course, reason, reasonKind, reasonSkills: matchedGaps.length ? matchedGaps : desiredMatch.length ? desiredMatch : profileMatch, reasonVacancyCount: matches.length, relatedJobs: matches.slice(0, 5).map(({ job }) => ({ id: String(job._id), title: job.title, company: job.company, relation: compatibleJobs.length ? "compatível" : "requisito publicado" })), prerequisites: course.level || "Consulte os pré-requisitos na plataforma.", project, portfolioImpact: project ? `O código, os testes e a documentação podem demonstrar ${course.relatedSkills.join(", ")} em uma entrega verificável por recrutadores.` : "Publique um projeto relacionado às competências e documente decisões, execução e testes.", progress: saved ? { status: saved.status, projectStatus: saved.projectStatus, acquiredSkills: saved.acquiredSkills || [] } : { status: "want", projectStatus: "planned", acquiredSkills: [] } };
    }),
    criteria: { method: "Regras explícitas sobre requisitos publicados, competências declaradas e objetivos informados; sem pontuação probabilística ou chamadas a IA generativa.", vacanciesAnalyzed: jobsForRole.length, compatibleVacancies: compatibleJobs.length, comparableVacancies: comparableJobs.length, catalogCourses: getCourseCatalog().length, recommendationSource: source },
  };
};

export const getLearningRecommendations = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "published" }).sort({ createdAt: -1 }).limit(500).lean();
    return res.json({ success: true, ...buildLearningRecommendations(req.dbUser, jobs) });
  } catch (error) {
    console.error("Failed to build learning recommendations:", error);
    return res.status(500).json({ success: false, message: "Não foi possível carregar as recomendações." });
  }
};

export const updateLearningProgress = async (req, res) => {
  try {
    const { courseId, status, projectStatus, acquiredSkills } = req.body || {};
    const validCourseIds = new Set(getCourseCatalog().map((course) => course.id));
    if (!validCourseIds.has(courseId)) return res.status(400).json({ success: false, message: "Curso inválido." });
    if (status !== undefined && !["want", "in_progress", "completed"].includes(status)) return res.status(400).json({ success: false, message: "Status de curso inválido." });
    if (projectStatus !== undefined && !["planned", "in_progress", "completed"].includes(projectStatus)) return res.status(400).json({ success: false, message: "Status de projeto inválido." });
    if (acquiredSkills !== undefined && (!Array.isArray(acquiredSkills) || acquiredSkills.length > 30 || acquiredSkills.some((skill) => typeof skill !== "string" || skill.length > 60))) return res.status(400).json({ success: false, message: "Competências inválidas." });

    const user = await User.findById(req.dbUser._id);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    const entry = user.learningProgress.find((item) => item.courseId === courseId);
    if (entry) {
      if (status !== undefined) entry.status = status;
      if (projectStatus !== undefined) entry.projectStatus = projectStatus;
      if (acquiredSkills !== undefined) entry.acquiredSkills = [...new Set(acquiredSkills.map((skill) => skill.trim()).filter(Boolean))];
      entry.updatedAt = new Date();
    } else {
      user.learningProgress.push({ courseId, status: status || "want", projectStatus: projectStatus || "planned", acquiredSkills: acquiredSkills || [], updatedAt: new Date() });
    }
    await user.save();
    return res.json({ success: true, progress: user.learningProgress.find((item) => item.courseId === courseId) });
  } catch (error) {
    console.error("Failed to update learning progress:", error);
    return res.status(500).json({ success: false, message: "Não foi possível salvar o progresso." });
  }
};

export const updateLearningPreferences = async (req, res) => {
  try {
    const { targetRole, desiredSkills } = req.body || {};
    if (targetRole !== undefined && (typeof targetRole !== "string" || targetRole.length > 100)) return res.status(400).json({ success: false, message: "Área profissional inválida." });
    if (desiredSkills !== undefined && (!Array.isArray(desiredSkills) || desiredSkills.length > 30 || desiredSkills.some((skill) => typeof skill !== "string" || skill.length > 60))) return res.status(400).json({ success: false, message: "Competências desejadas inválidas." });
    const user = await User.findById(req.dbUser._id);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    user.learningPreferences = {
      targetRole: targetRole === undefined ? user.learningPreferences?.targetRole || "" : targetRole.trim(),
      desiredSkills: desiredSkills === undefined ? user.learningPreferences?.desiredSkills || [] : unique(desiredSkills),
    };
    await user.save();
    return res.json({ success: true, preferences: user.learningPreferences });
  } catch (error) {
    console.error("Failed to update learning preferences:", error);
    return res.status(500).json({ success: false, message: "Não foi possível salvar seus objetivos." });
  }
};
