import Job from "../models/Job.js";
import Company from "../models/Company.js";
import mongoose from "mongoose";
import { analyzeJobMatch, MATCHING_CRITERIA, rankJobsByProfile } from "../services/aiJobMatcher.js";

const FIELD_LIMITS = { title: 160, location: 160, contractType: 80, experienceLevel: 80, description: 12000 };
const normalizeText = (value) => typeof value === "string" ? value.trim() : "";
const normalizeList = (value, field, errors) => {
    if (value === undefined) return [];
    if (!Array.isArray(value)) { errors[field] = "Informe uma lista válida."; return []; }
    if (value.length > 40 || value.some((item) => typeof item !== "string")) errors[field] = "Use até 40 itens de texto.";
    const normalized = value.slice(0, 40).map((item) => typeof item === "string" ? item.trim() : "").filter(Boolean);
    const unique = [...new Map(normalized.map((item) => [item.toLowerCase(), item])).values()];
    if (unique.some((item) => item.length > 500)) errors[field] = "Use itens de no máximo 500 caracteres.";
    return unique;
};

const parseSalary = (value, field, errors) => {
    if (value === undefined || value === null || value === "") return "";
    const input = String(value).trim();
    if (!/^\d{1,12}(?:[.,]\d{1,2})?$/.test(input)) {
        errors[field] = "Informe um valor numérico válido ou deixe em branco.";
        return "";
    }
    return input.replace(",", ".");
};

export const validateAndNormalizeJob = (input = {}, { allowDraft = false, companyName = "", fallbackStatus = "published" } = {}) => {
    const errors = {};
    for (const field of Object.keys(FIELD_LIMITS)) {
        if (input[field] !== undefined && typeof input[field] !== "string") errors[field] = "Informe um texto válido.";
    }
    if (input.status !== undefined && !["draft", "published"].includes(input.status)) errors.status = "Selecione um status válido.";
    if (input.currency !== undefined && !["R$", "US$", "€"].includes(input.currency)) errors.currency = "Selecione uma moeda válida.";
    for (const field of ["isRemote", "isUrgent"]) {
        if (input[field] !== undefined && typeof input[field] !== "boolean") errors[field] = "Informe uma opção válida.";
    }
    const job = {
        title: normalizeText(input.title),
        company: companyName,
        location: normalizeText(input.location),
        contractType: normalizeText(input.contractType),
        experienceLevel: normalizeText(input.experienceLevel),
        salaryMin: parseSalary(input.salaryMin, "salaryMin", errors),
        salaryMax: parseSalary(input.salaryMax, "salaryMax", errors),
        currency: ["R$", "US$", "€"].includes(input.currency) ? input.currency : "R$",
        isRemote: input.workMode ? input.workMode === "remote" : input.isRemote === true,
        workMode: ["onsite", "hybrid", "remote"].includes(input.workMode) ? input.workMode : (input.isRemote === true ? "remote" : "onsite"),
        isUrgent: input.isUrgent === true,
        description: normalizeText(input.description),
        requirements: normalizeList(input.requirements, "requirements", errors),
        desiredRequirements: normalizeList(input.desiredRequirements, "desiredRequirements", errors),
        benefits: normalizeList(input.benefits, "benefits", errors),
        status: (input.status ?? fallbackStatus) === "draft" && allowDraft ? "draft" : "published",
    };
    if (input.workMode !== undefined && !["onsite", "hybrid", "remote"].includes(input.workMode)) {
        errors.workMode = "Selecione uma modalidade válida.";
    }

    for (const [field, max] of Object.entries(FIELD_LIMITS)) {
        if (job[field].length > max) errors[field] = `Use no máximo ${max} caracteres.`;
    }
    if (!allowDraft || job.status === "published") {
        for (const field of ["title", "location", "contractType", "experienceLevel", "description"]) {
            if (!job[field]) errors[field] = "Este campo é obrigatório.";
        }
        if (!job.requirements.length) errors.requirements = "Informe ao menos um requisito obrigatório.";
    }
    if (job.salaryMin && job.salaryMax && Number(job.salaryMin) > Number(job.salaryMax)) {
        errors.salaryMax = "O salário máximo deve ser igual ou maior que o mínimo.";
    }
    return { job, errors };
};

const sendValidationError = (res, errors) => res.status(400).json({
    success: false,
    message: "Revise os campos destacados.",
    errors,
});

const getOwnedCompany = (userId) => Company.findOne({ ownerId: userId }).sort({ createdAt: 1 });

const REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs";
const REMOTIVE_CACHE_TTL_MS = 10 * 60 * 1000;
const remotiveCache = new Map();

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

