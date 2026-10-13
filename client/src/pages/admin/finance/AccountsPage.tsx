import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiDownload,
  FiPlus,
  FiFileText,
  FiCalendar,
  FiFilter,
  FiCheckCircle,
  FiBookOpen
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface Voucher {
  id: string;
  voucherNo: string;
  type: "Receipt" | "Payment" | "Journal" | "Contra";
  ledger: string;
  narration: string;
  source: string;
  debit?: number;
  credit?: number;
}

const DEFAULT_VOUCHERS: Voucher[] = [
  {
    id: "1",
    voucherNo: "RV/2627/1184",
    type: "Receipt",
    ledger: "Cash Account",
    narration: "Counter 1 · 37 fee receipts collected",
    source: "Fee counter",
    debit: 284600
  },
  {
    id: "2",
    voucherNo: "RV/2627/1184",
    type: "Receipt",
    ledger: "Tuition Fee Income",
    narration: "Installment 3 collections",
    source: "Fee counter",
    credit: 284600
  },
  {
    id: "3",
    voucherNo: "RV/2627/1185",
    type: "Receipt",
    ledger: "HDFC Payment Gateway Clearing",
    narration: "142 online parent portal receipts",
    source: "Online fees",
    debit: 496300
  },
  {
    id: "4",
    voucherNo: "RV/2627/1185",
    type: "Receipt",
    ledger: "Tuition & Term Fee Income",
    narration: "Direct settlement from gateway",
    source: "Online fees",
    credit: 496300
  },
  {
    id: "5",
    voucherNo: "PV/2627/0412",
    type: "Payment",
    ledger: "Diesel & Fuel Expenses",
    narration: "Bus 1, 2, 3 fuel top-up · Indian Oil slip #8142",
    source: "Transport",
    debit: 18400
  },
  {
    id: "6",
    voucherNo: "PV/2627/0412",
    type: "Payment",
    ledger: "HDFC Current Account",
    narration: "Paid via corporate debit card",
    source: "Transport",
    credit: 18400
  },
  {
    id: "7",
    voucherNo: "PV/2627/0413",
    type: "Payment",
    ledger: "Printing & Stationery Expenses",
    narration: "Exam question paper bundles · Anil Printers",
    source: "Examination",
    debit: 20200
  },
  {
    id: "8",
    voucherNo: "PV/2627/0413",
    type: "Payment",
    ledger: "Cash Account",
    narration: "Paid from counter petty cash drawer",
    source: "Examination",
    credit: 20200
  }
];

