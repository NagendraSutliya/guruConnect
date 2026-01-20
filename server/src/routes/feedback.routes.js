const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Institute = require("../models/Institute");

router.post("/", async (req, res) => {
  const inst = await Institute.findOne({ instituteCode: req.body.code });
  if (!inst) return res.status(404).json("Invalid Institute");

  await Feedback.create({ ...req.body, instituteId: inst._id });
  res.json("Feedback Submitted");
});

module.exports = router;
