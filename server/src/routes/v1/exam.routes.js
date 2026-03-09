const router = require("express").Router();
const {
  getExams,
  createExam,
  deleteExam,
  updateExam,
} = require("../../controllers/exam.controller");

router.get("/", getExams);
router.post("/", createExam);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

module.exports = router;
