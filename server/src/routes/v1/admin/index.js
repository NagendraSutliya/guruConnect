const express = require("express");
const router = express.Router();

/* ================= PROFILE ================= */
router.use("/profile", require("./profile.routes"));
router.use("/teachers", require("./teacher.routes"));
router.use("/students", require("./student.routes"));
router.use("/admissions", require("./admission.routes"));
router.use("/stats", require("./stats.routes"));
router.use("/feedback", require("./feedback.routes"));
router.use("/link", require("./publicLink.routes"));
router.use("/finance", require("./finance.routes"));

router.use("/attendance", require("./attendance.routes"));

/* ================= ACADEMIC YEAR ================= */
router.use("/academic", require("./academic.routes"));

router.use("/teacher-assign", require("./teacherAssignment.routes"));
router.use("/classes", require("./class.routes"));
router.use("/sections", require("./section.routes"));
router.use("/subjects", require("./subject.routes"));
router.use("/routine", require("./routine.routes"));
router.use("/exams", require("./exam.routes"));
router.use("/exam-subjects", require("./examSubject.routes"));
router.use("/results", require("./result.routes"));

module.exports = router;
