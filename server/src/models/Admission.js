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
    
    // --- Admission & CRM Specific ---
    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      default: "Pending"
    },
    stage: {
      type: String,
      enum: [
        "enquiry",
        "followup",
        "application",
        "verification",
        "test",
        "approved",
        "fee_paid",
        "enrolled",
        "rejected"
      ],
      default: "enquiry"
    },
    source: {
      type: String,
      default: "Website"
    },
    counsellor: {
      type: String,
      default: "Neha Saini"
    },
    followUpText: {
      type: String,
      default: "Follow up"
    },
    isOverdue: {
      type: Boolean,
      default: false
    },
    interactionSchedule: {
      dateTimeRoom: { type: String, default: "" },
      outcome: { type: String, default: "Not held yet" }
    },
    documents: [
      {
        id: String,
        title: String,
        meta: String,
        status: { type: String, default: "Pending" }
      }
    ],
    followUps: [
      {
        id: String,
        dateType: String,
        text: String
      }
    ],
    feePayment: {
      amount: { type: Number, default: 0 },
      receiptNo: { type: String, default: "" },
      paidAt: { type: Date },
      mode: { type: String, default: "Cash" },
      isPaid: { type: Boolean, default: false }
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    } // Populated after confirmation
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admission", admissionSchema);
