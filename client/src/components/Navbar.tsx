import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const role = localStorage.getItem("role");
  const token =
    role === "admin"
      ? localStorage.getItem("adminToken")
      : role === "teacher"
      ? localStorage.getItem("teacherToken")
      : role === "student"
      ? localStorage.getItem("studentToken")
      : null;

  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/register');

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("teacherToken");
    localStorage.removeItem("studentToken");
    navigate("/");
  };

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow relative">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/guruconnect-logo.png"
            alt="GuruConnect Logo"
            className="w-20 h-20"
          />
        </Link>

        <div className="flex gap-4 items-center relative">
          {!token ? (
            !isAuthPage && (
              <>
                {/* Login Button */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowLogin(!showLogin)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Sign In
                  </button>

                  {/* Dropdown */}
                  {showLogin && (
                    <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg animate-dropdown">
                      <Link
                        to="/auth/login"
                        onClick={() => setShowLogin(false)}
                        className="block px-5 py-3 text-gray-700 hover:bg-blue-50 transition"
                      >
                        🏫 Institute Admin
                      </Link>

                      <div className="border-t" />

                      <Link
                        to="/teacher/login"
                        onClick={() => setShowLogin(false)}
                        className="block px-5 py-3 text-gray-700 hover:bg-green-50 transition"
                      >
                        👩‍🏫 Teacher
                      </Link>

                      {/* Student */}
                      <div className="border-t" />

                      <Link
                        to="/student/login"
                        onClick={() => setShowLogin(false)}
                        className="block px-5 py-3 text-gray-700 hover:bg-purple-50 transition"
                      >
                        🎓 Student
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </>
            )
          ) : (
            <>
              {/* Admin */}
              {token && role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition font-medium"
                  >
                    Admin Dashboard
                  </Link>

                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* Teacher */}
              {token && role === "teacher" && (
                <>
                  <Link
                    to="/teacher/dashboard"
                    className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition font-medium"
                  >
                    Teacher Dashboard
                  </Link>

                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* Student */}
              {token && role === "student" && (
                <>
                  <Link
                    to="/student/dashboard"
                    className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-purple-700 transition font-medium"
                  >
                    Student Dashboard
                  </Link>

                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

    </nav>
  );
}
