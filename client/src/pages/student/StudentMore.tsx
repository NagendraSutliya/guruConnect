import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { 
  FiChevronRight, 
  FiLogOut, 
  FiUser, 
  FiCalendar, 
  FiBell, 
  FiBook, 
  FiFileText, 
  FiGlobe, 
  FiLock 
} from "react-icons/fi";

const StudentMore: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [language, setLanguage] = useState<"English" | "हिन्दी">("English");
  const [appPinActive, setAppPinActive] = useState(true);

  const studentName = user?.name || "Charu Mehta";
  const initials = studentName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const toggleLanguage = () => {
    const next = language === "English" ? "हिन्दी" : "English";
    setLanguage(next);
    showToast(`App language set to ${next}`, "info");
  };

  const togglePin = () => {
    setAppPinActive(!appPinActive);
    showToast(`App PIN lock ${!appPinActive ? "enabled" : "disabled"}`, "info");
  };

  return (
    <div className="p-3.5 flex flex-col gap-3 font-sans text-[#17201D] animate-fadeIn">
      {/* Student Profile Identity Card */}
      <div className="bg-white border border-[#DDE2DE] rounded-[14px] p-3.5 flex gap-3 items-center shadow-2xs">
        <div className="w-14 h-14 rounded-[14px] bg-[#E3EFEF] text-[#08393F] font-semibold text-[17px] flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[17px] font-semibold text-[#17201D] tracking-tight truncate">
            {studentName}
          </span>
          <span className="text-[12.5px] text-[#4F5B57] leading-snug">
            8-B · Roll 03 · House Aravali · CT Sunita Rathore
          </span>
        </div>
      </div>

      {/* Navigation List Links */}
      <div className="bg-white border border-[#DDE2DE] rounded-[14px] overflow-hidden shadow-2xs">
        {/* Attendance */}
        <Link
          to="/student/attendance"
          className="flex justify-between items-center min-h-[52px] px-3.5 border-b border-[#EEF1EF] text-[#17201D] hover:bg-[#F9FAF8] transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-[15px] font-medium">Attendance</span>
            <span className="text-[12px] text-[#4F5B57]">98% this year</span>
          </div>
          <span className="text-[#9AA8A3] text-[18px]">›</span>
        </Link>

        {/* Notices */}
        <Link
          to="/student/notices"
          className="flex justify-between items-center min-h-[52px] px-3.5 border-b border-[#EEF1EF] text-[#17201D] hover:bg-[#F9FAF8] transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-[15px] font-medium">Notices</span>
            <span className="text-[12px] text-[#4F5B57]">1 new</span>
          </div>
          <span className="text-[#9AA8A3] text-[18px]">›</span>
        </Link>

        {/* Library */}
        <Link
          to="/student/library"
          className="flex justify-between items-center min-h-[52px] px-3.5 border-b border-[#EEF1EF] text-[#17201D] hover:bg-[#F9FAF8] transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-[15px] font-medium">Library</span>
            <span className="text-[12px] text-[#4F5B57]">1 book due Thu</span>
          </div>
          <span className="text-[#9AA8A3] text-[18px]">›</span>
        </Link>

        {/* Study Material */}
        <Link
          to="/student/material"
          className="flex justify-between items-center min-h-[52px] px-3.5 border-b border-[#EEF1EF] text-[#17201D] hover:bg-[#F9FAF8] transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-[15px] font-medium">Study material</span>
            <span className="text-[12px] text-[#4F5B57]">12 files</span>
          </div>
          <span className="text-[#9AA8A3] text-[18px]">›</span>
        </Link>

        {/* Language Toggle */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="w-full flex justify-between items-center min-h-[52px] px-3.5 border-b border-[#EEF1EF] text-left text-[#17201D] hover:bg-[#F9FAF8] transition-colors cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-[15px] font-medium">Language</span>
            <span className="text-[12px] text-[#4F5B57]">{language}</span>
          </div>
          <span className="text-[#9AA8A3] text-[18px]">›</span>
        </button>

        {/* Notifications Setting */}
        <Link
          to="/student/notifications"
          className="flex justify-between items-center min-h-[52px] px-3.5 border-b border-[#EEF1EF] text-[#17201D] hover:bg-[#F9FAF8] transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-[15px] font-medium">Notifications</span>
            <span className="text-[12px] text-[#4F5B57]">All on</span>
          </div>
          <span className="text-[#9AA8A3] text-[18px]">›</span>
        </Link>

        {/* App PIN Lock */}
        <button
          type="button"
          onClick={togglePin}
          className="w-full flex justify-between items-center min-h-[52px] px-3.5 text-left text-[#17201D] hover:bg-[#F9FAF8] transition-colors cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-[15px] font-medium">App PIN</span>
            <span className="text-[12px] text-[#4F5B57]">{appPinActive ? "On" : "Off"}</span>
          </div>
          <span className="text-[#9AA8A3] text-[18px]">›</span>
        </button>
      </div>

      {/* Safety Notice for Minors */}
      <p className="text-[12px] text-[#4F5B57] text-center px-4 leading-relaxed m-0">
        Profile details can only be changed by your parents through the school.
      </p>

      {/* Sign Out Action Button */}
      <button
        type="button"
        onClick={logout}
        className="min-h-[46px] rounded-[12px] border border-[#C9D1CD] bg-white hover:bg-rose-50/50 font-semibold text-[14px] text-[#A3261B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
      >
        <FiLogOut size={16} /> Sign out
      </button>
    </div>
  );
};

export default StudentMore;
