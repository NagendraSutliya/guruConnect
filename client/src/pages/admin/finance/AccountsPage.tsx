import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiDownload,
  FiPlus,
  FiFileText,
  FiCheckCircle,
  FiDollarSign,
  FiX,
  FiUpload,
  FiFilter
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface VoucherRow {
  id: string;
  voucherNo: string;
  type: "Receipt" | "Payment" | "Journal" | "Contra";
  ledgerTitle: string;
  narration: string;
  source: string;
  debit?: number;
  credit?: number;
}

const INITIAL_VOUCHERS: VoucherRow[] = [
  {
    id: "v1",
    voucherNo: "RV/2627/1184",
    type: "Receipt",
    ledgerTitle: "Cash a/c",
    narration: "Counter 1 · 37 receipts",
    source: "Fee counter",
    debit: 284600
  },
  {
    id: "v2",
    voucherNo: "RV/2627/1184",
    type: "Receipt",
    ledgerTitle: "Tuition fee income",
    narration: "Installment 3 collections",
    source: "Fee counter",
    credit: 284600
  },
  {
    id: "v3",
    voucherNo: "RV/2627/1185",
    type: "Receipt",
    ledgerTitle: "Payment gateway clearing",
    narration: "142 online receipts",
    source: "Online fees",
    debit: 496300
  },
  {
    id: "v4",
    voucherNo: "RV/2627/1185",
    type: "Receipt",
    ledgerTitle: "Tuition and transport income",
    narration: "Online collections",
    source: "Online fees",
    credit: 496300
  },
  {
    id: "v5",
    voucherNo: "PV/2627/0412",
    type: "Payment",
    ledgerTitle: "Electricity expense",
    narration: "JVVNL bill Sep · bill attached",
    source: "Manual",
    debit: 38600
  },
  {
    id: "v6",
    voucherNo: "PV/2627/0412",
    type: "Payment",
    ledgerTitle: "HDFC current a/c",
    narration: "NEFT ref #8928192401",
    source: "Manual",
    credit: 38600
  }
];

