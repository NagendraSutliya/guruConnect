const Feedback = require("../../models/Feedback");
const Class = require("../../models/Class");
const Attendance = require("../../models/Attendance");
const Teacher = require("../../models/Teacher");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= TEACHER PROFILE ================= */
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("name email");

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    return successResponse(res, "Profile loaded", teacher);
  } catch (err) {
    return errorResponse(res, "Failed to load profile");
  }
};

/* ================= DASHBOARD STATS ================= */
exports.getTeacherStats = async (req, res) => {
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
exports.getTeacherOverview = async (req, res) => {
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

/* ================= Attendance Stats ================= */
exports.getAttendanceSummary = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // 1️⃣ Get classes assigned to teacher
    const classes = await Class.find({ teacherId }).select("_id name");

    const classIds = classes.map((c) => c._id);

    if (!classIds.length) {
      return successResponse(res, "No classes assigned", []);
    }

    // 2️⃣ Get attendance aggregation
    const attendance = await Attendance.aggregate([
      {
        $match: {
          classId: { $in: classIds },
        },
      },
      {
        $group: {
          _id: {
            classId: "$classId",
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    return successResponse(res, "Attendance summary loaded", attendance);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load attendance summary");
  }
};

/* ================= FEEDBACK ================= */
exports.getTeacherFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      teacherId: req.user.id,
    }).sort({ createdAt: -1 });

    return successResponse(res, "Feedback loaded", feedback);
  } catch (err) {
    return errorResponse(res, "Failed to load feedback");
  }
};
