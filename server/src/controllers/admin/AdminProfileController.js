const Institute = require("../../models/Institute.js");
const { successResponse, errorResponse } = require("../../utils/response.js");

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Institute.findById(req.user.id).select(
      "instituteName email"
    );

    return successResponse(res, "Admin profile", admin);
  } catch (err) {
    return errorResponse(res, "Failed to load profile");
  }
};
