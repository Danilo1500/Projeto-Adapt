import { findCoursesForSkills } from "./courseCatalog.js";

const SKILLS = {
  javascript: ["javascript", "js", "ecmascript"],
  typescript: ["typescript", "ts"],
  python: ["python", "python3"],
  java: ["java"],
  "c#": ["c#", "c sharp", "csharp"],
  ".net": [".net", "dotnet", "asp.net", "asp net"],
  "c++": ["c++", "cpp"],
  go: ["golang", "go language"],
  rust: ["rust", "rustlang"],
  php: ["php"],
  ruby: ["ruby", "rails", "ruby on rails"],
  swift: ["swift", "swiftui"],
  kotlin: ["kotlin"],
  react: ["react", "react.js", "reactjs"],
  "react native": ["react native", "react-native"],
  "node.js": ["node", "node.js", "nodejs"],
  express: ["express", "express.js", "expressjs"],
  angular: ["angular", "angularjs"],
  vue: ["vue", "vue.js", "vuejs"],
  nextjs: ["next.js", "nextjs"],
  spring: ["spring", "spring boot", "springboot"],
  django: ["django"],
  flask: ["flask"],
  "asp.net": ["asp.net", "asp net", ".net", "dotnet"],
  sql: ["sql", "structured query language"],
  postgresql: ["postgresql", "postgres", "postgre sql"],
  mysql: ["mysql"],
  mongodb: ["mongodb", "mongo", "mongo db"],
  redis: ["redis"],
  aws: ["aws", "amazon web services"],
  azure: ["azure", "microsoft azure"],
  gcp: ["gcp", "google cloud", "google cloud platform"],
  docker: ["docker", "containers", "containerization"],
  kubernetes: ["kubernetes", "k8s"],
  terraform: ["terraform", "infrastructure as code", "iac"],
  "ci/cd": ["ci/cd", "continuous integration", "continuous delivery", "continuous deployment"],
  linux: ["linux"],
  git: ["git", "github", "gitlab", "version control"],
  graphql: ["graphql", "graph ql"],
  rest: ["rest api", "restful", "rest apis"],
  html: ["html", "html5"],
  css: ["css", "css3"],
  figma: ["figma"],
  "machine learning": ["machine learning", "ml", "aprendizado de maquina", "aprendizado de máquina"],
  "data analysis": ["data analysis", "data analytics", "analise de dados", "análise de dados", "analytics"],
  "power bi": ["power bi", "powerbi"],
  tableau: ["tableau"],
  cybersecurity: ["cybersecurity", "cyber security", "ciberseguranca", "cibersegurança"],
  testing: ["testing", "testes", "software testing", "qa", "quality assurance"],
  vitest: ["vitest"],
  cypress: ["cypress"],
  postman: ["postman", "postman learning center"],
  "api testing": ["api testing", "testes de api", "testes api", "api tests"],
  "github actions": ["github actions", "github workflows"],
  pandas: ["pandas", "python pandas"],
  "modelagem de dados": ["modelagem de dados", "data modeling"],
  indices: ["indices", "índices", "database indexing", "indexacao", "indexação"],
  backup: ["backup", "database backup", "backup de banco"],
  agile: ["agile", "scrum", "kanban", "metodologias ageis", "metodologias ágeis"],
  communication: ["communication", "comunicacao", "comunicação"],
  leadership: ["leadership", "lideranca", "liderança"],
};

const normalized = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9+#./\s-]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const aliasEntries = Object.entries(SKILLS).flatMap(([canonical, aliases]) =>
  aliases.map((alias) => [normalized(alias), canonical])
).sort(([a], [b]) => b.length - a.length);

const unique = (items) => [...new Set(items)];
const stringList = (items) => Array.isArray(items) ? items.filter((item) => typeof item === "string") : [];

export const normalizeSkill = (value) => {
  const input = normalized(value);
  if (!input) return null;
  const alias = aliasEntries.find(([needle]) => input === needle);
  return alias?.[1] || null;
};

