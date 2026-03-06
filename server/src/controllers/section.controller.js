const Section = require("../models/Section");
const { successResponse, errorResponse } = require("../utils/response");

/* CREATE SECTION */
exports.createSection = async (req, res) => {
  try {
    const { name, classId } = req.body;

    if (!name || !classId)
      return errorResponse(res, "Missing required fields", 400);

    const section = await Section.create({ name, classId });

    return successResponse(res, "Section created", section);
  } catch (err) {
    return errorResponse(res, "Failed to create section");
  }
};

/* GET ALL SECTIONS */
exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .populate("classId", "name")
      .sort({ createdAt: -1 });

    return successResponse(res, "Sections loaded", sections);
  } catch (err) {
    return errorResponse(res, "Failed to load sections");
  }
};

// GET SECTION BY CLASS
exports.getSectionsByClass = async (req, res) => {
  const { classId } = req.params;

  const list = await Section.find({ classId });

  return successResponse(res, "Sections loaded", list);
};
