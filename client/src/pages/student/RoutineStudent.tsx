import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { FiClock,   FiCalendar, FiMapPin, FiUser } from "react-icons/fi";

const RoutineStudent = () => {
  const [routine, setRoutine] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await api.get("/student/routine");
        const data = res.data.data || [];
        if (data.length === 0) {
          setRoutine([
            { day: "Monday", startTime: "08:30", endTime: "09:30", subjectId: { name: "Quantum Theory" }, teacherId: { name: "Dr. Smith" }, room: "Hall A" },
            { day: "Monday", startTime: "10:30", endTime: "11:30", subjectId: { name: "Advanced Calculus" }, teacherId: { name: "Prof. Jones" }, room: "Lab 2" },
            { day: "Tuesday", startTime: "09:00", endTime: "10:00", subjectId: { name: "Digital Logic" }, teacherId: { name: "Dr. Alan" }, room: "Room 101" },
            { day: "Wednesday", startTime: "08:30", endTime: "09:30", subjectId: { name: "Material Science" }, teacherId: { name: "Prof. Baker" }, room: "Tech Wing" },
            { day: "Thursday", startTime: "11:00", endTime: "12:00", subjectId: { name: "Quantum Theory" }, teacherId: { name: "Dr. Smith" }, room: "Hall A" },
            { day: "Friday", startTime: "10:00", endTime: "11:00", subjectId: { name: "Data Structures" }, teacherId: { name: "Prof. Reed" }, room: "CS Lab" },
          ]);
        } else {
          setRoutine(data);
        }
      } catch (err) {
        setRoutine([]);
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
    <div className="flex items-center justify-center h-64 py-20">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Academic Routine</h2>
          <p className="text-sm text-slate-500 font-medium">Your weekly lecture schedule and classroom assignments.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
           6-Day Academic Cycle
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {days.map((day) => {
          const dayRecords = getDayRoutine(day);
          return (
            <div key={day} className="card-clean overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.15em]">{day}</h3>
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">{dayRecords.length} Nodes</span>
              </div>
              <div className="p-4 space-y-4 flex-1">
                {dayRecords.length > 0 ? (
                  dayRecords.map((r, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <FiClock size={14} />
                          <span className="text-[11px] font-black uppercase tracking-tight">{r.startTime} - {r.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100">
                           <FiMapPin size={12} className="text-slate-400" /> {r.room || "Lab A"}
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight mb-3">
                         {r.subjectId?.name}
                      </h4>
                      
                      <div className="flex items-center gap-4 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                              <FiUser size={12} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-0.5">Faculty Node</span>
                              <span className="text-[10px] font-bold text-slate-600">{r.teacherId?.name || "Assigning..."}</span>
                           </div>
                        </div>
                      </div>
                      
                      {/* Interactive Decorator */}
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-all" />
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                    <FiCalendar size={24} className="text-slate-200 mb-2" />
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">System Idle<br/>No Nodes Scheduled</p>
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

export default RoutineStudent;
