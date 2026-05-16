const Institute = require("../../models/Institute.js");
const Student = require("../../models/Student.js");
const Teacher = require("../../models/Teacher.js");
const { successResponse, errorResponse } = require("../../utils/response.js");
const cloudinary = require("../../config/cloudinary");

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Institute.findById(req.user.id).select(
      "instituteName email logoUrl phone address principalName"
    );

    const [studentCount, teacherCount] = await Promise.all([
      Student.countDocuments({ instituteId: req.user.id }),
      Teacher.countDocuments({ instituteId: req.user.id })
    ]);

    const profileData = {
      ...admin.toObject(),
      studentCount,
      teacherCount
    };

    return successResponse(res, "Admin profile", profileData);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    return errorResponse(res, "Failed to load profile");
  }
};

exports.updateInstituteLogo = async (req, res) => {
  try {
    const { logoUrl } = req.body;
    if (logoUrl === undefined) return errorResponse(res, "Logo URL is required", 400);

    if (!req.user || !req.user.id) {
      return errorResponse(res, "User not authenticated", 401);
    }

    // 1. Find existing institute to get old logoUrl
    const institute = await Institute.findById(req.user.id);
    if (!institute) return errorResponse(res, "Institute not found", 404);

    // 2. If there's an old logo, delete it from Cloudinary
    if (institute.logoUrl && institute.logoUrl.includes("cloudinary.com")) {
      try {
        // Robust public_id extraction
        const parts = institute.logoUrl.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
          // public_id starts after version (which starts with 'v')
          const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
          const publicId = publicIdWithExt.split('.')[0];
          
          console.log("Cleanup: Destroying old Cloudinary asset ->", publicId);
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.error("Cleanup Warning (Cloudinary):", err.message);
      }
    }

    // 3. Update DB
    const updatedInstitute = await Institute.findByIdAndUpdate(
      req.user.id,
      { logoUrl },
      { new: true }
    );

    return successResponse(res, "Institute logo updated", updatedInstitute);
  } catch (err) {
    console.error("CRITICAL ERROR (updateInstituteLogo):", err);
    return errorResponse(res, "Failed to update logo: " + err.message);
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const updated = await Institute.findByIdAndUpdate(
      req.user.id,
      { 
        instituteName: name, 
        phone 
      },
      { new: true }
    );

    return successResponse(res, "Profile updated successfully", updated);
  } catch (err) {
    console.error("Profile Update Error:", err);
    return errorResponse(res, "Failed to update profile");
  }
};
