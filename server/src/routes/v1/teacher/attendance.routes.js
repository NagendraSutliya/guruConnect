const router = require("express").Router();
const {
  getStudentsByClass,
} = require("../../../controllers/admin/StudentController");
const {
  getMyAssignments,
} = require("../../../controllers/admin/TeacherAssignmentController");
const {
  getAttendance,
  saveAttendance,
} = require("../../../controllers/teacher/AttendanceController");
const { requireTeacher } = require("../../../middleware/auth");

router.use(requireTeacher);

router.post("/", saveAttendance);
router.get("/", getAttendance);

router.get("/my", getMyAssignments);
router.get("/by-class", getStudentsByClass);

module.exports = router;
