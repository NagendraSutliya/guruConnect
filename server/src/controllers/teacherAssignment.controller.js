const TeacherAssignment = require("../models/TeacherAssignment");
const { successResponse, errorResponse } = require("../utils/response");

exports.assignTeacher = async (req, res) => {
  try {
    const { teacherId, classId, sectionId, subjectId } = req.body;

    if (!teacherId || !classId || !sectionId || !subjectId) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const assignment = await TeacherAssignment.create({
      teacherId,
      classId,
      sectionId,
      subjectId,
    });

    return successResponse(res, "Teacher assigned", assignment);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to assign teacher");
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const list = await TeacherAssignment.find()
      .populate("teacherId")
      .populate("classId")
      .populate("sectionId")
      .populate("subjectId");

    return successResponse(res, "Assignments loaded", list);
  } catch {
    return errorResponse(res, "Failed to load assignments");
  }
};

exports.getMyAssignments = async (req, res) => {
  try {
    // console.log("JWT teacher ID:", req.user.id); // 👈 ADD
    const teacherId = req.user.id;

    const list = await TeacherAssignment.find({ teacherId })
      .populate("classId")
      .populate("sectionId")
      .populate("subjectId");

    return successResponse(res, "My assignments loaded", list);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to load assignments");
  }
};
