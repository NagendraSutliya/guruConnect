const router = require("express").Router();
const { studentLogin } = require("../../controllers/auth.controller");
const {
  getStudentOverview,
  changeStudentPassword,
  getStudentsByClass,
} = require("../../controllers/student.controller");
const { requireStudent } = require("../../middleware/auth");

// auth
router.post("/login", studentLogin);

// protected student routes
router.get("/dashboard", requireStudent, getStudentOverview);
router.post("/change-password", requireStudent, changeStudentPassword);
router.get("/by-class", getStudentsByClass);

module.exports = router;
