const bcrypt = require("bcrypt");
const Student = require("../../models/Student");
const Attendance = require("../../models/Attendance");
const StudyMaterial = require("../../models/StudyMaterial");
const Exam = require("../../models/Exam");
const Result = require("../../models/Result");
const Routine = require("../../models/Routine");
const { successResponse, errorResponse } = require("../../utils/response");

/* ================= STUDENT DASHBOARD SUMMARY ================= */
exports.getStudentDashboardSummary = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { classId, sectionId } = req.user;

    // 1. Attendance %
    const attendanceCount = await Attendance.countDocuments({ studentId });
    const presentCount = await Attendance.countDocuments({ studentId, status: "present" });
    const attendancePercent = attendanceCount > 0 ? Math.round((presentCount / attendanceCount) * 100) : 0;

    // 2. Study Materials Count
    const materialsCount = await StudyMaterial.countDocuments({ classId });

    // 3. Upcoming Tests (List)
    const upcomingTestsList = await Exam.find({ 
      classId, 
      date: { $gte: new Date() } 
    })
    .populate("subjectId", "name")
    .sort({ date: 1 })
    .limit(3);

    // 4. Latest Result
    const latestResultRaw = await Result.findOne({ studentId })
      .populate("examId", "title")
      .sort({ createdAt: -1 });

    let latestResult = null;
    if (latestResultRaw) {
      latestResult = latestResultRaw.toObject();
      latestResult.percentage = latestResult.maxMarks > 0 
        ? Math.round((latestResult.marks / latestResult.maxMarks) * 100) 
        : 0;
    }

    // 5. Performance Trajectory (Last 5 results)
    const history = await Result.find({ studentId })
      .populate("examId", "title")
      .sort({ createdAt: 1 })
      .limit(5);
    
    const performanceTrajectory = history.map(h => {
      const perc = h.maxMarks > 0 ? Math.round((h.marks / h.maxMarks) * 100) : 0;
      return {
        name: h.examId?.title || "Exam",
        score: perc
      };
    });

    // 6. Today's Routine
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[new Date().getDay()];
    const todayRoutine = await Routine.find({ classId, sectionId, day: today })
      .populate("subjectId", "name")
      .populate("teacherId", "name")
      .sort({ startTime: 1 });

    // 7. Recent Assets
    const recentAssets = await StudyMaterial.find({ classId })
      .populate("subjectId", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    // 0. Student Info
    const studentInfo = await Student.findById(studentId)
      .select("name rollNo admissionNo classId sectionId dob isActive")
      .populate("classId", "name")
      .populate("sectionId", "name");

    // 8. Gamified Metrics
    const attendanceStatus = attendancePercent >= 90 ? "Platinum" : attendancePercent >= 75 ? "Gold" : "Silver";
    const performanceTrend = performanceTrajectory.length > 1 
      ? (performanceTrajectory[performanceTrajectory.length-1].score >= performanceTrajectory[performanceTrajectory.length-2].score ? "up" : "down")
      : "stable";
    
    // Days to next test
    const nextTestDate = upcomingTestsList.length > 0 ? new Date(upcomingTestsList[0].date) : null;
    const daysToNextTest = nextTestDate ? Math.ceil((nextTestDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

    return successResponse(res, "Dashboard summary loaded", {
      studentInfo,
      attendancePercent,
      attendanceStatus,
      performanceTrend,
      daysToNextTest,
      materials: materialsCount,
      materialCompletion: 65, // Dummy for now
      upcomingTestsCount: upcomingTestsList.length,
      upcomingTests: upcomingTestsList,
      pendingFees: 0, // Placeholder for future fee management
      latestResult,
      performanceTrajectory,
      todayRoutine,
      recentAssets
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load dashboard summary");
  }
};

/* ================= STUDENT ATTENDANCE HISTORY ================= */
exports.getStudentAttendanceHistory = async (req, res) => {
  try {
    const studentId = req.user.id;

    const list = await Attendance.find({ studentId })
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("recordedBy", "name")
      .populate("subjectId", "name")
      .sort({ date: -1 });

    return successResponse(res, "Attendance history loaded", list);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load attendance history");
  }
};

/* ================= STUDENT STUDY MATERIALS ================= */
exports.getStudentMaterials = async (req, res) => {
  try {
    const { classId } = req.user;

    const materials = await StudyMaterial.find({ classId })
      .populate("subjectId", "name")
      .sort({ createdAt: -1 });

    return successResponse(res, "Materials loaded", materials);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load materials");
  }
};

/* ================= STUDENT RESULTS ================= */
exports.getStudentResults = async (req, res) => {
  try {
    const studentId = req.user.id;

    const resultsRaw = await Result.find({ studentId })
      .populate("examId", "title")
      .populate({
        path: "examSubjectId",
        populate: { path: "subjectId", select: "name" }
      })
      .sort({ createdAt: -1 });

    const results = resultsRaw.map(r => {
      const obj = r.toObject();
      // Use maxMarks from Result model if present, otherwise from examSubjectId
      const maxMarks = obj.maxMarks || obj.examSubjectId?.maxMarks || 100;
      obj.percentage = maxMarks > 0 
        ? Math.round((obj.marks / maxMarks) * 100) 
        : 0;
      return obj;
    });

    return successResponse(res, "Results loaded", results);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load results");
  }
};

/* ================= STUDENT EXAMS ================= */
exports.getStudentExams = async (req, res) => {
  try {
    const { classId } = req.user;

    const exams = await Exam.find({ classId })
      .populate("subjectId", "name")
      .sort({ date: 1 });

    return successResponse(res, "Exams loaded", exams);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load exams");
  }
};

/* ================= UPDATE PROFILE ================= */
exports.updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { name, phone, address } = req.body;

    const updated = await Student.findByIdAndUpdate(
      studentId,
      { name, phone, address },
      { new: true }
    ).select("-password");

    return successResponse(res, "Profile updated", updated);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to update profile");
  }
};

/* ================= STUDENT DASHBOARD ================= */
exports.getStudentOverview = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate("classId")
      .populate("sectionId")
      .select("-password");

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    return successResponse(res, "Student dashboard loaded", student);
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to load dashboard");
  }
};

/* ================= CHANGE PASSWORD ================= */
exports.changeStudentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return errorResponse(res, "Both passwords are required", 400);
    }

    const student = await Student.findById(req.user.id);

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    const match = await bcrypt.compare(oldPassword, student.password);

    if (!match) {
      return errorResponse(res, "Old password incorrect", 404);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    student.password = hashed;
    await student.save();

    return successResponse(res, "Password updated successfully");
  } catch (err) {
    console.log(err);
    return errorResponse(res, "Failed to udpate password");
  }
};

/* ================= STUDENTS BY CLASS ================= */
exports.getStudentsByClass = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;

    if (!classId) {
      return errorResponse(res, "classId is required");
    }

    const filter = {
      classId,
      isActive: true,
    };

    if (sectionId) {
      filter.sectionId = sectionId;
    }

    const students = await Student.find(filter)
      .select("_id name rollNo")
      .sort({ rollNo: 1 });

    return successResponse(res, "Students loaded", students);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to load students");
  }
};
