const mongoose = require('mongoose');
require('dotenv').config();

const checkExamSubject = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const collection = mongoose.connection.collection('examsubjects');
    const es = await collection.find().limit(2).toArray();

    console.log(JSON.stringify(es, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkExamSubject();
