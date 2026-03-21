import express from "express";
import { protect } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/admin.js";
import {
  getAllPosts,
  getAllStories,
  adminDeletePost,
  adminDeleteStory,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/posts", protect, requireAdmin, getAllPosts);
adminRouter.get("/stories", protect, requireAdmin, getAllStories);
adminRouter.post("/post/delete", protect, requireAdmin, adminDeletePost);
adminRouter.post("/story/delete", protect, requireAdmin, adminDeleteStory);

export default adminRouter;
