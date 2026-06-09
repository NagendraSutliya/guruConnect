const express = require("express");
const router = express.Router();

const {
  registerInstitute,
  verifyInstitute,
  loginInstitute,
} = require("../../controllers/auth/AdminAuthController");

const { loginTeacher } = require("../../controllers/auth/TeacherAuthController");

/* Institute Auth */
router.post("/register", registerInstitute);
router.post("/verify", verifyInstitute);
router.post("/login", loginInstitute);

/* Teacher Auth */
router.post("/teacher/login", loginTeacher);

module.exports = router;
