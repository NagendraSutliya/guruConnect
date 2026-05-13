import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiClock, FiCalendar, FiMapPin, FiUser, FiActivity, FiCpu, FiLayout, FiZap } from "react-icons/fi";

const StudentRoutinePanel = () => {
  const [routine, setRoutine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        setLoading(true);
        const res = await api.get("/student/routine");
        setRoutine(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch routine", err);
        setRoutine([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutine();
  }, []);

  const getDayRoutine = (day: string) => {
    return routine
      .filter((r) => r.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysLectures = getDayRoutine(today).length;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Academic Routine...</p>
      </div>
    );

  return (
    <div className="space-y-2 animate-fade-in pb-12">
      
      {/* 1. SYNCED STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-xl rounded-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 shadow-sm">
        <div>
           <h1 className="text-xl font-black text-blue-700 tracking-tight leading-none">Lecture Routine</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">Weekly Academic Timeline & Logistics</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-white shadow-xl shadow-slate-200 flex items-center gap-4">
              <div className="text-right border-r border-white/10 pr-4">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Cycle Node</p>
                 <h4 className="text-sm font-black text-emerald-400 leading-none mt-1">ACTIVE</h4>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Weekly Nodes</p>
                 <h4 className="text-sm font-black text-white leading-none mt-1">{routine.length}</h4>
              </div>
           </div>
        </div>
      </div>

      {/* 2. SYNCED ANALYTICS VITALS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Today's Load", val: todaysLectures, icon: FiActivity, color: "text-blue-500", bg: "bg-blue-50", hb: "hover:border-blue-500", hbg: "hover:bg-blue-50/30" },
          { label: "Weekly Span", val: "6 DAYS", icon: FiLayout, color: "text-amber-500", bg: "bg-amber-50", hb: "hover:border-amber-500", hbg: "hover:bg-amber-50/30" },
          { label: "Current Node", val: "TRACKING", icon: FiZap, color: "text-emerald-500", bg: "bg-emerald-50", hb: "hover:border-emerald-500", hbg: "hover:bg-emerald-50/30" },
          { label: "System Sync", val: "STABLE", icon: FiCpu, color: "text-indigo-500", bg: "bg-indigo-50", hb: "hover:border-indigo-500", hbg: "hover:bg-indigo-50/30" },
        ].map((item, i) => (
          <div key={i} className={`card-clean p-4 mb-3 bg-white border-slate-200 group ${item.hb} ${item.hbg} hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
             <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm`}>
                   <item.icon size={16} />
                </div>
                <span className="text-lg font-black text-slate-800 tracking-tighter">{item.val}</span>
             </div>
             <div className="mt-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none group-hover:text-slate-600 transition-colors">{item.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* 3. ROUTINE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        {days.map((day) => {
          const dayRecords = getDayRoutine(day);
          const isToday = day === today;
          return (
            <div key={day} className={`card-clean flex flex-col border-slate-200 bg-white transition-all duration-500 ${isToday ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`} />
                   <h3 className={`bg-blue-500 rounded-full px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest`}>{day}</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {dayRecords.length} Nodes
                </span>
              </div>
              <div className="p-4 space-y-3 flex-1 bg-slate-50/30">
                {dayRecords.length > 0 ? (
                  dayRecords.map((r, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <FiClock size={14} />
                          <span className="text-[11px] font-black uppercase tracking-tight">
                            {r.startTime} - {r.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100">
                          <FiMapPin size={12} className="text-slate-400" />{" "}
                          {r.room || "Lab A"}
                        </div>
                      </div>

                      <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-4">
                        {r.subjectId?.name}
                      </h4>

                      <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                            <FiUser size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                              Faculty Node
                            </span>
                            <span className="text-[10px] font-bold text-slate-800">
                              {r.teacherId?.name || "Assigning..."}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Decorator */}
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-600 transition-all" />
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <FiCalendar size={24} className="text-slate-200 mb-2" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                      System Idle
                      <br />
                      No Nodes Scheduled
                    </p>
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

export default StudentRoutinePanel;
