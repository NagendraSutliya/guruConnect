const mongoose = require("mongoose");
const Exam = require("../../models/Exam");
const { successResponse, errorResponse } = require("../../utils/response");
const ExamSubject = require("../../models/ExamSubject");
const TeacherAssignment = require("../../models/TeacherAssignment");
const { getExamStatus } = require("../../utils/examStatus");

// ============ GET EXAMS ==============
exports.getExams = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    const filter = { instituteId: req.user.instituteId };

    // ✅ SAFE classId
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      filter.classId = classId; // no need to convert manually
    }

    // ✅ SAFE sectionId
    if (sectionId && mongoose.Types.ObjectId.isValid(sectionId)) {
      filter.$or = [{ sectionId: sectionId }, { sectionId: null }];
    }

    const exams = await Exam.find(filter)
      .populate("classId", "name")
      .populate("sectionId", "name");

    // Get all subjects for these exams
    const examSubjects = await ExamSubject.find({
      examId: { $in: exams.map((e) => e._id) },
      instituteId: req.user.instituteId,
    }).populate("subjectId", "name");

    // Add subjects + status
    const examsWithStatus = exams.map((exam) => {
      const subjects = examSubjects.filter(
        (s) => s.examId.toString() === exam._id.toString()
      );
      return {
        ...exam.toObject(),
        subjects,
        status: getExamStatus(subjects),
      };
    });

    // res.json({ success: true, data: examsWithStatus });

    //     res.json({
    //       success: true,
    //       data: exams,
    //     });

    return successResponse(res, "Exams fetched successfully", examsWithStatus);
  } catch (err) {
    console.error(err);
    // res.status(500).json({ success: false, message: "Failed to fetch exams" });
    errorResponse(res, "Failed to fetch exams");
  }
};

// // ============ CREATE EXAMS ==============
// exports.createExam = async (req, res) => {
//   try {
//     const { name, classId, sectionId } = req.body;
//     if (!name || !classId) {
//       return errorResponse(res, "Missing required fields");
//     }

//     const exam = await Exam.create({
//       name,
//       classId,
//       sectionId: sectionId || null,
//       instituteId: req.user.instituteId, // ✅ IMPORTANT
//     });

//     return successResponse(res, "Exam created", exam);
//   } catch (err) {
//     console.log(err);
//     return errorResponse(res, "Failed to create exam");
//   }
// };

// // ============ UPDATE EXAMS ==============
// exports.updateExam = async (req, res) => {
//   try {
//     const { name, classId, sectionId } = req.body;

//     const updatedExam = await Exam.findByIdAndUpdate(
//       req.params.id,
//       {
//         name,
//         classId,
//         sectionId: sectionId || null,
//         // subjectId,
//         // date,
//         // startTime,
//         // endTime,
//       },
//       { new: true, runValidators: true }
//     )
//       .populate("classId", "name")
//       .populate("sectionId", "name");
//     // .populate("subjectId", "name");

//     if (!updatedExam) {
//       return errorResponse(res, "Exam not found");
//     }

//     return successResponse(res, "Exam updated successfully", updatedExam);
//   } catch (err) {
//     console.error(err);
//     return errorResponse(res, "Failed to update exam");
//   }
// };

// // ============ DELETE EXAMS ==============
// exports.deleteExam = async (req, res) => {
//   try {
//     await Exam.findByIdAndDelete(req.params.id);
//     return successResponse(res, "Exam deleted");
//   } catch (err) {
//     return errorResponse(res, "Failed to delete exam");
//   }
// };

// ============ GET FULL EXAMS (EXAM + SUBJECTS) ==============

exports.getFullExams = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // ✅ STEP 1: Get assignments
    const assignments = await TeacherAssignment.find({
      teacherId,
    });

    if (!assignments.length) {
      return successResponse(res, "No assignments found", []);
    }

    // ✅ STEP 2: Extract class + subject IDs
    const classIds = [...new Set(assignments.map((a) => a.classId.toString()))];

    const subjectIds = [
      ...new Set(assignments.map((a) => a.subjectId.toString())),
    ];

    // ✅ STEP 3: Get exams for those classes
    const exams = await Exam.find({
      instituteId: req.user.instituteId,
      classId: { $in: classIds },
    })
      .populate("classId", "name")
      .populate("sectionId", "name");

    const examIds = exams.map((e) => e._id);

    // ✅ STEP 4: Get exam subjects
    const examSubjects = await ExamSubject.find({
      examId: { $in: examIds },
      instituteId: req.user.instituteId,
    }).populate("subjectId", "name");

    // ✅ STEP 5: FILTER SUBJECTS (IMPORTANT 🔥)
    const result = exams.map((exam) => {
      const subjects = examSubjects.filter(
        (s) =>
          s.examId.toString() === exam._id.toString() &&
          subjectIds.includes(s.subjectId._id.toString()) // ✅ FILTER HERE
      );

      return {
        ...exam.toObject(),
        subjects,
        status: getExamStatus(subjects),
      };
    });

    // ✅ OPTIONAL: remove exams with no subjects
    const filteredResult = result.filter((e) => e.subjects.length > 0);

    return successResponse(res, "Teacher exams fetched", filteredResult);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch exams");
  }
};
