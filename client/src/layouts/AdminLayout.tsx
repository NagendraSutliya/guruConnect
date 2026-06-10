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
  MdSettings,
  MdWeb,
} from "react-icons/md";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

type MenuChild = {
  name: string;
  path: string;
  external?: boolean;
};

type MenuItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  external?: boolean;
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
        { name: "Admission Form", path: "/admin/admissions" },
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
        { name: "Fee Structure", path: "/admin/fee-structure" },
        { name: "Collect Fees", path: "/admin/collect-fees" },
        { name: "Invoices", path: "/admin/invoices" },
      ],
    },
    // {
    //   name: "HR & Payroll",
    //   icon: <MdPeople size={18} />,
    //   children: [
    //     { name: "Staff Management", path: "/admin/staff" },
    //     { name: "Payroll / Salary", path: "/admin/payroll" },
    //     { name: "Leave Management", path: "/admin/leaves" },
    //   ],
    // },
    // {
    //   name: "Transport",
    //   icon: <MdDirectionsBus size={18} />,
    //   children: [
    //     { name: "Routes", path: "/admin/transport/routes" },
    //     { name: "Vehicles", path: "/admin/transport/vehicles" },
    //     { name: "Driver Logs", path: "/admin/transport/drivers" },
    //   ],
    // },
    // {
    //   name: "Inventory",
    //   icon: <MdInventory size={18} />,
    //   children: [
    //     { name: "Assets", path: "/admin/inventory/assets" },
    //     { name: "Suppliers", path: "/admin/inventory/suppliers" },
    //     { name: "Purchase Logs", path: "/admin/inventory/purchase" },
    //   ],
    // },
    // {
    //   name: "Library",
    //   icon: <MdLibraryBooks size={18} />,
    //   children: [
    //     { name: "Book List", path: "/admin/library/books" },
    //     { name: "Issue / Return", path: "/admin/library/issue" },
    //     { name: "Members", path: "/admin/library/members" },
    //   ],
    // },
    // {
    //   name: "Hostel",
    //   icon: <MdHotel size={18} />,
    //   children: [
    //     { name: "Hostel List", path: "/admin/hostel/list" },
    //     { name: "Rooms", path: "/admin/hostel/rooms" },
    //     { name: "Allotment", path: "/admin/hostel/allotment" },
    //   ],
    // },
    // {
    //   name: "Certificates",
    //   icon: <MdBadge size={18} />,
    //   children: [
    //     { name: "ID Cards", path: "/admin/certificates/id-cards" },
    //     { name: "Transfer Certificate", path: "/admin/certificates/tc" },
    //     { name: "Transcripts", path: "/admin/certificates/transcripts" },
    //   ],
    // },
    // {
    //   name: "Communication",
    //   icon: <MdNotifications size={18} />,
    //   children: [
    //     { name: "Notice Board", path: "/admin/notices" },
    //     { name: "Send Message", path: "/admin/send-message" },
    //   ],
    // },
    {
      name: "Website CMS",
      icon: <MdWeb size={18} />,
      children: [
        { name: "CMS Dashboard", path: "/admin/cms" },
        { name: "Hero Banner", path: "/admin/cms/hero" },
        { name: "About Content", path: "/admin/cms/about" },
        { name: "Admissions", path: "/admin/cms/admissions" },
        { name: "Academics", path: "/admin/cms/academics" },
        { name: "Achievements", path: "/admin/cms/achievements" },
        { name: "Photo Gallery", path: "/admin/cms/gallery" },
        { name: "Contact Us", path: "/admin/cms/contact" },
        { name: "Live Preview", path: "http://localhost:5174", external: true },
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


  // Toggle parent
  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name); // close if already open
      } else {
        newSet.add(name); // open
        // Auto scroll to show children
        setTimeout(() => {
          const element = document.getElementById(`menu-${name}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 300);
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

 
  return (
    <>
      <div className="flex flex-col h-screen bg-slate-50/50 overflow-hidden font-sans">
        <AdminNavbar />

        {/* Layout Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Premium Sidebar */}
          <aside className="w-64 bg-slate-950 bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#1e1b4b] border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.2)] flex flex-col overflow-y-auto custom-scrollbar z-10 relative">
            
        

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
              <nav className="px-3 py-3 pb-20 space-y-1">
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
                    <div key={item.name} id={`menu-${item.name}`} className="pt-0.5">
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
                            child.external ? (
                              <a
                                key={child.path}
                                href={child.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative block px-3 py-1.5 rounded-lg text-sm transition-all duration-200 text-slate-400 font-medium hover:bg-white/10 hover:text-indigo-300"
                                onClick={(e) => e.stopPropagation()} // Prevent any parent clicks
                              >
                                {child.name}
                              </a>
                            ) : (
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
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="p-3 border-t border-white/5">
              <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-3 border border-indigo-500/20 shadow-inner text-center">
                <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">
                  {JSON.parse(localStorage.getItem("admin") || "{}").instituteName || "GuruConnect"}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] text-indigo-400/70 font-bold uppercase tracking-wider">Enterprise v2.0</p>
                </div>
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
      
     
    </>
  );
};

export default AdminLayout;
