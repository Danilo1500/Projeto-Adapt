import express from "express";
import { upload } from "../configs/multer.js";
import { protect, requireContentPostingAccess } from "../middlewares/auth.js";
import { addUserStory, getStories } from "../controllers/storyController.js";

const storyRouter = express.Router()

storyRouter.post('/create', upload.single('media'), protect, requireContentPostingAccess, addUserStory)
storyRouter.get('/get', protect, getStories)

export default storyRouter