import React, { useState } from "react";
import { X, Check, AlertCircle, User, Phone, MapPin, Layers, FileText, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";
import { useToast } from "../../../context/ToastContext";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (studentData: any) => void;
}

export default function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"student" | "guardians" | "address" | "class" | "consent">("student");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    hindiName: "",
    dob: "2021-07-11",
    gender: "Male",
    category: "General",
    fatherMobile: "",
    fatherName: "",
    motherName: "",
    motherMobile: "",
    address: "",
    city: "Jaipur",
    state: "Rajasthan",
    classGrade: "Nursery-A (28 of 30)",
    feeCategory: "Regular · new admission",
    transport: "Bus 4 · Gopalpura bypass",
    consentDataProcessing: true,
    consentGalleryPhotos: false,
    consentWhatsApp: true,
  });

  const [siblingDetected, setSiblingDetected] = useState(false);

  if (!isOpen) return null;

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm({ ...form, fatherMobile: val });
    // Sibling detection simulation when 10 digits entered
    if (val.replace(/\D/g, "").length >= 10 && (val.includes("98290") || val.includes("94140"))) {
      setSiblingDetected(true);
    } else {
      setSiblingDetected(false);
    }
  };

  const handleLinkSibling = () => {
    setForm({
      ...form,
      fatherName: "Rohit Gupta",
      motherName: "Sunita Gupta",
      feeCategory: "Sibling concession (15%)",
    });
    setSiblingDetected(false);
    showToast("Linked to Rohit Gupta (Guardian of Aarav & Saanvi Gupta). Sibling concession applied!", "success");
  };

  const handleSubmit = (collectFee: boolean = false) => {
    if (!form.firstName || !form.dob) {
      showToast("Please fill all required student details", "error");
      setActiveTab("student");
      return;
    }

    const newStudent = {
      id: `STU-${Date.now()}`,
      admissionNo: `2026/${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${form.firstName} ${form.lastName}`.trim(),
      classGrade: form.classGrade.split(" ")[0],
      phone: form.fatherMobile || "98290 xxxxx",
      dob: form.dob,
      gender: form.gender,
      category: form.category,
      parentName: form.fatherName || "Guardian",
      transport: form.transport,
    };

    onSuccess?.(newStudent);
    showToast(
      collectFee 
        ? `Student enrolled! Redirecting to fee counter for ${newStudent.admissionNo}...` 
        : `Student ${newStudent.name} saved as draft!`, 
      "success"
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-surface rounded-card border border-line shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
          
          {/* Header */}
          <div className="p-6 border-b border-line bg-surface flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-small text-ink-secondary">
                Students › Add student
              </div>
              <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
                Add a student
              </h1>
              <div className="text-small text-ink-secondary">
                Fields marked * are required. Admission number generated on save: <span className="font-mono font-medium text-ink">2026/0219</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-control border border-line flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content: Navigation tabs on left + Form on right (08-AddStudent.html) */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
            
            {/* Left Nav Sections */}
            <nav className="w-full md:w-56 shrink-0 bg-surface rounded-control border border-line p-2 flex flex-col gap-1 h-fit">
              {[
                { id: "student", label: "Student", status: form.firstName ? "Done" : "" },
                { id: "guardians", label: "Guardians", status: form.fatherMobile ? "Done" : "1 to check" },
                { id: "address", label: "Address", status: form.address ? "Done" : "" },
                { id: "class", label: "Class, fees, transport", status: "Done" },
                { id: "consent", label: "Consent", status: form.consentDataProcessing ? "Done" : "" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full min-h-[40px] px-3 py-2 rounded-control text-body font-medium flex items-center justify-between transition-colors text-left cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary-tint text-primary-dark font-semibold"
                      : "text-ink hover:bg-surface-subtle"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.status === "Done" ? (
                    <span className="text-caption font-semibold text-emerald-700">Done</span>
                  ) : tab.status ? (
                    <span className="text-caption font-semibold text-warning-text">{tab.status}</span>
                  ) : null}
                </button>
              ))}
            </nav>

            {/* Right Form Panels */}
            <div className="flex-1 space-y-6">
              
              {/* STUDENT TAB */}
              {activeTab === "student" && (
                <section className="bg-surface rounded-card border border-line p-5 space-y-4">
                  <h2 className="m-0 text-h2 font-semibold text-ink">Student Personal Details</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                      First name *
                      <input
                        type="text"
                        required
                        value={form.firstName}
                        placeholder="e.g. Kiaan"
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                      Last name
                      <input
                        type="text"
                        value={form.lastName}
                        placeholder="e.g. Gupta"
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                      Name in Hindi
                      <input
                        type="text"
                        value={form.hindiName}
                        placeholder="कियान गुप्ता"
                        onChange={(e) => setForm({ ...form, hindiName: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                      Date of birth *
                      <input
                        type="date"
                        required
                        value={form.dob}
                        onChange={(e) => setForm({ ...form, dob: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                      Gender *
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink bg-surface focus:outline-none focus:border-primary"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                      Category
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink bg-surface focus:outline-none focus:border-primary"
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                      </select>
                    </label>
                  </div>
                </section>
              )}

              {/* GUARDIANS TAB (with Sibling detection!) */}
              {activeTab === "guardians" && (
                <section className="bg-surface rounded-card border border-line p-5 space-y-4">
                  <h2 className="m-0 text-h2 font-semibold text-ink">Guardians</h2>

                  <div className="space-y-4">
                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink max-w-sm">
                      Father's Mobile *
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 98290 12345"
                        value={form.fatherMobile}
                        onChange={handleMobileChange}
                        className="min-h-[44px] px-3 border border-line-input rounded-control font-mono text-body text-ink focus:outline-none focus:border-primary"
                      />
                    </label>

                    {/* Sibling Link Detector Banner (08-AddStudent.html) */}
                    {siblingDetected && (
                      <div className="p-4 rounded-control bg-primary-row border border-primary-soft/50 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                        <div className="flex items-start gap-2.5 max-w-lg">
                          <HeartHandshake className="text-primary shrink-0 mt-0.5" size={18} />
                          <span className="text-body text-ink leading-relaxed">
                            This mobile belongs to <b className="font-semibold">Rohit Gupta</b>, guardian of Aarav Gupta (5-A) and Saanvi Gupta (2-B). Link as sibling? Third-child concession (15%) will apply.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleLinkSibling}
                          className="min-h-[38px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-small font-semibold transition-colors cursor-pointer"
                        >
                          Link existing guardians
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                        Father's Name
                        <input
                          type="text"
                          value={form.fatherName}
                          placeholder="e.g. Rohit Gupta"
                          onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                          className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                        />
                      </label>

                      <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                        Mother's Name
                        <input
                          type="text"
                          value={form.motherName}
                          placeholder="e.g. Sunita Gupta"
                          onChange={(e) => setForm({ ...form, motherName: e.target.value })}
                          className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                        />
                      </label>
                    </div>
                  </div>
                </section>
              )}

              {/* ADDRESS TAB */}
              {activeTab === "address" && (
                <section className="bg-surface rounded-card border border-line p-5 space-y-4">
                  <h2 className="m-0 text-h2 font-semibold text-ink">Residential Address</h2>
                  
                  <div className="space-y-4">
                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                      Address Line
                      <input
                        type="text"
                        value={form.address}
                        placeholder="House no, Street, Colony..."
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                      />
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                        City
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                        />
                      </label>

                      <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                        State
                        <input
                          type="text"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                        />
                      </label>
                    </div>
                  </div>
                </section>
              )}

              {/* CLASS, FEES & TRANSPORT TAB */}
              {activeTab === "class" && (
                <section className="bg-surface rounded-card border border-line p-5 space-y-4">
                  <h2 className="m-0 text-h2 font-semibold text-ink">Class, Fees and Transport</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                      Class and Section *
                      <select
                        value={form.classGrade}
                        onChange={(e) => setForm({ ...form, classGrade: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink bg-surface focus:outline-none focus:border-primary"
                      >
                        <option>Nursery-A (28 of 30)</option>
                        <option>LKG-A (25 of 30)</option>
                        <option>Class 1-A (38 of 40)</option>
                        <option>Class 6-A (32 of 40)</option>
                        <option>Class 11-Science (41 of 45)</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                      Fee Category
                      <select
                        value={form.feeCategory}
                        onChange={(e) => setForm({ ...form, feeCategory: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink bg-surface focus:outline-none focus:border-primary"
                      >
                        <option>Regular · new admission</option>
                        <option>Sibling concession (15%)</option>
                        <option>RTE (Free seat)</option>
                        <option>Staff ward</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5 text-small font-medium text-ink sm:col-span-2">
                      Transport Route
                      <select
                        value={form.transport}
                        onChange={(e) => setForm({ ...form, transport: e.target.value })}
                        className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink bg-surface focus:outline-none focus:border-primary"
                      >
                        <option>Bus 4 · Gopalpura bypass</option>
                        <option>Bus 2 · Mansarovar</option>
                        <option>Bus 7 · Tonk Road</option>
                        <option>No transport (Self commute)</option>
                      </select>
                    </label>
                  </div>
                </section>
              )}

              {/* PARENT CONSENT TAB */}
              {activeTab === "consent" && (
                <section className="bg-surface rounded-card border border-line p-5 space-y-4">
                  <h2 className="m-0 text-h2 font-semibold text-ink">Parent Consent</h2>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 text-body text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.consentDataProcessing}
                        onChange={(e) => setForm({ ...form, consentDataProcessing: e.target.checked })}
                        className="w-4.5 h-4.5 mt-0.5 rounded text-primary focus:ring-primary"
                      />
                      <span>
                        Guardian has given consent to process the child's data for school purposes (notice v2.1, English and Hindi). <b className="font-semibold text-rose-600">Required.</b>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 text-body text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.consentGalleryPhotos}
                        onChange={(e) => setForm({ ...form, consentGalleryPhotos: e.target.checked })}
                        className="w-4.5 h-4.5 mt-0.5 rounded text-primary focus:ring-primary"
                      />
                      <span>Photos may appear in the school's public website gallery. Optional.</span>
                    </label>

                    <label className="flex items-start gap-3 text-body text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.consentWhatsApp}
                        onChange={(e) => setForm({ ...form, consentWhatsApp: e.target.checked })}
                        className="w-4.5 h-4.5 mt-0.5 rounded text-primary focus:ring-primary"
                      />
                      <span>Receive official announcements and fee notices via WhatsApp. Optional.</span>
                    </label>
                  </div>
                </section>
              )}

            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 px-6 border-t border-line bg-surface flex flex-wrap items-center justify-between gap-3">
            <span className="text-small text-ink-secondary">
              Session 2026-27 intake
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="min-h-[44px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-body font-medium text-ink transition-colors cursor-pointer"
              >
                Save as draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="min-h-[44px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-body font-semibold transition-colors cursor-pointer"
              >
                Save student and collect admission fee
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
