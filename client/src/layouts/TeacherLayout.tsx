import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import TeacherNavbar from "../components/teacher/TeacherNavbar";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiChevronLeft } from "react-icons/fi";

const TeacherLayout = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Today", path: "/teacher/dashboard" },
    { label: "My timetable", path: "/teacher/routine" },
    { label: "My class · 8-B", path: "/teacher/students", badge: "2" },
    { label: "Attendance", path: "/teacher/attendance" },
    { label: "Homework & syllabus", path: "/teacher/homework" },
    { label: "Marks & remarks", path: "/teacher/results", badge: "1" },
    { label: "Messages", path: "/teacher/messages", badge: "3" },
    { label: "Leave & payslip", path: "/teacher/leave-payslip" },
    { label: "My profile", path: "/teacher/profile" },
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
      {/* Teacher Sidebar matching specification */}
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
                <div className="text-caption text-nav-muted">Teacher panel</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1 rounded-control text-nav-muted hover:text-white hover:bg-nav-active transition-colors"
          >
            {collapsed ? <FiMenu size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Main" className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isMatch =
              location.pathname === item.path ||
              (item.path !== "/teacher/dashboard" && location.pathname.startsWith(item.path));

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

        {/* Footer Section */}
        <div className="p-3.5 border-t border-nav-divider text-caption text-nav-muted flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-1.5 truncate">
              <button
                onClick={() => navigate("/parent/login")}
                className="hover:text-white hover:underline transition-colors"
              >
                Switch to parent view
              </button>
              <span>·</span>
              <button
                onClick={() => navigate("/teacher/help")}
                className="hover:text-white hover:underline transition-colors"
              >
                Help
              </button>
            </div>
          ) : (
            <div className="mx-auto font-mono text-micro text-nav-muted">SP</div>
          )}
        </div>
      </aside>

      {/* Main Content Hub */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-page">
        <TeacherNavbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 scroll-smooth">
          <div className="max-w-content mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
