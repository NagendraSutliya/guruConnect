import React from "react";
import { FiX, FiUser, FiMail, FiLayers, FiGrid, FiHash, FiPhone, FiCalendar, FiMapPin } from "react-icons/fi";
import type { Student } from "../../../types/admin/student";

interface Props {
  admission: Student;
  onClose: () => void;
}

const ViewAdmissionModal: React.FC<Props> = ({ admission, onClose }) => {
  if (!admission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 animate-fadeIn scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              View Admission Application
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Read-only view of the student's admission details.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiUser size={14} className="text-slate-400" />
                {admission.name || "N/A"}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiMail size={14} className="text-slate-400" />
                {admission.email || "N/A"}
              </div>
            </div>

            {/* Admission No */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Admission No</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiHash size={14} className="text-slate-400" />
                {admission.admissionNo || "N/A"}
              </div>
            </div>

            {/* Enrollment No */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Enrollment No</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiHash size={14} className="text-slate-400" />
                {admission.enrollmentNo || "N/A"}
              </div>
            </div>

            {/* Parent Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Parent/Guardian Name</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiUser size={14} className="text-slate-400" />
                {admission.parentName || "N/A"}
              </div>
            </div>

            {/* Parent Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Parent Phone Number</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiPhone size={14} className="text-slate-400" />
                {admission.parentPhone || "N/A"}
              </div>
            </div>

            {/* Parent Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Parent Email Address</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiMail size={14} className="text-slate-400" />
                {admission.parentEmail || "N/A"}
              </div>
            </div>

            {/* Student Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Student Phone Number</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiPhone size={14} className="text-slate-400" />
                {admission.phone || "N/A"}
              </div>
            </div>
            
            {/* Aadhar No */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Aadhar / National ID</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiHash size={14} className="text-slate-400" />
                {admission.aadharNo || "N/A"}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm">
                {admission.gender || "N/A"}
              </div>
            </div>

            {/* Blood Group */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Blood Group</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm">
                {admission.bloodGroup || "N/A"}
              </div>
            </div>

            {/* Religion */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Religion</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm">
                {admission.religion || "N/A"}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm">
                {admission.category || "N/A"}
              </div>
            </div>

            {/* Nationality */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nationality</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm">
                {admission.nationality || "Indian"}
              </div>
            </div>

            {/* Class */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Assigned Class</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiLayers size={14} className="text-slate-400" />
                {admission.classId?.name || "N/A"}
              </div>
            </div>

            {/* Section */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Assigned Section</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiGrid size={14} className="text-slate-400" />
                {admission.sectionId?.name || "N/A"}
              </div>
            </div>

            {/* DOB */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Date of Birth</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiCalendar size={14} className="text-slate-400" />
                {admission.dob ? new Date(admission.dob).toLocaleDateString() : "N/A"}
              </div>
            </div>

            {/* Admission Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Admission Date</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm flex items-center gap-2">
                <FiCalendar size={14} className="text-slate-400" />
                {admission.admissionDate ? new Date(admission.admissionDate).toLocaleDateString() : "N/A"}
              </div>
            </div>

            {/* Previous School */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Previous School & Record</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm">
                {admission.previousSchool ? `${admission.previousSchool} (Class: ${admission.previousClass || "N/A"})` : "N/A"}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Residential Address</label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 shadow-sm min-h-[80px] flex items-start gap-2">
                <FiMapPin size={14} className="text-slate-400 mt-1" />
                <span className="whitespace-pre-wrap">{admission.address || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAdmissionModal;
