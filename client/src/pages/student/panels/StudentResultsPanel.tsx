import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiAward,
  FiDownload,
  FiStar,
  FiTrendingUp,
  FiActivity,
  FiBook,
} from "react-icons/fi";

const StudentResultsPanel = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/results");
      setResults(res.data.data || []);
    } catch (err) {
      console.error("Failed to load results", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = (examTitle: string, subjects: any[]) => {
    const headers = ["Exam", "Subject", "Marks", "Max Marks", "Percentage", "Grade"];
    const csvData = subjects.map(r => [
      examTitle,
      r.examSubjectId?.subjectId?.name || "Academic Core",
      r.marks,
      r.maxMarks || 100,
      `${r.percentage}%`,
      r.grade || (r.percentage >= 80 ? "A+" : r.percentage >= 60 ? "B" : "C")
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${examTitle.replace(/\s+/g, '_')}_Results.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const avgPercent =
    results.length > 0
      ? Math.round(
          results.reduce((acc, r) => acc + (r.percentage || 0), 0) /
            results.length
        )
      : 0;

  const distinctions = results.filter((r) => (r.percentage || 0) >= 80).length;

  // Grouping by Exam Title
  const groupedResults = results.reduce((acc: any, r: any) => {
    const examTitle = r.examId?.title || "Standard Evaluation";
    if (!acc[examTitle]) acc[examTitle] = [];
    acc[examTitle].push(r);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Transcripts...</p>
      </div>
    );

  return (
    <div className="space-y-2 animate-fade-in pb-12">
      
      {/* 1. SYNCED STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-xl rounded-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 shadow-sm">
        <div>
           <h1 className="text-xl font-black text-blue-700 tracking-tight leading-none">Academic Registry</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">Verified Performance Nodes</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-white shadow-xl shadow-slate-200 flex items-center gap-4">
              <div className="text-right border-r border-white/10 pr-4">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Aggregate Score</p>
                 <h4 className="text-sm font-black text-emerald-400 leading-none mt-1">{avgPercent}%</h4>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">System Status</p>
                 <h4 className="text-sm font-black text-white leading-none mt-1">ACTIVE</h4>
              </div>
           </div>
        </div>
      </div>

      {/* 2. SYNCED ANALYTICS VITALS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Exams", val: Object.keys(groupedResults).length, icon: FiActivity, color: "text-blue-500", bg: "bg-blue-50", hb: "hover:border-blue-500", hbg: "hover:bg-blue-50/30" },
          { label: "Distinctions", val: distinctions, icon: FiStar, color: "text-amber-500", bg: "bg-amber-50", hb: "hover:border-amber-500", hbg: "hover:bg-amber-50/30" },
          { label: "Health Index", val: avgPercent >= 75 ? "EXCELLENT" : "STABLE", icon: FiTrendingUp, color: "text-emerald-500", bg: "bg-emerald-50", hb: "hover:border-emerald-500", hbg: "hover:bg-emerald-50/30" },
          { label: "Performance", val: avgPercent >= 60 ? "CREDIT" : "PASS", icon: FiAward, color: "text-indigo-500", bg: "bg-indigo-50", hb: "hover:border-indigo-500", hbg: "hover:bg-indigo-50/30" },
        ].map((item, i) => (
          <div key={i} className={`card-clean p-4 bg-white border-slate-200 group ${item.hb} ${item.hbg} hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
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

      {/* 3. SYNCED TRANSCRIPT LEDGER */}
      <div className="space-y-6 mt-6">
        {Object.entries(groupedResults).map(([examTitle, subjects]: [string, any], idx) => (
          <div key={idx} className="space-y-3 animate-slide-up">
            {/* Syncing Date Header style to Exam Header */}
            <div className="flex items-center gap-4 px-2">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <h3 className="bg-blue-500 rounded-full px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">{examTitle}</h3>
               </div>
               <div className="flex-1 h-px bg-slate-100" />
               <button 
                  onClick={() => handleExportCSV(examTitle, subjects)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-yellow-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-sm"
               >
                  <FiDownload size={12} /> Export
               </button>
            </div>

            <div className="card-clean border-slate-200 bg-white overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-green-100">
                           <th className="px-4 py-3">Subject Vector</th>
                           <th className="px-4 py-3">Score Analytics</th>
                           <th className="px-4 py-3 text-right">Result Grade</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {subjects.map((r: any, sIdx: number) => (
                           <tr key={sIdx} className="hover:bg-slate-50/50 transition-all group">
                              <td className="px-2 py-2">
                                 <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                       <FiBook size={18} />
                                    </div>
                                    <div>
                                       <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none">
                                          {r.examSubjectId?.subjectId?.name || "Academic Core"}
                                       </h4>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-2 py-2">
                                 <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase">
                                       <span>{r.marks} / {r.maxMarks || 100}</span>
                                       <span className="text-indigo-600">{r.percentage}%</span>
                                    </div>
                                    <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                                       <div 
                                          className={`h-full rounded-full transition-all duration-1000 ${
                                             r.percentage >= 80 ? 'bg-emerald-500' : r.percentage >= 60 ? 'bg-indigo-500' : 'bg-rose-500'
                                          }`} 
                                          style={{ width: `${r.percentage}%` }} 
                                       />
                                    </div>
                                 </div>
                              </td>
                              <td className="px-4 py-2 text-right">
                                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    (r.percentage || 0) >= 80 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                    (r.percentage || 0) >= 60 ? "bg-indigo-50 text-indigo-600 border-indigo-100" : 
                                    "bg-rose-50 text-rose-600 border-rose-100"
                                 }`}>
                                    {r.grade || (r.percentage >= 80 ? "A+" : r.percentage >= 60 ? "B" : "C")}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="py-32 text-center card-clean border-dashed border-slate-200 bg-white">
           <FiAward size={48} className="text-slate-100 mx-auto mb-4" />
           <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No Academic Records Synthesized</p>
        </div>
      )}
    </div>
  );
};

export default StudentResultsPanel;
