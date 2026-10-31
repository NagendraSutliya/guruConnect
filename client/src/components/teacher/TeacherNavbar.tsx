import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiUser,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
  FiRepeat,
  FiChevronDown,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
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
    const instId = typeof user?.instituteId === "object" ? user?.instituteId?._id : user?.instituteId;
    if (instId) {
      api.get(`/public/institute/${instId}`)
        .then((res) => setInstitute(res.data.data))
        .catch(() => {});
    }
  }, [user]);

  // Click outside and escape key listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowProfile(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) onSearch(val);
  };

  // Dynamic teacher info
  const teacherName =
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "Teacher";
  const teacherEmail = user?.email || "teacher@school.edu";
  const teacherDesignation = user?.designation || "TGT Science";
  const instituteName = institute?.instituteName || user?.instituteName || "Shiksha Public School";
  const teacherImage =
    user?.profileImage ||
    user?.avatar ||
    user?.photo ||
    user?.image ||
    null;

  // Initials for avatar
  const initials = teacherName
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .split(/\s+/)
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TR";

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
          {instituteName ? `${instituteName} · ` : ""}Session 2026-27
        </span>

        {/* Notifications Button */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            aria-label="Notifications, 3 unread"
            aria-expanded={showNotifications}
            className={`relative w-10 h-10 rounded-control border flex items-center justify-center transition-colors cursor-pointer ${
              showNotifications
                ? "bg-surface-subtle border-line-input text-primary"
                : "bg-surface border-line text-ink hover:bg-surface-subtle"
            }`}
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
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-caption font-semibold text-primary hover:underline cursor-pointer"
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
            type="button"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            aria-expanded={showProfile}
            aria-haspopup="true"
            className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-surface-subtle transition-colors cursor-pointer border border-transparent"
          >
            <div className="w-9 h-9 rounded-full border border-line-input bg-primary-tint text-primary-dark flex items-center justify-center font-bold text-[13.5px] shadow-2xs overflow-hidden shrink-0">
              {teacherImage ? (
                <img
                  src={teacherImage}
                  alt={teacherName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-[13.5px] font-bold text-ink leading-tight truncate max-w-[130px]" title={teacherName}>
                {teacherName}
              </span>
              <span className="text-[11px] text-ink-secondary font-medium leading-tight truncate max-w-[130px]">
                {teacherDesignation}
              </span>
            </div>
            <FiChevronDown
              size={14}
              className={`text-ink-secondary transition-transform duration-200 hidden sm:block ${
                showProfile ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-card shadow-lg border border-line overflow-hidden animate-fadeIn origin-top-right z-50">
              {/* Header */}
              <div className="p-4 border-b border-line bg-surface/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-line-input bg-primary-tint text-primary-dark flex items-center justify-center font-bold text-[14px] shrink-0 overflow-hidden">
                    {teacherImage ? (
                      <img
                        src={teacherImage}
                        alt={teacherName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-ink leading-tight truncate m-0" title={teacherName}>
                      {teacherName}
                    </p>
                    <p className="text-[11.5px] text-ink-secondary font-normal truncate mt-0.5 m-0" title={teacherEmail}>
                      {teacherEmail}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-tint text-primary-dark border border-primary/20">
                        {teacherDesignation}
                      </span>
                      <span className="text-[11px] text-ink-secondary truncate max-w-[110px]" title={instituteName}>
                        · {instituteName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Original Menu Options */}
              <div className="p-1.5">
                <Link
                  to="/teacher/profile"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-ink hover:text-primary hover:bg-primary-tint/20 rounded-control transition-colors"
                >
                  <FiUser size={16} className="text-ink-secondary" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/teacher/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-ink hover:text-primary hover:bg-primary-tint/20 rounded-control transition-colors"
                >
                  <FiSettings size={16} className="text-ink-secondary" />
                  <span>Settings</span>
                </Link>

                <Link
                  to="/teacher/help"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-ink hover:text-primary hover:bg-primary-tint/20 rounded-control transition-colors"
                >
                  <FiHelpCircle size={16} className="text-ink-secondary" />
                  <span>Teacher Help & Support</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    showToast("Switching to parent view...", "info");
                    navigate("/parent/login");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-ink-secondary hover:text-ink hover:bg-surface-subtle rounded-control transition-colors text-left cursor-pointer"
                >
                  <FiRepeat size={16} className="text-ink-secondary" />
                  <span>Switch to Parent View</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="p-1.5 border-t border-line">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-red-600 hover:bg-red-50 rounded-control transition-colors text-left cursor-pointer"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TeacherNavbar;
