import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TeacherNavbar from "../components/teacher/TeacherNavbar";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiChevronLeft } from "react-icons/fi";
import { 
  MdDashboard,
  MdCalendarToday,
  MdGroups,
  MdFactCheck,
  MdMenuBook,
  MdGrade,
  MdChatBubbleOutline,
  MdPayments,
  MdPerson
} from "react-icons/md";
import api from "../api/axiosInstance";

const TeacherLayout = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [institute, setInstitute] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. If user already has institute info cached
    if (user?.instituteName || user?.logoUrl || user?.instituteLogo) {
      setInstitute({
        instituteName: user.instituteName,
        logoUrl: user.logoUrl || user.instituteLogo
      });
    }

    // 2. Fetch fresh institute details if instituteId is available
    const instId = typeof user?.instituteId === "object" ? user?.instituteId?._id : user?.instituteId;
    if (instId) {
      api.get(`/public/institute/${instId}`)
        .then((res) => {
          if (res.data?.data) {
            setInstitute((prev: any) => ({
              ...prev,
              ...res.data.data
            }));
          }
        })
        .catch((err) => {
          console.error("Error fetching institute details in teacher layout:", err);
        });
    }
  }, [user]);

  const navItems = [
    { label: "Today", path: "/teacher/dashboard", icon: <MdDashboard size={18} /> },
    { label: "My timetable", path: "/teacher/routine", icon: <MdCalendarToday size={18} /> },
    { label: "My class · 8-B", path: "/teacher/students", icon: <MdGroups size={18} />, badge: "2" },
    { label: "Attendance", path: "/teacher/attendance", icon: <MdFactCheck size={18} /> },
    { label: "Homework & syllabus", path: "/teacher/homework", icon: <MdMenuBook size={18} /> },
    { label: "Marks & remarks", path: "/teacher/results", icon: <MdGrade size={18} />, badge: "1" },
    { label: "Messages", path: "/teacher/messages", icon: <MdChatBubbleOutline size={18} />, badge: "3" },
    { label: "Leave & payslip", path: "/teacher/leave-payslip", icon: <MdPayments size={18} /> },
    { label: "My profile", path: "/teacher/profile", icon: <MdPerson size={18} /> },
  ];

  const instName = institute?.instituteName || user?.instituteName || "GuruConnect";
  const instInitials = instName.substring(0, 2).toUpperCase();
  const instLogo = institute?.logoUrl || user?.logoUrl || user?.instituteLogo || null;

  return (
    <div className="flex h-screen bg-page text-ink overflow-hidden font-sans">
      {/* Teacher Sidebar matching Admin specification */}
      <aside
        className={`${
          collapsed ? "w-20 items-center" : "w-[236px]"
        } bg-nav-bg text-nav-text transition-all duration-200 flex flex-col shrink-0 z-50 border-r border-nav-divider select-none`}
      >
        {/* Institute Profile Header */}
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2 px-3.5 py-4 border-b border-nav-divider mx-3.5 mt-3 mb-2">
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="w-14 h-14 shrink-0 rounded-panel bg-gold text-nav-bg flex items-center justify-center font-semibold text-[15px] overflow-hidden">
                {instLogo ? (
                  <img src={instLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  instInitials
                )}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="font-semibold text-sm text-white line-clamp-2 leading-snug break-words" title={instName}>
                  {instName}
                </div>
                <div className="text-xs text-nav-muted truncate">Teacher Panel</div>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="p-1 rounded-control text-nav-muted hover:text-white hover:bg-nav-active transition-colors shrink-0"
            >
              <FiChevronLeft size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 border-b border-nav-divider mx-2 mt-3 mb-2 gap-2">
            <div className="w-12 h-12 shrink-0 rounded-panel bg-gold text-nav-bg flex items-center justify-center font-semibold text-[14px] overflow-hidden" title={instName}>
              {instLogo ? (
                <img src={instLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                instInitials
              )}
            </div>
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              className="p-1 rounded-control text-nav-muted hover:text-white hover:bg-nav-active transition-colors"
            >
              <FiMenu size={18} />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav aria-label="Main" className="flex-1 p-3.5 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isMatch =
              location.pathname === item.path ||
              (item.path !== "/teacher/dashboard" && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative group flex items-center ${
                  collapsed ? "justify-center" : "justify-between"
                } min-h-[40px] px-3 py-2 rounded-control text-[14px] transition-all duration-200 select-none ${
                  isMatch
                    ? "bg-nav-active text-white font-medium shadow-xs"
                    : "text-nav-text font-normal hover:bg-nav-active/50 hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex items-center justify-center shrink-0 transition-colors ${
                      isMatch ? "text-gold" : "text-nav-muted group-hover:text-nav-text"
                    }`}
                  >
                    {item.icon}
                  </div>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
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
            <div className="mx-auto font-mono text-micro text-nav-muted">
              {instInitials}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Hub */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-page">
        <TeacherNavbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable] p-6 md:p-8 scroll-smooth">
          <div className="max-w-content mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
