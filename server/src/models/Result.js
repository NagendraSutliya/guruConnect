const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    examSubjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamSubject",
      required: true,
    },
    marks: { type: Number, required: true },
    maxMarks: { type: Number },
  },
  { timestamps: true }
);

resultSchema.index({ studentId: 1, examSubjectId: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
