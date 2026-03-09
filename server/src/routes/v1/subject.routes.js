const router = require("express").Router();
const { requireAdmin } = require("../../middleware/auth");
const {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} = require("../../controllers/subject.controller");

router.post("/", requireAdmin, createSubject);
router.get("/", requireAdmin, getSubjects);
router.put("/:id", requireAdmin, updateSubject);
router.delete("/:id", requireAdmin, deleteSubject);

module.exports = router;
