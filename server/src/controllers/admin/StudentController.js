const bcrypt = require("bcrypt");
const Student = require("../../models/Student");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= CREATE STUDENT ================= */
exports.createStudent = async (req, res) => {
  try {
    const { name, email, classId, sectionId } = req.body;

    if (!name || !email || !classId) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const exists = await Student.findOne({ email });
    if (exists) {
      return errorResponse(res, "Email already exists", 400);
    }

    // Auto roll number
    const lastStudent = await Student.findOne({ classId }).sort({ rollNo: -1 });
    const nextRoll = lastStudent ? lastStudent.rollNo + 1 : 1;

    // Generate simple password
    const rawPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(rawPassword, 10);

    const payload = {
      name,
      email,
      password: hashed,
      classId,
      rollNo: nextRoll,
    };

    if (sectionId) payload.sectionId = sectionId;
    const student = await Student.create(payload);

    return successResponse(res, "Student created", {
      email: student.email,
      password: rawPassword, // send only once
      studentId: student._id,
    });
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to create student");
  }
};

/* ================= GET ALL STUDENTS ================= */
exports.getStudents = async (req, res) => {
  try {
    const list = await Student.find().populate("classId").populate("sectionId");

    return successResponse(res, "Students loaded", list);
  } catch (err) {
    return errorResponse(res, "Failed to load students");
  }
};

/* ================= DEACTIVATE STUDENT ================= */
exports.deactivateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!student) return errorResponse(res, "Student not found", 404);

    return successResponse(res, "Student deactivated", student);
  } catch {
    return errorResponse(res, "Failed to deactivate student");
  }
};

/* ================= ACTIVATE STUDENT ================= */
exports.activateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!student) return errorResponse(res, "Student not found", 404);

    return successResponse(res, "Student activated", student);
  } catch {
    return errorResponse(res, "Failed to activate student");
  }
};

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

/* ================= UPDATE STUDENT ================= */
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, classId, sectionId } = req.body;

    if (!name || !email || !classId) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const student = await Student.findById(id);
    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    // prevent duplicate email
    const exists = await Student.findOne({ email, _id: { $ne: id } });
    if (exists) {
      return errorResponse(res, "Email already exists", 400);
    }

    student.name = name;
    student.email = email;
    student.classId = classId;
    student.sectionId = sectionId || null;

    await student.save();

    return successResponse(res, "Student updated", student);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to update student");
  }
};

/* ================= DELETE STUDENT ================= */
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    return successResponse(res, "Student deleted");
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to delete student");
  }
};
