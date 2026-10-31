import ModerationReport, { MODERATION_REASONS } from "../models/ModerationReport.js";
import ModerationDecision from "../models/ModerationDecision.js";
import Post from "../models/Post.js";
import Story from "../models/Story.js";
import { deleteImageKitFile, deletePostMedia } from "../services/mediaLifecycle.js";

const findContent = (type, id) => (type === "post" ? Post.findById(id) : Story.findById(id));

export const createReport = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { contentType, contentId, reason, description = "" } = req.body;
    if (!["post", "story"].includes(contentType) || !contentId) {
      return res.status(400).json({ success: false, message: "Conteúdo inválido" });
    }
    if (!MODERATION_REASONS.includes(reason)) {
      return res.status(400).json({ success: false, message: "Motivo inválido" });
    }
    const content = await findContent(contentType, contentId);
    if (!content) return res.status(404).json({ success: false, message: "Conteúdo não encontrado" });
    if (String(content.user) === userId) {
      return res.status(403).json({ success: false, message: "Você não pode denunciar seu próprio conteúdo" });
    }
    const existing = await ModerationReport.findOne({ reporter: userId, contentType, contentId });
    if (existing) return res.status(409).json({ success: false, message: "Você já denunciou este conteúdo" });

    const report = await ModerationReport.create({
      reporter: userId,
      contentType,
      contentId,
      contentOwner: String(content.user),
      reason,
      description,
      contentSnapshot: content.content || "",
      mediaSnapshot: content.image_urls?.[0] || content.video_url || content.media_url || "",
      retainedMediaFileId: content.image_file_ids?.[0] || content.video_file_id || content.media_file_id || "",
    });
    const safeReport = report.toObject();
    delete safeReport.reporter;
    delete safeReport.contentOwner;
    return res.status(201).json({ success: true, report: safeReport });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "Denúncia já enviada" });
    console.error(error);
    return res.status(500).json({ success: false, message: "Não foi possível enviar a denúncia" });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const { userId } = req.auth();
    const reports = await ModerationReport.find({ reporter: userId })
      .select("contentType status reason createdAt updatedAt")
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Não foi possível carregar denúncias" });
  }
};

export const getModerationQueue = async (req, res) => {
  const { status, contentType, reason } = req.query;
  const filter = {};
  if (status && ["pending", "in_review", "resolved", "dismissed", "appealed"].includes(status)) filter.status = status;
  if (contentType && ["post", "story"].includes(contentType)) filter.contentType = contentType;
  if (reason) filter.reason = reason;

  const reports = await ModerationReport.find(filter).sort({ createdAt: -1 }).lean();
  const decisions = await ModerationDecision.find({ report: { $in: reports.map((report) => report._id) } }).sort({ createdAt: -1 }).lean();
  const decisionsByReport = new Map();
  decisions.forEach((decision) => {
    if (!decisionsByReport.has(String(decision.report))) decisionsByReport.set(String(decision.report), []);
    decisionsByReport.get(String(decision.report)).push(decision);
  });
  res.json({
    success: true,
    reports: reports.map((report) => ({
      ...report,
      history: decisionsByReport.get(String(report._id)) || [],
      reportCount: reports.filter((item) => String(item.contentId) === String(report.contentId) && item.contentType === report.contentType).length,
    })),
  });
};

export const decideReport = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { reportId, action, justification, durationMinutes = 0 } = req.body;
    if (!justification?.trim()) return res.status(400).json({ success: false, message: "Justificativa obrigatória" });
    const allowed = ["approved", "removed", "hidden", "warning", "restriction", "suspended", "banned", "dismissed"];
    if (!allowed.includes(action)) return res.status(400).json({ success: false, message: "Ação inválida" });

    const report = await ModerationReport.findById(reportId);
    if (!report) return res.status(404).json({ success: false, message: "Denúncia não encontrada" });
    const content = await findContent(report.contentType, report.contentId);
    if (String(report.contentOwner) === userId) {
      return res.status(403).json({ success: false, message: "Não é possível moderar conteúdo próprio" });
    }

    if (action === "removed" || action === "hidden" || action === "approved") {
      if (!["post", "story"].includes(report.contentType)) return res.status(400).json({ success: false, message: "Conteúdo inválido" });
      const Model = report.contentType === "post" ? Post : Story;
      const status = action === "approved" ? "approved" : action === "hidden" ? "hidden" : "removed";
      await Model.findByIdAndUpdate(report.contentId, { moderation_status: status });
      if (action === "removed") {
        await (report.contentType === "post"
          ? deletePostMedia(content)
          : deleteImageKitFile(content.media_file_id));
      }
    }

    const decision = await ModerationDecision.create({
      report: report._id,
      contentType: report.contentType,
      contentId: report.contentId,
      contentOwner: report.contentOwner,
      administrator: userId,
      action,
      justification: justification.trim(),
      durationMinutes: ["restriction", "suspended"].includes(action) ? Number(durationMinutes) : 0,
    });
    await ModerationReport.updateMany({ contentType: report.contentType, contentId: report.contentId }, {
      status: action === "dismissed" ? "dismissed" : "resolved",
    });
    res.json({ success: true, decision });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Não foi possível registrar a decisão" });
  }
};

export const appealDecision = async (req, res) => {
  const { userId } = req.auth();
  const { decisionId, explanation } = req.body;
  if (!explanation?.trim()) return res.status(400).json({ success: false, message: "Explique o recurso" });
  const decision = await ModerationDecision.findOneAndUpdate(
    { _id: decisionId, contentOwner: userId, "appeal.status": "none" },
    { $set: { appeal: { status: "pending", explanation: explanation.trim() } } },
    { new: true }
  );
  if (!decision) return res.status(409).json({ success: false, message: "Decisão não encontrada ou recurso já enviado" });
  await ModerationReport.updateOne({ _id: decision.report }, { status: "appealed" });
  res.json({ success: true, decision });
};
