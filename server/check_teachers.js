const mongoose = require('mongoose');
const Teacher = require('./src/models/Teacher');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const teachers = await Teacher.find({ name: /Prashant Singh/i });
    console.log('Teachers found:', JSON.stringify(teachers, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
