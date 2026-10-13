const express = require("express");
const router = express.Router();
const { login, getDashboardStats, getInstitutes, toggleInstituteStatus } = require("../../controllers/superadmin/SuperAdminController");
// const { verifyToken, isAdmin } = require("../../middlewares/auth"); // Assuming we have auth middleware

// Super Admin Auth
router.post("/login", login);

// Super Admin Dashboard & Management (Ideally protected by verifyToken & isSuperAdmin)
router.get("/dashboard-stats", getDashboardStats);
router.get("/institutes", getInstitutes);
router.patch("/institutes/:id/toggle-status", toggleInstituteStatus);

module.exports = router;
