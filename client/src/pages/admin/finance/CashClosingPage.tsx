import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiPrinter,
  FiDollarSign,
  FiAlertTriangle,
  FiLock,
  FiSave
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface Denomination {
  note: number;
  count: number;
}

export default function CashClosingPage() {
  const { showToast } = useToast();
  const [denominations, setDenominations] = useState<Denomination[]>([
    { note: 500, count: 214 },
    { note: 200, count: 42 },
    { note: 100, count: 28 },
    { note: 50, count: 15 },
    { note: 20, count: 12 },
    { note: 10, count: 9 }
  ]);
  const [cashierNotes, setCashierNotes] = useState("Handover verified with safe locker key keeper.");
  const [isClosed, setIsClosed] = useState(false);

  // Expected from system vouchers
  const openingFloat = 2000;
  const systemCollected = 116450;
  const expectedTotal = openingFloat + systemCollected; // 1,18,450

  const handleCountChange = (note: number, count: number) => {
    setDenominations(prev =>
      prev.map(d => (d.note === note ? { ...d, count: Math.max(0, count || 0) } : d))
    );
  };

  const physicalCash = denominations.reduce((sum, d) => sum + d.note * d.count, 0);
  const variance = physicalCash - expectedTotal;

  const handleCloseCounter = () => {
    setIsClosed(true);
    showToast("Day-end cash closing locked successfully. Handover report saved.", "success");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Fees & Accounts › Day-End Operations
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Counter Cash Closing & Handover</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Reconcile physical drawer cash against system receipts before locking daily ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/collect-fees"
            className="px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-semibold text-navy transition"
          >
            ← Back to Fee Counter
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-medium text-navy transition"
          >
            <FiPrinter size={14} /> Print Summary
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Physical Currency Denomination Breakdown */}
        <div className="lg:col-span-7 bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 className="font-semibold text-sm text-navy">Physical Currency Denominations</h2>
            <span className="text-xs font-mono font-medium text-navy-muted">Count in Drawer</span>
          </div>

          <div className="divide-y divide-line/60 text-xs">
            {denominations.map(d => (
              <div key={d.note} className="py-2.5 flex items-center justify-between gap-4">
                <div className="w-24 font-bold text-navy flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal/20"></span>
                  ₹{d.note} Notes
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-navy-muted">×</span>
                  <input
                    type="number"
                    min="0"
                    disabled={isClosed}
                    value={d.count}
                    onChange={e => handleCountChange(d.note, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 text-center font-mono font-bold bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal disabled:opacity-60"
                  />
                </div>
                <div className="w-28 text-right font-mono font-semibold text-navy">
                  = ₹{(d.note * d.count).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-between font-bold text-sm text-navy">
            <span>Total Physical Cash Counted</span>
            <span className="font-mono text-base text-teal">
              ₹{physicalCash.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Right: Reconciliation & Sign-off */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4 text-xs">
            <h2 className="font-semibold text-sm text-navy border-b border-line pb-3">
              System vs Physical Reconciliation
            </h2>

            <div className="space-y-2.5 divide-y divide-line/60">
              <div className="flex justify-between py-1 text-navy-muted">
                <span>Opening Cash Float</span>
                <span className="font-mono font-semibold text-navy">
                  ₹{openingFloat.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between py-1 text-navy-muted">
                <span>Cash Receipts Collected Today (37 txns)</span>
                <span className="font-mono font-semibold text-navy">
                  ₹{systemCollected.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between py-1 font-semibold text-navy">
                <span>Expected System Balance</span>
                <span className="font-mono font-bold">
                  ₹{expectedTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between py-1 font-semibold text-navy">
                <span>Physical Cash Counted</span>
                <span className="font-mono font-bold text-teal">
                  ₹{physicalCash.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Variance Alert */}
              <div className="pt-2 flex justify-between items-center text-sm font-bold">
                <span className="flex items-center gap-1.5">
                  {variance === 0 ? (
                    <FiCheckCircle className="text-emerald-600" />
                  ) : (
                    <FiAlertTriangle className="text-amber-600" />
                  )}
                  Discrepancy / Variance
                </span>
                <span
                  className={`font-mono ${
                    variance === 0
                      ? "text-emerald-700"
                      : variance > 0
                      ? "text-blue-700"
                      : "text-red-700"
                  }`}
                >
                  {variance === 0
                    ? "₹0 (Balanced)"
                    : variance > 0
                    ? `+₹${variance.toLocaleString("en-IN")} (Surplus)`
                    : `-₹${Math.abs(variance).toLocaleString("en-IN")} (Shortage)`}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">Cashier Handover Notes</label>
              <textarea
                rows={3}
                disabled={isClosed}
                value={cashierNotes}
                onChange={e => setCashierNotes(e.target.value)}
                className="w-full p-2.5 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal disabled:opacity-60"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleCloseCounter}
                disabled={isClosed}
                className="w-full py-3 bg-teal hover:bg-teal-hover disabled:bg-slate-400 text-white rounded-control font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <FiLock size={14} />
                {isClosed ? "Counter Locked & Submitted" : "Lock Counter & Submit Handover"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
