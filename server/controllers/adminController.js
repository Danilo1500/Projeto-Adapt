import Post from "../models/Post.js";
import Story from "../models/Story.js";

const parsePagination = (req) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const skip = (page - 1) * limit;
  return { limit, page, skip };
};

export const getAllPosts = async (req, res) => {
  try {
    const { limit, page, skip } = parsePagination(req);
    const [posts, total] = await Promise.all([
      Post.find({})
        .populate("user")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(),
    ]);

    res.json({ success: true, posts, total, page, limit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const { limit, page, skip } = parsePagination(req);
    const [stories, total] = await Promise.all([
      Story.find({})
        .populate("user")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Story.countDocuments(),
    ]);

    res.json({ success: true, stories, total, page, limit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({ success: false, message: "postId is required" });
    }
    await Post.findByIdAndDelete(postId);
    res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeleteStory = async (req, res) => {
  try {
    const { storyId } = req.body;
    if (!storyId) {
      return res.status(400).json({ success: false, message: "storyId is required" });
    }
    await Story.findByIdAndDelete(storyId);
    res.json({ success: true, message: "Story deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