export const extractKnownSkills = (values) => {
  const text = normalized(stringList(values).join(" "));
  const accepted = [];
  for (const [alias, canonical] of aliasEntries) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|[^a-z0-9+#])(${escaped})(?=$|[^a-z0-9+#])`, "gi");
    for (const match of text.matchAll(pattern)) {
      const start = match.index + match[1].length;
      const end = start + match[2].length;
      if (!accepted.some((item) => start < item.end && end > item.start)) {
        accepted.push({ start, end, canonical });
      }
    }
  }
  return unique(accepted.sort((a, b) => a.start - b.start).map(({ canonical }) => canonical));
};

const profileSkillData = (user) => {
  const portfolio = user?.portfolio || {};
  const declared = unique([
    ...extractKnownSkills(stringList(portfolio.languages)),
    ...extractKnownSkills(stringList(portfolio.libraries)),
    ...extractKnownSkills(stringList(portfolio.frameworks)),
    ...extractKnownSkills([user?.bio || ""]),
  ]);
  // The current profile schema has no project/experience evidence fields.
  return { declared, demonstrated: [] };
};

const OPTIONAL_REQUIREMENT = /\b(nice to have|nice-to-have|optional|preferred|desirable|bonus|plus|desej[aá]vel|diferencial|ser[aá] um diferencial)\b/i;

const splitRequirementSkills = (job) => {
  const requirements = stringList(job?.requirements);
  const explicitDesired = stringList(job?.desiredRequirements);
  const requiredItems = requirements.filter((item) => !OPTIONAL_REQUIREMENT.test(item));
  const desiredItems = [...requirements.filter((item) => OPTIONAL_REQUIREMENT.test(item)), ...explicitDesired];
  const unassessed = [...requirements, ...explicitDesired].filter((item) => extractKnownSkills([item]).length === 0);
  const required = extractKnownSkills(requiredItems);
  const desired = extractKnownSkills(desiredItems).filter((skill) => !required.includes(skill));

  if (required.length || desired.length) {
    return { required, desired, inferredSkills: [], inferred: false, unassessed };
  }

  const inferred = extractKnownSkills([job?.title, job?.description, job?.category].filter(Boolean));
  return { required: [], desired: [], inferredSkills: inferred, inferred: inferred.length > 0, unassessed };
};

const getWeights = () => {
  const required = Number(process.env.MATCH_WEIGHT_REQUIRED || 80);
  const desired = Number(process.env.MATCH_WEIGHT_DESIRED || 20);
  const safeRequired = Number.isFinite(required) && required >= 0 ? required : 80;
  const safeDesired = Number.isFinite(desired) && desired >= 0 ? desired : 20;
  return { required: safeRequired, desired: safeDesired };
};

