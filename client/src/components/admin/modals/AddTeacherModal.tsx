import React from "react";
import { FiX, FiUser, FiMail, FiLock, FiPhone, FiHash, FiBriefcase, FiCalendar } from "react-icons/fi";
import type { TeacherFormData } from "../../../types/admin/teacher";

interface AddTeacherModalProps {
  form: TeacherFormData;
  setForm: (form: TeacherFormData) => void;
  onSave: () => void;
  onClose: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  form,
  setForm,
  onSave,
  onClose,
  loading = false,
  isEdit = false,
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 animate-fadeIn scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {isEdit ? "Edit Faculty Profile" : "Add New Faculty"}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {isEdit ? "Update the details for this teacher." : "Enter the details to create a new teacher account."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Wizard Indicators */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className={`flex items-center gap-2 transition-all duration-500 ${currentStep >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 shadow-sm ${currentStep >= 1 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-100'}`}>1</div>
            <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Account</span>
          </div>
          
          <div className="flex-1 h-1.5 mx-3 sm:mx-4 rounded-full overflow-hidden bg-slate-100">
             <div className={`h-full transition-all duration-700 ease-in-out ${currentStep >= 2 ? 'w-full bg-indigo-500' : 'w-0 bg-indigo-500'}`}></div>
          </div>
          
          <div className={`flex items-center gap-2 transition-all duration-500 ${currentStep >= 2 ? 'text-purple-600' : 'text-slate-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 shadow-sm ${currentStep >= 2 ? 'bg-purple-600 text-white shadow-purple-200' : 'bg-slate-100'}`}>2</div>
            <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Professional</span>
          </div>
          
          <div className="flex-1 h-1.5 mx-3 sm:mx-4 rounded-full overflow-hidden bg-slate-100">
             <div className={`h-full transition-all duration-700 ease-in-out ${currentStep >= 3 ? 'w-full bg-purple-500' : 'w-0 bg-purple-500'}`}></div>
          </div>
          
          <div className={`flex items-center gap-2 transition-all duration-500 ${currentStep >= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 shadow-sm ${currentStep >= 3 ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-100'}`}>3</div>
            <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Financial</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 min-h-[300px]">
          
          {/* STEP 1: Account Details */}
          {currentStep === 1 && (
            <section className="animate-fadeIn">
              <h4 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-4 uppercase tracking-widest">Account Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiUser size={14} />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiMail size={14} />
                </div>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                {isEdit ? "Password (Optional)" : "Password"} {isEdit ? "" : <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock size={14} />
                </div>
                <input
                  type="password"
                  placeholder={isEdit ? "Leave blank to keep" : "••••••••"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
            </div>
          </section>
        )}

        {/* STEP 2: Professional Details */}
        {currentStep === 2 && (
          <section className="animate-fadeIn">
            <h4 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-4 uppercase tracking-widest">Professional Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            {/* Employee ID */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Employee ID <span className="text-rose-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiHash size={14} />
                </div>
                <input
                  type="text"
                  placeholder="EMP-001"
                  value={form.employeeId || ""}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Designation</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiBriefcase size={14} />
                </div>
                <input
                  type="text"
                  placeholder="PGT Mathematics"
                  value={form.designation || ""}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Qualification */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Qualification</label>
              <input
                type="text"
                placeholder="M.Sc, B.Ed"
                value={form.qualification || ""}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            {/* Specialization */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Specialization (Comma Separated)</label>
              <input
                type="text"
                placeholder="Maths, Physics"
                value={form.specialization || ""}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            {/* Joining Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Joining Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiCalendar size={14} />
                </div>
                <input
                  type="date"
                  value={form.joiningDate || ""}
                  onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
            </div>
          </section>
        )}

        {/* STEP 3: Financial Details */}
        {currentStep === 3 && (
          <section className="animate-fadeIn">
            <h4 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-4 uppercase tracking-widest">Financial Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Joining Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Joining Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiCalendar size={14} />
                </div>
                <input
                  type="date"
                  value={form.joiningDate || ""}
                  onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
          </section>
        )}

        {/* STEP 3: Financial Details */}
        {currentStep === 3 && (
          <section className="animate-fadeIn">
            <h4 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-4 uppercase tracking-widest">Financial Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Emergency Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Emergency Contact</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiPhone size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Emergency Phone"
                  value={form.emergencyPhone || ""}
                  onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* PAN Number */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">PAN Number</label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                value={form.panNo || ""}
                onChange={(e) => setForm({ ...form, panNo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            {/* Banking Info */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Bank Account No</label>
              <input
                type="text"
                placeholder="Account Number"
                value={form.bankAccountNo || ""}
                onChange={(e) => setForm({ ...form, bankAccountNo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">IFSC Code</label>
              <input
                type="text"
                placeholder="IFSC Code"
                value={form.ifscCode || ""}
                onChange={(e) => setForm({ ...form, ifscCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Basic Salary</label>
              <input
                type="number"
                placeholder="e.g. 45000"
                value={form.basicSalary || ""}
                onChange={(e) => setForm({ ...form, basicSalary: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            
            </div>
          </section>
        )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between gap-3 rounded-b-2xl">
          <button
            onClick={() => {
              if (currentStep === 1) onClose();
              else prevStep();
            }}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm disabled:opacity-50"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>
          
          <div className="flex gap-3">
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="flex items-center justify-center min-w-[120px] px-5 py-2 rounded-lg text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 transition-all shadow-sm active:scale-95"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={onSave}
                disabled={loading}
                className="flex items-center justify-center min-w-[120px] px-5 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : isEdit ? (
                  "Update Teacher"
                ) : (
                  "Save Teacher"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeacherModal;
