const mongoose = require('mongoose');
const Result = require('./src/models/Result');
const Exam = require('./src/models/Exam');
const ExamSubject = require('./src/models/ExamSubject');
const Subject = require('./src/models/Subject');
const Student = require('./src/models/Student');
require('dotenv').config();

const checkResults = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const results = await Result.find()
      .populate("examId", "title")
      .populate({
        path: "examSubjectId",
        populate: { path: "subjectId", select: "name" }
      })
      .limit(5);

    console.log("Found results:", results.length);
    if (results.length > 0) {
      console.log("First Result Sample:");
      const r = results[0];
      console.log("- Exam:", r.examId?.title);
      console.log("- ExamSubject ID:", r.examSubjectId?._id);
      console.log("- Subject Name:", r.examSubjectId?.subjectId?.name);
      console.log("- Marks:", r.marks);
      console.log("- MaxMarks:", r.maxMarks);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkResults();
