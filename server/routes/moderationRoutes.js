import express from "express";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";
import { createReport, getMyReports, getModerationQueue, decideReport, appealDecision } from "../controllers/moderationController.js";

const moderationRouter = express.Router();

moderationRouter.post("/report", protect, createReport);
moderationRouter.get("/mine", protect, getMyReports);
moderationRouter.get("/admin/queue", protect, requireAdmin, getModerationQueue);
moderationRouter.post("/admin/decision", protect, requireAdmin, decideReport);
moderationRouter.post("/appeal", protect, appealDecision);

export default moderationRouter;
