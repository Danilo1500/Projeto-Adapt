import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    user: {type: String, ref: 'User', required: true},
    content: {type: String },
    media_url: { type: String },
    media_file_id: { type: String, default: '' },
    media_type: {type: String, enum: ['text', 'image', 'video']},
    media_mime_type: { type: String },
    views_count: [{type: String, ref: 'User'}],
    background_color: { type: String },
    moderation_status: { type: String, enum: ['pending', 'approved', 'flagged', 'rejected', 'removed', 'hidden'], default: 'approved', index: true },
    moderation_analysis: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true, minimize: false })

// Auto-delete stories after 24 hours (MongoDB TTL index)
storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 })

const Story = mongoose.model('Story', storySchema)

export default Story;
