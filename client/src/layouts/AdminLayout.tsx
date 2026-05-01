import { Outlet, NavLink } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import { useState } from "react";
import {
  MdAssignment,
  MdDashboard,
  MdFeedback,
  MdLink,
  MdSchool,
  MdAttachMoney,
  MdNotifications,
  MdSettings,
} from "react-icons/md";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

type MenuChild = {
  name: string;
  path: string;
};

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuChild[];
};

const AdminLayout = () => {
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      icon: <MdDashboard size={18} />,
      path: "/admin/dashboard",
    },
    {
      name: "Teachers",
      icon: <FaChalkboardTeacher size={16} />,
      children: [
        { name: "Teachers", path: "/admin/teachers" },
        { name: "Teacher Assign", path: "/admin/teacher-assign" },
      ],
    },
    {
      name: "Students",
      icon: <FaUserGraduate size={16} />,
      children: [
        { name: "Students", path: "/admin/students" },
        { name: "Attendance", path: "/admin/attendance" },
      ],
    },
    {
      name: "Academic",
      icon: <MdSchool size={18} />,
      children: [
        { name: "Academic Years", path: "/admin/academic-years" },
        { name: "Classes", path: "/admin/classes" },
        { name: "Sections", path: "/admin/sections" },
        { name: "Subjects", path: "/admin/subjects" },
        { name: "Routine", path: "/admin/routine" },
      ],
    },
    {
      name: "Exam",
      icon: <MdAssignment size={18} />,
      children: [
        { name: "Exam", path: "/admin/exam" },
        { name: "Result", path: "/admin/result" },
      ],
    },
    {
      name: "Finance",
      icon: <MdAttachMoney size={18} />,
      children: [
        { name: "Fee Setup", path: "/admin/fee-setup" },
        { name: "Collect Fees", path: "/admin/collect-fees" },
        { name: "Invoices", path: "/admin/invoices" },
      ],
    },
    {
      name: "Communication",
      icon: <MdNotifications size={18} />,
      children: [
        { name: "Notice Board", path: "/admin/notices" },
        { name: "Send Message", path: "/admin/send-message" },
      ],
    },
    {
      name: "Feedback",
      icon: <MdFeedback size={18} />,
      path: "/admin/feedback",
    },
    { name: "Public Links", icon: <MdLink size={18} />, path: "/admin/link" },
    {
      name: "System Settings",
      icon: <MdSettings size={18} />,
      children: [
        { name: "Institute Setup", path: "/admin/settings/institute" },
        { name: "Roles & Permissions", path: "/admin/settings/roles" },
      ],
    },
  ];

  // const isChildActive = (children?: MenuChild[]) =>
  //   children?.some((child) => location.pathname === child.path);

  // const isOpen = (item: MenuItem) => {
  //   // If this menu is currently toggled open
  //   if (openMenu === item.name) return true;

  //   // If current route is inside children AND this menu hasn't been toggled yet
  //   if (item.children && isChildActive(item.children) && !openMenu) return true;

  //   return false;
  // };

  // Toggle parent
  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name); // close if already open
      } else {
        newSet.add(name); // open
      }
      return newSet;
    });
  };

  // Click on child
  const handleChildClick = (parentName: string) => {
    setOpenMenus(new Set([parentName])); // only parent of clicked child stays open
  };

  const handleSingleClick = () => {
    setOpenMenus(new Set()); // close all dropdowns
  };

  // Determine if a menu is open
  // const isOpen = (item: MenuItem) => openMenus.has(item.name);

  return (
    <>
      <div className="flex flex-col h-screen bg-slate-50/50 overflow-hidden font-sans">
        <AdminNavbar />

        {/* Layout Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Premium Sidebar */}
          <aside className="w-64 bg-slate-950 bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#1e1b4b] border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.2)] flex flex-col overflow-y-auto custom-scrollbar z-10 relative">
            
            {/* Sidebar Header */}
            {/* <div className="px-5 py-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
                  <span className="text-white font-black text-lg">G</span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-orange-600 leading-tight">
                    Guru<span className="text-blue-600">Connect</span>
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase mt-0.5">
                    Admin Portal
                  </p>
                </div>
              </div>
            </div> */}

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 py-3 space-y-1">
              {menuItems.map((item) => {
                const open = openMenus.has(item.name);

                if (item.path) {
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ease-out
                        ${
                          isActive
                            ? "bg-indigo-500/20 text-indigo-300 font-bold shadow-sm border border-indigo-500/20"
                            : "text-slate-400 font-medium hover:bg-white/5 hover:text-slate-100"
                        }`
                      }
                      onClick={handleSingleClick} // close other dropdowns
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-indigo-500/30 text-indigo-400 shadow-sm" : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300 group-hover:shadow-sm"}`}>
                            {item.icon}
                          </div>
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  );
                }

                // Dropdown parent
                return (
                  <div key={item.name} className="pt-0.5">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 ease-out
                        ${
                          open
                            ? "bg-white/5 text-slate-100 font-bold shadow-sm border border-white/5"
                            : "text-slate-400 font-medium hover:bg-white/5 hover:text-slate-100"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg transition-colors ${open ? "bg-white/10 text-indigo-400 shadow-sm" : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300 group-hover:shadow-sm"}`}>
                          {item.icon}
                        </div>
                        {item.name}
                      </div>
                      <span
                        className={`text-slate-500 transition-transform duration-300 ease-out ${
                          open ? "rotate-180 text-slate-300" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>

                    {/* Children */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out
                        ${open ? "max-h-[500px] opacity-100 mt-0.5 mb-1" : "max-h-0 opacity-0 m-0"}`}
                    >
                      <div className="ml-5 pl-4 border-l-2 border-slate-800 space-y-0.5 relative">
                        {item.children?.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={({ isActive }) =>
                              `relative block px-3 py-1.5 rounded-lg text-sm transition-all duration-200
                               ${
                                 isActive
                                   ? "bg-indigo-500/20 text-indigo-300 font-bold"
                                   : "text-slate-400 font-medium hover:bg-white/5 hover:text-slate-200"
                               }`
                            }
                            onClick={() => handleChildClick(item.name)} // close all others
                          >
                            {({ isActive }) => (
                              <>
                                {/* Active indicator dot on the vertical line */}
                                {isActive && (
                                  <div className="absolute left-[calc(-16px-2px)] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-[#0f172a]" />
                                )}
                                {child.name}
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 mt-auto mb-2">
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-3 border border-indigo-500/20 shadow-inner text-center">
                <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mb-0.5">GuruConnect</p>
                <p className="text-[11px] text-indigo-400/70 font-medium">Enterprise v2.0</p>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 px-8  overflow-y-auto bg-slate-50/30">
            <div className="animate-fadeIn w-full max-w-[1400px] mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </>
  );
};

export default AdminLayout;
