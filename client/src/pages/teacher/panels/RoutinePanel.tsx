import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiClock, FiBook, FiUsers, FiMapPin} from "react-icons/fi";

const RoutinePanel = () => {
  const [routine, setRoutine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await api.get("/teacher/routine");
        setRoutine(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch routine:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutine();
  }, []);

  const getDayRoutine = (day: string) => {
    return routine.filter((r) => r.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Weekly Schedule</h2>
          <p className="text-xs text-slate-500 font-medium">Your assigned classes and academic routine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {days.map((day) => {
          const dayRecords = getDayRoutine(day);
          return (
            <div key={day} className="card-clean overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">{day}</h3>
                <span className="text-[10px] font-bold text-slate-400">{dayRecords.length} Classes</span>
              </div>
              <div className="p-3 space-y-3">
                {dayRecords.length > 0 ? (
                  dayRecords.map((r, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <FiClock size={12} />
                          <span className="text-[10px] font-bold uppercase">{r.startTime} - {r.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                           <FiMapPin size={10} /> Room {r.room || "Lab"}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{r.subjectId?.name}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <FiUsers size={12} className="text-slate-300" />
                          <span>Class {r.classId?.name}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <FiBook size={12} className="text-slate-300" />
                          <span>Section {r.sectionId?.name}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Classes Scheduled</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoutinePanel;
