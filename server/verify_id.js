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

    const recordId = '6a018d856968a4af055bc052';
    const routine = await Routine.findById(recordId).populate('classId sectionId subjectId teacherId');
    
    if (routine) {
        console.log('--- FOUND ROUTINE ---');
        console.log(JSON.stringify(routine, null, 2));
    } else {
        console.log('Routine record NOT FOUND with ID:', recordId);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
