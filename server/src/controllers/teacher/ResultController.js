const mongoose = require("mongoose");
const Result = require("../../models/Result");
const Student = require("../../models/Student");
const { errorResponse, successResponse } = require("../../utils/response");

// ============ SAVE RESULT ==============
exports.saveResults = async (req, res) => {
  try {
    const { examId, examSubjectId, records } = req.body;

    if (!examId || !examSubjectId || !records) {
      return errorResponse(res, "Missing required fields");
    }

    const ops = records.map((r) => {
      if (r.marks < 0) {
        throw new Error("Marks cannot be negative");
      }
      return {
        updateOne: {
          filter: {
            studentId: r.studentId,
            examId: r.examId,
            examSubjectId: r.examSubjectId,
          },
          update: {
            $set: {
              studentId: r.studentId,
              examId: r.examId,
              examSubjectId: r.examSubjectId,
              marks: r.marks,
              instituteId: req.user.instituteId,
            },
          },
          upsert: true,
        },
      };
    });

    await Result.bulkWrite(ops);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ============ GET RESULT BY EXAM ==============
exports.getResults = async (req, res) => {
  try {
    const { examSubjectId, classId, sectionId } = req.query;

    const instituteId = req.user.instituteId;

    if (!instituteId) {
      return res.status(401).json({
        success: false,
        message: "Institute ID missing",
      });
    }

    // =========================
    // BASE FILTER (LIKE ADMIN)
    // =========================
    const filter = {
      instituteId,
    };

    if (examSubjectId && mongoose.Types.ObjectId.isValid(examSubjectId)) {
      filter.examSubjectId = examSubjectId;
    }

    // =========================
    // FETCH RESULTS DIRECTLY
    // =========================
    let results = await Result.find(filter)
      .populate({
        path: "studentId",
        select: "name rollNo classId sectionId",
      })
      .populate({
        path: "examSubjectId",
        populate: [
          { path: "subjectId", select: "name" },
          { path: "examId", select: "_id name" },
        ],
      });

    // =========================
    // APPLY CLASS / SECTION FILTER (AFTER POPULATE)
    // =========================
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      results = results.filter(
        (r) => r.studentId?.classId?.toString() === classId
      );
    }

    if (sectionId && mongoose.Types.ObjectId.isValid(sectionId)) {
      results = results.filter(
        (r) => r.studentId?.sectionId?.toString() === sectionId
      );
    }

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error("GET RESULTS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ============ DELET RESULT ==============
exports.deleteResult = async (req, res) => {
  try {
    const { studentId, examId, examSubjectId } = req.body;

    if (!studentId || !examId || !examSubjectId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    await Result.deleteOne({
      studentId,
      examId,
      examSubjectId,
      instituteId: req.user.instituteId,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE RESULT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
