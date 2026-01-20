const mongoose = require("mongoose");

const PublicLinksSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
    unique: true,
  },
  // instituteCode: { type: String, required: true },
  // teacherId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Teacher",
  //   // required: true,
  // },
  linkCode: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PublicLink", PublicLinksSchema);
