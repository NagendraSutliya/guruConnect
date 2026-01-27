import { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaChevronDown,
  FaGraduationCap,
  FaSignOutAlt,
  // FaUserCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const TeacherNavbar = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("teacherToken");
    navigate("/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
      {/* Left */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/guruconnect-logo.png"
          alt="GuruConnect Logo"
          className="w-20 h-20"
        />
      </Link>
      <div className="flex items-center gap-3">
        <FaGraduationCap className="text-blue-600" size={26} />
        <h1 className="text-lg font-semibold text-gray-800">
          Teacher <span className="text-gray-500 font-medium">Dashboard</span>
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 relative" ref={dropdownRef}>
        {/* Notification */}
        <button className="text-gray-500 hover:text-gray-700">
          <FaBell size={20} />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />

        {/* Profile */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2"
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <FaChevronDown
            className={`text-gray-500 transition ${
              profileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {profileOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border z-50 animate-dropdown">
            <div className="px-4 py-3 border-b text-sm font-medium text-gray-700">
              Teacher
            </div>

            <Link
              to="/teacher/profile"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setProfileOpen(false)}
            >
              <FaGraduationCap />
              Profile
            </Link>

            {/* Settings Option */}
            <Link
              to="/teacher/settings"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setProfileOpen(false)}
            >
              <FaChevronDown />
              Settings
            </Link>

            <Link
              to="/teacher/help"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setProfileOpen(false)}
            >
              <FaBell />
              Help
            </Link>

            {/* Divider */}
            <div className="border-t my-1" />
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        )}
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
              transform: translateY(-6px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </header>
  );
};

export default TeacherNavbar;
