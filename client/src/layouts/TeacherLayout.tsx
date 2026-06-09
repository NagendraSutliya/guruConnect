import { Outlet, NavLink, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiBarChart2, 
  FiBookOpen, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiClock,
  FiFolder
} from "react-icons/fi";
import { useState } from "react";
import TeacherNavbar from "../components/teacher/TeacherNavbar";
import { useAuth } from "../context/AuthContext";

const TeacherLayout = () => {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: FiHome, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: FiUsers, label: "Students", path: "/teacher/students" },
    { icon: FiCalendar, label: "Attendance", path: "/teacher/attendance" },
    { icon: FiBookOpen, label: "Exams", path: "/teacher/exams" },
    { icon: FiBarChart2, label: "Results", path: "/teacher/results" },
    { icon: FiFolder, label: "Study Material", path: "/teacher/material" },
    { icon: FiClock, label: "Schedule", path: "/teacher/routine" },
    { icon: FiSettings, label: "Settings", path: "/teacher/settings" },
  ];

  return (
    <div className="flex h-screen bg-[var(--bg-app)] overflow-hidden">
      
      {/* Professional Sidebar */}
      <aside 
        className={`${collapsed ? "w-20" : "w-64"} bg-[var(--bg-sidebar)] transition-all duration-300 flex flex-col z-50`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold">G</div>
              <span className="text-white font-bold tracking-tight text-lg">GuruConnect</span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            {collapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className={`${collapsed ? "text-center" : "px-3"} text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4`}>
            {collapsed ? "•••" : "Main Menu"}
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive 
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-white/40 group-hover:text-white transition-colors"} />
                {!collapsed && <span className="text-sm font-medium tracking-wide">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
          >
            <FiLogOut size={20} className="group-hover:text-rose-500" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Hub */}
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg-app)]">
        <TeacherNavbar />
        <div className="flex-1 overflow-y-auto px-4 md:px-8 scroll-smooth">
           <div className="max-w-7xl mx-auto animate-fade-in">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
