const router = require("express").Router();
const {
  getAdminResults,
  saveResults,
  getResults,
  deleteResult,
} = require("../../../controllers/admin/ResultController");
const { requireTeacher, requireAdmin } = require("../../../middleware/auth");

router.get("/", requireAdmin, getAdminResults);

// router.post("/", requireTeacher, saveResults);
// router.get("/", requireTeacher, getResults);
// router.delete("/", requireTeacher, deleteResult);

module.exports = router;
