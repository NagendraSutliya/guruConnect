const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admission = require("../../models/Admission");
const Student = require("../../models/Student");
const Class = require("../../models/Class");
const Section = require("../../models/Section");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= CREATE ADMISSION ================= */
exports.createAdmission = async (req, res) => {
  try {
    const { 
      name, email, classId, sectionId, 
      admissionNo, enrollmentNo, admissionDate,
      parentName, parentPhone, phone, dob, gender, address, bloodGroup,
      aadharNo, category, religion, nationality, previousSchool, previousClass
    } = req.body;

    if (!name || !classId) {
      return errorResponse(res, "Name and Class are required", 400);
    }

    const payload = {
      name,
      email,
      instituteId: req.user.instituteId || req.user.id,
      classId,
      status: "Pending"
    };

    if (sectionId) payload.sectionId = sectionId;
    if (admissionNo) payload.admissionNo = admissionNo;
    if (enrollmentNo) payload.enrollmentNo = enrollmentNo;
    if (admissionDate) payload.admissionDate = admissionDate;
    if (parentName) payload.parentName = parentName;
    if (parentPhone) payload.parentPhone = parentPhone;
    if (phone) payload.phone = phone;
    if (dob) payload.dob = dob;
    if (gender) payload.gender = gender;
    if (address) payload.address = address;
    if (bloodGroup) payload.bloodGroup = bloodGroup;
    if (aadharNo) payload.aadharNo = aadharNo;
    if (category) payload.category = category;
    if (religion) payload.religion = religion;
    if (nationality) payload.nationality = nationality;
    if (previousSchool) payload.previousSchool = previousSchool;
    if (previousClass) payload.previousClass = previousClass;

    const admission = await Admission.create(payload);

    return successResponse(res, "Admission application drafted", admission);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to draft admission");
  }
};

/* ================= GET ALL ADMISSIONS ================= */
exports.getAdmissions = async (req, res) => {
  try {
    const instituteId = req.user.instituteId || req.user.id;
    const list = await Admission.find({ instituteId })
      .populate("classId")
      .populate("sectionId")
      .populate("studentId")
      .sort({ createdAt: -1 });

    return successResponse(res, "Admissions loaded", list);
  } catch (err) {
    console.error("GET ADMISSIONS ERROR:", err);
    return errorResponse(res, err.message || "Failed to load admissions");
  }
};

/* ================= CONFIRM ADMISSION ================= */
exports.confirmAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    const admission = await Admission.findById(id);
    if (!admission) return errorResponse(res, "Admission not found", 404);
    if (admission.status === "Confirmed") return errorResponse(res, "Admission is already confirmed", 400);

    // If email exists, check for duplicate student
    if (admission.email) {
      const exists = await Student.findOne({ email: admission.email });
      if (exists) return errorResponse(res, "A student with this email already exists", 400);
    }

    // Auto roll number
    const lastStudent = await Student.findOne({ classId: admission.classId }).sort({ rollNo: -1 });
    const nextRoll = lastStudent ? lastStudent.rollNo + 1 : 1;

    // Generate simple password
    const rawPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(rawPassword, 10);

    const studentPayload = {
      name: admission.name,
      email: admission.email || `temp_${Date.now()}@school.edu`, // Temporary if empty
      password: hashed,
      instituteId: admission.instituteId,
      classId: admission.classId,
      rollNo: nextRoll,
      sectionId: admission.sectionId,
      admissionNo: admission.admissionNo,
      enrollmentNo: admission.enrollmentNo,
      admissionDate: admission.admissionDate,
      parentName: admission.parentName,
      parentPhone: admission.parentPhone,
      phone: admission.phone,
      dob: admission.dob,
      gender: admission.gender,
      address: admission.address,
      bloodGroup: admission.bloodGroup,
      aadharNo: admission.aadharNo,
      category: admission.category,
      religion: admission.religion,
      nationality: admission.nationality,
      previousSchool: admission.previousSchool,
      previousClass: admission.previousClass,
      isActive: true
    };

    const student = await Student.create(studentPayload);

    admission.status = "Confirmed";
    admission.studentId = student._id;
    await admission.save();

    return successResponse(res, "Admission confirmed and student created", {
      admission,
      studentCreds: {
        email: student.email,
        password: rawPassword
      }
    });
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to confirm admission");
  }
};

/* ================= DELETE ADMISSION ================= */
exports.deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const admission = await Admission.findByIdAndDelete(id);

    if (!admission) return errorResponse(res, "Admission not found", 404);

    return successResponse(res, "Admission record deleted");
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to delete admission");
  }
};
