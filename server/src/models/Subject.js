const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: prevent duplicate subjects in same class+section+institute
subjectSchema.index(
  { name: 1, classId: 1, sectionId: 1, instituteId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
