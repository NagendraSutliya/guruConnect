import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiClock,
  FiCalendar,
  FiZap,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
  FiBox,
  FiUser,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../../context/AuthContext";

const StudentDashboardPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // --- Calendar State ---
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Dummy events mapping
  const academicEvents: any = {
    "2026-04-13": { title: "Today's Node", type: "today" },
    "2026-04-20": { title: "Mathematics Unit Test", type: "exam" },
    "2026-04-25": { title: "Summer Break Starts", type: "holiday" },
  };

  useEffect(() => {
    setMounted(true);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/dashboard-summary");
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to load dashboard summary", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-100 rounded-full" />
            <div className="absolute top-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Synchronizing Interface...</p>
        </div>
      </div>
    );

  const performanceData =
    stats?.performanceTrajectory?.length > 0
      ? stats.performanceTrajectory
      : [{ name: "No Data", score: 0 }];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const student = stats?.studentInfo;
  const currentDateLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  // --- Calendar Logic ---
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const changeMonth = (offset: number) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const getEventForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return academicEvents[dateStr];
  };

  const selectedEvent = getEventForDay(selectedDay);

  return (
    <div className="space-y-2 pb-12 animate-fade-in bg-slate-50/50 -m-6 p-6 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-800 px-6 py-4 text-white shadow-2xl shadow-slate-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Live Academic Node</span>
             </div>
             <h1 className="text-lg md:text-2xl font-black tracking-tight leading-none">
              {getTimeGreeting()}, <span className="text-indigo-400">{(student?.name || user?.name || "Student").split(' ')[0]}</span>
            </h1>
            <p className="text-slate-400 text-xs font-medium max-w-lg">
              Synchronized with <span className="text-white font-bold">{student?.classId?.name || 'Class 11'}</span> network.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
             <div className="text-right">
                <p className="text-sm font-black uppercase tracking-widest text-slate-300">{currentDateLabel}</p>
                <p className="text-lg font-black text-white leading-none mt-1">Status: <span className={student?.isActive ? 'text-emerald-400' : 'text-rose-400'}>{student?.isActive ? 'Active' : 'Offline'}</span></p>
             </div>
             <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">{student?.rollNo ? `Roll #${student.rollNo}` : 'ID Valid'}</span>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* 2. VITALS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2 card-clean px-6 py-4 border-slate-200 bg-white relative overflow-hidden group">
           <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="space-y-1">
                 <h3 className="text-xs text-slate-500 uppercase tracking-widest">Academic Velocity</h3>
                 <p className="text-xl font-black text-slate-800 tracking-tight leading-none">Institutional Health</p>
              </div>
              <FiAward size={20} className="text-indigo-600" />
           </div>

           <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                 <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-slate-900 leading-none">{stats?.attendancePercent || 0}%</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase mb-1">Attendance</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full" style={{ width: `${stats?.attendancePercent || 0}%` }} />
                 </div>
              </div>
              
              <div className="space-y-2">
                 <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-slate-900 leading-none">{stats?.latestResult?.percentage || 0}%</span>
                    <span className="text-[9px] font-black text-indigo-500 uppercase mb-1">Performance</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${stats?.latestResult?.percentage || 0}%` }} />
                 </div>
              </div>
           </div>
        </div>

        {/* MEDIUM: SMART HUB */}
        <div className="card-clean px-6 py-4 border-slate-200 bg-white group hover:bg-slate-900 transition-all cursor-pointer">
           <div className="flex items-center gap-4 h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-400 group-hover:text-slate-900 transition-all">
                 <FiCreditCard size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Fee Portal</p>
                 <h3 className="text-lg font-black text-slate-800 group-hover:text-white transition-colors leading-none">
                    {stats?.pendingFees > 0 ? `₹${stats.pendingFees}` : 'No Dues'}
                 </h3>
                 <p className="text-[9px] font-medium text-slate-400 mt-1 group-hover:text-slate-500 transition-colors">
                    {stats?.pendingFees > 0 ? 'Payment required soon' : 'Everything is up to date'}
                 </p>
              </div>
           </div>
        </div>

        {/* SMALL: NEXT EVENT */}
        <div className="card-clean px-6 py-4 border-indigo-600 bg-indigo-600 text-white relative overflow-hidden">
           <div className="relative z-10 flex items-center gap-4 h-full">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                 <FiCalendar size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Milestone</p>
                 <h3 className="text-lg font-black leading-none">
                    {stats?.daysToNextTest ? `${stats.daysToNextTest} Days` : 'Relaxed'}
                 </h3>
                 <p className="text-[9px] font-medium text-indigo-100/70 mt-1">
                    {stats?.daysToNextTest ? 'Preparation required' : 'No major exams upcoming'}
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT AREA: CALENDAR & GROWTH */}
        <div className="lg:col-span-2 space-y-4">
           
           {/* COMPACT INTERACTIVE CALENDAR */}
           <div className="card-clean border-slate-200 bg-white overflow-hidden flex flex-col md:flex-row">
              {/* Calendar Grid Side */}
              <div className="p-6 flex-1">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <FiCalendar className="text-indigo-600" /> Academic Calender
                    </h3>
                    <div className="flex items-center gap-1.5">
                       <button 
                         onClick={() => {
                           setViewDate(new Date());
                           setSelectedDay(new Date().getDate());
                         }}
                         className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all mr-1"
                       >
                         Today
                       </button>
                       <button onClick={() => changeMonth(-1)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-all"><FiChevronLeft size={16} /></button>
                       <span className="text-[10px] font-black uppercase text-slate-600 w-24 text-center truncate">
                          {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                       </span>
                       <button onClick={() => changeMonth(1)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-all"><FiChevronRight size={16} /></button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-7 gap-1">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                      <div key={`header-day-${d}-${i}`} className="text-center text-[8px] font-black text-slate-500 py-1">{d}</div>
                    ))}
                    {Array.from({length: firstDayOfMonth}).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({length: daysInMonth}).map((_, i) => {
                      const day = i + 1;
                      const hasEvent = getEventForDay(day);
                      const isSelected = selectedDay === day;
                      return (
                        <button 
                          key={`day-${day}`} 
                          onClick={() => setSelectedDay(day)}
                          className={`h-8 rounded-lg flex flex-col items-center justify-center text-[10px] font-black transition-all relative
                            ${isSelected ? 'bg-yellow-500 text-white shadow-lg' : 'hover:bg-slate-200 text-slate-600'}
                          `}
                        >
                          {day}
                          {hasEvent && !isSelected && (
                            <div className={`absolute bottom-1 w-1 h-1 rounded-full ${hasEvent.type === 'exam' ? 'bg-amber-400' : hasEvent.type === 'today' ? 'bg-indigo-400' : 'bg-rose-400'}`} />
                          )}
                        </button>
                      );
                    })}
                 </div>
              </div>

              {/* Compact Event Detail Side (Minimalist) */}
              <div className="bg-slate-50 p-6 w-full md:w-64 border-l border-slate-100">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">Event Insight</p>
                 {selectedEvent ? (
                    <div className="space-y-4 animate-fade-in">
                       <div>
                          <p className="text-[9px] font-black text-indigo-500 uppercase">{selectedDay} {viewDate.toLocaleString('default', { month: 'short' })}</p>
                          <h4 className="text-sm font-black text-slate-800 leading-tight mt-1">{selectedEvent.title}</h4>
                       </div>
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200">
                          <div className={`w-1.5 h-1.5 rounded-full ${selectedEvent.type === 'exam' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                          <span className="text-[9px] font-black uppercase text-slate-600">{selectedEvent.type}</span>
                       </div>
                       <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">Notify Me</button>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                       <FiZap size={24} className="text-slate-500 mb-2" />
                       <p className="text-[9px] font-black text-slate-600 uppercase">Standard Academic Node</p>
                    </div>
                 )}
              </div>
           </div>

           {/* GROWTH CHART */}
           <div className="card-clean p-6 border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Growth Curve</h3>
                 <div className="flex gap-2">
                    {['1M', '3M', '1Y'].map(t => (
                      <button key={t} className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t === '3M' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>{t}</button>
                    ))}
                 </div>
              </div>
              <div className="h-[180px] w-full min-h-[180px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height={220} minWidth={0} minHeight={0}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: "#94a3b8" }} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: "#94a3b8" }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#scoreGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
           </div>
        </div>

        {/* RIGHT AREA: TODAY'S SCHEDULE (ENHANCED VISIBILITY) */}
        <div className="card-clean border-slate-200 bg-white flex flex-col h-[550px] shadow-sm">
           <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Today's Schedule</h3>
                 <p className="text-[10px] font-bold text-indigo-500 uppercase mt-0.5">{stats?.todayRoutine?.length || 0} Total Sessions</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                 <FiClock size={18} />
              </div>
           </div>

           <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-10 top-8 bottom-8 w-[2px] bg-slate-100" />
              
              {stats?.todayRoutine?.length > 0 ? (
                stats.todayRoutine.map((item: any, i: number) => (
                  <div key={`routine-${i}`} className="relative pl-10 group">
                     {/* Timeline Dot */}
                     <div className={`absolute left-[7px] top-2 w-4 h-4 rounded-full border-4 border-white shadow-md transition-all duration-300
                        ${i === 0 ? 'bg-indigo-600 scale-110' : 'bg-slate-300 group-hover:bg-indigo-400'}
                     `} />
                     
                     <div className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5
                        ${i === 0 ? 'bg-indigo-50/50 border-indigo-100 shadow-sm' : 'bg-white border-slate-100 hover:border-indigo-200'}
                     `}>
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.startTime} — {item.endTime}</span>
                           <span className="px-2 py-0.5 bg-slate-900 text-[8px] font-black text-white rounded-md uppercase tracking-tighter">Room {item.room || '101'}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{item.subjectId?.name}</h4>
                        <div className="flex items-center gap-2 mt-3">
                           <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                              <FiUser size={12} className="text-slate-400" />
                           </div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.teacherId?.name}</p>
                        </div>
                     </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                   <FiBox size={32} className="text-slate-300 mb-2" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Sessions Active</p>
                </div>
              )}
           </div>
           
           <div className="p-4 bg-slate-50/50 border-t border-slate-100">
              <button 
                onClick={() => window.location.href = "/student/routine"}
                className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                View Full Routine
              </button>
           </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboardPanel;
