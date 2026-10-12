import { Router } from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { publicUser, skillScore } from "../utils.js";

const router = Router();
router.get("/", protect, async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const filter = { _id: { $ne: req.user._id } };
    if (q) filter.$or = [
      { name: { $regex: q, $options: "i" } }, { headline: { $regex: q, $options: "i" } },
      { skillsOffered: { $regex: q, $options: "i" } }, { skillsWanted: { $regex: q, $options: "i" } }
    ];
    const users = await User.find(filter).select("-passwordHash").limit(100);
    res.json({ users: users.map(u => ({ ...publicUser(u), match: skillScore(req.user, u) })).sort((a,b) => b.match.score - a.match.score) });
  } catch (e) { next(e); }
});
router.get("/:id", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "Member not found." });
    res.json({ user: publicUser(user), match: skillScore(req.user, user) });
  } catch (e) { next(e); }
});
router.put("/me", protect, async (req, res, next) => {
  try {
    const allowed = ["name","headline","location","bio","skillsOffered","skillsWanted","interests","availability"];
    for (const key of allowed) if (req.body[key] !== undefined) req.user[key] = req.body[key];
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (e) { next(e); }
});
export default router;