export default function AccountsPage() {
  const { showToast } = useToast();
  const [vouchers, setVouchers] = useState<VoucherRow[]>(INITIAL_VOUCHERS);
  const [activeSubTab, setActiveSubTab] = useState<"Day book" | "Cash book" | "Bank book" | "Ledgers" | "Trial balance">("Day book");
  const [isNewVoucherOpen, setIsNewVoucherOpen] = useState(false);

  // Form State for New Expense
  const [expLedger, setExpLedger] = useState("Electricity expense");
  const [expAccount, setExpAccount] = useState("HDFC current a/c");
  const [expAmount, setExpAmount] = useState<number | "">("");
  const [expNarration, setExpNarration] = useState("");

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || Number(expAmount) <= 0) {
      showToast("Please enter a valid expense amount", "error");
      return;
    }

    const nextVoucherNo = `PV/2627/0${413 + Math.floor(Math.random() * 50)}`;
    const debitRow: VoucherRow = {
      id: `v-${Date.now()}-1`,
      voucherNo: nextVoucherNo,
      type: "Payment",
      ledgerTitle: expLedger,
      narration: expNarration || "Office expense",
      source: "Manual",
      debit: Number(expAmount)
    };
    const creditRow: VoucherRow = {
      id: `v-${Date.now()}-2`,
      voucherNo: nextVoucherNo,
      type: "Payment",
      ledgerTitle: expAccount,
      narration: expNarration ? `Paid from ${expAccount} · ${expNarration}` : `Paid from ${expAccount}`,
      source: "Manual",
      credit: Number(expAmount)
    };

    setVouchers(prev => [...prev, debitRow, creditRow]);
    setIsNewVoucherOpen(false);
    setExpAmount("");
    setExpNarration("");
    showToast(`Expense voucher ${nextVoucherNo} for ₹${Number(expAmount).toLocaleString("en-IN")} recorded!`, "success");
  };

  const handleExportTallyXML = () => {
    const tallyXml = `<?xml version="1.0" encoding="utf-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
        ${vouchers.map(v => `
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="${v.type}" ACTION="Create">
            <DATE>20261008</DATE>
            <VOUCHERNUMBER>${v.voucherNo}</VOUCHERNUMBER>
            <NARRATION>${v.narration}</NARRATION>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${v.ledgerTitle}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>${v.debit ? "Yes" : "No"}</ISDEEMEDPOSITIVE>
              <AMOUNT>${v.debit ? -v.debit : v.credit}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>`).join("")}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;

    const blob = new Blob([tallyXml], { type: "application/xml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tally_vouchers_export_${new Date().toISOString().slice(0, 10)}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Vouchers exported in standard Tally XML format!", "success");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12">
      {/* Header Row (Matching 25-Accounts.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary flex items-center gap-1.5 flex-wrap">
            <span>Accounts ›</span>
            {(["Day book", "Cash book", "Bank book", "Ledgers", "Trial balance"] as const).map((tab, idx) => (
              <React.Fragment key={tab}>
                {idx > 0 && <span>·</span>}
                <button
                  type="button"
                  onClick={() => setActiveSubTab(tab)}
                  className={`text-[13px] transition-colors cursor-pointer ${
                    activeSubTab === tab ? "font-semibold text-ink" : "text-primary hover:underline"
                  }`}
                >
                  {tab}
                </button>
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            {activeSubTab} · 8 Oct 2026
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Fee receipts and payroll post vouchers automatically; expenses are entered here.
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExportTallyXML}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FiDownload size={14} className="text-ink-secondary" />
            <span>Export to Tally (XML)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewVoucherOpen(true)}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-[#08393F] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            <FiPlus size={15} />
            <span>New expense voucher</span>
          </button>
        </div>
      </div>

      {/* 4 Balance KPI Cards (Matching 25-Accounts.html) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Cash in hand */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Cash in hand</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">₹1,18,450</span>
        </div>

        {/* Card 2: HDFC current a/c */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">HDFC current a/c</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">₹42,36,900</span>
        </div>

        {/* Card 3: Fee income today */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Fee income today</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">₹7,80,900</span>
        </div>

        {/* Card 4: Expenses today */}
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-[12.5px] text-ink-secondary font-medium">Expenses today</span>
          <span className="font-mono text-xl sm:text-[22px] font-semibold text-ink">₹38,600</span>
        </div>
      </div>

      {/* Day Book Table (Matching 25-Accounts.html) */}
      <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-small min-w-[900px]">
            <thead>
              <tr className="bg-[#F2F4F2] text-left text-ink border-b border-line">
                <th className="px-4 py-3 font-semibold w-36">Voucher</th>
                <th className="px-4 py-3 font-semibold w-28">Type</th>
                <th className="px-4 py-3 font-semibold">Ledger / narration</th>
                <th className="px-4 py-3 font-semibold w-32">Source</th>
                <th className="px-4 py-3 font-semibold text-right w-36">Debit</th>
                <th className="px-4 py-3 font-semibold text-right w-36">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1EF]">
              {vouchers.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-[12.5px] text-ink font-medium">
                    {row.voucherNo}
                  </td>

                  <td className="px-4 py-2.5">
                    {row.type === "Receipt" ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-[6px] bg-[#E4F1E8] text-[#1E5A33]">
                        Receipt
                      </span>
                    ) : row.type === "Payment" ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-[6px] bg-[#FFF6EC] text-[#7A4106]">
                        Payment
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-[6px] bg-slate-100 text-slate-700">
                        {row.type}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-2.5">
                    <span className="flex flex-col">
                      <span className="font-medium text-ink">{row.ledgerTitle}</span>
                      <span className="text-[12px] text-ink-secondary">{row.narration}</span>
                    </span>
                  </td>

                  <td className="px-4 py-2.5 text-ink-secondary">
                    {row.source}
                  </td>

                  <td className="px-4 py-2.5 text-right font-mono font-medium text-ink">
                    {row.debit ? `₹${row.debit.toLocaleString("en-IN")}` : ""}
                  </td>

                  <td className="px-4 py-2.5 text-right font-mono font-medium text-ink">
                    {row.credit ? `₹${row.credit.toLocaleString("en-IN")}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MODAL: NEW EXPENSE VOUCHER                                     */}
      {/* ============================================================== */}
      {isNewVoucherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface">
              <h3 className="font-semibold text-base text-ink">Record New Expense Voucher</h3>
              <button
                type="button"
                onClick={() => setIsNewVoucherOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-slate-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Expense Account (Debit)</label>
                <select
                  value={expLedger}
                  onChange={(e) => setExpLedger(e.target.value)}
                  className="w-full h-9 px-3 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="Electricity expense">Electricity expense</option>
                  <option value="Diesel & Fuel Expenses">Diesel & Fuel Expenses</option>
                  <option value="Repairs & Building Maintenance">Repairs & Building Maintenance</option>
                  <option value="Laboratory Consumables">Laboratory Consumables</option>
                  <option value="Sports & Annual Event Supplies">Sports & Annual Event Supplies</option>
                  <option value="Printing & Stationery">Printing & Stationery</option>
                  <option value="Telephone & Internet Charges">Telephone & Internet Charges</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Paid From (Credit Account)</label>
                <select
                  value={expAccount}
                  onChange={(e) => setExpAccount(e.target.value)}
                  className="w-full h-9 px-3 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="HDFC current a/c">HDFC current a/c</option>
                  <option value="Cash a/c">Cash a/c (Drawer)</option>
                  <option value="SBI School Account">SBI School Account</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full h-9 px-3 border border-line-input rounded-control font-mono text-xs text-ink focus:outline-none focus:border-primary"
                  required
                  min={1}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Narration / Bill Details</label>
                <input
                  type="text"
                  placeholder="e.g. Invoice #2910 · Vendor paid via NEFT"
                  value={expNarration}
                  onChange={(e) => setExpNarration(e.target.value)}
                  className="w-full h-9 px-3 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewVoucherOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-xs font-semibold text-ink hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 bg-primary hover:bg-[#08393F] text-white rounded-control text-xs font-semibold shadow-xs"
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
