import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teachSkill: { type: String, required: true, trim: true },
  learnSkill: { type: String, required: true, trim: true },
  message: { type: String, default: "", maxlength: 500 },
  status: { type: String, enum: ["pending", "accepted", "declined", "completed"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Exchange", exchangeSchema);
