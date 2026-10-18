import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { FiAlertCircle, FiCheck } from "react-icons/fi";

const TeacherProfile: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionNote, setCorrectionNote] = useState("");

  const teacherName = user?.name || "Sunita Rathore";
  const initials = teacherName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionNote.trim()) return;
    showToast("Profile correction request submitted to HR Office for verification.", "success");
    setCorrectionNote("");
    setShowCorrectionModal(false);
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn font-sans">
      {/* Top Banner Notice */}
      <div className="text-small text-ink-secondary">
        My profile · read-only — changes go to HR for approval
      </div>

      {/* Hero Section Card matching 10-My-profile.html */}
      <section className="bg-surface border border-line rounded-card p-6 flex flex-wrap gap-6 items-center shadow-2xs">
        <div className="w-[88px] h-[88px] shrink-0 rounded-hero bg-primary-tint text-primary-dark flex items-center justify-center text-2xl font-semibold border border-primary/20">
          {initials}
        </div>

        <div className="flex-1 min-w-[280px] flex flex-col gap-1.5">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
              {teacherName}
            </h1>
            <span lang="hi" className="text-lg text-ink-secondary font-medium">
              सुनीता राठौड़
            </span>
          </div>

          <div className="text-body text-ink-secondary">
            TGT Science · Science department · Code{" "}
            <span className="font-mono text-ink font-semibold">EMP-0142</span> · Joined 1 Jul 2019 · Permanent
          </div>

          <div className="flex gap-2 flex-wrap pt-1">
            <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-success-bg text-success-text">
              Present today
            </span>
            <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-primary-tint text-primary-dark">
              Class teacher 8-B
            </span>
            <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-tag-bg text-tag-text">
              Reports to: Vice Principal
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowCorrectionModal(true)}
          className="min-h-[44px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-body transition-colors shadow-2xs shrink-0"
        >
          Request a correction
        </button>
      </section>

      {/* Section Tabs */}
      <div
        role="tablist"
        className="flex gap-2 border-b border-line overflow-x-auto select-none"
      >
        {[
          { key: "overview", label: "Overview" },
          { key: "personal", label: "Personal & IDs" },
          { key: "qualifications", label: "Qualifications & documents" },
          { key: "teaching", label: "Teaching" },
          { key: "attendance", label: "Attendance & leave" },
          { key: "salary", label: "Salary" },
          { key: "training", label: "Training & appraisal" },
        ].map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
            className={`min-h-[44px] px-4 font-semibold text-body border-b-2 whitespace-nowrap transition-colors ${
              activeTab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-ink-secondary hover:text-ink font-normal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-4">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-micro font-medium text-ink-secondary">Periods per week</span>
              <span className="font-mono text-xl font-semibold text-ink">26</span>
              <span className="text-micro text-ink-secondary">4 sections · Science</span>
            </div>

            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-micro font-medium text-ink-secondary">Attendance this session</span>
              <span className="font-mono text-xl font-semibold text-ink">98.6%</span>
              <span className="text-micro text-ink-secondary">2 late arrivals</span>
            </div>

            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-micro font-medium text-ink-secondary">Leave left</span>
              <span className="font-mono text-xl font-semibold text-ink">CL 8 · SL 9</span>
              <span className="text-micro text-ink-secondary">EL 22 days</span>
            </div>

            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-micro font-medium text-ink-secondary">Experience</span>
              <span className="font-mono text-xl font-semibold text-ink">10 yrs</span>
              <span className="text-micro text-ink-secondary">7 years in this school</span>
            </div>

            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-micro font-medium text-ink-secondary">Net pay, September</span>
              <span className="font-mono text-xl font-semibold text-ink">₹48,300</span>
              <span className="text-micro text-ink-secondary">Paid 1 Oct</span>
            </div>
          </div>

          {/* Needs Attention Warning */}
          <section className="bg-warning-bg border border-warning-border rounded-card p-4 flex flex-col gap-1">
            <h2 className="m-0 text-small font-semibold text-warning-strong flex items-center gap-1.5">
              <FiAlertCircle size={16} /> Needs attention
            </h2>
            <span className="text-body text-warning-strong leading-relaxed">
              Medical fitness certificate expires 15 Dec 2026 · Half-Yearly Science 8-B marks due 12 Oct · CPD hours 32 of 50 for this year
            </span>
          </section>

          {/* Teaching Summary Card */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3 shadow-2xs">
            <h2 className="m-0 text-h2 font-semibold text-ink">Active Teaching Allocations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "8-B Science", periods: "6 periods/wk", room: "Room 21", role: "Class Teacher" },
                { name: "8-A Science", periods: "6 periods/wk", room: "Room 21", role: "Subject Teacher" },
                { name: "7-A Science", periods: "7 periods/wk", room: "Room 17", role: "Subject Teacher" },
                { name: "7-B Science", periods: "7 periods/wk", room: "Room 17", role: "Subject Teacher" },
              ].map((c) => (
                <div key={c.name} className="p-3 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
                  <span className="text-body font-semibold text-ink">{c.name}</span>
                  <span className="text-caption text-ink-secondary">{c.periods} · {c.room}</span>
                  <span className="text-micro text-primary font-medium">{c.role}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: PERSONAL & IDS */}
      {activeTab === "personal" && (
        <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-4 shadow-2xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">Personal & Contact Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-small">
            <div><span className="text-ink-secondary block">Date of Birth:</span><strong className="text-ink text-body">14 August 1989 (37 yrs)</strong></div>
            <div><span className="text-ink-secondary block">Gender:</span><strong className="text-ink text-body">Female</strong></div>
            <div><span className="text-ink-secondary block">Blood Group:</span><strong className="text-ink text-body">B Positive (B+)</strong></div>
            <div><span className="text-ink-secondary block">Email (Official):</span><strong className="text-ink text-body">sunita.rathore@shikshapublic.edu</strong></div>
            <div><span className="text-ink-secondary block">Mobile:</span><strong className="text-ink text-body">+91 98290 XXXXX (Protected)</strong></div>
            <div><span className="text-ink-secondary block">Aadhaar / ID:</span><strong className="text-ink text-body">XXXX-XXXX-4819 (Verified)</strong></div>
            <div className="sm:col-span-2"><span className="text-ink-secondary block">Residential Address:</span><strong className="text-ink text-body">Plot 42, Kalyan Nagar, Tonk Road, Jaipur, Rajasthan 302015</strong></div>
            <div><span className="text-ink-secondary block">Emergency Contact:</span><strong className="text-ink text-body">Mahendra Rathore (Spouse)</strong></div>
          </div>
        </section>
      )}

      {/* TAB 3: QUALIFICATIONS */}
      {activeTab === "qualifications" && (
        <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-4 shadow-2xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">Degrees & Certifications</h2>
          <div className="divide-y divide-line-row">
            {[
              { degree: "B.Ed. (Physical Sciences)", inst: "Regional Institute of Education (NCERT), Ajmer", year: "2013", grade: "First Division (Distinction)" },
              { degree: "M.Sc. Chemistry", inst: "University of Rajasthan, Jaipur", year: "2011", grade: "First Division" },
              { degree: "B.Sc. (Physics, Chemistry, Maths)", inst: "Maharani College, Jaipur", year: "2009", grade: "First Division" },
              { degree: "CTET Level 2 (Science & Mathematics)", inst: "CBSE Central Board", year: "2014", grade: "Qualified (118/150)" },
            ].map((q, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-body font-semibold text-ink">{q.degree}</span>
                  <span className="text-small text-ink-secondary">{q.inst} · {q.year}</span>
                </div>
                <span className="text-small font-semibold text-primary">{q.grade}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: TEACHING */}
      {activeTab === "teaching" && (
        <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-4 shadow-2xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">Curriculum & Allocation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-small">
            <div className="p-3.5 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
              <span className="font-semibold text-ink text-body">Department:</span>
              <span className="text-ink-secondary">Science & Environmental Studies (Middle & Secondary)</span>
            </div>
            <div className="p-3.5 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
              <span className="font-semibold text-ink text-body">Weekly Load:</span>
              <span className="text-ink-secondary">26 Teaching periods + 2 Substitution standby</span>
            </div>
            <div className="p-3.5 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
              <span className="font-semibold text-ink text-body">Designated Lab:</span>
              <span className="text-ink-secondary">Junior Chemistry & Biology Lab (Room 17B)</span>
            </div>
            <div className="p-3.5 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
              <span className="font-semibold text-ink text-body">Co-curricular Duties:</span>
              <span className="text-ink-secondary">Eco-Club Mentor & Annual Science Exhibition In-Charge</span>
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: ATTENDANCE & LEAVE */}
      {activeTab === "attendance" && (
        <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-4 shadow-2xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">Biometric Attendance & Leave Ledger</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface-subtle border border-line rounded-control"><span className="text-caption text-ink-secondary block">Casual Leave</span><strong className="text-xl font-mono text-ink">8 / 12</strong></div>
            <div className="p-3 bg-surface-subtle border border-line rounded-control"><span className="text-caption text-ink-secondary block">Sick Leave</span><strong className="text-xl font-mono text-ink">9 / 10</strong></div>
            <div className="p-3 bg-surface-subtle border border-line rounded-control"><span className="text-caption text-ink-secondary block">Earned Leave</span><strong className="text-xl font-mono text-ink">22 days</strong></div>
            <div className="p-3 bg-surface-subtle border border-line rounded-control"><span className="text-caption text-ink-secondary block">Late Arrival Count</span><strong className="text-xl font-mono text-ink">2 (Allowed 3)</strong></div>
          </div>
        </section>
      )}

      {/* TAB 6: SALARY */}
      {activeTab === "salary" && (
        <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-4 shadow-2xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">Salary Structure & Statutory Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-small">
            <div><span className="text-ink-secondary block">Pay Scale:</span><strong className="text-ink text-body">TGT Level 7 (7th CPC)</strong></div>
            <div><span className="text-ink-secondary block">Monthly Gross:</span><strong className="text-ink text-body font-mono">₹52,500</strong></div>
            <div><span className="text-ink-secondary block">Net Monthly Remittance:</span><strong className="text-primary text-body font-mono font-bold">₹48,300</strong></div>
            <div><span className="text-ink-secondary block">Provident Fund (UAN):</span><strong className="text-ink text-body font-mono">100928371928</strong></div>
            <div><span className="text-ink-secondary block">Bank Account:</span><strong className="text-ink text-body font-mono">SBI · A/C Ending 8291</strong></div>
            <div><span className="text-ink-secondary block">Income Tax PAN:</span><strong className="text-ink text-body font-mono">ABCDE1234F</strong></div>
          </div>
        </section>
      )}

      {/* TAB 7: TRAINING */}
      {activeTab === "training" && (
        <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-4 shadow-2xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">CPD Training & Appraisal Records</h2>
          <div className="p-3.5 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
            <span className="text-body font-semibold text-ink">Continuing Professional Development (CPD)</span>
            <span className="text-small text-ink-secondary">32 of 50 mandatory hours completed for 2026-27. Next module: "Experiential Learning in Middle School Science".</span>
          </div>
        </section>
      )}

      {/* Request a Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <form
            onSubmit={handleCorrectionSubmit}
            className="bg-surface border border-line rounded-card p-6 max-w-lg w-full shadow-xl flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-h2 font-semibold text-ink m-0">
                  Request Profile Correction
                </h3>
                <span className="text-small text-ink-secondary">
                  Specify details you want to update (e.g. address, phone, degree). Changes require HR sign-off.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="text-ink-secondary hover:text-ink text-body font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <textarea
              rows={4}
              required
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="Describe the correction required and attach documentary proof if applicable..."
              className="w-full p-3 rounded-control border border-line-input bg-surface text-body text-ink placeholder:text-ink-secondary focus:border-primary focus:outline-none leading-relaxed"
            />

            <div className="flex justify-end gap-2.5 pt-2 border-t border-line-row">
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="px-4 py-2 rounded-control border border-line-input bg-surface text-small font-medium text-ink hover:bg-surface-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5"
              >
                <FiCheck size={14} /> Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
