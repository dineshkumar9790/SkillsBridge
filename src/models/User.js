import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  headline: { type: String, default: "Curious learner", maxlength: 140 },
  location: { type: String, default: "" },
  bio: { type: String, default: "", maxlength: 800 },
  avatarColor: { type: String, default: "#dce9ff" },
  skillsOffered: [{ type: String, trim: true }],
  skillsWanted: [{ type: String, trim: true }],
  interests: [{ type: String, trim: true }],
  availability: { type: String, default: "Flexible" },
  credits: { type: Number, default: 3, min: 0 },
  badges: [{ type: String }],
  role: { type: String, enum: ["member", "admin"], default: "member" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
