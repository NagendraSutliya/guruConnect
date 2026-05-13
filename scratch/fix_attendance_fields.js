const mongoose = require('mongoose');
const Attendance = require('./server/src/models/Attendance');
const Subject = require('./server/src/models/Subject');
const Teacher = require('./server/src/models/Teacher');
require('dotenv').config();

const fixData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const firstSubject = await Subject.findOne();
    const firstTeacher = await Teacher.findOne();

    if (firstSubject && firstTeacher) {
      const result = await Attendance.updateMany(
        { subjectId: { $exists: false } },
        { 
          $set: { 
            subjectId: firstSubject._id,
            recordedBy: firstTeacher._id,
            period: 1
          } 
        }
      );
      console.log(`Updated ${result.modifiedCount} records with dummy subject/teacher`);
    } else {
      console.log("No Subject or Teacher found to use as dummy");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixData();
