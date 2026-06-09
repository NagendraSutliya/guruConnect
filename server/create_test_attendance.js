const mongoose = require('mongoose');
const Attendance = require('./src/models/Attendance');
const Subject = require('./src/models/Subject');
const Teacher = require('./src/models/Teacher');
const Student = require('./src/models/Student');
require('dotenv').config();

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    // 1. Get a student
    const student = await Student.findOne();
    if (!student) {
      console.log("No student found");
      process.exit(0);
    }
    console.log(`Targeting Student: ${student.name} (${student._id})`);

    // 2. Get subjects
    const subjects = await Subject.find().limit(5);
    if (subjects.length < 2) {
      console.log("Need at least 2 subjects for multi-session test");
      process.exit(0);
    }

    // 3. Get teachers
    const teachers = await Teacher.find().limit(5);
    
    // 4. Create multi-session data for Today and Yesterday
    const dates = [new Date(), new Date(Date.now() - 86400000)];
    
    for (const date of dates) {
      console.log(`Creating sessions for: ${date.toDateString()}`);
      
      // Clear existing for this date to avoid duplicates if index exists (though I removed it)
      await Attendance.deleteMany({ 
        studentId: student._id, 
        date: { 
          $gte: new Date(date.setHours(0,0,0,0)), 
          $lte: new Date(date.setHours(23,59,59,999)) 
        } 
      });

      for (let i = 0; i < 4; i++) {
        const subject = subjects[i % subjects.length];
        const teacher = teachers[i % teachers.length];
        
        await Attendance.create({
          instituteId: student.instituteId,
          studentId: student._id,
          classId: student.classId,
          sectionId: student.sectionId,
          date: date,
          status: i === 2 ? "late" : i === 3 ? "absent" : "present",
          subjectId: subject._id,
          recordedBy: teacher?._id,
          period: i + 1,
          remarks: i === 2 ? "Arrived 10 mins late" : i === 3 ? "Medical emergency" : "Session attended"
        });
      }
    }

    console.log("Test data created successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createTestData();