export default function AccountsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"daybook" | "cashbook" | "bankbook" | "trial">("daybook");
  const [vouchers, setVouchers] = useState<Voucher[]>(DEFAULT_VOUCHERS);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    ledger: "Electricity & Utility Expenses",
    narration: "",
    amount: "",
    paymentMode: "Cash Account"
  });

  const handleExportTally = () => {
    showToast("Generating Tally-compliant XML voucher export...", "success");
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.narration || !expenseForm.amount) {
      showToast("Please provide expense details and amount.", "error");
      return;
    }
    const amt = parseFloat(expenseForm.amount);
    const vNo = `PV/2627/04${Math.floor(14 + Math.random() * 80)}`;
    const newDebit: Voucher = {
      id: String(Date.now()),
      voucherNo: vNo,
      type: "Payment",
      ledger: expenseForm.ledger,
      narration: expenseForm.narration,
      source: "Manual Voucher",
      debit: amt
    };
    const newCredit: Voucher = {
      id: String(Date.now() + 1),
      voucherNo: vNo,
      type: "Payment",
      ledger: expenseForm.paymentMode,
      narration: `Payment for ${expenseForm.ledger}`,
      source: "Manual Voucher",
      credit: amt
    };

    setVouchers([newDebit, newCredit, ...vouchers]);
    setIsExpenseModalOpen(false);
    setExpenseForm({ ledger: "Electricity & Utility Expenses", narration: "", amount: "", paymentMode: "Cash Account" });
    showToast("Expense voucher posted to double-entry ledger!", "success");
  };

  const totalDebit = vouchers.reduce((sum, v) => sum + (v.debit || 0), 0);
  const totalCredit = vouchers.reduce((sum, v) => sum + (v.credit || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Accounts & Finance › General Ledger
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Day Book & Double-Entry Ledger</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Fee counter receipts and payroll vouchers auto-post directly into the audit-compliant books.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportTally}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-medium text-navy transition"
          >
            <FiDownload size={14} /> Export to Tally (XML)
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
          >
            <FiPlus size={15} /> New Expense Voucher
          </button>
        </div>
      </div>

      {/* Financial Health KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Cash in Hand</div>
          <div className="font-mono text-xl font-bold text-navy">₹1,18,450</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">HDFC Current A/c</div>
          <div className="font-mono text-xl font-bold text-navy">₹42,36,900</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-emerald-700 font-medium">Fee Income Today</div>
          <div className="font-mono text-xl font-bold text-emerald-700">₹7,80,900</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-amber-800 font-medium">Expenses Today</div>
          <div className="font-mono text-xl font-bold text-amber-800">₹38,600</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line gap-2 overflow-x-auto">
        {[
          { key: "daybook", label: "Day Book (All Vouchers)" },
          { key: "cashbook", label: "Cash Book" },
          { key: "bankbook", label: "Bank Book" },
          { key: "trial", label: "Trial Balance" }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.key
                ? "border-teal text-teal"
                : "border-transparent text-navy-muted hover:text-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                <th className="py-3 px-4 w-32">Voucher No.</th>
                <th className="py-3 px-4 w-24">Type</th>
                <th className="py-3 px-4">Ledger Account & Narration</th>
                <th className="py-3 px-4 w-32">Source Module</th>
                <th className="py-3 px-4 text-right w-28">Debit (₹)</th>
                <th className="py-3 px-4 text-right w-28">Credit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {vouchers.map(v => (
                <tr key={v.id} className="hover:bg-page/40 transition">
                  <td className="py-3 px-4 font-mono text-navy font-semibold">{v.voucherNo}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.type === "Receipt"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {v.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy">{v.ledger}</div>
                    <div className="text-navy-muted text-[11px]">{v.narration}</div>
                  </td>
                  <td className="py-3 px-4 text-navy-muted font-medium">{v.source}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-navy">
                    {v.debit ? `₹${v.debit.toLocaleString("en-IN")}` : ""}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-navy">
                    {v.credit ? `₹${v.credit.toLocaleString("en-IN")}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-page border-t-2 border-line font-bold text-navy">
                <td colSpan={4} className="py-3 px-4 text-right">
                  Total Voucher Balance:
                </td>
                <td className="py-3 px-4 text-right font-mono text-teal">
                  ₹{totalDebit.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-4 text-right font-mono text-teal">
                  ₹{totalCredit.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* New Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-panel w-full max-w-md shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-bold text-base text-navy">Post Expense Voucher</h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-navy-muted hover:text-navy text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-navy mb-1">Expense Account / Head *</label>
                <select
                  value={expenseForm.ledger}
                  onChange={e => setExpenseForm({ ...expenseForm, ledger: e.target.value })}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                >
                  <option>Electricity & Utility Expenses</option>
                  <option>Diesel & Fuel Expenses</option>
                  <option>Printing & Stationery Expenses</option>
                  <option>Repair & Maintenance Expenses</option>
                  <option>Staff Tea & Refreshment</option>
                  <option>Sports & Equipment Purchase</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">Narration / Vendor Bill Slip *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Paid electricity bill for Sep 2026, bill #84912"
                  value={expenseForm.narration}
                  onChange={e => setExpenseForm({ ...expenseForm, narration: e.target.value })}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 4500"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-navy mb-1">Paid From</label>
                  <select
                    value={expenseForm.paymentMode}
                    onChange={e => setExpenseForm({ ...expenseForm, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                  >
                    <option value="Cash Account">Cash Drawer</option>
                    <option value="HDFC Current Account">HDFC Current A/c</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 border border-line rounded-control text-navy hover:bg-page font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal hover:bg-teal-hover text-white rounded-control font-semibold shadow-xs transition"
                >
                  Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
