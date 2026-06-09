const router = require("express").Router();
const {
  getExams,
  getFullExams,
} = require("../../../controllers/teacher/ExamController");
const { allowRoles } = require("../../../middleware/auth");

router.get("/", allowRoles("admin", "teacher"), getExams);
router.get("/full", allowRoles("admin", "teacher"), getFullExams);

module.exports = router;
