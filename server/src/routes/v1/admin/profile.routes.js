const express = require("express");
const { requireAdmin } = require("../../../middleware/auth");
const router = express.Router();
const {
  getAdminProfile,
  updateInstituteLogo,
  updateAdminProfile
} = require("../../../controllers/admin/AdminProfileController");

// Apply middleware to all routes
router.use(requireAdmin);

// GET /api/v1/admin/profile
router.get("/", getAdminProfile);
router.patch("/", updateAdminProfile);
router.patch("/logo", updateInstituteLogo);

module.exports = router;
