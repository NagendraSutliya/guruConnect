const express = require("express");
const { requireAdmin } = require("../../../middleware/auth");
const {
  createAcademicYear,
  getAcademicYears,
  activateAcademicYear,
  deleteAcademicYear,
  updateAcademicYear,
} = require("../../../controllers/admin/AcademicYearController");

const router = express.Router();

router.use(requireAdmin);

router.post("/academic-year", createAcademicYear);
router.get("/academic-year", getAcademicYears);
router.patch("/academic-year/:id/activate", activateAcademicYear);
router.put("/academic-year/:id", updateAcademicYear);
router.delete("/academic-year/:id", deleteAcademicYear);

module.exports = router;
