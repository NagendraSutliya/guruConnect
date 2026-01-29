const express = require("express");
const { requireAdmin } = require("../../middleware/auth");
const {
  createAcademicYear,
  getAcademicYears,
  activateAcademicYear,
} = require("../../controllers/academic.controller");

const router = express.Router();

router.post("/academic-year", requireAdmin, createAcademicYear);
router.get("/academic-year", requireAdmin, getAcademicYears);
router.patch("/academic-year/:id/activate", requireAdmin, activateAcademicYear);

module.exports = router;
