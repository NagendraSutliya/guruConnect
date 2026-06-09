const express = require("express");
const router = express.Router();
const PublicLink = require("../../models/PublicLink");
const Feedback = require("../../models/Feedback");
const Teacher = require("../../models/Teacher");
const Institute = require("../../models/Institute");

// Get institute details - PUBLIC
router.get("/institute/:id", async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id).select(
      "instituteName instituteType"
    );
    if (!institute) return res.status(404).json({ msg: "Institute not found" });
    res.json({ data: institute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load institute" });
  }
});

// Get teachers using public link - PUBLIC
router.get("/teachers/:code", async (req, res) => {
  try {
    const link = await PublicLink.findOne({ linkCode: req.params.code });
    if (!link) return res.status(404).json("Invalid link");

    const teachers = await Teacher.find({
      instituteId: link.instituteId,
    }).select("_id name");

    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to load teachers");
  }
});

router.post("/feedback/:code", async (req, res) => {
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
      studentName: req.body.studentName || undefined, // optional
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
