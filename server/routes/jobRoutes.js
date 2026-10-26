import express from "express";
import { protect } from "../middlewares/auth.js";
import { createJob, deleteJob, getMyJobs, updateJob, getPublicJobs, getRecommendedJobs, getJobMatchDetails, analyzeSubmittedJob } from "../controllers/jobController.js";

const jobRouter = express.Router();
const withJobStatus = (status) => (req, _res, next) => {
    req.body = { ...(req.body && typeof req.body === "object" ? req.body : {}), status };
    next();
};

jobRouter.post("/create", protect, withJobStatus("published"), createJob);
jobRouter.post("/draft", protect, withJobStatus("draft"), createJob);
jobRouter.post("/update", protect, updateJob);
jobRouter.get("/mine", protect, getMyJobs);
jobRouter.get("/recommended", protect, getRecommendedJobs);
jobRouter.post("/analyze", protect, analyzeSubmittedJob);
jobRouter.get("/:jobId/match", protect, getJobMatchDetails);
jobRouter.get("/public", getPublicJobs);
jobRouter.post("/delete", protect, deleteJob);

export default jobRouter;
