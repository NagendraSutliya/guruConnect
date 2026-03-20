const mongoose = require("mongoose");
const Result = require("../models/Result");
const { updateOne } = require("../models/Student");
const { errorResponse, successResponse } = require("../utils/response");

// ============ ADMIN RESULT ==============
exports.adminResults = async (req, res) => {
  try {
    const { examId, examSubjectId, classId } = req.query;

    const filter = {
      instituteId: req.user.instituteId,
    };

    if (examId && mongoose.Types.ObjectId.isValid(examId)) {
      filter.examId = examId;
    }

    if (examSubjectId && mongoose.Types.ObjectId.isValid(examSubjectId)) {
      filter.examSubjectId = examSubjectId;
    }

    let results = await Result.find(filter)
      .populate({
        path: "studentId",
        select: "name classId",
        match:
          classId && mongoose.Types.ObjectId.isValid(classId)
            ? { classId }
            : {},
      })
      .populate({
        path: "examSubjectId",
        populate: [
          { path: "subjectId", select: "name" },
          { path: "examId", select: "name" },
        ],
      });

    results = results.filter((r) => r.studentId);

    const total = results.length;
    const sum = results.reduce((a, b) => a + b.marks, 0);
    const average = total ? Math.round(sum / total) : 0;

    const topper =
      results.sort((a, b) => b.marks - a.marks)[0]?.studentId?.name || "-";

    res.json({
      data: results,
      summary: { total, average, topper },
    });
  } catch (err) {
    console.error("ADMIN RESULT ERROR:", err); // 🔥 ADD THIS
    res.status(500).json({ success: false });
  }
};

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
    const { examId } = req.query;
    const results = await Result.find({
      examId,
      instituteId: req.user.instituteId,
    })
      .populate("studentId", "name rollNo")
      .populate({
        path: "examSubjectId",
        populate: { path: "subjectId", select: "name" },
      });
    // const results = await Result.find({ examSubjectId })
    //   .populate("studentId", "name rollNo")
    //   .populate({
    //     path: "examSubjectId",
    //     populate: { path: "subjectId", select: "name" },
    //   });

    res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
