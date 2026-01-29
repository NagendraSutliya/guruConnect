const bcrypt = require("bcrypt");
const Teacher = require("../models/Teacher.js");
const Feedback = require("../models/Feedback.js");
const PublicLink = require("../models/PublicLink.js");
const Institute = require("../models/Institute.js");
const { successResponse, errorResponse } = require("../utils/response.js");

/* ===================== TEACHERS ===================== */

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ instituteId: req.user.id })
      .select("-password")
      .sort({ createdAt: -1 });

    return successResponse(res, "Teachers fetched", teachers);
  } catch (err) {
    return errorResponse(res, "Failed to fetch teachers");
  }
};

const createTeacher = async (req, res) => {
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

const deactivateTeacher = async (req, res) => {
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

/* ===================== DASHBOARD STATS ===================== */

const getAdminStats = async (req, res) => {
  try {
    const instituteId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const institute = await Institute.findById(instituteId).select("plan");

    const [
      teachers,
      totalFeedback,
      feedbackToday,
      avgRating,
      newTeachersToday,
    ] = await Promise.all([
      Teacher.countDocuments({ instituteId }),
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
      students: 0, // placeholder
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

const getTeachersFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ instituteId: req.user.id })
      .populate("teacherId", "name")
      .sort({ createdAt: -1 });

    return successResponse(res, "Feedback fetched", feedback);
  } catch (err) {
    return errorResponse(res, "Failed to fetch feedback");
  }
};

const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    return successResponse(res, "Feedback deleted");
  } catch (err) {
    return errorResponse(res, "Failed to delete feedback");
  }
};

/* ===================== PUBLIC LINK ===================== */

const getPublicLink = async (req, res) => {
  try {
    const link = await PublicLink.findOne({ instituteId: req.user.id });
    return successResponse(res, "Link fetched", link);
  } catch (err) {
    return errorResponse(res, "Failed to fetch link");
  }
};

const createPublicLink = async (req, res) => {
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

module.exports = {
  getTeachers,
  createTeacher,
  deactivateTeacher,
  getAdminStats,
  getTeachersFeedback,
  deleteFeedback,
  getPublicLink,
  createPublicLink,
};
