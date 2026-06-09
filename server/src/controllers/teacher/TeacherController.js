const mongoose = require("mongoose");
const Feedback = require("../../models/Feedback");
const Class = require("../../models/Class");
const Attendance = require("../../models/Attendance");
const Teacher = require("../../models/Teacher");
const TeacherAssignment = require("../../models/TeacherAssignment");
const Student = require("../../models/Student");
const StudyMaterial = require("../../models/StudyMaterial");
const Result = require("../../models/Result");
const { successResponse, errorResponse } = require("../../utils/response");

const cloudinary = require("../../config/cloudinary");

/* ================= TEACHER PROFILE ================= */
exports.getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select(
      "name email profileImage phone address designation qualification"
    );

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    return successResponse(res, "Profile loaded", teacher);
  } catch (err) {
    return errorResponse(res, "Failed to load profile");
  }
};

exports.updateTeacherProfile = async (req, res) => {
  try {
    const { name, phone, address, designation, qualification } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phone, address, designation, qualification } },
      { new: true }
    ).select("-password");

    return successResponse(res, "Profile updated successfully", teacher);
  } catch (err) {
    return errorResponse(res, "Failed to update profile");
  }
};

exports.updateTeacherImage = async (req, res) => {
  try {
    const { image } = req.body;
    const teacherId = req.user.id;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return errorResponse(res, "Teacher not found", 404);

    // Delete old image from Cloudinary if exists
    if (teacher.profileImage && teacher.profileImage.includes("cloudinary")) {
      try {
        const publicId = teacher.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`guru_connect/profiles/${publicId}`);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    // Update with new image (URL from frontend upload or handle upload here)
    // For simplicity, assuming frontend sends the Cloudinary URL after uploading
    teacher.profileImage = image;
    await teacher.save();

    return successResponse(res, "Profile image updated", { profileImage: image });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to update profile image");
  }
};

const Routine = require("../../models/Routine");
const Exam = require("../../models/Exam");

/* ================= DASHBOARD STATS ================= */
exports.getTeacherStats = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // 1. Get assignments to find classes
    const assignments = await TeacherAssignment.find({ teacherId });
    const classIds = [...new Set(assignments.map(a => a.classId.toString()))];
    const sectionIds = [...new Set(assignments.filter(a => a.sectionId).map(a => a.sectionId.toString()))];

    // 2. Fetch counts
    const [totalStudents, courseModules, feedbackCount] = await Promise.all([
      Student.countDocuments({ 
        classId: { $in: classIds },
        ...(sectionIds.length > 0 && { sectionId: { $in: sectionIds } })
      }),
      StudyMaterial.countDocuments({ teacherId }),
      Feedback.countDocuments({ teacherId })
    ]);

    // 3. Performance (Avg of Results for this teacher's assignments)
    const subjectIds = [...new Set(assignments.map(a => a.subjectId.toString()))];
    const performanceData = await Result.aggregate([
      { $match: { examSubjectId: { $in: subjectIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      { $group: { _id: null, avg: { $avg: "$marks" } } }
    ]);

    const avgPerformance = performanceData.length > 0 ? Math.round(performanceData[0].avg) : 0;

    // 4. Priority Feed Logic
    const priorityFeed = [];
    const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
    
    // Check missing attendance for today's routine
    const todaysRoutine = await Routine.find({ teacherId, day: today }).populate('classId sectionId subjectId');
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);

    for (const item of todaysRoutine) {
      const exists = await Attendance.findOne({
        classId: item.classId?._id,
        sectionId: item.sectionId?._id,
        subjectId: item.subjectId?._id,
        date: { $gte: todayStart, $lte: todayEnd }
      });
      if (!exists) {
        priorityFeed.push({
          title: `Mark Attendance: ${item.classId?.name} - ${item.subjectId?.name}`,
          time: "Pending",
          type: "high",
          path: "/teacher/attendance"
        });
      }
    }

    // Check upcoming/completed exams
    const exams = await Exam.find({ classId: { $in: classIds } }).limit(2);
    exams.forEach(exam => {
      priorityFeed.push({
        title: `Upload Marks: ${exam.name}`,
        time: exam.status === 'completed' ? 'Now' : 'Upcoming',
        type: exam.status === 'completed' ? 'high' : 'med',
        path: "/teacher/results/upload-marks"
      });
    });

    // Check materials
    if (courseModules === 0) {
      priorityFeed.push({
        title: "Initialize Course Materials",
        time: "Recommended",
        type: "low",
        path: "/teacher/material"
      });
    }

    return successResponse(res, "Stats loaded", {
      totalStudents: totalStudents || 0,
      activeClasses: classIds.length,
      courseModules: courseModules || 0,
      avgPerformance: avgPerformance + "%",
      feedbackCount: feedbackCount || 0,
      priorityFeed: priorityFeed.slice(0, 4) // Limit to top 4
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load stats");
  }
};

/* ================= DASHBOARD OVERVIEW ================= */
exports.getTeacherOverview = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [total, positive, neutral, negative] = await Promise.all([
      Feedback.countDocuments({ teacherId }),
      Feedback.countDocuments({ teacherId, mood: "positive" }),
      Feedback.countDocuments({ teacherId, mood: "neutral" }),
      Feedback.countDocuments({ teacherId, mood: "negative" }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await Feedback.countDocuments({
      teacherId,
      createdAt: { $gte: today },
    });

    const recent = await Feedback.find({ teacherId })
      .sort({ createdAt: -1 })
      .limit(4);

    return successResponse(res, "Overview loaded", {
      total,
      positive,
      neutral,
      negative,
      today: todayCount,
      recent,
    });
  } catch (err) {
    return errorResponse(res, "Failed to load overview");
  }
};

/* ================= DASHBOARD CHARTS ================= */
exports.getTeacherDashboardCharts = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const assignments = await TeacherAssignment.find({ teacherId });
    const classIds = assignments.map(a => a.classId);

    // 1. Attendance Distribution (Today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const attendanceStats = await Attendance.aggregate([
      { 
        $match: { 
          classId: { $in: classIds },
          date: { $gte: todayStart, $lte: todayEnd }
        } 
      },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const totalAttendance = attendanceStats.reduce((acc, curr) => acc + curr.count, 0);
    const distribution = [
      { name: 'Present', value: 0, color: '#10b981' },
      { name: 'Absent', value: 0, color: '#f43f5e' },
      { name: 'Late', value: 0, color: '#f59e0b' },
    ];

    attendanceStats.forEach(stat => {
      const statusLabel = stat._id.charAt(0).toUpperCase() + stat._id.slice(1);
      const item = distribution.find(d => d.name === statusLabel);
      if (item) item.value = Math.round((stat.count / totalAttendance) * 100);
    });

    // 2. Engagement Feed (Feedback trends last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const feedbackTrends = await Feedback.aggregate([
      { 
        $match: { 
          teacherId: new mongoose.Types.ObjectId(teacherId),
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const engagementData = feedbackTrends.map(f => ({
      name: days[new Date(f._id).getDay()],
      value: f.count
    }));

    return successResponse(res, "Charts data loaded", {
      distribution: totalAttendance > 0 ? distribution : null,
      engagementData: engagementData.length > 0 ? engagementData : null
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load charts data");
  }
};

/* ================= Attendance Stats ================= */
exports.getAttendanceSummary = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const assignments = await TeacherAssignment.find({ teacherId });
    const classIds = assignments.map(a => a.classId);

    if (!classIds.length) {
      return successResponse(res, "No classes assigned", []);
    }

    const attendance = await Attendance.aggregate([
      { $match: { classId: { $in: classIds } } },
      {
        $group: {
          _id: { classId: "$classId", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    return successResponse(res, "Attendance summary loaded", attendance);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load attendance summary");
  }
};

/* ================= FEEDBACK ================= */
exports.getTeacherFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      teacherId: req.user.id,
    }).sort({ createdAt: -1 });

    return successResponse(res, "Feedback loaded", feedback);
  } catch (err) {
    return errorResponse(res, "Failed to load feedback");
  }
};
