const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../../models/Student");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= STUDENT LOGIN ================= */
exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return errorResponse(res, "Student not found", 404);

    if (!student.isActive) return errorResponse(res, "Account disabled", 403);

    const ok = await bcrypt.compare(password, student.password);
    if (!ok) return errorResponse(res, "Invalid credentials", 401);

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return successResponse(res, "Login success", { token });
  } catch (err) {
    return errorResponse(res, "Login failed");
  }
};