const toPublicJob = (job) => {
    const { _id, title, company, location, contractType, experienceLevel, salaryMin, salaryMax,
        currency, isRemote, workMode, isUrgent, description, requirements, desiredRequirements,
        benefits, status, createdAt, updatedAt } = job;
    return { id: job.id || (_id ? String(_id) : undefined), _id, title, company, location, contractType, experienceLevel, salaryMin, salaryMax,
        currency, isRemote, workMode, isUrgent, description, requirements, desiredRequirements,
        benefits, status, createdAt, updatedAt, salary: job.salary, externalId: job.externalId,
        externalUrl: job.externalUrl, sourceLabel: job.sourceLabel, sourceType: job.sourceType,
        companyLogo: job.companyLogo, category: job.category };
};

const fetchRemotiveJobs = async (searchText = "", limit = 12) => {
    const cacheKey = `${searchText.toLowerCase()}::${limit}`;
    const cached = remotiveCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.jobs;
    if (cached) remotiveCache.delete(cacheKey);

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (searchText) {
        params.set("search", searchText);
    }

    const response = await fetch(`${REMOTIVE_API_URL}?${params.toString()}`, {
        signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
        throw new Error(`Remotive request failed with status ${response.status}`);
    }

    const data = await response.json();
    const jobs = Array.isArray(data.jobs) ? data.jobs.map(mapRemotiveJob) : [];
    if (remotiveCache.size >= 100) remotiveCache.delete(remotiveCache.keys().next().value);
    remotiveCache.set(cacheKey, { jobs, expiresAt: Date.now() + REMOTIVE_CACHE_TTL_MS });
    return jobs;
};

// Persist the job before acknowledging success so the management list can immediately reload it.
export const createJob = async (req, res) => {
    try {
        const { userId } = req.auth();
        const company = await getOwnedCompany(userId);
        if (!company) return res.status(403).json({ success: false, message: "Cadastre uma empresa antes de criar vagas." });
        const { job, errors } = validateAndNormalizeJob(req.body, { allowDraft: true, companyName: company.name });
        if (Object.keys(errors).length) return sendValidationError(res, errors);
        const created = await Job.create({ ...job, user: userId, companyId: company._id });
        return res.status(201).json({
            success: true,
            message: job.status === "draft" ? "Rascunho salvo." : "Vaga criada com sucesso.",
            job: created,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Não foi possível salvar a vaga." });
    }
};

// Get Jobs of current user
export const getMyJobs = async (req, res) => {
    try {
        const { userId } = req.auth();
        const jobs = await Job.find({ user: userId }).sort({ createdAt: -1 });
        return res.json({ success: true, jobs });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Não foi possível carregar suas vagas." });
    }
};

// Delete Job
export const deleteJob = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { jobId } = req.body || {};
        if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ success: false, message: "Identificador de vaga inválido." });
        const deleted = await Job.findOneAndDelete({ _id: jobId, user: userId });
        if (!deleted) return res.status(404).json({ success: false, message: "Vaga não encontrada ou sem permissão." });
        return res.json({ success: true, message: "Vaga excluída com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Não foi possível excluir a vaga." });
    }
};

// Update Job (draft or publish)
export const updateJob = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { jobId } = req.body || {};
        if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ success: false, message: "Identificador de vaga inválido." });
        const job = await Job.findOne({ _id: jobId, user: userId });
        if (!job) return res.status(404).json({ success: false, message: "Vaga não encontrada ou sem permissão." });
        const company = job.companyId ? await Company.findOne({ _id: job.companyId, ownerId: userId }) : await getOwnedCompany(userId);
        if (!company) return res.status(403).json({ success: false, message: "Você não tem autorização para gerenciar esta empresa." });
        const { job: normalizedJob, errors } = validateAndNormalizeJob(req.body, { allowDraft: true, companyName: company.name, fallbackStatus: job.status });
        if (Object.keys(errors).length) return sendValidationError(res, errors);
        Object.assign(job, normalizedJob, { companyId: company._id });
        await job.save();
        return res.json({ success: true, message: normalizedJob.status === "draft" ? "Rascunho atualizado." : "Vaga publicada.", job });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Não foi possível atualizar a vaga." });
    }
};

