import React, { useState } from "react";
import {
  FiPrinter,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiSave,
  FiArrowLeft
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface Denomination {
  note: number;
  count: number;
}

const INITIAL_DENOMINATIONS: Denomination[] = [
  { note: 500, count: 520 },
  { note: 200, count: 90 },
  { note: 100, count: 51 },
  { note: 50, count: 20 },
  { note: 20, count: 15 },
  { note: 10, count: 10 },
  { note: 5, count: 0 }
];

export default function CashClosingPage() {
  const { showToast } = useToast();
  const [denominations, setDenominations] = useState<Denomination[]>(INITIAL_DENOMINATIONS);
  const [openingFloat, setOpeningFloat] = useState(0);
  const [supervisorNote, setSupervisorNote] = useState("₹100 difference was due to rounding change on counter receipt RCP/2627/004205.");
  const [supervisorPass, setSupervisorPass] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // System receipts (37 receipts = ₹2,84,600)
  const systemCashReceipts = 284600;
  const nonCashCollected = 112300; // UPI / card / cheque

  const handleIncrement = (note: number) => {
    setDenominations(prev =>
      prev.map(d => (d.note === note ? { ...d, count: d.count + 1 } : d))
    );
  };

  const handleDecrement = (note: number) => {
    setDenominations(prev =>
      prev.map(d => (d.note === note ? { ...d, count: Math.max(0, d.count - 1) } : d))
    );
  };

  const handleCountChange = (note: number, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setDenominations(prev =>
      prev.map(d => (d.note === note ? { ...d, count: num } : d))
    );
  };

  const cashCounted = denominations.reduce((sum, d) => sum + d.note * d.count, 0);
  const expectedTotal = systemCashReceipts + openingFloat;
  const variance = cashCounted - expectedTotal; // negative means Short

  const handleLockCounter = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLocked(true);
    showToast("Counter 1 day-end cash closing verified and locked successfully!", "success");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12">
      {/* Header Row (Matching 24-CashClosing.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Fees › Cash closing
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Counter 1 · cash closing for 9 Oct 2026
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Count the cash in the drawer. A supervisor signs off before the counter can open tomorrow.
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <FiPrinter size={14} className="text-ink-secondary" />
          <span>Print Summary</span>
        </button>
      </div>

      {/* Locked Status Banner if already closed */}
      {isLocked && (
        <div className="bg-success-bg border border-emerald-300 rounded-[10px] p-4 text-xs text-success-text flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCheckCircle size={18} />
            <span className="font-semibold text-sm">
              Counter 1 is LOCKED for 9 Oct 2026. Handover verified by Head Accountant.
            </span>
          </div>
          <span className="font-mono font-medium">Ref: CLS-2627-0194</span>
        </div>
      )}

      {/* Main Two-Column Layout (Matching 24-CashClosing.html) */}
      <div className="flex flex-wrap gap-5 items-start">
        {/* Left Section: Notes and Coins Counted */}
        <section className="flex-[999_1_480px] min-w-0 bg-white border border-line rounded-card overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 border-b border-line bg-surface">
            <h2 className="text-base font-semibold text-ink">Notes and coins counted</h2>
          </div>

          <div className="divide-y divide-line-row">
            {denominations.map((denom) => {
              const subtotal = denom.note * denom.count;
              return (
                <div
                  key={denom.note}
                  className="grid grid-cols-[90px_1fr_140px] gap-4 items-center px-5 py-2.5 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Note Label */}
                  <span className="font-mono text-[15px] font-medium text-ink">
                    ₹{denom.note}
                  </span>

                  {/* Counter Buttons + Input */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleDecrement(denom.note)}
                      aria-label={`One less ₹${denom.note}`}
                      className="w-10 h-10 rounded-control border border-line-input bg-white hover:bg-slate-100 text-ink text-lg font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    
                    <input
                      type="text"
                      disabled={isLocked}
                      value={denom.count}
                      onChange={(e) => handleCountChange(denom.note, e.target.value)}
                      className="w-16 h-10 text-center rounded-control border border-line-input bg-white font-mono text-[15px] text-ink focus:outline-none focus:border-primary disabled:bg-slate-50"
                    />

                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleIncrement(denom.note)}
                      aria-label={`One more ₹${denom.note}`}
                      className="w-10 h-10 rounded-control border border-line-input bg-white hover:bg-slate-100 text-ink text-lg font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-right font-mono text-[15px] font-medium text-ink">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Aside: Summary & Supervisor Sign-off */}
        <aside className="flex-[1_1_320px] flex flex-col gap-4">
          
          {/* Summary Box (Matching 24-CashClosing.html) */}
          <section className="bg-white border border-line rounded-card p-5 flex flex-col gap-2.5 text-small shadow-xs">
            <h2 className="text-base font-semibold text-ink mb-1">Summary</h2>

            <div className="flex justify-between items-center">
              <span className="text-ink-secondary">Cash receipts in system (37)</span>
              <span className="font-mono text-ink">₹{systemCashReceipts.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-ink-secondary">Opening float</span>
              <span className="font-mono text-ink">₹{openingFloat.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-ink-secondary">Cash counted</span>
              <span className="font-mono text-ink font-semibold">
                ₹{cashCounted.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Short / Excess Box */}
            {variance !== 0 ? (
              <div
                className={`flex justify-between items-center px-3 py-2.5 mt-1 rounded-control font-semibold ${
                  variance < 0
                    ? "bg-warning-bg text-warning-text"
                    : "bg-success-bg text-success-text"
                }`}
              >
                <span>{variance < 0 ? "Short" : "Surplus"}</span>
                <span className="font-mono">
                  {variance < 0 ? `−₹${Math.abs(variance).toLocaleString("en-IN")}` : `+₹${variance.toLocaleString("en-IN")}`}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center px-3 py-2.5 mt-1 rounded-control bg-success-bg text-success-text font-semibold">
                <span>Exact Match</span>
                <span className="font-mono">₹0</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-line text-ink">
              <span className="text-ink-secondary">UPI / card / cheque today</span>
              <span className="font-mono text-ink">₹{nonCashCollected.toLocaleString("en-IN")}</span>
            </div>
          </section>

          {/* Supervisor Sign-Off Form (Matching 24-CashClosing.html) */}
          <section className="bg-white border border-line rounded-card p-5 flex flex-col gap-3.5 shadow-xs">
            <form onSubmit={handleLockCounter} className="space-y-3">
              <div>
                <label className="block text-[13.5px] font-medium text-ink mb-1">
                  Note for the supervisor
                </label>
                <textarea
                  rows={3}
                  disabled={isLocked}
                  value={supervisorNote}
                  onChange={(e) => setSupervisorNote(e.target.value)}
                  className="w-full p-2.5 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary disabled:bg-slate-50"
                  placeholder="Explain any short/excess or drawer variance..."
                />
              </div>

              <div>
                <label className="block text-[13.5px] font-medium text-ink mb-1">
                  Supervisor PIN / Password
                </label>
                <input
                  type="password"
                  disabled={isLocked}
                  placeholder="Enter supervisor PIN"
                  value={supervisorPass}
                  onChange={(e) => setSupervisorPass(e.target.value)}
                  className="w-full h-9 px-3 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary disabled:bg-slate-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLocked}
                className={`w-full min-h-[48px] rounded-control border-0 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                  isLocked
                    ? "bg-primary-disabled cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark active:scale-[0.99]"
                }`}
              >
                <FiLock size={15} />
                <span>{isLocked ? "Counter 1 Locked" : "Sign off and lock Counter 1"}</span>
              </button>
            </form>
          </section>

        </aside>
      </div>
    </div>
  );
}
