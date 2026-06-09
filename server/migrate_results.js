const mongoose = require('mongoose');
const Result = require('./src/models/Result');
const ExamSubject = require('./src/models/ExamSubject');
require('dotenv').config();

const migrateResults = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const results = await Result.find();
    console.log(`Found ${results.length} results to check.`);

    let fixedCount = 0;

    for (const res of results) {
      // Check if current examSubjectId is actually a Subject ID
      // by looking it up in ExamSubject.subjectId
      const correctExamSubject = await ExamSubject.findOne({
        examId: res.examId,
        subjectId: res.examSubjectId // Here we assume it was incorrectly stored as subjectId
      });

      if (correctExamSubject) {
        res.examSubjectId = correctExamSubject._id;
        // Also copy maxMarks to Result if it's missing (to make percentage calc easier)
        res.maxMarks = correctExamSubject.maxMarks;
        await res.save();
        fixedCount++;
      }
    }

    console.log(`Successfully migrated ${fixedCount} result records.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrateResults();
