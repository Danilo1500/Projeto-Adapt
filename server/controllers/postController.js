import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { removeUploadedFiles, validateVideoFile, VIDEO_LIMITS } from "../services/mediaValidation.js";
import { analyzeContent } from "../services/contentModeration.js";
import { deletePostMedia } from "../services/mediaLifecycle.js";

// Add Post
export const addPost = async (req, res) => {
    const images = req.files?.images || [];
    const videos = req.files?.video || [];
    const video = videos[0];
    try {
        const { userId } = req.auth();
        const { content, post_type } = req.body;
        const text = String(content || "").trim();
        if (!text && !images.length && !video) throw new Error("A publicação não pode estar vazia.");
        const analysis = await analyzeContent(text);
        const allowedTypes = ['text', 'image', 'text_with_image', 'video', 'text_with_video'];
        if (!allowedTypes.includes(post_type)) throw new Error("Tipo de publicação inválido.");
        if (images.length && video) throw new Error("Publicação não pode combinar vídeo e imagens.");
        if ((post_type.includes('video')) && !video) throw new Error("Vídeo não enviado.");
        if ((post_type.includes('image')) && !images.length) throw new Error("Imagem não enviada.");
        if (video) validateVideoFile(video, VIDEO_LIMITS.postBytes);

        let image_urls = [];
        let video_url = '';
        let image_file_ids = [];
        let video_file_id = '';

        if (images.length) {
            image_urls = await Promise.all(
                images.map(async (image) => {
                    if (!image.mimetype?.startsWith('image/')) throw new Error("Formato de imagem inválido.");
                    const fileBuffer = fs.readFileSync(image.path);
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: "posts",
                    });
                    image_file_ids.push(response.fileId);
                    return imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: 'auto' },
                            { format: 'webp' },
                            { width: '1280' }
                        ]
                    });
                })
            );
        }

        if (video) {
            const response = await imagekit.upload({
                file: fs.readFileSync(video.path),
                fileName: video.originalname,
                folder: "posts/videos",
                useUniqueFileName: true,
            });
            video_url = response.url;
            video_file_id = response.fileId;
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            video_url,
            image_file_ids,
            video_file_id,
            video_mime_type: video?.mimetype || '',
            post_type,
            moderation_status: analysis.status === "flagged" ? "flagged" : "approved",
            moderation_analysis: analysis
        });
        res.json({ success: true, message: "Post created successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    } finally {
        removeUploadedFiles([...images, ...videos]);
    }
}

// Get Posts
export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId)

        // User connections and followings
        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({ user: { $in: userIds }, moderation_status: { $nin: ['flagged', 'removed', 'hidden', 'rejected'] } }).populate('user').sort({ createdAt: -1 });

        res.json({ success: true, posts });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Like Post
export const likePost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId } = req.body;

        const post = await Post.findById(postId);

        if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            res.json({ success: true, message: "Post unliked" });
        }else{
            post.likes_count.push(userId)
            await post.save()
            res.json({ success: true, message: "Post liked" });
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete Post
export const deletePost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        if (post.user !== userId) {
            return res.json({ success: false, message: "Not authorized to delete this post" });
        }

        await deletePostMedia(post);
        await Post.findByIdAndDelete(postId);
        return res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
