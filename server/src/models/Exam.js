const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    name: { type: String, required: true, trim: true },
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
    // subjectId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Subject",
    //   required: true,
    // },
    // date: { type: Date, required: true },
    // startTime: String,
    // endTime: String,
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
