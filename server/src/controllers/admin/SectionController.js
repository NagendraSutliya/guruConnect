const Section = require("../../models/Section");
const { successResponse, errorResponse } = require("../../utils/response");

/* CREATE SECTION */
exports.createSection = async (req, res) => {
  try {
    const { name, classId } = req.body;

    if (!name || !classId)
      return errorResponse(res, "Missing required fields", 400);

    const exists = await Section.findOne({
      name,
      classId,
      instituteId: req.user.id,
    });

    if (exists) {
      return errorResponse(res, "Section already exists in this class", 400);
    }

    const section = await Section.create({
      name,
      classId,
      instituteId: req.user.id,
    });

    return successResponse(res, "Section created", section);
  } catch (err) {
    return errorResponse(res, "Failed to create section");
  }
};

/* GET ALL SECTIONS */
exports.getSections = async (req, res) => {
  try {
    // const sections = await Section.find()
    const sections = await Section.find({ instituteId: req.user.id })
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

  // const list = await Section.find({ classId });
  const list = await Section.find({
    classId,
    instituteId: req.user.id,
  }).populate("classId", "name");

  return successResponse(res, "Sections loaded", list);
};

/* UPDATE SECTION */
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params; // section ID
    const { name, classId } = req.body;

    if (!name || !classId)
      return errorResponse(res, "Missing required fields", 400);

    const section = await Section.findOne({
      _id: id,
      instituteId: req.user.id,
    });

    if (!section) return errorResponse(res, "Section not found", 404);

    // Check for duplicate name in same class
    const exists = await Section.findOne({
      name,
      classId,
      _id: { $ne: id },
      instituteId: req.user.id,
    });

    if (exists)
      return errorResponse(
        res,
        "Another section with same name exists in this class",
        400
      );

    section.name = name;
    section.classId = classId;

    await section.save();

    return successResponse(res, "Section updated successfully", section);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to update section");
  }
};

/* DELETE SECTION */
exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findOne({
      _id: id,
      instituteId: req.user.id,
    });

    if (!section) return errorResponse(res, "Section not found", 404);

    // Use deleteOne instead of remove
    await Section.deleteOne({ _id: id, instituteId: req.user.id });

    return successResponse(res, "Section deleted successfully");
  } catch (err) {
    console.error("Delete Section Error:", err); // log full error
    return errorResponse(res, "Failed to delete section");
  }
};
