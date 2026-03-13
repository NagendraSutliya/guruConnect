const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    rollNo: {
      type: Number,
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* Prevent duplicate roll numbers in same class/section */
studentSchema.index({ classId: 1, sectionId: 1, rollNo: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
