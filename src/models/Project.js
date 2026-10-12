import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 1500 },
  skills: [{ type: String, trim: true }],
  organization: { type: String, default: "Community project" },
  location: { type: String, default: "Remote" },
  commitment: { type: String, default: "2–4 hours/week" },
  impact: { type: String, default: "Build something useful" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["open", "in-progress", "completed"], default: "open" }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
