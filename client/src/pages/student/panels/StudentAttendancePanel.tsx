import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiBook,
  FiZap,
} from "react-icons/fi";

const StudentAttendancePanel = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/attendance");
      setRecords(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    present: records.filter((r) => r.status?.toLowerCase() === "present").length,
    absent: records.filter((r) => r.status?.toLowerCase() === "absent").length,
    late: records.filter((r) => r.status?.toLowerCase() === "late").length,
    leave: records.filter((r) => r.status?.toLowerCase() === "leave").length,
    total: records.length,
  };

  const percentage =
    stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  // Calculate Streak (Consecutive unique days)
  const uniqueDates = [...new Set(records.map(r => new Date(r.date).toDateString()))]
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  if (uniqueDates.length > 0) {
    streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = uniqueDates[i];
      const previous = uniqueDates[i + 1];
      const diffInDays = (current.getTime() - previous.getTime()) / (1000 * 3600 * 24);
      
      // If the difference is exactly 1 day, the streak continues
      if (Math.round(diffInDays) === 1) {
        streak++;
      } else {
        break; // Gap detected
      }
    }
  }

  // --- Grouping Logic ---
  const groupedRecords = records.reduce((acc: any, record: any) => {
    const dateKey = new Date(record.date).toLocaleDateString("en-GB", {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(record);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Organizing Sessions...</p>
      </div>
    );

  return (
    <div className="space-y-2 animate-fade-in pb-12">
      
      {/* 1. COMPACT STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-xl rounded-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 shadow-sm">
        <div>
           <h1 className="text-xl font-black text-blue-700 tracking-tight leading-none">Attendance Ledger</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">Multi-Session Registry</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-white shadow-xl shadow-slate-200 flex items-center gap-4">
              <div className="text-right border-r border-white/10 pr-4">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Overall Presence</p>
                 <h4 className="text-sm font-black text-emerald-400 leading-none mt-1">{percentage}%</h4>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Total Sessions</p>
                 <h4 className="text-sm font-black text-white leading-none mt-1">{stats.total}</h4>
              </div>
           </div>
        </div>
      </div>

      {/* 2. ANALYTICS VITALS (EXPANDED BENTO) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Present", val: stats.present, icon: FiCheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", hoverBorder: "hover:border-emerald-500", hoverBg: "hover:bg-emerald-50/30" },
          { label: "Absent", val: stats.absent, icon: FiXCircle, color: "text-rose-500", bg: "bg-rose-50", hoverBorder: "hover:border-rose-500", hoverBg: "hover:bg-rose-50/30" },
          { label: "Late", val: stats.late, icon: FiClock, color: "text-amber-500", bg: "bg-amber-50", hoverBorder: "hover:border-amber-500", hoverBg: "hover:bg-amber-50/30" },
          { label: "Leaves", val: stats.leave, icon: FiCalendar, color: "text-blue-500", bg: "bg-blue-50", hoverBorder: "hover:border-blue-500", hoverBg: "hover:bg-blue-50/30" },
          { label: "Streak", val: `${streak}d`, icon: FiZap, color: "text-indigo-500", bg: "bg-indigo-50", hoverBorder: "hover:border-indigo-500", hoverBg: "hover:bg-indigo-50/30" },
        ].map((item, i) => (
          <div key={i} className={`card-clean p-4 bg-white border-slate-200 mb-3 group ${item.hoverBorder} ${item.hoverBg} hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
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

      {/* 3. DATE-GROUPED SESSION TRACKER */}
      <div className="space-y-6">
        {Object.keys(groupedRecords).length > 0 ? (
          Object.entries(groupedRecords).map(([date, sessions]: [string, any], idx) => (
            <div key={date} className="space-y-3 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              {/* Date Header Indicator */}
              <div className="flex items-center gap-4 px-2">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    <h3 className="bg-blue-500 rounded-full px-4 py-1 text-[11px] font-black text-white uppercase tracking-[0.2em]">{date}</h3>
                 </div>
                 <div className="flex-1 h-px bg-slate-100" />
                 <span className="text-[9px] font-black text-slate-600 uppercase">{sessions.length} Sessions Marked</span>
              </div>

              {/* Session Table for this Date */}
              <div className="card-clean border-slate-200 bg-white overflow-hidden shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-green-100">
                             <th className="px-4 py-3 w-20">Period</th>
                             <th className="px-4 py-3">Subject & Teacher</th>
                             <th className="px-4 py-3">Status</th>
                             <th className="px-4 py-3 text-right">Remarks</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {sessions.map((session: any, sIdx: number) => (
                             <tr key={sIdx} className="hover:bg-slate-50/50 transition-all group">
                                <td className="px-2 py-2">
                                   <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center font-black text-[12px] group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                      {session.period || idx + 1}
                                   </div>
                                </td>
                                <td className="px-2 py-2">
                                   <div className="flex items-center gap-4">
                                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                         <FiBook size={18} />
                                      </div>
                                      <div>
                                         <h4 className="text-sm font-medium text-slate-800 tracking-tight leading-none">{session.subjectId?.name || "General Session"}</h4>
                                         <div className="flex items-center gap-2 mt-2">
                                            <FiUser size={20} className="text-slate-300" />
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{session.recordedBy?.name || "Instructor Name"}</p>
                                         </div>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-2 py-2">
                                   <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                      session.status?.toLowerCase() === "present" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                      session.status?.toLowerCase() === "absent" ? "bg-rose-50 text-rose-600 border-rose-100" : 
                                      "bg-amber-50 text-amber-600 border-amber-100"
                                   }`}>
                                      <div className={`w-1 h-1 rounded-full animate-pulse ${session.status?.toLowerCase() === "present" ? "bg-emerald-600" : session.status?.toLowerCase() === "absent" ? "bg-rose-600" : "bg-amber-600"}`} />
                                      {session.status}
                                   </span>
                                </td>
                                <td className="px-4 py-2 text-right text-[10px] font-medium text-slate-400 italic">
                                   {session.remarks || "—"}
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 text-center card-clean border-dashed border-slate-200 bg-white">
             <FiCalendar size={48} className="text-slate-100 mx-auto mb-4" />
             <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No registry data detected</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentAttendancePanel;
