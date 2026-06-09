const FeeStructure = require("../../models/FeeStructure");
const FeePayment = require("../../models/FeePayment");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= SAVE FEE STRUCTURE ================= */
exports.saveFeeStructure = async (req, res) => {
  try {
    const { classId, heads } = req.body;
    const instituteId = req.user.instituteId || req.user.id;

    if (!classId || !heads) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const structure = await FeeStructure.findOneAndUpdate(
      { instituteId, classId },
      { heads },
      { upsert: true, new: true }
    );

    return successResponse(res, "Fee structure saved successfully", structure);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to save fee structure");
  }
};

/* ================= COLLECT FEES ================= */
exports.collectFees = async (req, res) => {
  try {
    const { studentId, amount, method, date } = req.body;
    const instituteId = req.user.instituteId || req.user.id;

    if (!studentId || !amount) {
      return errorResponse(res, "Missing student or amount", 400);
    }

    const invoiceNo = "INV-" + Date.now().toString().slice(-8);

    const payment = await FeePayment.create({
      instituteId,
      studentId,
      amount,
      method,
      date: date || new Date(),
      invoiceNo
    });

    return successResponse(res, "Payment recorded successfully", payment);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to record payment");
  }
};

/* ================= GET INVOICES ================= */
exports.getInvoices = async (req, res) => {
  try {
    const instituteId = req.user.instituteId || req.user.id;
    const invoices = await FeePayment.find({ instituteId })
      .populate("studentId", "name rollNo")
      .sort({ date: -1 });

    return successResponse(res, "Invoices loaded", invoices);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load invoices");
  }
};

/* ================= GET STUDENT FEE SUMMARY ================= */
exports.getStudentFeeSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const instituteId = req.user.instituteId || req.user.id;

    const Student = require("../../models/Student");
    const student = await Student.findById(studentId).populate("classId");

    if (!student) return errorResponse(res, "Student not found", 404);

    // Get Fee Structure for student's class
    const structure = await FeeStructure.findOne({ 
      instituteId, 
      classId: student.classId._id 
    });

    // Get Payment History
    const payments = await FeePayment.find({ instituteId, studentId })
      .sort({ date: -1 });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const structureTotal = structure ? structure.heads.reduce((sum, h) => sum + h.amount, 0) : 0;
    
    // For simplicity, we assume one "cycle" of fees for now
    const totalDue = Math.max(0, structureTotal - totalPaid);

    return successResponse(res, "Student fee summary loaded", {
      student,
      structure: structure ? structure.heads : [],
      payments,
      totalDue,
      totalPaid,
      lastPayment: payments[0] || null
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load fee summary");
  }
};

/* ================= GET RECENT ACTIVITY ================= */
exports.getRecentActivity = async (req, res) => {
  try {
    const instituteId = req.user.instituteId || req.user.id;
    const activity = await FeePayment.find({ instituteId })
      .populate("studentId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    return successResponse(res, "Recent activity loaded", activity);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load recent activity");
  }
};
