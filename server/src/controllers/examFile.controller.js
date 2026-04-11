const ExamFile = require("../models/ExamFile");
const Exam = require("../models/Exam");
const fs = require("fs");
const { successResponse, errorResponse } = require("../utils/response");

/* ================= UPLOAD MULTIPLE ================= */
exports.uploadMultipleFiles = async (req, res) => {
  try {
    const { examId, subjectId, type } = req.body;

    if (!examId || !subjectId || !type) {
      return errorResponse(res, "Missing required fields", 400);
    }

    if (!["question", "answer"].includes(type)) {
      return errorResponse(res, "Invalid type", 400);
    }

    if (!req.files || req.files.length === 0) {
      return errorResponse(res, "No files uploaded", 400);
    }

    // ✅ Fetch exam and check status
    const exam = await Exam.findById(examId);
    if (!exam) {
      return errorResponse(res, "Exam not found", 404);
    }
    if (type === "answer" && exam.status !== "completed") {
      return errorResponse(
        res,
        "Cannot upload answers before exam is completed",
        400
      );
    }

    // ✅ Prevent duplicate question upload
    if (type === "question") {
      const existing = await ExamFile.findOne({
        examId,
        subjectId,
        type: "question",
      });
      if (existing) {
        return errorResponse(
          res,
          "Question paper already uploaded for this subject",
          400
        );
      }
    }

    const records = req.files.map((file) => ({
      examId,
      subjectId,
      type,
      fileUrl: "/" + file.path.replace(/\\/g, "/"),
      fileName: file.originalname,
      uploadedBy: req.user?._id || null,
    }));

    await ExamFile.insertMany(records);

    return successResponse(res, "Files uploaded successfully", records);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Upload failed");
  }
};

/* ================= SAVE TYPED PAPER ================= */
exports.saveTypedPaper = async (req, res) => {
  try {
    const { examId, subjectId, content } = req.body;

    if (!examId || !subjectId || !content) {
      return errorResponse(res, "All fields are required", 400);
    }

    const paper = await ExamFile.findOneAndUpdate(
      { examId, subjectId, type: "typed" },
      { content, uploadedBy: req.user?._id || null },
      { new: true, upsert: true }
    );

    return successResponse(res, "Paper saved successfully", paper);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to save paper");
  }
};

/* ================= GET FILES ================= */
exports.getFiles = async (req, res) => {
  try {
    const { examId, subjectId, type } = req.query;

    const query = {};
    if (examId) query.examId = examId;
    if (subjectId) query.subjectId = subjectId;
    if (type) query.type = type;

    const files = await ExamFile.find(query).sort({ createdAt: -1 });

    return successResponse(res, "Files fetched successfully", files);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch files");
  }
};

/* ================= DELETE FILE ================= */
exports.deleteFile = async (req, res) => {
  try {
    const file = await ExamFile.findById(req.params.id);

    if (!file) {
      return errorResponse(res, "File not found", 404);
    }

    // Delete from disk
    if (file.fileUrl) {
      const filePath = file.fileUrl.replace(/^\/+/, "");
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await file.deleteOne();

    return successResponse(res, "File deleted successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to delete file");
  }
};
