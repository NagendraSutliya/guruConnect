import {  FiBell, FiUser, FiHelpCircle, FiSettings, FiLogOut, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const [institute, setInstitute] = useState<any>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch student profile (contains instituteId)
        const studentRes = await api.get("/student/dashboard");
        const studentData = studentRes.data.data;
        setStudentDetails(studentData);

        // 2. Fetch institute details using ID from profile or user context
        const instId = studentData?.instituteId || user?.instituteId;
        if (instId) {
          const instRes = await api.get(`/public/institute/${instId}`);
          setInstitute(instRes.data.data);
        }
      } catch (err) {
        console.error("Navbar data fetch error:", err);
      }
    };
    fetchData();
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
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-[60]">
      
      {/* Left: Identity */}
      <div className="flex items-center gap-4">
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 font-black text-xs overflow-hidden">
               {institute?.instituteName 
                 ? institute.instituteName.split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2)
                 : ""}
            </div>
            <div className="flex flex-col">
               <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] leading-tight">
                  Student Portal
               </span>
               <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">
                  {institute?.instituteName || ""}
               </span>
            </div>
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
             className="flex items-center gap-3 p-1 pr-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 shadow-sm"
           >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 overflow-hidden">
                 {studentDetails?.avatar ? <img src={studentDetails?.avatar} alt="User" /> : <span className="text-[10px] font-black uppercase">{studentDetails?.name?.charAt(0) || 'S'}</span>}
              </div>
              <div className="text-left hidden sm:block">
                 <p className="text-[11px] font-black text-slate-800 leading-none">{studentDetails?.name || user?.name || "Student User"}</p>
                 <p className="text-[9px] font-black text-indigo-500 mt-1 uppercase tracking-wider">
                   {studentDetails?.classId?.name ? `Class ${studentDetails.classId.name}` : "Portal Node"} 
                   {studentDetails?.sectionId?.name ? ` | Section ${studentDetails.sectionId.name}` : ""}
                 </p>
              </div>
           </button>

           {showProfile && (
             <div className="absolute right-0 w-56 bg-white border border-slate-200 rounded-lg shadow-2xl z-[70] animate-slideDown overflow-hidden">
                <div className="px-4 py-2 bg-gradient-to-l from-rose-100 to-green-200 border-b border-slate-100">
                   <p className="text-xs font-black text-slate-800 truncate">{studentDetails?.name || user?.name}</p>
                   <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{studentDetails?.email || user?.email}</p>
                </div>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => handleNav("/student/profile")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group"
                  >
                     <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FiUser size={14} />
                     </div>
                     My Profile
                  </button>
                  <button 
                    onClick={() => handleNav("/student/settings")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group"
                  >
                     <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FiSettings size={14} />
                     </div>
                     Security Settings
                  </button>
                  <button 
                    onClick={() => handleNav("/student/help")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group"
                  >
                     <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FiHelpCircle size={14} />
                     </div>
                     Support Hub
                  </button>
                </div>

                <div className="h-px bg-slate-200" />
                
                <div className="pb-2">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-black text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
                  >
                     <div className="w-7 h-7 rounded-lg bg-rose-100/50 flex items-center justify-center text-rose-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FiLogOut size={14} />
                     </div>
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

export default StudentNavbar;
