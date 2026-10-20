const mongoose = require("mongoose");
const Attendance = require("../../models/Attendance");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= SAVE ATTENDANCE (bulk) ================= */
exports.saveAttendance = async (req, res) => {
  try {
    const { classId, sectionId, date, records } = req.body;
    const instituteId = req.user.instituteId || req.user.id;

    if (!Array.isArray(records) || records.length === 0) {
      return errorResponse(res, "Invalid attendance payload", 400);
    }

    const attendanceDate = new Date(date || new Date());
    attendanceDate.setHours(0, 0, 0, 0);

    const ops = records.map((r) => ({
      updateOne: {
        filter: {
          instituteId,
          studentId: r.studentId,
          date: attendanceDate,
        },
        update: {
          instituteId,
          studentId: r.studentId,
          classId,
          sectionId: sectionId && sectionId !== "all" ? sectionId : null,
          date: attendanceDate,
          status: r.status,
          remarks: r.remarks || "",
          recordedBy: req.user.id,
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);

    return successResponse(res, "Attendance saved successfully");
  } catch (err) {
    console.error("Save attendance error:", err);
    return errorResponse(res, "Failed to save attendance");
  }
};

/* ================= GET ATTENDANCE ================= */
exports.getAttendance = async (req, res) => {
  try {
    const { date, classId, sectionId, month, year } = req.query;
    const instituteId = req.user.instituteId || req.user.id;

    const filter = { instituteId };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.date = { $gte: start, $lte: end };
    } else if (month && year) {
      const y = parseInt(year);
      const m = parseInt(month);
      const start = new Date(y, m - 1, 1, 0, 0, 0, 0);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    if (classId) filter.classId = classId;
    if (sectionId && sectionId !== "all") filter.sectionId = sectionId;

    const list = await Attendance.find(filter)
      .populate("studentId", "name rollNo admissionNo phone parentPhone")
      .populate("classId", "name")
      .populate("sectionId", "name")
      .sort({ date: -1 });

    return successResponse(res, "Attendance loaded", list);
  } catch (err) {
    console.error("Get attendance error:", err);
    return errorResponse(res, "Failed to load attendance");
  }
};

/* ================= GET ATTENDANCE TODAY SUMMARY ================= */
exports.getTodaySummary = async (req, res) => {
  try {
    const { date } = req.query;
    const instituteId = req.user.instituteId || req.user.id;

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
    let leave = 0;
    let halfday = 0;
    let late = 0;

    data.forEach((d) => {
      if (d._id === "present") present = d.count;
      if (d._id === "absent") absent = d.count;
      if (d._id === "leave") leave = d.count;
      if (d._id === "halfday") halfday = d.count;
      if (d._id === "late") late = d.count;
    });

    const total = present + absent + leave + halfday + late;
    const rate = total ? Math.round(((present + halfday * 0.5 + late) / total) * 100) : 0;

    return successResponse(res, "Attendance summary", {
      present,
      absent,
      leave,
      halfday,
      late,
      total,
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
    const instituteId = req.user.instituteId || req.user.id;

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
    const instituteId = req.user.instituteId || req.user.id;

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
    const instituteId = req.user.instituteId || req.user.id;

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

/* ================= CAMPUS TRACKER & SECTION STATUS ================= */
exports.getCampusTracker = async (req, res) => {
  try {
    const { date } = req.query;
    const instituteId = req.user.instituteId || req.user.id;

    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);
    const endDate = new Date(queryDate);
    endDate.setHours(23, 59, 59, 999);

    const Class = require("../../models/Class");
    const Section = require("../../models/Section");
    const Student = require("../../models/Student");

    const [allClasses, allSections, allStudents, attendanceRecords] = await Promise.all([
      Class.find({ instituteId }).populate("teacherId", "name email phone"),
      Section.find({ instituteId }),
      Student.find({ instituteId, isActive: { $ne: false } }),
      Attendance.find({
        instituteId,
        date: { $gte: queryDate, $lte: endDate },
      }).populate("recordedBy", "name role"),
    ]);

    const attendanceMap = new Map();
    attendanceRecords.forEach((rec) => {
      const key = `${rec.classId}_${rec.sectionId || "all"}`;
      if (!attendanceMap.has(key)) {
        attendanceMap.set(key, {
          present: 0,
          absent: 0,
          leave: 0,
          halfday: 0,
          late: 0,
          total: 0,
          lastUpdated: rec.updatedAt,
          recordedBy: rec.recordedBy?.name || "Admin/Staff",
        });
      }
      const entry = attendanceMap.get(key);
      entry.total++;
      if (rec.status === "present") entry.present++;
      else if (rec.status === "absent") entry.absent++;
      else if (rec.status === "leave") entry.leave++;
      else if (rec.status === "halfday") entry.halfday++;
      else if (rec.status === "late") entry.late++;
      if (rec.updatedAt > entry.lastUpdated) entry.lastUpdated = rec.updatedAt;
    });

    const trackerSections = [];
    let submittedSectionsCount = 0;

    allClasses.forEach((cls) => {
      const classSecs = allSections.filter(
        (s) => String(s.classId) === String(cls._id)
      );

      const secsToProcess = classSecs.length > 0 ? classSecs : [{ _id: "all", name: "A" }];

      secsToProcess.forEach((sec) => {
        const key = `${cls._id}_${sec._id}`;
        const att = attendanceMap.get(key) || attendanceMap.get(`${cls._id}_all`);

        const enrolled = allStudents.filter((st) => {
          const matchClass = String(st.classId?._id || st.classId) === String(cls._id);
          if (!matchClass) return false;
          if (sec._id !== "all") {
            const matchSec = String(st.sectionId?._id || st.sectionId) === String(sec._id);
            return matchSec;
          }
          return true;
        }).length;

        const isSubmitted = !!(att && att.total > 0);
        if (isSubmitted) submittedSectionsCount++;

        const present = att ? att.present + att.late : 0;
        const absent = att ? att.absent : 0;
        const leave = att ? att.leave : 0;
        const rate = att && att.total > 0 ? Math.round(((att.present + att.late + att.halfday * 0.5) / att.total) * 100) : 0;

        const cleanClassName = (cls.name || "").replace(/^class\s+/i, "").trim();
        const cleanSecName = (sec.name || "").replace(/^section\s+/i, "").trim();
        const label = `${cleanClassName}-${cleanSecName}`;

        trackerSections.push({
          classId: cls._id,
          sectionId: sec._id,
          className: cls.name,
          sectionName: sec.name,
          label,
          teacherName: cls.teacherId?.name || "Unassigned",
          teacherPhone: cls.teacherId?.phone || "",
          enrolledCount: enrolled,
          presentCount: present,
          absentCount: absent,
          leaveCount: leave,
          rate,
          status: isSubmitted ? "submitted" : "pending",
          submittedAt: isSubmitted ? att.lastUpdated : null,
          recordedBy: isSubmitted ? att.recordedBy : null,
        });
      });
    });

    const totalEnrolled = allStudents.length;
    let campusPresent = 0;
    let campusAbsent = 0;
    let campusLeave = 0;
    let campusHalfday = 0;
    let campusLate = 0;

    attendanceRecords.forEach((r) => {
      if (r.status === "present") campusPresent++;
      else if (r.status === "absent") campusAbsent++;
      else if (r.status === "leave") campusLeave++;
      else if (r.status === "halfday") campusHalfday++;
      else if (r.status === "late") campusLate++;
    });

    const campusTotalRecorded = attendanceRecords.length;
    const campusRate = campusTotalRecorded > 0
      ? Math.round(((campusPresent + campusLate + campusHalfday * 0.5) / campusTotalRecorded) * 100)
      : 0;

    return successResponse(res, "Campus tracker summary", {
      date: queryDate,
      metrics: {
        totalEnrolled,
        totalRecorded: campusTotalRecorded,
        totalPresent: campusPresent + campusLate,
        totalAbsent: campusAbsent,
        totalLeave: campusLeave,
        campusRate,
        totalSections: trackerSections.length,
        submittedSections: submittedSectionsCount,
        pendingSections: trackerSections.length - submittedSectionsCount,
      },
      sections: trackerSections,
    });
  } catch (err) {
    console.error("Campus tracker error:", err);
    return errorResponse(res, "Failed to load campus tracker");
  }
};