export const analyzeJobMatch = (user, job) => {
  const profile = profileSkillData(user);
  const requirements = splitRequirementSkills(job);
  const candidateSkills = unique([...profile.declared, ...profile.demonstrated]);
  const evaluatedSkills = unique([...requirements.required, ...requirements.desired, ...requirements.inferredSkills]);
  const matchedRequired = requirements.required.filter((skill) => candidateSkills.includes(skill));
  const missingRequired = requirements.required.filter((skill) => !candidateSkills.includes(skill));
  const matchedDesired = requirements.desired.filter((skill) => candidateSkills.includes(skill));
  const missingDesired = requirements.desired.filter((skill) => !candidateSkills.includes(skill));
  const matchedInferred = requirements.inferredSkills.filter((skill) => candidateSkills.includes(skill));
  const missingInferred = requirements.inferredSkills.filter((skill) => !candidateSkills.includes(skill));
  const profileIncomplete = candidateSkills.length === 0;
  const comparable = evaluatedSkills.length > 0;
  const weights = getWeights();
  const inferredWeight = requirements.inferredSkills.length && !requirements.required.length && !requirements.desired.length ? 100 : 0;
  const activeWeight = (requirements.required.length ? weights.required : 0)
    + (requirements.desired.length ? weights.desired : 0)
    + inferredWeight;

  let score = null;
  if (!profileIncomplete && comparable && activeWeight > 0) {
    const requiredCoverage = requirements.required.length ? matchedRequired.length / requirements.required.length : null;
    const desiredCoverage = requirements.desired.length ? matchedDesired.length / requirements.desired.length : null;
    const inferredCoverage = requirements.inferredSkills.length ? matchedInferred.length / requirements.inferredSkills.length : null;
    score = Math.round((
      (requiredCoverage === null ? 0 : requiredCoverage * weights.required)
      + (desiredCoverage === null ? 0 : desiredCoverage * weights.desired)
      + (inferredCoverage === null ? 0 : inferredCoverage * inferredWeight)
    ) / activeWeight * 100);
  }

  const matchReasons = [];
  if (matchedRequired.length) matchReasons.push(`Requisitos obrigatórios identificados no perfil: ${matchedRequired.join(", ")}.`);
  if (matchedDesired.length) matchReasons.push(`Competências desejáveis identificadas: ${matchedDesired.join(", ")}.`);
  if (matchedInferred.length) matchReasons.push(`Competências mencionadas no título ou descrição: ${matchedInferred.join(", ")}; a vaga não classifica esses itens como obrigatórios.`);
  if (!matchReasons.length && !profileIncomplete && comparable) matchReasons.push("Nenhum requisito listado foi identificado no perfil.");

  const missingSkills = [...missingRequired, ...missingDesired, ...missingInferred];
  const courses = findCoursesForSkills(missingSkills);
  const notEvaluated = [...requirements.unassessed.map((requirement) => `Requisito não reconhecido pelo catálogo de competências: ${requirement}`)];
  if (job?.experienceLevel) notEvaluated.push("Nível de experiência: o perfil atual não possui um campo equivalente para comparação.");

  return {
    score,
    scoreMeaning: `Cobertura dos requisitos técnicos identificados, não probabilidade de contratação. Pesos configurados: obrigatórios ${weights.required} e desejáveis ${weights.desired}; grupos presentes são normalizados. Se a vaga não lista requisitos, as competências inferidas do texto usam 100% da pontuação.`,
    weights,
    profileIncomplete,
    profileNotice: profileIncomplete ? "O perfil não lista competências suficientes para calcular compatibilidade." : "",
    comparable,
    comparisonNotice: !comparable ? "A vaga não informa competências reconhecidas para comparação." : "",
    declaredSkills: profile.declared,
    demonstratedSkills: profile.demonstrated,
    evidenceNotice: "O perfil atual não possui campos estruturados de projetos ou experiência; estas competências vêm do portfólio e da bio declarados pelo candidato.",
    matchedSkills: unique([...matchedRequired, ...matchedDesired, ...matchedInferred]),
    requiredSkills: requirements.required,
    matchedRequired,
    missingRequired,
    desiredSkills: requirements.desired,
    matchedDesired,
    missingDesired,
    inferredSkills: requirements.inferredSkills,
    matchedInferred,
    missingInferred,
    unassessedRequirements: requirements.unassessed,
    notEvaluated,
    missingSkills,
    matchReasons,
    summary: profileIncomplete
      ? "Complete as competências do portfólio para receber uma comparação mais útil."
      : comparable
        ? `${matchedRequired.length} de ${requirements.required.length} requisitos obrigatórios identificados no perfil.`
        : "Adicione requisitos técnicos à vaga para habilitar a comparação.",
    courses,
  };
};

export const rankJobsByProfile = (user, jobs) => jobs
  .map((job) => ({ job, aiMatch: analyzeJobMatch(user, job) }))
  .sort((a, b) => {
    const aScore = a.aiMatch.score;
    const bScore = b.aiMatch.score;
    if (aScore === null && bScore === null) return new Date(b.job.createdAt || 0) - new Date(a.job.createdAt || 0);
    if (aScore === null) return 1;
    if (bScore === null) return -1;
    if (bScore !== aScore) return bScore - aScore;
    return new Date(b.job.createdAt || 0) - new Date(a.job.createdAt || 0);
  });

export const analyzeJobMatches = async (user, jobs) => jobs.map(({ job, aiMatch }) => ({
  jobId: String(job._id || job.id),
  ...aiMatch,
}));

export const MATCHING_CRITERIA = Object.freeze({
  requiredWeightEnv: "MATCH_WEIGHT_REQUIRED",
  desiredWeightEnv: "MATCH_WEIGHT_DESIRED",
  defaultRequiredWeight: 80,
  defaultDesiredWeight: 20,
  description: "A pontuação é a cobertura ponderada dos requisitos obrigatórios (80%) e desejáveis (20%), normalizada para os grupos presentes na vaga. Competências ausentes são lacunas não identificadas no perfil, não afirmações de desconhecimento.",
});
