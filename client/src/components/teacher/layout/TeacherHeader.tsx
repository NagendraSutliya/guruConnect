import { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaChevronDown,
  FaGraduationCap,
  FaSignOutAlt,
  // FaUserCircle,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const TeacherNavbar = () => {
  const { user } = useAuth();
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
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
               <FiUser size={16} />
            </div>
          )}
          <FaChevronDown
            className={`text-gray-500 transition ${
              profileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {profileOpen && (
          <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-dropdown overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-sky-600 to-sky-400 border-b border-slate-50 flex items-center gap-3">
               {user?.profileImage && (
                 <img src={user.profileImage} alt="Me" className="w-10 h-10 rounded-lg border-2 border-white/20 object-cover shadow-sm" />
               )}
               <div className="min-w-0">
                  <p className="text-[11px] font-black text-white uppercase tracking-widest truncate leading-tight">{user?.name}</p>
                  <p className="text-[10px] font-medium text-sky-50 truncate opacity-80 mt-0.5">{user?.email}</p>
               </div>
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

    </header>
  );
};

export default TeacherNavbar;
