import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import StudentNavbar from "../components/student/layout/StudentNavbar";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiChevronLeft, FiLogOut } from "react-icons/fi";

const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Today", path: "/student/dashboard" },
    { label: "Timetable & Exams", path: "/student/timetable" },
    { label: "Homework", path: "/student/homework", badge: "2" },
    { label: "Results", path: "/student/results" },
    { label: "Attendance", path: "/student/attendance" },
    { label: "Notices", path: "/student/notices", badge: "1" },
    { label: "Library", path: "/student/library", badge: "1" },
    { label: "Study material", path: "/student/material" },
    { label: "Notifications", path: "/student/notifications", badge: "2" },
    { label: "My profile", path: "/student/profile" },
  ];

  const instName = user?.instituteName || "Shiksha Public School";
  const instInitials = instName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen bg-page text-ink overflow-hidden font-sans">
      {/* Student Web Sidebar matching Patshala design */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-[232px]"
        } bg-nav-bg text-nav-text transition-all duration-200 flex flex-col shrink-0 z-50 border-r border-nav-divider select-none`}
      >
        {/* Institute Header */}
        <div className="p-4 border-b border-nav-divider flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-panel bg-gold text-nav-bg font-semibold text-[15px] flex items-center justify-center">
              {instInitials || "SP"}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <div className="font-semibold text-body text-white truncate leading-tight">
                  {instName}
                </div>
                <div className="text-caption text-nav-muted">Student panel</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1 rounded-control text-nav-muted hover:text-white hover:bg-nav-active transition-colors cursor-pointer"
          >
            {collapsed ? <FiMenu size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Main" className="flex-1 p-3.5 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isMatch =
              (item.path === "/student/dashboard" && (location.pathname === "/student" || location.pathname === "/student/dashboard")) ||
              (item.path !== "/student/dashboard" && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between gap-2.5 min-h-[40px] px-3 rounded-control text-body transition-colors ${
                  isMatch
                    ? "bg-nav-active text-white font-semibold"
                    : "text-nav-text font-normal hover:bg-nav-active/50 hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isMatch ? "bg-gold" : "bg-nav-dot group-hover:bg-nav-muted"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </span>

                {!collapsed && item.badge && (
                  <span className="font-mono text-micro text-gold font-medium">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Tactical Footer */}
        <div className="p-3 border-t border-nav-divider">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-control text-nav-text hover:bg-rose-900/30 hover:text-rose-300 transition-colors cursor-pointer"
            title="Sign out"
          >
            <FiLogOut size={16} />
            {!collapsed && <span className="text-small font-medium">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main Operations Web Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <StudentNavbar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 bg-page custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
