const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../../../middleware/auth");
const {
  getTeachersFeedback,
  deleteFeedback,
} = require("../../../controllers/admin/FeedbackController");

router.use(requireAdmin);

router.get("/", getTeachersFeedback);
router.delete("/:id", deleteFeedback);

module.exports = router;
