const router = require("express").Router();
const {
  getExams,
  createExam,
  deleteExam,
  updateExam,
} = require("../../controllers/exam.controller");
const { requireAdmin, allowRoles } = require("../../middleware/auth");

router.get("/", allowRoles("admin", "teacher"), getExams);
router.post("/", requireAdmin, createExam);
router.put("/:id", requireAdmin, updateExam);
router.delete("/:id", requireAdmin, deleteExam);

module.exports = router;
