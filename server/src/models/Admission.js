const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    // --- Identification ---
    admissionNo: { type: String },
    enrollmentNo: { type: String, default: null },
    admissionDate: { type: Date, default: Date.now },
    aadharNo: { type: String },
    category: { type: String },
    religion: { type: String },
    nationality: { type: String, default: "Indian" },
    
    // --- Academic History ---
    previousSchool: { type: String },
    previousClass: { type: String },
    
    // --- Academic Target ---
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },

    // --- Personal & Contact ---
    parentName: { type: String },
    parentPhone: { type: String },
    parentEmail: { type: String },
    phone: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other", ""] },
    address: { type: String },
    bloodGroup: { type: String },
    
    // --- Admission Specific ---
    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      default: "Pending"
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    } // Populated after confirmation
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admission", admissionSchema);
