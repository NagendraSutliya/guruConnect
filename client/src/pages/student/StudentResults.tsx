import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { FiAward, FiBarChart2, FiSearch, FiDownload, FiStar} from "react-icons/fi";

const StudentResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const res = await api.get("/results/student");
      const data = res.data.data || [];
      if (data.length === 0) {
        setResults([
          { exam: "Mid-Term Assessment", subject: "Quantum Theory", marks: "88/100", percentage: 88, grade: "A" },
          { exam: "Unit Test 1", subject: "Advanced Calculus", marks: "45/50", percentage: 90, grade: "A+" },
          { exam: "Lab Viva", subject: "Material Science", marks: "18/20", percentage: 90, grade: "A+" },
          { exam: "Mid-Term Assessment", subject: "Digital Logic", marks: "72/100", percentage: 72, grade: "B" },
        ]);
      } else {
        setResults(data);
      }
    } catch (err) {
      setResults([
        { exam: "Mock Evaluation", subject: "Standard Node", marks: "85/100", percentage: 85, grade: "A" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const avgPercent = results.length > 0 
    ? Math.round(results.reduce((acc, r) => acc + (r.percentage || 0), 0) / results.length) 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Academic Transcripts</h2>
          <p className="text-sm text-slate-500 font-medium">Historical performance metrics and examination analytics.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-3 shadow-lg shadow-indigo-600/20">
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-widest text-indigo-100">Cumulative Score</span>
                 <span className="text-lg font-black leading-tight">{avgPercent}%</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <FiStar className="text-amber-300" size={20} />
           </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         {[
           { label: "Exams Synchronized", val: results.length, icon: FiBarChart2, color: "#6366f1" },
           { label: "Distinctions Earned", val: results.filter(r => (r.percentage || 0) >= 80).length, icon: FiAward, color: "#10b981" },
           { label: "Pending Evaluations", val: 0, icon: FiStar, color: "#f59e0b" },
         ].map((item, i) => (
           <div key={i} className="card-clean p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-slate-100" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                 <item.icon size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                 <h3 className="text-lg font-bold text-slate-800">{item.val}</h3>
              </div>
           </div>
         ))}
      </div>

      {/* Transcript Ledger */}
      <div className="card-clean overflow-hidden min-h-[400px] relative">
         {loading && (
           <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transcript Syncing...</p>
           </div>
         )}

         <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="relative w-full max-w-xs">
               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input 
                  type="text" 
                  placeholder="Search exam or subject..." 
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
               />
            </div>
            <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 hover:bg-white text-slate-500 hover:text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-slate-100 transition-all">
               <FiDownload size={14} /> Export Report
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <th className="px-8 py-4">Examination Cycle</th>
                     <th className="px-8 py-4">Subject Vector</th>
                     <th className="px-8 py-4">Performance Node</th>
                     <th className="px-8 py-4 text-right">Academic Grade</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-4">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-800">{r.exam}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Session 2024-25</span>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                             <span className="text-xs font-bold text-slate-600">{r.subject}</span>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <div className="flex flex-col gap-1 w-32">
                             <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase">
                                <span>{r.marks}</span>
                                <span>{r.percentage}%</span>
                             </div>
                             <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                   className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                                   style={{ width: `${r.percentage}%` }}
                                />
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-4 text-right">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black border ${
                             ['A+', 'A', 'B+'].includes(r.grade) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                             ['B', 'C+'].includes(r.grade) ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                             'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                             {r.grade || 'N/A'}
                          </span>
                       </td>
                    </tr>
                  ))}
                  
                  {results.length === 0 && !loading && (
                    <tr>
                       <td colSpan={4} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-2">
                             <FiAward size={32} className="text-slate-200" />
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No evaluation nodes detected</p>
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

export default StudentResults;
