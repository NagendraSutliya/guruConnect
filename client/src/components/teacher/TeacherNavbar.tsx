import { FiSearch, FiBell, FiUser, FiHelpCircle, FiSettings, FiLogOut, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useState, useEffect, useRef } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const TeacherNavbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [institute, setInstitute] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.instituteId) {
      api.get(`/public/institute/${user.instituteId}`).then(res => setInstitute(res.data.data)).catch(console.error);
    }
  }, [user]);

  // Handle click outside and ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfile(false);
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) setShowMessages(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setShowNotifications(false);
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowProfile(false);
        setShowMessages(false);
        setShowNotifications(false);
      }
    };

    if (showProfile || showMessages || showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showProfile, showMessages, showNotifications]);

  const handleNav = (path: string) => {
    navigate(path);
    setShowProfile(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
      
      {/* Left: Section Indicator */}
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">
               Teacher Portal
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-xs font-medium text-slate-400">
               {institute?.instituteName || "Gyansthali"}
            </span>
         </div>
      </div>

      {/* Center: Global Search (Compact) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
         <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
               type="text" 
               placeholder="Search registry, students, or documents..." 
               className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)]/30 transition-all outline-none"
            />
         </div>
      </div>

      {/* Right: User Operations */}
      <div className="flex items-center gap-4">
        
        <div className="relative" ref={messagesRef}>
          <button 
             onClick={() => { setShowMessages(!showMessages); setShowProfile(false); setShowNotifications(false); }}
             className={`p-2 rounded-lg transition-all relative ${showMessages ? 'text-[var(--primary)] bg-sky-50' : 'text-slate-400 hover:text-[var(--primary)] hover:bg-slate-50'}`}
          >
             <FiMessageCircle size={18} />
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-white" />
          </button>
          
          {showMessages && (
             <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Messages</h3>
                   <span className="text-[10px] font-bold text-[var(--primary)] bg-sky-100 px-2 py-0.5 rounded-full">1 New</span>
                </div>
                <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                   <div className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-xs font-bold text-slate-800 group-hover:text-[var(--primary)] transition-colors">Admin Office</span>
                         <span className="text-[10px] font-medium text-slate-400">10m ago</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">Please ensure all examination results for the current semester are uploaded by Friday.</p>
                   </div>
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50">
                   <button onClick={() => { setShowMessages(false); showToast("Opening messages...", "info"); }} className="w-full py-1.5 text-xs font-bold text-[var(--primary)] hover:bg-sky-100 rounded-lg transition-colors">
                      View All Messages
                   </button>
                </div>
             </div>
          )}
        </div>

        <div className="relative" ref={notificationsRef}>
          <button 
             onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowMessages(false); }}
             className={`p-2 rounded-lg transition-all ${showNotifications ? 'text-[var(--primary)] bg-sky-50' : 'text-slate-400 hover:text-[var(--primary)] hover:bg-slate-50'}`}
          >
             <FiBell size={18} />
          </button>
          
          {showNotifications && (
             <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
                   <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3 border border-slate-100">
                      <FiBell size={20} />
                   </div>
                   <p className="text-xs font-bold text-slate-600">You're all caught up!</p>
                   <p className="text-[10px] text-slate-400 mt-1">No new alerts at this time.</p>
                </div>
             </div>
          )}
        </div>

        <div className="w-px h-8 bg-slate-200 mx-1" />

        <div className="relative" ref={profileRef}>
           <button 
             onClick={() => { setShowProfile(!showProfile); setShowMessages(false); setShowNotifications(false); }}
             className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-all"
           >
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || "Faculty Member"}</p>
                 <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{user?.role || "Teacher"}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm overflow-hidden">
                 {user?.profileImage ? (
                   <img src={user.profileImage} alt="User" className="w-full h-full object-cover" />
                 ) : (
                   <FiUser size={16} />
                 )}
              </div>
           </button>

           {showProfile && (
             <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 pb-2 animate-fade-in">
                <div className="px-4 py-3 mb-2 bg-gradient-to-r from-sky-600 to-sky-400 border-b border-slate-50 rounded-t-xl flex items-center gap-3">
                   {user?.profileImage && (
                     <img src={user.profileImage} alt="Me" className="w-10 h-10 rounded-lg border-2 border-white/20 object-cover shadow-sm" />
                   )}
                   <div className="min-w-0">
                      <p className="text-[11px] font-black text-white uppercase tracking-widest truncate leading-tight">{user?.name}</p>
                      <p className="text-[10px] font-medium text-sky-50 truncate opacity-80 mt-0.5">{user?.email}</p>
                   </div>
                </div>
                <button 
                  onClick={() => handleNav("/teacher/profile")}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 hover:text-[var(--primary)] transition-all"
                >
                   <FiUser size={14} /> Profile Settings
                </button>
                <button 
                  onClick={() => handleNav("/teacher/settings")}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 hover:text-[var(--primary)] transition-all"
                >
                   <FiSettings size={14} /> Node Configuration
                </button>
                <button 
                  onClick={() => handleNav("/teacher/help")}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 hover:text-[var(--primary)] transition-all"
                >
                   <FiHelpCircle size={14} /> Faculty Support
                </button>
                <div className="h-px bg-slate-50 my-2" />
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all"
                >
                   <FiLogOut size={14} /> Logout
                </button>
             </div>
           )}
        </div>
      </div>
    </header>
  );
};

export default TeacherNavbar;
