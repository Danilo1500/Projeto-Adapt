import ModerationReport from "../models/ModerationReport.js";
import Post from "../models/Post.js";
import Story from "../models/Story.js";
import { deleteImageKitFile } from "./mediaLifecycle.js";

export const cleanupExpiredEvidence = async (limit = 100) => {
  const expired = await ModerationReport.find({
    retentionExpiresAt: { $lte: new Date() },
    cleanupStatus: { $in: ["retained", "failed"] },
  }).sort({ retentionExpiresAt: 1 }).limit(limit);

  let cleaned = 0;
  for (const report of expired) {
    const claimed = await ModerationReport.findOneAndUpdate(
      { _id: report._id, cleanupStatus: report.cleanupStatus },
      { $set: { cleanupStatus: "processing" }, $inc: { cleanupAttempts: 1 } },
      { new: true }
    );
    if (!claimed) continue;
    try {
      if (claimed.retainedMediaFileId) {
        const fileId = claimed.retainedMediaFileId;
        const [postReference, storyReference] = await Promise.all([
          Post.exists({ $or: [{ image_file_ids: fileId }, { video_file_id: fileId }] }),
          Story.exists({ media_file_id: fileId }),
        ]);
        if (!postReference && !storyReference) await deleteImageKitFile(fileId);
      }
      claimed.contentSnapshot = "";
      claimed.mediaSnapshot = "";
      claimed.retainedMediaFileId = "";
      claimed.description = "";
      claimed.cleanupError = "";
      claimed.cleanupStatus = "anonymized";
      await claimed.save();
      cleaned += 1;
    } catch (error) {
      await ModerationReport.updateOne(
        { _id: claimed._id },
        { $set: { cleanupStatus: "failed", cleanupError: String(error.message || error).slice(0, 500) } }
      );
    }
  }
  return { candidates: expired.length, cleaned };
};
