import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiPrinter,
  FiCheckCircle,
  FiDollarSign,
  FiCreditCard,
  FiSmartphone,
  FiFileText,
  FiClock,
  FiAlertCircle,
  FiArrowRight
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface Installment {
  id: string;
  name: string;
  breakdown: string;
  amount: number;
  dueDate: string;
  isOverdue?: boolean;
  isOptional?: boolean;
  checked: boolean;
}

const DEFAULT_INSTALLMENTS: Installment[] = [
  {
    id: "inst-2",
    name: "Installment 2 · Jul–Sep",
    breakdown: "Tuition ₹13,300 · Transport ₹3,600 · Science Lab ₹1,000",
    amount: 17900,
    dueDate: "Overdue since 15 Jul",
    isOverdue: true,
    checked: true
  },
  {
    id: "inst-3",
    name: "Installment 3 · Oct–Dec",
    breakdown: "Tuition ₹13,300 · Transport ₹3,600",
    amount: 16900,
    dueDate: "Due 15 Oct",
    isOverdue: false,
    checked: true
  },
  {
    id: "inst-4",
    name: "Installment 4 · Jan–Mar",
    breakdown: "Tuition ₹13,300 · Transport ₹3,600",
    amount: 16900,
    dueDate: "Due 15 Jan",
    isOverdue: false,
    checked: false
  },
  {
    id: "inst-trip",
    name: "Annual Science Excursion (Optional)",
    breakdown: "Jaipur Heritage & Science City Field Tour",
    amount: 2400,
    dueDate: "Due 30 Oct",
    isOptional: true,
    checked: false
  }
];

