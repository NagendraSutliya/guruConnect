const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../../middleware/auth");
const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  getSubjectsByClass,
} = require("../../../controllers/admin/SubjectController");

router.use(requireAdmin);

router.post("/", createSubject);
router.get("/", getSubjects);
router.get("/class/:classId", getSubjectsByClass);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
