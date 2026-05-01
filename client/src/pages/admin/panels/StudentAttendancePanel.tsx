import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiCheckCircle, FiXCircle, FiTrendingUp, FiActivity, FiUsers, FiClock, FiSearch } from "react-icons/fi";

const MetricCard = ({ title, value, icon, gradient }: any) => (
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-2xl shadow-lg transition-transform duration-500 group-hover:rotate-6`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
    </div>
  </div>
);

const StudentAttendancePanel = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [today, setToday] = useState<any>(null);
  const [classSummary, setClassSummary] = useState<any[]>([]);
  const [studentSummary, setStudentSummary] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [todayRes, classRes, studentRes, historyRes] = await Promise.all([
        api.get(`/admin/attendance/summary/today?date=${selectedDate}`),
        api.get(`/admin/attendance/summary/class?date=${selectedDate}`),
        api.get("/admin/attendance/summary/student"),
        api.get("/admin/attendance/history")
      ]);

      setToday(todayRes.data.data);
      setClassSummary(classRes.data.data);
      setStudentSummary(studentRes.data.data);
      setHistory(historyRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedDate]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Attendance Intelligence</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Real-time presence monitoring and historical attendance analytics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
          <button
            onClick={load}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-md shadow-indigo-500/30 transition-all active:scale-95 text-sm"
          >
            <FiActivity />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {/* Dynamic Summary Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Total Present" value={today?.present || 0} icon={<FiCheckCircle />} gradient="from-emerald-500 to-emerald-600" />
        <MetricCard title="Total Absent" value={today?.absent || 0} icon={<FiXCircle />} gradient="from-rose-500 to-rose-600" />
        <MetricCard title="Attendance Rate" value={`${today?.rate || 0}%`} icon={<FiTrendingUp />} gradient="from-blue-500 to-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Class Summary Table */}
        <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden flex flex-col">
           <div className="p-8 border-b border-slate-100 flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full" />
              <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <FiUsers className="text-indigo-400" /> Classwise Report
              </h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-8 py-5">Grade Level</th>
                    <th className="px-8 py-5 text-center">Present</th>
                    <th className="px-8 py-5 text-center">Absent</th>
                    <th className="px-8 py-5 text-right">Success Rate</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {classSummary.map((c, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 font-black text-slate-800 text-sm">Class {c.class}</td>
                      <td className="px-8 py-5 text-center text-emerald-600 font-bold">{c.present}</td>
                      <td className="px-8 py-5 text-center text-rose-600 font-bold">{c.absent}</td>
                      <td className="px-8 py-5 text-right">
                         <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-black tracking-widest border border-indigo-100/50">
                           {c.rate}%
                         </span>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Student Leaderboard (Attendance) */}
        <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden flex flex-col">
           <div className="p-8 border-b border-slate-100 flex items-center gap-3">
              <div className="w-2 h-8 bg-emerald-600 rounded-full" />
              <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <FiActivity className="text-emerald-400" /> Persistence Ranking
              </h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-8 py-5">Student Identity</th>
                    <th className="px-8 py-5 text-right">Overall Average</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {studentSummary.map((s, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black uppercase text-[10px]">
                               {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800">{s.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Roll No: {s.rollNo}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                         <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-emerald-600">{s.percentage}%</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.present}/{s.total} Days</span>
                         </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {/* History Ledger */}
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="w-2 h-8 bg-rose-600 rounded-full" />
               <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                 <FiClock className="text-rose-400" /> Recent Attendance Events
               </h3>
            </div>
            <div className="relative w-full sm:w-80">
               <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input
                 type="text"
                 placeholder="Search student or roll no..."
                 value={historySearch}
                 onChange={(e) => setHistorySearch(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
               />
            </div>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-8 py-5">Student</th>
                  <th className="px-8 py-5">Recorded On</th>
                  <th className="px-8 py-5 text-right">Final Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
                 {history
                   .filter(r => 
                     r.studentId?.name?.toLowerCase().includes(historySearch.toLowerCase()) || 
                     String(r.studentId?.rollNo).includes(historySearch)
                   )
                   .map((r) => (
                  <tr key={r._id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                       <div className="flex flex-col">
                          <p className="text-sm font-black text-slate-800">{r.studentId?.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Roll No: {r.studentId?.rollNo}</p>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col">
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">{new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{r.classId?.name}</p>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                         r.status === "present" 
                           ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm" 
                           : "bg-rose-50 text-rose-600 border-rose-100 shadow-sm"
                       }`}>
                         {r.status}
                       </span>
                    </td>
                  </tr>
                ))}
             </tbody>
           </table>
         </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StudentAttendancePanel;
