import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        user: { type: String, ref: "User", required: true },
        // Optional for legacy job documents; new jobs are tied to the verified company.
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", index: true },
        title: { type: String },
        company: { type: String },
        location: { type: String },
        contractType: { type: String },
        experienceLevel: { type: String },
        salaryMin: { type: String, default: "" },
        salaryMax: { type: String, default: "" },
        currency: { type: String, default: "R$" },
        isRemote: { type: Boolean, default: false },
        workMode: { type: String, enum: ["onsite", "hybrid", "remote"], default: undefined },
        isUrgent: { type: Boolean, default: false },
        description: { type: String },
        requirements: [{ type: String }],
        desiredRequirements: [{ type: String }],
        benefits: [{ type: String }],
        status: { type: String, enum: ["draft", "published"], default: "published" },
    },
    { timestamps: true, minimize: false }
);

jobSchema.index({ status: 1, createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;
