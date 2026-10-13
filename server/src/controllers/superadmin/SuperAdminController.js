const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SuperAdmin = require("../../models/SuperAdmin");
const Institute = require("../../models/Institute");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const { successResponse, errorResponse } = require("../../utils/response");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let superAdmin = await SuperAdmin.findOne({ email });
    
    // Auto-seed for development if no super admin exists
    if (!superAdmin && email === "superadmin@guruconnect.com" && password === "admin123") {
        const hashed = await bcrypt.hash(password, 10);
        superAdmin = await SuperAdmin.create({ name: "System Admin", email, password: hashed });
    }

    if (!superAdmin) {
      return errorResponse(res, "Invalid super admin credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid super admin credentials", 401);
    }

    const token = jwt.sign(
      { id: superAdmin._id, role: "superadmin" },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    return successResponse(res, "Super Admin Login Successful", {
      token,
      superadmin: { _id: superAdmin._id, name: superAdmin.name, email: superAdmin.email },
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Login Failed");
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalInstitutes = await Institute.countDocuments();
    const verifiedInstitutes = await Institute.countDocuments({ isVerified: true });
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();

    // Mock revenue for now
    const totalRevenue = totalInstitutes * 5000; 

    return successResponse(res, "Dashboard stats fetched", {
      totalInstitutes,
      verifiedInstitutes,
      totalStudents,
      totalTeachers,
      totalRevenue
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch stats");
  }
};

exports.getInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find().select("-password").sort({ createdAt: -1 });
    return successResponse(res, "Institutes fetched", institutes);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch institutes");
  }
};

exports.toggleInstituteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const inst = await Institute.findById(id);
    if (!inst) return errorResponse(res, "Institute not found", 404);

    inst.isVerified = !inst.isVerified; // Using isVerified as blocked/approved flag for now
    await inst.save();

    return successResponse(res, `Institute ${inst.isVerified ? 'Approved' : 'Blocked'} successfully`, inst);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to toggle status");
  }
};
