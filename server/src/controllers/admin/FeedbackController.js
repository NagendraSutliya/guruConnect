const Feedback = require("../../models/Feedback.js");
const { successResponse, errorResponse } = require("../../utils/response.js");

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
