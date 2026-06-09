const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const Class = require("./models/Class");
const Section = require("./models/Section");
const Student = require("./models/Student");

const ACADEMIC_YEAR_ID = "69e355369d47cf2a4da33d6c";
const INSTITUTE_ID = "6964c3ca02b30df07276ee54";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const classesToCreate = ["Class 11", "Class 12"];
    const sectionsToCreate = ["Section A", "Section B"];

    for (const className of classesToCreate) {
      let classDoc = await Class.findOne({ name: className, instituteId: INSTITUTE_ID });
      if (!classDoc) {
        classDoc = await Class.create({
          name: className,
          academicYearId: ACADEMIC_YEAR_ID,
          instituteId: INSTITUTE_ID,
          description: `Standard ${className}`
        });
        console.log(`Created ${className}`);
      }

      for (const sectionName of sectionsToCreate) {
        let sectionDoc = await Section.findOne({ name: sectionName, classId: classDoc._id, instituteId: INSTITUTE_ID });
        if (!sectionDoc) {
          sectionDoc = await Section.create({
            name: sectionName,
            classId: classDoc._id,
            instituteId: INSTITUTE_ID
          });
          console.log(`Created ${className} - ${sectionName}`);
        }

        // Determine number of students to insert
        let studentCount = 30;
        if (className === "Class 11" && sectionName === "Section B") studentCount = 28;

        console.log(`Inserting ${studentCount} students for ${className} - ${sectionName}...`);

        for (let i = 1; i <= studentCount; i++) {
          const rollNo = i;
          const name = `${className} ${sectionName} Student ${i}`;
          const email = `${className.replace(" ", "")}${sectionName.replace(" ", "")}student${i}@test.com`.toLowerCase();

          // Check if student already exists by rollNo in this class/section
          const existingStudent = await Student.findOne({ classId: classDoc._id, sectionId: sectionDoc._id, rollNo: rollNo });
          
          if (!existingStudent) {
            await Student.create({
              name: name,
              email: email,
              instituteId: INSTITUTE_ID,
              classId: classDoc._id,
              sectionId: sectionDoc._id,
              rollNo: rollNo,
              admissionNo: `ADM-${className.split(" ")[1]}-${sectionName.split(" ")[1]}-${i}`,
              phone: `9876543${i.toString().padStart(3, "0")}`,
              parentPhone: `9123456${i.toString().padStart(3, "0")}`,
              gender: i % 2 === 0 ? "Male" : "Female",
              dob: new Date(2008, i % 12, (i % 28) + 1),
              address: `${i}, Main Street, Campus Area`,
              isActive: true
            });
          }
        }
        console.log(`Completed ${className} - ${sectionName}`);
      }
    }

    console.log("Seeding complete! 🚀");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedData();
