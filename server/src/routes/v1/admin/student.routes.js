const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../../../middleware/auth");
const {
  getStudents,
  createStudent,
  deactivateStudent,
  activateStudent,
  updateStudent,
  deleteStudent,
} = require("../../../controllers/admin/StudentController");

router.use(requireAdmin);

router.get("/", getStudents);
router.post("/", createStudent);

router.patch("/:id/deactivate", deactivateStudent);
router.patch("/:id/activate", activateStudent);

router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
