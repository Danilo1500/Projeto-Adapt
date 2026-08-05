import Job from "../models/Job.js";
import { inngest } from "../inngest/index.js";
import { analyzeJobMatches, rankJobsByProfile } from "../services/aiJobMatcher.js";

const normalizeList = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => String(item).trim()).filter(Boolean);
};

const validatePublishedJob = (payload) => {
    const requiredFields = ["title", "company", "location", "contractType", "experienceLevel", "description"];
    const missing = requiredFields.filter((field) => !payload[field]);
    return missing;
};

const REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs";

const stripHtml = (value = "") =>
    String(value)
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const mapRemotiveJob = (job) => ({
    id: `remotive-${job.id}`,
    externalId: String(job.id),
    title: job.title,
    company: job.company_name,
    location: job.candidate_required_location || "Remoto",
    contractType: job.job_type ? String(job.job_type).replaceAll("_", " ") : "Remoto",
    experienceLevel: "Nao informado",
    salaryMin: "",
    salaryMax: "",
    salary: job.salary || "",
    currency: "US$",
    isRemote: true,
    isUrgent: false,
    description: stripHtml(job.description),
    requirements: [],
    benefits: [],
    status: "published",
    createdAt: job.publication_date,
    externalUrl: job.url,
    sourceLabel: "Remotive",
    sourceType: "external",
    companyLogo: job.company_logo || "",
    category: job.category || "",
});

