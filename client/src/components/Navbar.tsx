import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const role = localStorage.getItem("role");
  const token =
    role === "admin"
      ? localStorage.getItem("adminToken")
      : role === "teacher"
      ? localStorage.getItem("teacherToken")
      : null;

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("teacherToken");
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
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/guruconnect-logo.png"
            alt="GuruConnect Logo"
            className="w-[80px] h-[80px]"
          />
        </Link>

        <div className="flex gap-4 items-center relative">
          {!token && (
            <>
              {/* Login Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowLogin(!showLogin)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Login
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
                  </div>
                )}
              </div>

              <Link
                to="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Register Institute
              </Link>
            </>
          )}

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
        </div>
      </div>

      {/* Dropdown animation */}
      <style>
        {`
          .animate-dropdown {
            animation: dropdown 0.15s ease-out forwards;
          }
          @keyframes dropdown {
            from {
              opacity: 0;
              transform: translateY(-5px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </nav>
  );
}
