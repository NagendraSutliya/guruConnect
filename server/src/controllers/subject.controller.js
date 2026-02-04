const Subject = require("../models/Subject");
const { successResponse, errorResponse } = require("../utils/response");

exports.createSubject = async (req, res) => {
  try {
    const { name, code, classId } = req.body;

    if (!name || !code || !classId) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const subject = await Subject.create({ name, code, classId });

    return successResponse(res, "Subject created", subject);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to create subject");
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("classId");

    return successResponse(res, "Subjects loaded", subjects);
  } catch {
    return errorResponse(res, "Failed to load subjects");
  }
};