const fetchRemotiveJobs = async (searchText = "", limit = 12) => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (searchText) {
        params.set("search", searchText);
    }

    const response = await fetch(`${REMOTIVE_API_URL}?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Remotive request failed with status ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.jobs) ? data.jobs.map(mapRemotiveJob) : [];
};

// Create Job (via Inngest)
export const createJob = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {
            title,
            company,
            location,
            contractType,
            experienceLevel,
            salaryMin = "",
            salaryMax = "",
            currency = "R$",
            isRemote = false,
            isUrgent = false,
            description,
            requirements = [],
            benefits = [],
            status = "published",
        } = req.body;

        const normalizedStatus = status === "draft" ? "draft" : "published";
        if (normalizedStatus === "published") {
            const missing = validatePublishedJob({ title, company, location, contractType, experienceLevel, description });
            if (missing.length) {
                return res.json({ success: false, message: "Campos obrigatorios ausentes." });
            }
        }

        await inngest.send({
            name: "app/job.create",
            data: {
                userId,
                job: {
                    title,
                    company,
                    location,
                    contractType,
                    experienceLevel,
                    salaryMin,
                    salaryMax,
                    currency,
                    isRemote,
                    isUrgent,
                    description,
                    requirements: normalizeList(requirements),
                    benefits: normalizeList(benefits),
                    status: normalizedStatus,
                },
            },
        });

        res.json({ success: true, message: normalizedStatus === "draft" ? "Rascunho salvo." : "Vaga criada com sucesso." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Jobs of current user
export const getMyJobs = async (req, res) => {
    try {
        const { userId } = req.auth();
        const jobs = await Job.find({ user: userId }).sort({ createdAt: -1 });
        res.json({ success: true, jobs });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Job
export const deleteJob = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { jobId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.json({ success: false, message: "Vaga nao encontrada." });
        }

        if (job.user !== userId) {
            return res.json({ success: false, message: "Sem permissao para excluir esta vaga." });
        }

        await Job.findByIdAndDelete(jobId);
        res.json({ success: true, message: "Vaga excluida com sucesso." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Job (draft or publish)
export const updateJob = async (req, res) => {
    try {
        const { userId } = req.auth();
        const {
            jobId,
            title,
            company,
            location,
            contractType,
            experienceLevel,
            salaryMin = "",
            salaryMax = "",
            currency = "R$",
            isRemote = false,
            isUrgent = false,
            description,
            requirements = [],
            benefits = [],
            status = "draft",
        } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.json({ success: false, message: "Vaga nao encontrada." });
        }

        if (job.user !== userId) {
            return res.json({ success: false, message: "Sem permissao para atualizar esta vaga." });
        }

        const normalizedStatus = status === "published" ? "published" : "draft";
        if (normalizedStatus === "published") {
            const missing = validatePublishedJob({ title, company, location, contractType, experienceLevel, description });
            if (missing.length) {
                return res.json({ success: false, message: "Campos obrigatorios ausentes." });
            }
        }

        job.title = title ?? job.title;
        job.company = company ?? job.company;
        job.location = location ?? job.location;
        job.contractType = contractType ?? job.contractType;
        job.experienceLevel = experienceLevel ?? job.experienceLevel;
        job.salaryMin = salaryMin;
        job.salaryMax = salaryMax;
        job.currency = currency;
        job.isRemote = isRemote;
        job.isUrgent = isUrgent;
        job.description = description ?? job.description;
        job.requirements = normalizeList(requirements);
        job.benefits = normalizeList(benefits);
        job.status = normalizedStatus;

        await job.save();
        res.json({ success: true, message: normalizedStatus === "draft" ? "Rascunho atualizado." : "Vaga publicada." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Public Jobs (published only)
export const getPublicJobs = async (req, res) => {
    try {
        const { q = "" } = req.query;
        const query = { status: "published" };

        if (q) {
            const regex = new RegExp(q, "i");
            query.$or = [
                { title: regex },
                { company: regex },
                { location: regex },
                { description: regex },
            ];
        }

        const localJobs = await Job.find(query).sort({ createdAt: -1 });
        const mappedLocalJobs = localJobs.map((job) => ({
            ...job.toObject(),
            sourceLabel: "Adapt",
            sourceType: "internal",
            externalUrl: "",
        }));

        let externalJobs = [];
        try {
            externalJobs = await fetchRemotiveJobs(q, mappedLocalJobs.length > 0 ? 8 : 12);
        } catch (externalError) {
            console.error("Failed to load Remotive jobs:", externalError.message);
        }

        res.json({
            success: true,
            jobs: [...mappedLocalJobs, ...externalJobs],
            sources: {
                internal: mappedLocalJobs.length,
                external: externalJobs.length,
            },
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get AI recommended jobs for current user
export const getRecommendedJobs = async (req, res) => {
    try {
        const user = req.dbUser;
        const portfolio = user?.portfolio || {};
        const skills = [
            ...(portfolio.languages || []),
            ...(portfolio.libraries || []),
            ...(portfolio.frameworks || []),
        ].filter(Boolean);
        const searchText = skills.slice(0, 4).join(" ");

        const localJobs = await Job.find({ status: "published" }).sort({ createdAt: -1 }).limit(30);
        const mappedLocalJobs = localJobs.map((job) => ({
            ...job.toObject(),
            sourceLabel: "Adapt",
            sourceType: "internal",
            externalUrl: "",
        }));

        let externalJobs = [];
        try {
            externalJobs = await fetchRemotiveJobs(searchText, 12);
        } catch (externalError) {
            console.error("Failed to load Remotive jobs for recommendations:", externalError.message);
        }

        const rankedJobs = rankJobsByProfile(user, [...mappedLocalJobs, ...externalJobs], 8);
        let recommendations = [];
        try {
            recommendations = await analyzeJobMatches(user, rankedJobs);
        } catch (aiError) {
            console.error("Failed to analyze job recommendations with AI:", aiError.message);
            recommendations = rankedJobs.map(({ job, heuristicScore, matchedSkills }) => ({
                jobId: String(job._id || job.id),
                score: Math.max(35, heuristicScore),
                matchReasons: matchedSkills.length
                    ? matchedSkills.slice(0, 3).map((skill) => `A vaga menciona ${skill}, que esta no portfolio.`)
                    : ["A vaga tem sinais de compatibilidade com a bio e os dados do perfil."],
                missingSkills: [],
                summary: "Recomendacao gerada por compatibilidade tecnica basica.",
            }));
        }
        const recommendationByJobId = new Map(recommendations.map((item) => [String(item.jobId), item]));
        const jobs = rankedJobs
            .map(({ job, heuristicScore, matchedSkills }) => {
                const jobId = String(job._id || job.id);
                const aiMatch = recommendationByJobId.get(jobId) || {
                    jobId,
                    score: Math.max(35, heuristicScore),
                    matchReasons: matchedSkills.map((skill) => `A vaga menciona ${skill}.`),
                    missingSkills: [],
                    summary: "Recomendacao gerada por compatibilidade tecnica.",
                };

                return {
                    ...job,
                    aiMatch,
                };
            })
            .sort((a, b) => (b.aiMatch?.score || 0) - (a.aiMatch?.score || 0));

        res.json({
            success: true,
            jobs,
            usedAI: Boolean(process.env.OPENAI_API_KEY),
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
