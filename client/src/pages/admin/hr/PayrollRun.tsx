import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiDownload,
  FiFileText,
  FiSend,
  FiCheckCircle,
  FiDollarSign
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface SalaryRecord {
  id: string;
  name: string;
  empId: string;
  designation: string;
  basic: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: "Calculated" | "Adjusted" | "Approved";
}

const DEFAULT_RECORDS: SalaryRecord[] = [
  { id: "1", name: "Sunita Rathore", empId: "EMP-0142", designation: "TGT Science", basic: 32000, allowances: 14400, deductions: 4200, netPay: 42200, status: "Calculated" },
  { id: "2", name: "Vikram Singh", empId: "EMP-0118", designation: "TGT Maths", basic: 34000, allowances: 15300, deductions: 6850, netPay: 42450, status: "Adjusted" },
  { id: "3", name: "Rachna Bose", empId: "EMP-0097", designation: "PGT English", basic: 42000, allowances: 18900, deductions: 5800, netPay: 55100, status: "Calculated" },
  { id: "4", name: "Mohan Lal", empId: "EMP-0210", designation: "Senior Driver", basic: 18000, allowances: 7200, deductions: 2400, netPay: 22800, status: "Calculated" },
  { id: "5", name: "Rekha Jain", empId: "EMP-0164", designation: "Senior Accountant", basic: 28000, allowances: 11200, deductions: 3600, netPay: 35600, status: "Calculated" },
  { id: "6", name: "Farah Ali", empId: "EMP-0185", designation: "Art Instructor", basic: 24000, allowances: 9600, deductions: 3100, netPay: 30500, status: "Calculated" }
];

