import React from "react";
import { FiX, FiMail, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import type { Student } from "../../../types/admin/student";

interface Props {
  student: Student;
  onClose: () => void;
}

const ViewStudentModal: React.FC<Props> = ({ student, onClose }) => {
  if (!student) return null;

  const initials = student.name?.substring(0, 2).toUpperCase() || "??";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl h-[90vh] bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl animate-fadeIn scale-100 border border-white/60 flex flex-col overflow-hidden">
          
          {/* Fixed Header Area */}
          <div className="shrink-0 relative">
            {/* Top Banner */}
            <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-md transition-all z-10"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Profile Summary Overlay (Still fixed) */}
            <div className="px-8 pb-4">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 relative z-0">
                <div className="p-1.5 bg-white rounded-full shadow-lg">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-4xl font-black shadow-inner border-4 border-slate-50">
                    {initials}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left pb-2">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{student.name || "Unnamed Student"}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                      Roll: {student.rollNo || "N/A"}
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-100">
                      {student.classId?.name || "N/A"} - {student.sectionId?.name || "N/A"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        student.isActive
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
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
            {/* Structured Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Personal & Identification */}
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Personal & Identification</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</p>
                      <p className="text-sm font-bold text-slate-800">
                        {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gender</p>
                      <p className="text-sm font-bold text-slate-800">{student.gender || "N/A"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Admission No</p>
                      <p className="text-sm font-bold text-indigo-600">{student.admissionNo || "N/A"}</p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment No</p>
                      <p className="text-sm font-bold text-purple-600">{student.enrollmentNo || "N/A"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aadhar No</p>
                      <p className="text-sm font-bold text-slate-800">{student.aadharNo || "N/A"}</p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Blood Group</p>
                      <p className="text-sm font-bold text-rose-600">{student.bloodGroup || "N/A"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Category</p>
                      <p className="text-[11px] font-bold text-slate-700">{student.category || "N/A"}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Religion</p>
                      <p className="text-[11px] font-bold text-slate-700">{student.religion || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Nationality</p>
                      <p className="text-[11px] font-bold text-slate-700">{student.nationality || "Indian"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Academic History</h3>
                   <div className="space-y-3">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Previous Institution</p>
                        <p className="text-sm font-bold text-slate-800">{student.previousSchool || "Fresh Candidate"}</p>
                      </div>
                      <div className="flex justify-between items-center">
                         <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Class</p>
                            <p className="text-sm font-bold text-slate-800">{student.previousClass || "N/A"}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Admission Date</p>
                            <p className="text-sm font-bold text-slate-800">
                              {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : "N/A"}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Right Column: Contact & Parental Info */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Contact Details</h3>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <FiMail size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-bold text-slate-800">{student.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <FiPhone size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Contact</p>
                      <p className="text-sm font-bold text-slate-800">{student.phone || "N/A"}</p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <FiUser size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Parent / Guardian Name</p>
                        <p className="text-sm font-bold text-slate-800">{student.parentName || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-14">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Parent Contact</p>
                        <p className="text-sm font-bold text-slate-800">{student.parentPhone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Residential Address</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-600 shrink-0">
                      <FiMapPin size={18} />
                    </div>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {student.address || "No address recorded in system."}
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
              Close Student Profile
            </button>
          </div>
        </div>
      </div>
  );
};

export default ViewStudentModal;
