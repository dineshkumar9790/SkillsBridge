import { Router } from "express";
import Exchange from "../models/Exchange.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.post("/", protect, async (req, res, next) => {
  try {
    const { recipient, teachSkill, learnSkill, message = "" } = req.body;
    if (!recipient || !teachSkill?.trim() || !learnSkill?.trim()) return res.status(400).json({ message: "Recipient and both skills are required." });
    if (String(recipient) === String(req.user._id)) return res.status(400).json({ message: "You cannot exchange skills with yourself." });
    if (!(await User.exists({ _id: recipient }))) return res.status(404).json({ message: "Member not found." });
    const exchange = await Exchange.create({ requester: req.user._id, recipient, teachSkill: teachSkill.trim(), learnSkill: learnSkill.trim(), message: message.slice(0,500) });
    res.status(201).json({ exchange });
  } catch (e) { next(e); }
});
router.get("/mine", protect, async (req, res, next) => {
  try {
    const exchanges = await Exchange.find({ $or: [{ requester: req.user._id }, { recipient: req.user._id }] })
      .populate("requester", "name email").populate("recipient", "name email").sort({ createdAt: -1 });
    res.json({ exchanges });
  } catch (e) { next(e); }
});
router.patch("/:id/status", protect, async (req, res, next) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    if (!exchange) return res.status(404).json({ message: "Exchange request not found." });
    if (String(exchange.recipient) !== String(req.user._id)) return res.status(403).json({ message: "Only the recipient can respond to this request." });
    if (!["accepted","declined","completed"].includes(req.body.status)) return res.status(400).json({ message: "Invalid status." });
    exchange.status = req.body.status;
    await exchange.save();
    if (req.body.status === "completed") {
      await User.updateOne({ _id: exchange.requester }, { $inc: { credits: 1 }, $addToSet: { badges: "Skill Sharer" } });
      await User.updateOne({ _id: exchange.recipient }, { $inc: { credits: 1 }, $addToSet: { badges: "Skill Sharer" } });
    }
    res.json({ exchange });
  } catch (e) { next(e); }
});
export default router;
