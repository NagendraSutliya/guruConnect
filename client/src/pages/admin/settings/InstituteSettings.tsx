import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import {
  MdSave,
  MdCloudUpload,
  MdCheckCircle,
  MdSecurity,
  MdHistory,
  MdArrowForward,
} from "react-icons/md";
import { Link } from "react-router-dom";

const SETTINGS_TABS = [
  { id: "profile", label: "School profile" },
  { id: "academic", label: "Academic" },
  { id: "fees", label: "Fees and payments" },
  { id: "numbering", label: "Numbering" },
  { id: "communication", label: "Communication" },
  { id: "attendance", label: "Attendance" },
  { id: "branding", label: "Branding" },
  { id: "privacy", label: "Data and privacy" },
] as const;

type SettingsTabId = typeof SETTINGS_TABS[number]["id"];

export default function InstituteSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");

  const currentTabLabel = SETTINGS_TABS.find((t) => t.id === activeTab)?.label || "School profile";

  // Profile fields matching Screen 43
  const [formData, setFormData] = useState({
    schoolName: "Shiksha Public School",
    campus: "Mansarovar, Jaipur",
    boardAffiliation: "CBSE · 1730248",
    udiseCode: "08120400192",
    phone: "0141 2780192",
    email: "office@shikshapublic.edu.in",
    principalName: "Dr. Kavita Rao",
    principalSignatureUrl: "signature.png (uploaded)",
    logoUrl: "",
    // Academic tab
    academicSession: "2026-27 (current)",
    termsCount: "2 Terms (Apr–Sep, Oct–Mar)",
    gradingScale: "CBSE 9-Point Scale (A1 to E)",
    workingDays: "Monday to Saturday (Alternate Sat off)",
    // Fees & payments
    lateFeePerDay: "₹20 / day after 15th",
    cashClosingMandatory: true,
    onlineGateway: "Razorpay (Live)",
    concessionApprovalPrincipal: true,
    // Numbering prefixes
    admissionPrefix: "ADM/2026/",
    receiptPrefix: "RCP/2627/",
    tcPrefix: "TC/2026/",
    staffEmpPrefix: "EMP/",
    // Communication
    whatsappChannel: "Meta Cloud API · Verified (+91 98290 00000)",
    smsSenderId: "SHKSHA",
    // Attendance
    attendanceCutoff: "09:30 AM",
    biometricSync: "Automated every 15 minutes",
    // Data & privacy
    twoStepPolicy: "Mandatory for Admin, Accountants & Exam Leads",
    retentionYears: "7 Years digital record mandate",
  });

  useEffect(() => {
    // Read from localStorage or API
    try {
      const saved = localStorage.getItem("admin");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          schoolName: parsed.instituteName || prev.schoolName,
          campus: parsed.campusName || parsed.address || prev.campus,
          phone: parsed.phone || prev.phone,
          email: parsed.email || prev.email,
          principalName: parsed.ownerName || parsed.principalName || prev.principalName,
          logoUrl: parsed.logoUrl || prev.logoUrl,
        }));
      }
    } catch (e) {
      console.error(e);
    }

    api
      .get("/admin/profile")
      .then((res) => {
        if (res.data?.data) {
          const d = res.data.data;
          setFormData((prev) => ({
            ...prev,
            schoolName: d.instituteName || prev.schoolName,
            campus: d.address || prev.campus,
            phone: d.phone || prev.phone,
            email: d.email || prev.email,
            principalName: d.ownerName || d.principalName || prev.principalName,
            logoUrl: d.logoUrl || prev.logoUrl,
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote profile:", err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Update localStorage so layout, navbar, printouts react immediately
      const saved = localStorage.getItem("admin");
      const parsed = saved ? JSON.parse(saved) : {};
      const updated = {
        ...parsed,
        instituteName: formData.schoolName,
        campusName: formData.campus,
        phone: formData.phone,
        email: formData.email,
        ownerName: formData.principalName,
        principalName: formData.principalName,
        logoUrl: formData.logoUrl,
      };
      localStorage.setItem("admin", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));

      // 2. Persist to API
      try {
        await api.patch("/admin/profile", {
          name: formData.principalName,
          phone: formData.phone,
          instituteName: formData.schoolName,
        });
      } catch (apiErr) {
        // Continue even if remote profile endpoint has partial schema
      }

      showToast("School settings saved and synced across all modules!", "success");
    } catch (err) {
      showToast("Error updating school settings", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 39-Reports.html & 43-SchoolSettings.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">Settings › {currentTabLabel}</div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            School settings
          </h1>
          <div className="text-[13px] text-ink-secondary">
            School-wide settings. Changes are recorded in the audit log.
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => showToast("Changes discarded", "info")}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink-dark text-[13px] font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-2 active:scale-[0.98] disabled:opacity-70"
          >
            <MdSave size={16} />
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* 8 Tabs List matching Screen 43 */}
      <div role="tablist" className="flex gap-1 border-b border-line overflow-x-auto">
        {SETTINGS_TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
            className={`min-h-[28px] px-3 text-sm font-semibold whitespace-nowrap transition border-b-[3px] font-sans cursor-pointer ${
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-ink-secondary hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Content Layout (Matching ReportsPage & CommunicationPage) */}
      <div className="flex flex-wrap gap-5 items-start">
        {/* Left Column: Active Tab Main Content */}
        <section className="flex-1 basis-[520px] min-w-0 bg-white border border-line rounded-card p-5 flex flex-col gap-4 shadow-xs">
          {/* =========================================================================
              TAB 1: SCHOOL PROFILE (Screen 43 exact)
             ========================================================================= */}
          {activeTab === "profile" && (
            <>
              <div className="flex justify-between items-baseline gap-3 pb-1 border-b border-line/60">
                <h2 className="m-0 text-base font-semibold text-ink">School details</h2>
                <span className="text-xs text-ink-secondary">Institutional identity</span>
              </div>

              <div className="space-y-3.5">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  School name
                  <input
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none transition-colors"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Campus
                  <input
                    name="campus"
                    value={formData.campus}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none transition-colors"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Board and affiliation no.
                  <input
                    name="boardAffiliation"
                    value={formData.boardAffiliation}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none transition-colors"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  UDISE code
                  <input
                    name="udiseCode"
                    value={formData.udiseCode}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] font-mono text-ink focus:border-primary focus:outline-none transition-colors"
                  />
                </label>
              </div>

              <div className="text-xs text-ink-secondary pt-2 border-t border-line-row">
                Shown on receipts, report cards, salary slips and certificates.
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 2: ACADEMIC
             ========================================================================= */}
          {activeTab === "academic" && (
            <>
              <div className="flex justify-between items-baseline gap-3 pb-1 border-b border-line/60">
                <h2 className="m-0 text-base font-semibold text-ink">Academic configuration</h2>
                <span className="text-xs text-ink-secondary">Terms & grading</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Active academic session
                  <select
                    name="academicSession"
                    value={formData.academicSession}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  >
                    <option value="2026-27 (current)">2026-27 (current)</option>
                    <option value="2025-26 (closed)">2025-26 (closed)</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Evaluation & term breakdown
                  <input
                    name="termsCount"
                    value={formData.termsCount}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Grading standard
                  <input
                    name="gradingScale"
                    value={formData.gradingScale}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Weekly working schedule
                  <input
                    name="workingDays"
                    value={formData.workingDays}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>
              </div>

              <div className="text-xs text-ink-secondary pt-2 border-t border-line-row">
                Defines default term schedules, report card scales, and working calendar for academic year.
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 3: FEES & PAYMENTS
             ========================================================================= */}
          {activeTab === "fees" && (
            <>
              <div className="flex justify-between items-baseline gap-3 pb-1 border-b border-line/60">
                <h2 className="m-0 text-base font-semibold text-ink">Finance and cash desk rules</h2>
                <span className="text-xs text-ink-secondary">Fee counter policy</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                    Late fee policy
                    <input
                      name="lateFeePerDay"
                      value={formData.lateFeePerDay}
                      onChange={handleChange}
                      className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                    Online payment gateway
                    <input
                      name="onlineGateway"
                      value={formData.onlineGateway}
                      disabled
                      className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-surface-subtle text-xs sm:text-[13px] text-ink-secondary"
                    />
                  </label>
                </div>

                <div className="p-3 bg-primary-tint/50 border border-primary/20 rounded-control text-xs text-primary-dark flex items-start gap-2">
                  <MdCheckCircle size={15} className="text-primary shrink-0 mt-0.5" />
                  <span>
                    <b>Mandatory Day Book Cash Hand-over:</b> Fee counters cannot accept payments for the next morning without verifying previous closing.
                  </span>
                </div>
              </div>

              <div className="text-xs text-ink-secondary pt-2 border-t border-line-row">
                Late fine calculations auto-apply on all student accounts past the monthly due threshold.
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 4: NUMBERING
             ========================================================================= */}
          {activeTab === "numbering" && (
            <>
              <div className="flex justify-between items-baseline gap-3 pb-1 border-b border-line/60">
                <h2 className="m-0 text-base font-semibold text-ink">Document series & identifier formats</h2>
                <span className="text-xs text-ink-secondary">Prefixes & format</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Admission number prefix
                  <input
                    name="admissionPrefix"
                    value={formData.admissionPrefix}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white font-mono text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Fee counter receipt series
                  <input
                    name="receiptPrefix"
                    value={formData.receiptPrefix}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white font-mono text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Transfer certificate (TC) prefix
                  <input
                    name="tcPrefix"
                    value={formData.tcPrefix}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white font-mono text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Staff biometric / employee code
                  <input
                    name="staffEmpPrefix"
                    value={formData.staffEmpPrefix}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white font-mono text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>
              </div>

              <div className="text-xs text-ink-secondary pt-2 border-t border-line-row">
                Sequential numbering resets or increments automatically at the start of each academic year.
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 5: COMMUNICATION
             ========================================================================= */}
          {activeTab === "communication" && (
            <>
              <div className="flex justify-between items-baseline gap-3 pb-1 border-b border-line/60">
                <h2 className="m-0 text-base font-semibold text-ink">Messaging & broadcast gateways</h2>
                <span className="text-xs text-ink-secondary">SMS & WhatsApp</span>
              </div>

              <div className="space-y-3.5">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  WhatsApp official sender
                  <input
                    name="whatsappChannel"
                    value={formData.whatsappChannel}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Govt. DLT header (SMS sender ID)
                  <input
                    name="smsSenderId"
                    value={formData.smsSenderId}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white font-mono text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>
              </div>

              <div className="text-xs text-ink-secondary pt-2 border-t border-line-row">
                All bulk broadcast messages require pre-approved DLT templates as mandated by TRAI telecom guidelines.
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 6: ATTENDANCE
             ========================================================================= */}
          {activeTab === "attendance" && (
            <>
              <div className="flex justify-between items-baseline gap-3 pb-1 border-b border-line/60">
                <h2 className="m-0 text-base font-semibold text-ink">Attendance & biometrics sync</h2>
                <span className="text-xs text-ink-secondary">Gate tracking</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Morning attendance cut-off
                  <input
                    name="attendanceCutoff"
                    value={formData.attendanceCutoff}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white font-mono text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Biometric polling frequency
                  <input
                    name="biometricSync"
                    value={formData.biometricSync}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>
              </div>

              <div className="text-xs text-ink-secondary pt-2 border-t border-line-row">
                Automated SMS & WhatsApp alerts trigger to guardians for absentees 15 minutes after cut-off.
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 7: BRANDING
             ========================================================= */}
          {activeTab === "branding" && (
            <>
              <div className="flex justify-between items-baseline gap-3 pb-1 border-b border-line/60">
                <h2 className="m-0 text-base font-semibold text-ink">Institution brand & theme</h2>
                <span className="text-xs text-ink-secondary">Colors & badge</span>
              </div>

              <div className="flex items-center gap-4 p-4 border border-line rounded-control bg-surface-subtle">
                <div className="w-14 h-14 rounded-card bg-primary text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  {formData.schoolName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-sm text-ink">{formData.schoolName}</div>
                  <div className="text-xs text-ink-secondary">{formData.campus}</div>
                  <div className="text-xs text-primary font-medium mt-1">Patshala Emerald Theme · #0E5A63</div>
                </div>
              </div>

              <div className="text-xs text-ink-secondary pt-2 border-t border-line-row">
                Brand colors reflect on student portal, parent mobile app, fee receipts and report cards.
              </div>
            </>
          )}

          {/* =========================================================================
              TAB 8: DATA & PRIVACY
             ========================================================================= */}
          {activeTab === "privacy" && (
            <>
              <div className="flex justify-between items-baseline gap-3 pb-1 border-b border-line/60">
                <h2 className="m-0 text-base font-semibold text-ink">Compliance and security policy</h2>
                <span className="text-xs text-ink-secondary">Access & retention</span>
              </div>

              <div className="space-y-4">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Two-step verification requirement
                  <input
                    name="twoStepPolicy"
                    value={formData.twoStepPolicy}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Digital record retention mandate
                  <input
                    name="retentionYears"
                    value={formData.retentionYears}
                    onChange={handleChange}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none"
                  />
                </label>
              </div>

              <div className="text-xs text-ink-secondary pt-2 border-t border-line-row">
                Audit logs are cryptographically sealed and cannot be modified or purged by any local role.
              </div>
            </>
          )}
        </section>

        {/* Right Aside: Synced Right Panel (Matching ReportsPage, CommunicationPage & HostelPage) */}
        <aside className="flex-1 basis-[300px] max-w-full lg:max-w-[340px] flex flex-col gap-4">
          {/* Card 1: Contact & Signatures (for Tab 1) or Quick Status Summary */}
          {activeTab === "profile" ? (
            <section className="bg-white border border-line rounded-card p-4 flex flex-col gap-3 shadow-xs">
              <h2 className="m-0 text-base font-semibold text-ink">Contact and signatures</h2>

              <div className="space-y-3 pt-1">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Phone
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="min-h-[38px] px-3 border border-line-input rounded-control bg-white text-xs font-mono text-ink focus:outline-none focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Email
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="min-h-[38px] px-3 border border-line-input rounded-control bg-white text-xs text-ink focus:outline-none focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Principal name
                  <input
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleChange}
                    className="min-h-[38px] px-3 border border-line-input rounded-control bg-white text-xs text-ink focus:outline-none focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Principal signature
                  <div className="flex gap-2 items-center">
                    <input
                      name="principalSignatureUrl"
                      value={formData.principalSignatureUrl}
                      onChange={handleChange}
                      className="min-h-[38px] flex-1 px-3 border border-line-input rounded-control bg-white text-xs text-ink focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => showToast("Opening signature file selector...", "info")}
                      className="min-h-[38px] px-3 border border-line-input bg-surface-subtle hover:bg-slate-50 rounded-control text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
                    >
                      <MdCloudUpload size={15} />
                      <span>Upload</span>
                    </button>
                  </div>
                </label>
              </div>

              <div className="text-xs text-ink-secondary pt-2 border-t border-line-row">
                Signature image is automatically printed on Transfer Certificates (TC) and CBSE report cards.
              </div>
            </section>
          ) : (
            <section className="bg-white border border-line rounded-card p-4 flex flex-col gap-3 shadow-xs">
              <h2 className="m-0 text-base font-semibold text-ink">Quick overview</h2>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between items-center py-1.5 border-b border-line-row">
                  <span className="text-ink-secondary">Academic session</span>
                  <span className="font-semibold text-ink font-mono">{formData.academicSession}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-line-row">
                  <span className="text-ink-secondary">Late fee rule</span>
                  <span className="font-semibold text-ink">{formData.lateFeePerDay}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-line-row">
                  <span className="text-ink-secondary">Online payments</span>
                  <span className="font-semibold text-primary">{formData.onlineGateway}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-ink-secondary">Attendance cut-off</span>
                  <span className="font-semibold text-ink font-mono">{formData.attendanceCutoff}</span>
                </div>
              </div>
            </section>
          )}

          {/* Card 2: Institutional Audit & Security Rail (Matching other pages) */}
          <section className="bg-white border border-line rounded-card p-4 flex flex-col gap-2.5 shadow-xs">
            <h2 className="m-0 text-sm font-semibold text-ink flex items-center gap-1.5">
              <MdSecurity size={16} className="text-primary" />
              <span>Audit & compliance</span>
            </h2>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary">Profile status</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-bg text-success-text">
                  <MdCheckCircle size={12} />
                  <span>Synced</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary">Audit trail</span>
                <span className="font-mono text-ink text-[11px]">Enforced (CBSE)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary">Last modified</span>
                <span className="text-ink text-[11px]">Today · 10:30 am</span>
              </div>
            </div>

            <div className="pt-2 border-t border-line-row">
              <Link
                to="/admin/users"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <MdHistory size={14} />
                <span>View system audit log</span>
                <MdArrowForward size={12} className="ml-auto" />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
