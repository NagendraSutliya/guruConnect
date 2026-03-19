const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
  },
  { timestamps: true }
);

// 🔒 Prevent duplicate section names in same class + institute
sectionSchema.index({ name: 1, classId: 1, instituteId: 1 }, { unique: true });

module.exports = mongoose.model("Section", sectionSchema);
