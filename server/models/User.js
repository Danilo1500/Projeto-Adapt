import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  email: { type: String, required: true },
  full_name: { type: String, required: true },
  username: { type: String, unique: true },
  bio: { type: String, default: 'Hey there! I am using Adapt' },
  profile_picture: { type: String, default: '' },
  cover_photo: { type: String, default: '' },
  location: { type: String, default: '' },
  portfolio: {
    languages: [{ type: String, trim: true }],
    libraries: [{ type: String, trim: true }],
    frameworks: [{ type: String, trim: true }],
    resume: {
      url: { type: String, default: '' },
      fileName: { type: String, default: '' },
    },
  },
  learningProgress: [{
    courseId: { type: String, required: true },
    status: { type: String, enum: ['want', 'in_progress', 'completed'], default: 'want' },
    projectStatus: { type: String, enum: ['planned', 'in_progress', 'completed'], default: 'planned' },
    acquiredSkills: [{ type: String, trim: true }],
    updatedAt: { type: Date, default: Date.now },
  }],
  learningPreferences: {
    targetRole: { type: String, trim: true, maxlength: 100, default: '' },
    desiredSkills: [{ type: String, trim: true, maxlength: 60 }],
  },
  followers: [{ type: String, ref: 'User' }],
  following: [{ type: String, ref: 'User' }],
  connections: [{ type: String, ref: 'User' }],
}, { timestamps: true, minimize: false })

const User = mongoose.model('User', userSchema)

export default User
