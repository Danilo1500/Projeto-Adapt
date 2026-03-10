import express from "express";
import { protect } from "../middlewares/auth.js";
import { createJob, deleteJob, getMyJobs, updateJob, getPublicJobs } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.post("/create", protect, createJob);
jobRouter.post("/draft", protect, createJob);
jobRouter.post("/update", protect, updateJob);
jobRouter.get("/mine", protect, getMyJobs);
jobRouter.get("/public", getPublicJobs);
jobRouter.post("/delete", protect, deleteJob);

export default jobRouter;
