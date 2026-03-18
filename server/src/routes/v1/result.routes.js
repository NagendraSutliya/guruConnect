const router = require("express").Router();
const {
  adminResults,
  saveResults,
  getResults,
} = require("../../controllers/result.controller");
const { requireTeacher } = require("../../middleware/auth");

router.get("/admin", adminResults);

router.post("/", requireTeacher, saveResults);
router.get("/", requireTeacher, getResults);

module.exports = router;
