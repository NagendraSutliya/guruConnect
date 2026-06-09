const mongoose = require("mongoose");
const Attendance = require("../../models/Attendance");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= SAVE ATTENDANCE (bulk) ================= */
exports.saveAttendance = async (req, res) => {
  try {
    const { classId, sectionId, date, records } = req.body;

    const instituteId = req.user.instituteId;

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
      .populate("classId", "name")
      .populate("sectionId", "name")
      .sort({ date: -1 });

    return successResponse(res, "Attendance loaded", list);
  } catch (err) {
    return errorResponse(res, "Failed to load attendance");
  }
};

/* ================= GET ATTENDANCE TODAY SUMMARY ================= */
exports.getTodaySummary = async (req, res) => {
  try {
    const { date } = req.query;
    const instituteId = req.user.instituteId;

    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);
    const endDate = new Date(queryDate);
    endDate.setHours(23, 59, 59, 999);

    const data = await Attendance.aggregate([
      {
        $match: {
          instituteId: new mongoose.Types.ObjectId(instituteId),
          date: { $gte: queryDate, $lte: endDate },
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

    return successResponse(res, "Attendance summary", {
      present,
      absent,
      rate,
    });
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Summary failed");
  }
};

/* ================= GET ATTENDANCE CLASS SUMMARY ================= */
exports.getClassSummary = async (req, res) => {
  try {
    const { date } = req.query;
    const instituteId = req.user.instituteId;

    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);
    const endDate = new Date(queryDate);
    endDate.setHours(23, 59, 59, 999);

    const data = await Attendance.aggregate([
      {
        $match: {
          instituteId: new mongoose.Types.ObjectId(instituteId),
          date: { $gte: queryDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$classId",
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: "classes",
          localField: "_id",
          foreignField: "_id",
          as: "classInfo",
        },
      },
      { $unwind: "$classInfo" },
      {
        $project: {
          class: "$classInfo.name",
          present: 1,
          absent: 1,
          total: { $add: ["$present", "$absent"] },
          rate: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$present",
                      { $cond: [{ $eq: [{ $add: ["$present", "$absent"] }, 0] }, 1, { $add: ["$present", "$absent"] }] }
                    ],
                  },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { class: 1 } }
    ]);

    return successResponse(res, "Class summary", data);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Class summary failed");
  }
};

/* ================= GET ATTENDANCE STUDENT SUMMARY ================= */
exports.getStudentSummary = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;

    const data = await Attendance.aggregate([
      { $match: { instituteId: new mongoose.Types.ObjectId(instituteId) } },
      {
        $group: {
          _id: "$studentId",
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      { $unwind: "$studentInfo" },
      {
        $project: {
          name: "$studentInfo.name",
          rollNo: "$studentInfo.rollNo",
          present: 1,
          total: 1,
          percentage: {
            $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0],
          },
        },
      },
      { $sort: { percentage: -1 } },
      { $limit: 10 } // Top 10 persistent students
    ]);

    return successResponse(res, "Student summary", data);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Student summary failed");
  }
};

/* ================= HISTORY ================= */
exports.getAttendanceHistory = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;

    const list = await Attendance.find({ 
      instituteId: new mongoose.Types.ObjectId(instituteId) 
    })
      .populate("studentId", "name rollNo")
      .populate("classId", "name")
      .populate("sectionId", "name")
      .sort({ date: -1 })
      .limit(200); 

    return successResponse(res, "Attendance history", list);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to load history");
  }
};
