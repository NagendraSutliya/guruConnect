const mongoose = require("mongoose");

const examFileSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  type: {
    type: String,
    enum: ["question", "answer", "typed"],
    required: true,
  },
  fileUrl: String,
  fileName: String,
  content: String, // for typed paper
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for faster queries
examFileSchema.index({ examId: 1, subjectId: 1, type: 1 });

module.exports = mongoose.model("ExamFile", examFileSchema);
