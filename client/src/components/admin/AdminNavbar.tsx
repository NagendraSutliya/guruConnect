import { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaCog,
  // FaHome,
  FaSignOutAlt,
  FaUserCircle,
  FaUserShield,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between bg-gray-50 shadow-md px-6 py-2">
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/guruconnect-logo.png"
          alt="GuruConnect Logo"
          className="w-20 h-20"
        />
      </Link>

      <div className="flex items-center gap-3">
        <FaUserShield className="text-blue-600" size={26} />
        <h1 className="text-lg font-semibold text-gray-800">
          Admin <span className="text-gray-500 font-medium">Dashboard</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="text-gray-500 hover:text-gray-700">
          <FaBell size={20} />
        </button>
        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />
        {/* <Link
          to="/admin/dashboard"
          className="flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-100 transition text-gray-700 font-medium"
        >
          <FaHome />
          Home
        </Link> */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            <FaUserCircle className="text-2xl text-gray-600" />
            <span className="font-medium text-gray-700">Admin</span>
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 animate-dropdown">
              <Link
                to="/admin/profile"
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition"
              >
                <FaUserCircle />
                Profile
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition"
              >
                <FaCog />
                Settings
              </Link>
              <button
                onClick={logout}
                className="flex items-center w-full gap-2 px-4 py-3 text-gray-700 hover:bg-blue-50 transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>{" "}
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
    </header>
  );
};

export default AdminNavbar;
