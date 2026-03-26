import { Outlet, NavLink, useLocation } from "react-router-dom";
import TeacherNavbar from "../components/teacher/TeacherNavbar";
import { useState } from "react";
import { MdDashboard, MdFeedback } from "react-icons/md";
import { FaBook, FaClipboardCheck } from "react-icons/fa";

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

const TeacherLayout = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  // const navItems = [
  //   { name: "Dashboard", path: "/teacher/dashboard" },
  //   { name: "Attendance", path: "/teacher/attendance" },
  //   { name: "Marks", path: "/teacher/marks" },
  //   { name: "Study Material", path: "/teacher/material" },
  //   { name: "My Assignment", path: "/teacher/assignments" },
  //   { name: "Tests", path: "/teacher/tests" },
  //   { name: "My Feedback", path: "/teacher/feedback" },
  // ];

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      icon: <MdDashboard size={18} />,
      path: "/teacher/dashboard",
    },
    {
      name: "Academics",
      icon: <FaClipboardCheck size={16} />,
      children: [
        { name: "Attendance", path: "/teacher/attendance" },
        { name: "Tests", path: "/teacher/tests" },
        { name: "Results", path: "/teacher/results" },
        // { name: "Results_test", path: "/teacher/results_test" },
      ],
    },
    {
      name: "Resources",
      icon: <FaBook size={16} />,
      children: [
        { name: "Study Material", path: "/teacher/material" },
        { name: "My Assignments", path: "/teacher/assignments" },
      ],
    },
    {
      name: "My Feedback",
      icon: <MdFeedback size={18} />,
      path: "/teacher/feedback",
    },
  ];

  // Toggle dropdown parent
  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  // When clicking child → keep only its parent open
  const handleChildClick = (parent: string) => {
    setOpenMenus(new Set([parent]));
  };

  // When clicking single link → close all dropdowns
  const handleSingleClick = () => {
    setOpenMenus(new Set());
  };

  const isChildActive = (children?: MenuChild[]) =>
    children?.some((c) => location.pathname === c.path);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <TeacherNavbar />

      {/* Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 bg-white border-r shadow-sm flex flex-col overflow-y-auto">
          <div className="px-6 py-5 border-b shrink-0">
            <h2 className="text-2xl font-bold text-orange-600">
              Guru<span className="text-blue-600">Connect</span>
            </h2>
            <p className="text-sm font-semibold text-gray-600 mt-1">
              Teacher Panel
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

          <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
            {menuItems.map((item) => {
              const isOpen =
                openMenus.has(item.name) || isChildActive(item.children);

              // 🔹 Single link
              if (item.path) {
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={handleSingleClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                      ${
                        isActive
                          ? "bg-purple-100 text-purple-600 font-semibold scale-[1.02]"
                          : "text-gray-600 hover:bg-gray-100 hover:scale-[1.01]"
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                );
              }

              // 🔹 Dropdown
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition
                      ${
                        isOpen
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </div>
                    <span
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {/* Children (no height limit issue) */}
                  <div
                    className={`ml-1 overflow-hidden transition-all duration-300 ease-in-out
                                ${
                                  isOpen
                                    ? "max-h-[1000px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                  >
                    <div className="ml-9 mt-1 space-y-1">
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => handleChildClick(item.name)}
                          className={({ isActive }) =>
                            `block px-3 py-1.5 rounded-md transition
                          ${
                            isActive
                              ? "bg-purple-100 text-purple-600 font-medium"
                              : "text-gray-500 hover:bg-gray-100"
                          }`
                          }
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
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
