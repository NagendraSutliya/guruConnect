const Feedback = require("../models/Feedback.js");
const { successResponse, errorResponse } = require("../utils/response.js");

/* ================= DASHBOARD STATS ================= */

const getTeacherStats = async (req, res) => {
  try {
    const total = await Feedback.countDocuments({ teacherId: req.user.id });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await Feedback.countDocuments({
      teacherId: req.user.id,
      createdAt: { $gte: today },
    });

    return successResponse(res, "Stats loaded", {
      total,
      today: todayCount,
    });
  } catch (err) {
    return errorResponse(res, "Failed to load stats");
  }
};

/* ================= DASHBOARD OVERVIEW ================= */

const getTeacherOverview = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [total, positive, neutral, negative] = await Promise.all([
      Feedback.countDocuments({ teacherId }),
      Feedback.countDocuments({ teacherId, mood: "positive" }),
      Feedback.countDocuments({ teacherId, mood: "neutral" }),
      Feedback.countDocuments({ teacherId, mood: "negative" }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await Feedback.countDocuments({
      teacherId,
      createdAt: { $gte: today },
    });

    const recent = await Feedback.find({ teacherId })
      .sort({ createdAt: -1 })
      .limit(4);

    return successResponse(res, "Overview loaded", {
      total,
      positive,
      neutral,
      negative,
      today: todayCount,
      recent,
    });
  } catch (err) {
    return errorResponse(res, "Failed to load overview");
  }
};

/* ================= FEEDBACK ================= */

const getTeacherFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      teacherId: req.user.id,
    }).sort({ createdAt: -1 });

    return successResponse(res, "Feedback loaded", feedback);
  } catch (err) {
    return errorResponse(res, "Failed to load feedback");
  }
};

module.exports = { getTeacherStats, getTeacherOverview, getTeacherFeedback };
