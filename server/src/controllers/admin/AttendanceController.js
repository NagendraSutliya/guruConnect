const Attendance = require("../../models/Attendance");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= SAVE ATTENDANCE (bulk) ================= */
exports.saveAttendance = async (req, res) => {
  try {
    const { classId, sectionId, date, records } = req.body;

    const instituteId = req.user.id;

    if (!Array.isArray(records) || records.length === 0) {
      return errorResponse(res, "Invalid attendance payload", 400);
    }

    const ops = records.map((r) => ({
      updateOne: {
        filter: {
          studentId: r.studentId,
          date: new Date(date),
        },
        update: {
          instituteId,
          studentId: r.studentId,
          classId,
          sectionId: sectionId || null,
          date: new Date(date),
          status: r.status,
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);

    return successResponse(res, "Attendance saved successfully");
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to save attendance");
  }
};

/* ================= GET ATTENDANCE ================= */
exports.getAttendance = async (req, res) => {
  try {
    const { date, classId, sectionId } = req.query;

    const filter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.date = { $gte: start, $lte: end };
    }

    if (classId) filter.classId = classId;
    if (sectionId) filter.sectionId = sectionId;

    const list = await Attendance.find(filter)
      .populate("studentId", "name rollNo")
      .sort({ date: -1 });

    return successResponse(res, "Attendance loaded", list);
  } catch (err) {
    return errorResponse(res, "Failed to load attendance");
  }
};

/* ================= GET ATTENDANCE TODAY SUMMARY ================= */
exports.getTodaySummary = async (req, res) => {
  try {
    const instituteId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await Attendance.aggregate([
      {
        $match: {
          instituteId,
          date: { $gte: today },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    let present = 0;
    let absent = 0;

    data.forEach((d) => {
      if (d._id === "present") present = d.count;
      if (d._id === "absent") absent = d.count;
    });

    const total = present + absent;
    const rate = total ? Math.round((present / total) * 100) : 0;

    return successResponse(res, "Today summary", {
      present,
      absent,
      rate,
    });
  } catch (err) {
    return errorResponse(res, "Summary failed");
  }
};

/* ================= GET ATTENDANCE CLASS SUMMARY ================= */
exports.getClassSummary = async (req, res) => {
  try {
    const instituteId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await Attendance.aggregate([
      {
        $match: {
          instituteId,
          date: { $gte: today },
        },
      },
      {
        $group: {
          _id: { classId: "$classId", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    return successResponse(res, "Class summary", data);
  } catch (err) {
    return errorResponse(res, "Class summary failed");
  }
};

/* ================= GET ATTENDANCE STUDENT SUMMARY ================= */
exports.getStudentSummary = async (req, res) => {
  try {
    const instituteId = req.user.id;

    const data = await Attendance.aggregate([
      { $match: { instituteId } },
      {
        $group: {
          _id: "$studentId",
          present: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
    ]);

    return successResponse(res, "Student summary", data);
  } catch (err) {
    return errorResponse(res, "Student summary failed");
  }
};

/* ================= HISTORY ================= */
exports.getAttendanceHistory = async (req, res) => {
  try {
    const instituteId = req.user.id;

    const list = await Attendance.find({ instituteId })
      .populate("studentId", "name rollNo")
      .sort({ date: -1 })
      .limit(200); // safety limit

    return successResponse(res, "Attendance history", list);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to load history");
  }
};
