const Result = require("../models/Result");

exports.adminResults = async (req, res) => {
  const { examId, classId } = req.query;

  const filter = {};

  if (examId) filter.examId = examId;

  let results = await Result.find(filter)
    .populate({
      path: "studentId",
      select: "name classId",
      match: classId ? { classId } : {},
    })
    .populate("examId", "name");

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
};
