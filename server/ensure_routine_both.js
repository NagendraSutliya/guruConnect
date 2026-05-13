const mongoose = require('mongoose');
const Routine = require('./src/models/Routine');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const teacherIds = ['69d4cfd6d50d135147f2f170', '69d4d209d50d135147f2f18a'];
    const instituteId = '6964c3ca02b30df07276ee54';

    const baseRoutines = [
      {
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        classId: '69d4e10fb0dd183a64212d23', // Class 10
        sectionId: '69d4e196b0dd183a64212d8e', // Section A
        subjectId: '69d4e25eb0dd183a64212e1f'  // Maths
      },
      {
        day: 'Monday',
        startTime: '10:15',
        endTime: '11:15',
        classId: '69d4e110b0dd183a64212d29', // Class 11
        sectionId: '69d4e19ab0dd183a64212d95', // Section A
        subjectId: '69d4e230b0dd183a64212df7'  // Physics
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
      }
    ];

    const allRoutines = [];
    for (const teacherId of teacherIds) {
      for (const r of baseRoutines) {
        allRoutines.push({
          ...r,
          teacherId,
          instituteId
        });
      }
    }

    // Use upsert or handle duplicates
    for (const r of allRoutines) {
      try {
        await Routine.findOneAndUpdate(
          { 
            classId: r.classId, 
            sectionId: r.sectionId, 
            day: r.day, 
            startTime: r.startTime 
          },
          r,
          { upsert: true, new: true }
        );
      } catch (err) {
        console.log(`Skipped one record due to conflict or error: ${err.message}`);
      }
    }

    console.log(`Ensured routine records for both Prashant Singh profiles.`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
