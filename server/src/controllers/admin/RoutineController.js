const Routine = require("../../models/Routine");
const { successResponse, errorResponse } = require("../../utils/response");

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

const checkConflict = async (r, excludeId = null) => {
  const query = {
    day: r.day,
    $or: [
      { teacherId: r.teacherId },
      { classId: r.classId, sectionId: r.sectionId }
    ]
  };
  if (excludeId) query._id = { $ne: excludeId };

  const existingRoutines = await Routine.find(query);
  const startMin = timeToMinutes(r.startTime);
  const endMin = timeToMinutes(r.endTime);

  for (const existing of existingRoutines) {
    const eStart = timeToMinutes(existing.startTime);
    const eEnd = timeToMinutes(existing.endTime);

    if (startMin < eEnd && endMin > eStart) {
      if (existing.teacherId && existing.teacherId.toString() === r.teacherId.toString()) {
        return `Teacher is busy on ${r.day} from ${existing.startTime}-${existing.endTime}.`;
      } else {
        return `Class is occupied on ${r.day} from ${existing.startTime}-${existing.endTime}.`;
      }
    }
  }
  return null;
};

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

// ================= GET TEACHER ROUTINE =================
exports.getTeacherRoutine = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const data = await Routine.find({ teacherId })
      .populate("classId", "name")
      .populate("sectionId", "name")
      .populate("subjectId", "name")
      .sort({ day: 1, startTime: 1 });

    return successResponse(res, "Teacher routine fetched", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch teacher routine");
  }
};

// ================= GET STUDENT ROUTINE =================
exports.getStudentRoutine = async (req, res) => {
  try {
    const { classId, sectionId } = req.user;

    const data = await Routine.find({ classId, sectionId })
      .populate("subjectId", "name")
      .populate("teacherId", "name")
      .sort({ day: 1, startTime: 1 });

    return successResponse(res, "Student routine fetched", data);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch student routine");
  }
};

// ================= CREATE / BULK SAVE =================
exports.saveRoutine = async (req, res) => {
  try {
    const records = req.body;

    for (const r of records) {
      const conflictMsg = await checkConflict(r, r._id);
      if (conflictMsg) {
        return res.status(400).json({ success: false, message: conflictMsg });
      }
    }

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

// ================= UPDATE SINGLE =================
exports.updateRoutine = async (req, res) => {
  try {
    const conflictMsg = await checkConflict(req.body, req.params.id);
    if (conflictMsg) {
      return res.status(400).json({ success: false, message: conflictMsg });
    }

    const updated = await Routine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return errorResponse(res, "Routine not found");

    return successResponse(res, "Routine updated", updated);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to update routine");
  }
};

// ================= COPY TIMETABLE =================
exports.copyRoutine = async (req, res) => {
  try {
    const { fromClassId, fromSectionId, toClassId, toSectionId } = req.body;
    
    if (!fromClassId || !fromSectionId || !toClassId || !toSectionId) {
      return errorResponse(res, "Source and destination class/section required");
    }

    // 1. Fetch source routines
    const sourceRoutines = await Routine.find({ classId: fromClassId, sectionId: fromSectionId });
    if (!sourceRoutines.length) {
      return errorResponse(res, "Source timetable is empty");
    }

    // 2. Map routines to new destination
    // We omit the _id so Mongo generates new ones
    const newRoutines = sourceRoutines.map(r => ({
      classId: toClassId,
      sectionId: toSectionId,
      subjectId: r.subjectId,
      teacherId: r.teacherId,
      day: r.day,
      startTime: r.startTime,
      endTime: r.endTime,
      instituteId: req.user.instituteId
    }));

    // 3. Optional: we could check conflict for ALL of them before inserting
    for (const r of newRoutines) {
      const conflictMsg = await checkConflict(r);
      if (conflictMsg) {
        return res.status(400).json({ 
          success: false, 
          message: `Cannot copy: ${conflictMsg} (Conflicts with existing destination schedule)` 
        });
      }
    }

    await Routine.insertMany(newRoutines);
    return successResponse(res, "Timetable copied successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to copy routine");
  }
};

// ================= CLEAR TIMETABLE (BULK) =================
exports.clearRoutine = async (req, res) => {
  try {
    const { classId, sectionId } = req.query;
    if (!classId || !sectionId) {
      return errorResponse(res, "Class & Section required");
    }

    await Routine.deleteMany({ classId, sectionId });
    return successResponse(res, "Timetable cleared successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to clear routine");
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
