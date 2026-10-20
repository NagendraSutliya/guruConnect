import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import CommandPalette from "../components/common/CommandPalette";
import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import {
  MdAssignment,
  MdDashboard,
  MdFeedback,
  MdLink,
  MdSchool,
  MdAttachMoney,
  MdSettings,
  MdWeb,
  MdPeople,
  MdDirectionsBus,
  MdInventory,
  MdLibraryBooks,
  MdHotel,
  MdBadge,
  MdNotifications,
  MdFactCheck,
  MdAccountBalance,
  MdPayments,
  MdSecurity,
  MdCreditCard,
  MdHelpOutline
} from "react-icons/md";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

type MenuChild = {
  name: string;
  path: string;
  external?: boolean;
};

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string | number;
  external?: boolean;
  children?: MenuChild[];
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem("sidebar_minimized");
    return saved === "true";
  });

  const [openMenus, setOpenMenus] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin/admissions")) {
      initial.add("Admissions");
    }
    return initial;
  });

  useEffect(() => {
    if (location.pathname.startsWith("/admin/admissions")) {
      setOpenMenus(prev => {
        if (!prev.has("Admissions")) {
          const next = new Set(prev);
          next.add("Admissions");
          return next;
        }
        return prev;
      });
    }
  }, [location.pathname]);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const toggleSidebar = () => {
    setIsMinimized(prev => {
      const newState = !prev;
      localStorage.setItem("sidebar_minimized", String(newState));
      return newState;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: <MdDashboard size={18} />, path: "/admin/dashboard" },
    { name: "Approvals", icon: <MdFactCheck size={18} />, path: "/admin/approvals", badge: 3 },
    {
      name: "Admissions",
      icon: <MdBadge size={18} />,
      path: "/admin/admissions/pipeline",
      children: [
        { name: "Pipeline", path: "/admin/admissions/pipeline" },
        { name: "Register & Records", path: "/admin/admissions/records" },
      ],
    },
    { name: "Students", icon: <FaUserGraduate size={16} />, path: "/admin/students" },
    { name: "Attendance", icon: <MdAssignment size={18} />, path: "/admin/attendance" },
    { name: "Academics & Timetable", icon: <MdSchool size={18} />, path: "/admin/routine" },
    { name: "Examinations", icon: <MdAssignment size={18} />, path: "/admin/exam" },
    { name: "Fees", icon: <MdAttachMoney size={18} />, path: "/admin/collect-fees" },
    { name: "Accounts", icon: <MdAccountBalance size={18} />, path: "/admin/accounts" },
    { name: "Staff & Leave", icon: <FaChalkboardTeacher size={16} />, path: "/admin/staff" },
    { name: "Payroll", icon: <MdPayments size={18} />, path: "/admin/payroll" },
    { name: "Transport", icon: <MdDirectionsBus size={18} />, path: "/admin/transport" },
    { name: "Hostel", icon: <MdHotel size={18} />, path: "/admin/hostel" },
    { name: "Library", icon: <MdLibraryBooks size={18} />, path: "/admin/library" },
    { name: "Inventory & Assets", icon: <MdInventory size={18} />, path: "/admin/inventory" },
    { name: "Front Office", icon: <MdPeople size={18} />, path: "/admin/front-office" },
    { name: "Communication", icon: <MdNotifications size={18} />, path: "/admin/communication" },
    { name: "Reports", icon: <MdFeedback size={18} />, path: "/admin/reports" },
    { name: "Settings", icon: <MdSettings size={18} />, path: "/admin/settings/institute" },
    { name: "Users & Audit", icon: <MdSecurity size={18} />, path: "/admin/users" },
    { name: "Plan & billing", icon: <MdCreditCard size={18} />, path: "/admin/plan-billing" },
    { name: "Help & support", icon: <MdHelpOutline size={18} />, path: "/admin/help-support" },
  ];

  const [adminData, setAdminData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("admin");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    // Auto-fetch fresh institute profile from database
    api.get("/admin/profile")
      .then((res) => {
        if (res.data?.data) {
          const profile = res.data.data;
          setAdminData((prev: any) => {
            const updated = {
              ...prev,
              instituteName: profile.instituteName || prev.instituteName,
              ownerName: profile.ownerName || profile.principalName || prev.ownerName,
              logoUrl: profile.logoUrl || prev.logoUrl,
              email: profile.email || prev.email,
            };
            localStorage.setItem("admin", JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch((err) => {
        console.warn("Could not fetch admin profile:", err);
      });

    const handleStorage = () => {
      try {
        const saved = localStorage.getItem("admin");
        if (saved) {
          setAdminData(JSON.parse(saved));
        }
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const instName = adminData.instituteName || "GuruConnect";
  const instInitials = instName.substring(0, 2).toUpperCase();
  const instLogo = adminData.logoUrl || adminData.profileImage || null;

  return (
    <>
      <div className="flex h-screen bg-page overflow-hidden font-sans">
        {/* Premium Sidebar (Patshala Design) - Now Full Height */}
        <aside className={`${isMinimized ? "w-20 items-center" : "w-[236px]"} transition-all duration-300 bg-nav-bg border-r border-nav-divider flex flex-col z-10 relative`}>
            
            {/* School Profile Header */}
            {!isMinimized && (
              <div className="flex items-center gap-3 px-3.5 py-4 border-b border-nav-divider mx-3.5 mt-3 mb-2">
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
                  <div className="text-xs text-nav-muted truncate">Admin Portal</div>
                </div>
              </div>
            )}

            {/* Navigation Menu */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar scroll-smooth ${isMinimized ? "px-2 pt-4" : "px-3.5"} pb-20 space-y-1 w-full`}>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const hasChildren = Boolean(item.children && item.children.length > 0);
                  const isItemActive = hasChildren
                    ? location.pathname.startsWith("/admin/admissions") || item.children?.some(c => location.pathname === c.path)
                    : location.pathname === item.path;
                  const isOpen = openMenus.has(item.name);

                  if (hasChildren && !isMinimized) {
                    return (
                      <div key={item.name} className="flex flex-col">
                        <div
                          onClick={() => {
                            toggleMenu(item.name);
                            if (!item.children?.some(c => location.pathname === c.path)) {
                              navigate(item.children![0].path);
                            }
                          }}
                          className={`group flex items-center justify-between px-3 py-[9px] rounded-control transition-all duration-300 ease-out cursor-pointer select-none
                            ${
                              isItemActive
                                ? "bg-nav-active text-white font-medium"
                                : "text-nav-text font-normal hover:bg-nav-active/50"
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`flex items-center justify-center shrink-0 ${isItemActive ? "text-gold" : "text-nav-muted group-hover:text-nav-text"}`}>
                              {item.icon}
                            </div>
                            <span className="whitespace-nowrap overflow-hidden text-[14px] flex-1">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                                {item.badge}
                              </span>
                            )}
                            <FiChevronDown
                              size={14}
                              className={`text-nav-muted group-hover:text-nav-text transition-transform duration-200 ${isOpen ? "rotate-180 text-gold" : ""}`}
                            />
                          </div>
                        </div>

                        {/* Submenu Children */}
                        {isOpen && (
                          <div className="ml-5 pl-2.5 my-1 border-l border-nav-divider flex flex-col gap-1 animate-fadeIn">
                            {item.children!.map((child) => {
                              const isChildActive =
                                location.pathname === child.path ||
                                (child.path === "/admin/admissions/pipeline" && location.pathname === "/admin/admissions");

                              return (
                                <NavLink
                                  key={child.path}
                                  to={child.path}
                                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-control text-[13px] transition-all duration-200
                                    ${
                                      isChildActive
                                        ? "bg-nav-active/80 text-gold font-medium"
                                        : "text-nav-text hover:text-white hover:bg-nav-active/40"
                                    }
                                  `}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isChildActive ? "bg-gold" : "bg-nav-muted"}`} />
                                  <span className="truncate">{child.name}</span>
                                </NavLink>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path!}
                      className={({ isActive }) =>
                        `group flex items-center ${isMinimized ? "justify-center" : "gap-3"} px-3 py-[9px] rounded-control transition-all duration-300 ease-out
                        ${
                          (isActive || (hasChildren && isItemActive))
                            ? "bg-nav-active text-white font-medium"
                            : "text-nav-text font-normal hover:bg-nav-active/50"
                        }`
                      }
                      title={isMinimized ? `${item.name}${hasChildren ? " (Pipeline, Register & Records)" : ""}` : ""}
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`flex items-center justify-center shrink-0 ${(isActive || (hasChildren && isItemActive)) ? "text-gold" : "text-nav-muted group-hover:text-nav-text"}`}>
                            {item.icon}
                          </div>
                          {!isMinimized && (
                            <>
                              <span className="whitespace-nowrap overflow-hidden text-[14px] flex-1">{item.name}</span>
                              {item.badge && (
                                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                          {isMinimized && item.badge && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="p-3.5 border-t border-nav-divider">
              <div className={`rounded-control ${isMinimized ? "p-2" : "p-3"} bg-nav-active/30 flex flex-col items-center justify-center min-h-[44px]`}>
                {!isMinimized ? (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-success flex-none" />
                      <p className="text-[12px] text-nav-text tracking-wide whitespace-nowrap">Systems Online</p>
                    </div>
                  </>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-success flex-none" title="Systems Online" />
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area (Navbar + Page Content) */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <AdminNavbar 
              onOpenSearch={() => setIsCommandPaletteOpen(true)} 
              onToggleSidebar={toggleSidebar}
              adminData={adminData}
            />
            <main className="flex-1 px-4 md:px-8 overflow-y-auto bg-page">
              <div className="animate-fadeIn w-full max-w-content mx-auto py-8">
                <Outlet />
              </div>
            </main>
          </div>

      </div>
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </>
  );
};

export default AdminLayout;
