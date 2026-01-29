const express = require("express");
const router = express.Router();

const {
  registerInstitute,
  verifyInstitute,
  loginInstitute,
  loginTeacher,
} = require("../../controllers/auth.controller");

/* Institute Auth */
router.post("/register", registerInstitute);
router.post("/verify", verifyInstitute);
router.post("/login", loginInstitute);

/* Teacher Auth */
router.post("/teacher/login", loginTeacher);

module.exports = router;
