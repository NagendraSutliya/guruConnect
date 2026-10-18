import React, { useState, useMemo } from "react";
import { useToast } from "../../../context/ToastContext";
import { FiCheckCircle, FiRefreshCw, FiWifi, FiWifiOff } from "react-icons/fi";

type AttendanceStatus = "P" | "A" | "L" | "HD" | "LT";

interface StudentAttendanceItem {
  roll: string;
  name: string;
  status: AttendanceStatus;
  note?: string;
  isLocked?: boolean;
}

const INITIAL_STUDENTS: StudentAttendanceItem[] = [
  { roll: "01", name: "Aditi Sharma", status: "P" },
  { roll: "02", name: "Bhavesh Kumar", status: "P" },
  { roll: "03", name: "Charu Mehta", status: "P" },
  { roll: "04", name: "Dev Saini", status: "A", note: "Absent — parent will be notified" },
  { roll: "05", name: "Esha Gupta", status: "P" },
  { roll: "06", name: "Faizan Ali", status: "P" },
  { roll: "07", name: "Garima Joshi", status: "P" },
  { roll: "08", name: "Hitesh Yadav", status: "P" },
  { roll: "09", name: "Isha Kanwar", status: "P" },
  { roll: "10", name: "Jatin Soni", status: "LT", note: "Late arrival" },
  { roll: "11", name: "Kriti Bansal", status: "P" },
  { roll: "12", name: "Lakshay Jain", status: "L", note: "Leave approved (parent request) · locked", isLocked: true },
  { roll: "13", name: "Manav Verma", status: "P" },
  { roll: "14", name: "Nisha Pareek", status: "P" },
  { roll: "15", name: "Ojasvi Rathore", status: "P" },
  { roll: "16", name: "Pooja Choudhary", status: "P" },
  { roll: "17", name: "Pranav Singh", status: "P" },
  { roll: "18", name: "Rahul Saini", status: "P" },
  { roll: "19", name: "Riya Sen", status: "P" },
  { roll: "20", name: "Siddharth Jain", status: "P" },
  { roll: "21", name: "Sneha Goyal", status: "P" },
  { roll: "22", name: "Tanvi Saxena", status: "P" },
  { roll: "23", name: "Udit Sharma", status: "P" },
  { roll: "24", name: "Vaibhav Meena", status: "P" },
  { roll: "25", name: "Yashvi Tiwari", status: "P" },
  { roll: "26", name: "Aarav Gupta", status: "P" },
  { roll: "27", name: "Ananya Dixit", status: "P" },
  { roll: "28", name: "Aryan Chauhan", status: "P" },
  { roll: "29", name: "Deepak Rawat", status: "P" },
  { roll: "30", name: "Divya Joshi", status: "P" },
  { roll: "31", name: "Gaurav Vyas", status: "P" },
  { roll: "32", name: "Harsh Vardhan", status: "P" },
  { roll: "33", name: "Kashish Jain", status: "P" },
  { roll: "34", name: "Kavya Soni", status: "P" },
  { roll: "35", name: "Mayank Pareek", status: "P" },
  { roll: "36", name: "Nikita Sharma", status: "P" },
  { roll: "37", name: "Parth Saini", status: "P" },
  { roll: "38", name: "Rohan Meena", status: "P" },
];

