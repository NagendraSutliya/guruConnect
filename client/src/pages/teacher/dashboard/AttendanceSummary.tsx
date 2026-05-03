import { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiUsers, FiBarChart2, FiChevronRight } from "react-icons/fi";
import api from "../../../api/axiosInstance";
import type { ClassAttendance } from "../../../types/teacher/types";

const AttendanceSummary: React.FC = () => {
  const [classesData, setClassesData] = useState<ClassAttendance[]>([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dummy fallback data
  const dummyData: ClassAttendance[] = [
    { classId: "10A", name: "Grade 10-A", total: 34, present: 28, absent: 4, late: 2 },
    { classId: "10B", name: "Grade 10-B", total: 31, present: 25, absent: 5, late: 1 },
    { classId: "11A", name: "Grade 11-A", total: 35, present: 30, absent: 2, late: 3 },
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
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 shadow-sm flex flex-col items-center justify-center h-[300px]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Attendance...</p>
      </div>
    );
  }

  const selectedClass = classesData[selectedClassIndex] || dummyData[0];
  const attendanceRate = selectedClass.total ? Math.round((selectedClass.present / selectedClass.total) * 100) : 0;

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 shadow-sm transition-all hover:shadow-xl group relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiUsers size={16} />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Attendance Intel</h2>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-10">
              Live Classroom Metrics • {selectedClass.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {classesData.length > 1 && (
              <select
                className="bg-white border border-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
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
            <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:scale-110 transition-transform">
              <FiBarChart2 size={18} />
            </button>
          </div>
        </div>

        {/* Hero Metric Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          <div className="lg:col-span-4 flex flex-col items-center justify-center border-r border-slate-100">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * attendanceRate) / 100}
                  strokeLinecap="round"
                  className="text-indigo-600 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800">{attendanceRate}%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rate</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 group/item hover:bg-emerald-50 transition-colors">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <FiCheckCircle size={10} /> Present
                </p>
                <p className="text-2xl font-black text-slate-800">{selectedClass.present}</p>
              </div>

              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50 group/item hover:bg-rose-50 transition-colors">
                <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <FiXCircle size={10} /> Absent
                </p>
                <p className="text-2xl font-black text-slate-800">{selectedClass.absent}</p>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50 group/item hover:bg-amber-50 transition-colors">
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <FiClock size={10} /> Late
                </p>
                <p className="text-2xl font-black text-slate-800">{selectedClass.late}</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between px-2">
               <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Students</p>
                    <p className="text-sm font-black text-slate-700">{selectedClass.total}</p>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Session Status</p>
                    <p className="text-sm font-black text-emerald-600">Completed</p>
                  </div>
               </div>
               <button className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                 Full Ledger <FiChevronRight />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
