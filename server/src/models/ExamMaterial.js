// models/ExamMaterial.js
const mongoose = require("mongoose");

const examMaterialSchema = new mongoose.Schema(
  {
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
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    type: {
      type: String,
      enum: ["file", "link", "text"],
      required: true,
    },

    fileUrl: String, // for PDF/image
    link: String, // for drive link
    content: String, // for notes
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamMaterial", examMaterialSchema);
