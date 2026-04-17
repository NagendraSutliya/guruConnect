const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../../../middleware/auth");
const {
  getTeachers,
  createTeacher,
  deactivateTeacher,
  activateTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../../../controllers/admin/TeacherController");

router.use(requireAdmin);

router.get("/", getTeachers);
router.post("/", createTeacher);

router.patch("/:id/activate", activateTeacher);
router.patch("/:id/deactivate", deactivateTeacher);

router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

module.exports = router;
