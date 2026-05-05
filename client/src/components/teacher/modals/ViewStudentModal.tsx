import React from "react";
import { 
  FiX, 
  FiUser, 
  FiCalendar, 
  FiActivity, 
  FiHeart, 
  FiMapPin, 
  FiUsers, 
  FiBriefcase, 
  FiPhone, 
  FiMail 
} from "react-icons/fi";

interface ViewStudentModalProps {
  student: any;
  onClose: () => void;
}

const SectionTitle = ({ icon: Icon, title }: any) => (
  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
    <Icon className="text-indigo-600" size={14} />
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
  </div>
);

const DetailItem = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 p-1.5 bg-slate-50 text-slate-400 rounded-md">
      <Icon size={12} />
    </div>
    <div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
      <p className="text-xs font-bold text-slate-700 mt-0.5">{value}</p>
    </div>
  </div>
);

const ViewStudentModal: React.FC<ViewStudentModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
        {/* Modal Header */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-violet-600 p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
          >
            <FiX size={18} />
          </button>
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl">
              <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600 text-3xl font-black">
                {student.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="pt-14 p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800">{student.name}</h2>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">Roll No: #{student.rollNo}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">Active</span>
              <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-full uppercase">ID: {student.admissionNo || "N/A"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <SectionTitle icon={FiUser} title="Personal Details" />
              <div className="space-y-4">
                <DetailItem label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"} icon={FiCalendar} />
                <DetailItem label="Gender" value={student.gender || "N/A"} icon={FiActivity} />
                <DetailItem label="Blood Group" value={student.bloodGroup || "N/A"} icon={FiHeart} />
                <DetailItem label="Address" value={student.address || "N/A"} icon={FiMapPin} />
              </div>
            </div>

            <div className="space-y-6">
              <SectionTitle icon={FiUsers} title="Guardian Info" />
              <div className="space-y-4">
                <DetailItem label="Parent Name" value={student.parentName || "N/A"} icon={FiBriefcase} />
                <DetailItem label="Parent Phone" value={student.parentPhone || "N/A"} icon={FiPhone} />
                <DetailItem label="Emergency Contact" value={student.phone || "N/A"} icon={FiActivity} />
                <DetailItem label="Email" value={student.email || "N/A"} icon={FiMail} />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
             <button className="px-6 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all">Download Report</button>
             <button className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentModal;
