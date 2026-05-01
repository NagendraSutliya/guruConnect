const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Institute = require("../../models/Institute");
const { generateVerificationCode } = require("../../utils/verificationCode");
const { sendVerificationCode } = require("../../utils/mailer");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= INSTITUTE REGISTER ================= */
exports.registerInstitute = async (req, res) => {
  try {
    const { instituteName, instituteType, email, password } = req.body;

    if (!instituteName || !email || !password) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const exists = await Institute.findOne({ email });
    if (exists) {
      return errorResponse(res, "Email already registered", 400);
    }

    const hashed = await bcrypt.hash(password, 10);

    const instituteCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const code = generateVerificationCode();

    await Institute.create({
      instituteName,
      instituteType,
      email,
      password: hashed,
      instituteCode,
      verificationCode: code,
      verificationExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendVerificationCode(email, code);

    return successResponse(res, "Institute verification code sent to email");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Registration failed");
  }
};

/* ================= INSTITUTE VERIFY ================= */
exports.verifyInstitute = async (req, res) => {
  try {
    const { email, code } = req.body;

    const inst = await Institute.findOne({ email });
    if (!inst) {
      return errorResponse(res, "Institute not found", 404);
    }

    if (inst.isVerified) {
      return successResponse(res, "Already verified");
    }

    if (
      inst.verificationCode !== code ||
      inst.verificationExpires < Date.now()
    ) {
      return errorResponse(res, "Invalid or expired code", 400);
    }

    inst.isVerified = true;
    inst.verificationCode = null;
    inst.verificationExpires = null;
    await inst.save();

    return successResponse(res, "Account verified successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Verification failed");
  }
};

/* ================= INSTITUTE LOGIN ================= */
exports.loginInstitute = async (req, res) => {
  try {
    const { email, password } = req.body;

    const inst = await Institute.findOne({ email });
    if (!inst) {
      return errorResponse(res, "Invalid email", 401);
    }

    if (!inst.isVerified) {
      return errorResponse(res, "Please verify your email first", 403);
    }

    const ok = await bcrypt.compare(password, inst.password);
    if (!ok) {
      return errorResponse(res, "Invalid password", 401);
    }

    const token = jwt.sign(
      { id: inst._id, role: "admin", instituteId: inst._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return successResponse(res, "Login successful", {
      token,
      role: "admin",
      instituteId: inst._id,
      instituteName: inst.instituteName,
      email: inst.email,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Login failed");
  }
};
