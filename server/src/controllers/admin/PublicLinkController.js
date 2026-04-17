const PublicLink = require("../../models/PublicLink.js");
const { successResponse, errorResponse } = require("../../utils/response.js");

exports.getPublicLink = async (req, res) => {
  try {
    const link = await PublicLink.findOne({ instituteId: req.user.id });
    return successResponse(res, "Link fetched", link);
  } catch (err) {
    return errorResponse(res, "Failed to fetch link");
  }
};

exports.createPublicLink = async (req, res) => {
  try {
    const existing = await PublicLink.findOne({ instituteId: req.user.id });

    if (existing) {
      return successResponse(res, "Link already exists", existing);
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const link = await PublicLink.create({
      instituteId: req.user.id,
      linkCode: code,
    });

    return successResponse(res, "Public link created", link, 201);
  } catch (err) {
    return errorResponse(res, "Failed to create public link");
  }
};
