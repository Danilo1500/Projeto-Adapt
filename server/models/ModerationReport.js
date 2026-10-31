import mongoose from "mongoose";

const MODERATION_REASONS = [
  "Assédio ou intimidação",
  "Discurso de ódio",
  "Conteúdo sexual explícito",
  "Violência ou ameaças",
  "Spam",
  "Golpe ou fraude",
  "Informações pessoais expostas",
  "Vaga de emprego falsa",
  "Conteúdo enganoso",
  "Outro",
];

const moderationReportSchema = new mongoose.Schema({
  reporter: { type: String, required: true, index: true },
  contentType: { type: String, enum: ["post", "story"], required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  contentOwner: { type: String, required: true },
  reason: { type: String, enum: MODERATION_REASONS, required: true },
  description: { type: String, maxlength: 1000, default: "" },
  status: {
    type: String,
    enum: ["pending", "in_review", "resolved", "dismissed", "appealed"],
    default: "pending",
    index: true,
  },
  contentSnapshot: { type: String, default: "", maxlength: 10000 },
  mediaSnapshot: { type: String, default: "" },
  retainedMediaFileId: { type: String, default: "" },
  retentionExpiresAt: { type: Date, default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), index: true },
  cleanupStatus: { type: String, enum: ["retained", "processing", "anonymized", "failed"], default: "retained", index: true },
  cleanupAttempts: { type: Number, default: 0, min: 0 },
  cleanupError: { type: String, default: "" },
}, { timestamps: true });

moderationReportSchema.index({ reporter: 1, contentType: 1, contentId: 1 }, { unique: true });

const ModerationReport = mongoose.model("ModerationReport", moderationReportSchema);

export { MODERATION_REASONS };
export default ModerationReport;
