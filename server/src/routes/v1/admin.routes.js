const express = require("express");
const { requireAdmin } = require("../../middleware/auth.js");
const {
  getTeachers,
  getAdminStats,
  createTeacher,
  deactivateTeacher,
  getTeachersFeedback,
  deleteFeedback,
  getPublicLink,
  createPublicLink,
} = require("../../controllers/admin.controller.js");

const router = express.Router();

// Teachers
router.get("/teachers", requireAdmin, getTeachers);
router.post("/teacher", requireAdmin, createTeacher);
router.patch("/teacher/:id/deactivate", requireAdmin, deactivateTeacher);

// Dashboard
router.get("/stats", requireAdmin, getAdminStats);

// Feedback
router.get("/feedback", requireAdmin, getTeachersFeedback);
router.delete("/feedback/:id", requireAdmin, deleteFeedback);

// Public Link
router.get("/link", requireAdmin, getPublicLink);
router.post("/link", requireAdmin, createPublicLink);

module.exports = router;
