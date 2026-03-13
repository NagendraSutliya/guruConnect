import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Users } from "lucide-react";
import api from "../../../api/axiosInstance";

// Type for each class attendance
interface ClassAttendance {
  name: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  classId: string;
}

const AttendanceSummary: React.FC = () => {
  const [classesData, setClassesData] = useState<ClassAttendance[]>([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dummy fallback data
  const dummyData: ClassAttendance[] = [
    { classId: "10A", name: "10A", total: 34, present: 28, absent: 4, late: 2 },
    { classId: "10B", name: "10B", total: 31, present: 25, absent: 5, late: 1 },
    { classId: "11A", name: "11A", total: 35, present: 30, absent: 2, late: 3 },
  ];

  useEffect(() => {
    const fetchClassSummary = async () => {
      try {
        const res = await api.get("/teacher/attendance/summary");
        const rawData = res.data?.data || [];

        if (!rawData.length) {
          setClassesData(dummyData);
          setLoading(false);
          return;
        }

        const classMap: Record<string, ClassAttendance> = {};

        rawData.forEach((item: any) => {
          const { classId, status } = item._id;
          const count = item.count;

          if (!classMap[classId]) {
            classMap[classId] = {
              classId,
              name: classId,
              total: 0,
              present: 0,
              absent: 0,
              late: 0,
            };
          }

          const cls = classMap[classId];

          cls.total += count;

          if (status === "present") cls.present += count;
          if (status === "absent") cls.absent += count;
          if (status === "late") cls.late += count;
        });

        setClassesData(Object.values(classMap));
      } catch (err) {
        console.error("Attendance API failed, using dummy data:", err);
        setClassesData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchClassSummary();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-5 shadow-sm text-center">
        Loading attendance...
      </div>
    );
  }

  if (!classesData.length) {
    return (
      <div className="bg-white border rounded-xl p-5 shadow-sm text-center">
        No attendance data available
      </div>
    );
  }

  const selectedClass = classesData[selectedClassIndex];

  const attendanceRate = selectedClass.total
    ? Math.round((selectedClass.present / selectedClass.total) * 100)
    : 0;

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={18} />
            Attendance
          </h2>

          <div className="flex gap-6 p-1 mt-2">
            <span className="border rounded shadow px-2 py-1 text-sm font-semibold text-gray-500">
              Total Students: {selectedClass.total}
            </span>

            <span className="border rounded shadow px-2 py-1 text-sm font-semibold text-gray-500">
              Attendance Rate: {attendanceRate}%
            </span>
          </div>
        </div>

        {/* Dropdown only if multiple classes */}
        {classesData.length > 1 && (
          <select
            className="border rounded-lg px-2 py-1 text-sm"
            value={selectedClassIndex}
            onChange={(e) => setSelectedClassIndex(Number(e.target.value))}
          >
            {classesData.map((cls, idx) => (
              <option key={cls.classId} value={idx}>
                {cls.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${attendanceRate}%` }}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="flex items-center gap-4 bg-green-50 p-6 rounded-xl shadow-sm justify-center">
          <CheckCircle size={40} className="text-green-600" />
          <div>
            <p className="text-gray-600 font-medium">Present</p>
            <p className="text-2xl font-bold">{selectedClass.present}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-red-50 p-6 rounded-xl shadow-sm justify-center">
          <XCircle size={40} className="text-red-600" />
          <div>
            <p className="text-gray-600 font-medium">Absent</p>
            <p className="text-2xl font-bold">{selectedClass.absent}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-yellow-50 p-6 rounded-xl shadow-sm justify-center">
          <Clock size={40} className="text-yellow-600" />
          <div>
            <p className="text-gray-600 font-medium">Late</p>
            <p className="text-2xl font-bold">{selectedClass.late}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-right">
        <button className="text-sm text-blue-600 hover:underline">
          View Full Attendance →
        </button>
      </div>
    </div>
  );
};

export default AttendanceSummary;
