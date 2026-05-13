import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import api from "../../api/axiosInstance";
import { 
  FiCalendar, 
  FiClock, 
  FiBookOpen, 
  FiUsers, 
  FiActivity,
  FiTrendingUp,
  FiAward,
  FiChevronRight,
  FiPlus,
  FiAlertCircle
} from "react-icons/fi";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from "react-router-dom";
import InstitutionCalendarModal from "../../components/teacher/modals/InstitutionCalendarModal";

const TeacherDashboard = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [routine, setRoutine] = useState<any[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [timeRange, setTimeRange] = useState<"WEEK" | "MONTH">("WEEK");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Fetch stats
      api.get("/teacher/stats").then(res => setStats(res.data.data)).catch(console.error);
      
      // Fetch routine
      api.get("/teacher/routine").then(res => setRoutine(res.data.data)).catch(console.error);

      // Fetch charts
      api.get("/teacher/dashboard/charts").then(res => setCharts(res.data.data)).catch(console.error);
    }
  }, [user]);

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  
  const todaySchedule = useMemo(() => {
    return routine
      .filter(r => r.day === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [routine, today]);

  const engagementData = charts?.engagementData || [];
  const distributionData = charts?.distribution || [];

  const presentPercentage = useMemo(() => {
    if (distributionData.length === 0) return 0;
    const present = distributionData.find((d: any) => d.name === "Present");
    return present ? present.value : 0;
  }, [distributionData]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-2 pb-8 animate-fade-in">
      
      {/* Header Info - Sticky Aura Gradient */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Welcome back, {user?.name}. Instance is operational.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCalendar(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <FiCalendar className="text-indigo-600" />
            <span>Institution Calendar</span>
          </button>
          <button onClick={() => navigate("/teacher/results/upload-marks")} className="btn-primary flex items-center gap-2">
            <FiPlus />
            <span>Publish Result</span>
          </button>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && <InstitutionCalendarModal onClose={() => setShowCalendar(false)} />}

      {/* High-Density Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", val: stats?.totalStudents ?? "0", icon: FiUsers, color: "#6366f1", delta: "Enrolled" },
          { label: "Active Nodes", val: stats?.activeClasses ?? "0", icon: FiActivity, color: "#a855f7", delta: "Assigned" },
          { label: "Modules Sync", val: stats?.courseModules ?? "0", icon: FiBookOpen, color: "#f59e0b", delta: "Uploaded" },
          { label: "Performance", val: stats?.avgPerformance ?? "0%", icon: FiAward, color: "#10b981", delta: "Average" },
        ].map((item: any, i: number) => (
          <div key={i} className="card-clean p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                <item.icon size={20} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                   <h3 className="text-lg font-bold text-slate-800">{item.val}</h3>
                   <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">{item.delta}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Main Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Schedule */}
        <div className="lg:col-span-2 card-clean overflow-hidden">
           <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-2">
                 <FiClock className="text-indigo-500" />
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Today's Schedule</h3>
              </div>
              <button 
                onClick={() => navigate("/teacher/routine")}
                className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline"
              >
                Full Weekly Routine
              </button>
           </div>
           <div className="divide-y divide-slate-50">
              {todaySchedule.length > 0 ? todaySchedule.map((item: any, i: number) => (
                <div 
                  key={i} 
                  onClick={() => navigate("/teacher/attendance", { state: { classId: item.classId?._id, sectionId: item.sectionId?._id } })}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors group cursor-pointer"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-[9px] font-black text-slate-400 border border-slate-200">
                         <span className="text-indigo-600">{item.startTime}</span>
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.subjectId?.name}</p>
                         <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Class {item.classId?.name}</p>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sec {item.sectionId?.name}</p>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 uppercase tracking-widest">
                        Room {item.room || "Lab 1"}
                      </span>
                      <FiChevronRight className="text-slate-200 group-hover:text-indigo-400 transition-all" />
                   </div>
                </div>
              )) : (
                <div className="py-20 text-center flex flex-col items-center gap-2">
                   <FiAlertCircle size={32} className="text-slate-100" />
                   <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No classes scheduled for today</p>
                </div>
              )}
           </div>
        </div>

        {/* Engagement Distribution */}
        <div className="card-clean p-6 flex flex-col">
           <h3 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-tight">Today's Attendance</h3>
           <p className="text-[10px] text-slate-400 font-medium mb-6">Aggregate snapshot of all sessions.</p>
           
           <div className="flex-1 flex flex-col items-center justify-center">
              {distributionData.length > 0 ? (
                <>
                  <div className="h-40 w-full relative">
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie
                              data={distributionData}
                              innerRadius={55}
                              outerRadius={75}
                              paddingAngle={5}
                              dataKey="value"
                          >
                              {distributionData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-bold text-slate-800">{presentPercentage}%</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Present</span>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-2 mt-4">
                    {distributionData.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.name}</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-800">{item.value}%</span>
                        </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <FiActivity size={32} className="text-slate-200 mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">No attendance data<br/>available for today</p>
                </div>
              )}
           </div>
        </div>

        {/* Analytical Feed */}
        <div className="lg:col-span-2 card-clean p-6">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                 <FiTrendingUp className="text-indigo-500" />
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Engagement Feed</h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                 <button 
                   onClick={() => setTimeRange("WEEK")}
                   className={`text-[8px] font-bold px-2 py-0.5 rounded transition-all ${timeRange === 'WEEK' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   WEEK
                 </button>
                 <button 
                   onClick={() => setTimeRange("MONTH")}
                   className={`text-[8px] font-bold px-2 py-0.5 rounded transition-all ${timeRange === 'MONTH' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   MONTH
                 </button>
              </div>
           </div>
           <div className="h-[240px] overflow-hidden">
              {engagementData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={engagementData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#cbd5e1' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#cbd5e1' }} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <FiTrendingUp size={40} className="text-slate-200 mb-3" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Insufficient engagement data for this period</p>
                </div>
              )}
           </div>
        </div>

        {/* Priority Actions */}
        <div className="card-clean p-5">
           <div className="flex items-center gap-2 mb-6">
              <FiActivity className="text-rose-500" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Priority Feed</h3>
           </div>
           <div className="space-y-3">
              {stats?.priorityFeed && stats.priorityFeed.length > 0 ? (
                stats.priorityFeed.map((task: any, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(task.path)}
                    className="p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          task.type === 'high' ? 'bg-rose-50 text-rose-600' :
                          task.type === 'med' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                        }`}>{task.type}</span>
                        <span className="text-[9px] font-bold text-slate-400">{task.time}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 flex flex-col items-center justify-center opacity-40">
                  <FiActivity size={32} className="text-slate-200 mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No priority tasks</p>
                </div>
              )}
           </div>
           <button 
             onClick={() => alert("Dispatch Task: This feature will allow you to assign tasks to other staff or classes. Under development.")}
             className="w-full mt-6 py-2.5 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-indigo-500/30 hover:text-indigo-600 transition-all"
           >
              + Dispatch Task
           </button>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
