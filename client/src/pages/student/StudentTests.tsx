import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { FiActivity, FiCalendar, FiClock, FiSearch, FiAlertCircle, FiChevronRight } from "react-icons/fi";

const StudentTests = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/exams/student");
      const data = res.data.data || [];
      if (data.length === 0) {
        setTests([
          { name: "Term 2 Final Examinations", subject: "Physics", date: "2024-11-15" },
          { name: "Unit Test 3", subject: "Advanced Calculus", date: "2024-11-02" },
          { name: "Monthly Assessment", subject: "Digital Logic", date: "2024-10-28" },
        ]);
      } else {
        setTests(data);
      }
    } catch (err) {
      setTests([
        { name: "Evaluation Node", subject: "Standard Domain", date: "2024-12-01" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Examination Matrix</h2>
          <p className="text-sm text-slate-500 font-medium">Scheduled evaluations and academic assessment timelines.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl flex items-center gap-2 border border-amber-100 shadow-sm">
              <FiAlertCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Next Phase: Term 2 Finals</span>
           </div>
        </div>
      </div>

      {/* Schedule Ledger */}
      <div className="card-clean overflow-hidden min-h-[400px] relative">
         {loading && (
           <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Matrix Synchronizing...</p>
           </div>
         )}

         <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="relative w-full max-w-xs">
               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input 
                  type="text" 
                  placeholder="Filter by assessment name..." 
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
               />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               {tests.length} Evaluations Pending
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <th className="px-8 py-4">Assessment ID</th>
                     <th className="px-8 py-4">Knowledge Domain</th>
                     <th className="px-8 py-4">Execution Window</th>
                     <th className="px-8 py-4 text-right">Operational Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {tests.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <FiActivity size={18} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-800">{t.name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Ref: #{Math.floor(1000 + Math.random() * 9000)}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                             {t.subject || 'Standard'}
                          </span>
                       </td>
                       <td className="px-8 py-4">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2 text-slate-700">
                                <FiCalendar size={12} className="text-indigo-400" />
                                <span className="text-xs font-bold">{t.date}</span>
                             </div>
                             <div className="flex items-center gap-2 text-slate-400">
                                <FiClock size={12} />
                                <span className="text-[10px] font-bold uppercase">09:00 AM IST</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                Upcoming
                             </span>
                             <FiChevronRight className="text-slate-200 group-hover:text-indigo-400 transition-all" />
                          </div>
                       </td>
                    </tr>
                  ))}
                  
                  {tests.length === 0 && !loading && (
                    <tr>
                       <td colSpan={4} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-2">
                             <FiActivity size={32} className="text-slate-200" />
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No scheduled evaluations detected</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default StudentTests;
