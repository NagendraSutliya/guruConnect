const router = require("express").Router();
const {
  getAttendance,
  saveAttendance,
  getTodaySummary,
  getClassSummary,
  getStudentSummary,
  getAttendanceHistory,
  getCampusTracker,
} = require("../../../controllers/admin/AttendanceController");
const { requireAdmin, allowRoles } = require("../../../middleware/auth");

router.post("/", allowRoles("admin", "teacher"), saveAttendance);
router.get("/", allowRoles("admin", "teacher"), getAttendance);

router.get("/history", requireAdmin, getAttendanceHistory);
router.get("/summary/today", requireAdmin, getTodaySummary);
router.get("/summary/tracker", requireAdmin, getCampusTracker);
router.get("/summary/class", requireAdmin, getClassSummary);
router.get("/summary/student", requireAdmin, getStudentSummary);

module.exports = router;
