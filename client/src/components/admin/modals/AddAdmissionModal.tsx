import React, { useState } from "react";
import { FiX, FiUser, FiMail, FiLayers, FiGrid, FiHash, FiPhone, FiCalendar, FiMapPin } from "react-icons/fi";
import type { AdmissionFormData } from "../../../types/admin/student";

interface AddAdmissionModalProps {
  form: AdmissionFormData;
  setForm: (form: AdmissionFormData) => void;
  onSave: () => void;
  onClose: () => void;
  loading?: boolean;
  isEdit?: boolean;
  classes: any[];
  sections: any[];
}

const AddAdmissionModal: React.FC<AddAdmissionModalProps> = ({
  form,
  setForm,
  onSave,
  onClose,
  loading = false,
  isEdit = false,
  classes,
  sections,
}) => {
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative w-full bg-white rounded-2xl shadow-sm border border-slate-200 animate-fadeIn flex flex-col">
        
        {/* Sticky Header Group */}
        <div className="sticky top-0 z-30 bg-white rounded-t-2xl shadow-sm shadow-slate-200/50">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/95 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between shrink-0 rounded-t-2xl">
            <div>
              <div className="flex items-center gap-10">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  {isEdit ? "Update Admission Application" : "Draft Admission Application"}
                </h3>
                <button 
                  onClick={() => {
                    setIsWizardMode(!isWizardMode);
                    setCurrentStep(1); // Reset to step 1 when toggling
                  }}
                  className="text-[10px] px-3 py-1 rounded-full bg-slate-200/80 text-slate-600 font-bold uppercase tracking-wider hover:bg-slate-300 transition-colors"
                  title="Toggle between Multi-step Wizard and Full Page Form"
                >
                  {isWizardMode ? "Switch to Full Form" : "Switch to Stepper"}
                </button>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {isEdit ? "Modify the details for this student." : "Enter the details to create a new student account."}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all absolute top-4 right-4 sm:relative sm:top-0 sm:right-0"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Wizard Indicators */}
          {isWizardMode && (
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className={`flex items-center gap-2 transition-all duration-500 ${currentStep >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 shadow-sm ${currentStep >= 1 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-100'}`}>1</div>
                <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Academic</span>
              </div>
              
              <div className="flex-1 h-1.5 mx-3 sm:mx-4 rounded-full overflow-hidden bg-slate-100">
                 <div className={`h-full transition-all duration-700 ease-in-out ${currentStep >= 2 ? 'w-full bg-indigo-500' : 'w-0 bg-indigo-500'}`}></div>
              </div>
              
              <div className={`flex items-center gap-2 transition-all duration-500 ${currentStep >= 2 ? 'text-purple-600' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 shadow-sm ${currentStep >= 2 ? 'bg-purple-600 text-white shadow-purple-200' : 'bg-slate-100'}`}>2</div>
                <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Personal</span>
              </div>
              
              <div className="flex-1 h-1.5 mx-3 sm:mx-4 rounded-full overflow-hidden bg-slate-100">
                 <div className={`h-full transition-all duration-700 ease-in-out ${currentStep >= 3 ? 'w-full bg-purple-500' : 'w-0 bg-purple-500'}`}></div>
              </div>
              
              <div className={`flex items-center gap-2 transition-all duration-500 ${currentStep >= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 shadow-sm ${currentStep >= 3 ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-100'}`}>3</div>
                <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Contact</span>
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* ================= ACADEMIC DETAILS ================= */}
          {(!isWizardMode || currentStep === 1) && (
            <section className={isWizardMode ? "animate-fadeIn" : ""}>
              <h4 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-4 uppercase tracking-widest flex items-center gap-2">
                <FiLayers className="text-indigo-500" /> Academic & Enrollment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Admission No <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiHash size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="ADM/2024/001"
                      value={form.admissionNo}
                      onChange={(e) => setForm({ ...form, admissionNo: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Enrollment No / Registration No</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiHash size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="Board Reg No"
                      value={form.enrollmentNo}
                      onChange={(e) => setForm({ ...form, enrollmentNo: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Assign Class <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiLayers size={14} />
                    </div>
                    <select
                      value={form.classId}
                      onChange={(e) => setForm({ ...form, classId: e.target.value, sectionId: "" })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select class</option>
                      {classes.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Select Section</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiGrid size={14} />
                    </div>
                    <select
                      value={form.sectionId}
                      disabled={!form.classId}
                      onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">Select section</option>
                      {sections.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Admission Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiCalendar size={14} />
                    </div>
                    <input
                      type="date"
                      value={form.admissionDate}
                      onChange={(e) => setForm({ ...form, admissionDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Previous School & Record</label>
                  <input
                    type="text"
                    placeholder="Name of last school attended"
                    value={form.previousSchool}
                    onChange={(e) => setForm({ ...form, previousSchool: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>

              </div>
            </section>
          )}

          {/* ================= PERSONAL DETAILS ================= */}
          {(!isWizardMode || currentStep === 2) && (
            <section className={isWizardMode ? "animate-fadeIn" : ""}>
              <h4 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-4 uppercase tracking-widest flex items-center gap-2">
                <FiUser className="text-purple-500" /> Personal Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1 md:col-span-2">
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
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Student Phone Number (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiPhone size={14} />
                    </div>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Date of Birth</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiCalendar size={14} />
                    </div>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Aadhar / National ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiHash size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="1234-5678-9012"
                      value={form.aadharNo}
                      onChange={(e) => setForm({ ...form, aadharNo: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Religion</label>
                  <select
                    value={form.religion}
                    onChange={(e) => setForm({ ...form, religion: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Select Religion</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Jain">Jain</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nationality</label>
                  <select
                    value={form.nationality}
                    onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Non-Indian">Non-Indian</option>
                  </select>
                </div>

              </div>
            </section>
          )}

          {/* ================= CONTACT & GUARDIAN DETAILS ================= */}
          {(!isWizardMode || currentStep === 3) && (
            <section className={isWizardMode ? "animate-fadeIn" : ""}>
              <h4 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-4 uppercase tracking-widest flex items-center gap-2">
                <FiPhone className="text-emerald-500" /> Contact & Guardian Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Parent/Guardian Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiUser size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="Father/Mother Name"
                      value={form.parentName}
                      onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Parent Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiPhone size={14} />
                    </div>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.parentPhone}
                      onChange={(e) => setForm({ ...form, parentPhone: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Parent Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiMail size={14} />
                    </div>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={form.parentEmail}
                      onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Residential Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FiMapPin size={14} />
                    </div>
                    <textarea
                      placeholder="Street name, City, Zip Code"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm min-h-[80px]"
                    />
                  </div>
                </div>

              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between gap-3 shrink-0 rounded-b-2xl">
          {isWizardMode ? (
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
          ) : (
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 rounded-lg text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <div className="flex gap-3">
            {isWizardMode && currentStep < 3 ? (
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
                  "Update Draft"
                ) : (
                  "Save Application"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmissionModal;
