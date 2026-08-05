import express from "express";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";
import {
  getAllPosts,
  getAllStories,
  getAllMessages,
  getAllJobs,
  adminDeletePost,
  adminDeleteStory,
  adminDeleteMessage,
  adminDeleteJob,
  adminUpdatePost,
  adminUpdateStory,
  adminUpdateMessage,
  adminUpdateJob,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/posts", protect, requireAdmin, getAllPosts);
adminRouter.get("/stories", protect, requireAdmin, getAllStories);
adminRouter.get("/messages", protect, requireAdmin, getAllMessages);
adminRouter.get("/jobs", protect, requireAdmin, getAllJobs);
adminRouter.post("/post/delete", protect, requireAdmin, adminDeletePost);
adminRouter.post("/story/delete", protect, requireAdmin, adminDeleteStory);
adminRouter.post("/message/delete", protect, requireAdmin, adminDeleteMessage);
adminRouter.post("/job/delete", protect, requireAdmin, adminDeleteJob);
adminRouter.post("/post/update", protect, requireAdmin, adminUpdatePost);
adminRouter.post("/story/update", protect, requireAdmin, adminUpdateStory);
adminRouter.post("/message/update", protect, requireAdmin, adminUpdateMessage);
adminRouter.post("/job/update", protect, requireAdmin, adminUpdateJob);

export default adminRouter;
