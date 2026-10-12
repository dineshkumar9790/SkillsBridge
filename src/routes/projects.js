import { Router } from "express";
import Project from "../models/Project.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/", protect, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.q) filter.$or = [
      { title: { $regex: req.query.q, $options: "i" } },
      { description: { $regex: req.query.q, $options: "i" } },
      { skills: { $regex: req.query.q, $options: "i" } }
    ];
    const projects = await Project.find(filter).populate("createdBy", "name headline").populate("applicants", "name").sort({ createdAt: -1 }).limit(100);
    res.json({ projects });
  } catch (e) { next(e); }
});
router.get("/mine", protect, async (req, res, next) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (e) { next(e); }
});
router.post("/", protect, async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim() || !description?.trim()) return res.status(400).json({ message: "Title and description are required." });
    const project = await Project.create({ ...req.body, title: title.trim(), description: description.trim(), createdBy: req.user._id });
    res.status(201).json({ project });
  } catch (e) { next(e); }
});
router.post("/:id/apply", protect, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found." });
    if (String(project.createdBy) === String(req.user._id)) return res.status(400).json({ message: "You cannot apply to your own project." });
    if (project.status !== "open") return res.status(400).json({ message: "This project is no longer open." });
    if (!project.applicants.some(id => String(id) === String(req.user._id))) project.applicants.push(req.user._id);
    await project.save();
    res.json({ message: "Application submitted!", project });
  } catch (e) { next(e); }
});
export default router;
