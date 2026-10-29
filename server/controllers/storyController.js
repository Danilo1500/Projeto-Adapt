import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Story from '../models/Story.js';
import User from '../models/User.js';
import { inngest } from '../inngest/index.js';
import { removeUploadedFiles, validateVideoFile, VIDEO_LIMITS } from '../services/mediaValidation.js';

// Add User Story
export const addUserStory = async (req, res) => {
    const media = req.file;
    try {
        const { userId } = req.auth();
        const { content, media_type, background_color } = req.body;
        let media_url = '';

        if (!['text', 'image', 'video'].includes(media_type)) {
            throw new Error('Tipo de mídia inválido.');
        }
        if (media_type === 'video') validateVideoFile(media, VIDEO_LIMITS.storyBytes);

        if ((media_type === 'image' || media_type === 'video') && !media) {
            throw new Error('Mídia não enviada.');
        }

        if (media_type === 'image' && !media.mimetype?.startsWith('image/')) {
            throw new Error('Formato de imagem inválido.');
        }

        if (media_type === 'image' || media_type === 'video') {
            const fileBuffer = fs.readFileSync(media.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
                folder: media_type === 'video' ? 'stories/videos' : 'stories/images',
            });
            media_url = response.url;
        }

        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            media_mime_type: media?.mimetype || undefined,
            background_color
        });

        await inngest.send({
            name: 'app/story.delete',
            data: { storyId: story._id }
        });

        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(error.status || 400).json({ success: false, message: error.message });
    } finally {
        removeUploadedFiles([media]);
    }
}

// Get User Stories
export const getStories = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId)

        // User connections and followings
        const userIds = [userId, ...user.connections, ...user.following]

        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const stories = await Story.find({
             user: { $in: userIds },
             createdAt: { $gte: cutoff }
        }).populate('user').sort({ createdAt: -1 });
        
        res.json({ success: true, stories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
