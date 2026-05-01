const bcrypt = require("bcrypt");
const Student = require("../../models/Student");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= STUDENT DASHBOARD ================= */
exports.getStudentOverview = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate("classId")
      .populate("sectionId")
      .select("-password");

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    return successResponse(res, "Student dashboard loaded", student);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to load dashboard");
  }
};

/* ================= CHANGE PASSWORD ================= */
exports.changeStudentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return errorResponse(res, "Both passwords are required", 400);
    }

    const student = await Student.findById(req.user.id);

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    const match = await bcrypt.compare(oldPassword, student.password);

    if (!match) {
      return errorResponse(res, "Old password incorrect", 404);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    student.password = hashed;
    await student.save();

    return successResponse(res, "Password updated successfully");
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to udpate password");
  }
};

/* ================= STUDENTS BY CLASS ================= */
exports.getStudentsByClass = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    if (!classId) {
      return errorResponse(res, "classId is required");
    }

    const filter = {
      classId,
      isActive: true,
    };

    if (sectionId) {
      filter.sectionId = sectionId;
    }

    const students = await Student.find(filter)
      .select("_id name rollNo")
      .sort({ rollNo: 1 });

    return successResponse(res, "Students loaded", students);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load students");
  }
};
