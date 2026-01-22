import { Outlet, NavLink } from "react-router-dom";
import TeacherNavbar from "../components/Teachernavbar";

const TeacherLayout = () => {
  const navItems = [
    { name: "Dashboard", path: "/teacher/dashboard" },
    { name: "My Feedback", path: "/teacher/feedback" },
  ];

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
          <nav className="flex-1 px-4 py-6 space-y-2">
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
                <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                {item.name}
              </NavLink>
            ))}
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
