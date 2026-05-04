import React from "react";
import { FiX, FiMail, FiCalendar, FiBriefcase, FiBook, FiInfo } from "react-icons/fi";

interface Props {
  teacher: any;
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
      <div className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl animate-fadeIn scale-100">
        
        {/* Top Header/Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-md transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-8 pb-8 relative">
          {/* Avatar floating over banner */}
          <div className="flex flex-col items-center -mt-16 mb-4">
            <div className="p-1.5 bg-white rounded-full shadow-lg">
              {teacher.profilePic ? (
                <img
                  src={teacher.profilePic}
                  alt={teacher.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-50"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-inner border-4 border-slate-50">
                  {initials}
                </div>
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-800 mt-3 tracking-tight">{teacher.name || "Unnamed Teacher"}</h2>
            <div className="mt-2">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                  teacher.status === "active"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-rose-100 text-rose-700 border border-rose-200"
                }`}
              >
                {teacher.status === "active" ? "Active Faculty" : "Inactive / Leave"}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
            
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600 shrink-0">
                <FiMail size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-semibold text-slate-800">{teacher.email || "Not provided"}</p>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100/50 flex items-center justify-center text-purple-600 shrink-0">
                <FiBriefcase size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</p>
                <p className="text-sm font-semibold text-slate-800">{teacher.department || "Not specified"}</p>
              </div>
            </div>

            {/* Subjects */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100/50 flex items-center justify-center text-amber-600 shrink-0">
                <FiBook size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subjects Taught</p>
                <p className="text-sm font-semibold text-slate-800">
                  {teacher.subjects?.length > 0 ? teacher.subjects.join(", ") : "Not specified"}
                </p>
              </div>
            </div>

            {/* Joined */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0">
                <FiCalendar size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Joining Date</p>
                <p className="text-sm font-semibold text-slate-800">
                  {teacher.createdAt
                    ? new Date(teacher.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' })
                    : "Unknown"}
                </p>
              </div>
            </div>

            {/* Bio */}
            {teacher.bio && (
              <div className="flex items-start gap-4 pt-2">
                <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-600 shrink-0">
                  <FiInfo size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Biography</p>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                    {teacher.bio}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacherModal;
