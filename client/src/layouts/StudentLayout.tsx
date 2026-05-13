import { Outlet, NavLink, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiCalendar, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiFileText,
  FiActivity,
  FiClock
} from "react-icons/fi";
import { useState } from "react";
import StudentNavbar from "../components/student/layout/StudentNavbar";
import { useAuth } from "../context/AuthContext";

const StudentLayout = () => {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: FiHome, label: "Overview", path: "/student/dashboard" },
    { icon: FiCalendar, label: "Attendance", path: "/student/attendance" },
    { icon: FiBarChart2, label: "Report Cards", path: "/student/results" },
    { icon: FiActivity, label: "Examinations", path: "/student/tests" },
    { icon: FiFileText, label: "Study Material", path: "/student/material" },
    { icon: FiClock, label: "Class Routine", path: "/student/routine" },
    { icon: FiSettings, label: "Settings", path: "/student/settings" },
  ];

  return (
    <div className="flex h-screen bg-[var(--bg-app)] overflow-hidden">
      
      {/* Professional Student Sidebar */}
      <aside 
        className={`${collapsed ? "w-20" : "w-64"} bg-[#0f172a] transition-all duration-300 flex flex-col z-[60]`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">S</div>
              <span className="text-white font-bold tracking-tight text-lg">Nexus<span className="text-indigo-400">Hub</span></span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            {collapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Feed */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <p className={`${collapsed ? "text-center" : "px-3"} text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6`}>
            {collapsed ? "•••" : "Student Command"}
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-slate-500 group-hover:text-white transition-colors"} />
                {!collapsed && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Tactical Footer */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
          >
            <FiLogOut size={20} className="group-hover:text-rose-500" />
            {!collapsed && <span className="text-sm font-bold tracking-tight">Eject Session</span>}
          </button>
        </div>
      </aside>

      {/* Primary Operations Hub */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        <StudentNavbar />
        <div className="flex-1 overflow-y-auto px-4 md:px-8 scroll-smooth custom-scrollbar">
           <div className="max-w-7xl mx-auto animate-fade-in">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
