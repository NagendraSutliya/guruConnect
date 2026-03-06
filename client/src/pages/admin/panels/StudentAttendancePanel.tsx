// import { useEffect, useState } from "react";
// import api from "../../../api/axiosInstance";

// const StudentAttendancePanel = () => {
//   const [classes, setClasses] = useState<any[]>([]);
//   const [sections, setSections] = useState<any[]>([]);
//   const [students, setStudents] = useState<any[]>([]);
//   const [records, setRecords] = useState<any[]>([]);

//   const [classId, setClassId] = useState("");
//   const [sectionId, setSectionId] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

//   const [attendance, setAttendance] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD DATA ================= */

//   const loadClasses = async () => {
//     const res = await api.get("/classes");
//     setClasses(res.data.data);
//   };

//   const loadSections = async (cid: string) => {
//     if (!cid) return setSections([]);
//     const res = await api.get(`/sections/class/${cid}`);
//     setSections(res.data.data);
//   };

//   const loadStudents = async () => {
//     if (!classId) return;
//     setLoading(true);

//     const params = new URLSearchParams();
//     params.append("classId", classId);
//     if (sectionId) params.append("sectionId", sectionId);

//     const res = await api.get(`/students?${params.toString()}`);
//     setStudents(res.data.data);

//     setLoading(false);
//   };

//   const loadAttendance = async () => {
//     const res = await api.get(`/attendance?date=${date}`);
//     setRecords(res.data.data);
//   };

//   useEffect(() => {
//     loadClasses();
//     loadAttendance();
//   }, []);

//   useEffect(() => {
//     loadSections(classId);
//     loadStudents();
//   }, [classId, sectionId]);

//   /* ================= MARK ================= */

//   const toggleAttendance = (studentId: string) => {
//     setAttendance((prev) => ({
//       ...prev,
//       [studentId]: prev[studentId] === "present" ? "absent" : "present",
//     }));
//   };

//   const saveAttendance = async () => {
//     const payload = Object.entries(attendance).map(([studentId, status]) => ({
//       studentId,
//       date,
//       status,
//     }));

//     await api.post("/attendance", payload);
//     alert("Attendance saved");
//     loadAttendance();
//   };

//   /* ================= UI ================= */

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-6">Attendance Record</h2>

//       {/* Filters */}
//       <div className="grid grid-cols-4 gap-3 mb-6">
//         <select value={classId} onChange={(e) => setClassId(e.target.value)}>
//           <option>Select class</option>
//           {classes.map((c) => (
//             <option key={c._id} value={c._id}>
//               {c.name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={sectionId}
//           onChange={(e) => setSectionId(e.target.value)}
//         >
//           <option>Section (optional)</option>
//           {sections.map((s) => (
//             <option key={s._id} value={s._id}>
//               {s.name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />

//         <button
//           onClick={saveAttendance}
//           className="bg-green-600 text-white rounded"
//         >
//           Save
//         </button>
//       </div>

//       {/* Mark attendance */}
//       <div className="bg-white rounded shadow mb-8">
//         {loading ? (
//           <div className="p-6 text-gray-500">Loading students...</div>
//         ) : students.length === 0 ? (
//           <div className="p-6 text-gray-500">No students found</div>
//         ) : (
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3">Student</th>
//                 <th className="p-3">Mark</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s) => (
//                 <tr key={s._id} className="border-t">
//                   <td className="p-3">{s.name}</td>
//                   <td className="p-3">
//                     <button
//                       onClick={() => toggleAttendance(s._id)}
//                       className={`px-3 py-1 rounded text-white ${
//                         attendance[s._id] === "present"
//                           ? "bg-green-600"
//                           : "bg-red-600"
//                       }`}
//                     >
//                       {attendance[s._id] === "present" ? "Present" : "Absent"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* History */}
//       <div className="bg-white rounded shadow">
//         <h3 className="p-4 font-semibold">Attendance Records</h3>

//         <table className="w-full text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3">Student</th>
//               <th className="p-3">Date</th>
//               <th className="p-3">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {records.map((r) => (
//               <tr key={r._id} className="border-t">
//                 <td className="p-3">{r.studentId?.name}</td>
//                 <td className="p-3">{r.date.slice(0, 10)}</td>
//                 <td className="p-3">{r.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StudentAttendancePanel;

import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const Card = ({ title, value, color }: any) => (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
  </div>
);

const dummyToday = {
  present: 320,
  absent: 45,
  rate: 87,
};

const dummyClassSummary = [
  { class: "Class 1A", present: 28, absent: 2, rate: 93 },
  { class: "Class 2B", present: 25, absent: 5, rate: 83 },
  { class: "Class 3C", present: 30, absent: 0, rate: 100 },
];

const dummyStudentSummary = [
  { name: "Rahul Sharma", percentage: 92 },
  { name: "Anita Verma", percentage: 85 },
  { name: "Ravi Kumar", percentage: 78 },
];

const dummyHistory = [
  {
    _id: "1",
    studentId: { name: "Rahul Sharma" },
    date: "2026-02-12",
    status: "present",
  },
  {
    _id: "2",
    studentId: { name: "Anita Verma" },
    date: "2026-02-12",
    status: "absent",
  },
  {
    _id: "3",
    studentId: { name: "Ravi Kumar" },
    date: "2026-02-11",
    status: "present",
  },
];

const StudentAttendancePanel = () => {
  const [today, setToday] = useState<any>(null);
  const [classSummary, setClassSummary] = useState<any[]>([]);
  const [studentSummary, setStudentSummary] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  // const load = async () => {
  //   const t = await api.get("/attendance/summary/today");
  //   const c = await api.get("/attendance/summary/class");
  //   const s = await api.get("/attendance/summary/student");
  //   const h = await api.get("/attendance/history");

  //   setToday(t.data.data);
  //   setClassSummary(c.data.data || []);
  //   setStudentSummary(s.data.data || []);
  //   setHistory(h.data.data || []);
  // };

  // For dummy data display
  const load = async () => {
    setToday(dummyToday);
    setClassSummary(dummyClassSummary);
    setStudentSummary(dummyStudentSummary);
    setHistory(dummyHistory);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <h2 className="text-2xl font-bold text-gray-800">Attendance Dashboard</h2>

      {/* ===== Today Summary ===== */}
      {today && (
        <div className="grid grid-cols-3 gap-4">
          <Card title="Present" value={today.present} color="green" />
          <Card title="Absent" value={today.absent} color="red" />
          <Card title="Attendance Rate" value={`${today.rate}%`} color="blue" />
        </div>
      )}

      {/* ===== Class Summary ===== */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Class Summary</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Class</th>
              <th className="p-3">Present</th>
              <th className="p-3">Absent</th>
              <th className="p-3">Rate</th>
            </tr>
          </thead>

          <tbody>
            {classSummary.map((c, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{c.class}</td>
                <td className="p-3">{c.present}</td>
                <td className="p-3">{c.absent}</td>
                <td className="p-3 font-semibold">{c.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Student Summary ===== */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Student Attendance Report</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Attendance %</th>
            </tr>
          </thead>

          <tbody>
            {studentSummary.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3 font-semibold">{s.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== History ===== */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Attendance History</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {history.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3">{r.studentId?.name}</td>
                <td className="p-3">{r.date.slice(0, 10)}</td>
                <td className="p-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendancePanel;
