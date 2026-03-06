const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
    marks: Number,
  },
  { timestamps: true }
);

resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
