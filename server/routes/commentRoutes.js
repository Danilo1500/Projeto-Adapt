import express from "express";
import { protect } from "../middlewares/auth.js";
import { addComment, deleteComment, getPostComments } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/add", protect, addComment);
commentRouter.get("/post/:postId", protect, getPostComments);
commentRouter.post("/delete", protect, deleteComment);

export default commentRouter;
