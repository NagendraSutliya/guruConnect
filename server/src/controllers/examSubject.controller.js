const ExamSubject = require("../models/ExamSubject");
const { successResponse, errorResponse } = require("../utils/response");

exports.createExamSubject = async (req, res) => {
  try {
    const { examId, subjectId, date, startTime, endTime, maxMarks } = req.body;

    if (!examId || !subjectId || !date) {
      return errorResponse(res, "Missing required fields");
    }

    const examSubject = await ExamSubject.create({
      examId,
      subjectId,
      date,
      startTime,
      endTime,
      maxMarks: maxMarks || 100,
      instituteId: req.user.instituteId, // ✅ IMPORTANT
    });

    return successResponse(res, "Exam subject created", examSubject);
  } catch (err) {
    // ✅ Handle duplicate error properly
    if (err.code === 11000) {
      return errorResponse(res, "Subject already added to this exam");
    }
    return errorResponse(res, "Failed to create exam subject");
  }
};

exports.getExamSubjects = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!examId) {
      return errorResponse(res, "Exam ID is required");
    }

    const subjects = await ExamSubject.find({
      examId,
      instituteId: req.user.instituteId,
    })
      .populate("subjectId", "name")
      .populate("examId", "name")
      .sort({ date: 1 });

    return successResponse(res, "Exam subjects fetched", subjects);
  } catch (err) {
    return errorResponse(res, "Failed to fetch exam subjects");
  }
};

exports.getAllExamSubjects = async (req, res) => {
  try {
    const data = await ExamSubject.find()
      .populate("subjectId", "name")
      .populate("examId", "_id");

    return successResponse(res, "All exam subjects", data);
  } catch (err) {
    return errorResponse(res, "Failed to fetch exam subjects");
  }
};
