const mongoose = require("mongoose");

const examSubjectSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true, // ✅ IMPORTANT
    },
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
    date: {
      type: Date,
      required: true,
    },
    startTime: String,
    endTime: String,
    maxMarks: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

examSubjectSchema.index({ examId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model("ExamSubject", examSubjectSchema);
