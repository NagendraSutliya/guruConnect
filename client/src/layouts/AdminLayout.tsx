import { Outlet, NavLink } from "react-router-dom";
// import Navbar from "../components/Navbar";

const AdminLayout = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Teachers", path: "/admin/teachers" },
    { name: "Feedback", path: "/admin/feedback" },
    { name: "Public Links", path: "/admin/link" },
  ];

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b">
            <h2 className="text-2xl font-bold text-orange-600">
              Guru<span className="text-blue-600">Connect</span>
            </h2>
            <p className="text-sm font-semibold text-gray-600 mt-1">
              Admin Panel
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

          {/* Footer */}
          <div className="px-6 py-4 border-t text-xs text-gray-400">
            © {new Date().getFullYear()} GuruConnect
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
