import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiCheck,
  FiX,
  FiFileText,
  FiRefreshCw
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface ExceptionItem {
  id: string;
  orderId: string;
  student: string;
  amount: number;
  problem: string;
  suggestedAction: string;
  actionLabel: string;
  status: "pending" | "resolved";
}

const INITIAL_EXCEPTIONS: ExceptionItem[] = [
  {
    id: "ex1",
    orderId: "ord_8Kq2…7Fz",
    student: "Myra Joshi · 3-B",
    amount: 17100,
    problem: "Paid at bank, no webhook received",
    suggestedAction: "Status check confirms paid → create receipt",
    actionLabel: "Create receipt",
    status: "pending"
  },
  {
    id: "ex2",
    orderId: "ord_8Kp9…1Ad",
    student: "Om Prakash · 5-A",
    amount: 16900,
    problem: "Paid twice within 2 minutes",
    suggestedAction: "Refund second payment or keep as advance",
    actionLabel: "Decide",
    status: "pending"
  },
  {
    id: "ex3",
    orderId: "ord_8Kn3…Q2s",
    student: "Ira Joshi · 9-C",
    amount: 1200,
    problem: "Missing from settlement file",
    suggestedAction: "Wait one more day, then raise with gateway",
    actionLabel: "Snooze",
    status: "pending"
  },
  {
    id: "ex4",
    orderId: "ord_8Km7…bX4",
    student: "Dev Saini · 8-B",
    amount: 17900,
    problem: "Amount differs from due (₹16,900)",
    suggestedAction: "Excess ₹1,000 kept as student credit",
    actionLabel: "Confirm",
    status: "pending"
  }
];

export default function ReconciliationPage() {
  const { showToast } = useToast();
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(INITIAL_EXCEPTIONS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeModalAction, setActiveModalAction] = useState<ExceptionItem | null>(null);

  const handleResolveAction = (item: ExceptionItem) => {
    setActiveModalAction(item);
  };

  const confirmResolution = (note?: string) => {
    if (!activeModalAction) return;
    setExceptions(prev =>
      prev.map(e => e.id === activeModalAction.id ? { ...e, status: "resolved" } : e)
    );
    showToast(`Exception for ${activeModalAction.orderId} successfully resolved!`, "success");
    setActiveModalAction(null);
  };

  const pendingExceptionsCount = exceptions.filter(e => e.status === "pending").length;

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12">
      {/* Header Row (Matching 23-Reconciliation.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Fees › Online payments
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Online payments · 8 Oct 2026
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Gateway settlement file matched automatically at 6:00 am. Pending orders are re-checked every 30 minutes.
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <FiUpload size={14} className="text-ink-secondary" />
          <span>Upload settlement file</span>
        </button>
      </div>

      {/* 4 KPI Metric Cards (Matching 23-Reconciliation.html) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Paid Orders */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Paid orders</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">₹4,96,300</span>
          <span className="text-[12.5px] text-ink-secondary">142 receipts issued</span>
        </div>

        {/* Card 2: Settled by Gateway */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Settled by gateway</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">₹4,91,040</span>
          <span className="text-[12.5px] text-ink-secondary">after ₹5,260 charges</span>
        </div>

        {/* Card 3: Matched Lines */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Matched</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">
            {138 + (4 - pendingExceptionsCount)} of 142
          </span>
          <span className="text-[12.5px] text-ink-secondary">receipt = settlement line</span>
        </div>

        {/* Card 4: Exceptions */}
        <div className="bg-warning-bg border border-warning-border rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-warning-text font-medium">Exceptions</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-warning-text">
            {pendingExceptionsCount}
          </span>
          <span className="text-[12.5px] text-warning-text">
            {pendingExceptionsCount === 0 ? "All resolved!" : "need a person to decide"}
          </span>
        </div>
      </div>

      {/* Exceptions Section (Matching 23-Reconciliation.html) */}
      <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-line bg-surface flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Exceptions to resolve</h2>
          <span className="text-xs text-ink-secondary font-medium">
            {pendingExceptionsCount} issues pending review
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-small min-w-[880px]">
            <thead>
              <tr className="bg-surface-head text-left text-ink border-b border-line">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold text-right">Amount</th>
                <th className="px-4 py-3 font-semibold">Problem</th>
                <th className="px-4 py-3 font-semibold">Suggested action</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-row">
              {exceptions.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-[12.5px] text-ink font-medium">
                    {row.orderId}
                  </td>

                  <td className="px-4 py-2.5 font-semibold text-ink">
                    {row.student}
                  </td>

                  <td className="px-4 py-2.5 text-right font-mono font-medium text-ink">
                    ₹{row.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 py-2.5 text-warning-inline font-medium">
                    {row.problem}
                  </td>

                  <td className="px-4 py-2.5 text-ink-secondary">
                    {row.suggestedAction}
                  </td>

                  <td className="px-4 py-2 text-right">
                    {row.status === "resolved" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <FiCheck size={13} />
                        Resolved
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleResolveAction(row)}
                        className="min-h-[38px] px-3.5 rounded-control border-0 bg-primary-tint hover:bg-[#d0e5e5] text-primary-dark text-[13px] font-semibold transition-colors cursor-pointer"
                      >
                        {row.actionLabel}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MODAL: EXCEPTION RESOLUTION DIALOG                             */}
      {/* ============================================================== */}
      {activeModalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface">
              <h3 className="font-semibold text-base text-ink">
                Resolve Exception: {activeModalAction.actionLabel}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModalAction(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-slate-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 border border-line rounded text-xs space-y-1.5 text-ink">
                <div><b>Order ID:</b> <span className="font-mono">{activeModalAction.orderId}</span></div>
                <div><b>Student:</b> {activeModalAction.student}</div>
                <div><b>Amount:</b> <span className="font-mono font-bold">₹{activeModalAction.amount.toLocaleString("en-IN")}</span></div>
                <div><b>Problem:</b> <span className="text-warning-inline">{activeModalAction.problem}</span></div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
                <b>Recommended action:</b> {activeModalAction.suggestedAction}
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveModalAction(null)}
                  className="px-4 py-2 border border-line-input rounded-control text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmResolution()}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control text-xs font-semibold shadow-xs"
                >
                  Confirm &amp; Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: UPLOAD SETTLEMENT FILE                                  */}
      {/* ============================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface">
              <h3 className="font-semibold text-base text-ink">Upload Gateway Settlement File</h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-slate-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="border-2 border-dashed border-line-input rounded-card p-6 text-center hover:border-primary transition-colors cursor-pointer bg-slate-50">
                <FiUpload className="mx-auto text-ink-secondary mb-2" size={24} />
                <span className="text-xs font-semibold text-ink block">
                  Click or drag settlement CSV / Excel file here
                </span>
                <span className="text-[11px] text-ink-secondary block mt-0.5">
                  Supported: Razorpay, PayU, HDFC SmartHub, Cashfree settlement formats
                </span>
              </div>

              <div className="text-[11px] text-ink-secondary leading-relaxed">
                The auto-matcher compares Order IDs, UTR timestamps and transaction amounts against system fee receipts.
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    showToast("Settlement file processed! 142 lines matched with 0 new errors.", "success");
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control text-xs font-semibold shadow-xs"
                >
                  Process File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
