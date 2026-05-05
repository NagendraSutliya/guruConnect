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
    
    // --- Employment ---
    employeeId: { type: String, unique: true, sparse: true },
    designation: { type: String },
    qualification: { type: String },
    joiningDate: { type: Date, default: Date.now },
    specialization: [String],

    // --- Contact ---
    phone: { type: String },
    emergencyPhone: { type: String },
    address: { type: String },

    // --- Financial ---
    panNo: { type: String },
    bankAccountNo: { type: String },
    ifscCode: { type: String },
    basicSalary: { type: Number, default: 0 },

    role: { type: String, default: "teacher" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
