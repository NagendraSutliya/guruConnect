const router = require("express").Router();
const { requireAdmin } = require("../../middleware/auth");
const {
  createSection,
  getSections,
} = require("../../controllers/section.controller");

router.post("/", requireAdmin, createSection);
router.get("/", requireAdmin, getSections);

module.exports = router;
