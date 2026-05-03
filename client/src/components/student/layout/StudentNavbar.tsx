import {  FiBell, FiUser, FiHelpCircle, FiSettings, FiLogOut, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const StudentNavbar = () => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  const handleNav = (path: string) => {
    navigate(path);
    setShowProfile(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
      
      {/* Left: Identity */}
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">
               Student Portal
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               {institute?.instituteName || "Nexus Institute"}
            </span>
         </div>
      </div>

      {/* Right: Operations */}
      <div className="flex items-center gap-4">
        
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative">
           <FiMessageCircle size={18} />
           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white" />
        </button>

        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
           <FiBell size={18} />
        </button>

        <div className="w-px h-8 bg-slate-200 mx-1" />

        <div className="relative" ref={profileRef}>
           <button 
             onClick={() => setShowProfile(!showProfile)}
             className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-all"
           >
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold text-slate-800 leading-none">{user?.name || "Student User"}</p>
                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Grade {user?.grade || "Primary"}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm overflow-hidden">
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
                  onClick={() => handleNav("/student/profile")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                >
                   <FiUser size={14} /> My Profile
                </button>
                <button 
                  onClick={() => handleNav("/student/settings")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                >
                   <FiSettings size={14} /> Portal Settings
                </button>
                <button 
                  onClick={() => handleNav("/student/help")}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                >
                   <FiHelpCircle size={14} /> Student Help
                </button>
                <div className="h-px bg-slate-50 my-2" />
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all"
                >
                   <FiLogOut size={14} /> Terminate Session
                </button>
             </div>
           )}
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;
