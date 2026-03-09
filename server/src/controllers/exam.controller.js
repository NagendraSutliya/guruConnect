const Exam = require("../models/Exam");
const { successResponse, errorResponse } = require("../utils/response");

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .sort({ date: 1 });
    return successResponse(res, "Exams loaded", exams);
  } catch (err) {
    return errorResponse(res, "Failed to load exams");
  }
};

exports.createExam = async (req, res) => {
  try {
    const { name, classId, sectionId, subjectId, date, startTime, endTime } =
      req.body;

    if (!name || !classId || !subjectId || !date) {
      return errorResponse(res, "Missing required fields");
    }

    const exam = await Exam.create({
      name,
      classId,
      sectionId: sectionId || null,
      subjectId,
      date,
      startTime,
      endTime,
    });
    return successResponse(res, "Exam created", exam);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to create exam");
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { name, classId, sectionId, subjectId, date, startTime, endTime } =
      req.body;

    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        name,
        classId,
        sectionId: sectionId || null,
        subjectId,
        date,
        startTime,
        endTime,
      },
      { new: true, runValidators: true }
    )
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("subjectId", "name");

    if (!updatedExam) {
      return errorResponse(res, "Exam not found");
    }

    return successResponse(res, "Exam updated successfully", updatedExam);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to update exam");
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
