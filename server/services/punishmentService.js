import ModerationDecision from "../models/ModerationDecision.js";

export const hasActivePunishmentAt = (decision, now = new Date()) => {
  if (!decision) return false;
  if (decision.action === "banned") return true;
  if (!["restriction", "suspended"].includes(decision.action)) return false;
  const durationMs = Math.max(0, Number(decision.durationMinutes || 0)) * 60 * 1000;
  return durationMs > 0 && new Date(decision.createdAt).getTime() + durationMs > new Date(now).getTime();
};

export const getActivePunishment = async (userId) => {
  const decisions = await ModerationDecision.find({
    contentOwner: String(userId),
    action: { $in: ["restriction", "suspended", "banned"] },
  }).sort({ createdAt: -1 });

  const now = new Date();
  for (const decision of decisions) {
    if (hasActivePunishmentAt(decision, now)) return decision;
  }
  return null;
};

export const getPunishmentStatus = async (userId) => {
  const punishment = await getActivePunishment(userId);
  if (!punishment) return { active: false };
  const durationMs = Number(punishment.durationMinutes || 0) * 60 * 1000;
  return {
    active: true,
    action: punishment.action,
    expiresAt: punishment.action === "banned" ? null : new Date(new Date(punishment.createdAt).getTime() + durationMs),
  };
};
