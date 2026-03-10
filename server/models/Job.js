import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        user: { type: String, ref: "User", required: true },
        title: { type: String },
        company: { type: String },
        location: { type: String },
        contractType: { type: String },
        experienceLevel: { type: String },
        salaryMin: { type: String, default: "" },
        salaryMax: { type: String, default: "" },
        currency: { type: String, default: "R$" },
        isRemote: { type: Boolean, default: false },
        isUrgent: { type: Boolean, default: false },
        description: { type: String },
        requirements: [{ type: String }],
        benefits: [{ type: String }],
        status: { type: String, enum: ["draft", "published"], default: "published" },
    },
    { timestamps: true, minimize: false }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
