const mongoose = require('mongoose');
const Routine = require('./src/models/Routine');
const Class = require('./src/models/Class');
const Section = require('./src/models/Section');
const Subject = require('./src/models/Subject');
const Teacher = require('./src/models/Teacher');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const teacherId = '69d4cfd6d50d135147f2f170';
    const routines = await Routine.find({ teacherId }).populate('classId sectionId subjectId');
    
    console.log(`Found ${routines.length} routines for teacher ${teacherId}`);
    console.log(JSON.stringify(routines, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
