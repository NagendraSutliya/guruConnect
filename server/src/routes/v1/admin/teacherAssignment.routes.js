const router = require("express").Router();
const { requireAdmin, requireTeacher } = require("../../../middleware/auth");
const {
  assignTeacher,
  getAssignments,
  getMyAssignments,
  deleteAssignment,
  updateAssignment,
} = require("../../../controllers/admin/TeacherAssignmentController");

router.post("/", requireAdmin, assignTeacher);
router.get("/", requireAdmin, getAssignments);

router.get("/my", requireTeacher, getMyAssignments);
router.delete("/:id", requireAdmin, deleteAssignment); // <-- DELETE route
router.put("/:id", requireAdmin, updateAssignment);

module.exports = router;
