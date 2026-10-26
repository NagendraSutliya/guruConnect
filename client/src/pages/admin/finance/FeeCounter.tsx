import React, { useState, useRef, useEffect } from "react";
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
  FiArrowRight,
  FiX,
  FiDownload,
  FiCheck,
  FiChevronRight
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

interface StudentRecord {
  id: string;
  name: string;
  classGrade: string;
  admNo: string;
  guardian: string;
  phone: string;
  category: string;
  initials: string;
}

const SAMPLE_STUDENTS: StudentRecord[] = [
  {
    id: "s1",
    name: "Harsh Vardhan",
    classGrade: "8-A",
    admNo: "2017/0064",
    guardian: "Anita Vardhan",
    phone: "98870 5xxxx",
    category: "Staff ward concession",
    initials: "HV"
  },
  {
    id: "s2",
    name: "Kunal Mehra",
    classGrade: "7-C",
    admNo: "2018/0092",
    guardian: "Ajay Mehra",
    phone: "98290 2xxxx",
    category: "Regular category",
    initials: "KM"
  },
  {
    id: "s3",
    name: "Tanya Saini",
    classGrade: "6-C",
    admNo: "2019/0142",
    guardian: "Mukesh Saini",
    phone: "94140 7xxxx",
    category: "Sibling concession (2nd child)",
    initials: "TS"
  },
  {
    id: "s4",
    name: "Aditi Sharma",
    classGrade: "6-A",
    admNo: "2024/0821",
    guardian: "Rakesh Sharma",
    phone: "98281 4xxxx",
    category: "Regular category",
    initials: "AS"
  }
];

const INITIAL_INSTALLMENTS: Installment[] = [
  {
    id: "inst-2",
    name: "Installment 2 · Jul–Sep",
    breakdown: "Tuition ₹13,300 · Transport ₹3,600 · Lab ₹1,000",
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
    name: "Annual trip (optional)",
    breakdown: "Jaipur heritage walk",
    amount: 1200,
    dueDate: "Due 30 Oct",
    isOptional: true,
    checked: false
  }
];

