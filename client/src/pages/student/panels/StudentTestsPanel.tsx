import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiActivity,
  FiCalendar,
  FiClock,
  FiChevronRight,
  FiCpu,
  FiBookOpen,
  FiLayers,
  FiCheckCircle,
} from "react-icons/fi";

const StudentTestsPanel = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/exams");
      setTests(res.data.data || []);
    } catch (err) {
      console.error("Failed to load exams", err);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const upcomingCount = tests.filter(t => new Date(t.date) >= new Date()).length;
  const completedCount = tests.length - upcomingCount;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Examination Matrix...</p>
      </div>
    );

  return (
    <div className="space-y-2 animate-fade-in pb-12">
      
      {/* 1. SYNCED STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-xl rounded-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 shadow-sm">
        <div>
           <h1 className="text-xl font-black text-blue-700 tracking-tight leading-none">Examination Matrix</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">Scheduled Academic Evaluations</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-white shadow-xl shadow-slate-200 flex items-center gap-4">
              <div className="text-right border-r border-white/10 pr-4">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Matrix Status</p>
                 <h4 className="text-sm font-black text-emerald-400 leading-none mt-1">ACTIVE</h4>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Total Nodes</p>
                 <h4 className="text-sm font-black text-white leading-none mt-1">{tests.length}</h4>
              </div>
           </div>
        </div>
      </div>

      {/* 2. SYNCED ANALYTICS VITALS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Exams", val: tests.length, icon: FiLayers, color: "text-blue-500", bg: "bg-blue-50", hb: "hover:border-blue-500", hbg: "hover:bg-blue-50/30" },
          { label: "Upcoming", val: upcomingCount, icon: FiActivity, color: "text-amber-500", bg: "bg-amber-50", hb: "hover:border-amber-500", hbg: "hover:bg-amber-50/30" },
          { label: "Completed", val: completedCount, icon: FiCheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", hb: "hover:border-emerald-500", hbg: "hover:bg-emerald-50/30" },
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

      {/* 3. SYNCED SCHEDULE LEDGER */}
      <div className="space-y-6 mt-6">
          <div className="space-y-3 animate-slide-up">
            <div className="flex items-center gap-4 px-2">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <h3 className="bg-blue-500 rounded-full px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">Active Schedule</h3>
               </div>
               <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="card-clean border-slate-200 bg-white overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                           <th className="px-4 py-3">Assessment Cycle</th>
                           <th className="px-4 py-3">Knowledge Domain</th>
                           <th className="px-4 py-3">Execution Window</th>
                           <th className="px-4 py-3 text-right">Operational Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {tests.map((t: any, i: number) => {
                           const isUpcoming = new Date(t.date) >= new Date();
                           return (
                              <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                                 <td className="px-4 py-4">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all shadow-sm">
                                          <FiBookOpen size={18} />
                                       </div>
                                       <div>
                                          <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none">{t.title}</h4>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Verified Cycle</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-4 py-4">
                                    <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                       isUpcoming ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                    }`}>
                                       {t.subjectId?.name || "Academic Core"}
                                    </span>
                                 </td>
                                 <td className="px-4 py-4">
                                    <div className="flex flex-col gap-1.5">
                                       <div className="flex items-center gap-2 text-slate-700">
                                          <FiCalendar size={14} className="text-indigo-500" />
                                          <span className="text-xs font-black tracking-tight">{new Date(t.date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-slate-400">
                                          <FiClock size={12} />
                                          <span className="text-[10px] font-bold uppercase tracking-tighter">Institutional Slot</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                          isUpcoming ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                       }`}>
                                          {isUpcoming ? "Upcoming" : "Completed"}
                                       </span>
                                       <FiChevronRight className="text-slate-200 group-hover:text-indigo-600 transition-all transform group-hover:translate-x-1" />
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
      </div>

      {tests.length === 0 && (
        <div className="py-32 text-center card-clean border-dashed border-slate-200 bg-white">
           <FiLayers size={48} className="text-slate-100 mx-auto mb-4" />
           <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No Scheduled Evaluations Detected</p>
        </div>
      )}
    </div>
  );
};

export default StudentTestsPanel;
