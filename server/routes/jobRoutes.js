import express from "express";
import { protect } from "../middlewares/auth.js";
import { createJob, deleteJob, getMyJobs } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.post("/create", protect, createJob);
jobRouter.get("/mine", protect, getMyJobs);
jobRouter.post("/delete", protect, deleteJob);

export default jobRouter;
