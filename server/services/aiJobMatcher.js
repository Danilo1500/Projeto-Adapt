const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const unique = (items) => Array.from(new Set(items.map((item) => String(item).trim()).filter(Boolean)));

const getProfileSkills = (user) => {
  const portfolio = user?.portfolio || {};
  return unique([
    ...(portfolio.languages || []),
    ...(portfolio.libraries || []),
    ...(portfolio.frameworks || []),
  ]);
};

const jobToSearchText = (job) =>
  normalizeText([
    job.title,
    job.company,
    job.location,
    job.contractType,
    job.experienceLevel,
    job.description,
    ...(job.requirements || []),
    ...(job.benefits || []),
    job.category,
  ].join(" "));

export const buildProfileSummary = (user) => {
  const portfolio = user?.portfolio || {};
  const resume = portfolio.resume?.fileName ? `Curriculo enviado: ${portfolio.resume.fileName}` : "Curriculo nao enviado";

  return [
    `Nome: ${user?.full_name || "Nao informado"}`,
    `Bio: ${user?.bio || "Nao informado"}`,
    `Localizacao: ${user?.location || "Nao informada"}`,
    `Linguagens: ${(portfolio.languages || []).join(", ") || "Nao informado"}`,
    `Bibliotecas: ${(portfolio.libraries || []).join(", ") || "Nao informado"}`,
    `Frameworks: ${(portfolio.frameworks || []).join(", ") || "Nao informado"}`,
    resume,
  ].join("\n");
};

export const rankJobsByProfile = (user, jobs, limit = 8) => {
  const skills = getProfileSkills(user);
  const normalizedSkills = skills.map(normalizeText).filter(Boolean);
  const profileText = normalizeText([user?.bio, user?.location, ...skills].join(" "));

  return jobs
    .map((job) => {
      const jobText = jobToSearchText(job);
      const matchedSkills = skills.filter((skill, index) => {
        const normalizedSkill = normalizedSkills[index];
        return normalizedSkill && jobText.includes(normalizedSkill);
      });

      const titleBonus = normalizedSkills.some((skill) => normalizeText(job.title).includes(skill)) ? 15 : 0;
      const remoteBonus = job.isRemote ? 6 : 0;
      const locationBonus = user?.location && jobText.includes(normalizeText(user.location)) ? 8 : 0;
      const profileWords = profileText.split(" ").filter((word) => word.length > 3);
      const wordHits = profileWords.filter((word) => jobText.includes(word)).length;
      const score = Math.min(100, matchedSkills.length * 18 + titleBonus + remoteBonus + locationBonus + Math.min(wordHits, 8));

      return {
        job,
        heuristicScore: score,
        matchedSkills,
      };
    })
    .sort((a, b) => b.heuristicScore - a.heuristicScore)
    .slice(0, limit);
};

const fallbackRecommendations = (rankedJobs) =>
  rankedJobs.map(({ job, heuristicScore, matchedSkills }) => ({
    jobId: String(job._id || job.id),
    score: Math.max(35, heuristicScore),
    matchReasons: matchedSkills.length
      ? matchedSkills.slice(0, 3).map((skill) => `A vaga menciona ${skill}, que esta no portfolio.`)
      : ["A vaga tem sinais de compatibilidade com a bio e os dados do perfil."],
    missingSkills: [],
    summary: "Recomendacao gerada por compatibilidade tecnica basica.",
  }));

const parseOpenAIResponse = (response) => {
  const text =
    response.output_text ||
    response.output
      ?.flatMap((item) => item.content || [])
      ?.find((content) => content.type === "output_text")?.text;

  if (!text) {
    throw new Error("OpenAI response did not include output text.");
  }

  return JSON.parse(text);
};

export const analyzeJobMatches = async (user, rankedJobs) => {
  if (!process.env.OPENAI_API_KEY || rankedJobs.length === 0) {
    return fallbackRecommendations(rankedJobs);
  }

  const profileSummary = buildProfileSummary(user);
  const jobs = rankedJobs.map(({ job, heuristicScore, matchedSkills }) => ({
    jobId: String(job._id || job.id),
    title: job.title,
    company: job.company,
    location: job.location,
    contractType: job.contractType,
    experienceLevel: job.experienceLevel,
    isRemote: Boolean(job.isRemote),
    description: String(job.description || "").slice(0, 1200),
    requirements: job.requirements || [],
    heuristicScore,
    matchedSkills,
  }));

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_RECOMMENDATION_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Voce recomenda vagas com base no perfil tecnico. Seja direto, honesto e nao invente experiencias. Responda somente no schema solicitado.",
        },
        {
          role: "user",
          content: JSON.stringify({
            profile: profileSummary,
            jobs,
            instructions:
              "Retorne recomendacoes ordenadas por score. Use score 0-100. matchReasons e missingSkills devem ser curtos, em portugues.",
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "job_recommendations",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    jobId: { type: "string" },
                    score: { type: "integer", minimum: 0, maximum: 100 },
                    matchReasons: { type: "array", items: { type: "string" } },
                    missingSkills: { type: "array", items: { type: "string" } },
                    summary: { type: "string" },
                  },
                  required: ["jobId", "score", "matchReasons", "missingSkills", "summary"],
                },
              },
            },
            required: ["recommendations"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return parseOpenAIResponse(data).recommendations || fallbackRecommendations(rankedJobs);
};
