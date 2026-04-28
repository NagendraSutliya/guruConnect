const express = require("express");
const router = express.Router();

router.use("/", require("./teacher.routes"));
router.use("/attendance", require("./attendance.routes"));
router.use("/exams", require("./exam.routes"));
router.use("/results", require("./result.routes"));
router.use("/study-material", require("./studyMaterial.routes"));
router.use("/assignments", require("./teacherAssignment.routes"));

module.exports = router;
