import Post from "../models/Post.js";
import Story from "../models/Story.js";
import Message from "../models/Message.js";
import Job from "../models/Job.js";

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

export const getAllMessages = async (req, res) => {
  try {
    const { limit, page, skip } = parsePagination(req);
    const [messages, total] = await Promise.all([
      Message.find({})
        .populate("from_user_id to_user_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments(),
    ]);

    res.json({ success: true, messages, total, page, limit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const { limit, page, skip } = parsePagination(req);
    const [jobs, total] = await Promise.all([
      Job.find({})
        .populate("user")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(),
    ]);

    res.json({ success: true, jobs, total, page, limit });
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

export const adminDeleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    if (!messageId) {
      return res.status(400).json({ success: false, message: "messageId is required" });
    }
    await Message.findByIdAndDelete(messageId);
    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeleteJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required" });
    }
    await Job.findByIdAndDelete(jobId);
    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdatePost = async (req, res) => {
  try {
    const { postId, content } = req.body;
    if (!postId) {
      return res.status(400).json({ success: false, message: "postId is required" });
    }
    const post = await Post.findByIdAndUpdate(
      postId,
      { content: content ?? "" },
      { new: true }
    ).populate("user");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateStory = async (req, res) => {
  try {
    const { storyId, content, background_color } = req.body;
    if (!storyId) {
      return res.status(400).json({ success: false, message: "storyId is required" });
    }
    const story = await Story.findByIdAndUpdate(
      storyId,
      {
        ...(content !== undefined ? { content } : {}),
        ...(background_color !== undefined ? { background_color } : {}),
      },
      { new: true }
    ).populate("user");
    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }
    res.json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateMessage = async (req, res) => {
  try {
    const { messageId, text, seen } = req.body;
    if (!messageId) {
      return res.status(400).json({ success: false, message: "messageId is required" });
    }
    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        ...(text !== undefined ? { text } : {}),
        ...(seen !== undefined ? { seen } : {}),
      },
      { new: true }
    ).populate("from_user_id to_user_id");
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateJob = async (req, res) => {
  try {
    const { jobId, ...payload } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required" });
    }

    const editableFields = [
      "title",
      "company",
      "location",
      "contractType",
      "experienceLevel",
      "salaryMin",
      "salaryMax",
      "currency",
      "isRemote",
      "isUrgent",
      "description",
      "requirements",
      "benefits",
      "status",
    ];
    const update = {};
    editableFields.forEach((field) => {
      if (payload[field] !== undefined) update[field] = payload[field];
    });

    const job = await Job.findByIdAndUpdate(jobId, update, { new: true }).populate("user");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
