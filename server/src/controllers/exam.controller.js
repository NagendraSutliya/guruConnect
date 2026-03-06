const Exam = require("../models/Exam");
const { successResponse, errorResponse } = require("../utils/response");

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ date: 1 });
    return successResponse(res, "Exams loaded", exams);
  } catch (err) {
    return errorResponse(res, "Failed to load exams");
  }
};

exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    return successResponse(res, "Exam created", exam);
  } catch (err) {
    return errorResponse(res, "Failed to create exam");
  }
};

exports.deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    return successResponse(res, "Exam deleted");
  } catch (err) {
    return errorResponse(res, "Failed to delete exam");
  }
};
