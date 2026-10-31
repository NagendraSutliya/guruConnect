import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  MdFactCheck,
  MdMenuBook,
  MdGrade,
  MdSearch,
  MdFileDownload,
  MdSend,
  MdWarningAmber,
  MdChatBubbleOutline,
  MdPhone,
  MdClose,
  MdCheck,
  MdAttachFile
} from "react-icons/md";

interface StudentRecord {
  roll: string;
  name: string;
  attendancePct: number;
  homeworkPct: number;
  latestResult: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  notes?: string;
  healthAlert?: string;
}

interface LeaveRequest {
  id: string;
  student: string;
  roll: string;
  dates: string;
  reason: string;
  hasDoc: boolean;
  appliedOn: string;
}

const DEFAULT_STUDENTS: StudentRecord[] = [
  { roll: "01", name: "Aditi Sharma", attendancePct: 96, homeworkPct: 100, latestResult: "Term 1 · A2", guardianName: "Sanjay Sharma", guardianRelation: "Father", guardianPhone: "+91 98290 12345" },
  { roll: "02", name: "Bhavesh Kumar", attendancePct: 92, homeworkPct: 92, latestResult: "Term 1 · B1", guardianName: "Rajesh Kumar", guardianRelation: "Father", guardianPhone: "+91 98290 23456" },
  { roll: "03", name: "Charu Mehta", attendancePct: 98, homeworkPct: 100, latestResult: "Term 1 · A1", guardianName: "Sunil Mehta", guardianRelation: "Father", guardianPhone: "+91 98290 34567" },
  { roll: "04", name: "Dev Saini", attendancePct: 71, homeworkPct: 60, latestResult: "Term 1 · C2", guardianName: "Kamlesh & Kusum Saini", guardianRelation: "Parents", guardianPhone: "+91 98290 45678", notes: "Absent 3 days in a row with viral fever. Remedial support needed for Chapter 5.", healthAlert: "Seasonal fever recovering" },
  { roll: "05", name: "Esha Gupta", attendancePct: 90, homeworkPct: 88, latestResult: "Term 1 · B1", guardianName: "Manoj Gupta", guardianRelation: "Father", guardianPhone: "+91 98290 56789" },
  { roll: "06", name: "Faizan Ali", attendancePct: 95, homeworkPct: 96, latestResult: "Term 1 · A2", guardianName: "Imran Ali", guardianRelation: "Father", guardianPhone: "+91 98290 67890" },
  { roll: "07", name: "Garima Joshi", attendancePct: 88, homeworkPct: 80, latestResult: "Term 1 · C1", guardianName: "Mukesh Joshi", guardianRelation: "Father", guardianPhone: "+91 98290 78901" },
  { roll: "08", name: "Hitesh Yadav", attendancePct: 93, homeworkPct: 90, latestResult: "Term 1 · B2", guardianName: "Dinesh Yadav", guardianRelation: "Father", guardianPhone: "+91 98290 89012" },
  { roll: "09", name: "Isha Kanwar", attendancePct: 97, homeworkPct: 100, latestResult: "Term 1 · A1", guardianName: "Vikram Kanwar", guardianRelation: "Father", guardianPhone: "+91 98290 90123", notes: "Applied for 2 days leave on 14-15 Oct." },
  { roll: "10", name: "Jatin Soni", attendancePct: 85, homeworkPct: 76, latestResult: "Term 1 · C2", guardianName: "Vijay Soni", guardianRelation: "Father", guardianPhone: "+91 98290 01234" },
  { roll: "11", name: "Kriti Bansal", attendancePct: 94, homeworkPct: 95, latestResult: "Term 1 · B1", guardianName: "Ramesh Bansal", guardianRelation: "Father", guardianPhone: "+91 98290 11223" },
  { roll: "12", name: "Lakshay Jain", attendancePct: 91, homeworkPct: 89, latestResult: "Term 1 · A2", guardianName: "Praveen Jain", guardianRelation: "Father", guardianPhone: "+91 98290 22334" },
  { roll: "13", name: "Manvi Rathore", attendancePct: 99, homeworkPct: 100, latestResult: "Term 1 · A1", guardianName: "Raghav Rathore", guardianRelation: "Father", guardianPhone: "+91 98290 33445" },
  { roll: "14", name: "Naman Verma", attendancePct: 89, homeworkPct: 85, latestResult: "Term 1 · B2", guardianName: "Suresh Verma", guardianRelation: "Father", guardianPhone: "+91 98290 44556" },
  { roll: "15", name: "Pranav Dixit", attendancePct: 93, homeworkPct: 92, latestResult: "Term 1 · A2", guardianName: "Alok Dixit", guardianRelation: "Father", guardianPhone: "+91 98290 55667" },
  { roll: "16", name: "Riya Shekhawat", attendancePct: 96, homeworkPct: 98, latestResult: "Term 1 · A1", guardianName: "Gajendra Shekhawat", guardianRelation: "Father", guardianPhone: "+91 98290 66778" }
];

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "lr-1",
    student: "Isha Kanwar",
    roll: "09",
    dates: "14–15 Oct",
    reason: "Viral fever",
    hasDoc: true,
    appliedOn: "Today 8:15 AM",
  },
  {
    id: "lr-2",
    student: "Kriti Bansal",
    roll: "11",
    dates: "20 Oct",
    reason: "Family function in hometown",
    hasDoc: false,
    appliedOn: "Yesterday 4:30 PM",
  },
];

