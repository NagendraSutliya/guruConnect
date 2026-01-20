const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Institute = require("../models/Institute");
const { generateVerificationCode } = require("../utils/verificationCode");
const { sendVerificationCode } = require("../utils/mailer");
const Teacher = require("../models/Teacher");

/* Register Institute */
router.post("/register", async (req, res) => {
  try {
    const { instituteName, instituteType, email, password } = req.body;

    if (!instituteName || !email || !password)
      return res.status(400).json("Missing required fields");

    const exists = await Institute.findOne({ email });
    if (exists) return res.status(400).json("Email already registered");

    const hashed = await bcrypt.hash(password, 10);

    // Generate random instituteCode
    const instituteCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const code = generateVerificationCode();
    console.log("Generated Code:", code);

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
    res.json({ msg: "Institute verification code sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Registration failed");
  }
});

// Verify
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    const inst = await Institute.findOne({ email });

    if (!inst) return res.status(404).json("Institute not found");

    if (inst.isVerified) return res.json("Already verified");

    if (
      inst.verificationCode !== code ||
      inst.verificationExpires < Date.now()
    ) {
      return res.status(400).json("Invalid or expired code");
    }

    inst.isVerified = true;
    inst.verificationCode = null;
    inst.verificationExpires = null;

    await inst.save();

    res.json("Account verified successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json("Verification failed");
  }
});

/* Login Institute */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const inst = await Institute.findOne({ email });

    if (!inst) return res.status(401).json("Invalid email");

    if (!inst.isVerified)
      return res.status(403).json("Please verify your email first");

    const ok = await bcrypt.compare(password, inst.password);
    if (!ok) return res.status(401).json("Invalid password");

    const token = jwt.sign(
      { id: inst._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: "admin",
      instituteId: inst._id,
      instituteName: inst.instituteName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Login failed");
  }
});

module.exports = router;
