const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    academicYearId: { type: String, ref: "AcademicYear", required: true },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);
