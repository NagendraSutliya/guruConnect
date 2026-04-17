const bcrypt = require("bcrypt");
const Teacher = require("../models/Teacher.js");
const Feedback = require("../models/Feedback.js");
const PublicLink = require("../models/PublicLink.js");
const Institute = require("../models/Institute.js");
const { successResponse, errorResponse } = require("../utils/response.js");
const Student = require("../models/Student.js");

/* ================= ADMIN PROFILE ================= */
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Institute.findById(req.user.id).select(
      "instituteName email"
    );

    return successResponse(res, "Admin profile", admin);
  } catch (err) {
    return errorResponse(res, "Failed to load profile");
  }
};

/* ===================== TEACHERS ===================== */

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
    const hashed = await bcrypt.hash(req.body.password, 10);

    const teacher = await Teacher.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
      instituteId: req.user.id,
      role: "teacher",
    });

    return successResponse(res, "Teacher created", teacher, 201);
  } catch (err) {
    return errorResponse(res, "Teacher creation failed");
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

    console.log("Deactivate ID:", req.params.id);
    console.log("Institute:", req.user.id);

    return successResponse(res, "Teacher deactivated", teacher);
  } catch (err) {
    return errorResponse(res, "Failed to deactivate teacher");
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

exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const updateData = { name, email };
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
    console.error("Update teacher error:", err);
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
    console.error("Delete teacher error:", err);
    return errorResponse(res, "Failed to delete teacher");
  }
};

/* ===================== DASHBOARD STATS ===================== */

exports.getAdminStats = async (req, res) => {
  try {
    const instituteId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const institute = await Institute.findById(instituteId).select("plan");

    const [
      teachers,
      students,
      totalFeedback,
      feedbackToday,
      avgRating,
      newTeachersToday,
    ] = await Promise.all([
      Teacher.countDocuments({ instituteId }),
      Student.countDocuments({ classId: { $exists: true } }),
      Feedback.countDocuments({ instituteId }),
      Feedback.countDocuments({
        instituteId,
        createdAt: { $gte: today },
      }),
      Feedback.aggregate([
        { $match: { instituteId } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
      Teacher.countDocuments({
        instituteId,
        createdAt: { $gte: today },
      }),
    ]);

    return successResponse(res, "Admin stats loaded", {
      teachers,
      students, // : 0, // placeholder
      totalFeedback,
      feedbackToday,
      avgRating: avgRating[0]?.avg || 0,
      newTeachersToday,
      plan: institute?.plan || "free",
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return errorResponse(res, "Failed to load stats");
  }
};

/* ===================== FEEDBACK ===================== */

exports.getTeachersFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ instituteId: req.user.id })
      .populate("teacherId", "name")
      .sort({ createdAt: -1 });

    return successResponse(res, "Feedback fetched", feedback);
  } catch (err) {
    return errorResponse(res, "Failed to fetch feedback");
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    return successResponse(res, "Feedback deleted");
  } catch (err) {
    return errorResponse(res, "Failed to delete feedback");
  }
};

/* ===================== PUBLIC LINK ===================== */

exports.getPublicLink = async (req, res) => {
  try {
    const link = await PublicLink.findOne({ instituteId: req.user.id });
    return successResponse(res, "Link fetched", link);
  } catch (err) {
    return errorResponse(res, "Failed to fetch link");
  }
};

exports.createPublicLink = async (req, res) => {
  try {
    const existing = await PublicLink.findOne({ instituteId: req.user.id });
    if (existing) {
      return successResponse(res, "Link already exists", existing);
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const link = await PublicLink.create({
      instituteId: req.user.id,
      linkCode: code,
    });

    return successResponse(res, "Public link created", link, 201);
  } catch (err) {
    return errorResponse(res, "Failed to create public link");
  }
};
