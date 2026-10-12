import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Project from "./models/Project.js";
dotenv.config();

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillbridge";
await mongoose.connect(mongoUri);
const demoEmail = "demo@skillbridge.local";
let demo = await User.findOne({ email: demoEmail });
if (!demo) {
    demo = await User.create({
        name: "Alex Morgan",
        email: demoEmail,
        passwordHash: await bcrypt.hash("SkillBridge123!", 12),
        headline: "Full-stack learner • Helping people get started with web development",
        location: "Chennai, Tamil Nadu",
        bio: "I enjoy building useful products and exchanging skills with other learners.",
        skillsOffered: ["React", "HTML/CSS", "JavaScript"],
        skillsWanted: ["UI/UX Design", "Public Speaking"],
        interests: ["Open source", "Education", "Community projects"],
        availability: "Weekends",
        credits: 12,
        badges: ["Early Contributor", "Skill Sharer"]
    });
    console.log("Created demo account.");
}
const people = [
    { name: "Priya Raman", email: "priya@skillbridge.local", headline: "UI/UX designer who loves teaching beginners", location: "Chennai", skillsOffered: ["UI/UX Design", "Figma", "Graphic Design"], skillsWanted: ["React", "JavaScript"], interests: ["Design systems", "Accessibility"], availability: "Evenings", credits: 8 },
    { name: "Arun Kumar", email: "arun@skillbridge.local", headline: "Python developer and student mentor", location: "Cuddalore", skillsOffered: ["Python", "Data Analysis", "Math Tutoring"], skillsWanted: ["Graphic Design", "Video Editing"], interests: ["Education", "AI"], availability: "Weekends", credits: 6 },
    { name: "Meena S", email: "meena@skillbridge.local", headline: "Community volunteer and communication coach", location: "Vriddhachalam", skillsOffered: ["Public Speaking", "English", "Content Writing"], skillsWanted: ["Web Development", "Photography"], interests: ["Community service", "Youth mentoring"], availability: "Flexible", credits: 10 },
    { name: "Karthik Raj", email: "karthik@skillbridge.local", headline: "Video editor helping student creators", location: "Puducherry", skillsOffered: ["Video Editing", "Photography", "Canva"], skillsWanted: ["Python", "Data Analysis"], interests: ["Creative media", "Student clubs"], availability: "Evenings", credits: 4 }
];
for (const p of people) {
    if (!(await User.exists({ email: p.email }))) {
        await User.create({...p, passwordHash: await bcrypt.hash("SkillBridge123!", 12), bio: "Open to learning and collaborating on practical projects." });
    }
}
const existing = await Project.countDocuments();
if (!existing) {
    const priya = await User.findOne({ email: "priya@skillbridge.local" });
    const arun = await User.findOne({ email: "arun@skillbridge.local" });
    await Project.create([
        { title: "Build a website for a local learning club", description: "Help a volunteer learning club create a simple mobile-friendly site with upcoming events, contact details, and learning resources.", skills: ["React", "CSS", "Accessibility"], organization: "Community Learning Club", location: "Remote", commitment: "3 hours/week", impact: "Help learners discover free workshops", createdBy: demo._id },
        { title: "Design social media graphics for a community campaign", description: "Create a small set of accessible social media graphics and a reusable template for a youth-led community campaign.", skills: ["Graphic Design", "Canva", "Content Writing"], organization: "Youth Impact Collective", location: "Chennai / Remote", commitment: "2 hours/week", impact: "Help a community campaign reach more people", createdBy: priya._id },
        { title: "Create a beginner Python study group", description: "Prepare three beginner-friendly exercises and support learners during a weekly online practice session.", skills: ["Python", "Teaching", "Communication"], organization: "Open Learning Circle", location: "Remote", commitment: "2 hours/week", impact: "Make programming more approachable", createdBy: arun._id }
    ]);
}
console.log("Seed complete. Demo login: demo@skillbridge.local / SkillBridge123!");
await mongoose.disconnect();