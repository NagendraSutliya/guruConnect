import { useEffect, useRef, useState } from "react";
import {
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaUserShield,
  FaCheckDouble,
  FaTrashAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: Date;
  isRead: boolean;
  type: "info" | "warning" | "success";
}

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const [adminEmail, setAdminEmail] = useState(() => {
    if (user?.email && user.email !== "admin@guruconnect.com") return user.email;
    const saved = localStorage.getItem("admin");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.email && parsed.email !== "admin@guruconnect.com") return parsed.email;
    }
    return "";
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  const fetchRealNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const [feedbackRes, teachersRes] = await Promise.all([
        api.get("/admin/feedback"),
        api.get("/admin/teachers"),
      ]);

      const feedbackData = feedbackRes.data.data || [];
      const teachersData = teachersRes.data.data || [];

      const formattedNotifications: Notification[] = [
        ...feedbackData.map((f: any) => ({
          id: f._id,
          title: "New Feedback",
          message: `Feedback from ${f.studentName || f.studentId?.name || "Student"} for ${f.teacherName || f.teacherId?.name || "Teacher"}: "${f.message.substring(0, 40)}..."`,
          time: formatTime(f.createdAt),
          timestamp: new Date(f.createdAt),
          isRead: true, // Assuming old ones are read for now, or you could track this
          type: "info" as const,
        })),
        ...teachersData.map((t: any) => ({
          id: t._id,
          title: "New Teacher Joined",
          message: `${t.name} has registered as a new faculty member.`,
          time: formatTime(t.createdAt),
          timestamp: new Date(t.createdAt),
          isRead: true,
          type: "success" as const,
        })),
      ];

      // Sort by newest first
      formattedNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Only show last 10
      setNotifications(formattedNotifications.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) return `${diffInMins} mins ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${diffInDays} days ago`;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const goToProfile = () => {
    setShowProfileDropdown(false);
    navigate("/admin/profile");
  };

  const goToSettings = () => {
    setShowProfileDropdown(false);
    navigate("/admin/settings");
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  useEffect(() => {
    fetchRealNotifications();

    // Fetch profile for email and logo
    api.get("/admin/profile")
      .then(res => {
        const data = res.data.data;
        if (data) {
          if (data.email) setAdminEmail(data.email);
          if (data.logoUrl) setLogoUrl(data.logoUrl);
          
          // Update local storage for persistence across components
          const saved = localStorage.getItem("admin");
          const currentUser = saved ? JSON.parse(saved) : {};
          localStorage.setItem("admin", JSON.stringify({ 
            ...currentUser, 
            email: data.email,
            logoUrl: data.logoUrl 
          }));
        }
      })
      .catch(err => console.error("Profile fetch error:", err));

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm px-6 py-2">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img
          src="/guruconnect-logo.png"
          alt="GuruConnect Logo"
          className="w-14 h-14 object-contain"
        />
        <div className="hidden sm:block">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800 leading-tight">
            Guru<span className="text-indigo-600">Connect</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
            {user?.instituteName || "Admin Portal"}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-3 bg-indigo-50/50 px-4 py-1.5 rounded-full border border-indigo-100/50">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <FaUserShield className="text-white" size={16} />
        </div>
        <h1 className="text-sm font-bold text-slate-700">
          Admin <span className="text-indigo-500 font-medium ml-1">Portal</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className={`relative p-2 rounded-xl transition-all duration-300 ${
              showNotifications
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <FaBell size={20} className={unreadCount > 0 ? "animate-wiggle" : ""} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-dropdown origin-top-right">
              <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  Recent Activity
                  <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Mark all as read"
                  >
                    <FaCheckDouble size={14} />
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Clear all"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {loadingNotifications ? (
                  <div className="p-8 text-center flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Syncing live data...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${
                        !n.isRead ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            n.type === "success"
                              ? "bg-emerald-100 text-emerald-700"
                              : n.type === "warning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {n.message}
                      </p>
                      {!n.isRead && (
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaBell className="text-slate-300" size={24} />
                    </div>
                    <p className="text-slate-400 text-sm">No activity recorded yet</p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 bg-slate-50/50 text-center border-t border-slate-50">
                  <button 
                    onClick={() => navigate("/admin/dashboard")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    View detailed activity
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            className={`flex items-center gap-3 p-1 pr-3 rounded-full transition-all duration-300 border ${
              showProfileDropdown
                ? "bg-white border-indigo-200 shadow-md"
                : "bg-slate-50 border-transparent hover:border-slate-200"
            }`}
          >
            <div className="relative">
              {logoUrl ? (
                <img src={logoUrl} alt="admin" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
              ) : (
                <FaUserCircle className="text-3xl text-slate-400" />
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.instituteName || "Admin"}
              </p>
              <p className="text-[10px] font-medium text-slate-500">Super Admin</p>
            </div>
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-dropdown origin-top-right">
              <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center gap-3">
                {logoUrl && (
                  <img src={logoUrl} alt="admin" className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-sm" />
                )}
                <div>
                  <p className="font-bold text-sm">{user?.instituteName || "Admin User"}</p>
                  <p className="text-[10px] opacity-80 font-medium truncate">{adminEmail || user?.email || "admin@guruconnect.com"}</p>
                </div>
              </div>
              
              <div className="p-2">
                <button
                  onClick={goToProfile}
                  className="flex items-center w-full gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-medium text-sm"
                >
                  <FaUserCircle size={16} />
                  My Profile
                </button>

                <button
                  onClick={goToSettings}
                  className="flex items-center w-full gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all font-medium text-sm"
                >
                  <FaCog size={16} />
                  Account Settings
                </button>
                
                <div className="h-px bg-slate-100 my-2 mx-2" />

                <button
                  onClick={logout}
                  className="flex items-center w-full gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm"
                >
                  <FaSignOutAlt size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default AdminNavbar;
