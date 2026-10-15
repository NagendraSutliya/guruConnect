import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import { Bell, Search, Menu, LogOut, User, Settings, CheckCircle2, ShieldAlert } from "lucide-react";
import NotificationsPanel from "./NotificationsPanel";

interface AdminNavbarProps {
  onOpenSearch?: () => void;
  onToggleSidebar?: () => void;
  adminData?: any;
}

const AdminNavbar = ({ onOpenSearch, onToggleSidebar, adminData: propAdminData }: AdminNavbarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(4); // Mock count for UI

  const currentAdminData = propAdminData || (() => {
    try {
      const saved = localStorage.getItem("admin");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })();

  const adminName = currentAdminData?.ownerName || currentAdminData?.name || user?.name || "School Admin";
  const adminInitials = adminName.split(" ").filter(Boolean).map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "SA";
  const adminEmail = currentAdminData?.email || user?.email || "admin@guruconnect.com";
  const instituteName = currentAdminData?.instituteName || "GuruConnect Institute";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    navigate("/auth/login");
  };

  return (
    <header className="w-full min-h-[64px] bg-white border-b border-line flex flex-wrap items-center gap-3 px-4 md:px-8 py-2.5 font-sans text-ink z-20 relative">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={onToggleSidebar}
        className="md:hidden p-2 -ml-2 text-ink-secondary hover:text-ink hover:bg-surface rounded-md transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Global Search */}
      <label className="w-full max-w-[500px] flex items-center gap-2 min-h-[42px] px-3 border border-line-input rounded-control bg-surface hover:bg-surface-hover focus-within:bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        <Search size={16} className="text-ink-secondary shrink-0" />
        <input 
          type="search" 
          placeholder="Search student, admission no. or parent mobile..." 
          className="flex-1 w-full min-w-0 bg-transparent border-0 text-[14px] text-ink outline-none placeholder:text-ink-secondary/70"
          onFocus={onOpenSearch}
        />
        <div className="hidden sm:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-ink-secondary bg-line/50 border border-line-input rounded">Ctrl</kbd>
          <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-ink-secondary bg-line/50 border border-line-input rounded">K</kbd>
        </div>
      </label>

      <div className="flex-1 min-w-0"></div>

      {/* Academic Session Selector */}
      <label className="hidden sm:flex items-center gap-2 text-[13px] text-ink-secondary font-medium">
        Session
        <select className="min-h-[40px] pl-3 pr-8 py-0 border border-line-input rounded-control bg-white font-sans text-[14px] font-medium text-ink focus:outline-none focus:border-primary cursor-pointer hover:bg-surface transition-colors appearance-none" style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234F5B57%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}>
          <option>2026-27 (current)</option>
          <option>2025-26 (closed)</option>
        </select>
      </label>

      {/* Notifications */}
      <div>
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className={`relative w-11 h-11 rounded-control border flex items-center justify-center transition-colors cursor-pointer ${
            showNotifications ? "bg-surface border-line-input text-primary" : "bg-white border-line text-ink hover:bg-surface"
          }`}
          aria-label="Notifications"
        >
          <Bell size={20} className={showNotifications ? "fill-primary/10" : ""} />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gold border border-white"></span>
          )}
        </button>

        <NotificationsPanel 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />
      </div>

      {/* Profile */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-surface transition-colors cursor-pointer border border-transparent"
        >
          <div className="w-9 h-9 rounded-full border border-line-input bg-primary-dark/10 text-primary-dark flex items-center justify-center font-bold text-[14px] shadow-sm">
            {adminInitials}
          </div>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-[13.5px] font-bold text-ink leading-tight truncate max-w-[130px]" title={adminName}>
              {adminName}
            </span>
            <span className="text-[11px] text-ink-secondary font-medium leading-tight">School Admin</span>
          </div>
        </button>

        {showProfileDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-card shadow-lg border border-line overflow-hidden animate-fadeIn origin-top-right z-50">
            <div className="p-4 border-b border-line bg-surface/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-line-input bg-primary-dark/10 text-primary-dark flex items-center justify-center font-bold text-[14px] shrink-0">
                  {adminInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-ink leading-tight truncate" title={adminName}>{adminName}</p>
                  <p className="text-[11.5px] text-ink-secondary font-normal truncate mt-0.5" title={adminEmail}>{adminEmail}</p>
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-tint text-primary-dark border border-primary-soft/40">
                      School Admin
                    </span>
                    <span className="text-[11px] text-ink-secondary truncate max-w-[110px]" title={instituteName}>
                      · {instituteName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-1.5">
              <Link to="/admin/profile" className="flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-ink hover:text-primary hover:bg-primary-light/10 rounded-md transition-colors" onClick={() => setShowProfileDropdown(false)}>
                <User size={16} /> My Profile
              </Link>
              <Link to="/admin/settings/institute" className="flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-ink hover:text-primary hover:bg-primary-light/10 rounded-md transition-colors" onClick={() => setShowProfileDropdown(false)}>
                <Settings size={16} /> School Settings
              </Link>
            </div>
            
            <div className="p-1.5 border-t border-line">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-[14px] font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors text-left cursor-pointer"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>

    </header>
  );
};

export default AdminNavbar;
