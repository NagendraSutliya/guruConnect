const express = require("express");
const router = express.Router();

/* ADMIN */
router.use("/admin", require("./admin"));
router.use("/teacher", require("./teacher"));
router.use("/student", require("./student"));
router.use("/teacher-assign", require("./admin/teacherAssignment.routes"));

module.exports = router;
