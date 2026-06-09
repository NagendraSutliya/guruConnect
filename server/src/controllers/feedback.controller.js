const Feedback = require("../models/Feedback.js");
const { successResponse, errorResponse } = require("../utils/response.js");

const submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    return successResponse(res, "Feedback submitted", feedback, 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isDeleted: false });
    return successResponse(res, "Feedback fetched", feedbacks);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { submitFeedback, getAllFeedback };
