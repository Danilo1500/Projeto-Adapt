import Job from "../models/Job.js";
import { inngest } from "../inngest/index.js";

const normalizeList = (value) => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => String(item).trim()).filter(Boolean);
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
        } = req.body;

        if (!title || !company || !location || !contractType || !experienceLevel || !description) {
            return res.json({ success: false, message: "Campos obrigatorios ausentes." });
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
                },
            },
        });

        res.json({ success: true, message: "Vaga criada com sucesso." });
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
