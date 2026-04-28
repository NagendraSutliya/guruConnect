const router = require("express").Router();
const {
  getExams,
  createExam,
  deleteExam,
  updateExam,
  getFullExams,
} = require("../../../controllers/admin/ExamController");
const { requireAdmin, allowRoles } = require("../../../middleware/auth");

router.get("/", allowRoles("admin", "teacher"), getExams);
router.get("/full", allowRoles("admin", "teacher"), getFullExams);
router.post("/", requireAdmin, createExam);
router.put("/:id", requireAdmin, updateExam);
router.delete("/:id", requireAdmin, deleteExam);

module.exports = router;
