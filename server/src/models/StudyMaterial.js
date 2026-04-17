const mongoose = require("mongoose");

const StudyMaterialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    fileUrl: { type: String, required: true },
    fileName: { type: String },
    fileType: { type: String },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyMaterial", StudyMaterialSchema);
