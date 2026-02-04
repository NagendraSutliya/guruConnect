const Class = require("../models/Class");
const { successResponse, errorResponse } = require("../utils/response");

exports.createClass = async (req, res) => {
  try {
    const { name, academicYearId } = req.body;

    if (!name || !academicYearId) {
      return errorResponse(res, "Missing fields", 400);
    }

    const cls = await Class.create({
      name,
      academicYearId,
      instituteId: req.user.id,
    });

    return successResponse(res, "Class created", cls);
  } catch (err) {
    return errorResponse(res, "Failed to create class");
  }
};

exports.getClasses = async (req, res) => {
  try {
    const list = await Class.find({
      instituteId: req.user.id,
    }).populate("academicYearId", "name");

    return successResponse(res, "Classes loaded", list);
  } catch (err) {
    return errorResponse(res, "Failed to load class");
  }
};
