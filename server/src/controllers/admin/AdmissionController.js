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
      aadharNo, category, religion, nationality, previousSchool, previousClass,
      stage, source, counsellor, followUpText, isOverdue, interactionSchedule, documents, followUps
    } = req.body;

    if (!name || !classId) {
      return errorResponse(res, "Name and Class are required", 400);
    }

    const payload = {
      name,
      email,
      instituteId: req.user.instituteId || req.user.id,
      classId,
      status: stage === "enrolled" ? "Confirmed" : "Pending",
      stage: stage || "application"
    };

    if (source) payload.source = source;
    if (counsellor) payload.counsellor = counsellor;
    if (followUpText) payload.followUpText = followUpText;
    if (isOverdue !== undefined) payload.isOverdue = isOverdue;
    if (interactionSchedule) payload.interactionSchedule = interactionSchedule;
    if (documents) payload.documents = documents;
    if (followUps) payload.followUps = followUps;
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
    admission.stage = "enrolled";
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

/* ================= UPDATE ADMISSION STAGE ================= */
exports.updateAdmissionStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const validStages = [
      "enquiry",
      "followup",
      "application",
      "verification",
      "test",
      "approved",
      "fee_paid",
      "enrolled",
      "rejected"
    ];

    if (!stage || !validStages.includes(stage)) {
      return errorResponse(
        res,
        `Invalid stage: ${stage}. Must be one of: ${validStages.join(", ")}`,
        400
      );
    }

    const admission = await Admission.findById(id);
    if (!admission) return errorResponse(res, "Admission not found", 404);

    admission.stage = stage;
    if (stage === "enrolled") {
      admission.status = "Confirmed";
    } else {
      admission.status = "Pending";
    }
    await admission.save();

    return successResponse(res, "Admission stage updated", admission);
  } catch (err) {
    console.error("UPDATE STAGE ERROR:", err);
    return errorResponse(res, err.message || "Failed to update admission stage", 500);
  }
};

/* ================= UPDATE ADMISSION DETAILS ================= */
exports.updateAdmissionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      classId,
      sectionId,
      admissionNo,
      enrollmentNo,
      admissionDate,
      parentName,
      parentPhone,
      parentEmail,
      phone,
      dob,
      gender,
      address,
      bloodGroup,
      aadharNo,
      category,
      religion,
      nationality,
      previousSchool,
      previousClass,
      stage,
      status,
      interactionSchedule,
      documents,
      followUps,
      feePayment,
      counsellor,
      followUpText
    } = req.body;

    const admission = await Admission.findById(id);
    if (!admission) return errorResponse(res, "Admission not found", 404);

    // Profile & Form fields
    if (name !== undefined) admission.name = name;
    if (email !== undefined) admission.email = email;
    if (classId !== undefined) admission.classId = classId;
    if (sectionId !== undefined) admission.sectionId = sectionId ? sectionId : null;
    if (admissionNo !== undefined) admission.admissionNo = admissionNo;
    if (enrollmentNo !== undefined) admission.enrollmentNo = enrollmentNo;
    if (admissionDate !== undefined) admission.admissionDate = admissionDate;
    if (parentName !== undefined) admission.parentName = parentName;
    if (parentPhone !== undefined) admission.parentPhone = parentPhone;
    if (parentEmail !== undefined) admission.parentEmail = parentEmail;
    if (phone !== undefined) admission.phone = phone;
    if (dob !== undefined) admission.dob = dob;
    if (gender !== undefined) admission.gender = gender;
    if (address !== undefined) admission.address = address;
    if (bloodGroup !== undefined) admission.bloodGroup = bloodGroup;
    if (aadharNo !== undefined) admission.aadharNo = aadharNo;
    if (category !== undefined) admission.category = category;
    if (religion !== undefined) admission.religion = religion;
    if (nationality !== undefined) admission.nationality = nationality;
    if (previousSchool !== undefined) admission.previousSchool = previousSchool;
    if (previousClass !== undefined) admission.previousClass = previousClass;

    // Stage & Lifecycle fields
    if (stage) {
      admission.stage = stage;
      if (stage === "enrolled") {
        admission.status = "Confirmed";
      }
    }
    if (status) admission.status = status;
    if (interactionSchedule) admission.interactionSchedule = interactionSchedule;
    if (documents) admission.documents = documents;
    if (followUps) admission.followUps = followUps;
    if (feePayment) admission.feePayment = feePayment;
    if (counsellor) admission.counsellor = counsellor;
    if (followUpText) admission.followUpText = followUpText;

    await admission.save();

    return successResponse(res, "Admission updated successfully", admission);
  } catch (err) {
    console.error("UPDATE ADMISSION DETAILS ERROR:", err);
    return errorResponse(res, err.message || "Failed to update admission details", 500);
  }
};

