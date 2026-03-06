const router = require("express").Router();
const {
  getAttendance,
  saveAttendance,
  getTodaySummary,
  getClassSummary,
  getStudentSummary,
  getAttendanceHistory,
} = require("../../controllers/attendance.controller");
const { requireAdmin } = require("../../middleware/auth");

router.post("/", saveAttendance);
router.get("/", getAttendance);

router.get("/history", requireAdmin, getAttendanceHistory);
router.get("/summary/today", requireAdmin, getTodaySummary);
router.get("/summary/class", requireAdmin, getClassSummary);
router.get("/summary/student", requireAdmin, getStudentSummary);

module.exports = router;
