import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { inngest } from "../inngest/index.js";

// Add Comment
export const addComment = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId, content } = req.body;

        if (!content || !content.trim()) {
            return res.json({ success: false, message: "Comment content is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        const comment = await Comment.create({
            post: postId,
            user: userId,
            content: content.trim(),
        });

        post.comments_count = (post.comments_count || 0) + 1;
        await post.save();

        await inngest.send({
            name: "app/comment.created",
            data: { commentId: comment._id.toString() },
        });

        const commentWithUser = await Comment.findById(comment._id).populate("user");

        res.json({ success: true, comment: commentWithUser });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get Post Comments
export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId })
            .populate("user")
            .sort({ createdAt: -1 });

        res.json({ success: true, comments });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Comment
export const deleteComment = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { commentId } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.json({ success: false, message: "Comment not found" });
        }

        if (comment.user !== userId) {
            return res.json({ success: false, message: "Not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);

        const post = await Post.findById(comment.post);
        if (post) {
            post.comments_count = Math.max((post.comments_count || 1) - 1, 0);
            await post.save();
        }

        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
