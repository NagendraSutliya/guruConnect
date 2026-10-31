import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import {
  MdFactCheck,
  MdCheckCircle,
  MdWarningAmber,
  MdEventAvailable,
  MdSearch,
  MdFileDownload,
  MdHistory,
  MdEdit,
  MdLock,
  MdWifi,
  MdWifiOff,
  MdCheck,
  MdClose,
  MdDoneAll,
  MdViewModule,
  MdViewList,
  MdArrowBack,
  MdArrowForward,
  MdCalendarToday,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

export type AttendanceStatus = "P" | "A" | "L" | "HD" | "LT";

export interface StudentAttendanceItem {
  roll: string;
  name: string;
  status: AttendanceStatus;
  note?: string;
  isLocked?: boolean;
  gender?: "M" | "F";
  guardianPhone?: string;
  monthlyPct?: number;
}

const INITIAL_STUDENTS: StudentAttendanceItem[] = [
  { roll: "01", name: "Aditi Sharma", status: "P", gender: "F", guardianPhone: "+91 98290 12345", monthlyPct: 96 },
  { roll: "02", name: "Bhavesh Kumar", status: "P", gender: "M", guardianPhone: "+91 98290 23456", monthlyPct: 92 },
  { roll: "03", name: "Charu Mehta", status: "P", gender: "F", guardianPhone: "+91 98290 34567", monthlyPct: 98 },
  { roll: "04", name: "Dev Saini", status: "A", note: "Absent — parent will be notified", gender: "M", guardianPhone: "+91 98290 45678", monthlyPct: 71 },
  { roll: "05", name: "Esha Gupta", status: "P", gender: "F", guardianPhone: "+91 98290 56789", monthlyPct: 90 },
  { roll: "06", name: "Faizan Ali", status: "P", gender: "M", guardianPhone: "+91 98290 67890", monthlyPct: 95 },
  { roll: "07", name: "Garima Joshi", status: "P", gender: "F", guardianPhone: "+91 98290 78901", monthlyPct: 88 },
  { roll: "08", name: "Hitesh Yadav", status: "P", gender: "M", guardianPhone: "+91 98290 89012", monthlyPct: 93 },
  { roll: "09", name: "Isha Kanwar", status: "P", gender: "F", guardianPhone: "+91 98290 90123", monthlyPct: 97 },
  { roll: "10", name: "Jatin Soni", status: "LT", note: "Late arrival (15 min)", gender: "M", guardianPhone: "+91 98290 01234", monthlyPct: 85 },
  { roll: "11", name: "Kriti Bansal", status: "P", gender: "F", guardianPhone: "+91 98290 11223", monthlyPct: 94 },
  { roll: "12", name: "Lakshay Jain", status: "L", note: "Leave approved (parent request) · locked", isLocked: true, gender: "M", guardianPhone: "+91 98290 22334", monthlyPct: 91 },
  { roll: "13", name: "Manav Verma", status: "P", gender: "M", guardianPhone: "+91 98290 33445", monthlyPct: 89 },
  { roll: "14", name: "Nisha Pareek", status: "P", gender: "F", guardianPhone: "+91 98290 44556", monthlyPct: 95 },
  { roll: "15", name: "Ojasvi Rathore", status: "P", gender: "F", guardianPhone: "+91 98290 55667", monthlyPct: 93 },
  { roll: "16", name: "Pooja Choudhary", status: "P", gender: "F", guardianPhone: "+91 98290 66778", monthlyPct: 96 },
  { roll: "17", name: "Pranav Singh", status: "P", gender: "M", guardianPhone: "+91 98290 77889", monthlyPct: 92 },
  { roll: "18", name: "Rahul Saini", status: "P", gender: "M", guardianPhone: "+91 98290 88990", monthlyPct: 90 },
  { roll: "19", name: "Riya Sen", status: "P", gender: "F", guardianPhone: "+91 98290 99001", monthlyPct: 97 },
  { roll: "20", name: "Siddharth Jain", status: "P", gender: "M", guardianPhone: "+91 98290 10101", monthlyPct: 94 },
  { roll: "21", name: "Sneha Goyal", status: "P", gender: "F", guardianPhone: "+91 98290 20202", monthlyPct: 91 },
  { roll: "22", name: "Tanvi Saxena", status: "P", gender: "F", guardianPhone: "+91 98290 30303", monthlyPct: 96 },
  { roll: "23", name: "Udit Sharma", status: "P", gender: "M", guardianPhone: "+91 98290 40404", monthlyPct: 89 },
  { roll: "24", name: "Vaibhav Meena", status: "P", gender: "M", guardianPhone: "+91 98290 50505", monthlyPct: 93 },
  { roll: "25", name: "Yashvi Tiwari", status: "P", gender: "F", guardianPhone: "+91 98290 60606", monthlyPct: 95 },
  { roll: "26", name: "Aarav Gupta", status: "P", gender: "M", guardianPhone: "+91 98290 70707", monthlyPct: 92 },
  { roll: "27", name: "Ananya Dixit", status: "P", gender: "F", guardianPhone: "+91 98290 80808", monthlyPct: 98 },
  { roll: "28", name: "Aryan Chauhan", status: "P", gender: "M", guardianPhone: "+91 98290 90909", monthlyPct: 87 },
  { roll: "29", name: "Deepak Rawat", status: "P", gender: "M", guardianPhone: "+91 98290 01010", monthlyPct: 91 },
  { roll: "30", name: "Divya Joshi", status: "P", gender: "F", guardianPhone: "+91 98290 12121", monthlyPct: 94 },
  { roll: "31", name: "Gaurav Vyas", status: "P", gender: "M", guardianPhone: "+91 98290 23232", monthlyPct: 90 },
  { roll: "32", name: "Harsh Vardhan", status: "P", gender: "M", guardianPhone: "+91 98290 34343", monthlyPct: 88 },
  { roll: "33", name: "Kashish Jain", status: "P", gender: "F", guardianPhone: "+91 98290 45454", monthlyPct: 97 },
  { roll: "34", name: "Kavya Soni", status: "P", gender: "F", guardianPhone: "+91 98290 56565", monthlyPct: 93 },
  { roll: "35", name: "Mayank Pareek", status: "P", gender: "M", guardianPhone: "+91 98290 67676", monthlyPct: 89 },
  { roll: "36", name: "Nikita Sharma", status: "P", gender: "F", guardianPhone: "+91 98290 78787", monthlyPct: 96 },
  { roll: "37", name: "Parth Saini", status: "P", gender: "M", guardianPhone: "+91 98290 89898", monthlyPct: 92 },
  { roll: "38", name: "Rohan Meena", status: "P", gender: "M", guardianPhone: "+91 98290 90901", monthlyPct: 91 },
];

const RECENT_HISTORY = [
  { date: "12 Oct (Mon)", present: 37, absent: 1, leave: 0, late: 0, pct: "97.4%" },
  { date: "10 Oct (Sat)", present: 36, absent: 2, leave: 0, late: 0, pct: "94.7%" },
  { date: "09 Oct (Fri)", present: 35, absent: 1, leave: 1, late: 1, pct: "94.7%" },
  { date: "08 Oct (Thu)", present: 36, absent: 1, leave: 1, late: 0, pct: "96.1%" },
  { date: "07 Oct (Wed)", present: 38, absent: 0, leave: 0, late: 0, pct: "100%" },
];

const AttendancePanel: React.FC = () => {
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState("8-B (class teacher)");
  const [students, setStudents] = useState<StudentAttendanceItem[]>(INITIAL_STUDENTS);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "P" | "A" | "L" | "LT" | "HD">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected date simulation
  const [selectedDate, setSelectedDate] = useState("2026-10-13");
  const dateFormatted = useMemo(() => {
    try {
      const d = new Date(selectedDate);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Remark editing modal state
  const [editingStudent, setEditingStudent] = useState<StudentAttendanceItem | null>(null);
  const [remarkInput, setRemarkInput] = useState("");

  // History modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Compute live counts
  const counts = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let halfDay = 0;
    let late = 0;

    students.forEach((s) => {
      if (s.status === "P") present++;
      else if (s.status === "A") absent++;
      else if (s.status === "L") leave++;
      else if (s.status === "HD") halfDay++;
      else if (s.status === "LT") late++;
    });

    const total = students.length;
    // Late and Half Day are physically present for part of day
    const effectivePresent = present + late + halfDay * 0.5;
    const pct = total > 0 ? ((effectivePresent / total) * 100).toFixed(1) : "0.0";

    return { present, absent, leave, halfDay, late, total, pct };
  }, [students]);

  // Check if all unlocked students are marked Present
  const isAllPresent = useMemo(() => {
    const unlocked = students.filter((s) => !s.isLocked);
    return unlocked.length > 0 && unlocked.every((s) => s.status === "P");
  }, [students]);

  // Toggle between Mark All Present <-> Mark All Absent
  const handleToggleAllAttendance = () => {
    if (isAllPresent) {
      setStudents((prev) =>
        prev.map((s) =>
          s.isLocked
            ? s
            : { ...s, status: "A", note: "Absent — parent will be notified" }
        )
      );
      showToast("Toggled: Marked all unlocked students as Absent", "info");
    } else {
      setStudents((prev) =>
        prev.map((s) => (s.isLocked ? s : { ...s, status: "P", note: "" }))
      );
      showToast("Toggled: Marked all unlocked students as Present", "success");
    }
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => (s.isLocked ? s : { ...s, status: "P", note: "" }))
    );
    showToast("Reset all unlocked students to Present", "info");
  };

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roll.includes(searchQuery);

      if (!matchSearch) return false;

      if (statusFilter === "ALL") return true;
      return s.status === statusFilter;
    });
  }, [students, searchQuery, statusFilter]);

  // Reset page when search or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedStudents = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, activePage, pageSize]);

  const handleStatusChange = (roll: string, newStatus: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.roll !== roll) return s;
        if (s.isLocked) {
          showToast("This student's leave was approved by office/guardian and is locked.", "info");
          return s;
        }
        let note = s.note || "";
        if (newStatus === "P") {
          note = "";
        } else if (newStatus === "A") {
          note = "Absent — parent will be notified";
        } else if (newStatus === "LT" && (!note || note.includes("Absent"))) {
          note = "Late arrival";
        } else if (newStatus === "HD" && (!note || note.includes("Absent"))) {
          note = "Half day recorded";
        } else if (newStatus === "L" && (!note || note.includes("Absent"))) {
          note = "Student on leave";
        }
        return { ...s, status: newStatus, note };
      })
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const timeStr = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setSubmittedAt(timeStr);
      showToast(
        isOffline
          ? "Attendance queued offline. Will sync automatically when connection restores."
          : `Attendance submitted for 8-B at ${timeStr}. Parents notified.`,
        "success"
      );
    }, 600);
  };

  const handleSaveRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setStudents((prev) =>
      prev.map((s) =>
        s.roll === editingStudent.roll ? { ...s, note: remarkInput.trim() } : s
      )
    );
    showToast(`Note updated for Roll ${editingStudent.roll} (${editingStudent.name})`, "success");
    setEditingStudent(null);
    setRemarkInput("");
  };

  const handleOpenRemarkModal = (student: StudentAttendanceItem) => {
    setEditingStudent(student);
    setRemarkInput(student.note || "");
  };

  const handleExportCSV = () => {
    showToast(`Exported Class 8-B attendance register for ${dateFormatted}`, "info");
  };

  // Avatar helper
  const getAvatarInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name.slice(0, 2) || "ST").toUpperCase();
  };

  const getAvatarBg = (roll: string) => {
    const n = parseInt(roll, 10) || 1;
    const colors = [
      "bg-teal-50 text-teal-800 border-teal-200/80",
      "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      "bg-blue-50 text-blue-800 border-blue-200/80",
      "bg-indigo-50 text-indigo-800 border-indigo-200/80",
      "bg-slate-100 text-slate-700 border-slate-300",
      "bg-cyan-50 text-cyan-800 border-cyan-200/80",
    ];
    return colors[n % colors.length];
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-fadeIn font-sans pb-10">
      {/* ================= HEADER SECTION WITH TOP-RIGHT DATE FILTER (SINGLE LINE ON LAPTOP) ================= */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex flex-col gap-0.5 min-w-0">
          {/* Breadcrumb */}
          <div className="text-xs sm:text-[13px] text-ink-secondary flex items-center gap-1.5 mb-0.5 truncate">
            <Link to="/teacher/dashboard" className="hover:text-primary transition-colors shrink-0">
              Teacher Panel
            </Link>
            <span>›</span>
            <span className="text-ink shrink-0">Daily Attendance</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              Attendance Register · Class 8-B
            </h1>
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Class teacher register · Cut-off 10:00 am · Default is Present · Tap exceptions only
          </div>
        </div>

        {/* Top-Right Controls: Live Sync + Date Filter */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Sync / Offline Toggle Pill */}
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className={`h-9 inline-flex items-center gap-1.5 px-3 rounded-control text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
              isOffline
                ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
            }`}
            title="Click to toggle simulated offline mode"
          >
            {isOffline ? (
              <>
                <MdWifiOff size={13} className="text-amber-700" />
                <span>Offline Queue</span>
              </>
            ) : (
              <>
                <MdWifi size={13} className="text-emerald-700" />
                <span>Live Sync</span>
              </>
            )}
          </button>

          {/* Modern Interactive Date Filter Pill */}
          <div className="flex items-center gap-1.5 bg-surface border border-line-input/80 rounded-control p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                const prev = new Date(selectedDate);
                prev.setDate(prev.getDate() - 1);
                setSelectedDate(prev.toISOString().split("T")[0]);
              }}
              className="w-8 h-8 rounded text-ink-secondary hover:text-ink hover:bg-surface-subtle transition-colors flex items-center justify-center cursor-pointer"
              title="Previous Day"
            >
              <MdArrowBack size={16} />
            </button>

            {/* Date Picker Button with native calendar trigger */}
            <label className="relative flex items-center gap-2 px-3 py-1.5 rounded bg-surface-subtle hover:bg-slate-100 border border-line transition-colors cursor-pointer group">
              <MdCalendarToday size={15} className="text-primary group-hover:scale-105 transition-transform shrink-0" />
              <span className="text-xs font-bold text-ink whitespace-nowrap">
                {dateFormatted}
              </span>
              <span className="text-[10px] text-ink-secondary">▼</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Select date"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                const next = new Date(selectedDate);
                next.setDate(next.getDate() + 1);
                setSelectedDate(next.toISOString().split("T")[0]);
              }}
              className="w-8 h-8 rounded text-ink-secondary hover:text-ink hover:bg-surface-subtle transition-colors flex items-center justify-center cursor-pointer"
              title="Next Day"
            >
              <MdArrowForward size={16} />
            </button>

            {/* Quick Jump Today Pill */}
            {selectedDate !== "2026-10-13" ? (
              <button
                type="button"
                onClick={() => setSelectedDate("2026-10-13")}
                className="px-2.5 py-1 text-xs font-bold text-primary bg-primary-tint/60 hover:bg-primary-tint rounded transition-colors cursor-pointer"
                title="Jump to Today"
              >
                Today
              </button>
            ) : (
              <span className="px-2 py-0.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded">
                Today
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= SUBMITTED NOTIFICATION BANNER ================= */}
      {submittedAt && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-card flex flex-wrap justify-between items-center gap-3 text-emerald-900 text-small font-medium shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <MdCheckCircle size={18} />
            </div>
            <span>
              Attendance submitted for <strong>8-B</strong> at <strong>{submittedAt}</strong>. Parents
              of absent and late students notified via SMS and App. Editable today until 6:00 pm.
            </span>
          </div>
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="text-emerald-800 underline text-xs font-semibold hover:text-emerald-950 transition-colors ml-auto sm:ml-0"
          >
            Re-open / Reset Draft
          </button>
        </div>
      )}

      {/* ================= 4 KPI SUMMARY CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Attendance Rate */}
        <div className="p-4 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Attendance Rate
            </span>
            <div className="w-8 h-8 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
              <MdFactCheck size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-ink">{counts.pct}%</div>
            <div className="text-xs text-ink-secondary mt-1 flex items-center justify-between">
              <span>Benchmark: ≥ 90%</span>
              <span className="text-emerald-700 font-semibold">On Target</span>
            </div>
          </div>
        </div>

        {/* Card 2: Present Today */}
        <div className="p-4 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Present Today
            </span>
            <div className="w-8 h-8 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MdCheckCircle size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-800">
              {counts.present}{" "}
              <span className="text-xs font-normal text-ink-secondary">/ {counts.total}</span>
            </div>
            <div className="text-xs text-ink-secondary mt-1 flex items-center justify-between">
              <span>Physically in class</span>
              <span className="text-emerald-700 font-semibold">{counts.total - counts.present} exceptions</span>
            </div>
          </div>
        </div>

        {/* Card 3: Absent & Late */}
        <div className="p-4 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Absent & Late
            </span>
            <div className="w-8 h-8 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center">
              <MdWarningAmber size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold font-mono text-amber-800">
              {counts.absent} <span className="text-xs font-normal text-ink-secondary">Absent</span> ·{" "}
              {counts.late} <span className="text-xs font-normal text-ink-secondary">Late</span>
            </div>
            <div className="text-xs text-ink-secondary mt-1 flex items-center justify-between">
              <span>{counts.absent > 0 ? "SMS alert triggers on submit" : "Zero absentees"}</span>
              <span className="text-amber-700 font-semibold">{counts.absent + counts.late} alerts</span>
            </div>
          </div>
        </div>

        {/* Card 4: Approved Leave & Half-day */}
        <div className="px-4 py-1 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Leave & Half-Day
            </span>
            <div className="w-8 h-8 rounded-control bg-blue-50 text-blue-700 flex items-center justify-center">
              <MdEventAvailable size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold font-mono text-blue-800">
              {counts.leave} <span className="text-xs font-normal text-ink-secondary">Leave</span> ·{" "}
              {counts.halfDay} <span className="text-xs font-normal text-ink-secondary">HD</span>
            </div>
            <div className="text-xs text-ink-secondary mt-1 flex items-center justify-between">
              <span>1 pre-approved by office</span>
              <span className="text-blue-700 font-semibold">1 locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ROSTER TOOLBAR: CLASS, SEARCH & VIEW ================= */}
      <div className="p-3 bg-surface border border-line rounded-card shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Class Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
            Class:
          </span>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              aria-label="Select Class"
              className="h-9 pl-3 pr-8 rounded-control border border-line-input bg-surface-subtle text-xs font-semibold text-ink focus:border-primary focus:outline-none shadow-2xs cursor-pointer appearance-none min-w-[200px]"
            >
              <option value="8-B (class teacher)">Class 8-B · Class Teacher</option>
              <option value="Period 2 · 7-A Science">Period 2 · 7-A Science</option>
              <option value="Period 4 · 8-A Science">Period 4 · 8-A Science</option>
              <option value="Period 5 · 7-B Science">Period 5 · 7-B Science</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* Right: Search Bar & View Mode Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1 justify-end">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <MdSearch
              size={16}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or roll..."
              className="w-full pl-8 pr-7 h-9 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary/60 focus:bg-surface focus:border-primary focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-control border border-line-input bg-surface-subtle p-0.5 h-9">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-2.5 h-full rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === "grid"
                  ? "bg-white text-ink shadow-2xs font-semibold"
                  : "text-ink-secondary hover:text-ink"
              }`}
              title="2-Column Grid View"
            >
              <MdViewModule size={15} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-2.5 h-full rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === "table"
                  ? "bg-white text-ink shadow-2xs font-semibold"
                  : "text-ink-secondary hover:text-ink"
              }`}
              title="Table View"
            >
              <MdViewList size={15} />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= STUDENT LIST CONTAINER WITH TABLE HEADER ================= */}
      <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
        {/* Table Header: Left [Toggle Mark All + Status Pills] | Right [Register History + Export] */}
        <div className="p-2.5 px-4 border-b border-line-row bg-surface-head flex flex-wrap items-center justify-between gap-3">
          {/* Left: Mark All Present/Absent Toggle + Status Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle Button: Mark All Present <-> Mark All Absent */}
            <button
              type="button"
              onClick={handleToggleAllAttendance}
              className={`h-8 px-3 rounded-control border text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-[0.98] ${
                isAllPresent
                  ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                  : "bg-primary-tint/70 border-primary-tint-border text-primary-dark hover:bg-primary-tint"
              }`}
              title={
                isAllPresent
                  ? "Toggle: Mark all unlocked students as absent"
                  : "Toggle: Mark all unlocked students as present"
              }
            >
              {isAllPresent ? (
                <>
                  <MdClose size={15} className="text-rose-600" />
                  <span>Mark All Absent</span>
                </>
              ) : (
                <>
                  <MdDoneAll size={15} className="text-primary" />
                  <span>Mark All Present</span>
                </>
              )}
            </button>

            {/* Status Filter Pills */}
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-ink text-white shadow-xs"
                  : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
              }`}
            >
              All ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("P")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "P"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
              }`}
            >
              Present ({counts.present})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("A")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "A"
                  ? "bg-rose-700 text-white shadow-xs"
                  : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
              }`}
            >
              Absent ({counts.absent})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("L")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "L"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
              }`}
            >
              On Leave ({counts.leave})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("LT")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "LT"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
              }`}
            >
              Late ({counts.late})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("HD")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "HD"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
              }`}
            >
              Half Day ({counts.halfDay})
            </button>
          </div>

          {/* Right: Register History & Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="h-8 px-3.5 rounded-control border border-line-input bg-surface hover:bg-slate-50 text-ink text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              title="View Attendance History"
            >
              <MdHistory size={16} className="text-primary" />
              <span>Register History</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="h-8 px-3.5 rounded-control border border-line-input bg-surface hover:bg-slate-50 text-ink text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              title="Export to CSV"
            >
              <MdFileDownload size={16} className="text-primary" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: 2-COLUMN GRID (TOUCH-FRIENDLY CARDS) */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-line-row">
            {filteredStudents.length === 0 ? (
              <div className="col-span-2 p-12 text-center text-ink-secondary text-body">
                No students match your filter or search query.
              </div>
            ) : (
              paginatedStudents.map((s, idx) => {
                const isAbsent = s.status === "A";
                const isLate = s.status === "LT";
                const isLeave = s.status === "L";
                const isHalfDay = s.status === "HD";

                return (
                  <div
                    key={s.roll}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 px-4 border-b border-line-row transition-all ${
                      idx % 2 === 0 ? "md:border-r" : ""
                    } ${
                      isAbsent
                        ? "bg-rose-50/40 border-l-4 border-l-rose-500"
                        : isLate
                        ? "bg-amber-50/40 border-l-4 border-l-amber-500"
                        : isLeave
                        ? "bg-blue-50/30 border-l-4 border-l-blue-500"
                        : isHalfDay
                        ? "bg-purple-50/30 border-l-4 border-l-purple-500"
                        : "bg-surface hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Left: Roll, Avatar, Name & Remark Note */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Roll Badge */}
                      <span className="font-mono text-xs font-bold text-ink-secondary bg-surface-subtle border border-line-input/60 rounded px-1.5 py-0.5 w-7 text-center shrink-0">
                        {s.roll}
                      </span>

                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${getAvatarBg(
                          s.roll
                        )}`}
                      >
                        {getAvatarInitials(s.name)}
                      </div>

                      {/* Student Info */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-small font-semibold text-ink truncate">
                            {s.name}
                          </span>
                          {s.isLocked && (
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200"
                              title="Leave approved by office. Status locked."
                            >
                              <MdLock size={11} /> Locked
                            </span>
                          )}
                          {s.monthlyPct && s.monthlyPct < 75 && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              Low Avg ({s.monthlyPct}%)
                            </span>
                          )}
                        </div>

                        {/* Note / Subtext */}
                        <div className="flex items-center gap-2 text-caption">
                          {s.note ? (
                            <span
                              className={`truncate font-medium flex items-center gap-1 ${
                                isAbsent
                                  ? "text-rose-700"
                                  : isLate
                                  ? "text-amber-700"
                                  : isLeave
                                  ? "text-blue-700"
                                  : "text-ink-secondary"
                              }`}
                            >
                              {s.note}
                            </span>
                          ) : (
                            <span className="text-ink-secondary/70 truncate">
                              Monthly: {s.monthlyPct}% · Reg. Guardian
                            </span>
                          )}

                          {/* Edit Remark Note Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenRemarkModal(s)}
                            className="text-ink-secondary hover:text-primary transition-colors p-0.5"
                            title="Add / Edit note for this student"
                          >
                            <MdEdit size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Fast Status Segmented Buttons (P, A, L, HD, LT) */}
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                      {/* P: Present */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.roll, "P")}
                        disabled={s.isLocked}
                        className={`min-w-[34px] min-h-[34px] rounded-control border text-xs font-bold transition-all cursor-pointer ${
                          s.status === "P"
                            ? "bg-primary border-primary text-white shadow-xs scale-105"
                            : "bg-surface border-line-input text-ink-secondary hover:bg-emerald-50 hover:text-primary hover:border-primary-tint"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title="Mark Present"
                      >
                        P
                      </button>

                      {/* A: Absent */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.roll, "A")}
                        disabled={s.isLocked}
                        className={`min-w-[34px] min-h-[34px] rounded-control border text-xs font-bold transition-all cursor-pointer ${
                          s.status === "A"
                            ? "bg-rose-600 border-rose-600 text-white shadow-xs scale-105"
                            : "bg-surface border-line-input text-ink-secondary hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title="Mark Absent"
                      >
                        A
                      </button>

                      {/* L: Leave */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.roll, "L")}
                        disabled={s.isLocked}
                        className={`min-w-[34px] min-h-[34px] rounded-control border text-xs font-bold transition-all cursor-pointer ${
                          s.status === "L"
                            ? "bg-blue-600 border-blue-600 text-white shadow-xs scale-105"
                            : "bg-surface border-line-input text-ink-secondary hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                        } disabled:opacity-80 disabled:cursor-not-allowed`}
                        title={s.isLocked ? "Locked Approved Leave" : "Mark Leave"}
                      >
                        L
                      </button>

                      {/* HD: Half Day */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.roll, "HD")}
                        disabled={s.isLocked}
                        className={`min-w-[34px] min-h-[34px] rounded-control border text-xs font-bold transition-all cursor-pointer ${
                          s.status === "HD"
                            ? "bg-purple-600 border-purple-600 text-white shadow-xs scale-105"
                            : "bg-surface border-line-input text-ink-secondary hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title="Mark Half Day"
                      >
                        HD
                      </button>

                      {/* LT: Late Arrival */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.roll, "LT")}
                        disabled={s.isLocked}
                        className={`min-w-[34px] min-h-[34px] rounded-control border text-xs font-bold transition-all cursor-pointer ${
                          s.status === "LT"
                            ? "bg-amber-500 border-amber-500 text-white shadow-xs scale-105"
                            : "bg-surface border-line-input text-ink-secondary hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title="Mark Late Arrival"
                      >
                        LT
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* View Mode 2: TABLE VIEW (SINGLE COMPACT LIST) */}
        {viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-line-row bg-surface-subtle text-caption font-semibold text-ink-secondary">
                  <th className="py-2.5 px-4 w-14">Roll</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4 w-28">Monthly %</th>
                  <th className="py-2.5 px-4 w-40">Remark / Reason</th>
                  <th className="py-2.5 px-4 w-52 text-right">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-row">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-secondary text-small">
                      No students found matching your query.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => {
                    return (
                      <tr
                        key={s.roll}
                        className={`transition-colors ${
                          s.status === "A"
                            ? "bg-rose-50/40"
                            : s.status === "LT"
                            ? "bg-amber-50/40"
                            : s.status === "L"
                            ? "bg-blue-50/30"
                            : s.status === "HD"
                            ? "bg-purple-50/30"
                            : "hover:bg-slate-50/50"
                        }`}
                      >
                        <td className="py-2.5 px-4 font-mono text-small font-semibold text-ink-secondary">
                          {s.roll}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${getAvatarBg(
                                s.roll
                              )}`}
                            >
                              {getAvatarInitials(s.name)}
                            </div>
                            <span className="text-small font-semibold text-ink">{s.name}</span>
                            {s.isLocked && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                <MdLock size={10} /> Locked
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`text-small font-semibold ${
                              s.monthlyPct && s.monthlyPct < 75
                                ? "text-amber-700"
                                : "text-emerald-700"
                            }`}
                          >
                            {s.monthlyPct}%
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-ink-secondary truncate max-w-[200px]">
                              {s.note || "—"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenRemarkModal(s)}
                              className="text-ink-secondary hover:text-primary transition-colors p-0.5"
                              title="Edit note"
                            >
                              <MdEdit size={13} />
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.roll, "P")}
                              disabled={s.isLocked}
                              className={`w-7 h-7 rounded text-xs font-bold border transition-colors ${
                                s.status === "P"
                                  ? "bg-primary border-primary text-white"
                                  : "bg-surface border-line-input text-ink-secondary hover:bg-slate-100"
                              } disabled:opacity-40`}
                            >
                              P
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.roll, "A")}
                              disabled={s.isLocked}
                              className={`w-7 h-7 rounded text-xs font-bold border transition-colors ${
                                s.status === "A"
                                  ? "bg-rose-600 border-rose-600 text-white"
                                  : "bg-surface border-line-input text-ink-secondary hover:bg-slate-100"
                              } disabled:opacity-40`}
                            >
                              A
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.roll, "L")}
                              disabled={s.isLocked}
                              className={`w-7 h-7 rounded text-xs font-bold border transition-colors ${
                                s.status === "L"
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "bg-surface border-line-input text-ink-secondary hover:bg-slate-100"
                              } disabled:opacity-80`}
                            >
                              L
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.roll, "HD")}
                              disabled={s.isLocked}
                              className={`w-7 h-7 rounded text-xs font-bold border transition-colors ${
                                s.status === "HD"
                                  ? "bg-purple-600 border-purple-600 text-white"
                                  : "bg-surface border-line-input text-ink-secondary hover:bg-slate-100"
                              } disabled:opacity-40`}
                            >
                              HD
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(s.roll, "LT")}
                              disabled={s.isLocked}
                              className={`w-7 h-7 rounded text-xs font-bold border transition-colors ${
                                s.status === "LT"
                                  ? "bg-amber-500 border-amber-500 text-white"
                                  : "bg-surface border-line-input text-ink-secondary hover:bg-slate-100"
                              } disabled:opacity-40`}
                            >
                              LT
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= TABLE PAGINATION BAR ================= */}
        <div className="p-3 px-4 border-t border-line-row bg-surface-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Range Display */}
          <div className="text-ink-secondary">
            {filteredStudents.length === 0 ? (
              <span>Showing 0 of 0 students</span>
            ) : (
              <span>
                Showing{" "}
                <strong className="text-ink">
                  {(activePage - 1) * pageSize + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-ink">
                  {Math.min(activePage * pageSize, filteredStudents.length)}
                </strong>{" "}
                of <strong className="text-ink">{filteredStudents.length}</strong> students
              </span>
            )}
          </div>

          {/* Right: Rows per page & Page navigation */}
          <div className="flex items-center gap-3 ml-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-ink-secondary">
              <span className="text-[11px]">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-7 px-2 rounded-control border border-line-input bg-surface text-ink text-xs font-semibold focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={38}>All (38)</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={activePage <= 1}
                className="h-7 w-7 rounded-control border border-line-input bg-surface hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-surface text-ink flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                title="Previous Page"
              >
                <MdChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-7 min-w-[28px] px-1.5 rounded-control text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                    activePage === pageNum
                      ? "bg-primary border-primary text-white font-bold"
                      : "bg-surface border-line-input text-ink hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={activePage >= totalPages}
                className="h-7 w-7 rounded-control border border-line-input bg-surface hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-surface text-ink flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                title="Next Page"
              >
                <MdChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM SUBMISSION BAR (UNDER TABLE) ================= */}
      <div className="p-4 bg-surface border border-line rounded-card shadow-xs flex flex-wrap justify-between items-center gap-4">
        {/* Left: Summary Metrics Tally */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs font-medium text-ink">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-small text-ink">Class 8-B Summary:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              {counts.present} P
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
              {counts.absent} A
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
              {counts.leave} L
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
              {counts.halfDay} HD
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
              {counts.late} LT
            </span>
          </div>
          <span className="text-ink-secondary hidden lg:inline">
            Effective Attendance: <strong>{counts.pct}%</strong> · SMS dispatched on submit
          </span>
        </div>

        {/* Right: Reset & Submit Buttons */}
        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 rounded-control border border-line-input bg-surface hover:bg-slate-50 text-ink text-small font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            Reset Draft
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-h-[42px] px-6 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-small transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : submittedAt ? (
              <>
                <MdCheck size={18} />
                <span>Update Submission</span>
              </>
            ) : (
              <>
                <MdCheckCircle size={18} />
                <span>Submit Attendance</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= EDIT REMARK / NOTE MODAL ================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface rounded-card border border-line shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-line-row bg-surface-head flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-ink">Add / Edit Remark</h3>
                <p className="text-caption text-ink-secondary">
                  Roll {editingStudent.roll} · {editingStudent.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-control text-ink-secondary hover:text-ink hover:bg-slate-200/60"
              >
                <MdClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRemark} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Remark / Reason Note
                </label>
                <textarea
                  rows={3}
                  value={remarkInput}
                  onChange={(e) => setRemarkInput(e.target.value)}
                  placeholder="e.g. Doctor's appointment, bus breakdown, severe headache..."
                  className="w-full p-2.5 rounded-control border border-line-input bg-surface text-small text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="block text-xs text-ink-secondary mb-1.5 font-medium">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Doctor's appointment",
                    "Traffic / Bus delay",
                    "Fever & cold",
                    "Family emergency",
                    "Early departure requested",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRemarkInput(preset)}
                      className="text-xs px-2.5 py-1 rounded-full bg-surface-subtle border border-line hover:border-primary-tint hover:bg-primary-tint/30 text-ink-secondary transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-line-row">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-small font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-control bg-primary hover:bg-primary-dark text-white text-small font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= REGISTER HISTORY MODAL ================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface rounded-card border border-line shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-line-row bg-surface-head flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-ink">Class 8-B · Recent Register History</h3>
                <p className="text-caption text-ink-secondary">
                  Past 5 instructional days audit log
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-control text-ink-secondary hover:text-ink hover:bg-slate-200/60"
              >
                <MdClose size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <table className="w-full text-left text-small border-collapse">
                <thead>
                  <tr className="border-b border-line-row text-caption text-ink-secondary font-semibold">
                    <th className="py-2">Date</th>
                    <th className="py-2 text-center">Present</th>
                    <th className="py-2 text-center">Absent</th>
                    <th className="py-2 text-center">Leave</th>
                    <th className="py-2 text-right">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row">
                  {RECENT_HISTORY.map((row) => (
                    <tr key={row.date} className="hover:bg-slate-50">
                      <td className="py-2.5 font-medium text-ink">{row.date}</td>
                      <td className="py-2.5 text-center font-mono text-emerald-700 font-semibold">
                        {row.present}
                      </td>
                      <td className="py-2.5 text-center font-mono text-rose-700 font-semibold">
                        {row.absent}
                      </td>
                      <td className="py-2.5 text-center font-mono text-blue-700 font-semibold">
                        {row.leave}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-ink">
                        {row.pct}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-3 bg-surface-subtle border border-line rounded-control text-xs text-ink-secondary mt-3">
                <span className="font-semibold text-ink">Monthly Average for Class 8-B:</span> 95.2% · Highest attendance section in Middle School Wing.
              </div>
            </div>

            <div className="p-3 px-4 border-t border-line-row bg-surface-subtle flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePanel;
