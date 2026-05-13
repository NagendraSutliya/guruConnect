const mongoose = require('mongoose');
const path = require('path');

const Teacher = require('./src/models/Teacher');
const Class = require('./src/models/Class');
const Section = require('./src/models/Section');
const Subject = require('./src/models/Subject');
const Routine = require('./src/models/Routine');

require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI); 
    console.log('Connected to DB');

    const teacher = await Teacher.findOne({ name: /Prashant Singh/i });
    if (!teacher) {
       console.log('Teacher not found');
       process.exit(1);
    }
    console.log('--- FOUND TEACHER ---');
    console.log('ID:', teacher._id);
    console.log('Institute ID:', teacher.instituteId);

    const classes = await Class.find({ instituteId: teacher.instituteId });
    const sections = await Section.find({ instituteId: teacher.instituteId });
    const subjects = await Subject.find({ instituteId: teacher.instituteId });

    console.log('\n--- CLASSES ---');
    console.log(JSON.stringify(classes.map(c => ({ name: c.name, id: c._id })), null, 2));

    console.log('\n--- SECTIONS ---');
    console.log(JSON.stringify(sections.map(s => ({ name: s.name, id: s._id })), null, 2));

    console.log('\n--- SUBJECTS ---');
    console.log(JSON.stringify(subjects.map(s => ({ name: s.name, id: s._id })), null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
