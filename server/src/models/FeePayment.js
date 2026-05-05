const mongoose = require("mongoose");

const FeePaymentSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amount: { type: Number, required: true },
    method: { 
      type: String, 
      enum: ["cash", "online", "cheque"],
      default: "cash"
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Cancelled"],
      default: "Paid"
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Or Teacher
    },
    remarks: { type: String },
    date: { type: Date, default: Date.now },
    invoiceNo: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeePayment", FeePaymentSchema);
