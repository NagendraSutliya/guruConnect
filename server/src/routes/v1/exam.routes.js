const router = require("express").Router();
const {
  getExams,
  createExam,
  deleteExam,
} = require("../../controllers/exam.controller");

router.get("/", getExams);
router.post("/", createExam);
router.delete("/:id", deleteExam);

module.exports = router;