export default function TeacherMyClass() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const teacherName = user?.name || "Sunita Rathore";

  const [students] = useState<StudentRecord[]>(DEFAULT_STUDENTS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "atRisk" | "high" | "leave">("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Notice broadcast modal
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeText, setNoticeText] = useState("");
  const [noticePriority, setNoticePriority] = useState<"normal" | "urgent">("normal");

  // Leave approval actions
  const handleApproveLeave = (id: string, name: string) => {
    setLeaveRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(`Leave approved for ${name}. Attendance register marked as Approved Leave.`, "success");
  };

  const handleRejectLeave = (id: string, name: string) => {
    setLeaveRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(`Leave request rejected for ${name}`, "info");
  };

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeText.trim()) return;
    showToast("Class broadcast notice sent to all parents of 8-B via mobile app and SMS.", "success");
    setNoticeTitle("");
    setNoticeText("");
    setShowNoticeModal(false);
  };

  const handleExportRoster = () => {
    showToast("Exporting Class 8-B roster to CSV/Excel...", "info");
  };

  // Filter & Search Logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.roll.includes(q) ||
        s.guardianName.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Filter tabs
      if (activeFilter === "atRisk") return s.attendancePct < 75;
      if (activeFilter === "high") return s.latestResult.includes("A1") || s.latestResult.includes("A2");
      if (activeFilter === "leave") return s.notes?.toLowerCase().includes("leave");

      return true;
    });
  }, [students, searchQuery, activeFilter]);

  // Helper for Grade Badge Styling
  const getGradeBadge = (gradeStr: string) => {
    if (gradeStr.includes("A1")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold whitespace-nowrap";
    }
    if (gradeStr.includes("A2")) {
      return "bg-emerald-50/70 text-emerald-800 border-emerald-200/70 font-semibold whitespace-nowrap";
    }
    if (gradeStr.includes("B1") || gradeStr.includes("B2")) {
      return "bg-blue-50 text-blue-700 border-blue-200/80 font-semibold whitespace-nowrap";
    }
    if (gradeStr.includes("C1") || gradeStr.includes("C2")) {
      return "bg-amber-50 text-amber-800 border-amber-200/80 font-semibold whitespace-nowrap";
    }
    return "bg-surface-subtle text-ink-secondary border-line whitespace-nowrap";
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-fadeIn font-sans pb-12">
      {/* ================= HEADER SECTION (SINGLE LINE ON LAPTOP) ================= */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="text-xs sm:text-[13px] text-ink-secondary flex items-center gap-1.5 mb-0.5 truncate">
            <Link to="/teacher/dashboard" className="hover:text-primary transition-colors shrink-0">
              Teacher Panel
            </Link>
            <span>›</span>
            <span className="text-ink shrink-0">My Class (8-B)</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              My Class · 8-B
            </h1>
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Class teacher portal · 38 enrolled students · {teacherName} · Room 21 (Science Wing)
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportRoster}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5"
          >
            <MdFileDownload size={15} className="text-primary" />
            <span>Export Roster</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNoticeModal(true)}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MdSend size={15} />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* ================= 4 KPI SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Attendance */}
        <div className="px-4 py-1 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Today's Attendance
            </span>
            <div className="w-8 h-8 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
              <MdFactCheck size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold text-ink">94.7%</div>
            <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>36 Present · 1 Absent</span>
              <span className="text-primary font-semibold">1 on leave</span>
            </div>
          </div>
        </div>

        {/* Card 2: Attendance Alert */}
        <div className="px-4 py-1 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Below 75% Criteria
            </span>
            <div className="w-8 h-8 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center">
              <MdWarningAmber size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold text-amber-700">1 Student</div>
            <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>Dev Saini (71%)</span>
              <span className="text-amber-700 font-semibold">Action needed</span>
            </div>
          </div>
        </div>

        {/* Card 3: Weekly Homework */}
        <div className="px-4 py-1 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Homework Rate
            </span>
            <div className="w-8 h-8 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MdMenuBook size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold text-ink">91.2%</div>
            <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>348 of 380 tasks submitted</span>
              <span className="text-emerald-700 font-semibold">This week</span>
            </div>
          </div>
        </div>

        {/* Card 4: Term Remarks */}
        <div className="px-4 py-1 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Term 1 Remarks
            </span>
            <div className="w-8 h-8 rounded-control bg-purple-50 text-purple-700 flex items-center justify-center">
              <MdGrade size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold text-ink">26 / 38 Done</div>
            <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>12 remarks pending</span>
              <span className="text-purple-700 font-semibold">Due 16 Oct</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN TWO-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ================= LEFT COLUMN (SPAN 8): ROSTER TABLE ================= */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Search & Filter Toolbar */}
          <div className="p-3 bg-surface border border-line rounded-card shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="search"
                placeholder="Search student by name, roll, guardian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors"
              />
              <MdSearch size={16} className="absolute left-2.5 top-2.5 text-ink-secondary pointer-events-none" />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-2.5 py-1 rounded-control text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === "all"
                    ? "bg-primary text-white shadow-xs"
                    : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
                }`}
              >
                All ({students.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("atRisk")}
                className={`px-2.5 py-1 rounded-control text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === "atRisk"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-amber-800 hover:bg-amber-50"
                }`}
              >
                At Risk (1)
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("high")}
                className={`px-2.5 py-1 rounded-control text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === "high"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-800 hover:bg-emerald-50"
                }`}
              >
                Top Grades (A1/A2)
              </button>
            </div>
          </div>

          {/* Student Records Table Card */}
          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[740px]">
                <thead>
                  <tr className="bg-surface-head text-ink-secondary font-semibold border-b border-line">
                    <th className="py-3 px-3.5 text-center w-12 whitespace-nowrap">Roll</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Student</th>
                    <th className="py-3 px-3.5 text-center whitespace-nowrap">Attendance</th>
                    <th className="py-3 px-3.5 text-center whitespace-nowrap">Homework</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Term Result</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Guardian Contact</th>
                    <th className="py-3 px-3.5 text-right w-24 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-ink-secondary text-xs">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const isLowAtt = s.attendancePct < 75;
                      return (
                        <tr
                          key={s.roll}
                          onClick={() => setSelectedStudent(s)}
                          className="hover:bg-surface-subtle transition-colors cursor-pointer group"
                        >
                          {/* Roll Number */}
                          <td className="py-2 px-3 text-center font-mono font-bold text-ink-secondary">
                            {s.roll}
                          </td>

                          {/* Student Name & Avatar */}
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-primary-tint text-primary-dark font-bold text-[11px] flex items-center justify-center shrink-0 border border-primary/20">
                                {s.name[0]}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-ink group-hover:text-primary transition-colors truncate">
                                  {s.name}
                                </span>
                                {s.notes && (
                                  <span className="text-[10px] text-amber-700 font-medium truncate max-w-[160px]">
                                    ⚠️ {s.notes}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Attendance */}
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                                isLowAtt
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-surface-subtle text-ink font-semibold"
                              }`}
                            >
                              {s.attendancePct}%
                            </span>
                          </td>

                          {/* Homework Done */}
                          <td className="py-2 px-3 text-center">
                            <span className="font-mono text-xs font-semibold text-ink">
                              {s.homeworkPct}%
                            </span>
                          </td>

                          {/* Latest Result */}
                          <td className="py-2 px-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center whitespace-nowrap text-[11px] px-2.5 py-0.5 rounded-full border ${getGradeBadge(
                                s.latestResult
                              )}`}
                            >
                              {s.latestResult}
                            </span>
                          </td>

                          {/* Guardian Name */}
                          <td className="py-2 px-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-ink truncate">{s.guardianName}</span>
                              <span className="text-[10px] text-ink-secondary">{s.guardianRelation}</span>
                            </div>
                          </td>

                          {/* Action Button */}
                          <td
                            className="py-2 px-3 text-right"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/teacher/messages");
                            }}
                          >
                            <button
                              type="button"
                              className="p-1.5 rounded-control text-primary hover:bg-primary-tint hover:text-primary-dark transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                              title="Message parent"
                            >
                              <MdChatBubbleOutline size={15} />
                              <span className="hidden sm:inline">Message</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="p-3 bg-surface-head border-t border-line flex items-center justify-between text-xs text-ink-secondary">
              <span>Showing {filteredStudents.length} of {students.length} students</span>
              <span className="font-medium">Class 8-B · Academic Year 2026-27</span>
            </div>
          </section>
        </div>

        {/* ================= RIGHT COLUMN (SPAN 4): ASIDE CARDS ================= */}
        <aside className="lg:col-span-4 space-y-4">
          
          {/* Card 1: Leave Requests from Parents */}
          <section className="bg-surface border border-line rounded-card p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-ink">Parent Leave Requests</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-primary-tint text-primary-dark">
                  {leaveRequests.length} pending
                </span>
              </div>
            </div>

            {leaveRequests.length === 0 ? (
              <div className="py-6 text-center text-ink-secondary text-xs">
                No pending leave requests.
              </div>
            ) : (
              <div className="divide-y divide-line-row">
                {leaveRequests.map((lr) => (
                  <div key={lr.id} className="py-3 first:pt-1 last:pb-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-ink">{lr.student}</span>
                          <span className="text-[10px] font-mono text-ink-secondary">Roll {lr.roll}</span>
                        </div>
                        <p className="text-xs text-ink-secondary mt-0.5">
                          {lr.dates} · <span className="text-ink font-medium">{lr.reason}</span>
                        </p>
                        {lr.hasDoc && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary mt-1">
                            <MdAttachFile size={12} /> Doctor note attached
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-ink-secondary shrink-0">{lr.appliedOn}</span>
                    </div>

                    {/* Approve / Reject Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApproveLeave(lr.id, lr.student)}
                        className="flex-1 py-1.5 px-3 rounded-control bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <MdCheck size={14} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectLeave(lr.id, lr.student)}
                        className="py-1.5 px-3 rounded-control border border-line-input bg-surface text-ink text-xs font-medium hover:bg-surface-subtle transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Card 2: Needs Immediate Attention Alert Card */}
          <section className="bg-amber-50/70 border border-amber-300 rounded-card p-4 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                <MdWarningAmber size={15} />
              </div>
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Needs Immediate Attention
              </h3>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Dev Saini (Roll 04)</strong> attendance has dropped to <strong>71%</strong> this term (absent 3 consecutive days with viral fever).
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate("/teacher/messages")}
                className="w-full py-1.5 px-3 rounded-control bg-amber-200/80 hover:bg-amber-200 text-amber-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MdChatBubbleOutline size={14} /> Contact Guardian: Kamlesh Saini
              </button>
            </div>
          </section>

          {/* Card 3: Quick Navigation Shortcuts */}
          {/* <section className="bg-surface border border-line rounded-card p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider pb-2 border-b border-line">
              Class 8-B Quick Actions
            </h3>
            <div className="space-y-1.5">
              <Link
                to="/teacher/attendance"
                className="flex items-center justify-between p-2.5 rounded-control hover:bg-surface-subtle border border-transparent hover:border-line text-xs font-semibold text-ink transition-all group"
              >
                <span className="flex items-center gap-2">
                  <MdFactCheck size={16} className="text-primary" /> Mark Class Attendance
                </span>
                <MdArrowForward size={14} className="text-ink-secondary group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/teacher/homework"
                className="flex items-center justify-between p-2.5 rounded-control hover:bg-surface-subtle border border-transparent hover:border-line text-xs font-semibold text-ink transition-all group"
              >
                <span className="flex items-center gap-2">
                  <MdMenuBook size={16} className="text-emerald-600" /> Post Daily Homework
                </span>
                <MdArrowForward size={14} className="text-ink-secondary group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/teacher/results"
                className="flex items-center justify-between p-2.5 rounded-control hover:bg-surface-subtle border border-transparent hover:border-line text-xs font-semibold text-ink transition-all group"
              >
                <span className="flex items-center gap-2">
                  <MdGrade size={16} className="text-purple-600" /> Enter Term 1 Remarks
                </span>
                <MdArrowForward size={14} className="text-ink-secondary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section> */}

        </aside>
      </div>

      {/* ================= MODAL: STUDENT PROFILE CARD ================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card max-w-md w-full shadow-2xl overflow-hidden flex flex-col font-sans">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-line bg-surface-head flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-tint text-primary-dark font-bold text-sm flex items-center justify-center border border-primary/20 shrink-0">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink leading-tight">
                    {selectedStudent.name}
                  </h3>
                  <span className="text-xs text-ink-secondary">
                    Class 8-B · Roll #{selectedStudent.roll}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-control text-ink-secondary hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Metric Row */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-subtle border border-line rounded-card text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block">
                    Term Attendance
                  </span>
                  <span
                    className={`font-mono font-bold text-sm mt-0.5 block ${
                      selectedStudent.attendancePct < 75 ? "text-amber-700" : "text-ink"
                    }`}
                  >
                    {selectedStudent.attendancePct}%
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block">
                    Homework Completion
                  </span>
                  <span className="font-mono font-bold text-sm text-ink mt-0.5 block">
                    {selectedStudent.homeworkPct}%
                  </span>
                </div>

                <div className="pt-2 border-t border-line">
                  <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block">
                    Latest Assessment
                  </span>
                  <span className="font-semibold text-ink mt-0.5 block">
                    {selectedStudent.latestResult}
                  </span>
                </div>

                <div className="pt-2 border-t border-line">
                  <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block">
                    Guardian
                  </span>
                  <span className="font-medium text-ink mt-0.5 block">
                    {selectedStudent.guardianName} ({selectedStudent.guardianRelation})
                  </span>
                </div>
              </div>

              {/* Guardian Phone & Contact */}
              <div className="p-3 bg-surface border border-line rounded-card flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MdPhone size={16} className="text-primary" />
                  <div>
                    <span className="text-[10px] text-ink-secondary block">Guardian Contact</span>
                    <span className="font-mono font-semibold text-ink">{selectedStudent.guardianPhone}</span>
                  </div>
                </div>
                <a
                  href={`tel:${selectedStudent.guardianPhone.replace(/\s+/g, '')}`}
                  className="px-2.5 py-1 rounded-control bg-primary-tint text-primary-dark font-semibold text-xs hover:bg-primary/20 transition-colors"
                >
                  Call
                </a>
              </div>

              {/* Notes */}
              {selectedStudent.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-card text-xs text-amber-900 leading-relaxed">
                  <strong>Teacher's Private Note:</strong> {selectedStudent.notes}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-line bg-surface-subtle flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSelectedStudent(null);
                  navigate("/teacher/messages");
                }}
                className="px-3 py-1.5 rounded-control bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <MdChatBubbleOutline size={14} /> Message Parent
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-3.5 py-1.5 rounded-control border border-line-input bg-surface text-ink text-xs font-medium hover:bg-surface-subtle transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: BROADCAST CLASS NOTICE ================= */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <form
            onSubmit={handleSendNotice}
            className="bg-surface border border-line rounded-card max-w-lg w-full shadow-2xl overflow-hidden flex flex-col font-sans"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-line bg-surface-head flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink leading-tight">
                  Broadcast Notice to Class 8-B
                </h3>
                <span className="text-xs text-ink-secondary">
                  Delivered instantly to parents & guardians of all 38 students.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowNoticeModal(false)}
                className="p-1 rounded-control text-ink-secondary hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Notice Subject
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Science Lab Project Materials Reminder"
                  className="w-full h-9 px-3 rounded-control border border-line-input bg-surface text-xs text-ink placeholder:text-ink-secondary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  required
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder="Enter the announcement or instructions for parents..."
                  className="w-full p-3 rounded-control border border-line-input bg-surface text-xs text-ink placeholder:text-ink-secondary focus:border-primary focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="font-semibold text-ink-secondary">Priority:</span>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    checked={noticePriority === "normal"}
                    onChange={() => setNoticePriority("normal")}
                    className="accent-primary"
                  />
                  <span>Normal (Daily Diary)</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    checked={noticePriority === "urgent"}
                    onChange={() => setNoticePriority("urgent")}
                    className="accent-primary"
                  />
                  <span className="text-amber-800 font-semibold">Urgent Push Alert</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-line bg-surface-subtle flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowNoticeModal(false)}
                className="px-3.5 py-1.5 rounded-control border border-line-input bg-surface text-ink text-xs font-medium hover:bg-surface-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-control bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <MdSend size={14} /> Send Broadcast
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
