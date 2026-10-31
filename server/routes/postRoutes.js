import express from 'express';
import { upload } from '../configs/multer.js';
import { protect, requireContentPostingAccess } from '../middlewares/auth.js';
import { addPost, getFeedPosts, likePost, deletePost } from '../controllers/postController.js';

const postRouter = express.Router();

postRouter.post('/add', upload.fields([
  { name: 'images', maxCount: 4 },
  { name: 'video', maxCount: 1 }
]), protect, requireContentPostingAccess, addPost)
postRouter.get('/feed', protect, getFeedPosts)
postRouter.post('/like', protect, likePost)
postRouter.post('/delete', protect, deletePost)

export default postRouter
