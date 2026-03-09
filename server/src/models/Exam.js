const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      default: null,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    date: { type: Date, required: true },
    startTime: String,
    endTime: String,
    status: {
      type: String,
      enum: ["upcoming", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
