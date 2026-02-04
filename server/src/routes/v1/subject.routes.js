const router = require("express").Router();
const { requireAdmin } = require("../../middleware/auth");
const {
  createSubject,
  getSubjects,
} = require("../../controllers/subject.controller");

router.post("/", requireAdmin, createSubject);
router.get("/", requireAdmin, getSubjects);

module.exports = router;
