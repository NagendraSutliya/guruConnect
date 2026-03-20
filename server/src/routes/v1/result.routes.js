const router = require("express").Router();
const {
  adminResults,
  saveResults,
  getResults,
} = require("../../controllers/result.controller");
const { requireTeacher, requireAdmin } = require("../../middleware/auth");

router.get("/admin", requireAdmin, adminResults);

router.post("/", requireTeacher, saveResults);
router.get("/", requireTeacher, getResults);

module.exports = router;
