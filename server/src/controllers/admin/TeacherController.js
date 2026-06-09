const bcrypt = require("bcrypt");
const Teacher = require("../../models/Teacher.js");
const { successResponse, errorResponse } = require("../../utils/response.js");

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ instituteId: req.user.id })
      .select("-password")
      .sort({ createdAt: -1 });

    return successResponse(res, "Teachers fetched", teachers);
  } catch (err) {
    return errorResponse(res, "Failed to fetch teachers");
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { 
      name, email, password, 
      employeeId, designation, qualification, phone, address, specialization,
      emergencyPhone, panNo, bankAccountNo, ifscCode, basicSalary
    } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      email,
      password: hashed,
      instituteId: req.user.id,
      employeeId,
      designation,
      qualification,
      phone,
      address,
      specialization,
      emergencyPhone,
      panNo,
      bankAccountNo,
      ifscCode,
      basicSalary,
      role: "teacher",
    });

    return successResponse(res, "Teacher created", teacher, 201);
  } catch (err) {
    return errorResponse(res, "Teacher creation failed");
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { 
      name, email, password,
      employeeId, designation, qualification, phone, address, specialization,
      emergencyPhone, panNo, bankAccountNo, ifscCode, basicSalary
    } = req.body;

    const updateData = { 
      name, email, employeeId, designation, qualification, phone, address, specialization,
      emergencyPhone, panNo, bankAccountNo, ifscCode, basicSalary
    };

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, instituteId: req.user.id },
      updateData,
      { new: true }
    ).select("-password");

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    return successResponse(res, "Teacher updated", teacher);
  } catch (err) {
    return errorResponse(res, "Failed to update teacher");
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndDelete({
      _id: req.params.id,
      instituteId: req.user.id,
    });

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    return successResponse(res, "Teacher deleted");
  } catch (err) {
    return errorResponse(res, "Failed to delete teacher");
  }
};

exports.activateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, instituteId: req.user.id },
      { status: "active" },
      { new: true }
    );

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    return successResponse(res, "Teacher activated", teacher);
  } catch (err) {
    return errorResponse(res, "Failed to activate teacher");
  }
};

exports.deactivateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, instituteId: req.user.id },
      { status: "inactive" },
      { new: true }
    );

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    return successResponse(res, "Teacher deactivated", teacher);
  } catch (err) {
    return errorResponse(res, "Failed to deactivate teacher");
  }
};