const AttendancePanel: React.FC = () => {
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState("8-B (class teacher)");
  const [students, setStudents] = useState<StudentAttendanceItem[]>(INITIAL_STUDENTS);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

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
    const effectivePresent = present + late + (halfDay * 0.5);
    const pct = total > 0 ? ((effectivePresent / total) * 100).toFixed(1) : "0.0";

    return { present, absent, leave, halfDay, late, total, pct };
  }, [students]);

  const handleStatusChange = (roll: string, newStatus: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.roll !== roll) return s;
        if (s.isLocked) {
          showToast("This student's leave was approved by office/guardian and is locked.", "info");
          return s;
        }
        let note = "";
        if (newStatus === "A") note = "Absent — parent will be notified";
        if (newStatus === "LT") note = "Late arrival";
        if (newStatus === "HD") note = "Half day recorded";
        return { ...s, status: newStatus, note };
      })
    );
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) => (s.isLocked ? s : { ...s, status: "P", note: "" }))
    );
    showToast("Reset all students to Present", "info");
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      setSubmittedAt(timeStr);
      showToast(
        isOffline
          ? "Attendance queued offline. Will sync automatically when connection restores."
          : `Attendance submitted for 8-B at ${timeStr}. Parents notified.`,
        "success"
      );
    }, 500);
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn font-sans">
      {/* Header with Title and Class Selector */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
              Attendance · 8-B · Tue 13 Oct
            </h1>
            {isOffline && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-caption font-semibold bg-warning-bg text-warning-strong border border-warning-border">
                <FiWifiOff size={12} /> Offline Queue
              </span>
            )}
          </div>
          <span className="text-body text-ink-secondary">
            Everyone starts as Present. Tap only the exceptions. Cut-off 10:00 am.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOffline(!isOffline)}
            className="text-caption text-ink-secondary hover:text-ink flex items-center gap-1 font-medium px-2 py-1"
            title="Toggle simulated offline mode"
          >
            {isOffline ? <FiWifiOff size={14} className="text-warning-inline" /> : <FiWifi size={14} />}
            <span className="hidden sm:inline">{isOffline ? "Simulating Offline" : "Online"}</span>
          </button>

          <label className="flex flex-col gap-1 text-caption font-semibold text-ink">
            <span>Select Class</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="min-h-[42px] px-3 rounded-control border border-line-input bg-surface text-body font-medium text-ink focus:border-primary focus:outline-none"
            >
              <option value="8-B (class teacher)">8-B (class teacher)</option>
              <option value="Period 2 · 7-A Science">Period 2 · 7-A Science</option>
              <option value="Period 4 · 8-A Science">Period 4 · 8-A Science</option>
              <option value="Period 5 · 7-B Science">Period 5 · 7-B Science</option>
            </select>
          </label>
        </div>
      </div>

      {/* Submitted Status Notification Banner if submitted */}
      {submittedAt && (
        <div className="p-3.5 bg-success-bg border border-success-text/20 rounded-card flex justify-between items-center text-success-text text-small font-semibold">
          <div className="flex items-center gap-2">
            <FiCheckCircle size={18} />
            <span>
              Attendance submitted for 8-B at {submittedAt}. Editable same day until 6:00 pm.
            </span>
          </div>
          <button
            onClick={handleMarkAllPresent}
            className="text-success-text underline text-caption font-semibold hover:opacity-80"
          >
            Re-open Draft
          </button>
        </div>
      )}

      {/* Stat KPI Cards matching specification */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1">
          <span className="text-micro font-medium text-ink-secondary">
            Present (of {counts.total})
          </span>
          <span className="font-mono text-2xl font-semibold text-ink">{counts.present}</span>
        </div>
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1">
          <span className="text-micro font-medium text-ink-secondary">Absent</span>
          <span className="font-mono text-2xl font-semibold text-warning-inline">
            {counts.absent}
          </span>
        </div>
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1">
          <span className="text-micro font-medium text-ink-secondary">On leave</span>
          <span className="font-mono text-2xl font-semibold text-ink">{counts.leave}</span>
        </div>
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1">
          <span className="text-micro font-medium text-ink-secondary">Today's %</span>
          <span className="font-mono text-2xl font-semibold text-primary">{counts.pct}%</span>
        </div>
      </div>

      {/* Student List Grid matching 04-Mark-attendance.html */}
      <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
        <div className="p-3 px-4 border-b border-line-row bg-surface-head flex justify-between items-center">
          <span className="text-small font-semibold text-ink-secondary">
            Students list (38 enrolled)
          </span>
          <button
            onClick={handleMarkAllPresent}
            className="text-small font-semibold text-primary hover:underline flex items-center gap-1.5"
          >
            <FiRefreshCw size={14} /> Mark all present
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-line-row">
          {students.map((s, idx) => {
            const isAbsent = s.status === "A";
            const isLate = s.status === "LT";

            return (
              <div
                key={s.roll}
                className={`flex justify-between items-center gap-3 p-3 px-4 border-b border-line-row transition-colors ${
                  idx % 2 === 0 ? "md:border-r" : ""
                } ${isAbsent ? "bg-warning-bg/40" : isLate ? "bg-amber-50/40" : "bg-surface"}`}
              >
                {/* Left: Roll and Student Name with Exception Subtitle */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-small text-ink-secondary w-6 shrink-0">
                    {s.roll}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-body font-medium text-ink truncate">{s.name}</span>
                    {s.note ? (
                      <span className="text-caption text-warning-inline font-medium truncate">
                        {s.note}
                      </span>
                    ) : (
                      <span className="text-caption text-transparent select-none">-</span>
                    )}
                  </div>
                </div>

                {/* Right: Fast Status Buttons (P, A, L, HD, LT) */}
                <div className="flex gap-1 shrink-0">
                  {/* P: Present */}
                  <button
                    onClick={() => handleStatusChange(s.roll, "P")}
                    className={`min-w-[36px] min-h-[36px] rounded-control border text-caption font-semibold transition-colors ${
                      s.status === "P"
                        ? "bg-primary border-primary text-white"
                        : "bg-surface border-line-input text-ink-secondary hover:bg-surface-subtle"
                    }`}
                  >
                    P
                  </button>

                  {/* A: Absent */}
                  <button
                    onClick={() => handleStatusChange(s.roll, "A")}
                    className={`min-w-[36px] min-h-[36px] rounded-control border text-caption font-semibold transition-colors ${
                      s.status === "A"
                        ? "bg-warning-accent border-warning-accent text-white"
                        : "bg-surface border-line-input text-ink-secondary hover:bg-surface-subtle"
                    }`}
                  >
                    A
                  </button>

                  {/* L: Leave */}
                  <button
                    onClick={() => handleStatusChange(s.roll, "L")}
                    className={`min-w-[36px] min-h-[36px] rounded-control border text-caption font-semibold transition-colors ${
                      s.status === "L"
                        ? "bg-attendance-L border-attendance-L text-white"
                        : "bg-surface border-line-input text-ink-secondary hover:bg-surface-subtle"
                    }`}
                  >
                    L
                  </button>

                  {/* HD: Half Day */}
                  <button
                    onClick={() => handleStatusChange(s.roll, "HD")}
                    className={`min-w-[36px] min-h-[36px] rounded-control border text-caption font-semibold transition-colors ${
                      s.status === "HD"
                        ? "bg-attendance-HD border-attendance-HD text-white"
                        : "bg-surface border-line-input text-ink-secondary hover:bg-surface-subtle"
                    }`}
                  >
                    HD
                  </button>

                  {/* LT: Late Arrival */}
                  <button
                    onClick={() => handleStatusChange(s.roll, "LT")}
                    className={`min-w-[36px] min-h-[36px] rounded-control border text-caption font-semibold transition-colors ${
                      s.status === "LT"
                        ? "bg-attendance-LT border-attendance-LT text-white"
                        : "bg-surface border-line-input text-ink-secondary hover:bg-surface-subtle"
                    }`}
                  >
                    LT
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Bar at Bottom */}
        <div className="flex flex-wrap justify-between items-center gap-3 p-4 bg-surface-subtle border-t border-line">
          <span className="text-small text-ink-secondary">
            Parents of absent and late students are notified within 5 minutes.
          </span>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-h-[46px] px-6 rounded-control bg-primary text-white font-semibold text-body hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit attendance"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default AttendancePanel;
