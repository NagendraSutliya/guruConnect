const mongoose = require("mongoose");

const FeeStructureSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    heads: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        type: { 
          type: String, 
          enum: ["monthly", "one-time", "quarterly", "annual"],
          default: "monthly"
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeeStructure", FeeStructureSchema);
