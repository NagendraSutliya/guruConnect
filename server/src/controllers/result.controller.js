const Result = require("../models/Result");
const { updateOne } = require("../models/Student");
const { errorResponse, successResponse } = require("../utils/response");

exports.adminResults = async (req, res) => {
  try {
    // const { examId, classId } = req.query;
    const { examSubjectId, classId } = req.query;

    const filter = {};

    // if (examId) filter.examId = examId;
    if (examSubjectId) filter.examSubjectId = examSubjectId;

    let results = await Result.find(filter)
      .populate({
        path: "studentId",
        select: "name classId",
        match: classId ? { classId } : {},
      })
      // .populate("examId", "name");
      .populate({
        path: "examSubjectId",
        populate: { path: "subjectId", select: "name" },
      });

    results = results.filter((r) => r.studentId); // remove unmatched

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
    res.status(500).json({ success: false });
  }
};

exports.saveResults = async (req, res) => {
  try {
    const records = req.body;

    const ops = records.map((r) => ({
      updateOne: {
        filter: {
          studentId: r.studentId,
          // examId: r.examId,
          examSubjectId: r.examSubjectId,
        },
        update: {
          studentId: r.studentId,
          // examId: r.examId,
          examSubjectId: r.examSubjectId,
          marks: r.marks,
          // maxMarks: r.maxMarks,
        },
        upsert: true,
      },
    }));

    await Result.bulkWrite(ops);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.getResults = async (req, res) => {
  try {
    // const { examId } = req.query;
    const { examSubjectId } = req.query;

    // const results = await Result.find({ examId }).populate(
    //     "studentId",
    //     "name rollNo"
    //   );
    const results = await Result.find({ examSubjectId })
      .populate("studentId", "name rollNo")
      .populate({
        path: "examSubjectId",
        populate: { path: "subjectId", select: "name" },
      });

    res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
