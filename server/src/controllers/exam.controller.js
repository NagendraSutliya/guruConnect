const mongoose = require("mongoose");
const Exam = require("../models/Exam");
const { successResponse, errorResponse } = require("../utils/response");

// ============ GET EXAMS ==============
exports.getExams = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    const filter = {};

    // ✅ SAFE classId
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      filter.classId = classId; // no need to convert manually
    }

    // ✅ SAFE sectionId
    if (sectionId && mongoose.Types.ObjectId.isValid(sectionId)) {
      filter.$or = [{ sectionId: sectionId }, { sectionId: null }];
    }

    console.log("FILTER =>", filter); // 🔥 debug
    const exams = await Exam.find(filter)
      .populate("classId", "name")
      .populate("sectionId", "name");
    //  .populate("subjectId", "name")
    //  .sort({ date: 1 })
    res.json({
      success: true,
      data: exams,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
    });
  }
};

// ============ CREATE EXAMS ==============
exports.createExam = async (req, res) => {
  try {
    console.log("REQ USER =>", req.user); // debug
    const { name, classId, sectionId } = req.body;

    if (!name || !classId) {
      return errorResponse(res, "Missing required fields");
    }

    const exam = await Exam.create({
      name,
      classId,
      sectionId: sectionId || null,
      instituteId: req.user.instituteId, // ✅ IMPORTANT
    });

    return successResponse(res, "Exam created", exam);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to create exam");
  }
};

// ============ UPDATE EXAMS ==============
exports.updateExam = async (req, res) => {
  try {
    // const { name, classId, sectionId, subjectId, date, startTime, endTime } =
    //   req.body;

    const { name, classId, sectionId } = req.body;

    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        name,
        classId,
        sectionId: sectionId || null,
        // subjectId,
        // date,
        // startTime,
        // endTime,
      },
      { new: true, runValidators: true }
    )
      .populate("classId", "name")
      .populate("sectionId", "name");
    // .populate("subjectId", "name");

    if (!updatedExam) {
      return errorResponse(res, "Exam not found");
    }

    return successResponse(res, "Exam updated successfully", updatedExam);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to update exam");
  }
};

// ============ DELETE EXAMS ==============
exports.deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    return successResponse(res, "Exam deleted");
  } catch (err) {
    return errorResponse(res, "Failed to delete exam");
  }
};