export default function FeeCounter() {
  const { showToast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord>(SAMPLE_STUDENTS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChangeStudentOpen, setIsChangeStudentOpen] = useState(false);
  const [installments, setInstallments] = useState<Installment[]>(INITIAL_INSTALLMENTS);
  const [paymentMode, setPaymentMode] = useState<"Cash" | "UPI QR" | "Cheque" | "Card" | "Bank">("Cash");
  const [waiveLateFee, setWaiveLateFee] = useState(false);
  const [chequeNo, setChequeNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [txnRef, setTxnRef] = useState("");
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const receiptPrintRef = useRef<HTMLDivElement>(null);

  // Dynamic Institute Name
  const [adminData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("admin");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const instituteName = adminData?.instituteName || "GuruConnect Institute";
  const instituteAddress = adminData?.address || (adminData?.city ? `${adminData.city} · Affiliated to CBSE` : "Affiliated Educational Institution");

  const toggleInstallment = (id: string) => {
    setInstallments(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const selectedDuesTotal = installments
    .filter(i => i.checked)
    .reduce((sum, i) => sum + i.amount, 0);

  const lateFee = waiveLateFee || selectedDuesTotal === 0 ? 0 : 500;
  const grandTotal = selectedDuesTotal + lateFee;

  const handleCollectPayment = () => {
    if (selectedDuesTotal === 0) {
      showToast("Please select at least one installment to collect.", "error");
      return;
    }
    setIsReceiptModalOpen(true);
    showToast(`Receipt RCP/2627/004218 generated for ₹${grandTotal.toLocaleString("en-IN")}`, "success");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12">
      {/* Top Breadcrumb & Counter stats */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Fees › Counter 1
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Collect fee
          </h1>
        </div>

        <div className="flex items-center gap-4 text-[13px] text-ink-secondary flex-wrap">
          <span>
            Today at this counter:{" "}
            <b className="font-mono text-ink font-semibold">₹2,84,600</b> · 37 receipts
          </span>
          <Link
            to="/admin/cash-closing"
            className="text-primary font-medium hover:underline flex items-center gap-1"
          >
            Day-end cash closing →
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-wrap gap-5 items-start">
        {/* Left Column: Student Card & Installments */}
        <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-4">
          
          {/* Student Profile Card (Matching 20-FeeCounter.html) */}
          <section className="bg-white border border-line rounded-card p-4 sm:p-5 flex flex-wrap gap-4 items-center justify-between shadow-xs">
            <div className="flex gap-3.5 items-center min-w-0">
              <div className="w-12 h-12 rounded-card bg-[#E3EFEF] text-[#08393F] flex items-center justify-center font-bold text-base shrink-0">
                {selectedStudent.initials}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="font-semibold text-base text-ink truncate">
                  {selectedStudent.name} · {selectedStudent.classGrade}
                </div>
                <div className="text-[13px] text-ink-secondary truncate">
                  Adm. {selectedStudent.admNo} · Guardian {selectedStudent.guardian} · {selectedStudent.phone} ·{" "}
                  <span className="text-primary font-medium">{selectedStudent.category}</span>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setIsChangeStudentOpen(true)}
              className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-[13px] font-medium text-ink transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              Change student
            </button>
          </section>

          {/* Dues by Installment (Matching 20-FeeCounter.html) */}
          <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-line flex justify-between items-baseline gap-3 bg-surface">
              <h2 className="text-base font-semibold text-ink">Dues by installment</h2>
              <span className="text-[13px] text-ink-secondary">Oldest dues are selected first</span>
            </div>

            <div className="divide-y divide-[#EEF1EF]">
              {installments.map((inst) => {
                return (
                  <label
                    key={inst.id}
                    className={`flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-colors select-none ${
                      inst.checked ? "bg-[#F4F9F9]" : "bg-white hover:bg-slate-50/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={inst.checked}
                      onChange={() => toggleInstallment(inst.id)}
                      className="w-5 h-5 rounded border-[#C9D1CD] text-primary focus:ring-primary cursor-pointer shrink-0"
                    />

                    <span className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <span className="font-semibold text-sm text-ink">{inst.name}</span>
                      <span className="text-[12.5px] text-ink-secondary">{inst.breakdown}</span>
                    </span>

                    <span className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className="font-mono text-[15px] font-medium text-ink">
                        ₹{inst.amount.toLocaleString("en-IN")}
                      </span>
                      {inst.isOverdue ? (
                        <span className="text-xs font-semibold text-[#8F4A09]">
                          {inst.dueDate}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-ink-secondary">
                          {inst.dueDate}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right Aside: Payment Box (Matching 20-FeeCounter.html) */}
        <aside className="flex-[1_1_320px] bg-white border border-line rounded-card p-5 flex flex-col gap-4 shadow-xs">
          <h2 className="text-base font-semibold text-ink">Payment</h2>

          {/* Payment Modes Grid (Cash, UPI QR, Cheque, Card, Bank) */}
          <div className="grid grid-cols-3 gap-2">
            {(["Cash", "UPI QR", "Cheque", "Card", "Bank"] as const).map((mode) => {
              const isSelected = paymentMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] rounded-control border text-[13px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#12302D] bg-[#12302D] text-white shadow-xs"
                      : "border-line-input bg-white text-ink hover:bg-slate-50"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Dynamic mode inputs if non-cash */}
          {paymentMode === "UPI QR" && (
            <div className="p-3.5 bg-slate-50 border border-line rounded-control text-center space-y-2 animate-fadeIn">
              <span className="text-xs font-medium text-ink-secondary block">
                Scan UPI QR to collect directly into School Account
              </span>
              <div className="w-32 h-32 mx-auto bg-white border border-slate-300 rounded p-1.5 flex items-center justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=fees.school@hdfcbank"
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-mono text-xs font-semibold text-primary">
                fees.school@hdfcbank
              </div>
            </div>
          )}

          {paymentMode === "Cheque" && (
            <div className="space-y-2 p-3 bg-slate-50 border border-line rounded-control text-xs animate-fadeIn">
              <div>
                <label className="block text-ink-secondary mb-1">Cheque Number</label>
                <input
                  type="text"
                  placeholder="e.g. 048291"
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-line-input rounded font-mono text-xs text-ink focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-ink-secondary mb-1">Drawee Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-line-input rounded text-xs text-ink focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {(paymentMode === "Card" || paymentMode === "Bank") && (
            <div className="p-3 bg-slate-50 border border-line rounded-control text-xs animate-fadeIn">
              <label className="block text-ink-secondary mb-1">
                {paymentMode === "Card" ? "POS Machine Slip / Auth Ref" : "NEFT / RTGS UTR Number"}
              </label>
              <input
                type="text"
                placeholder="Reference / Transaction ID"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                className="w-full h-8 px-2.5 bg-white border border-line-input rounded font-mono text-xs text-ink focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* Dues & Totals Breakdown */}
          <div className="flex flex-col gap-2.5 text-sm pt-1">
            <div className="flex justify-between items-center text-ink">
              <span className="text-ink-secondary">Selected dues</span>
              <span className="font-mono">₹{selectedDuesTotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-center text-ink">
              <span className="text-ink-secondary flex items-center gap-1.5">
                <span>Late fee (₹20/day, cap ₹500)</span>
                <label className="text-[11px] text-primary cursor-pointer hover:underline inline-flex items-center gap-1 ml-1">
                  <input
                    type="checkbox"
                    checked={waiveLateFee}
                    onChange={(e) => setWaiveLateFee(e.target.checked)}
                    className="w-3 h-3 text-primary rounded"
                  />
                  <span>Waive</span>
                </label>
              </span>
              <span className="font-mono">
                {waiveLateFee ? "₹0" : `₹${lateFee.toLocaleString("en-IN")}`}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-line font-semibold text-lg text-ink">
              <span>Total</span>
              <span className="font-mono text-primary font-bold">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Action Collect Button (Matching 20-FeeCounter.html) */}
          <button
            type="button"
            onClick={handleCollectPayment}
            disabled={selectedDuesTotal === 0}
            className={`min-h-[50px] rounded-control border-0 text-white font-semibold text-[15px] transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2 ${
              selectedDuesTotal === 0
                ? "bg-[#9DB5B5] cursor-not-allowed"
                : "bg-primary hover:bg-[#08393F]"
            }`}
          >
            <span>
              Collect ₹{grandTotal.toLocaleString("en-IN")} and print receipt
            </span>
          </button>

          <div className="text-[12.5px] text-ink-secondary leading-relaxed">
            Receipt RCP/2627/004218 will be generated. Cancelling a receipt later needs accountant approval.
          </div>
        </aside>
      </div>

      {/* ============================================================== */}
      {/* CHANGE STUDENT MODAL                                            */}
      {/* ============================================================== */}
      {isChangeStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface">
              <h3 className="font-semibold text-base text-ink">Select Student</h3>
              <button
                type="button"
                onClick={() => setIsChangeStudentOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-slate-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={14} />
                <input
                  type="text"
                  placeholder="Search student by name, roll or admission no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-line-input rounded-control text-xs text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="divide-y divide-line max-h-60 overflow-y-auto">
                {SAMPLE_STUDENTS.filter(s =>
                  s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.admNo.includes(searchTerm)
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedStudent(s);
                      setIsChangeStudentOpen(false);
                      showToast(`Switched to student ${s.name} (${s.classGrade})`, "info");
                    }}
                    className={`w-full text-left p-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedStudent.id === s.id ? "bg-teal-50/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-[#E3EFEF] text-[#08393F] font-bold text-xs flex items-center justify-center">
                        {s.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-ink">{s.name} · {s.classGrade}</div>
                        <div className="text-[11px] text-ink-secondary">Adm: {s.admNo} · {s.guardian}</div>
                      </div>
                    </div>
                    {selectedStudent.id === s.id && (
                      <FiCheck size={16} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-line bg-surface flex justify-end">
              <button
                type="button"
                onClick={() => setIsChangeStudentOpen(false)}
                className="px-4 py-1.5 border border-line-input rounded-control text-xs font-semibold text-ink hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* OFFICIAL PRINTABLE FEE RECEIPT MODAL                           */}
      {/* ============================================================== */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-600" size={18} />
                <h3 className="font-semibold text-base text-ink">Fee Receipt Generated</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-secondary hover:bg-slate-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Printable Receipt Paper */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
              <div
                ref={receiptPrintRef}
                className="w-full max-w-lg bg-white border border-slate-300 p-6 rounded shadow-sm text-ink space-y-4 font-sans text-xs"
              >
                {/* School Header */}
                <div className="text-center border-b border-slate-300 pb-3">
                  <h2 className="text-xl font-extrabold uppercase text-ink tracking-tight">
                    {instituteName}
                  </h2>
                  <p className="text-[11px] text-ink-secondary">{instituteAddress}</p>
                  <div className="mt-1.5 inline-block px-3 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                    Official Fee Receipt · 2026-27
                  </div>
                </div>

                {/* Receipt Metadata */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded text-[11px]">
                  <div>
                    <span className="text-ink-secondary block">Receipt No:</span>
                    <span className="font-mono font-bold text-primary">RCP/2627/004218</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Payment Date:</span>
                    <span className="font-medium text-ink">09 Oct 2026, 02:45 PM</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Student Name:</span>
                    <span className="font-bold text-ink">{selectedStudent.name}</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Class & Section:</span>
                    <span className="font-medium text-ink">Class {selectedStudent.classGrade} (Adm: {selectedStudent.admNo})</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Payment Mode:</span>
                    <span className="font-semibold text-ink">{paymentMode}</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Counter:</span>
                    <span className="font-medium text-ink">Counter 1 · Admin Cashier</span>
                  </div>
                </div>

                {/* Items Settled Table */}
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-ink">
                      <th className="border border-slate-300 px-3 py-1.5 text-left font-semibold">Fee Particulars</th>
                      <th className="border border-slate-300 px-3 py-1.5 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.filter(i => i.checked).map((item) => (
                      <tr key={item.id}>
                        <td className="border border-slate-300 px-3 py-1.5">
                          <span className="font-medium block">{item.name}</span>
                          <span className="text-[10px] text-ink-secondary">{item.breakdown}</span>
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-right font-mono">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                    {!waiveLateFee && (
                      <tr>
                        <td className="border border-slate-300 px-3 py-1.5 font-medium text-amber-900">
                          Late fee penalty (standard policy)
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-right font-mono text-amber-900">
                          ₹500
                        </td>
                      </tr>
                    )}
                    <tr className="bg-slate-50 font-bold">
                      <td className="border border-slate-300 px-3 py-2 text-right">Grand Total Paid:</td>
                      <td className="border border-slate-300 px-3 py-2 text-right font-mono text-primary text-sm">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Signatures */}
                <div className="pt-6 flex justify-between items-end text-[11px] text-center">
                  <div className="w-32 border-t border-slate-400 pt-1">
                    <span className="text-ink-secondary">Payer Signature</span>
                  </div>
                  <div className="w-36 border-t border-slate-400 pt-1">
                    <span className="font-semibold text-ink">Cashier / Accountant</span>
                    <div className="text-[10px] text-ink-secondary">Counter 1 Stamp</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-line bg-surface">
              <span className="text-xs text-ink-secondary">
                Official computer-generated receipt.
              </span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink text-xs font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <FiPrinter size={14} />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
