import { Router } from "express";
import { protect } from "../middleware/auth.js";
import Project from "../models/Project.js";
import Exchange from "../models/Exchange.js";
import User from "../models/User.js";

const router = Router();
router.get("/", protect, async (req, res, next) => {
  try {
    const [members, projects, myProjects, exchanges, pending] = await Promise.all([
      User.countDocuments({ _id: { $ne: req.user._id } }),
      Project.countDocuments({ status: "open" }),
      Project.countDocuments({ createdBy: req.user._id }),
      Exchange.countDocuments({ $or: [{ requester: req.user._id }, { recipient: req.user._id }] }),
      Exchange.countDocuments({ recipient: req.user._id, status: "pending" })
    ]);
    res.json({ stats: { members, projects, myProjects, exchanges, pending, credits: req.user.credits, skills: (req.user.skillsOffered || []).length } });
  } catch (e) { next(e); }
});
export default router;
