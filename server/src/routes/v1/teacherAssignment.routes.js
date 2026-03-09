const router = require("express").Router();
const { requireAdmin, requireTeacher } = require("../../middleware/auth");
const {
  assignTeacher,
  getAssignments,
  getMyAssignments,
  deleteAssignment,
} = require("../../controllers/teacherAssignment.controller");

router.post("/", requireAdmin, assignTeacher);
router.get("/", requireAdmin, getAssignments);

router.get("/my", requireTeacher, getMyAssignments);
router.delete("/:id", requireAdmin, deleteAssignment); // <-- DELETE route

module.exports = router;
