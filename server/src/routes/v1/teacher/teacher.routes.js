const express = require("express");
const { requireTeacher } = require("../../../middleware/auth");
const {
  getTeacherStats,
  getTeacherOverview,
  getTeacherFeedback,
  getAttendanceSummary,
  getTeacherProfile,
  updateTeacherProfile,
  updateTeacherImage,
  getTeacherDashboardCharts,
} = require("../../../controllers/teacher/TeacherController");

const router = express.Router();

router.use(requireTeacher);

router.get("/profile", getTeacherProfile);
router.put("/profile", updateTeacherProfile);
router.patch("/profile/image", updateTeacherImage);
router.get("/stats", getTeacherStats);
router.get("/dashboard/charts", getTeacherDashboardCharts);
router.get("/overview", getTeacherOverview);
router.get("/feedback", getTeacherFeedback);
router.get("/feedback/all", getTeacherFeedback);
router.get("/attendance/summary", getAttendanceSummary);

module.exports = router;
