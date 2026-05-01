const TeacherAssignment = require("../../models/TeacherAssignment");
const Teacher = require("../../models/Teacher");
const { successResponse, errorResponse } = require("../../utils/response");

exports.assignTeacher = async (req, res) => {
  try {
    const { teacherId, classId, sectionId, subjectId } = req.body;

    // Only require teacherId, classId, subjectId
    if (!teacherId || !classId || !subjectId) {
      return errorResponse(res, "Missing required fields", 400);
    }

    // ✅ Check if teacher is active
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    if (teacher.status !== "active") {
      return errorResponse(res, "Cannot assign teacher", 400);
    }

    // Build payload dynamically
    const payload = { teacherId, classId, subjectId };
    if (sectionId) payload.sectionId = sectionId; // only include if truthy

    const assignment = await TeacherAssignment.create(payload);

    return successResponse(res, "Teacher assigned", assignment);
  } catch (err) {
    console.log("Assign teacher error:", err);
    return errorResponse(res, "Failed to assign teacher", 500);
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

// --- Delete assignment ---
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TeacherAssignment.findByIdAndDelete(id);

    if (!deleted) {
      return errorResponse(res, "Assignment not found", 404);
    }

    return successResponse(res, "Assignment deleted successfully");
  } catch (err) {
    console.log("Delete assignment error:", err);
    return errorResponse(res, "Failed to delete assignment", 500);
  }
};

// --- Update assignment ---
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId, classId, sectionId, subjectId } = req.body;

    if (!teacherId || !classId || !subjectId) {
      return errorResponse(res, "Missing required fields", 400);
    }

    // ✅ Check teacher active
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    if (teacher.status !== "active") {
      return errorResponse(res, "Cannot assign inactive teacher", 400);
    }

    const payload = { teacherId, classId, subjectId };
    if (sectionId) payload.sectionId = sectionId;

    const updated = await TeacherAssignment.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updated) return errorResponse(res, "Assignment not found", 404);

    return successResponse(res, "Assignment updated", updated);
  } catch (err) {
    console.log("Update assignment error:", err);
    return errorResponse(res, "Failed to update assignment", 500);
  }
};
