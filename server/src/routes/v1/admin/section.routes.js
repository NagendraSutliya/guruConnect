const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../../middleware/auth");
const {
  createSection,
  getSections,
  getSectionsByClass,
  updateSection,
  deleteSection,
} = require("../../../controllers/admin/SectionController");

router.use(requireAdmin);

router.post("/", createSection);
router.get("/", getSections);

router.get("/class/:classId", getSectionsByClass);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

module.exports = router;
