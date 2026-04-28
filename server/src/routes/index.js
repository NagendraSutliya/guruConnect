const express = require("express");
const router = express.Router();

router.use("/v1/auth", require("./v1/auth.routes"));
router.use("/v1", require("./v1"));
// router.use("/v1/admin", require("./v1/admin.routes"));
// router.use("/v1/teacher", require("./v1/teacher.routes"));
router.use("/v1/public", require("./v1/public.routes"));
router.use("/v1/feedback", require("./v1/feedback.routes"));

// router.use("/v1/academic", require("./v1/academic.routes"));

// router.use("/v1/classes", require("./v1/class.routes"));

// router.use("/v1/sections", require("./v1/section.routes"));

// router.use("/v1/subjects", require("./v1/subject.routes"));

// router.use("/v1/teacher-assign", require("./v1/teacherAssignment.routes"));

// router.use("/v1/student", require("./v1/student.routes"));   -- teacher dashboard

// router.use("/v1/attendance", require("./v1/attendance.routes"));

// router.use("/v1/exams", require("./v1/exam.routes"));

// router.use("/v1/results", require("./v1/result.routes"));

// router.use("/v1/exam-subjects", require("./v1/examSubject.routes"));
// router.use("/v1/routine", require("./v1/routine.routes"));
// router.use("/v1/exam-files", require("./v1/examFile.routes"));
// router.use("/v1/study-material", require("./v1/teacher/studyMaterial.routes"));

module.exports = router;