export default function PayrollRun() {
  const { showToast } = useToast();
  const [records, setRecords] = useState<SalaryRecord[]>(DEFAULT_RECORDS);
  const [currentMonth, setCurrentMonth] = useState("September 2026");
  const [currentStep, setCurrentStep] = useState(3); // 1: Lock, 2: Calculate, 3: Exceptions, 4: Approval, 5: Bank file

  const handleSendApproval = () => {
    setCurrentStep(4);
    showToast("September 2026 payroll run submitted for Principal approval!", "success");
  };

  const handleDownloadBankFile = () => {
    showToast("Generating NACH / NEFT corporate bank disbursement batch file...", "info");
  };

  const grossSalary = 3148200;
  const deductions = 392640;
  const netPayable = 2755560;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-line pb-2 text-xs font-semibold overflow-x-auto">
        <Link to="/admin/staff" className="text-navy-muted hover:text-navy px-2 pb-2">
          Directory
        </Link>
        <Link to="/admin/staff/leave" className="text-navy-muted hover:text-navy px-2 pb-2">
          Leave Management
        </Link>
        <Link to="/admin/staff/attendance" className="text-navy-muted hover:text-navy px-2 pb-2">
          Staff Attendance
        </Link>
        <span className="text-teal border-b-2 border-teal pb-2 px-1">Payroll Runs</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            HR & Payroll › Monthly Payroll Cycle
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">{currentMonth} Payroll Run</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadBankFile}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-medium text-navy transition"
          >
            <FiDownload size={14} /> Download Bank File (NEFT)
          </button>
          <button
            onClick={handleSendApproval}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
          >
            <FiSend size={14} /> Send For Principal Approval
          </button>
        </div>
      </div>

      {/* 5-Step Stepper from Screen 30 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        {[
          { num: 1, label: "Lock Attendance", status: "done" },
          { num: 2, label: "Calculate Sal", status: "done" },
          { num: 3, label: "Review Exceptions", status: currentStep === 3 ? "current" : "done" },
          { num: 4, label: "Principal Approval", status: currentStep === 4 ? "current" : currentStep > 4 ? "done" : "pending" },
          { num: 5, label: "Bank File & Slips", status: currentStep === 5 ? "current" : "pending" }
        ].map(step => (
          <div
            key={step.num}
            className={`p-3.5 rounded-control border flex flex-col gap-1 transition ${
              step.status === "current"
                ? "bg-teal/10 border-teal text-teal shadow-xs"
                : step.status === "done"
                ? "bg-surface border-line text-navy"
                : "bg-page/60 border-line text-navy-muted"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider">
                {step.status === "done" ? "✓ Done" : step.status === "current" ? "● In Progress" : "○ Waiting"}
              </span>
              <span className="font-mono text-xs opacity-60">Step {step.num}</span>
            </div>
            <div className="font-bold text-xs mt-0.5">{step.label}</div>
          </div>
        ))}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Eligible Employees</div>
          <div className="font-mono text-2xl font-bold text-navy">86</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Gross Salary (Total)</div>
          <div className="font-mono text-2xl font-bold text-navy">
            ₹{grossSalary.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Statutory Deductions (PF/TDS)</div>
          <div className="font-mono text-2xl font-bold text-amber-800">
            ₹{deductions.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-teal font-medium">Net Payable Disbursement</div>
          <div className="font-mono text-2xl font-bold text-teal">
            ₹{netPayable.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* 2 Exceptions to Review Box from Screen 30 */}
      <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="font-bold text-sm text-navy flex items-center gap-2">
            <FiAlertCircle className="text-amber-600" /> 2 Attendance & Leave Exceptions to Review
          </h2>
          <span className="text-xs text-navy-muted">Auto-detected by payroll engine</span>
        </div>

        <div className="divide-y divide-line/60 text-xs">
          <div className="py-2.5 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-navy">Pooja Meena</span>{" "}
              <span className="text-navy-muted">· Joined 16 Sep, pro-rata compensation calculated for 15 working days</span>
            </div>
            <button
              onClick={() => showToast("Pro-rata calculation verified.", "success")}
              className="px-3 py-1 border border-line rounded-control bg-page hover:bg-surface font-semibold text-navy text-xs"
            >
              Verify Pro-Rata
            </button>
          </div>

          <div className="py-2.5 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-navy">Vikram Singh</span>{" "}
              <span className="text-navy-muted">· 2 days leave without pay (LWP), 4 unexcused late arrivals (-0.5 day wage deduction)</span>
            </div>
            <button
              onClick={() => showToast("Deduction override reviewed and saved.", "success")}
              className="px-3 py-1 border border-line rounded-control bg-page hover:bg-surface font-semibold text-navy text-xs"
            >
              Adjust Deduction
            </button>
          </div>
        </div>
      </div>

      {/* Salary Register Table */}
      <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-line flex items-center justify-between gap-3 bg-page/30">
          <h2 className="font-semibold text-xs text-navy uppercase tracking-wider">
            Faculty & Staff Salary Register
          </h2>
          <button
            onClick={() => showToast("Exporting comprehensive salary register (Excel)...", "info")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-control bg-surface hover:bg-page text-xs font-semibold text-navy transition"
          >
            <FiDownload size={13} /> Export Salary Register
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Basic Pay</th>
                <th className="py-3 px-4 text-right">Allowances</th>
                <th className="py-3 px-4 text-right">Deductions</th>
                <th className="py-3 px-4 text-right">Net Payable</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {records.map(rec => (
                <tr key={rec.id} className="hover:bg-page/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy">{rec.name}</div>
                    <div className="font-mono text-navy-muted text-[11px]">{rec.empId}</div>
                  </td>
                  <td className="py-3 px-4 text-navy-muted font-medium">{rec.designation}</td>
                  <td className="py-3 px-4 text-right font-mono">₹{rec.basic.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-800">
                    +₹{rec.allowances.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-amber-800">
                    -₹{rec.deductions.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-teal text-sm">
                    ₹{rec.netPay.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => showToast(`Generating PDF Payslip for ${rec.name}...`, "info")}
                      className="text-teal font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <FiFileText size={13} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
