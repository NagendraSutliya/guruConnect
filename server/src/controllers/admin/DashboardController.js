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

    const [
      teachers,
      students,
      totalFeedback,
      feedbackToday,
      avgRating,
      newTeachersToday,
    ] = await Promise.all([
      Teacher.countDocuments({ instituteId }),
      Student.countDocuments({ instituteId }), // ✅ FIXED
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
      students,
      totalFeedback,
      feedbackToday,
      avgRating: avgRating[0]?.avg || 0,
      newTeachersToday,
      plan: institute?.plan || "free",
    });
  } catch (err) {
    return errorResponse(res, "Failed to load stats");
  }
};
