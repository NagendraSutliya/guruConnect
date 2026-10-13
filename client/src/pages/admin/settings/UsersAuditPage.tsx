import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiShield,
  FiSearch,
  FiFilter,
  FiDownload,
  FiLock,
  FiUserCheck,
  FiAlertTriangle,
  FiCheckCircle
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface AuditEntry {
  id: string;
  time: string;
  actionBadge: "UNLOCK" | "CANCEL" | "UPDATE" | "CREATE";
  badgeColor: string;
  module: string;
  title: string;
  changeSummary: string;
  actor: string;
  ip: string;
  isSensitive?: boolean;
}

const DEFAULT_AUDIT: AuditEntry[] = [
  {
    id: "1",
    time: "10:42 AM",
    actionBadge: "UNLOCK",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    module: "Marks",
    title: "Marks · Half-Yearly Science 8-B",
    changeSummary: "Roll 06: 84 → 74 · Reason: Typing entry mistake corrected",
    actor: "Sunita Rathore (Request) · Approved by Exam Coordinator",
    ip: "10.0.4.21",
    isSensitive: true
  },
  {
    id: "2",
    time: "10:31 AM",
    actionBadge: "CANCEL",
    badgeColor: "bg-red-100 text-red-900 border-red-300",
    module: "Fees",
    title: "Receipt RCP/2627/004190 Voided",
    changeSummary: "₹16,900 · Wrong student selected · Reversal entry auto-posted to Day Book",
    actor: "Accountant Rekha Jain · Approved by Principal",
    ip: "10.0.2.14",
    isSensitive: true
  },
  {
    id: "3",
    time: "10:12 AM",
    actionBadge: "UPDATE",
    badgeColor: "bg-teal/15 text-teal border-teal/30",
    module: "Students",
    title: "Student · Aarav Gupta · Father's Mobile Updated",
    changeSummary: "98290 1xxxx → 98290 7xxxx · Verified parent request from app",
    actor: "Meera Kumawat · School Admin",
    ip: "10.0.1.5",
    isSensitive: false
  },
  {
    id: "4",
    time: "09:58 AM",
    actionBadge: "CREATE",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    module: "Fees",
    title: "Concession Rule Allotted · Pihu Sethi",
    changeSummary: "Sibling 10% discount on Tuition fee, Session 2026-27",
    actor: "Accountant Rekha Jain · Approved by Management",
    ip: "10.0.2.14",
    isSensitive: true
  }
];

export default function UsersAuditPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"audit" | "users" | "roles">("audit");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [sensitiveOnly, setSensitiveOnly] = useState(false);
  const [entries, setEntries] = useState<AuditEntry[]>(DEFAULT_AUDIT);

  const handleExportWatermarked = () => {
    showToast("Generating tamper-evident watermarked audit ledger (PDF)...", "info");
  };

  const filtered = entries.filter(e => {
    const matchesModule = moduleFilter === "All" || e.module === moduleFilter;
    const matchesSensitive = !sensitiveOnly || e.isSensitive;
    return matchesModule && matchesSensitive;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-3 pb-2 transition ${
            activeTab === "users" ? "text-teal border-b-2 border-teal" : "text-navy-muted hover:text-navy"
          }`}
        >
          Users & Access
        </button>
        <Link to="/admin/settings/roles" className="text-navy-muted hover:text-navy px-3 pb-2">
          Roles & Permissions
        </Link>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-3 pb-2 transition ${
            activeTab === "audit" ? "text-teal border-b-2 border-teal" : "text-navy-muted hover:text-navy"
          }`}
        >
          Immutable Audit Log
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">System Audit Log</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Every critical alteration to students, marks, fees, payroll, roles, and settings. Entries are write-once and cannot be erased.
          </p>
        </div>

        <button
          onClick={handleExportWatermarked}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-semibold text-navy transition"
        >
          <FiDownload size={14} /> Export (Watermarked PDF)
        </button>
      </div>

      {/* Filter Bar from Screen 42 */}
      <div className="flex flex-wrap items-center gap-3 bg-surface border border-line rounded-panel p-3.5 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="text-navy-muted font-medium">Module:</span>
          <select
            value={moduleFilter}
            onChange={e => setModuleFilter(e.target.value)}
            className="bg-page border border-line rounded-control px-2.5 py-1.5 text-navy font-semibold focus:outline-none"
          >
            <option value="All">All Modules</option>
            <option value="Fees">Fees & Finance</option>
            <option value="Marks">Examinations & Marks</option>
            <option value="Students">Student Profiles</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer font-semibold text-navy ml-auto">
          <input
            type="checkbox"
            checked={sensitiveOnly}
            onChange={e => setSensitiveOnly(e.target.checked)}
            className="rounded text-teal"
          />
          <span>Sensitive & Security Actions Only</span>
        </label>
      </div>

      {/* Audit Log Entries List matching Screen 42 */}
      <div className="bg-surface border border-line rounded-panel shadow-sm divide-y divide-line">
        {filtered.map(entry => (
          <div key={entry.id} className="p-4 flex gap-4 items-start hover:bg-page/40 transition">
            <span className="font-mono text-xs font-bold text-navy-muted pt-1 w-20 shrink-0">
              {entry.time}
            </span>

            <div className="flex-1 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${entry.badgeColor}`}
                >
                  {entry.actionBadge}
                </span>
                <span className="font-bold text-navy text-sm">{entry.title}</span>
              </div>

              <div className="text-navy font-medium">{entry.changeSummary}</div>

              <div className="text-navy-muted text-[11px] font-mono">
                {entry.actor} · Source IP: {entry.ip}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
