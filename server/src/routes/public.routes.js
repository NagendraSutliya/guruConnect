const express = require("express");
const router = express.Router();
const PublicLink = require("../models/PublicLink");
const Feedback = require("../models/Feedback");

// router.post("/feedback/:code", async (req, res) => {
//   const link = await PublicLink.findOne({ linkCode: req.params.code });
//   if (!link) return res.status(404).json("Invalid link");

//   await Feedback.create({
//     instituteId: link.instituteId,
//     teacherId: link.teacherId,
//     classOrBatch: req.body.classOrBatch,
//     teacherName: req.body.teacherName,
//     mood: req.body.mood,
//     message: req.body.message,
//   });

//   res.json("Submitted");
// });

router.post("feedback/:code", async (req, res) => {
  try {
    const { teacherId, classOrBatch, mood, message } = req.body;

    const link = await PublicLink.findOne({ linkCode: req.params.code });
    if (!link) return res.status(404).json("Invalid link");

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json("Teacher not found");

    await Feedback.create({
      instituteId: link.instituteId,
      teacherId: teacher._id,
      teacherName: teacher.name,
      classOrBatch,
      mood,
      message,
    });

    res.json({ msg: "Feedback submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to submit feedback");
  }
});

router.get("/teachers/:code", async (req, res) => {
  const link = await PublicLink.findOne({ linkCode: req.params.code });
  if (!link) return res.status(404).json("Invalid link");

  const teachers = await Teacher.find({ instituteId: link.instituteId }).select(
    "_id name"
  );

  res.json(teachers);
});

module.exports = router;
