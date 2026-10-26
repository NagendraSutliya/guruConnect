import React, { useState, useEffect } from "react";
import {
  FiX,
  FiPrinter,
  FiMail,
  FiEdit,
  FiCheckCircle,
  FiAlertTriangle,
  FiCalendar,
  FiAward,
  FiBookOpen,
  FiFileText,
  FiShield,
  FiPhone,
  FiDollarSign
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import api from "../../../api/axiosInstance";

export interface TeacherProfileData {
  id: string;
  empId: string;
  name: string;
  hindiName?: string;
  role: string;
  department: string;
  joinedDate: string;
  status: "Permanent" | "Probation" | "Contract";
  todayStatus: "Present" | "On leave" | "Late";
  classTeacher?: string;
  reportsTo?: string;
  phone: string;
  email: string;
  periodsPerWeek: number;
  sections?: string;
  attendanceRate: string;
  lateArrivals: number;
  leaveLeft: { cl: number; sl: number; el: number };
  experience: string;
  tenureHere: string;
  netPay: string;
  paidDate?: string;
  needsAttention?: string;
  aadhaar?: string;
  pan?: string;
  address?: string;
  qualification?: string;
  specialization?: string;
}

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: TeacherProfileData | null;
  onUpdate?: (updated: TeacherProfileData) => void;
}

