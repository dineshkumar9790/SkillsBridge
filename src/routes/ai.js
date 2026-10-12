import { Router } from "express";
import { protect } from "../middleware/auth.js";

const router = Router();
router.post("/learning-path", protect, async (req, res) => {
  const goal = String(req.body.goal || "").trim().slice(0, 160);
  if (!goal) return res.status(400).json({ message: "Please enter a learning goal." });

  if (process.env.AI_API_KEY) {
    try {
      const response = await fetch(`${(process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/,"")}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.AI_API_KEY}` },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: "Create a practical beginner-friendly skill roadmap. Return JSON with title, estimatedWeeks, steps (array of objects with title, description, project), and suggestedSkills (array). Do not claim credentials." },
            { role: "user", content: `Learning goal: ${goal}. User skills: ${(req.user.skillsOffered || []).join(", ") || "not provided"}.` }
          ],
          response_format: { type: "json_object" }
        })
      });
      if (response.ok) {
        const data = await response.json();
        return res.json({ roadmap: JSON.parse(data.choices[0].message.content), source: "ai" });
      }
    } catch (error) { console.error("AI provider error:", error.message); }
  }

  const safeGoal = goal.replace(/[<>]/g, "");
  res.json({
    source: "starter-template",
    roadmap: {
      title: `Learning path: ${safeGoal}`,
      estimatedWeeks: 6,
      steps: [
        { title: "Understand the foundations", description: "Learn core concepts and vocabulary. Take notes and explain them in your own words.", project: "Create a one-page concept summary." },
        { title: "Practice small exercises", description: "Practice for 20–30 minutes a day and review mistakes.", project: "Complete five small exercises." },
        { title: "Build a mini project", description: "Apply the concepts to a realistic use case.", project: "Publish a small working demo." },
        { title: "Get feedback", description: "Ask a mentor to review your work and choose two improvements.", project: "Submit a revised version with a short reflection." }
      ],
      suggestedSkills: ["Foundations", "Problem solving", "Project building", "Communication"]
    }
  });
});
export default router;
