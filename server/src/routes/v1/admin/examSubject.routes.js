const router = require("express").Router();
const {
  createExamSubject,
  getExamSubjects,
  getAllExamSubjects,
  updateExamSubject,
  deleteExamSubject,
} = require("../../../controllers/admin/ExamSubjectController");
const { requireAdmin, allowRoles } = require("../../../middleware/auth");

router.get("/:examId", allowRoles("admin", "teacher"), getExamSubjects);
router.post("/", requireAdmin, createExamSubject);
router.get("/", requireAdmin, getAllExamSubjects);
router.put("/:id", requireAdmin, updateExamSubject);
router.delete("/:id", requireAdmin, deleteExamSubject);

module.exports = router;
