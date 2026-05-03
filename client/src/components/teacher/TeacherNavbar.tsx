import { FiSearch, FiBell, FiUser, FiHelpCircle, FiSettings, FiLogOut, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const TeacherNavbar = () => {
  const { user, logout } = useAuth();
  const [institute, setInstitute] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.instituteId) {
      api.get(`/public/institute/${user.instituteId}`).then(res => setInstitute(res.data.data)).catch(console.error);
    }
  }, [user]);

  // Handle click outside and ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showProfile]);

  const handleNav = (path: string) => {
    navigate(path);
    setShowProfile(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
      
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
        
        <button className="p-2 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-50 rounded-lg transition-all relative">
           <FiMessageCircle size={18} />
           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-white" />
        </button>

        <button className="p-2 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-50 rounded-lg transition-all">
           <FiBell size={18} />
        </button>

        <div className="w-px h-8 bg-slate-200 mx-1" />

        <div className="relative" ref={profileRef}>
           <button 
             onClick={() => setShowProfile(!showProfile)}
             className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-all"
           >
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || "Faculty Member"}</p>
                 <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{user?.role || "Teacher"}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm overflow-hidden">
                 {user?.avatar ? <img src={user.avatar} alt="User" /> : <FiUser size={16} />}
              </div>
           </button>

           {showProfile && (
             <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-fade-in">
                <div className="px-4 py-2 mb-2 border-b border-slate-50">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Authenticated Account</p>
                   <p className="text-xs font-bold text-slate-800 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={() => handleNav("/teacher/profile")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[var(--primary)] transition-all"
                >
                   <FiUser size={14} /> Profile Settings
                </button>
                <button 
                  onClick={() => handleNav("/teacher/settings")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[var(--primary)] transition-all"
                >
                   <FiSettings size={14} /> Node Configuration
                </button>
                <button 
                  onClick={() => handleNav("/teacher/help")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[var(--primary)] transition-all"
                >
                   <FiHelpCircle size={14} /> Faculty Support
                </button>
                <div className="h-px bg-slate-50 my-2" />
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all"
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
