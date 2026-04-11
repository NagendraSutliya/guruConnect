const Subject = require("../models/Subject");
const { successResponse, errorResponse } = require("../utils/response");

// CREATE SUBJECT
exports.createSubject = async (req, res) => {
  try {
    const { name, code, classId, sectionId } = req.body;

    if (!name || !code || !classId) {
      return errorResponse(res, "Missing required fields", 400);
    }

    // Check for duplicate subject in same class + section + institute
    const exists = await Subject.findOne({
      name,
      classId,
      sectionId: sectionId || null,
      instituteId: req.user.id,
    });

    if (exists) {
      return errorResponse(
        res,
        "Subject already exists in this class/section",
        400
      );
    }

    const subject = await Subject.create({
      name,
      code,
      classId,
      sectionId: sectionId || null,
      instituteId: req.user.id,
    });

    return successResponse(res, "Subject created", subject);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to create subject");
  }
};

// GET ALL SUBJECTS
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ instituteId: req.user.id })
      .populate("classId", "name")
      .populate("sectionId", "name")
      .sort({ createdAt: -1 });

    return successResponse(res, "Subjects loaded", subjects);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load subjects");
  }
};

// GET SECTION BY CLASS
exports.getSubjectsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const subjects = await Subject.find({
      classId,
      instituteId: req.user.id,
    }).populate("classId", "name");
    return successResponse(res, "Subjects loaded", subjects);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to load subjects", 500);
  }
};

// UPDATE SUBJECT
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, classId, sectionId } = req.body;

    if (!name || !code || !classId) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const exists = await Subject.findOne({
      _id: { $ne: id },
      name,
      classId,
      sectionId: sectionId || null,
      instituteId: req.user.id,
    });

    if (exists) {
      return errorResponse(
        res,
        "Another subject already exists with same name in this class/section",
        400
      );
    }

    const updated = await Subject.findByIdAndUpdate(
      id,
      { name, code, classId, sectionId: sectionId || null },
      { new: true }
    );

    return successResponse(res, "Subject updated", updated);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to update subject");
  }
};

// DELETE SUBJECT
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    return successResponse(res, "Subject deleted");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to delete subject");
  }
};
