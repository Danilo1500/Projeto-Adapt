import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, default: "", trim: true },
    year: { type: String, default: "", trim: true },
    url: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    clerkOrganizationId: { type: String, required: true, unique: true, index: true },
    ownerId: { type: String, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, default: "", trim: true },
    industry: { type: String, default: "", trim: true },
    size: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    cover: { type: String, default: "", trim: true },
    logo: { type: String, default: "", trim: true },
    technologies: [{ type: String, trim: true }],
    frameworks: [{ type: String, trim: true }],
    certifications: [certificationSchema],
    lastSyncOperationId: { type: String, default: "", select: false },
    lastSyncRequestedAt: { type: Date, default: null, select: false },
    // Mixed during the migration window: legacy string IDs and structured
    // { userId, role, status, joinedAt } memberships coexist safely.
    members: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true, minimize: false, optimisticConcurrency: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;
