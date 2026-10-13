import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiX,
  FiClock,
  FiCalendar,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface StaffAttendanceItem {
  id: string;
  empId: string;
  name: string;
  department: string;
  inTime: string;
  outTime: string;
  status: "Present" | "Absent" | "Late" | "Half Day";
}

const DEFAULT_ATTENDANCE: StaffAttendanceItem[] = [
  { id: "1", empId: "EMP-0142", name: "Sunita Rathore", department: "Science", inTime: "07:55 AM", outTime: "02:30 PM", status: "Present" },
  { id: "2", empId: "EMP-0118", name: "Vikram Singh", department: "Maths", inTime: "08:15 AM", outTime: "02:30 PM", status: "Late" },
  { id: "3", empId: "EMP-0097", name: "Rachna Bose", department: "Languages", inTime: "-", outTime: "-", status: "Absent" },
  { id: "4", empId: "EMP-0210", name: "Mohan Lal", department: "Transport", inTime: "06:30 AM", outTime: "03:00 PM", status: "Present" },
  { id: "5", empId: "EMP-0185", name: "Farah Ali", department: "Arts", inTime: "07:58 AM", outTime: "02:30 PM", status: "Present" },
  { id: "6", empId: "EMP-0164", name: "Rekha Jain", department: "Administration", inTime: "08:02 AM", outTime: "04:30 PM", status: "Present" },
  { id: "7", empId: "EMP-0177", name: "Devendra Sharma", department: "Sports", inTime: "07:45 AM", outTime: "02:30 PM", status: "Present" }
];

export default function StaffAttendancePage() {
  const { showToast } = useToast();
  const [date, setDate] = useState("2026-10-14");
  const [attendance, setAttendance] = useState<StaffAttendanceItem[]>(DEFAULT_ATTENDANCE);
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);

  const handleSyncBiometric = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast("Synced 96 records from biometric fingerprint & face scanner devices.", "success");
    }, 1000);
  };

  const handleStatusChange = (id: string, status: StaffAttendanceItem["status"]) => {
    setAttendance(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item))
    );
  };

  const presentCount = attendance.filter(a => a.status === "Present" || a.status === "Late").length;
  const absentCount = attendance.filter(a => a.status === "Absent").length;
  const lateCount = attendance.filter(a => a.status === "Late").length;

  const filtered = attendance.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.empId.toLowerCase().includes(search.toLowerCase()) ||
    a.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-semibold overflow-x-auto">
        <Link to="/admin/staff" className="text-navy-muted hover:text-navy px-2 pb-2">
          Directory
        </Link>
        <Link to="/admin/staff/leave" className="text-navy-muted hover:text-navy px-2 pb-2">
          Leave Management
        </Link>
        <span className="text-teal border-b-2 border-teal pb-2 px-1">Staff Attendance</span>
        <Link to="/admin/payroll" className="text-navy-muted hover:text-navy px-2 pb-2">
          Payroll Runs
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Daily Staff Attendance Register</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Real-time biometric terminal punch-ins and manual gate override logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-3 py-1.5 bg-surface border border-line rounded-control text-xs text-navy font-semibold focus:outline-none"
          />
          <button
            onClick={handleSyncBiometric}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
          >
            <FiRefreshCw className={syncing ? "animate-spin" : ""} size={14} />
            <span>{syncing ? "Syncing..." : "Sync Biometric"}</span>
          </button>
        </div>
      </div>

      {/* Attendance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Total Staff</div>
          <div className="font-mono text-xl font-bold text-navy">{attendance.length}</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-emerald-700 font-medium">Present Today</div>
          <div className="font-mono text-xl font-bold text-emerald-700">{presentCount}</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-red-700 font-medium">Absent / On Leave</div>
          <div className="font-mono text-xl font-bold text-red-700">{absentCount}</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-amber-800 font-medium">Late Punch-ins</div>
          <div className="font-mono text-xl font-bold text-amber-800">{lateCount}</div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-line flex items-center justify-between gap-3 bg-page/30">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted" size={14} />
            <input
              type="text"
              placeholder="Search faculty name or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface border border-line rounded-control text-xs text-navy focus:outline-none focus:border-teal"
            />
          </div>
          <button
            onClick={() => showToast("Exporting staff attendance register...", "info")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-control bg-surface hover:bg-page text-xs font-semibold text-navy transition"
          >
            <FiDownload size={13} /> Export Sheet
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">EMP ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Punch In</th>
                <th className="py-3 px-4">Punch Out</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-page/40 transition">
                  <td className="py-3 px-4 font-bold text-navy">{item.name}</td>
                  <td className="py-3 px-4 font-mono text-navy-muted">{item.empId}</td>
                  <td className="py-3 px-4 text-navy-muted font-medium">{item.department}</td>
                  <td className="py-3 px-4 font-mono">{item.inTime}</td>
                  <td className="py-3 px-4 font-mono">{item.outTime}</td>
                  <td className="py-2.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-page p-1 rounded-control border border-line/60">
                      {(["Present", "Late", "Absent", "Half Day"] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(item.id, s)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                            item.status === s
                              ? s === "Present"
                                ? "bg-emerald-700 text-white"
                                : s === "Late"
                                ? "bg-amber-700 text-white"
                                : s === "Absent"
                                ? "bg-red-700 text-white"
                                : "bg-slate-700 text-white"
                              : "text-navy-muted hover:text-navy"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
