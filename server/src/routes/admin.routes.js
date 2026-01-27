const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Feedback = require("../../models/Feedback");
const { requireAdmin } = require("../../middleware/auth");
const Teacher = require("../../models/Teacher");
const PublicLink = require("../../models/PublicLink");
const Institute = require("../../models/Institute");

// Get all teachers of this institute
router.get("/teachers", requireAdmin, async (req, res) => {
  const teachers = await Teacher.find({ instituteId: req.user.id }).select(
    "-password"
  );
  // .sort({ createdAt: -1 });
  res.json(teachers);
});

// Dashboard Stats for all cards
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const instituteId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const institute = await Institute.findById(instituteId).select("plan");

    // Parallel DB querieswant to fetch it from db only i have updated admin_routes.js
    const [
      teachers,
      students,
      totalFeedback,
      feedbackToday,
      avgRating,
      newTeachersToday,
    ] = await Promise.all([
      Teacher.countDocuments({ instituteId }),
      // If you have Student model
      // Student.countDocuments({ instituteId }),
      0, // TEMP: replace when Student model exists
      Feedback.countDocuments({ instituteId }),
      Feedback.countDocuments({
        instituteId,
        createdAt: { $gte: today },
      }),
      Feedback.aggregate([
        { $match: { instituteId } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
      Teacher.countDocuments({
        instituteId,
        createdAt: { $gte: today },
      }),
    ]);
    res.json({
      teachers,
      students,
      totalFeedback,
      feedbackToday,
      avgRating: avgRating[0]?.avg || 0,
      newTeachersToday,
      plan: institute?.plan || "free",
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

/* Create Teacher */
router.post("/teacher", requireAdmin, async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    // console.log("req.user:", req.user);

    const teacher = await Teacher.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
      instituteId: req.user.id,
      role: "teacher",
    });
    res.json(teacher);
  } catch (err) {
    console.error("Failed to create teacher:", err);
    res.status(500).json("Teacher creation failed");
  }
});

// Soft Delete Teacher (Deactivate)
// router.delete("/teacher/:id", requireAdmin, async (req, res) => {
//   try {
//     const teacherId = req.params.id;

//     const teacher = await Teacher.findOne({
//       _id: teacherId,
//       instituteId: req.user.id,
//     });

//     if (!teacher) {
//       return res.status(404).json("Teacher not found");
//     }

//     if ((teacher.status = "inactive")) {
//       return res.status(400).json({ message: "Teacher already inactive" });
//     }

//     teacher.status === "inactive";
//     await teacher.save();

//     res.json({ message: "Teacher Deactivated Successfully" });
//   } catch (err) {
//     console.error("Soft delete failed", err);
//     res.status(500).json({ message: "Failed to deactivate teacher" });
//   }
// });

router.patch("/teacher/:id/deactivate", requireAdmin, async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, instituteId: req.user.id },
      { status: "inactive" },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ message: "Teacher deactivated", teacher });
  } catch (err) {
    res.status(500).json({ message: "Failed to deactivate teacher" });
  }
});

/* Get all feedback of logged-in institute */
router.get("/feedback", requireAdmin, async (req, res) => {
  const data = await Feedback.find({ instituteId: req.user.id })
    .populate("teacherId", "name")
    .sort({ createdAt: -1 });
  res.json(data);
});

// Delete Feedback
router.delete("/feedback/:id", requireAdmin, async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

// Get existing public link (if any)
router.get("/link", requireAdmin, async (req, res) => {
  const link = await PublicLink.findOne({ instituteId: req.user.id });
  res.json(link); // returns null if none
});

// Create public link (only when admin clicks Generate)
router.post("/link", requireAdmin, async (req, res) => {
  const existing = await PublicLink.findOne({ instituteId: req.user.id });
  if (existing) return res.json(existing);

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const link = await PublicLink.create({
    instituteId: req.user.id,
    linkCode: code,
  });

  res.json(link);
});

module.exports = router;
