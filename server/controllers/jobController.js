import Job from "../models/Job.js";
import { inngest } from "../inngest/index.js";

const normalizeList = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => String(item).trim()).filter(Boolean);
};

const validatePublishedJob = (payload) => {
    const requiredFields = ["title", "company", "location", "contractType", "experienceLevel", "description"];
    const missing = requiredFields.filter((field) => !payload[field]);
    return missing;
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

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json({ success: true, jobs });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
