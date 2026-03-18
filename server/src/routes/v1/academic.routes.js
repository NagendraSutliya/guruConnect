const express = require("express");
const { requireAdmin } = require("../../middleware/auth");
const {
  createAcademicYear,
  getAcademicYears,
  activateAcademicYear,
  deleteAcademicYear,
} = require("../../controllers/academic.controller");

const router = express.Router();

router.post("/academic-year", requireAdmin, createAcademicYear);
router.get("/academic-year", requireAdmin, getAcademicYears);
router.patch("/academic-year/:id/activate", requireAdmin, activateAcademicYear);
router.delete("/academic-year/:id", requireAdmin, deleteAcademicYear);

module.exports = router;
