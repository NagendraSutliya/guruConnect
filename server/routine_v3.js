const mongoose = require('mongoose');
const Routine = require('./src/models/Routine');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const inactiveTeacherId = '69d4d209d50d135147f2f18a';
    const instituteId = '6964c3ca02b30df07276ee54';

    const routines = [
      {
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        classId: '69d4e10fb0dd183a64212d23', // Class 10
        sectionId: '69d4e196b0dd183a64212d8e', // Section A
        subjectId: '69d4e25eb0dd183a64212e1f'  // Maths
      },
      {
        day: 'Saturday',
        startTime: '08:00',
        endTime: '10:00',
        classId: '69d4e10fb0dd183a64212d23', // Class 10
        sectionId: '69d4e196b0dd183a64212d8e', // Section A
        subjectId: '69d4e25eb0dd183a64212e1f'  // Maths
      }
    ];

    for (const r of routines) {
        await Routine.findOneAndUpdate(
          { 
            teacherId: inactiveTeacherId,
            day: r.day, 
            startTime: r.startTime 
          },
          { ...r, teacherId: inactiveTeacherId, instituteId },
          { upsert: true, new: true }
        );
    }

    console.log('Successfully added routines for the secondary (inactive) Prashant Singh as well.');

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
