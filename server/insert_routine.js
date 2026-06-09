const mongoose = require('mongoose');
const Routine = require('./src/models/Routine');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const teacherId = '69d4cfd6d50d135147f2f170';
    const instituteId = '6964c3ca02b30df07276ee54';

    const routines = [
      {
        instituteId,
        teacherId,
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        classId: '69d4e10fb0dd183a64212d23', // Class 10
        sectionId: '69d4e196b0dd183a64212d8e', // Section A
        subjectId: '69d4e25eb0dd183a64212e1f'  // Maths
      },
      {
        instituteId,
        teacherId,
        day: 'Monday',
        startTime: '10:15',
        endTime: '11:15',
        classId: '69d4e110b0dd183a64212d29', // Class 11
        sectionId: '69d4e19ab0dd183a64212d95', // Section A
        subjectId: '69d4e230b0dd183a64212df7'  // Physics
      },
      {
        instituteId,
        teacherId,
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '10:00',
        classId: '69d4e113b0dd183a64212d2f', // Class 12
        sectionId: '69d4e19eb0dd183a64212d9c', // Section A
        subjectId: '69d4e268b0dd183a64212e29'  // Chemistry
      },
      {
        instituteId,
        teacherId,
        day: 'Wednesday',
        startTime: '11:30',
        endTime: '12:30',
        classId: '69d4e10cb0dd183a64212d1d', // Class 9
        sectionId: '69d4e193b0dd183a64212d87', // Section A
        subjectId: '69d4e271b0dd183a64212e35'  // Computer
      },
      {
        instituteId,
        teacherId,
        day: 'Thursday',
        startTime: '14:00',
        endTime: '15:00',
        classId: '69d4e10fb0dd183a64212d23', // Class 10
        sectionId: '69d4e196b0dd183a64212d8e', // Section A
        subjectId: '69d4e25eb0dd183a64212e1f'  // Maths
      },
      {
        instituteId,
        teacherId,
        day: 'Friday',
        startTime: '09:00',
        endTime: '10:00',
        classId: '69d4e110b0dd183a64212d29', // Class 11
        sectionId: '69d4e19ab0dd183a64212d95', // Section A
        subjectId: '69d4e230b0dd183a64212df7'  // Physics
      }
    ];

    // Clear existing routine for this teacher if any (optional, but good for idempotency in this task)
    // await Routine.deleteMany({ teacherId });

    const result = await Routine.insertMany(routines);
    console.log(`Successfully inserted ${result.length} routine records for Prashant Singh.`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting routine:', err);
    process.exit(1);
  }
}

run();
