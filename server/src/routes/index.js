const express = require("express");
const router = express.Router();

router.use("/v1/auth", require("./v1/auth.routes"));
router.use("/v1/admin", require("./v1/admin.routes"));
router.use("/v1/teacher", require("./v1/teacher.routes"));
router.use("/v1/public", require("./v1/public.routes"));
router.use("/v1/feedback", require("./v1/feedback.routes"));

router.use("/v1/academic", require("./v1/academic.routes"));

router.use("/v1/classes", require("./v1/class.routes"));

router.use("/v1/sections", require("./v1/section.routes"));

router.use("/v1/subjects", require("./v1/subject.routes"));

router.use("/v1/teacher-assign", require("./v1/teacherAssignment.routes"));

module.exports = router;