export default function FeeCounter() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("2017/0064");
  const [installments, setInstallments] = useState<Installment[]>(DEFAULT_INSTALLMENTS);
  const [paymentMode, setPaymentMode] = useState<"cash" | "upi" | "card" | "cheque">("upi");
  const [waiveLateFee, setWaiveLateFee] = useState(false);
  const [txnRef, setTxnRef] = useState("");
  const [isReceiptGenerated, setIsReceiptGenerated] = useState(false);

  const student = {
    name: "Harsh Vardhan",
    classGrade: "8-A",
    admNo: "2017/0064",
    guardian: "Anita Vardhan",
    phone: "98870 5xxxx",
    category: "Staff Ward Concession (10% on Tuition)"
  };

  const toggleInstallment = (id: string) => {
    setInstallments(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const selectedTotal = installments
    .filter(i => i.checked)
    .reduce((sum, i) => sum + i.amount, 0);

  const lateFee = waiveLateFee ? 0 : 500;
  const grandTotal = selectedTotal + lateFee;

  const handleCollect = () => {
    if (selectedTotal === 0) {
      showToast("Please select at least one installment to collect.", "error");
      return;
    }
    setIsReceiptGenerated(true);
    showToast(`Receipt RCP/2627/004201 for ₹${grandTotal.toLocaleString("en-IN")} generated successfully!`, "success");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Top Breadcrumb & Counter stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Fees & Accounts › Counter 1
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Fee Collection Desk</h1>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-surface border border-line rounded-control px-3.5 py-2 text-navy font-medium shadow-xs">
            Today at Counter 1: <b className="font-mono text-teal">₹2,84,600</b> · 37 receipts
          </div>
          <Link
            to="/admin/cash-closing"
            className="text-teal hover:underline font-semibold"
          >
            Day-End Cash Closing →
          </Link>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-semibold">
        <span className="text-teal border-b-2 border-teal pb-2 px-1">Collect Fee</span>
        <Link to="/admin/fee-structure" className="text-navy-muted hover:text-navy px-2 pb-2">
          Fee Structure
        </Link>
        <Link to="/admin/defaulters" className="text-navy-muted hover:text-navy px-2 pb-2">
          Defaulters Register
        </Link>
        <Link to="/admin/accounts" className="text-navy-muted hover:text-navy px-2 pb-2">
          Day Book & Vouchers
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student & Installments */}
        <div className="lg:col-span-7 space-y-5">
          {/* Student Search & Profile Card */}
          <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted" size={16} />
              <input
                type="text"
                placeholder="Search admission no, student name or parent phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-24 py-2 bg-page border border-line rounded-control text-xs text-navy focus:outline-none focus:border-teal"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-teal hover:bg-teal-hover text-white text-xs font-semibold rounded-control transition">
                Find
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-page rounded-control border border-line/70">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-control bg-teal/15 text-teal flex items-center justify-center font-bold text-sm">
                  HV
                </div>
                <div>
                  <div className="font-bold text-sm text-navy">{student.name} · {student.classGrade}</div>
                  <div className="text-xs text-navy-muted">
                    Adm: {student.admNo} · Guardian: {student.guardian} ({student.phone})
                  </div>
                  <div className="text-[11px] font-semibold text-teal mt-0.5">{student.category}</div>
                </div>
              </div>
              <button className="px-2.5 py-1 text-xs border border-line rounded-control bg-surface hover:bg-page text-navy-muted font-medium">
                Change
              </button>
            </div>
          </div>

          {/* Installments Checklist */}
          <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-line flex items-center justify-between bg-page/40">
              <h2 className="font-semibold text-xs text-navy uppercase tracking-wider">
                Installment Dues (Oldest First)
              </h2>
              <span className="text-[11px] text-navy-muted">Select dues to settle</span>
            </div>

            <div className="divide-y divide-line/70">
              {installments.map(item => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3.5 p-4 cursor-pointer transition ${
                    item.checked ? "bg-teal/5" : "hover:bg-page/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleInstallment(item.id)}
                    className="mt-1 w-4 h-4 text-teal rounded focus:ring-teal"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-navy">{item.name}</span>
                      <span className="font-mono font-bold text-sm text-navy">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-navy-muted mt-0.5">{item.breakdown}</p>
                    <div className="mt-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isOverdue
                            ? "bg-amber-100 text-amber-800"
                            : item.isOptional
                            ? "bg-slate-100 text-slate-700"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Settlement Desk */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-5">
            <h2 className="font-semibold text-sm text-navy flex items-center justify-between border-b border-line pb-3">
              <span>Payment Breakdown</span>
              <span className="font-mono text-xs text-navy-muted">Currency: INR (₹)</span>
            </h2>

            {/* Summary Lines */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-navy-muted">
                <span>Tuition & Core Fees</span>
                <span className="font-mono font-semibold text-navy">
                  ₹{selectedTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer text-navy">
                  <input
                    type="checkbox"
                    checked={waiveLateFee}
                    onChange={e => setWaiveLateFee(e.target.checked)}
                    className="rounded text-teal"
                  />
                  <span>Waive late fee penalty</span>
                </label>
                <span className="font-mono font-semibold text-navy">
                  {waiveLateFee ? <s className="text-navy-muted">₹500</s> : "₹500"}
                </span>
              </div>

              <div className="pt-2 border-t border-line flex justify-between text-sm font-bold text-navy">
                <span>Net Payable Amount</span>
                <span className="font-mono text-base text-teal">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-navy">Select Payment Mode</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: "upi", label: "Dynamic UPI QR", icon: <FiSmartphone /> },
                  { key: "cash", label: "Cash at Desk", icon: <FiDollarSign /> },
                  { key: "card", label: "POS / Card", icon: <FiCreditCard /> },
                  { key: "cheque", label: "Cheque / DD", icon: <FiFileText /> }
                ].map(m => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setPaymentMode(m.key as any)}
                    className={`flex items-center gap-2 p-2.5 rounded-control border font-semibold transition ${
                      paymentMode === m.key
                        ? "border-teal bg-teal/10 text-teal shadow-xs"
                        : "border-line bg-page text-navy-muted hover:text-navy"
                    }`}
                  >
                    {m.icon} <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI QR Display Mock if selected */}
            {paymentMode === "upi" && (
              <div className="p-3.5 bg-page border border-dashed border-teal/50 rounded-control flex items-center gap-4">
                <div className="w-16 h-16 bg-white border border-line rounded-control flex items-center justify-center font-mono text-[9px] text-center text-navy-muted font-bold">
                  [UPI QR]
                </div>
                <div className="text-xs">
                  <div className="font-bold text-navy">Scan with PhonePe, GPay, Paytm</div>
                  <div className="text-navy-muted text-[11px]">Instant automated receipt matching</div>
                </div>
              </div>
            )}

            {/* Reference Number */}
            <div>
              <label className="block text-xs font-medium text-navy mb-1">
                Transaction / Cheque / Reference No. (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. UTR-982184918 or Cheque 004812"
                value={txnRef}
                onChange={e => setTxnRef(e.target.value)}
                className="w-full px-3 py-2 bg-page border border-line rounded-control text-xs text-navy focus:outline-none focus:border-teal font-mono"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleCollect}
                className="w-full py-3 bg-teal hover:bg-teal-hover text-white rounded-control font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <FiCheckCircle size={15} /> Collect ₹{grandTotal.toLocaleString("en-IN")} & Print Receipt
              </button>
            </div>
          </div>

          {/* Generated Receipt Modal / View */}
          {isReceiptGenerated && (
            <div className="bg-surface border-2 border-teal/40 rounded-panel p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-teal">
                <span className="flex items-center gap-1.5">
                  <FiCheckCircle /> Receipt Generated: RCP/2627/004201
                </span>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1 bg-teal text-white rounded-control hover:bg-teal-hover transition flex items-center gap-1 font-semibold"
                >
                  <FiPrinter size={13} /> Print
                </button>
              </div>
              <div className="p-3 bg-page rounded-control text-[11px] font-mono text-navy space-y-1">
                <div>Student: {student.name} ({student.admNo})</div>
                <div>Amount: ₹{grandTotal.toLocaleString("en-IN")} ({paymentMode.toUpperCase()})</div>
                <div>Counter: 01 · Cashier: Meera Kumawat</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
