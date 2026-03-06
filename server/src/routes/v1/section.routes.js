const router = require("express").Router();
const { requireAdmin } = require("../../middleware/auth");
const {
  createSection,
  getSections,
  getSectionsByClass,
} = require("../../controllers/section.controller");

router.post("/", requireAdmin, createSection);
router.get("/", requireAdmin, getSections);

router.get("/class/:classId", requireAdmin, getSectionsByClass);

module.exports = router;
