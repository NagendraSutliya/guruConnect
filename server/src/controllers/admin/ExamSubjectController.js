const ExamSubject = require("../../models/ExamSubject");
const { successResponse, errorResponse } = require("../../utils/response");

// ============ CREATE EXAMS ==============
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

// ============ GET EXAMS ==============
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

// ============ GET ALL EXAMS ==============
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

// ============ UPDATE EXAMS ==============
exports.updateExamSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, maxMarks } = req.body;

    if (!id) return errorResponse(res, "Exam Subject ID is required");

    const updated = await ExamSubject.findOneAndUpdate(
      {
        _id: id,
        instituteId: req.user.instituteId,
      },
      { date, startTime, endTime, maxMarks },
      { new: true }
    );

    if (!updated) return errorResponse(res, "Exam Subject not found");

    return successResponse(res, "Exam subject updated", updated);
  } catch (err) {
    return errorResponse(res, "Failed to update exam subject");
  }
};

// ============ DELETE EXAMS ==============
exports.deleteExamSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return errorResponse(res, "Exam Subject ID is required");

    const deleted = await ExamSubject.findByIdAndDelete(id);

    if (!deleted) return errorResponse(res, "Exam Subject not found");

    return successResponse(res, "Exam subject deleted", deleted);
  } catch (err) {
    return errorResponse(res, "Failed to delete exam subject");
  }
};
