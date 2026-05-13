import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiClock, FiBook, FiUsers, FiMapPin, FiCalendar } from "react-icons/fi";

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
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synchronizing Itinerary...</p>
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Sticky Header - Synced Aura Style */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 mb-2 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Academic Itinerary</h1>
          <p className="text-xs text-slate-500 font-medium">Your synchronized weekly lecture and classroom distribution.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-indigo-100 shadow-sm">
             <FiCalendar className="text-indigo-600" size={14} />
             <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {days.map((day) => {
          const dayRecords = getDayRoutine(day);
          const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;

          return (
            <div key={day} className={`card-clean overflow-hidden transition-all duration-300 ${isToday ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-300 hover:border-slate-400'}`}>
              <div className={`px-5 py-3 border-b flex items-center justify-between ${isToday ? 'bg-indigo-600 text-white' : 'bg-slate-50/80 text-slate-800'}`}>
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-black uppercase tracking-widest">{day}</h3>
                  {isToday && <span className="px-2 py-0.5 bg-white/20 text-[8px] font-bold uppercase rounded-full">Today</span>}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-indigo-100' : 'text-slate-400'}`}>
                   {dayRecords.length} Sessions
                </span>
              </div>
              
              <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                {dayRecords.length > 0 ? (
                  dayRecords.map((r, i) => (
                    <div key={i} className="group relative pl-4 border-l-2 border-slate-100 hover:border-indigo-400 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <FiClock size={12} className="group-hover:scale-125 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-tight">{r.startTime} — {r.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 text-[9px] font-black text-slate-500 rounded-lg border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                           <FiMapPin size={10} />
                           <span>R-{r.room || "Lab"}</span>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-1">{r.subjectId?.name}</h4>
                      
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                          <FiUsers size={10} />
                          <span>Class {r.classId?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-black uppercase tracking-widest border border-amber-100">
                          <FiBook size={10} />
                          <span>Sec {r.sectionId?.name}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-50 rounded-2xl bg-slate-50/20">
                    <FiCalendar size={24} className="text-slate-200 mb-2" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Downtime</p>
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

