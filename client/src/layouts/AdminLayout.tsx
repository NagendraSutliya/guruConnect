import { Outlet, NavLink } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import { useState } from "react";
import {
  MdAssignment,
  MdDashboard,
  MdFeedback,
  MdLink,
  MdSchool,
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
  // const location = useLocation();
  // const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  // const navItems = [
  //   { name: "Dashboard", path: "/admin/dashboard" },
  //   { name: "Teachers", path: "/admin/teachers" },
  //   { name: "Feedback", path: "/admin/feedback" },

  //   // NEW
  //   { name: "Academic Years", path: "/admin/academic-years" },
  //   { name: "Classes", path: "/admin/classes" },
  //   { name: "Sections", path: "/admin/sections" },
  //   { name: "Subjects", path: "/admin/subjects" },
  //   { name: "Teacher Assign", path: "/admin/teacher-assign" },

  //   { name: "Public Links", path: "/admin/link" },
  // ];

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
      name: "Feedback",
      icon: <MdFeedback size={18} />,
      path: "/admin/feedback",
    },

    { name: "Public Links", icon: <MdLink size={18} />, path: "/admin/link" },
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
      <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
        <AdminNavbar />

        {/* Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-60 bg-white border-r shadow-sm flex flex-col overflow-y-auto">
            <div className="px-6 py-5 border-b shrink-0">
              <h2 className="text-2xl font-bold text-orange-600">
                Guru<span className="text-blue-600">Connect</span>
              </h2>
              <p className="text-sm font-semibold text-gray-600 mt-1">
                Admin Panel
              </p>
            </div>

            {/* Navigation */}
            {/* <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
                  }
                >
                  {/* Icon placeholder */}
            {/* <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                  {item.name}
                </NavLink>
              ))}
            </nav>  */}

            <nav className="flex-1 px-3 py-4 text-sm space-y-1">
              {menuItems.map((item) => {
                const open = openMenus.has(item.name);

                if (item.path) {
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out
           ${
             isActive
               ? "bg-purple-100 text-purple-600 font-semibold scale-[1.02]"
               : "text-gray-600 hover:bg-gray-100 hover:scale-[1.01]"
           }`
                      }
                      onClick={handleSingleClick} // close other dropdowns
                    >
                      {item.icon}
                      {item.name}
                    </NavLink>
                  );
                }

                // Dropdown parent
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all 
                                  duration-200 ease-in-out
                ${
                  open
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {item.name}
                      </div>
                      <span
                        className={`transition-transform duration-300 ease-in-out ${
                          open ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>

                    {/* Children */}
                    <div
                      className={`ml-1 overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="ml-9 mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={({ isActive }) =>
                              `block px-3 py-1.5 rounded-md transition
                 ${
                   isActive
                     ? "bg-purple-100 text-purple-600 font-medium"
                     : "text-gray-500 hover:bg-gray-100"
                 }`
                            }
                            onClick={() => handleChildClick(item.name)} // close all others
                          >
                            {child.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t text-xs text-gray-400">
              © {new Date().getFullYear()} GuruConnect
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-6 mt-2 overflow-y-auto">
            <div className="animate-fadeIn">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
