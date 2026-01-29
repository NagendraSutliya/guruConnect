const express = require("express");
const { requireTeacher } = require("../../middleware/auth.js");
const {
  getTeacherStats,
  getTeacherOverview,
  getTeacherFeedback,
} = require("../../controllers/teacher.controller.js");

const router = express.Router();

router.get("/stats", requireTeacher, getTeacherStats);
router.get("/overview", requireTeacher, getTeacherOverview);
router.get("/feedback", requireTeacher, getTeacherFeedback);
router.get("/feedback/all", requireTeacher, getTeacherFeedback);

module.exports = router;
