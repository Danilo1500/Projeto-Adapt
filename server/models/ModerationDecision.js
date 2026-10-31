import mongoose from "mongoose";

const moderationDecisionSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: "ModerationReport" },
  contentType: { type: String, enum: ["post", "story"], required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  contentOwner: { type: String, required: true },
  administrator: { type: String, required: true },
  action: {
    type: String,
    enum: ["approved", "removed", "hidden", "warning", "restriction", "suspended", "banned", "dismissed"],
    required: true,
  },
  justification: { type: String, required: true, maxlength: 3000 },
  durationMinutes: { type: Number, min: 0, default: 0 },
  appeal: {
    status: { type: String, enum: ["none", "pending", "accepted", "rejected"], default: "none" },
    explanation: { type: String, maxlength: 3000, default: "" },
    resolvedAt: Date,
    resolvedBy: String,
  },
}, { timestamps: true });

const ModerationDecision = mongoose.model("ModerationDecision", moderationDecisionSchema);
export default ModerationDecision;
