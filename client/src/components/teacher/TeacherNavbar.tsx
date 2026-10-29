import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiUser, FiHelpCircle, FiSettings, FiLogOut, FiRepeat } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

interface TeacherNavbarProps {
  onSearch?: (query: string) => void;
}

const TeacherNavbar: React.FC<TeacherNavbarProps> = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [institute, setInstitute] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const instId = typeof user?.instituteId === 'object' ? user?.instituteId?._id : user?.instituteId;
    if (instId) {
      api.get(`/public/institute/${instId}`)
        .then((res) => setInstitute(res.data.data))
        .catch(() => {});
    }
  }, [user]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  const handleNav = (path: string) => {
    navigate(path);
    setShowProfile(false);
  };

  // Get teacher initials
  const teacherName = user?.name || "Sunita Rathore";
  const initials = teacherName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const notifications = [
    { id: 1, title: "Substitute assigned", desc: "Period 3: Class 6-A English for Rachna Bose", time: "10m ago", isNew: true },
    { id: 2, title: "Parent leave request", desc: "Isha Kanwar (8-B) applied for 14–15 Oct", time: "1h ago", isNew: true },
    { id: 3, title: "Marks deadline", desc: "Half-Yearly Science 8-B due tomorrow 5 pm", time: "3h ago", isNew: true },
  ];

  return (
    <header className="bg-surface border-b border-line px-6 lg:px-8 min-h-[64px] box-border flex items-center justify-between gap-3 shrink-0 sticky top-0 z-40">
      {/* Search Bar matching specification */}
      <div className="flex-1 max-w-[420px]">
        <div className="relative flex items-center w-full">
          <input
            type="search"
            aria-label="Search my students"
            placeholder="Search my students by name or roll number"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full min-h-[42px] px-3.5 pl-9 rounded-control border border-line-input bg-surface-subtle font-sans text-body text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors"
          />
          <FiSearch className="absolute left-3 text-ink-secondary pointer-events-none" size={16} />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Session Indicator */}
        <span className="hidden sm:inline-block text-small font-medium text-ink-secondary">
          {institute?.instituteName ? `${institute.instituteName} · ` : ""}Session 2026-27
        </span>

        {/* Notifications Button */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            aria-label="Notifications, 3 unread"
            className="relative w-10 h-10 rounded-control border border-line bg-surface hover:bg-surface-subtle flex items-center justify-center text-ink transition-colors"
          >
            <FiBell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-warning-accent" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-line rounded-card shadow-lg z-50 overflow-hidden animate-fadeIn">
              <div className="px-4 py-3 border-b border-line-row bg-surface-head flex items-center justify-between">
                <h3 className="text-small font-semibold text-ink m-0">Notifications</h3>
                <span className="text-micro font-bold text-primary bg-primary-tint px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-line-row">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-surface-subtle cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-body font-semibold text-ink">{n.title}</span>
                      <span className="text-caption text-ink-secondary">{n.time}</span>
                    </div>
                    <p className="text-small text-ink-secondary m-0 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-line-row bg-surface-subtle text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-caption font-semibold text-primary hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-control hover:bg-surface-subtle transition-colors text-left"
          >
            <span className="w-9 h-9 rounded-full bg-primary-tint text-primary-dark flex items-center justify-center font-semibold text-small shrink-0 border border-primary/20">
              {initials}
            </span>
            <span className="hidden md:flex flex-col">
              <span className="text-body font-semibold text-ink leading-tight">{teacherName}</span>
              <span className="text-caption text-ink-secondary leading-none">Teacher · Class teacher 8-B</span>
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-surface border border-line rounded-card shadow-lg z-50 py-2 animate-fadeIn">
              <div className="px-4 py-3 border-b border-line-row bg-surface-head mb-1">
                <p className="text-body font-semibold text-ink m-0 leading-snug">{teacherName}</p>
                <p className="text-caption text-ink-secondary m-0">{user?.email || "teacher@school.edu"}</p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-success-text bg-success-bg px-2 py-0.5 rounded-full">
                  TGT Science · Class Teacher 8-B
                </span>
              </div>

              <button
                onClick={() => handleNav("/teacher/profile")}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-body text-ink hover:bg-surface-subtle transition-colors text-left"
              >
                <FiUser size={16} className="text-ink-secondary" /> My Profile
              </button>
              <button
                onClick={() => handleNav("/teacher/settings")}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-body text-ink hover:bg-surface-subtle transition-colors text-left"
              >
                <FiSettings size={16} className="text-ink-secondary" /> Settings
              </button>
              <button
                onClick={() => handleNav("/teacher/help")}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-body text-ink hover:bg-surface-subtle transition-colors text-left"
              >
                <FiHelpCircle size={16} className="text-ink-secondary" /> Teacher Help & Support
              </button>
              <button
                onClick={() => {
                  setShowProfile(false);
                  showToast("Switching to parent view...", "info");
                  navigate("/parent/login");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-body text-ink-secondary hover:bg-surface-subtle transition-colors text-left"
              >
                <FiRepeat size={16} className="text-ink-secondary" /> Switch to Parent View
              </button>

              <div className="h-px bg-line-row my-1" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-body text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
              >
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TeacherNavbar;
