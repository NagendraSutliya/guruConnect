import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { FiDownload } from "react-icons/fi";

interface LeaveRequestItem {
  id: string;
  type: string;
  dates: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

const INITIAL_REQUESTS: LeaveRequestItem[] = [
  { id: "r1", type: "CL", dates: "23 Oct", reason: "family function", status: "Pending" },
  { id: "r2", type: "CL", dates: "18–19 Aug", reason: "personal work", status: "Approved" },
  { id: "r3", type: "CL", dates: "3 Jul", reason: "medical consultation", status: "Approved" },
];

const PAYSLIPS = [
  { month: "September 2026", netPay: "₹48,300", file: "Payslip_Sep_2026.pdf" },
  { month: "August 2026", netPay: "₹48,300", file: "Payslip_Aug_2026.pdf" },
  { month: "July 2026", netPay: "₹48,300", file: "Payslip_Jul_2026.pdf" },
  { month: "Form 16 · 2025-26", netPay: "—", file: "Form16_2025_26.pdf" },
];

const TeacherLeavePayslip: React.FC = () => {
  const { showToast } = useToast();
  const [leaveType, setLeaveType] = useState("Casual leave (8 left)");
  const [fromDate, setFromDate] = useState("2026-10-23");
  const [toDate, setToDate] = useState("2026-10-23");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [reason, setReason] = useState("Family function");
  const [requests, setRequests] = useState<LeaveRequestItem[]>(INITIAL_REQUESTS);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const shortType = leaveType.startsWith("Casual") ? "CL" : leaveType.startsWith("Sick") ? "SL" : "EL";
    const dateStr = fromDate === toDate ? fromDate : `${fromDate} to ${toDate}`;

    const newReq: LeaveRequestItem = {
      id: `r_${Date.now()}`,
      type: shortType,
      dates: dateStr,
      reason: reason.trim(),
      status: "Pending",
    };

    setRequests([newReq, ...requests]);
    showToast("Leave request sent to Principal for approval. Periods opened for substitution.", "success");
    setReason("");
  };

  const handleDownloadPdf = (slip: any) => {
    setSelectedPayslip(slip);
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
          Leave and payslip
        </h1>
        <span className="text-body text-ink-secondary">
          Your leave balance, requests, attendance and monthly payslips.
        </span>
      </div>

      {/* KPI Stat Cards matching specification */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1.5 shadow-2xs">
          <span className="text-micro font-medium text-ink-secondary">Casual (CL)</span>
          <span className="font-mono text-xl font-medium text-ink">8 of 12</span>
        </div>
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1.5 shadow-2xs">
          <span className="text-micro font-medium text-ink-secondary">Sick (SL)</span>
          <span className="font-mono text-xl font-medium text-ink">9 of 10</span>
        </div>
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1.5 shadow-2xs">
          <span className="text-micro font-medium text-ink-secondary">Earned (EL)</span>
          <span className="font-mono text-xl font-medium text-ink">22</span>
        </div>
        <div className="bg-surface border border-line rounded-card p-3.5 flex flex-col gap-1.5 shadow-2xs">
          <span className="text-micro font-medium text-ink-secondary">My attendance (Oct)</span>
          <span className="font-mono text-xl font-medium text-ink">100% · 0 late</span>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (span 5): Apply for Leave Card */}
        <section className="lg:col-span-5 bg-surface border border-line rounded-card p-5 flex flex-col gap-4 shadow-2xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">Apply for leave</h2>

          <form onSubmit={handleApplyLeave} className="flex flex-col gap-3.5">
            <label className="flex flex-col gap-1.5 text-small font-semibold text-ink">
              <span>Type</span>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="min-h-[44px] px-3 rounded-control border border-line-input bg-surface text-body text-ink focus:border-primary focus:outline-none"
              >
                <option value="Casual leave (8 left)">Casual leave (8 left)</option>
                <option value="Sick leave (9 left)">Sick leave (9 left)</option>
                <option value="Earned leave (22 left)">Earned leave (22 left)</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-small font-semibold text-ink">
                <span>From</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="min-h-[44px] px-3 rounded-control border border-line-input bg-surface text-body text-ink focus:border-primary focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-small font-semibold text-ink">
                <span>To</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="min-h-[44px] px-3 rounded-control border border-line-input bg-surface text-body text-ink focus:border-primary focus:outline-none"
                />
              </label>
            </div>

            <label className="flex items-center gap-2.5 text-body text-ink cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isHalfDay}
                onChange={(e) => setIsHalfDay(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span>Half day</span>
            </label>

            <label className="flex flex-col gap-1.5 text-small font-semibold text-ink">
              <span>Reason</span>
              <input
                required
                value={reason}
                placeholder="e.g. Family function"
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[44px] px-3 rounded-control border border-line-input bg-surface text-body text-ink focus:border-primary focus:outline-none"
              />
            </label>

            <span className="text-small text-ink-secondary leading-snug">
              Your 5 periods that day will be offered for substitution once approved.
            </span>

            <button
              type="submit"
              className="min-h-[46px] px-6 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-body transition-colors mt-1"
            >
              Send for approval
            </button>
          </form>
        </section>

        {/* Right Column (span 7): Requests & Payslips */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* My Requests Card */}
          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="p-3.5 px-5 border-b border-line-row">
              <h2 className="m-0 text-h2 font-semibold text-ink">My requests</h2>
            </div>

            <div className="divide-y divide-line-row">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="p-3 px-5 flex justify-between items-center gap-3 text-body"
                >
                  <span className="text-ink font-medium">
                    {r.type} · {r.dates} · {r.reason}
                  </span>
                  <div>
                    {r.status === "Pending" ? (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-warning-bg text-warning-text">
                        Pending
                      </span>
                    ) : (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-success-bg text-success-text">
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payslips Card */}
          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="p-3.5 px-5 border-b border-line-row">
              <h2 className="m-0 text-h2 font-semibold text-ink">Payslips</h2>
            </div>

            <div className="divide-y divide-line-row">
              {PAYSLIPS.map((slip, idx) => (
                <div
                  key={idx}
                  className="p-3.5 px-5 flex justify-between items-center gap-3 text-body"
                >
                  <span className="text-ink font-medium">{slip.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-body text-ink">{slip.netPay}</span>
                    <button
                      onClick={() => handleDownloadPdf(slip)}
                      className="text-small font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <FiDownload size={14} /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Payslip Modal Preview */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card p-6 max-w-md w-full shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-h2 font-semibold text-ink m-0">
                  {selectedPayslip.month}
                </h3>
                <span className="text-caption text-ink-secondary">Shiksha Public School · Salary Slip</span>
              </div>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="text-ink-secondary hover:text-ink text-body font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-surface-subtle rounded-control border border-line flex flex-col gap-2 text-small">
              <div className="flex justify-between"><span>Basic Pay:</span><strong className="font-mono">₹38,000</strong></div>
              <div className="flex justify-between"><span>DA + HRA:</span><strong className="font-mono">₹14,500</strong></div>
              <div className="flex justify-between text-warning-inline"><span>PF & Tax Deductions:</span><strong className="font-mono">- ₹4,200</strong></div>
              <div className="h-px bg-line-row my-1" />
              <div className="flex justify-between text-body font-bold text-ink"><span>Net Disbursed:</span><strong className="font-mono text-primary">{selectedPayslip.netPay}</strong></div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-line-row">
              <button
                onClick={() => {
                  showToast(`Downloaded ${selectedPayslip.file}`, "success");
                  setSelectedPayslip(null);
                }}
                className="px-4 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5"
              >
                <FiDownload size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLeavePayslip;
