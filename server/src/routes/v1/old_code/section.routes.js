const router = require("express").Router();
const { requireAdmin } = require("../../../middleware/auth");
const {
  createSection,
  getSections,
  getSectionsByClass,
  updateSection,
  deleteSection,
} = require("../../controllers/section.controller");

router.post("/", requireAdmin, createSection);
router.get("/", requireAdmin, getSections);

router.get("/class/:classId", requireAdmin, getSectionsByClass);
router.put("/:id", requireAdmin, updateSection);
router.delete("/:id", requireAdmin, deleteSection);

module.exports = router;
