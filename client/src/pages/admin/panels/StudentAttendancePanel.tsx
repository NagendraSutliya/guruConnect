import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FaUserCheck, FaUserTimes, FaChartLine } from "react-icons/fa";

const Card = ({ title, value, color, icon }: any) => (
  <div className={`bg-white shadow rounded-xl p-6 flex items-center gap-4`}>
    <div
      className={`p-3 rounded-full bg-${color}-100 text-${color}-600 text-xl 
                    flex items-center justify-center`}
    >
      {icon}
    </div>

    <p className="text-gray-500 flex-1">{title}</p>

    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

// const dummyToday = {
//   present: 320,
//   absent: 45,
//   rate: 87,
// };

// const dummyClassSummary = [
//   { class: "Class 1A", present: 28, absent: 2, rate: 93 },
//   { class: "Class 2B", present: 25, absent: 5, rate: 83 },
//   { class: "Class 3C", present: 30, absent: 0, rate: 100 },
// ];

// const dummyStudentSummary = [
//   { name: "Rahul Sharma", percentage: 92 },
//   { name: "Anita Verma", percentage: 85 },
//   { name: "Ravi Kumar", percentage: 78 },
// ];

// const dummyHistory = [
//   {
//     _id: "1",
//     studentId: { name: "Rahul Sharma" },
//     date: "2026-02-12",
//     status: "present",
//   },
//   {
//     _id: "2",
//     studentId: { name: "Anita Verma" },
//     date: "2026-02-12",
//     status: "absent",
//   },
//   {
//     _id: "3",
//     studentId: { name: "Ravi Kumar" },
//     date: "2026-02-11",
//     status: "present",
//   },
// ];

const StudentAttendancePanel = () => {
  const [today, setToday] = useState<any>(null);
  const [classSummary, setClassSummary] = useState<any[]>([]);
  const [studentSummary, setStudentSummary] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const load = async () => {
    try {
      const todayRes = await api.get("/attendance/summary/today");
      const classRes = await api.get("/attendance/summary/class");
      const studentRes = await api.get("/attendance/summary/student");
      const historyRes = await api.get("/attendance/history");

      setToday(todayRes.data.data);
      setClassSummary(classRes.data.data);
      setStudentSummary(studentRes.data.data);
      setHistory(historyRes.data.data);

      // setToday(dummyToday);
      // setClassSummary(dummyClassSummary);
      // setStudentSummary(dummyStudentSummary);
      // setHistory(dummyHistory);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div className="sticky flex justify-between items-center top-0 z-20 bg-gray-100 py-1 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Attendance Dashboard
        </h2>
      </div>

      {/* ===== Today Summary ===== */}
      {today && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card
            title="Present"
            value={today.present}
            color="green"
            icon={<FaUserCheck />}
          />
          <Card
            title="Absent"
            value={today.absent}
            color="red"
            icon={<FaUserTimes />}
          />
          <Card
            title="Attendance Rate"
            value={`${today.rate}%`}
            color="blue"
            icon={<FaChartLine />}
          />
        </div>
      )}

      {/* ===== Class Summary ===== */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3 text-gray-700">Class Summary</h3>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-cyan-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Present</th>
              <th className="p-3 text-left">Absent</th>
              <th className="p-3 text-left">Rate</th>
            </tr>
          </thead>
          <tbody>
            {classSummary.map((c, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 font-medium">{c.class}</td>
                <td className="p-3 text-green-600 font-semibold">
                  {c.present}
                </td>
                <td className="p-3 text-red-600 font-semibold">{c.absent}</td>
                <td className="p-3 font-semibold">{c.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Student Summary ===== */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3 text-gray-700">
          Student Attendance Report
        </h3>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-cyan-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {studentSummary.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{s.name}</td>
                <td className="p-3 font-semibold">{s.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== History ===== */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3 text-gray-700">Attendance History</h3>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-cyan-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((r) => (
              <tr key={r._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{r.studentId?.name}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      r.status === "present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendancePanel;
