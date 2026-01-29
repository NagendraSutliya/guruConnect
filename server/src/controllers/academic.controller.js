/* ================= CREATE ACADEMIC YEAR ================= */
const AcademicYear = require("../models/AcademicYear");
const { successResponse, errorResponse } = require("../utils/response");

exports.createAcademicYear = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    console.log("BODY RECEIVED:", req.body);
    if (!name || !!startDate || !endDate) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const exists = await AcademicYear.findOne({ name });
    if (exists) {
      return errorResponse(res, "Academic year already exists", 400);
    }

    const year = await AcademicYear.create({
      name,
      startDate,
      endDate,
    });

    return successResponse(res, "Academic year created", year);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to create academic year");
  }
};

/* ================= GET ALL YEARS ================= */
exports.getAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.find().sort({ createdAt: -1 });
    return successResponse(res, "Academic years loaded", years);
  } catch (err) {
    return errorResponse(res, "Failed to load academic years");
  }
};

// Activate Year
exports.activateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    // Deactivate all
    await AcademicYear.updateMany({}, { isActive: false });

    // Activate selected
    const year = await AcademicYear.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!year) {
      return errorResponse(res, "Academic year not found", 404);
    }
    return successResponse(res, "Academic year activated", year);
  } catch (err) {
    return errorResponse(res, "Failed to activate academic year");
  }
};
