import express from "express";
import { requireAdmin } from "../../middleware/auth.js";

import {
  getTeachers,
  getAdminStats,
  createTeacher,
  deactivateTeacher,
  getInstituteFeedback,
  deleteFeedback,
  getPublicLink,
  createPublicLink,
} from "../../controllers/admin.controller.js";

const router = express.Router();

// Teachers
router.get("/teachers", requireAdmin, getTeachers);
router.post("/teacher", requireAdmin, createTeacher);
router.patch("/teacher/:id/deactivate", requireAdmin, deactivateTeacher);

// Dashboard
router.get("/stats", requireAdmin, getAdminStats);

// Feedback
router.get("/feedback", requireAdmin, getInstituteFeedback);
router.delete("/feedback/:id", requireAdmin, deleteFeedback);

// Public Link
router.get("/link", requireAdmin, getPublicLink);
router.post("/link", requireAdmin, createPublicLink);

export default router;
