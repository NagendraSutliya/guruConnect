const router = require("express").Router();
const { studentLogin } = require("../../../controllers/auth/StudentAuthController");
const {
  getStudentOverview,
  getStudentDashboardSummary,
  getStudentAttendanceHistory,
  getStudentMaterials,
  getStudentResults,
  getStudentExams,
  updateStudentProfile,
  changeStudentPassword,
  getStudentsByClass,
} = require("../../../controllers/student/StudentController");
const { getStudentRoutine } = require("../../../controllers/admin/RoutineController");
const { requireStudent } = require("../../../middleware/auth");

// auth
router.post("/login", studentLogin);

// protected student routes
router.get("/dashboard", requireStudent, getStudentOverview);
router.get("/dashboard-summary", requireStudent, getStudentDashboardSummary);
router.get("/attendance", requireStudent, getStudentAttendanceHistory);
router.get("/material", requireStudent, getStudentMaterials);
router.get("/results", requireStudent, getStudentResults);
router.get("/exams", requireStudent, getStudentExams);
router.put("/profile", requireStudent, updateStudentProfile);
router.post("/change-password", requireStudent, changeStudentPassword);
router.get("/routine", requireStudent, getStudentRoutine);
router.get("/by-class", getStudentsByClass);

module.exports = router;
