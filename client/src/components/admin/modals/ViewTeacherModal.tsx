import React from "react";
import { FiX, FiMail, FiCalendar, FiBriefcase, FiBook, FiInfo, FiPhone } from "react-icons/fi";
import type { Teacher } from "../../../types/admin/teacher";

interface Props {
  teacher: Teacher;
  onClose: () => void;
}

const ViewTeacherModal: React.FC<Props> = ({ teacher, onClose }) => {
  if (!teacher) return null;

  const initials = teacher.name?.substring(0, 2).toUpperCase() || "??";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl h-[90vh] bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl animate-fadeIn scale-100 border border-white/60 flex flex-col overflow-hidden">
        
        {/* Fixed Header Area */}
        <div className="shrink-0 relative">
          {/* Top Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-md transition-all z-10"
            >
              <FiX size={22} />
            </button>
          </div>

          {/* Profile Summary Overlay */}
          <div className="px-8 pb-4">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 relative z-0">
              <div className="p-1 bg-white rounded-full shadow-lg">
                {teacher.profileImage ? (
                  <img
                    src={teacher.profileImage}
                    alt={teacher.name}
                    className="w-32 h-32 rounded-full object-cover border-2 border-slate-50"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-inner border-4 border-slate-50">
                    {initials}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left pb-2">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{teacher.name || "Unnamed Teacher"}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    ID: {teacher.employeeId || teacher._id?.slice(-6).toUpperCase() || "N/A"}
                  </span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    {teacher.designation || "Faculty"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      teacher.status === "active"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}
                  >
                    {teacher.status === "active" ? "Active Faculty" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle separator */}
          <div className="mx-8 h-px bg-slate-100"></div>
        </div>

        {/* Scrollable Details Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          {/* Details Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Professional & Financial */}
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Professional Profile</h3>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/50 flex items-center justify-center text-purple-600 shrink-0">
                    <FiBriefcase size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Qualification</p>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{teacher.qualification || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100/50 flex items-center justify-center text-indigo-600 shrink-0">
                    <FiBook size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Specializations</p>
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {(teacher.specialization?.length ?? 0) > 0 ? teacher.specialization?.join(", ") : "General Faculty"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-600 shrink-0">
                    <FiCalendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Joining</p>
                    <p className="text-sm font-bold text-slate-800">
                      {teacher.joiningDate
                        ? new Date(teacher.joiningDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' })
                        : "Not recorded"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest border-b border-amber-200/40 pb-2">Financial Records</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Bank Account</p>
                    <p className="text-xs font-bold text-slate-800">{teacher.bankAccountNo || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase">IFSC Code</p>
                    <p className="text-xs font-bold text-slate-800">{teacher.ifscCode || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">PAN Card</p>
                    <p className="text-xs font-bold text-slate-800">{teacher.panNo || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Basic Salary</p>
                    <p className="text-sm font-black text-emerald-600">₹{teacher.basicSalary?.toLocaleString() || "0"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Bio */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Contact Channels</h3>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Email</p>
                    <p className="text-sm font-bold text-slate-800">{teacher.email || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FiPhone size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                    <p className="text-sm font-bold text-slate-800">{teacher.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <FiPhone size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</p>
                    <p className="text-sm font-bold text-slate-800">{teacher.emergencyPhone || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Faculty Biography</h3>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-600 shrink-0">
                    <FiInfo size={18} />
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                    {teacher.bio ? `"${teacher.bio}"` : "No biography provided for this faculty member."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer Area */}
        <div className="shrink-0 p-6 bg-slate-50 border-t border-slate-200 flex justify-center">
          <button
            onClick={onClose}
            className="px-12 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 active:scale-95"
          >
            Close Faculty Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacherModal;
