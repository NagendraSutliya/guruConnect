import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../api/axiosInstance";
import {
  MdPerson,
  MdBadge,
  MdEdit,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSchool,
  MdCalendarToday,
  MdWarningAmber,
  MdAccessTime,
  MdReceiptLong,
  MdFactCheck,
  MdClose,
  MdSend,
  MdQrCode2,
  MdFileDownload,
  MdCameraAlt,
  MdDelete,
} from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export type ProfileTab =
  | "overview"
  | "personal"
  | "qualifications"
  | "teaching"
  | "attendance"
  | "salary"
  | "training";

const TeacherProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  // Tab State
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  // Modals
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  // Correction Form State
  const [correctionCategory, setCorrectionCategory] = useState("Contact Information");
  const [correctionNote, setCorrectionNote] = useState("");
  const [isSubmittingCorrection, setIsSubmittingCorrection] = useState(false);

  // Dynamic User Info from Auth
  const teacherName = user?.name || "Sunita Rathore";
  const teacherEmail = user?.email || "sunita.rathore@shikshapublic.edu";
  const teacherPhone = user?.phone || "+91 98290 12345";
  const teacherAddress = user?.address || "Plot 42, Kalyan Nagar, Tonk Road, Jaipur, Rajasthan 302015";
  const teacherDesignation = user?.designation || "TGT Science & Class Teacher 8-B";
  const teacherQualification = user?.qualification || "M.Sc. (Chemistry), B.Ed., CTET";
  const instituteName = user?.instituteName || "Shiksha Public School";
  const empCode = user?.employeeId || (user?._id ? `EMP-${String(user._id).slice(-6).toUpperCase()}` : "EMP-0142");
  const teacherImage =
    user?.profileImage ||
    user?.avatar ||
    user?.photo ||
    user?.image ||
    null;

  // Initials for avatar
  const initials = teacherName
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .split(/\s+/)
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TR";

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, JPEG, WEBP).", "warn");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5MB.", "warn");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const updatedUser = { ...user, profileImage: base64Data };
        if (setUser) setUser(updatedUser);
        localStorage.setItem("teacher", JSON.stringify(updatedUser));
        showToast("Profile image updated successfully!", "success");

        try {
          await api.patch("/teacher/profile/image", { image: base64Data });
        } catch (apiErr) {
          console.log("Backend image sync note:", apiErr);
        }
      } catch (err) {
        showToast("Failed to update profile image.", "error");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle remove image
  const handleRemoveImage = async () => {
    const updatedUser = { ...user, profileImage: null };
    if (setUser) setUser(updatedUser);
    localStorage.setItem("teacher", JSON.stringify(updatedUser));
    showToast("Profile photo removed. Initial avatar restored.", "info");

    try {
      await api.patch("/teacher/profile/image", { image: null });
    } catch (apiErr) {
      console.log("Backend image sync note:", apiErr);
    }
  };

  // Handle Correction Submit
  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionNote.trim()) {
      showToast("Please describe the requested correction.", "warn");
      return;
    }

    setIsSubmittingCorrection(true);
    setTimeout(() => {
      setIsSubmittingCorrection(false);
      setShowCorrectionModal(false);
      setCorrectionNote("");
      showToast(
        "Profile correction request dispatched to Human Resources (HR) & Principal office.",
        "success"
      );
    }, 800);
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-fadeIn font-sans pb-12">
      {/* ================= HEADER SECTION (SINGLE LINE ON LAPTOP) ================= */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex flex-col gap-0.5 min-w-0">
          {/* Breadcrumb */}
          <div className="text-xs sm:text-[13px] text-ink-secondary flex items-center gap-1.5 mb-0.5 truncate">
            <Link to="/teacher/dashboard" className="hover:text-primary transition-colors shrink-0">
              Teacher Panel
            </Link>
            <span>›</span>
            <span className="text-ink shrink-0">Staff Services</span>
            <span>›</span>
            <span className="text-primary font-semibold truncate">My Profile</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              Faculty Profile & Service Record
            </h1>
            <span className="px-2 py-0.5 rounded bg-primary-tint text-primary-dark font-bold text-xs shrink-0 font-mono">
              Code: {empCode}
            </span>
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Official institutional service dossier, academic qualifications, teaching load & payroll information
          </div>
        </div>

        {/* Top-Right Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowIdCardModal(true)}
            className="px-3 py-1.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5"
          >
            <MdQrCode2 size={16} className="text-primary" />
            <span>Digital ID Card</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCorrectionModal(true)}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MdEdit size={15} />
            <span>Request HR Correction</span>
          </button>
        </div>
      </div>

      {/* ================= HERO PROFILE CARD ================= */}
      <section className="bg-surface border border-line rounded-card p-5 sm:p-6 shadow-xs flex flex-wrap md:flex-nowrap gap-5 items-center justify-between">
        <div className="flex items-center gap-5 min-w-0">
          {/* Avatar / Photo with Upload Overlay */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-hero bg-primary-tint text-primary-dark flex items-center justify-center text-2xl font-bold border-2 border-primary/20 shadow-2xs overflow-hidden">
              {teacherImage ? (
                <img
                  src={teacherImage}
                  alt={teacherName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {/* Camera Upload Button Overlay */}
            <label
              htmlFor="teacher-profile-image-upload"
              title="Upload profile photo"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-95 border-2 border-white"
            >
              <MdCameraAlt size={14} />
              <input
                id="teacher-profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Teacher Credentials */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-ink m-0 tracking-tight truncate">
                {teacherName}
              </h2>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                ● Active Staff
              </span>
            </div>

            <p className="text-xs sm:text-small text-ink-secondary m-0">
              <strong className="text-ink">{teacherDesignation}</strong> · Science Department · Joined 1 Jul 2019 · Permanent
            </p>

            {/* Meta Tags & Photo Actions */}
            <div className="flex gap-2 flex-wrap items-center pt-1 text-[11px]">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                Present Today (07:51 AM)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-tint text-primary-dark font-semibold border border-primary-tint-border">
                Class Teacher 8-B
              </span>
              <label
                htmlFor="teacher-profile-image-upload"
                className="px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-50 text-primary font-semibold border border-primary/30 cursor-pointer flex items-center gap-1 transition-colors"
              >
                <MdCameraAlt size={12} />
                <span>{teacherImage ? "Change Photo" : "Upload Photo"}</span>
              </label>
              {teacherImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-2 py-0.5 rounded-full bg-white hover:bg-red-50 text-red-600 font-semibold border border-red-200 cursor-pointer flex items-center gap-1 transition-colors"
                  title="Remove custom photo and restore initials"
                >
                  <MdDelete size={12} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Institution Badge */}
        <div className="hidden lg:flex flex-col items-end gap-1 text-right border-l border-line-row pl-6 shrink-0">
          <span className="text-xs text-ink-secondary font-medium">Institution</span>
          <strong className="text-sm text-ink">{instituteName}</strong>
          <span className="text-[11px] text-ink-secondary">Affiliation No: CBSE/AFF/341029</span>
        </div>
      </section>

      {/* ================= SECTION TABS ================= */}
      <div
        role="tablist"
        className="flex gap-1 border-b border-line overflow-x-auto no-scrollbar select-none"
      >
        {[
          { key: "overview", label: "Overview", icon: <MdFactCheck size={15} /> },
          { key: "personal", label: "Personal & Contact", icon: <MdPerson size={15} /> },
          { key: "qualifications", label: "Qualifications & Degrees", icon: <MdSchool size={15} /> },
          { key: "teaching", label: "Teaching & Schedule", icon: <MdCalendarToday size={15} /> },
          { key: "attendance", label: "Attendance & Leave Ledger", icon: <MdAccessTime size={15} /> },
          { key: "salary", label: "Salary & Statutory", icon: <MdReceiptLong size={15} /> },
          { key: "training", label: "CPD & Appraisal", icon: <MdBadge size={15} /> },
        ].map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            onClick={() => setActiveTab(t.key as ProfileTab)}
            className={`min-h-[42px] px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === t.key
                ? "border-primary text-primary bg-primary-tint/30"
                : "border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-semibold text-ink-secondary">Weekly Load</span>
              <span className="font-mono text-xl font-bold text-ink">26 Periods</span>
              <span className="text-[11px] text-ink-secondary">4 Sections · Science</span>
            </div>

            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-semibold text-ink-secondary">Attendance (2026-27)</span>
              <span className="font-mono text-xl font-bold text-emerald-700">98.6%</span>
              <span className="text-[11px] text-ink-secondary">0 Late arrivals in Oct</span>
            </div>

            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-semibold text-ink-secondary">Leave Available</span>
              <span className="font-mono text-xl font-bold text-ink">CL 8 · SL 9</span>
              <span className="text-[11px] text-ink-secondary">EL 22 Days accumulated</span>
            </div>

            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-semibold text-ink-secondary">Total Experience</span>
              <span className="font-mono text-xl font-bold text-ink">10 Years</span>
              <span className="text-[11px] text-ink-secondary">7 yrs in this school</span>
            </div>

            <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-2xs">
              <span className="text-[11px] font-semibold text-ink-secondary">Latest Net Pay</span>
              <span className="font-mono text-xl font-bold text-primary">₹60,180</span>
              <span className="text-[11px] text-ink-secondary">Disbursed 01 Oct</span>
            </div>
          </div>

          {/* Needs Attention Warning */}
          <section className="bg-amber-50/70 border border-amber-200 rounded-card p-4 flex items-start gap-3 shadow-2xs text-amber-900">
            <MdWarningAmber size={20} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5 text-xs">
              <strong className="text-amber-950 font-semibold">Service Dossier Action Items</strong>
              <span className="leading-relaxed text-amber-900">
                • Annual Medical Fitness Renewal due on <strong>15 Dec 2026</strong> · Half-Yearly Gradebook entry submitted for Class 8-B · CPD Training: 32 of 50 mandatory annual hours completed.
              </span>
            </div>
          </section>

          {/* Teaching Summary Card */}
          <section className="bg-surface border border-line rounded-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <h2 className="text-sm font-semibold text-ink m-0">Active Teaching Allocations & Sections</h2>
              <span className="text-xs text-ink-secondary">Session 2026-27 Routine</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { name: "8-B Science", periods: "6 periods/wk", room: "Room 21 (Science Wing)", role: "Class Teacher & Science", students: "38 Students" },
                { name: "8-A Science", periods: "6 periods/wk", room: "Room 22", role: "Subject Teacher", students: "40 Students" },
                { name: "7-A Science", periods: "7 periods/wk", room: "Room 17", role: "Subject Teacher & Lab In-charge", students: "40 Students" },
                { name: "7-B Science", periods: "7 periods/wk", room: "Room 18", role: "Subject Teacher", students: "39 Students" },
              ].map((c) => (
                <div key={c.name} className="p-3.5 bg-surface-subtle border border-line rounded-control flex flex-col gap-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-ink">{c.name}</strong>
                    <span className="font-mono text-[11px] text-ink-secondary">{c.periods}</span>
                  </div>
                  <span className="text-ink-secondary">{c.room} · {c.students}</span>
                  <span className="text-[11px] text-primary font-semibold mt-1 inline-block">
                    {c.role}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ================= TAB 2: PERSONAL & CONTACT ================= */}
      {activeTab === "personal" && (
        <section className="bg-surface border border-line rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h2 className="text-sm font-semibold text-ink m-0">Personal Identification & Contact Data</h2>
            <span className="text-xs text-ink-secondary">Verified by HR Verification Office</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Full Legal Name:</span>
              <strong className="text-sm font-semibold text-ink">{teacherName}</strong>
            </div>

            <div className="p-3 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Official Email:</span>
              <strong className="text-sm font-semibold text-ink flex items-center gap-1">
                <MdEmail size={14} className="text-primary" /> {teacherEmail}
              </strong>
            </div>

            <div className="p-3 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Registered Mobile:</span>
              <strong className="text-sm font-semibold text-ink flex items-center gap-1 font-mono">
                <MdPhone size={14} className="text-emerald-700" /> {teacherPhone}
              </strong>
            </div>

            <div className="p-3 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Date of Birth:</span>
              <strong className="text-sm font-semibold text-ink">14 August 1989 (37 Years)</strong>
            </div>

            <div className="p-3 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Gender & Blood Group:</span>
              <strong className="text-sm font-semibold text-ink">Female · Blood Group B+ (Positive)</strong>
            </div>

            <div className="p-3 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">National Identity (Aadhaar):</span>
              <strong className="text-sm font-semibold text-ink font-mono">XXXX-XXXX-4819 (Verified)</strong>
            </div>

            <div className="sm:col-span-2 p-3 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px] flex items-center gap-1">
                <MdLocationOn size={14} className="text-primary" /> Residential Address:
              </span>
              <strong className="text-xs font-semibold text-ink">{teacherAddress}</strong>
            </div>

            <div className="p-3 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Emergency Contact:</span>
              <strong className="text-xs font-semibold text-ink">Mahendra Rathore (Spouse) · +91 98290 88223</strong>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 3: QUALIFICATIONS ================= */}
      {activeTab === "qualifications" && (
        <section className="bg-surface border border-line rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h2 className="text-sm font-semibold text-ink m-0">Degrees & Educational Certifications</h2>
            <span className="text-xs text-ink-secondary">Highest Qualification: {teacherQualification}</span>
          </div>

          <div className="divide-y divide-line-row text-xs">
            {[
              { degree: "B.Ed. (Bachelor of Education - Physical Sciences)", inst: "Regional Institute of Education (NCERT), Ajmer", year: "2013", grade: "First Division (Distinction)", verification: "Verified by CBSE Board" },
              { degree: "M.Sc. Chemistry (Specialization: Organic Chemistry)", inst: "University of Rajasthan, Jaipur", year: "2011", grade: "First Division (74.2%)", verification: "Verified by Board of Governors" },
              { degree: "B.Sc. (Physics, Chemistry, Mathematics)", inst: "Maharani College, Jaipur", year: "2009", grade: "First Division (71.8%)", verification: "University Verified" },
              { degree: "CTET Level 2 (Science & Mathematics Teacher Eligibility)", inst: "Central Board of Secondary Education", year: "2014", grade: "Score: 118 / 150 (Qualified)", verification: "DigiLocker Verified" },
            ].map((q, idx) => (
              <div key={idx} className="py-3.5 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-ink">{q.degree}</span>
                  <span className="text-ink-secondary">{q.inst} · Graduated {q.year}</span>
                  <span className="text-[11px] text-emerald-800 font-medium">✓ {q.verification}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded bg-primary-tint text-primary-dark font-bold font-mono text-xs">
                    {q.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= TAB 4: TEACHING ================= */}
      {activeTab === "teaching" && (
        <section className="bg-surface border border-line rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h2 className="text-sm font-semibold text-ink m-0">Teaching Curriculum, Labs & Co-Curricular Duties</h2>
            <span className="text-xs text-ink-secondary">Middle & Secondary Science Wing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
              <span className="font-bold text-ink text-sm">Subject Department</span>
              <p className="text-ink-secondary m-0 leading-relaxed">
                Science & Environmental Studies (Middle & Secondary). Teacher is syllabus lead for NCERT Class 8 Physics & Chemistry curriculum.
              </p>
            </div>

            <div className="p-4 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
              <span className="font-bold text-ink text-sm">Weekly Periods & Timetable Load</span>
              <p className="text-ink-secondary m-0 leading-relaxed">
                26 Core Teaching Periods + 2 Substitution Standby Periods per week. Routine synced with Master Routine Panel.
              </p>
            </div>

            <div className="p-4 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
              <span className="font-bold text-ink text-sm">Designated Practical Laboratory</span>
              <p className="text-ink-secondary m-0 leading-relaxed">
                Junior Chemistry & Biology Laboratory (Room 17B). In charge of laboratory chemicals inventory, glassware audit & safety gear.
              </p>
            </div>

            <div className="p-4 bg-surface-subtle border border-line rounded-control flex flex-col gap-1">
              <span className="font-bold text-ink text-sm">Co-Curricular & Special Responsibilities</span>
              <p className="text-ink-secondary m-0 leading-relaxed">
                Mentor for Student Eco-Club, Coordinator for Annual Inter-School Science Exhibition, and Exam Invigilator for Board Term examinations.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 5: ATTENDANCE & LEAVE LEDGER ================= */}
      {activeTab === "attendance" && (
        <section className="bg-surface border border-line rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h2 className="text-sm font-semibold text-ink m-0">Biometric Attendance & Leave Balance Ledger</h2>
            <Link to="/teacher/leave-payslip" className="text-xs font-semibold text-primary hover:underline">
              Open Full Leave Management ›
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-surface-subtle border border-line rounded-control">
              <span className="text-ink-secondary block text-[11px]">Casual Leave (CL)</span>
              <strong className="text-xl font-mono text-ink">8 / 12</strong>
              <span className="text-[10.5px] text-emerald-700 block mt-0.5">4 Availed this session</span>
            </div>

            <div className="p-3.5 bg-surface-subtle border border-line rounded-control">
              <span className="text-ink-secondary block text-[11px]">Sick Leave (SL)</span>
              <strong className="text-xl font-mono text-ink">9 / 10</strong>
              <span className="text-[10.5px] text-blue-700 block mt-0.5">1 Availed in Sep</span>
            </div>

            <div className="p-3.5 bg-surface-subtle border border-line rounded-control">
              <span className="text-ink-secondary block text-[11px]">Earned Leave (EL)</span>
              <strong className="text-xl font-mono text-ink">22 Days</strong>
              <span className="text-[10.5px] text-purple-700 block mt-0.5">Cumulative balance</span>
            </div>

            <div className="p-3.5 bg-surface-subtle border border-line rounded-control">
              <span className="text-ink-secondary block text-[11px]">Punctuality (Oct)</span>
              <strong className="text-xl font-mono text-emerald-700">100%</strong>
              <span className="text-[10.5px] text-ink-secondary block mt-0.5">0 Late punches</span>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 6: SALARY ================= */}
      {activeTab === "salary" && (
        <section className="bg-surface border border-line rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h2 className="text-sm font-semibold text-ink m-0">Compensation Structure & Statutory Accounts</h2>
            <Link to="/teacher/leave-payslip" className="text-xs font-semibold text-primary hover:underline">
              Download Payslips & Form 16 ›
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Pay Commission Scale:</span>
              <strong className="text-sm font-semibold text-ink">TGT Scale Level 7 (7th CPC)</strong>
            </div>

            <div className="p-3.5 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Monthly Gross Remuneration:</span>
              <strong className="text-sm font-mono font-bold text-ink">₹68,140</strong>
            </div>

            <div className="p-3.5 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Net Disbursed Take-Home:</span>
              <strong className="text-sm font-mono font-bold text-primary">₹60,180</strong>
            </div>

            <div className="p-3.5 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Employees' Provident Fund (UAN):</span>
              <strong className="text-sm font-mono text-ink">1009 2837 1928</strong>
            </div>

            <div className="p-3.5 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Salary Bank Account:</span>
              <strong className="text-sm font-mono text-ink">HDFC Bank · A/c •••• 4291</strong>
            </div>

            <div className="p-3.5 rounded-control bg-surface-subtle border border-line">
              <span className="text-ink-secondary block text-[11px]">Income Tax PAN Number:</span>
              <strong className="text-sm font-mono text-ink">ABCDE 1234F</strong>
            </div>
          </div>
        </section>
      )}

      {/* ================= TAB 7: TRAINING & CPD ================= */}
      {activeTab === "training" && (
        <section className="bg-surface border border-line rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <h2 className="text-sm font-semibold text-ink m-0">Continuous Professional Development (CPD) & Training</h2>
            <span className="text-xs text-ink-secondary">Mandatory 50 Annual CPD Hours</span>
          </div>

          <div className="p-4 bg-surface-subtle border border-line rounded-control space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <strong className="text-ink">Annual CPD Progress (2026-27):</strong>
              <span className="font-bold font-mono text-primary">32 / 50 Hours Completed (64%)</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all" style={{ width: "64%" }} />
            </div>
            <p className="text-ink-secondary text-[11.5px] m-0 pt-1 leading-relaxed">
              Upcoming Training Module: <em>"Pedagogical Innovations in Middle School Physics & Chemistry Laboratories"</em> scheduled for <strong>28 November 2026</strong>.
            </p>
          </div>
        </section>
      )}

      {/* ================= MODAL 1: DIGITAL FACULTY ID CARD ================= */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card max-w-sm w-full shadow-2xl overflow-hidden flex flex-col">
            {/* ID Header */}
            <div className="bg-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdBadge size={22} className="text-white" />
                <div>
                  <h3 className="text-sm font-bold m-0 tracking-wide">{instituteName}</h3>
                  <span className="text-[10px] text-white/80 block">Faculty Identification Card</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIdCardModal(false)}
                className="text-white/80 hover:text-white p-1"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* ID Body */}
            <div className="p-6 flex flex-col items-center text-center gap-3 bg-white text-xs">
              <div className="w-20 h-20 rounded-full bg-primary-tint text-primary-dark flex items-center justify-center text-2xl font-bold border-2 border-primary shadow-xs overflow-hidden shrink-0">
                {teacherImage ? (
                  <img
                    src={teacherImage}
                    alt={teacherName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div>
                <strong className="text-base text-ink block">{teacherName}</strong>
                <span className="text-ink-secondary text-xs">{teacherDesignation}</span>
              </div>

              <div className="w-full bg-surface-subtle border border-line rounded-control p-2.5 text-[11px] space-y-1 text-left font-mono">
                <div className="flex justify-between"><span>Emp Code:</span><strong>{empCode}</strong></div>
                <div className="flex justify-between"><span>Blood Group:</span><strong>B+</strong></div>
                <div className="flex justify-between"><span>Emergency:</span><strong>{teacherPhone}</strong></div>
                <div className="flex justify-between"><span>Valid Till:</span><strong>31 Mar 2028</strong></div>
              </div>

              <div className="pt-1 flex flex-col items-center">
                <div className="w-24 h-24 border border-line p-1 rounded bg-white flex items-center justify-center">
                  <MdQrCode2 size={88} className="text-ink" />
                </div>
                <span className="text-[10px] text-ink-secondary mt-1">Scan for institutional verification</span>
              </div>
            </div>

            {/* ID Footer */}
            <div className="p-3 bg-surface-subtle border-t border-line flex justify-end">
              <button
                type="button"
                onClick={() => {
                  showToast("Faculty ID Card downloaded to your device.", "success");
                  setShowIdCardModal(false);
                }}
                className="px-4 py-1.5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MdFileDownload size={14} />
                <span>Save ID Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: REQUEST HR CORRECTION ================= */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleCorrectionSubmit}
            className="bg-surface border border-line rounded-card max-w-lg w-full shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 px-6 border-b border-line flex items-center justify-between bg-surface-subtle">
              <div className="flex items-center gap-2">
                <MdEdit size={18} className="text-primary" />
                <h3 className="text-base font-semibold text-ink m-0">
                  Request Profile Correction
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="p-1 rounded text-ink-secondary hover:text-ink hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-ink block mb-1">Correction Category</label>
                <select
                  value={correctionCategory}
                  onChange={(e) => setCorrectionCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink font-medium focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="Contact Information">Contact Information (Mobile, Email)</option>
                  <option value="Residential Address">Residential Address Update</option>
                  <option value="Educational Degrees">Educational Degrees & Certifications</option>
                  <option value="Banking & Statutory">Bank Account or PAN Update</option>
                  <option value="Name / Spelling">Name or Spelling Correction</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-ink block mb-1">
                  Description of Requested Correction
                </label>
                <textarea
                  rows={4}
                  required
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  placeholder="Clearly state the current incorrect value and the exact new value with justification..."
                  className="w-full p-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-control bg-surface-subtle border border-line flex items-center justify-between">
                <span className="text-[11px] text-ink-secondary flex items-center gap-1.5">
                  <FiPaperclip size={14} /> Attach supporting document (Aadhaar / Degree)
                </span>
                <button
                  type="button"
                  onClick={() => showToast("Attachment simulated: Document attached.", "info")}
                  className="px-2.5 py-1 rounded border border-line bg-white hover:bg-slate-50 text-[11px] font-semibold text-ink"
                >
                  Browse File
                </button>
              </div>

              <span className="text-[11px] text-ink-secondary block">
                All submitted corrections require physical document verification by HR Office within 2 business days.
              </span>
            </div>

            <div className="p-3.5 px-6 border-t border-line bg-surface-subtle flex items-center justify-between">
              <span className="text-[11px] text-ink-secondary">Approver: Principal / HR Office</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-3.5 py-1.5 rounded-control border border-line-input text-ink text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCorrection}
                  className="px-4 py-1.5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingCorrection ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <MdSend size={14} />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
