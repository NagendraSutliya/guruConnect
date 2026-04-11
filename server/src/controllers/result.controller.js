const mongoose = require("mongoose");
const Result = require("../models/Result");
const Student = require("../models/Student");
const { errorResponse, successResponse } = require("../utils/response");

// ============ ADMIN RESULT ==============
exports.getAdminResults = async (req, res) => {
  try {
    const { examId, classId, sectionId } = req.query;

    const filter = {
      instituteId: req.user.instituteId,
    };

    console.log("👉 examId:", examId);
    console.log("👉 classId:", classId);
    console.log("👉 sectionId:", sectionId);

    // ✅ Apply exam filter
    if (examId && mongoose.Types.ObjectId.isValid(examId)) {
      filter.examId = examId;
    }

    // ✅ STEP 1: Get students based on class + section
    const studentFilter = {};

    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      studentFilter.classId = classId;
    }

    if (sectionId && mongoose.Types.ObjectId.isValid(sectionId)) {
      studentFilter.sectionId = sectionId;
    }

    const students = await Student.find(studentFilter).select("_id name");

    const studentIds = students.map((s) => s._id);

    console.log("👉 students found:", students.length);
    console.log("👉 studentIds:", studentIds);

    // ✅ If no students found → return empty
    if (studentIds.length === 0) {
      return res.json({
        data: [],
        summary: { total: 0, average: 0, topper: "-" },
      });
    }

    // ✅ STEP 2: Filter results using studentIds
    filter.studentId = { $in: studentIds };

    const results = await Result.find(filter)
      .populate("studentId", "name classId section")
      .populate({
        path: "examSubjectId",
        populate: [
          { path: "subjectId", select: "name" },
          { path: "examId", select: "name" },
        ],
      });
    console.log("👉 filter used:", filter);
    console.log("👉 results found:", results.length);
    // ✅ STEP 3: Compute summary
    const studentTotals = {};

    results.forEach((r) => {
      if (!r.studentId) return;

      const id = r.studentId._id.toString();

      if (!studentTotals[id]) {
        studentTotals[id] = {
          name: r.studentId.name,
          total: 0,
        };
      }

      studentTotals[id].total += r.marks;
    });

    const totalStudents = Object.keys(studentTotals).length;

    const totalMarksSum = Object.values(studentTotals).reduce(
      (sum, s) => sum + s.total,
      0
    );

    const averageMarks = totalStudents
      ? Math.round(totalMarksSum / totalStudents)
      : 0;

    // ✅ Find topper
    let topper = "-";
    if (totalStudents > 0) {
      const topEntry = Object.values(studentTotals).sort(
        (a, b) => b.total - a.total
      )[0];

      topper = topEntry?.name || "-";
    }

    res.json({
      data: results,
      summary: {
        total: totalStudents,
        average: averageMarks,
        topper,
      },
    });
  } catch (err) {
    console.error("ADMIN RESULT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
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
