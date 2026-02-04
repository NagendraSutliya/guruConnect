const router = require("express").Router();
const { requireAdmin, requireTeacher } = require("../../middleware/auth");
const {
  assignTeacher,
  getAssignments,
  getMyAssignments,
} = require("../../controllers/teacherAssignment.controller");

router.post("/", requireAdmin, assignTeacher);
router.get("/", requireAdmin, getAssignments);

router.get("/my", requireTeacher, getMyAssignments);

module.exports = router;
