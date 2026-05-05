const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    // --- Identification ---
    admissionNo: { type: String, unique: true, sparse: true },
    enrollmentNo: { type: String, default: null },
    admissionDate: { type: Date, default: Date.now },
    aadharNo: { type: String },
    category: { type: String },
    religion: { type: String },
    nationality: { type: String, default: "Indian" },
    
    // --- Academic History ---
    previousSchool: { type: String },
    previousClass: { type: String },
    
    // --- Academic ---
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

    // --- Personal & Contact ---
    parentName: { type: String },
    parentPhone: { type: String },
    phone: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: { type: String },
    bloodGroup: { type: String },
    
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* Prevent duplicate roll numbers in same class/section */
studentSchema.index({ classId: 1, sectionId: 1, rollNo: 1 }, { unique: true });

module.exports = mongoose.model("Student", studentSchema);
