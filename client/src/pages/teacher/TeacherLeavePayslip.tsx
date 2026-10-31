import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  MdCalendarToday,
  MdAccessTime,
  MdFileDownload,
  MdAttachFile,
  MdClose,
  MdInfoOutline,
  MdFactCheck,
  MdReceiptLong,
  MdAccountBalance,
  MdSend,
} from "react-icons/md";
import { FiDownload, FiPaperclip } from "react-icons/fi";

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export type TabType = "leave" | "payslips" | "punchlog";

export interface LeaveRequestItem {
  id: string;
  type: "CL" | "SL" | "EL" | "DL";
  typeName: string;
  from: string;
  to: string;
  daysCount: number;
  isHalfDay: boolean;
  reason: string;
  appliedOn: string;
  status: "Pending" | "Approved" | "Rejected";
  approver: string;
  substitutionNote?: string;
  documentName?: string;
}

export interface MonthlyPayslip {
  id: string;
  monthYear: string;
  disbursedOn: string;
  basicPay: number;
  da: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  epf: number;
  profTax: number;
  tds: number;
  netPay: number;
  bankAccount: string;
  fileName: string;
}

export interface AttendancePunchLog {
  date: string;
  day: string;
  inTime: string;
  outTime: string;
  status: "Present" | "Late" | "Leave" | "Holiday";
  workingHours: string;
}

// ==========================================
// MOCK DATA
// ==========================================
const INITIAL_LEAVE_REQUESTS: LeaveRequestItem[] = [
  {
    id: "LR-2026-104",
    type: "CL",
    typeName: "Casual Leave",
    from: "2026-10-23",
    to: "2026-10-23",
    daysCount: 1,
    isHalfDay: false,
    reason: "Cousin's wedding function in Jaipur",
    appliedOn: "Today 9:15 AM",
    status: "Pending",
    approver: "Dr. Arvind Sharma (Principal)",
    substitutionNote: "5 periods queued for substitution (Class 8-B, 7-A, 7-B)",
  },
  {
    id: "LR-2026-089",
    type: "SL",
    typeName: "Sick Leave",
    from: "2026-09-14",
    to: "2026-09-15",
    daysCount: 2,
    isHalfDay: false,
    reason: "Acute viral fever & sore throat",
    appliedOn: "14 Sep 2026",
    status: "Approved",
    approver: "Dr. Arvind Sharma (Principal)",
    substitutionNote: "Substituted by Rachna Bose & Vandana Sharma",
    documentName: "Medical_Fitness_Certificate_15Sep.pdf",
  },
  {
    id: "LR-2026-072",
    type: "CL",
    typeName: "Casual Leave",
    from: "2026-08-18",
    to: "2026-08-19",
    daysCount: 2,
    isHalfDay: false,
    reason: "Urgent personal bank and ancestral property work",
    appliedOn: "16 Aug 2026",
    status: "Approved",
    approver: "Dr. Arvind Sharma (Principal)",
    substitutionNote: "Substituted by Pradeep Joshi",
  },
  {
    id: "LR-2026-041",
    type: "DL",
    typeName: "Duty Leave",
    from: "2026-07-03",
    to: "2026-07-03",
    daysCount: 1,
    isHalfDay: false,
    reason: "CBSE Regional Science Pedagogy Workshop at KV No. 1",
    appliedOn: "28 Jun 2026",
    status: "Approved",
    approver: "Dr. Arvind Sharma (Principal)",
    substitutionNote: "Official school deputation",
    documentName: "CBSE_Workshop_Invitation.pdf",
  },
];

