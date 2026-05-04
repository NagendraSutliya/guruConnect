import React from "react";
import { FiX, FiMail, FiLayers, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
interface Props {
  student: any;
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
      <div className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl animate-fadeIn scale-100 border border-white/60">
          
          {/* Top Header/Banner */}
          <div className="h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-md transition-all"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Profile Info Overlay */}
          <div className="px-8 pb-8 relative">
            {/* Avatar floating over banner */}
            <div className="flex flex-col items-center -mt-12 mb-4">
              <div className="p-1.5 bg-white rounded-full shadow-lg">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-black shadow-inner border-4 border-slate-50">
                  {initials}
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-800 mt-3 tracking-tight">{student.name || "Unnamed Student"}</h2>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">Roll No: {student.rollNo || "N/A"}</p>
              
              <div className="mt-3">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    student.isActive
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {student.isActive ? "Active Enrollment" : "Inactive / Left"}
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4 max-h-[40vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 gap-4">
                {/* Academic Info */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/50 flex items-center justify-center text-purple-600 shrink-0">
                    <FiLayers size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class & Section</p>
                    <p className="text-sm font-bold text-slate-800">
                      {student.classId?.name || "N/A"} - {student.sectionId?.name || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600 shrink-0">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-bold text-slate-800">{student.email || "Not provided"}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0">
                    <FiPhone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-sm font-bold text-slate-800">{student.phone || "Not provided"}</p>
                  </div>
                </div>

                {/* Parent Info */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/50 flex items-center justify-center text-amber-600 shrink-0">
                    <FiUser size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent / Guardian</p>
                    <p className="text-sm font-bold text-slate-800">{student.parentName || "Not provided"}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</p>
                    <p className="text-xs font-bold text-slate-700">
                      {student.dob ? new Date(student.dob).toLocaleDateString("en-GB") : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Admission Date</p>
                    <p className="text-xs font-bold text-slate-700">
                      {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString("en-GB") : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                {student.address && (
                  <div className="flex items-start gap-4 pt-2 border-t border-slate-200/60">
                    <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-600 shrink-0">
                      <FiMapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Address</p>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed mt-1">
                        {student.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ViewStudentModal;
