const mongoose = require("mongoose");
const Class = require("../../models/Class");
const { successResponse, errorResponse } = require("../../utils/response");

// ================= CREATE CLASS =================
exports.createClass = async (req, res) => {
  try {
    const { name, academicYearId } = req.body;
    if (!name || !academicYearId) {
      return errorResponse(res, "Missing fields", 400);
    }

    const exists = await Class.findOne({
      name,
      academicYearId,
      instituteId: req.user.id,
    });

    if (exists) {
      return errorResponse(
        res,
        "Class already exists for this academic year",
        400
      );
    }

    const cls = await Class.create({
      name,
      academicYearId,
      instituteId: req.user.id,
    });

    return successResponse(res, "Class created", cls);
  } catch (err) {
    console.error("CREATE CLASS ERROR:", err);
    return errorResponse(res, err.message || "Failed to create class");
  }
};

// ================= GET CLASS =================
exports.getClasses = async (req, res) => {
  try {
    const list = await Class.find({
      instituteId: req.user.id,
    })
      .populate("academicYearId", "name")
      .sort({ name: 1 });

    return successResponse(res, "Classes loaded", list);
  } catch (err) {
    return errorResponse(res, "Failed to load class");
  }
};

// ================= UPDATE CLASS =================
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, academicYearId } = req.body;

    if (!name || !academicYearId) {
      return errorResponse(res, "All fields required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid class ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(academicYearId)) {
      return errorResponse(res, "Invalid academicYearId", 400);
    }

    // Ensure req.user exists
    if (!req.user || !req.user.id) {
      return errorResponse(res, "Unauthorized", 401);
    }

    // Find the class
    const cls = await Class.findById(id);
    if (!cls) return errorResponse(res, "Class not found", 404);

    // Check for duplicates in the same institute and academic year
    const exists = await Class.findOne({
      _id: { $ne: id },
      name,
      academicYearId,
      instituteId: req.user.id,
    });

    if (exists) {
      return errorResponse(
        res,
        "Another class with this name exists in this academic year",
        400
      );
    }

    cls.name = name;
    cls.academicYearId = academicYearId;

    await cls.save();

    return successResponse(res, "Class updated", cls);
  } catch (err) {
    console.error("Error in updateClass:", err);
    return errorResponse(res, "Failed to update class");
  }
};

// ================= DELETE CLASS =================
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params; // class ID
    const cls = await Class.findById(id);
    if (!cls) {
      return errorResponse(res, "Class not found", 404);
    }

    // Optional: Prevent deleting classes that have students or dependents
    // e.g., if (await Student.exists({ classId: id })) ...

    await Class.findByIdAndDelete(id);

    return successResponse(res, "Class deleted");
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to delete class");
  }
};
