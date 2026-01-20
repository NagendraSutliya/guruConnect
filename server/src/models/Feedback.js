const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
  },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  // instituteCode: { type: String, required: true },
  classOrBatch: String,
  teacherName: String,
  category: String,
  message: String,
  mood: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
