const mongoose = require('mongoose');
const Routine = require('./src/models/Routine');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const teacherId = '69d4cfd6d50d135147f2f170'; // The ACTIVE Prashant Singh
    const instituteId = '6964c3ca02b30df07276ee54';

    // Clear ANY existing routine for this teacher to avoid conflicts with themselves
    await Routine.deleteMany({ teacherId });
    console.log('Cleared existing routines for Prashant Singh.');

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
        startTime: '10:00',
        endTime: '11:00',
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
        day: 'Friday',
        startTime: '09:00',
        endTime: '10:30',
        classId: '69d4e110b0dd183a64212d29', // Class 11
        sectionId: '69d4e19ab0dd183a64212d95', // Section A
        subjectId: '69d4e230b0dd183a64212df7'  // Physics
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
        // Try to clear the slot if occupied by someone else
        await Routine.deleteMany({ 
            classId: r.classId, 
            sectionId: r.sectionId, 
            day: r.day, 
            startTime: r.startTime 
        });

        await Routine.create({
            ...r,
            teacherId,
            instituteId
        });
    }

    console.log('Successfully FORCE-INSERTED routine records for ACTIVE Prashant Singh (including Saturday).');

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
