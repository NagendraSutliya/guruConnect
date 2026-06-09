const mongoose = require('mongoose');
require('dotenv').config();

const dropIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const collection = mongoose.connection.collection('attendances');
    await collection.dropIndexes();
    console.log("Dropped all indexes on 'attendances' collection.");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

dropIndexes();
