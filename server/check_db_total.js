const mongoose = require('mongoose');
const Routine = require('./src/models/Routine');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const total = await Routine.countDocuments();
    console.log('Total routine records:', total);

    const sample = await Routine.findOne();
    console.log('Sample record:', JSON.stringify(sample, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
