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
  activateTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../../controllers/admin.controller.js");
const {
  getStudents,
  createStudent,
  deactivateStudent,
  activateStudent,
} = require("../../controllers/student.controller.js");
const router = express.Router();

// Teachers
router.get("/teachers", requireAdmin, getTeachers);
router.post("/teacher", requireAdmin, createTeacher);
router.patch("/teacher/:id/activate", requireAdmin, activateTeacher);
router.patch("/teacher/:id/deactivate", requireAdmin, deactivateTeacher);
router.put("/teacher/:id", requireAdmin, updateTeacher);
router.delete("/teacher/:id", requireAdmin, deleteTeacher);

/* ================= STUDENTS ================= */
router.get("/students", requireAdmin, getStudents);
router.post("/student", requireAdmin, createStudent);
router.patch("/student/:id/deactivate", requireAdmin, deactivateStudent);
router.patch("/student/:id/activate", requireAdmin, activateStudent);

// Dashboard
router.get("/stats", requireAdmin, getAdminStats);

// Feedback
router.get("/feedback", requireAdmin, getTeachersFeedback);
router.delete("/feedback/:id", requireAdmin, deleteFeedback);

// Public Link
router.get("/link", requireAdmin, getPublicLink);
router.post("/link", requireAdmin, createPublicLink);

module.exports = router;
