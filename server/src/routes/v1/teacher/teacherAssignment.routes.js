const router = require("express").Router();
const { requireAdmin, requireTeacher } = require("../../../middleware/auth");
const {
  getMyAssignments,
  deleteAssignment,
  updateAssignment,
} = require("../../../controllers/old/v1/teacherAssignment.controller");

router.get("/my", requireTeacher, getMyAssignments);
router.delete("/:id", requireAdmin, deleteAssignment); // <-- DELETE route
router.put("/:id", requireAdmin, updateAssignment);

module.exports = router;
