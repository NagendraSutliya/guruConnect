const express = require("express");
const router = express.Router();

/* ================= PROFILE ================= */
router.use("/profile", require("./profile.routes"));
router.use("/teachers", require("./teacher.routes"));
router.use("/students", require("./student.routes"));
router.use("/stats", require("./stats.routes"));
router.use("/feedback", require("./feedback.routes"));
router.use("/link", require("./publicLink.routes"));

/* ================= ACADEMIC YEAR ================= */
router.use("/academic", require("./academic.routes"));

router.use("/teacher-assign", require("./teacherAssignment.routes"));

module.exports = router;
