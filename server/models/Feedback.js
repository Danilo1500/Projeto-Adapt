import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: String, ref: "User", required: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String, default: "" },
  message: { type: String, required: true, maxlength: 5000 },
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
