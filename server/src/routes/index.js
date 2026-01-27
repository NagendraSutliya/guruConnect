import express from "express";

import adminRoutes from "./v1/admin.routes.js";
import authRoutes from "./v1/auth.routes.js";
import teacherRoutes from "./v1/teacher.routes.js";
import publicRoutes from "./v1/public.routes.js";
import feedbackRoutes from "./v1/feedback.routes.js";

const router = express.Router();

// API v1
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/admin", adminRoutes);
router.use("/api/v1/teacher", teacherRoutes);
router.use("/api/v1/public", publicRoutes);
router.use("/api/v1/feedback", feedbackRoutes);

export default router;