const PAYSLIP_RECORDS: MonthlyPayslip[] = [
  {
    id: "PAY-2026-09",
    monthYear: "September 2026",
    disbursedOn: "01 Oct 2026",
    basicPay: 38000,
    da: 19000,
    hra: 6840,
    specialAllowance: 2500,
    conveyance: 1800,
    epf: 4560,
    profTax: 200,
    tds: 3200,
    netPay: 60180,
    bankAccount: "HDFC Bank · A/c •••• 4291",
    fileName: "Payslip_Sep_2026_Sunita_Rathore.pdf",
  },
  {
    id: "PAY-2026-08",
    monthYear: "August 2026",
    disbursedOn: "01 Sep 2026",
    basicPay: 38000,
    da: 19000,
    hra: 6840,
    specialAllowance: 2500,
    conveyance: 1800,
    epf: 4560,
    profTax: 200,
    tds: 3200,
    netPay: 60180,
    bankAccount: "HDFC Bank · A/c •••• 4291",
    fileName: "Payslip_Aug_2026_Sunita_Rathore.pdf",
  },
  {
    id: "PAY-2026-07",
    monthYear: "July 2026",
    disbursedOn: "01 Aug 2026",
    basicPay: 38000,
    da: 19000,
    hra: 6840,
    specialAllowance: 2500,
    conveyance: 1800,
    epf: 4560,
    profTax: 200,
    tds: 3200,
    netPay: 60180,
    bankAccount: "HDFC Bank · A/c •••• 4291",
    fileName: "Payslip_Jul_2026_Sunita_Rathore.pdf",
  },
  {
    id: "PAY-2026-06",
    monthYear: "June 2026",
    disbursedOn: "01 Jul 2026",
    basicPay: 38000,
    da: 19000,
    hra: 6840,
    specialAllowance: 2500,
    conveyance: 1800,
    epf: 4560,
    profTax: 200,
    tds: 3200,
    netPay: 60180,
    bankAccount: "HDFC Bank · A/c •••• 4291",
    fileName: "Payslip_Jun_2026_Sunita_Rathore.pdf",
  },
  {
    id: "PAY-2026-05",
    monthYear: "May 2026",
    disbursedOn: "01 Jun 2026",
    basicPay: 38000,
    da: 19000,
    hra: 6840,
    specialAllowance: 2500,
    conveyance: 1800,
    epf: 4560,
    profTax: 200,
    tds: 3200,
    netPay: 60180,
    bankAccount: "HDFC Bank · A/c •••• 4291",
    fileName: "Payslip_May_2026_Sunita_Rathore.pdf",
  },
];

const RECENT_PUNCH_LOGS: AttendancePunchLog[] = [
  { date: "14 Oct 2026", day: "Wednesday", inTime: "07:51 AM", outTime: "02:35 PM", status: "Present", workingHours: "6h 44m" },
  { date: "13 Oct 2026", day: "Tuesday", inTime: "07:48 AM", outTime: "02:40 PM", status: "Present", workingHours: "6h 52m" },
  { date: "12 Oct 2026", day: "Monday", inTime: "07:54 AM", outTime: "02:32 PM", status: "Present", workingHours: "6h 38m" },
  { date: "11 Oct 2026", day: "Sunday", inTime: "—", outTime: "—", status: "Holiday", workingHours: "Weekend" },
  { date: "10 Oct 2026", day: "Saturday", inTime: "07:50 AM", outTime: "01:15 PM", status: "Present", workingHours: "5h 25m" },
  { date: "09 Oct 2026", day: "Friday", inTime: "07:45 AM", outTime: "02:30 PM", status: "Present", workingHours: "6h 45m" },
  { date: "08 Oct 2026", day: "Thursday", inTime: "07:52 AM", outTime: "02:38 PM", status: "Present", workingHours: "6h 46m" },
];

