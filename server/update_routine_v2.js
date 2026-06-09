const mongoose = require('mongoose');
const Routine = require('./src/models/Routine');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const teacherIds = ['69d4cfd6d50d135147f2f170', '69d4d209d50d135147f2f18a'];
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
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '10:00',
        classId: '69d4e113b0dd183a64212d2f', // Class 12
        sectionId: '69d4e19eb0dd183a64212d9c', // Section A
        subjectId: '69d4e268b0dd183a64212e29'  // Chemistry
      },
      {
        day: 'Wednesday',
        startTime: '11:30',
        endTime: '12:30',
        classId: '69d4e10cb0dd183a64212d1d', // Class 9
        sectionId: '69d4e193b0dd183a64212d87', // Section A
        subjectId: '69d4e271b0dd183a64212e35'  // Computer
      },
      {
        day: 'Thursday',
        startTime: '14:00',
        endTime: '15:00',
        classId: '69d4e10fb0dd183a64212d23', // Class 10
        sectionId: '69d4e196b0dd183a64212d8e', // Section A
        subjectId: '69d4e25eb0dd183a64212e1f'  // Maths
      },
      {
        day: 'Saturday',
        startTime: '09:00',
        endTime: '11:00',
        classId: '69d4e10fb0dd183a64212d23', // Class 10
        sectionId: '69d4e196b0dd183a64212d8e', // Section A
        subjectId: '69d4e25eb0dd183a64212e1f'  // Maths
      }
    ];

    for (const teacherId of teacherIds) {
      for (const r of routines) {
        await Routine.findOneAndUpdate(
          { 
            teacherId,
            day: r.day, 
            startTime: r.startTime 
          },
          { ...r, teacherId, instituteId },
          { upsert: true, new: true }
        );
      }
    }

    console.log('Successfully updated/inserted routine records for both Prashant Singh profiles (including Saturday).');

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
