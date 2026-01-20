import { Outlet, Link, useNavigate } from "react-router-dom";

const TeacherLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("teacherToken");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-blue-600">Teacher Panel</h2>

        <nav className="space-y-3">
          <Link
            className="block text-gray-600 hover:text-blue-600"
            to="/teacher/dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="block text-gray-600 hover:text-blue-600"
            to="/teacher/feedback"
          >
            My Feedback
          </Link>
        </nav>

        <button onClick={logout} className="mt-10 text-red-500 hover:underline">
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
