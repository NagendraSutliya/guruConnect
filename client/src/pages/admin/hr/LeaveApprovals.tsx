import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiX,
  FiAlertCircle,
  FiCalendar,
  FiClock,
  FiCheckCircle
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface LeaveRequest {
  id: string;
  name: string;
  designation: string;
  leaveType: string;
  dates: string;
  duration: string;
  reason: string;
  balanceAfter: string;
  substituteWarning: string;
  isUrgent?: boolean;
}

const INITIAL_REQUESTS: LeaveRequest[] = [
  {
    id: "1",
    name: "Vikram Singh",
    designation: "TGT Maths",
    leaveType: "Casual leave",
    dates: "16–18 Oct",
    duration: "3 days",
    reason: "Family function in hometown",
    balanceAfter: "CL 5 of 12 remaining",
    substituteWarning: "6 class periods need substitution",
    isUrgent: false
  },
  {
    id: "2",
    name: "Kamla Devi",
    designation: "TGT Hindi",
    leaveType: "Sick leave",
    dates: "Tomorrow",
    duration: "1 day",
    reason: "Severe viral fever (Doctor slip attached)",
    balanceAfter: "SL 7 of 10 remaining",
    substituteWarning: "4 periods tomorrow — urgent substitute required",
    isUrgent: true
  },
  {
    id: "3",
    name: "Mohan Lal",
    designation: "Driver · Bus 4 Route",
    leaveType: "Casual leave",
    dates: "20 Oct",
    duration: "1 day",
    reason: "Personal municipal office work",
    balanceAfter: "CL 9 of 12 remaining",
    substituteWarning: "Bus 4 route requires assigned relief driver",
    isUrgent: true
  },
  {
    id: "4",
    name: "Farah Ali",
    designation: "Art & Craft Instructor",
    leaveType: "Earned leave",
    dates: "24–28 Oct",
    duration: "5 days",
    reason: "Attending national faculty workshop",
    balanceAfter: "EL 14 of 30 remaining",
    substituteWarning: "Adjusted with sports periods",
    isUrgent: false
  }
];

export default function LeaveApprovals() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);

  const handleAction = (id: string, action: "approve" | "reject") => {
    const item = requests.find(r => r.id === id);
    setRequests(prev => prev.filter(r => r.id !== id));
    if (action === "approve") {
      showToast(`Approved leave request for ${item?.name}. Attendance adjusted.`, "success");
    } else {
      showToast(`Rejected leave request for ${item?.name}.`, "info");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-semibold overflow-x-auto">
        <Link to="/admin/staff" className="text-navy-muted hover:text-navy px-2 pb-2">
          Directory
        </Link>
        <span className="text-teal border-b-2 border-teal pb-2 px-1">Leave Management</span>
        <Link to="/admin/staff/attendance" className="text-navy-muted hover:text-navy px-2 pb-2">
          Staff Attendance
        </Link>
        <Link to="/admin/payroll" className="text-navy-muted hover:text-navy px-2 pb-2">
          Payroll Runs
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Leave Requests Waiting For Action</h1>
        <p className="text-xs text-navy-muted mt-0.5">
          Approved leaves auto-update biometric attendance, pro-rate payroll deductions, and free class slots for substitution.
        </p>
      </div>

      {/* Requests List */}
      <div className="space-y-3.5">
        {requests.length === 0 ? (
          <div className="bg-surface border border-line rounded-panel p-12 text-center text-navy-muted space-y-2">
            <FiCheckCircle size={32} className="mx-auto text-emerald-600" />
            <div className="font-bold text-navy text-sm">All leave requests have been reviewed!</div>
            <p className="text-xs">No pending requests waiting in the principal or admin queue.</p>
          </div>
        ) : (
          requests.map(req => (
            <div
              key={req.id}
              className={`bg-surface border rounded-panel p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 transition ${
                req.isUrgent ? "border-amber-300 bg-amber-50/20" : "border-line"
              }`}
            >
              <div className="space-y-1 flex-1 min-w-[280px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-navy">{req.name}</span>
                  <span className="text-xs text-navy-muted">· {req.designation}</span>
                  {req.isUrgent && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      Urgent
                    </span>
                  )}
                </div>
                <div className="text-xs text-navy">
                  <span className="font-semibold text-teal">{req.leaveType}</span> · {req.dates} ·{" "}
                  <b>{req.duration}</b>
                </div>
                <div className="text-xs text-navy-muted">Reason: {req.reason}</div>
              </div>

              <div className="space-y-1 min-w-[200px] text-xs">
                <div>
                  <span className="text-navy-muted">Balance: </span>
                  <span className="font-mono font-semibold text-navy">{req.balanceAfter}</span>
                </div>
                <div className="text-amber-800 font-medium flex items-center gap-1 text-[11px]">
                  <FiAlertCircle size={12} className="shrink-0" />
                  <span>{req.substituteWarning}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(req.id, "reject")}
                  className="px-4 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-semibold text-navy transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(req.id, "approve")}
                  className="px-5 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
                >
                  Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
