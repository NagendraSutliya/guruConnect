const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Teacher = require("../../models/Teacher");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= TEACHER LOGIN ================= */
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Missing credentials", 400);
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    if (teacher.status === "inactive") {
      return errorResponse(
        res,
        "Your account has been deactivated. Contact admin.",
        403
      );
    }

    const ok = await bcrypt.compare(password, teacher.password);
    if (!ok) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    const token = jwt.sign(
      {
        id: teacher._id,
        role: "teacher",
        instituteId: teacher.instituteId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return successResponse(res, "Login successful", {
      token,
      role: "teacher",
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      instituteId: teacher.instituteId,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Teacher login failed");
  }
};
