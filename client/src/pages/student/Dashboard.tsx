import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { 
  FiActivity, 
  FiBookOpen, 
  FiCheckCircle, 
  FiClock, 
  FiTrendingUp, 
  FiArrowUpRight,
  FiFileText,
  FiChevronRight
} from "react-icons/fi";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const StudentDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/dashboard-summary");
      setStats(res.data.data || {
        attendancePercent: 88,
        materials: 12,
        upcomingTests: 3,
        latestResult: { percentage: 92 }
      });
    } catch (err) {
      setStats({
        attendancePercent: 88,
        materials: 12,
        upcomingTests: 3,
        latestResult: { percentage: 92 }
      });
    } finally {
      setLoading(false);
    }
  };

  const performanceData = [
    { name: 'Term 1', score: 78 },
    { name: 'Unit 1', score: 85 },
    { name: 'Unit 2', score: 82 },
    { name: 'Term 2', score: 91 },
    { name: 'Current', score: 88 },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-full py-20">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Academic Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Monitoring your academic trajectory and institutional sync.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
           <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider">
              2024 Session
           </div>
        </div>
      </div>

      {/* Strategic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Attendance Feed", val: `${stats?.attendancePercent || 0}%`, icon: FiCheckCircle, color: "#10b981", sub: "Operational" },
          { label: "Asset Repository", val: stats?.materials || 0, icon: FiBookOpen, color: "#6366f1", sub: "New Items" },
          { label: "Pending Tests", val: stats?.upcomingTests || 0, icon: FiActivity, color: "#f59e0b", sub: "This Week" },
          { label: "Avg Performance", val: `${stats?.latestResult?.percentage || 0}%`, icon: FiTrendingUp, color: "#a855f7", sub: "Latest Exam" },
        ].map((item, i) => (
          <div key={i} className="card-clean p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-slate-100" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                <item.icon size={20} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                   <h3 className="text-lg font-bold text-slate-800 tracking-tight">{item.val}</h3>
                   <span className="text-[9px] font-bold text-slate-400 uppercase">{item.sub}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Primary Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trajectory Analytics */}
        <div className="lg:col-span-2 card-clean p-6">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                 <FiTrendingUp className="text-indigo-600" />
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Performance Trajectory</h3>
              </div>
              <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                 Full Analytics <FiArrowUpRight size={12} />
              </button>
           </div>
           <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={performanceData}>
                    <defs>
                       <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dx={-10} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Real-time Schedule Widget */}
        <div className="card-clean flex flex-col">
           <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-2">
                 <FiClock className="text-indigo-600" />
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Today's Nodes</h3>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Friday, Oct 12</span>
           </div>
           <div className="flex-1 divide-y divide-slate-50">
              {[
                { time: "08:30", subject: "Quantum Theory", type: "Core Lecture", room: "Hall A" },
                { time: "10:30", subject: "Advanced Calc", type: "Problem Solving", room: "Lab 2" },
                { time: "01:30", subject: "Material Science", type: "Practical Session", room: "Tech Wing" },
              ].map((node, i) => (
                <div key={i} className="p-4 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{node.time} AM</span>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-tighter">{node.room}</span>
                   </div>
                   <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{node.subject}</p>
                   <p className="text-[10px] font-medium text-slate-400 mt-0.5">{node.type}</p>
                </div>
              ))}
           </div>
           <button className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 border-t border-slate-50 transition-colors">
              View Full Timetable
           </button>
        </div>

        {/* Resource Feed */}
        <div className="card-clean p-6">
           <div className="flex items-center gap-2 mb-6">
              <FiFileText className="text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Recent Assets</h3>
           </div>
           <div className="space-y-3">
              {[
                { title: "Term 1 Physics Handbook", size: "2.4 MB", ext: "PDF" },
                { title: "Calculus Worksheet #4", size: "1.1 MB", ext: "DOCX" },
                { title: "Organic Chem Diagrams", size: "4.8 MB", ext: "PNG" },
              ].map((asset, i) => (
                <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group cursor-pointer shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <FiFileText size={14} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-700">{asset.title}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase">{asset.size} • {asset.ext}</p>
                      </div>
                   </div>
                   <FiChevronRight className="text-slate-200 group-hover:text-indigo-400 transition-all" />
                </div>
              ))}
           </div>
           <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-slate-100 hover:border-indigo-200">
              Go to Resource Library
           </button>
        </div>

        {/* Tactical Alerts */}
        <div className="lg:col-span-2 card-clean p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Institutional Compliance</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">Your current attendance node is at <span className="text-indigo-600 font-bold">88.4%</span>. Maintain levels above 75% for examination clearance.</p>
           </div>
           <div className="relative z-10 shrink-0">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">
                 Verify Registry
              </button>
           </div>
           <div className="absolute right-0 top-0 bottom-0 w-32 bg-indigo-500/5 blur-3xl pointer-events-none" />
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