const TeacherLeavePayslip: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const teacherName = user?.name || "Sunita Rathore";
  const teacherDesignation = user?.designation || "TGT Science";
  const instituteName = user?.instituteName || "Shiksha Public School";
  const empId = user?.employeeId || (user?._id ? `EMP-${String(user._id).slice(-6).toUpperCase()}` : "EMP-T-2026-042");

  // Navigation tab
  const [activeTab, setActiveTab] = useState<TabType>("leave");

  // Form State
  const [leaveType, setLeaveType] = useState<"CL" | "SL" | "EL" | "DL">("CL");
  const [fromDate, setFromDate] = useState("2026-10-23");
  const [toDate, setToDate] = useState("2026-10-23");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [reason, setReason] = useState("");
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Leave Requests state
  const [requests, setRequests] = useState<LeaveRequestItem[]>(INITIAL_LEAVE_REQUESTS);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "Pending" | "Approved">("ALL");

  // Payslip Modal State
  const [selectedPayslip, setSelectedPayslip] = useState<MonthlyPayslip | null>(null);

  // Policy Modal State
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Calculate day count
  const calculatedDays = useMemo(() => {
    if (isHalfDay) return 0.5;
    if (!fromDate || !toDate) return 1;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
  }, [fromDate, toDate, isHalfDay]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    if (statusFilter === "ALL") return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  // Handle Apply Form Submission
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast("Please enter a valid reason for leave application.", "warn");
      return;
    }

    const typeNames: Record<string, string> = {
      CL: "Casual Leave",
      SL: "Sick Leave",
      EL: "Earned Leave",
      DL: "Duty Leave",
    };

    const newReq: LeaveRequestItem = {
      id: `LR-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: leaveType,
      typeName: typeNames[leaveType] || "Casual Leave",
      from: fromDate,
      to: toDate,
      daysCount: calculatedDays,
      isHalfDay,
      reason: reason.trim(),
      appliedOn: "Just now",
      status: "Pending",
      approver: "Dr. Arvind Sharma (Principal)",
      substitutionNote: "5 periods queued for substitution roster allocation",
      documentName: attachedFile || undefined,
    };

    setRequests([newReq, ...requests]);
    setReason("");
    setAttachedFile(null);
    showToast(
      "Leave application submitted to Principal. 5 class periods routed for substitution coverage.",
      "success"
    );
  };

  // Handle File Attachment Simulation
  const handleSimulateAttachment = () => {
    setAttachedFile("Medical_Certificate_Oct2026.pdf");
    showToast("Attached document: Medical_Certificate_Oct2026.pdf", "info");
  };

  // Quick Reason Chips
  const QUICK_REASONS = [
    "Family function / wedding in Jaipur",
    "Medical consultation & health checkup",
    "Urgent personal bank & official work",
    "CBSE Science evaluation duty",
  ];

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
            <span className="text-primary font-semibold truncate">Leave & Payslip</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              Leave Management & Payslips
            </h1>
            <span className="px-2 py-0.5 rounded bg-primary-tint text-primary-dark font-bold text-xs shrink-0 font-mono">
              {teacherName} · {teacherDesignation}
            </span>
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Casual, sick and earned leave balances · Automated period substitution · Monthly salary slips & Form 16
          </div>
        </div>

        {/* Top-Right Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowPolicyModal(true)}
            className="px-3 py-1.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5"
          >
            <MdInfoOutline size={15} className="text-primary" />
            <span>Leave Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPayslip(PAYSLIP_RECORDS[0])}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MdReceiptLong size={16} />
            <span>Latest Payslip (Sep 2026)</span>
          </button>
        </div>
      </div>

      {/* ================= 4 LEAVE BALANCE KPI SUMMARY CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Casual Leave */}
        <div className="bg-surface border border-line rounded-card px-4 py-1 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Casual Leave (CL)</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Paid
            </span>
          </div>
          <div className="mt-1">
            <div className="font-mono text-lg font-bold text-ink">8 of 12</div>
            <div className="text-[11px] text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>4 used this year</span>
              <span className="text-emerald-700 font-semibold">Available</span>
            </div>
          </div>
        </div>

        {/* Card 2: Sick Leave */}
        <div className="bg-surface border border-line rounded-card px-4 py-1 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Sick Leave (SL)</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Medical
            </span>
          </div>
          <div className="mt-1">
            <div className="font-mono text-lg font-bold text-ink">9 of 10</div>
            <div className="text-[11px] text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>1 used in Sep</span>
              <span className="text-blue-700 font-semibold">Full Pay</span>
            </div>
          </div>
        </div>

        {/* Card 3: Earned Leave */}
        <div className="bg-surface border border-line rounded-card px-4 py-1 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Earned Leave (EL)</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-800 border border-purple-200">
              Cumulative
            </span>
          </div>
          <div className="mt-1">
            <div className="font-mono text-lg font-bold text-ink">22 Days</div>
            <div className="text-[11px] text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>Carry forwardable</span>
              <span className="text-purple-700 font-semibold">Encashable</span>
            </div>
          </div>
        </div>

        {/* Card 4: Monthly Attendance */}
        <div className="bg-surface border border-line rounded-card px-4 py-1 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Punch Record (Oct)</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary-tint text-primary-dark">
              100%
            </span>
          </div>
          <div className="mt-1">
            <div className="font-mono text-lg font-bold text-ink">12 / 12 Days</div>
            <div className="text-[11px] text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>0 Late arrivals</span>
              <span className="text-emerald-700 font-semibold">Avg 7:51 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b border-line pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("leave")}
          className={`px-3.5 py-1.5 rounded-control text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "leave"
              ? "bg-primary text-white shadow-2xs"
              : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
          }`}
        >
          <MdCalendarToday size={15} />
          <span>Apply & Leave Requests ({requests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payslips")}
          className={`px-3.5 py-1.5 rounded-control text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "payslips"
              ? "bg-primary text-white shadow-2xs"
              : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
          }`}
        >
          <MdReceiptLong size={16} />
          <span>Salary Slips & Form 16 ({PAYSLIP_RECORDS.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("punchlog")}
          className={`px-3.5 py-1.5 rounded-control text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "punchlog"
              ? "bg-primary text-white shadow-2xs"
              : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
          }`}
        >
          <MdAccessTime size={15} />
          <span>Biometric Punch Log</span>
        </button>
      </div>

      {/* ================= TAB 1: LEAVE APPLICATION & REQUESTS ================= */}
      {activeTab === "leave" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (5 Cols): Apply for Leave Card */}
          <section className="lg:col-span-5 bg-surface border border-line rounded-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <h2 className="text-sm font-semibold text-ink m-0">Apply for Leave</h2>
              <span className="text-[11px] text-ink-secondary">Approver: Principal</span>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3.5 text-xs">
              {/* Leave Type Selector */}
              <div>
                <label className="font-semibold text-ink block mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink font-medium focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="CL">Casual Leave (CL) · 8 days balance</option>
                  <option value="SL">Sick / Medical Leave (SL) · 9 days balance</option>
                  <option value="EL">Earned Leave (EL) · 22 days balance</option>
                  <option value="DL">Duty Leave (DL) · CBSE / Official workshop</option>
                </select>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink block mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink block mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Half Day & Duration Summary */}
              <div className="flex items-center justify-between p-2.5 rounded-control bg-surface-subtle border border-line">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isHalfDay}
                    onChange={(e) => setIsHalfDay(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                  />
                  <span className="font-semibold text-ink">Half-Day Leave</span>
                </label>
                <span className="font-bold text-primary font-mono text-xs">
                  Duration: {calculatedDays} {calculatedDays === 1 ? "Day" : "Days"}
                </span>
              </div>

              {/* Reason Input */}
              <div>
                <label className="font-semibold text-ink block mb-1">Reason for Leave</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Specify genuine reason (e.g. Cousin's wedding, doctor consultation)..."
                  className="w-full p-2.5 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                />

                {/* Quick Reason Suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                  {QUICK_REASONS.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReason(r)}
                      className="text-[10px] px-2 py-0.5 rounded bg-surface-subtle hover:bg-slate-200 border border-line text-ink-secondary hover:text-ink transition-colors cursor-pointer"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Attachment */}
              <div>
                <label className="font-semibold text-ink block mb-1">Supporting Document (Optional)</label>
                {attachedFile ? (
                  <div className="flex items-center justify-between p-2 rounded-control bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="flex items-center gap-1.5 text-xs truncate">
                      <FiPaperclip size={14} /> {attachedFile}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-1 text-emerald-800 hover:text-emerald-950 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSimulateAttachment}
                    className="w-full py-2 px-3 rounded-control border border-dashed border-line-input hover:border-primary bg-surface-subtle hover:bg-slate-50 text-ink-secondary hover:text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MdAttachFile size={16} />
                    <span>Upload Medical Slip / Invitation / Certificate</span>
                  </button>
                )}
              </div>

              {/* Substitution Warning Info Box */}
              <div className="p-3 rounded-control bg-amber-50/70 border border-amber-200 text-amber-900 leading-snug text-[11px] space-y-1">
                <span className="font-bold block flex items-center gap-1">
                  <MdFactCheck size={14} className="text-amber-800 shrink-0" />
                  Automatic Period Substitution Notice:
                </span>
                <p className="m-0">
                  Your 5 teaching periods on this date (Period 1: 8-B Science, Period 3: 7-A Science, Period 4: Lab, Period 6: 7-B Science, Period 7: CT Period) will be automatically opened for substitution in the Master Routine upon approval.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full min-h-[40px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <MdSend size={15} />
                <span>Submit Leave for Principal Approval</span>
              </button>
            </form>
          </section>

          {/* Right Column (7 Cols): My Leave Requests History */}
          <section className="lg:col-span-7 bg-surface border border-line rounded-card overflow-hidden shadow-xs">
            {/* Header & Filter */}
            <div className="p-3.5 px-5 border-b border-line flex items-center justify-between gap-3 bg-surface">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-ink m-0">Leave Applications & Approvals</h2>
                <span className="text-xs text-ink-secondary">({filteredRequests.length} records)</span>
              </div>

              <div className="flex items-center gap-1">
                {(["ALL", "Pending", "Approved"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                      statusFilter === st
                        ? "bg-primary text-white shadow-2xs"
                        : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
                    }`}
                  >
                    {st === "ALL" ? "All" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Requests List */}
            <div className="divide-y divide-line-row">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-ink-secondary text-xs">
                  No leave requests found for this filter.
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <div key={req.id} className="p-4 px-5 hover:bg-slate-50/70 transition-colors space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary-tint border border-primary-tint-border">
                          {req.type} · {req.daysCount} {req.daysCount === 1 ? "Day" : "Days"}
                        </span>
                        <span className="font-semibold text-xs text-ink">
                          {req.from === req.to ? req.from : `${req.from} to ${req.to}`}
                        </span>
                        <span className="text-[10px] text-ink-secondary font-mono">
                          ({req.id})
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : req.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                            : "bg-rose-100 text-rose-800 border border-rose-300"
                        }`}
                      >
                        {req.status === "Pending" ? "● Pending Approval" : "✓ Approved"}
                      </span>
                    </div>

                    <p className="text-xs text-ink m-0 font-medium">
                      {req.reason}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-ink-secondary pt-1 border-t border-line-row">
                      <div className="flex items-center gap-2">
                        <span>Applied: <strong>{req.appliedOn}</strong></span>
                        <span>·</span>
                        <span>Approver: {req.approver}</span>
                      </div>

                      {req.documentName && (
                        <button
                          type="button"
                          onClick={() => showToast(`Downloaded ${req.documentName}`, "success")}
                          className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <FiPaperclip size={12} />
                          <span>View Doc</span>
                        </button>
                      )}
                    </div>

                    {req.substitutionNote && (
                      <div className="text-[10.5px] text-ink-secondary bg-surface-subtle px-2.5 py-1 rounded border border-line">
                        ℹ️ {req.substitutionNote}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {/* ================= TAB 2: SALARY SLIPS & FORM 16 ================= */}
      {activeTab === "payslips" && (
        <div className="space-y-5">
          {/* Summary Banner */}
          <div className="bg-surface border border-line rounded-card p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <MdAccountBalance size={22} />
              </div>
              <div>
                <span className="font-semibold text-sm text-ink block">
                  Salary Account: HDFC Bank (Branch: Tilak Nagar)
                </span>
                <span className="text-xs text-ink-secondary">
                  Account No: •••••••• 4291 · IFSC: HDFC0001248 · Salary Cycle: 1st of each month
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-ink-secondary block">Latest Disbursed (Sep 2026)</span>
                <span className="font-mono text-lg font-bold text-primary">₹60,180</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayslip(PAYSLIP_RECORDS[0])}
                className="px-3.5 py-2 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <MdReceiptLong size={16} />
                <span>View Breakdown</span>
              </button>
            </div>
          </div>

          {/* Payslip Archive Table */}
          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-xs">
            <div className="p-3.5 px-5 border-b border-line flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink m-0">Monthly Salary Slips (Session 2026-27)</h2>
              <span className="text-xs text-ink-secondary">Auto-generated by School Accounts Dept.</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-surface-subtle border-b border-line text-ink-secondary font-semibold">
                    <th className="py-2.5 px-4">Pay Month</th>
                    <th className="py-2.5 px-4">Disbursed Date</th>
                    <th className="py-2.5 px-4 text-right">Gross Salary</th>
                    <th className="py-2.5 px-4 text-right">Deductions (EPF + TDS)</th>
                    <th className="py-2.5 px-4 text-right">Net Disbursed</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row">
                  {PAYSLIP_RECORDS.map((slip) => {
                    const gross = slip.basicPay + slip.da + slip.hra + slip.specialAllowance + slip.conveyance;
                    const deductions = slip.epf + slip.profTax + slip.tds;
                    return (
                      <tr key={slip.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-ink">
                          {slip.monthYear}
                        </td>
                        <td className="py-3 px-4 text-ink-secondary">
                          {slip.disbursedOn}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-ink">
                          ₹{gross.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-rose-700">
                          - ₹{deductions.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-primary">
                          ₹{slip.netPay.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10.5px]">
                            ✓ Credited
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedPayslip(slip)}
                              className="px-2.5 py-1 rounded border border-line hover:bg-white text-ink text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                showToast(`Downloading official PDF for ${slip.monthYear}`, "success")
                              }
                              className="p-1.5 rounded bg-primary-tint text-primary hover:bg-primary-tint/80 transition-colors cursor-pointer"
                              title="Download PDF"
                            >
                              <FiDownload size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Form 16 Row */}
                  <tr className="bg-amber-50/40 hover:bg-amber-50/80 transition-colors border-t border-line">
                    <td className="py-3 px-4 font-semibold text-ink">
                      Form 16 · Annual Tax Certificate (FY 2025-26)
                    </td>
                    <td className="py-3 px-4 text-ink-secondary">
                      Issued 31 May 2026
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-ink">
                      ₹7,80,000 / annum
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-700">
                      TDS Total: ₹38,400
                    </td>
                    <td className="py-3 px-4 text-right text-ink-secondary">
                      Part A & Part B
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[10.5px]">
                        Verified
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => showToast("Downloaded Form 16 (Part A & B).pdf", "success")}
                        className="px-3 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FiDownload size={12} /> Form 16
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ================= TAB 3: BIOMETRIC PUNCH LOG ================= */}
      {activeTab === "punchlog" && (
        <section className="bg-surface border border-line rounded-card overflow-hidden shadow-xs space-y-3 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <h2 className="text-sm font-semibold text-ink m-0">Biometric Attendance Punch Logs (October 2026)</h2>
              <span className="text-xs text-ink-secondary">School Gate Biometric Terminal · Official shift: 07:45 AM to 02:30 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                100% Punctuality Score
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-surface-subtle border-b border-line text-ink-secondary font-semibold">
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Day</th>
                  <th className="py-2.5 px-4">Punch In</th>
                  <th className="py-2.5 px-4">Punch Out</th>
                  <th className="py-2.5 px-4">Working Hours</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-row">
                {RECENT_PUNCH_LOGS.map((punch, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-ink">
                      {punch.date}
                    </td>
                    <td className="py-2.5 px-4 text-ink-secondary">
                      {punch.day}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-ink">
                      {punch.inTime}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-ink">
                      {punch.outTime}
                    </td>
                    <td className="py-2.5 px-4 text-ink-secondary font-mono">
                      {punch.workingHours}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10.5px] ${
                          punch.status === "Present"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-surface-subtle text-ink-secondary border border-line"
                        }`}
                      >
                        {punch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= MODAL 1: FORMAL SALARY BREAKDOWN SLIP ================= */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-line flex items-center justify-between bg-surface-subtle">
              <div>
                <h3 className="text-base font-semibold text-ink m-0">
                  Salary Slip · {selectedPayslip.monthYear}
                </h3>
                <span className="text-xs text-ink-secondary">
                  {instituteName} · Employee: {teacherName} ({empId})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayslip(null)}
                className="p-1 rounded text-ink-secondary hover:text-ink hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              {/* Employee & Bank Info */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-control bg-surface-subtle border border-line text-[11.5px]">
                <div>
                  <span className="text-ink-secondary block">Designation:</span>
                  <strong>{teacherDesignation}</strong>
                </div>
                <div>
                  <span className="text-ink-secondary block">Bank Account:</span>
                  <strong className="font-mono">{selectedPayslip.bankAccount}</strong>
                </div>
                <div>
                  <span className="text-ink-secondary block">Disbursed Date:</span>
                  <strong>{selectedPayslip.disbursedOn}</strong>
                </div>
                <div>
                  <span className="text-ink-secondary block">Payment Mode:</span>
                  <strong className="text-emerald-700">NEFT / Direct Bank Transfer</strong>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left: Earnings */}
                <div className="space-y-1.5 p-3 rounded-control border border-line bg-surface">
                  <span className="font-bold text-ink block text-[11px] pb-1 border-b border-line text-emerald-800">
                    Earnings (A)
                  </span>
                  <div className="flex justify-between"><span>Basic Pay:</span><strong className="font-mono">₹{selectedPayslip.basicPay.toLocaleString("en-IN")}</strong></div>
                  <div className="flex justify-between"><span>DA (50%):</span><strong className="font-mono">₹{selectedPayslip.da.toLocaleString("en-IN")}</strong></div>
                  <div className="flex justify-between"><span>HRA (18%):</span><strong className="font-mono">₹{selectedPayslip.hra.toLocaleString("en-IN")}</strong></div>
                  <div className="flex justify-between"><span>Spl Allowance:</span><strong className="font-mono">₹{selectedPayslip.specialAllowance.toLocaleString("en-IN")}</strong></div>
                  <div className="flex justify-between"><span>Conveyance:</span><strong className="font-mono">₹{selectedPayslip.conveyance.toLocaleString("en-IN")}</strong></div>
                  <div className="border-t border-line pt-1 flex justify-between font-bold text-ink">
                    <span>Gross Earnings:</span>
                    <strong className="font-mono text-emerald-700">
                      ₹{(selectedPayslip.basicPay + selectedPayslip.da + selectedPayslip.hra + selectedPayslip.specialAllowance + selectedPayslip.conveyance).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                {/* Right: Deductions */}
                <div className="space-y-1.5 p-3 rounded-control border border-line bg-surface">
                  <span className="font-bold text-ink block text-[11px] pb-1 border-b border-line text-rose-800">
                    Deductions (B)
                  </span>
                  <div className="flex justify-between"><span>EPF (Staff):</span><strong className="font-mono">₹{selectedPayslip.epf.toLocaleString("en-IN")}</strong></div>
                  <div className="flex justify-between"><span>Prof. Tax:</span><strong className="font-mono">₹{selectedPayslip.profTax.toLocaleString("en-IN")}</strong></div>
                  <div className="flex justify-between"><span>TDS (IT):</span><strong className="font-mono">₹{selectedPayslip.tds.toLocaleString("en-IN")}</strong></div>
                  <div className="border-t border-line pt-1 flex justify-between font-bold text-ink">
                    <span>Total Deductions:</span>
                    <strong className="font-mono text-rose-700">
                      ₹{(selectedPayslip.epf + selectedPayslip.profTax + selectedPayslip.tds).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Net Disbursed Banner */}
              <div className="p-3.5 rounded-control bg-primary-tint border border-primary-tint-border flex items-center justify-between">
                <div>
                  <span className="text-xs text-primary-dark font-medium block">Net Disbursed Take-Home</span>
                  <span className="text-[11px] text-ink-secondary">Transferred to HDFC Bank A/c 4291</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-primary">
                    ₹{selectedPayslip.netPay.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-6 border-t border-line bg-surface-subtle flex items-center justify-between">
              <span className="text-[11px] text-ink-secondary">System-generated slip with digital stamp.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayslip(null)}
                  className="px-3.5 py-1.5 rounded-control border border-line-input text-ink text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Official PDF downloaded: ${selectedPayslip.fileName}`, "success");
                    setSelectedPayslip(null);
                  }}
                  className="px-4 py-1.5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MdFileDownload size={15} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: LEAVE POLICY GUIDELINES ================= */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 px-6 border-b border-line flex items-center justify-between bg-surface-subtle">
              <h3 className="text-base font-semibold text-ink m-0">
                Staff Leave Policy & Rules
              </h3>
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="p-1 rounded text-ink-secondary hover:text-ink hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs leading-relaxed text-ink">
              <div>
                <strong>1. Casual Leave (CL):</strong> 12 days per academic session. Max 3 consecutive days without prior written sanction. Unavailed CL lapses at year end.
              </div>
              <div>
                <strong>2. Medical / Sick Leave (SL):</strong> 10 days per academic session. Medical fitness certificate required from a registered MBBS practitioner for absence exceeding 2 days.
              </div>
              <div>
                <strong>3. Earned Leave (EL):</strong> Credited annually as per CBSE service bylaws. Up to 300 days can be accumulated for retirement encashment.
              </div>
              <div>
                <strong>4. Substitution Routing:</strong> When leave is approved, your timetable periods are automatically released to the Academic Coordinator for substitute teacher assignment.
              </div>
            </div>

            <div className="p-3.5 px-6 border-t border-line bg-surface-subtle flex justify-end">
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="px-4 py-1.5 rounded-control bg-primary text-white font-semibold text-xs hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLeavePayslip;
