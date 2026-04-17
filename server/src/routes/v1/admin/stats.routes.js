const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../../../middleware/auth");
const {
  getAdminStats,
} = require("../../../controllers/admin/DashboardController");

router.use(requireAdmin);

// GET /api/v1/admin/stats
router.get("/", getAdminStats);

module.exports = router;
