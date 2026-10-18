import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiBell, FiUser, FiSettings, FiLogOut, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../api/axiosInstance";

interface StudentNavbarProps {
  onSearch?: (query: string) => void;
}

const StudentNavbar: React.FC<StudentNavbarProps> = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Student details from auth or defaults matching spec
  const studentName = user?.name || "Charu Mehta";
  const studentRoll = "03";
  const studentClass = "8-B";
  const initials = studentName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

  const notifications = [
    { id: 1, title: "New homework: Science Ch. 6", desc: "Questions 1–5 due tomorrow", time: "1h ago", unread: true },
    { id: 2, title: "Library book due in 2 days", desc: '"Wings of Fire" due Thu 15 Oct', time: "3h ago", unread: true },
    { id: 3, title: "Half-yearly date sheet published", desc: "Exams start Mon 16 Nov", time: "1d ago", unread: false },
    { id: 4, title: "Social science homework: redo", desc: '"Label the Godavari again"', time: "2d ago", unread: false },
  ];

  return (
    <header className="bg-surface border-b border-line px-6 lg:px-8 min-h-[64px] box-border flex items-center justify-between gap-4 shrink-0 sticky top-0 z-40">
      {/* Global Student Web Search */}
      <div className="flex-1 max-w-[420px]">
        <div className="relative flex items-center w-full">
          <input
            type="search"
            aria-label="Search my student portal"
            placeholder="Search homework, timetable, library, study material..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full min-h-[40px] px-3.5 pl-9 rounded-control border border-line-input bg-surface-subtle font-sans text-body text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors"
          />
          <FiSearch className="absolute left-3 text-ink-secondary pointer-events-none" size={16} />
        </div>
      </div>

      {/* Right Header Navigation Controls */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Academic Session */}
        <span className="hidden sm:inline-block text-small font-medium text-ink-secondary">
          Session 2026-27
        </span>

        {/* Class Badge */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-tint text-primary text-xs font-semibold border border-primary/20">
          <span>Class {studentClass}</span>
          <span className="font-mono text-ink-secondary">· Roll {studentRoll}</span>
        </span>

        {/* Notifications Bell Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            aria-label="Notifications"
            className="w-10 h-10 rounded-control border border-line bg-surface hover:bg-surface-subtle transition-colors flex items-center justify-center relative cursor-pointer"
          >
            <FiBell size={18} className="text-ink" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold ring-2 ring-surface" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-line rounded-card shadow-lg p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-line-row">
                <span className="text-body font-semibold text-ink">Notifications</span>
                <Link
                  to="/student/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-small font-semibold text-primary hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/student/notifications");
                    }}
                    className={`p-2.5 rounded-control transition-colors cursor-pointer flex gap-2.5 ${
                      item.unread ? "bg-primary-tint/30 hover:bg-primary-tint/50" : "hover:bg-surface-subtle"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.unread ? "bg-primary" : "bg-transparent"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-small font-semibold text-ink truncate">{item.title}</div>
                      <div className="text-caption text-ink-secondary line-clamp-1">{item.desc}</div>
                      <div className="text-micro text-ink-muted mt-0.5">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student Avatar Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-control hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-primary-tint text-primary font-semibold text-small flex items-center justify-center border border-primary/20">
              {initials}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-small font-semibold text-ink leading-tight truncate max-w-[120px]">
                {studentName}
              </span>
              <span className="text-micro text-ink-secondary leading-tight">
                Class {studentClass}
              </span>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-line rounded-card shadow-lg p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-line-row mb-1">
                <p className="m-0 text-small font-semibold text-ink truncate">{studentName}</p>
                <p className="m-0 text-micro text-ink-secondary">Roll: {studentRoll} · Aravali House</p>
              </div>

              <Link
                to="/student/profile"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-small text-ink hover:bg-surface-subtle rounded-control transition-colors"
              >
                <FiUser size={15} className="text-ink-secondary" /> My Profile
              </Link>

              <Link
                to="/student/results"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-small text-ink hover:bg-surface-subtle rounded-control transition-colors"
              >
                <FiCheckCircle size={15} className="text-ink-secondary" /> Report Card
              </Link>

              <div className="my-1 border-t border-line-row" />

              <button
                onClick={() => {
                  setShowProfile(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-small text-rose-600 hover:bg-rose-50 rounded-control transition-colors cursor-pointer"
              >
                <FiLogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;
