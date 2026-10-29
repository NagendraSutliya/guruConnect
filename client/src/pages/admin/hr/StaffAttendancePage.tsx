import React, { useState } from "react";
import {
  FiPrinter,
  FiUploadCloud,
  FiSearch,
  FiFilter,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiCalendar
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface StaffAttendanceRecord {
  id: string;
  empId: string;
  name: string;
  role: string;
  department: string;
  days: ("P" | "LT" | "A" | "CL" | "SL" | "Sun")[];
  lateCount: number;
  todayInTime?: string;
  todayOutTime?: string;
}

const DAYS_HEADER = [
  { day: 1, weekday: "Thu" },
  { day: 2, weekday: "Fri" },
  { day: 3, weekday: "Sat" },
  { day: 4, weekday: "Sun" },
  { day: 5, weekday: "Mon" },
  { day: 6, weekday: "Tue" },
  { day: 7, weekday: "Wed" },
  { day: 8, weekday: "Thu" },
  { day: 9, weekday: "Fri" },
  { day: 10, weekday: "Sat" },
  { day: 11, weekday: "Sun" },
  { day: 12, weekday: "Mon" },
  { day: 13, weekday: "Tue" },
  { day: 14, weekday: "Wed" },
  { day: 15, weekday: "Thu" }
];

const INITIAL_RECORDS: StaffAttendanceRecord[] = [
  {
    id: "1",
    empId: "EMP-0142",
    name: "Sunita Rathore",
    role: "TGT Science",
    department: "Science",
    days: ["P", "P", "P", "Sun", "P", "P", "P", "P", "P", "P", "Sun", "P", "P", "P", "P"],
    lateCount: 0,
    todayInTime: "07:48 AM",
    todayOutTime: "02:30 PM"
  },
  {
    id: "2",
    empId: "EMP-0118",
    name: "Vikram Singh",
    role: "TGT Maths",
    department: "Maths",
    days: ["LT", "P", "LT", "Sun", "P", "P", "P", "P", "LT", "P", "Sun", "CL", "CL", "CL", "LT"],
    lateCount: 4,
    todayInTime: "08:14 AM (Late)",
    todayOutTime: "02:30 PM"
  },
  {
    id: "3",
    empId: "EMP-0097",
    name: "Rachna Bose",
    role: "PGT English",
    department: "Languages",
    days: ["P", "P", "P", "Sun", "P", "P", "P", "CL", "CL", "CL", "Sun", "P", "P", "P", "P"],
    lateCount: 0,
    todayInTime: "07:50 AM",
    todayOutTime: "02:30 PM"
  },
  {
    id: "4",
    empId: "EMP-0231",
    name: "Pooja Meena",
    role: "PRT Primary",
    department: "Primary wing",
    days: ["P", "P", "P", "Sun", "P", "P", "P", "P", "P", "P", "Sun", "P", "P", "P", "P"],
    lateCount: 0,
    todayInTime: "07:52 AM",
    todayOutTime: "02:30 PM"
  },
  {
    id: "5",
    empId: "EMP-0104",
    name: "Rakesh Jain",
    role: "PGT Accountancy",
    department: "Commerce",
    days: ["P", "P", "P", "Sun", "P", "P", "LT", "P", "P", "P", "Sun", "P", "P", "P", "P"],
    lateCount: 1,
    todayInTime: "07:55 AM",
    todayOutTime: "02:30 PM"
  },
  {
    id: "6",
    empId: "EMP-0076",
    name: "Kamla Devi",
    role: "TGT Hindi",
    department: "Languages",
    days: ["P", "P", "P", "Sun", "P", "P", "P", "P", "SL", "SL", "Sun", "P", "P", "P", "P"],
    lateCount: 0,
    todayInTime: "07:45 AM",
    todayOutTime: "02:30 PM"
  },
  {
    id: "7",
    empId: "EMP-0188",
    name: "Neha Saini",
    role: "Admission counsellor",
    department: "Front office",
    days: ["P", "P", "P", "Sun", "P", "P", "P", "P", "P", "P", "Sun", "P", "P", "P", "P"],
    lateCount: 0,
    todayInTime: "07:58 AM",
    todayOutTime: "04:30 PM"
  },
  {
    id: "8",
    empId: "EMP-0150",
    name: "Deepak Choudhary",
    role: "PET",
    department: "Sports",
    days: ["P", "P", "P", "Sun", "P", "LT", "P", "P", "P", "P", "Sun", "P", "P", "P", "P"],
    lateCount: 1,
    todayInTime: "07:40 AM",
    todayOutTime: "02:30 PM"
  },
  {
    id: "9",
    empId: "EMP-0164",
    name: "Mohan Lal",
    role: "Driver · Bus 4",
    department: "Transport",
    days: ["P", "P", "P", "Sun", "P", "P", "P", "P", "P", "P", "Sun", "P", "P", "P", "P"],
    lateCount: 0,
    todayInTime: "06:30 AM",
    todayOutTime: "03:00 PM"
  },
  {
    id: "10",
    empId: "EMP-0177",
    name: "Devendra Sharma",
    role: "Sports Coach",
    department: "Sports",
    days: ["P", "P", "P", "Sun", "P", "P", "P", "P", "P", "P", "Sun", "P", "P", "P", "P"],
    lateCount: 0,
    todayInTime: "07:42 AM",
    todayOutTime: "02:30 PM"
  }
];

export default function StaffAttendancePage() {
  const { showToast } = useToast();
  const [records, setRecords] = useState<StaffAttendanceRecord[]>(INITIAL_RECORDS);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedPunch, setSelectedPunch] = useState<{
    staff: StaffAttendanceRecord;
    dayIndex: number;
  } | null>(null);

  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.empId.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "All" || r.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleOverrideStatus = (newStatus: "P" | "LT" | "A" | "CL" | "SL") => {
    if (!selectedPunch) return;
    const { staff, dayIndex } = selectedPunch;
    setRecords(prev =>
      prev.map(r => {
        if (r.id === staff.id) {
          const newDays = [...r.days];
          newDays[dayIndex] = newStatus;
          const late = newDays.filter(d => d === "LT").length;
          return { ...r, days: newDays, lateCount: late };
        }
        return r;
      })
    );
    setSelectedPunch(null);
    showToast(`Punch updated to ${newStatus} for ${staff.name}!`, "success");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 28-StaffAttendance.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Staff › Staff attendance
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Staff attendance · October 2026
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Shift 7:30 am–2:30 pm · 10 minutes grace · 3 late arrivals = half a day of leave without pay
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FiUploadCloud size={15} className="text-ink-secondary" />
            <span>Import device punches</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FiPrinter size={15} className="text-ink-secondary" />
            <span>Print register</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (Matching 28-StaffAttendance.html) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Present today */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Present today</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">91 / 96</span>
          <span className="text-[11.5px] text-emerald-700 font-medium">94.8% on duty</span>
        </div>

        {/* Card 2: On leave today */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">On leave today</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">3</span>
          <span className="text-[11.5px] text-ink-secondary">Substitutes assigned</span>
        </div>

        {/* Card 3: Not punched yet */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Not punched yet</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-warning-inline">2</span>
          <span className="text-[11.5px] text-ink-secondary">After 7:40 am grace</span>
        </div>

        {/* Card 4: Late this month */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Late this month</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">14</span>
          <span className="text-[11.5px] text-warning-inline">Across 8 staff members</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-line rounded-card p-3 flex flex-wrap items-center gap-3 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={15} />
          <input
            type="search"
            placeholder="Search employee by name, EMP ID, or designation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-page border border-line rounded-control text-xs text-ink focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-secondary font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink font-medium focus:outline-none focus:border-primary"
          >
            <option value="All">All departments</option>
            <option value="Science">Science</option>
            <option value="Maths">Maths</option>
            <option value="Languages">Languages</option>
            <option value="Primary wing">Primary wing</option>
            <option value="Commerce">Commerce</option>
            <option value="Front office">Front office</option>
            <option value="Sports">Sports</option>
            <option value="Transport">Transport</option>
          </select>
        </div>
      </div>

      {/* Monthly Attendance Register Table (Screen 28) */}
      <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] min-w-[960px]">
            <thead>
              <tr className="bg-surface-head border-b border-line text-ink font-semibold">
                <th className="py-2.5 px-4 text-left min-w-[190px]">Employee</th>
                {DAYS_HEADER.map(d => (
                  <th
                    key={d.day}
                    className={`py-2 px-1 text-center font-semibold ${
                      d.weekday === "Sun" ? "text-ink-secondary/70 bg-slate-100/50" : "text-ink"
                    }`}
                  >
                    <div className="flex flex-col items-center leading-tight">
                      <span className="font-mono text-[13px]">{d.day}</span>
                      <span className="text-[10.5px] font-normal">{d.weekday}</span>
                    </div>
                  </th>
                ))}
                <th className="py-2.5 px-4 text-right">Late</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-page/50 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-ink text-[13.5px]">{rec.name}</span>
                      <span className="text-[11.5px] text-ink-secondary">{rec.role}</span>
                    </div>
                  </td>

                  {rec.days.map((status, idx) => {
                    const isSun = status === "Sun";
                    const isPresent = status === "P";
                    const isLate = status === "LT";
                    const isLeave = status === "CL" || status === "SL";
                    const isAbsent = status === "A";

                    return (
                      <td key={idx} className="py-1 px-0.5 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedPunch({ staff: rec, dayIndex: idx })}
                          disabled={isSun}
                          title={
                            isSun
                              ? "Sunday / Weekly Off"
                              : `${rec.name} · Day ${idx + 1} (${status}) — Click to override`
                          }
                          className={`w-7 h-7 mx-auto rounded-control flex items-center justify-center font-mono text-[11.5px] font-semibold transition-transform active:scale-90 ${
                            isSun
                              ? "text-ink-secondary/40 cursor-default"
                              : isPresent
                              ? "bg-primary-tint text-primary hover:brightness-95 cursor-pointer"
                              : isLate
                              ? "bg-warning-bg text-warning-text hover:brightness-95 cursor-pointer"
                              : isLeave
                              ? "bg-purple-50 text-purple-800 border border-purple-200 cursor-pointer"
                              : "bg-danger-bg text-danger-text cursor-pointer"
                          }`}
                        >
                          {isSun ? "—" : status}
                        </button>
                      </td>
                    );
                  })}

                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-ink">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        rec.lateCount > 2
                          ? "bg-warning-bg text-warning-text font-bold"
                          : rec.lateCount > 0
                          ? "text-ink-secondary"
                          : "text-ink-secondary/60"
                      }`}
                    >
                      {rec.lateCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Import Device Punches Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Import Biometric Punches</h3>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-ink-secondary space-y-3">
              <p>
                Sync device punch logs directly from LAN-connected biometric fingerprint and facial terminals:
              </p>
              <div className="border border-line rounded-control p-3 bg-page space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between"><span>Terminal 01 (Main Gate):</span><b className="text-emerald-700">Online</b></div>
                <div className="flex justify-between"><span>Terminal 02 (Admin Block):</span><b className="text-emerald-700">Online</b></div>
                <div className="flex justify-between"><span>Terminal 03 (Senior Wing):</span><b className="text-emerald-700">Online</b></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 border border-line-input rounded-control text-xs text-ink hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  showToast("Synced 96 records from 3 biometric terminals with 0 errors!", "success");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control text-xs font-semibold shadow-xs"
              >
                Sync Terminal Logs Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Attendance Override Modal */}
      {selectedPunch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-sm shadow-xl p-5 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <h4 className="font-semibold text-sm text-ink">
                Override Day {DAYS_HEADER[selectedPunch.dayIndex].day} Status
              </h4>
              <button
                type="button"
                onClick={() => setSelectedPunch(null)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-ink text-[13px]">{selectedPunch.staff.name}</div>
              <div className="text-ink-secondary">{selectedPunch.staff.role} · {selectedPunch.staff.department}</div>
              <div className="text-ink-secondary">
                Current: <b className="text-ink">{selectedPunch.staff.days[selectedPunch.dayIndex]}</b>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleOverrideStatus("P")}
                className="p-2.5 rounded-control bg-primary-tint text-primary font-semibold hover:brightness-95 cursor-pointer text-center"
              >
                Present (P)
              </button>
              <button
                type="button"
                onClick={() => handleOverrideStatus("LT")}
                className="p-2.5 rounded-control bg-warning-bg text-warning-text font-semibold hover:brightness-95 cursor-pointer text-center"
              >
                Late (LT)
              </button>
              <button
                type="button"
                onClick={() => handleOverrideStatus("CL")}
                className="p-2.5 rounded-control bg-purple-50 text-purple-800 border border-purple-200 font-semibold hover:bg-purple-100 cursor-pointer text-center"
              >
                Casual Leave (CL)
              </button>
              <button
                type="button"
                onClick={() => handleOverrideStatus("A")}
                className="p-2.5 rounded-control bg-danger-bg text-danger-text font-semibold hover:bg-red-100 cursor-pointer text-center"
              >
                Absent (A)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
