const Routine = require("../models/Routine");
const { successResponse, errorResponse } = require("../utils/response");

// ================= GET ROUTINE =================
exports.getRoutine = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    if (!classId || !sectionId) {
      return errorResponse(res, "Class & Section required");
    }

    const data = await Routine.find({ classId, sectionId })
      .populate("subjectId", "name")
      .populate("teacherId", "name")
      .sort({ day: 1, startTime: 1 });

    return successResponse(res, "Routine fetched", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch routine");
  }
};

// ================= CREATE / UPDATE =================
exports.saveRoutine = async (req, res) => {
  try {
    const records = req.body;

    const ops = records.map((r) => ({
      updateOne: {
        filter: {
          classId: r.classId,
          sectionId: r.sectionId,
          day: r.day,
          startTime: r.startTime,
        },
        update: {
          ...r,
          instituteId: req.user.instituteId,
        },
        upsert: true,
      },
    }));

    await Routine.bulkWrite(ops);

    return successResponse(res, "Routine saved");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to save routine");
  }
};

// ================= DELETE =================
exports.deleteRoutine = async (req, res) => {
  try {
    await Routine.findByIdAndDelete(req.params.id);
    return successResponse(res, "Deleted");
  } catch (err) {
    return errorResponse(res, "Delete failed");
  }
};
