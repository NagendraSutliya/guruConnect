const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    // instituteCode: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true, // public sharing code
    // },
    role: { type: String, default: "teacher" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
