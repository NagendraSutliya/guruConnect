const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../.env" });

const Admission = require("./models/Admission");
const Class = require("./models/Class");
const Institute = require("./models/Institute");

const seedRealAdmissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for Admissions Seeding");

    const inst = await Institute.findOne({ email: "nagendra@itspar.com" });
    if (!inst) {
      console.error("Institute nagendra@itspar.com not found!");
      process.exit(1);
    }
    const instituteId = inst._id;

    // Get available classes
    let classes = await Class.find({ instituteId });
    if (!classes || classes.length === 0) {
      console.log("Creating default classes...");
      const c1 = await Class.create({ name: "Class 1", instituteId });
      const c2 = await Class.create({ name: "Class 2", instituteId });
      const c6 = await Class.create({ name: "Class 6", instituteId });
      const c11 = await Class.create({ name: "Class 11", instituteId });
      classes = [c1, c2, c6, c11];
    }

    const getClassId = (nameLike) => {
      const found = classes.find(c => c.name.toLowerCase().includes(nameLike.toLowerCase()));
      return found ? found._id : classes[0]._id;
    };

    // Remove old test garbage if any (e.g. "hghfs", "dfgdsfg", "ergeg")
    await Admission.deleteMany({
      instituteId,
      name: { $in: ["hghfs", "dfgdsfg", "ergeg"] }
    });

    const sampleAdmissions = [
      {
        name: "Ishaan Agarwal",
        email: "ishaan.parent@gmail.com",
        instituteId,
        classId: getClassId("1"),
        admissionNo: "ADM/2026/0101",
        stage: "enquiry",
        status: "Pending",
        source: "Website",
        counsellor: "Neha Saini",
        followUpText: "Call today",
        isOverdue: false,
        parentName: "Sanjay Agarwal",
        parentPhone: "9829012345",
        phone: "9829012345",
        dob: new Date("2020-09-15"),
        gender: "Male",
        category: "General",
        address: "B-12, Vaishali Nagar, Jaipur",
        previousSchool: "None (First admission)",
        interactionSchedule: {
          dateTimeRoom: "Mon, 27 Oct · 11:00 am · Room 2",
          outcome: "Not held yet"
        },
        documents: [
          { id: "d1", title: "Birth certificate", meta: "PDF · 350 KB", status: "Verified" },
          { id: "d2", title: "Child photo", meta: "JPG · 120 KB", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "14 Oct · Web form", text: "Enquiry submitted via school admission landing page." }
        ]
      },
      {
        name: "Myra Khandelwal",
        email: "myra.parent@gmail.com",
        instituteId,
        classId: getClassId("1"),
        admissionNo: "ADM/2026/0102",
        stage: "enquiry",
        status: "Pending",
        source: "Walk-in",
        counsellor: "Arjun Yadav",
        followUpText: "Tomorrow",
        isOverdue: false,
        parentName: "Deepak Khandelwal",
        parentPhone: "9414088921",
        phone: "9414088921",
        dob: new Date("2020-05-12"),
        gender: "Female",
        category: "General",
        address: "Flat 402, Royal Palms, Mansarovar, Jaipur",
        previousSchool: "Kidzee Play School",
        interactionSchedule: {
          dateTimeRoom: "Tue, 28 Oct · 10:00 am · Room 1",
          outcome: "Not held yet"
        },
        documents: [
          { id: "d1", title: "Birth certificate", meta: "PDF · 410 KB", status: "Verified" },
          { id: "d2", title: "Child photo", meta: "JPG · 150 KB", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "15 Oct · Front Desk", text: "Parents visited front office. Requested prospectus." }
        ]
      },
      {
        name: "Kabir Saxena",
        email: "kabir.parent@gmail.com",
        instituteId,
        classId: getClassId("6"),
        admissionNo: "ADM/2026/0103",
        stage: "followup",
        status: "Pending",
        source: "Referral",
        counsellor: "Neha Saini",
        followUpText: "26 Oct",
        isOverdue: false,
        parentName: "Alok Saxena",
        parentPhone: "9928044512",
        phone: "9928044512",
        dob: new Date("2015-11-24"),
        gender: "Male",
        category: "General",
        address: "18, Malviya Nagar, Jaipur",
        previousSchool: "St. Xavier's Senior School",
        interactionSchedule: {
          dateTimeRoom: "Thu, 29 Oct · 12:30 pm · Room 3",
          outcome: "Not held yet"
        },
        documents: [
          { id: "d1", title: "Birth certificate", meta: "PDF · 500 KB", status: "Verified" },
          { id: "d2", title: "Class 5 Marksheet", meta: "PDF · 1.2 MB", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "16 Oct · Call", text: "Referral from Tanvi's parents. Sibling concession discussed." }
        ]
      },
      {
        name: "Anaya Mathur",
        email: "anaya.mathur@gmail.com",
        instituteId,
        classId: getClassId("2"),
        admissionNo: "ADM/2026/0104",
        stage: "followup",
        status: "Pending",
        source: "Walk-in",
        counsellor: "Arjun Yadav",
        followUpText: "28 Oct",
        isOverdue: false,
        parentName: "Vikram Mathur",
        parentPhone: "9829177890",
        phone: "9829177890",
        dob: new Date("2019-07-18"),
        gender: "Female",
        category: "General",
        address: "54, C-Scheme, Jaipur",
        previousSchool: "Seedling Nursery",
        interactionSchedule: {
          dateTimeRoom: "Fri, 30 Oct · 09:30 am · Room 2",
          outcome: "Not held yet"
        },
        documents: [
          { id: "d1", title: "Birth certificate", meta: "Verified", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "17 Oct · In-Person", text: "Campus tour completed with mother." }
        ]
      },
      {
        name: "Aditya Rawat",
        email: "aditya.rawat@gmail.com",
        instituteId,
        classId: getClassId("11"),
        admissionNo: "ADM/2026/0105",
        stage: "application",
        status: "Pending",
        source: "Referral",
        counsellor: "Arjun Yadav",
        followUpText: "Form complete",
        isOverdue: false,
        parentName: "Rajendra Rawat",
        parentPhone: "9460077123",
        phone: "9460077123",
        dob: new Date("2010-04-05"),
        gender: "Male",
        category: "General",
        address: "A-15, Civil Lines, Jaipur",
        previousSchool: "DPS Jaipur",
        interactionSchedule: {
          dateTimeRoom: "Sat, 31 Oct · 2:00 pm · Room 5",
          outcome: "Not held yet"
        },
        documents: [
          { id: "d1", title: "Class 10 CBSE Marksheet", meta: "PDF · 1.5 MB · 92.4%", status: "Verified" },
          { id: "d2", title: "Migration certificate", meta: "PDF · 600 KB", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "18 Oct · Visit", text: "Opted for PCM with Computer Science stream." }
        ]
      },
      {
        name: "Rohan Verma",
        email: "rohan.verma@gmail.com",
        instituteId,
        classId: getClassId("10"),
        admissionNo: "ADM/2026/0106",
        stage: "application",
        status: "Pending",
        source: "Website",
        counsellor: "Neha Saini",
        followUpText: "Fee pending",
        isOverdue: false,
        parentName: "Mahesh Verma",
        parentPhone: "9829344120",
        phone: "9829344120",
        dob: new Date("2011-08-14"),
        gender: "Male",
        category: "OBC",
        address: "Sector 3, Pratap Nagar, Jaipur",
        previousSchool: "Tagore Public School",
        interactionSchedule: {
          dateTimeRoom: "Sat, 31 Oct · 3:30 pm · Room 1",
          outcome: "Not held yet"
        },
        documents: [
          { id: "d1", title: "Birth certificate", meta: "Verified", status: "Verified" },
          { id: "d2", title: "Class 9 Marksheet", meta: "88.6%", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "19 Oct · Portal", text: "Application form filled online." }
        ]
      },
      {
        name: "Navya Jangid",
        email: "navya.jangid@gmail.com",
        instituteId,
        classId: getClassId("1"),
        admissionNo: "ADM/2026/0107",
        stage: "verification",
        status: "Pending",
        source: "Walk-in",
        counsellor: "Neha Saini",
        followUpText: "Docs verified",
        isOverdue: false,
        parentName: "Mahendra Jangid",
        parentPhone: "9828199042",
        phone: "9828199042",
        dob: new Date("2021-01-18"),
        gender: "Female",
        category: "OBC",
        address: "Sector 7, Mansarovar, Jaipur",
        previousSchool: "Little Steps Play School (UKG)",
        interactionSchedule: {
          dateTimeRoom: "Completed · Room 4",
          outcome: "Recommended"
        },
        documents: [
          { id: "d1", title: "Birth certificate", meta: "Verified by Neha S.", status: "Verified" },
          { id: "d2", title: "Aadhaar Card", meta: "Verified", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "19 Oct · Verification", text: "Address proof and birth certificate verified." }
        ]
      },
      {
        name: "Shaurya Pratap Singh",
        email: "shaurya.singh@gmail.com",
        instituteId,
        classId: getClassId("7"),
        admissionNo: "ADM/2026/0108",
        stage: "test",
        status: "Pending",
        source: "Referral",
        counsellor: "Arjun Yadav",
        followUpText: "Test tomorrow",
        isOverdue: false,
        parentName: "Rana Pratap Singh",
        parentPhone: "9414355201",
        phone: "9414355201",
        dob: new Date("2014-03-22"),
        gender: "Male",
        category: "General",
        address: "Plot 14, Chitrakoot, Jaipur",
        previousSchool: "Army Public School",
        interactionSchedule: {
          dateTimeRoom: "Tomorrow · 10:00 am · Lab 2",
          outcome: "Not held yet"
        },
        documents: [
          { id: "d1", title: "Class 6 Marksheet", meta: "A Grade", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "19 Oct · Front Office", text: "Aptitude screening test scheduled." }
        ]
      },
      {
        name: "Dhruv Mehta",
        email: "dhruv.mehta@gmail.com",
        instituteId,
        classId: getClassId("4"),
        admissionNo: "ADM/2026/0109",
        stage: "approved",
        status: "Pending",
        source: "Website",
        counsellor: "Arjun Yadav",
        followUpText: "Seat allotted",
        isOverdue: false,
        parentName: "Nitin Mehta",
        parentPhone: "9829088214",
        phone: "9829088214",
        dob: new Date("2017-09-21"),
        gender: "Male",
        category: "General",
        address: "B-22, Gandhi Nagar, Jaipur",
        previousSchool: "Bachpan Play School",
        interactionSchedule: {
          dateTimeRoom: "Completed",
          outcome: "Recommended"
        },
        documents: [
          { id: "d1", title: "Birth certificate", meta: "Verified", status: "Verified" },
          { id: "d2", title: "Address proof", meta: "Verified", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "18 Oct · Principal Desk", text: "Approved by Principal. Fee deposit invoice sent." }
        ]
      },
      {
        name: "Aarohi Sethi",
        email: "aarohi.sethi@gmail.com",
        instituteId,
        classId: getClassId("3"),
        admissionNo: "ADM/2026/0110",
        stage: "enrolled",
        status: "Confirmed",
        source: "Website",
        counsellor: "Neha Saini",
        followUpText: "Enrolled & Fees Paid",
        isOverdue: false,
        parentName: "Rajesh Sethi",
        parentPhone: "9829033219",
        phone: "9829033219",
        dob: new Date("2018-08-08"),
        gender: "Female",
        category: "General",
        address: "C-9, Tilak Nagar, Jaipur",
        previousSchool: "Step by Step School",
        interactionSchedule: {
          dateTimeRoom: "Completed",
          outcome: "Recommended"
        },
        documents: [
          { id: "d1", title: "Birth certificate", meta: "Verified", status: "Verified" },
          { id: "d2", title: "First Quarter Fee Receipt", meta: "Paid ₹35,000", status: "Verified" }
        ],
        followUps: [
          { id: "fu1", dateType: "19 Oct · Accounts", text: "Quarter 1 Fee received. Uniform & books issued." }
        ]
      }
    ];

    for (const adm of sampleAdmissions) {
      const exists = await Admission.findOne({ instituteId, admissionNo: adm.admissionNo });
      if (!exists) {
        await Admission.create(adm);
        console.log(`Created admission: ${adm.name} (${adm.stage})`);
      } else {
        await Admission.updateOne({ _id: exists._id }, { $set: adm });
        console.log(`Updated admission: ${adm.name} (${adm.stage})`);
      }
    }

    console.log("Seeding completed successfully! 10 real admissions present in DB.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedRealAdmissions();