export default function TeacherProfileModal({
  isOpen,
  onClose,
  staff,
  onUpdate
}: TeacherProfileModalProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "personal"
    | "qualifications"
    | "teaching"
    | "attendance"
    | "salary"
    | "training"
    | "login"
  >("overview");

  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const [editFormData, setEditFormData] = useState<Partial<TeacherProfileData>>({});

  const [adminData, setAdminData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("admin");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!adminData?.instituteName) {
      api
        .get("/admin/profile")
        .then((res) => {
          if (res.data?.data) {
            const profile = res.data.data;
            setAdminData((prev: any) => {
              const updated = {
                ...prev,
                instituteName: profile.instituteName || prev?.instituteName,
                campusName: profile.campusName || prev?.campusName,
                address: profile.address || prev?.address,
                city: profile.city || prev?.city,
                board: profile.board || prev?.board,
                affiliationNo: profile.affiliationNo || prev?.affiliationNo,
                phone: profile.phone || prev?.phone,
                logoUrl: profile.logoUrl || prev?.logoUrl,
              };
              localStorage.setItem("admin", JSON.stringify(updated));
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  const instituteName = adminData?.instituteName || "GuruConnect Institute";
  const instituteSubtitle = [
    adminData?.campusName ? `${adminData.campusName}` : (adminData?.city ? `${adminData.city} Campus` : null),
    adminData?.board ? `Affiliation ${adminData.board}` : null,
  ].filter(Boolean).join(" · ") || (adminData?.city ? `${adminData.city} Campus · CBSE` : "Mansarovar Campus · Affiliation CBSE");

  if (!isOpen || !staff) return null;

  const initials = staff.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setIsMessageOpen(false);
    setMessageText("");
    showToast(`SMS & App notification dispatched to ${staff.name} (${staff.phone})!`, "success");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate({ ...staff, ...editFormData } as TeacherProfileData);
    }
    setIsEditOpen(false);
    showToast(`Staff profile for ${staff.name} successfully updated!`, "success");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <div className="bg-white border border-line rounded-card w-full max-w-4xl shadow-xl flex flex-col my-auto max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 font-sans">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-page">
            <div className="text-[13px] text-ink-secondary">
              Staff › <span className="font-semibold text-ink">{staff.name}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-control border border-line flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-slate-100 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Top Identity Card (Matching 27-TeacherProfile.html) */}
            <section className="bg-white border border-line rounded-card p-6 flex flex-wrap gap-6 items-center">
              <div className="w-20 h-20 sm:w-22 sm:h-22 shrink-0 rounded-card bg-[#E3EFEF] text-primary flex items-center justify-center text-2xl sm:text-3xl font-semibold select-none border border-[#0E5A63]/20">
                {initials}
              </div>

              <div className="flex-1 min-w-[280px] flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-2xl font-semibold text-ink">{staff.name}</h2>
                  {staff.hindiName && (
                    <span lang="hi" className="text-lg text-ink-secondary font-hindi">
                      {staff.hindiName}
                    </span>
                  )}
                </div>

                <div className="text-[13.5px] text-ink-secondary">
                  {staff.role} · {staff.department} department · Code{" "}
                  <span className="font-mono font-medium text-ink">{staff.empId}</span> · Joined{" "}
                  {staff.joinedDate} · {staff.status}
                </div>

                <div className="flex gap-2 flex-wrap pt-1">
                  <span
                    className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${
                      staff.todayStatus === "Present"
                        ? "bg-[#E4F1E8] text-[#1E5A33]"
                        : staff.todayStatus === "On leave"
                        ? "bg-[#FFF6EC] text-[#7A4106]"
                        : "bg-[#FDE8E8] text-[#9B1C1C]"
                    }`}
                  >
                    {staff.todayStatus === "Present" ? "Present today" : staff.todayStatus}
                  </span>
                  {staff.classTeacher && (
                    <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E3EFEF] text-primary">
                      {staff.classTeacher}
                    </span>
                  )}
                  {staff.reportsTo && (
                    <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F1EEE6] text-[#5A4A24]">
                      Reports to: {staff.reportsTo}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsMessageOpen(true)}
                  className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <FiMail size={14} className="text-ink-secondary" />
                  <span>Message</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsIdCardOpen(true)}
                  className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <FiPrinter size={14} className="text-ink-secondary" />
                  <span>Print ID card</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditFormData(staff);
                    setIsEditOpen(true);
                  }}
                  className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-medium transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <FiEdit size={14} className="text-ink-secondary" />
                  <span>Edit</span>
                </button>
              </div>
            </section>

            {/* Profile Tabs */}
            <div
              role="tablist"
              className="flex gap-1 border-b border-line overflow-x-auto scrollbar-none text-[13.5px] font-medium"
            >
              {[
                { id: "overview", label: "Overview" },
                { id: "personal", label: "Personal & IDs" },
                { id: "qualifications", label: "Qualifications & docs" },
                { id: "teaching", label: "Teaching & workload" },
                { id: "attendance", label: "Attendance & leave" },
                { id: "salary", label: "Salary" },
                { id: "training", label: "Training & appraisal" },
                { id: "login", label: "Login & roles" }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`min-h-[42px] px-3.5 border-b-[3px] whitespace-nowrap transition-colors ${
                    activeTab === t.id
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-ink-secondary hover:text-ink hover:border-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="bg-white border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-xs">
                    <span className="text-[12.5px] text-ink-secondary font-medium">Periods per week</span>
                    <span className="font-mono text-2xl font-semibold text-ink">
                      {staff.periodsPerWeek}
                    </span>
                    <span className="text-[12px] text-ink-secondary truncate">
                      {staff.sections || "4 sections"} · {staff.department}
                    </span>
                  </div>

                  <div className="bg-white border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-xs">
                    <span className="text-[12.5px] text-ink-secondary font-medium">Attendance</span>
                    <span className="font-mono text-2xl font-semibold text-ink">
                      {staff.attendanceRate || "98.6%"}
                    </span>
                    <span className="text-[12px] text-ink-secondary">
                      {staff.lateArrivals ?? 2} late arrivals
                    </span>
                  </div>

                  <div className="bg-white border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-xs">
                    <span className="text-[12.5px] text-ink-secondary font-medium">Leave left</span>
                    <span className="font-mono text-2xl font-semibold text-ink">
                      CL {staff.leaveLeft?.cl ?? 8} · SL {staff.leaveLeft?.sl ?? 9}
                    </span>
                    <span className="text-[12px] text-ink-secondary">
                      EL {staff.leaveLeft?.el ?? 22} days
                    </span>
                  </div>

                  <div className="bg-white border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-xs">
                    <span className="text-[12.5px] text-ink-secondary font-medium">Experience</span>
                    <span className="font-mono text-2xl font-semibold text-ink">
                      {staff.experience || "10 yrs"}
                    </span>
                    <span className="text-[12px] text-ink-secondary">
                      {staff.tenureHere || "7 years in school"}
                    </span>
                  </div>

                  <div className="bg-white border border-line rounded-card p-3.5 flex flex-col gap-1 shadow-xs">
                    <span className="text-[12.5px] text-ink-secondary font-medium">Net pay, Sept</span>
                    <span className="font-mono text-2xl font-semibold text-ink">
                      {staff.netPay || "₹48,300"}
                    </span>
                    <span className="text-[12px] text-ink-secondary">
                      Paid {staff.paidDate || "1 Oct"}
                    </span>
                  </div>
                </div>

                {staff.needsAttention && (
                  <section className="bg-[#FFF6EC] border border-[#EBC99C] rounded-card p-4 flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-[#7A4106]">Needs attention</h3>
                    <span className="text-[13.5px] text-[#5E3305]">
                      {staff.needsAttention}
                    </span>
                  </section>
                )}

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-line rounded-card p-4 bg-white space-y-2">
                    <h4 className="text-[13px] font-semibold text-ink uppercase tracking-wide">
                      Contact &amp; Emergency
                    </h4>
                    <div className="text-xs space-y-1 text-ink-secondary">
                      <div><b className="text-ink">Mobile:</b> +91 {staff.phone}</div>
                      <div><b className="text-ink">Work Email:</b> {staff.email}</div>
                      <div><b className="text-ink">Address:</b> {staff.address || "14-B, Mahaveer Nagar, Tonk Road, Jaipur"}</div>
                      <div><b className="text-ink">Emergency Contact:</b> Narendra Singh (Husband) · 98290 88210</div>
                    </div>
                  </div>

                  <div className="border border-line rounded-card p-4 bg-white space-y-2">
                    <h4 className="text-[13px] font-semibold text-ink uppercase tracking-wide">
                      Academic Department &amp; Roles
                    </h4>
                    <div className="text-xs space-y-1 text-ink-secondary">
                      <div><b className="text-ink">Department:</b> {staff.department}</div>
                      <div><b className="text-ink">Primary Subjects:</b> Science, Chemistry (Classes 8, 9, 10)</div>
                      <div><b className="text-ink">Class Teacher:</b> {staff.classTeacher || "None assigned"}</div>
                      <div><b className="text-ink">Committee Roles:</b> Science Exhibition Incharge, Discipline Committee</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Personal & IDs */}
            {activeTab === "personal" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border border-line rounded-card p-4 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-ink-secondary block">Aadhaar Number</span>
                    <span className="font-mono text-sm font-semibold text-ink">
                      {staff.aadhaar || "XXXX-XXXX-8491"}
                    </span>
                    <span className="text-[11px] text-emerald-700 block mt-0.5">✓ Verified</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Permanent Account Number (PAN)</span>
                    <span className="font-mono text-sm font-semibold text-ink">
                      {staff.pan || "ABCDE1234F"}
                    </span>
                    <span className="text-[11px] text-emerald-700 block mt-0.5">✓ Verified on NSDL</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Date of Birth</span>
                    <span className="text-sm font-medium text-ink">14 August 1988 (Age: 38)</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Blood Group</span>
                    <span className="text-sm font-medium text-ink">B positive (B+)</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-ink-secondary block">Residential Address</span>
                    <span className="text-sm font-medium text-ink">
                      {staff.address || "14-B, Mahaveer Nagar, Tonk Road, Jaipur 302018"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Qualifications */}
            {activeTab === "qualifications" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border border-line rounded-card p-4 bg-white space-y-3">
                  <h4 className="text-sm font-semibold text-ink">Degrees &amp; Certifications</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-line/60">
                      <div>
                        <div className="font-semibold text-ink">M.Sc Chemistry</div>
                        <div className="text-ink-secondary">University of Rajasthan · 2011 · 1st Division</div>
                      </div>
                      <span className="text-emerald-700 font-medium">Verified Certificate</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-line/60">
                      <div>
                        <div className="font-semibold text-ink">B.Ed (Physical Sciences)</div>
                        <div className="text-ink-secondary">Regional Institute of Education (NCERT) · 2013</div>
                      </div>
                      <span className="text-emerald-700 font-medium">Verified Certificate</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <div>
                        <div className="font-semibold text-ink">CTET Level 2 (Science &amp; Maths)</div>
                        <div className="text-ink-secondary">CBSE · Qualified 2014 · Score: 118/150</div>
                      </div>
                      <span className="text-emerald-700 font-medium">Verified Roll No</span>
                    </div>
                  </div>
                </div>

                <div className="border border-line rounded-card p-4 bg-white space-y-3">
                  <h4 className="text-sm font-semibold text-ink">Compliance Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-page rounded-control border border-line flex items-center justify-between">
                      <div>
                        <div className="font-medium text-ink">Police Verification</div>
                        <div className="text-ink-secondary text-[11px]">Valid till 14 Nov 2027</div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">Clear</span>
                    </div>
                    <div className="p-3 bg-page rounded-control border border-line flex items-center justify-between">
                      <div>
                        <div className="font-medium text-ink">Medical Fitness Certificate</div>
                        <div className="text-ink-secondary text-[11px]">Expires 15 Dec 2026</div>
                      </div>
                      <span className="text-[11px] font-semibold text-amber-700">Renewal soon</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Teaching */}
            {activeTab === "teaching" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border border-line rounded-card p-4 bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-ink">Current Teaching Schedule (26 Periods/Week)</h4>
                    <span className="text-xs text-primary font-medium">Timetable Session 2026-27</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-line bg-page text-ink-secondary font-semibold">
                          <th className="py-2 px-3">Class &amp; Section</th>
                          <th className="py-2 px-3">Subject</th>
                          <th className="py-2 px-3">Room</th>
                          <th className="py-2 px-3 text-right">Periods / Wk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/60">
                        <tr>
                          <td className="py-2 px-3 font-semibold text-ink">Class 8-B (Class Teacher)</td>
                          <td className="py-2 px-3">General Science</td>
                          <td className="py-2 px-3 text-ink-secondary">Room 204</td>
                          <td className="py-2 px-3 text-right font-mono font-medium">7</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-ink">Class 8-A</td>
                          <td className="py-2 px-3">General Science</td>
                          <td className="py-2 px-3 text-ink-secondary">Room 203</td>
                          <td className="py-2 px-3 text-right font-mono font-medium">6</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-ink">Class 9-A</td>
                          <td className="py-2 px-3">Chemistry</td>
                          <td className="py-2 px-3 text-ink-secondary">Chem Lab 1</td>
                          <td className="py-2 px-3 text-right font-mono font-medium">7</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-ink">Class 9-B</td>
                          <td className="py-2 px-3">Chemistry</td>
                          <td className="py-2 px-3 text-ink-secondary">Chem Lab 1</td>
                          <td className="py-2 px-3 text-right font-mono font-medium">6</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Attendance & Leave */}
            {activeTab === "attendance" && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-page border border-line rounded-control p-3 text-center">
                    <div className="text-ink-secondary">Casual Leave</div>
                    <div className="font-mono text-xl font-semibold text-ink mt-0.5">
                      {staff.leaveLeft?.cl ?? 8} / 12
                    </div>
                  </div>
                  <div className="bg-page border border-line rounded-control p-3 text-center">
                    <div className="text-ink-secondary">Sick Leave</div>
                    <div className="font-mono text-xl font-semibold text-ink mt-0.5">
                      {staff.leaveLeft?.sl ?? 9} / 10
                    </div>
                  </div>
                  <div className="bg-page border border-line rounded-control p-3 text-center">
                    <div className="text-ink-secondary">Earned Leave</div>
                    <div className="font-mono text-xl font-semibold text-ink mt-0.5">
                      {staff.leaveLeft?.el ?? 22} / 30
                    </div>
                  </div>
                </div>
                <div className="border border-line rounded-card p-4 bg-white space-y-2">
                  <h4 className="font-semibold text-ink">Biometric Punch Profile</h4>
                  <p className="text-ink-secondary">
                    Registered on Terminal 02 (Main Gate) and Terminal 04 (Admin Block). Shift: 07:30 AM – 02:30 PM.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 6: Salary */}
            {activeTab === "salary" && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <div className="border border-line rounded-card p-4 bg-white space-y-3">
                  <h4 className="font-semibold text-ink text-sm">Monthly Compensation Structure</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 border-r border-line pr-3">
                      <div className="font-semibold text-ink text-[13px]">Earnings</div>
                      <div className="flex justify-between"><span>Basic Pay</span><span className="font-mono">₹32,000</span></div>
                      <div className="flex justify-between"><span>Dearness Allowance (DA)</span><span className="font-mono">₹11,200</span></div>
                      <div className="flex justify-between"><span>House Rent Allowance (HRA)</span><span className="font-mono">₹6,400</span></div>
                      <div className="flex justify-between"><span>Special Teaching Allowance</span><span className="font-mono">₹2,800</span></div>
                      <div className="flex justify-between font-bold pt-1 border-t border-line"><span>Gross Salary</span><span className="font-mono text-primary">₹52,400</span></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="font-semibold text-ink text-[13px]">Deductions</div>
                      <div className="flex justify-between"><span>Provident Fund (PF)</span><span className="font-mono">₹1,800</span></div>
                      <div className="flex justify-between"><span>TDS / Income Tax</span><span className="font-mono">₹2,100</span></div>
                      <div className="flex justify-between"><span>Professional Tax (PT)</span><span className="font-mono">₹200</span></div>
                      <div className="flex justify-between font-bold pt-1 border-t border-line"><span>Total Deductions</span><span className="font-mono text-red-700">₹4,100</span></div>
                    </div>
                  </div>
                  <div className="p-3 bg-[#E3EFEF] rounded-control flex justify-between items-center text-sm font-semibold text-primary">
                    <span>Net Take-Home Monthly Salary</span>
                    <span className="font-mono text-base font-bold">₹48,300</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: Training & Appraisal */}
            {activeTab === "training" && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <div className="border border-line rounded-card p-4 bg-white space-y-2">
                  <h4 className="font-semibold text-ink">Continuous Professional Development (CPD)</h4>
                  <p className="text-ink-secondary">
                    Completed <b>32 of 50 mandatory hours</b> for academic year 2026-27 under NEP 2020 guidelines.
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "64%" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: Login & Roles */}
            {activeTab === "login" && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <div className="border border-line rounded-card p-4 bg-white space-y-3">
                  <h4 className="font-semibold text-ink">System Access &amp; Privileges</h4>
                  <div className="space-y-2 text-ink-secondary">
                    <div><b className="text-ink">User Role:</b> Teaching Staff (Standard)</div>
                    <div><b className="text-ink">Portal Username:</b> sunita.rathore@shiksha.edu</div>
                    <div><b className="text-ink">Access Capabilities:</b> Marks entry (Class 8-B, 8-A, 9-A, 9-B), Attendance register (8-B), Homework upload, Leave request</div>
                    <div><b className="text-ink">2FA Status:</b> SMS OTP Enabled</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {isMessageOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-5 space-y-4 font-sans animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <h3 className="font-semibold text-base text-ink">
                Send Direct Message to {staff.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsMessageOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="block text-ink-secondary font-medium mb-1">
                  Recipient Contact
                </label>
                <div className="p-2 bg-page border border-line rounded-control text-ink font-mono">
                  +91 {staff.phone} · {staff.email}
                </div>
              </div>
              <div>
                <label className="block text-ink-secondary font-medium mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type official notification, circular note, or timetable change reminder..."
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink focus:outline-none focus:border-primary text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMessageOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#08393F] text-white rounded-control font-semibold"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print ID Card Modal */}
      {isIdCardOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-sm shadow-xl p-6 space-y-5 font-sans animate-in fade-in zoom-in-95 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <span className="font-semibold text-xs text-ink-secondary uppercase tracking-wider">
                Official Staff Identity Card
              </span>
              <button
                type="button"
                onClick={() => setIsIdCardOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Physical ID Card Preview */}
            <div className="border-2 border-primary/40 rounded-card p-5 bg-gradient-to-b from-[#E3EFEF]/40 to-white shadow-md text-ink text-xs space-y-3">
              <div className="text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1.5">
                  {adminData?.logoUrl && (
                    <img
                      src={adminData.logoUrl}
                      alt={instituteName}
                      className="w-5 h-5 object-contain rounded-xs shrink-0"
                    />
                  )}
                  <div className="font-bold text-sm tracking-wide text-primary uppercase">{instituteName}</div>
                </div>
                <div className="text-[10px] text-ink-secondary">{instituteSubtitle}</div>
              </div>

              <div className="w-20 h-20 mx-auto rounded-card bg-[#0E5A63] text-white flex items-center justify-center text-2xl font-bold border-2 border-white shadow-xs">
                {initials}
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-base text-ink">{staff.name}</div>
                <div className="text-primary font-medium">{staff.role}</div>
                <div className="font-mono text-[11px] text-ink-secondary">{staff.empId}</div>
              </div>

              <div className="text-left text-[11px] border-t border-line/60 pt-2 space-y-1">
                <div className="flex justify-between"><span>Blood Group:</span><b>B+</b></div>
                <div className="flex justify-between"><span>Phone:</span><b>+91 {staff.phone}</b></div>
                <div className="flex justify-between"><span>Valid Till:</span><b>31 Mar 2028</b></div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-primary hover:bg-[#08393F] text-white rounded-control text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <FiPrinter size={14} /> Print ID Badge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-lg shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Edit Employee: {staff.name}</h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name || ""}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Hindi Name</label>
                  <input
                    type="text"
                    value={editFormData.hindiName || ""}
                    onChange={e => setEditFormData({ ...editFormData, hindiName: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none font-hindi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Designation / Role</label>
                  <input
                    type="text"
                    required
                    value={editFormData.role || ""}
                    onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Department</label>
                  <select
                    value={editFormData.department || "Science"}
                    onChange={e => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="Science">Science</option>
                    <option value="Maths">Maths</option>
                    <option value="Languages">Languages</option>
                    <option value="Primary wing">Primary wing</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Front office">Front office</option>
                    <option value="Sports">Sports</option>
                    <option value="Transport">Transport</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone || ""}
                    onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email || ""}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Periods / Week</label>
                  <input
                    type="number"
                    value={editFormData.periodsPerWeek || 24}
                    onChange={e => setEditFormData({ ...editFormData, periodsPerWeek: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Class Teacher Assignment</label>
                  <input
                    type="text"
                    placeholder="e.g. Class teacher 8-B"
                    value={editFormData.classTeacher || ""}
                    onChange={e => setEditFormData({ ...editFormData, classTeacher: e.target.value })}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#08393F] text-white rounded-control font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
