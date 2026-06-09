const router = require("express").Router();
const {
  saveResults,
  getResults,
  deleteResult,
} = require("../../../controllers/teacher/ResultController");
const { requireTeacher } = require("../../../middleware/auth");

router.post("/", requireTeacher, saveResults);
router.get("/", requireTeacher, getResults);
router.delete("/", requireTeacher, deleteResult);

module.exports = router;
