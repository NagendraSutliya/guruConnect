const mongoose = require("mongoose");

const InstituteSchema = new mongoose.Schema({
  instituteName: { type: String, required: true },
  instituteCode: { type: String, default: null, index: true },
  instituteType: { type: String, enum: ["school", "tuition"], required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationExpires: Date,
  plan: { type: String, default: "free" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Institute", InstituteSchema);
