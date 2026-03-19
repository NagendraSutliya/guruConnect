const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      required: true,
    },

    startTime: {
      type: String, // "09:00"
      required: true,
    },

    endTime: {
      type: String, // "10:00"
      required: true,
    },
  },
  { timestamps: true }
);

// ❗ Prevent duplicate same slot
routineSchema.index(
  { classId: 1, sectionId: 1, day: 1, startTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("Routine", routineSchema);
