import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        user: { type: String, ref: "User", required: true },
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String, required: true },
        contractType: { type: String, required: true },
        experienceLevel: { type: String, required: true },
        salaryMin: { type: String, default: "" },
        salaryMax: { type: String, default: "" },
        currency: { type: String, default: "R$" },
        isRemote: { type: Boolean, default: false },
        isUrgent: { type: Boolean, default: false },
        description: { type: String, required: true },
        requirements: [{ type: String }],
        benefits: [{ type: String }],
    },
    { timestamps: true, minimize: false }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
