const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Feedback = require("../../models/Feedback");
const Teacher = require("../../models/Teacher");
const { requireTeacher } = require("../../middleware/auth");

const router = express.Router();

// Teacher Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json("Missing credentials");

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(401).json("Invalid credentials");

    if (teacher.status === "inactive") {
      return res.status(403).json({
        message: "Your account has been deactivated. Contact admin.",
      });
    }

    const ok = await bcrypt.compare(password, teacher.password);
    if (!ok) return res.status(401).json("Invalid credentials");

    const token = jwt.sign(
      { id: teacher._id, role: "teacher", instituteId: teacher.instituteId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      role: "teacher",
      name: teacher.name,
      email: teacher.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Teacher login failes");
  }
});

// Teacher Dashboard Feedback
router.get("/feedback", requireTeacher, async (req, res) => {
  try {
    const list = await Feedback.find({ teacherId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to load feedback");
  }
});

// Teacher STATS (for dashboard)
router.get("/stats", requireTeacher, async (req, res) => {
  try {
    const total = await Feedback.countDocuments({ teacherId: req.user.id });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await Feedback.countDocuments({
      teacherId: req.user.id,
      createdAt: { $gte: today },
    });

    res.json({ total, today: todayCount });
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to load stats");
  }
});

// Teacher Dashboard Overview
router.get("/overview", requireTeacher, async (req, res) => {
  const total = await Feedback.countDocuments({ teacherId: req.user.id });

  const positive = await Feedback.countDocuments({
    teacherId: req.user.id,
    mood: "positive",
  });

  const neutral = await Feedback.countDocuments({
    teacherId: req.user.id,
    mood: "neutral",
  });

  const negative = await Feedback.countDocuments({
    teacherId: req.user.id,
    mood: "negative",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCount = await Feedback.countDocuments({
    teacherId: req.user.id,
    createdAt: { $gte: today },
  });

  const recent = await Feedback.find({ teacherId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(4);

  res.json({
    total,
    positive,
    neutral,
    negative,
    today: todayCount,
    recent,
  });
});

// All feedback
router.get("/feedback/all", requireTeacher, async (req, res) => {
  const list = await Feedback.find({ teacherId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(list);
});

module.exports = router;
