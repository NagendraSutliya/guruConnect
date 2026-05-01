const Teacher = require("../../models/Teacher.js");
const Student = require("../../models/Student.js");
const Feedback = require("../../models/Feedback.js");
const Institute = require("../../models/Institute.js");
const { successResponse, errorResponse } = require("../../utils/response.js");

exports.getAdminStats = async (req, res) => {
  try {
    const instituteId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const institute = await Institute.findById(instituteId).select("plan");

    const classes = await require("../../models/Class.js").find({ instituteId }).select("_id");
    const classIds = classes.map((c) => c._id);

    const [
      teachers,
      students,
      totalFeedback,
      feedbackToday,
      avgRating,
      newTeachersToday,
    ] = await Promise.all([
      Teacher.countDocuments({ instituteId }),
      Student.countDocuments({ classId: { $in: classIds } }),
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

    // --- Trend Data (Last 7 Days) ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const getDailyTrend = async (model, filter = {}) => {
      const trend = await model.aggregate([
        {
          $match: {
            ...filter,
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      return trend;
    };

    const [teacherTrend, feedbackTrend, studentTrend] = await Promise.all([
      getDailyTrend(Teacher, { instituteId }),
      getDailyTrend(Feedback, { instituteId }),
      getDailyTrend(Student, { classId: { $in: classIds } }),
    ]);

    return successResponse(res, "Admin stats loaded", {
      teachers,
      students,
      totalFeedback,
      feedbackToday,
      avgRating: avgRating[0]?.avg || 0,
      newTeachersToday,
      plan: institute?.plan || "free",
      trends: {
        teachers: teacherTrend,
        students: studentTrend,
        feedback: feedbackTrend,
      },
    });
  } catch (err) {
    return errorResponse(res, "Failed to load stats");
  }
};