// Get Public Jobs (published only)
export const getPublicJobs = async (req, res) => {
    try {
        const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
        const query = { status: "published" };

        if (q) {
            const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            query.$or = [
                { title: regex },
                { company: regex },
                { location: regex },
                { description: regex },
            ];
        }

        const localJobs = await Job.find(query).sort({ createdAt: -1 });
        const mappedLocalJobs = localJobs.map((job) => ({
            ...toPublicJob(job.toObject()),
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

        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(25, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
        const maxCandidateJobs = Math.min(2000, Math.max(100, Number.parseInt(process.env.MATCH_MAX_CANDIDATE_JOBS, 10) || 500));
        const [jobCandidates, externalJobs] = await Promise.all([
            Job.find({ status: "published" }).sort({ createdAt: -1 }).limit(maxCandidateJobs + 1).lean(),
            fetchRemotiveJobs(searchText, 12).catch((externalError) => {
                console.error("Failed to load Remotive jobs for recommendations:", externalError.message);
                return [];
            }),
        ]);
        const candidatePoolTruncated = jobCandidates.length > maxCandidateJobs;
        const localJobs = jobCandidates.slice(0, maxCandidateJobs);
        const mappedLocalJobs = localJobs.map((job) => ({
            ...job,
            sourceLabel: "Adapt",
            sourceType: "internal",
            externalUrl: "",
        }));

        const rankedJobs = rankJobsByProfile(user, [...mappedLocalJobs, ...externalJobs]);
        const start = (page - 1) * limit;
        const pageJobs = rankedJobs.slice(start, start + limit).map(({ job, aiMatch }) => ({
            ...toPublicJob(job),
            aiMatch: { jobId: String(job._id || job.id), ...aiMatch },
        }));

        res.json({
            success: true,
            jobs: pageJobs,
            page,
            limit,
            total: rankedJobs.length,
            hasMore: start + limit < rankedJobs.length,
            candidatePoolTruncated,
            candidatePoolLimit: maxCandidateJobs,
            usedAI: false,
            matchingMethod: "normalized-skills-rules",
            matchingCriteria: MATCHING_CRITERIA,
        });
    } catch (error) {
        console.error("Failed to generate job recommendations:", error.message);
        res.status(500).json({ success: false, message: "Job recommendations are temporarily unavailable." });
    }
};

export const getJobMatchDetails = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.jobId)) {
            return res.status(404).json({ success: false, message: "Vaga não encontrada ou indisponível." });
        }
        const job = await Job.findOne({ _id: req.params.jobId, status: "published" }).lean();
        if (!job) return res.status(404).json({ success: false, message: "Vaga não encontrada ou indisponível." });
        res.json({ success: true, match: analyzeJobMatch(req.dbUser, job), matchingCriteria: MATCHING_CRITERIA });
    } catch (error) {
        console.error("Failed to analyze job match:", error.message);
        res.status(500).json({ success: false, message: "Não foi possível analisar esta vaga." });
    }
};

export const analyzeSubmittedJob = async (req, res) => {
    try {
        const { title, company = "", location = "", contractType = "", experienceLevel = "", description = "", requirements = [], desiredRequirements = [], category = "", isRemote = false, workMode } = req.body || {};
        if (typeof title !== "string" || !title.trim() || title.length > 160) {
            return res.status(400).json({ success: false, message: "Informe um título de vaga válido." });
        }
        if (typeof description !== "string" || description.length > 12000) {
            return res.status(400).json({ success: false, message: "A descrição da vaga é inválida ou muito longa." });
        }
        if (!Array.isArray(requirements) || requirements.length > 40 || requirements.some((item) => typeof item !== "string" || item.length > 500)) {
            return res.status(400).json({ success: false, message: "A lista de requisitos da vaga é inválida." });
        }
        if (!Array.isArray(desiredRequirements) || desiredRequirements.length > 40 || desiredRequirements.some((item) => typeof item !== "string" || item.length > 500)) {
            return res.status(400).json({ success: false, message: "A lista de requisitos desejáveis é inválida." });
        }

        const match = analyzeJobMatch(req.dbUser, {
            title: title.trim(),
            company: typeof company === "string" ? company.slice(0, 160) : "",
            location: typeof location === "string" ? location.slice(0, 160) : "",
            contractType: typeof contractType === "string" ? contractType.slice(0, 100) : "",
            experienceLevel: typeof experienceLevel === "string" ? experienceLevel.slice(0, 100) : "",
            description,
            requirements: requirements.map((item) => item.trim()).filter(Boolean),
            desiredRequirements: desiredRequirements.map((item) => item.trim()).filter(Boolean),
            category: typeof category === "string" ? category.slice(0, 100) : "",
            isRemote: workMode ? workMode === "remote" : Boolean(isRemote),
        });
        res.json({ success: true, match, matchingCriteria: MATCHING_CRITERIA });
    } catch (error) {
        console.error("Failed to analyze submitted job:", error.message);
        res.status(500).json({ success: false, message: "Não foi possível analisar esta vaga." });
    }
};
