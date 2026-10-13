import React, { useState } from "react";
import {
  FiCheckCircle,
  FiPrinter,
  FiDownload,
  FiSearch,
  FiFileText,
  FiAlertCircle,
  FiShield
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

type CertType = "tc" | "bonafide" | "character" | "fee" | "dob" | "register";

export default function CertificatesPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<CertType>("tc");
  const [studentSearch, setStudentSearch] = useState("Riya Choudhary");
  const [dateOfLeaving, setDateOfLeaving] = useState("2026-10-09");
  const [reason, setReason] = useState("Parent's transfer to another city");
  const [conduct, setConduct] = useState("Very good");
  const [isIssued, setIsIssued] = useState(false);

  const student = {
    name: "Riya Choudhary",
    classGrade: "10-A",
    admNo: "2016/0112",
    rollNo: "18",
    tcNo: "TC/2627/0031",
    fatherName: "Sunil Choudhary",
    motherName: "Sunita Choudhary",
    dob: "14-08-2011",
    nationality: "Indian"
  };

  const clearances = [
    { label: "Fee Dues", detail: "All installments cleared · balance ₹0", status: "cleared" },
    { label: "Library", detail: "No books currently borrowed", status: "cleared" },
    { label: "Transport", detail: "Route Bus 2 de-allocated", status: "cleared" },
    { label: "Exam Records", detail: "Half-yearly report cards finalized", status: "cleared" }
  ];

  const handleIssue = () => {
    setIsIssued(true);
    showToast(`Transfer Certificate ${student.tcNo} generated and registered!`, "success");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
          Students › Official Records
        </div>
        <h1 className="text-2xl font-bold text-navy mt-1">
          Certificates & Transfer Verification
        </h1>
      </div>

      {/* Type Tabs */}
      <div className="flex border-b border-line gap-2 overflow-x-auto">
        {[
          { key: "tc", label: "Transfer Certificate (TC)" },
          { key: "bonafide", label: "Bonafide Certificate" },
          { key: "character", label: "Character Certificate" },
          { key: "fee", label: "Fee Paid Certificate" },
          { key: "dob", label: "Date of Birth Verification" },
          { key: "register", label: "Issued Register" }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as CertType)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.key
                ? "border-teal text-teal"
                : "border-transparent text-navy-muted hover:text-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Config Column */}
        <div className="lg:col-span-5 space-y-5">
          {/* Clearance Checklist */}
          <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-3">
            <h2 className="font-semibold text-sm text-navy flex items-center justify-between">
              <span>Mandatory Clearance Checks</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                All Cleared
              </span>
            </h2>

            <div className="space-y-2.5 divide-y divide-line/60">
              {clearances.map(c => (
                <div key={c.label} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-navy">{c.label}</div>
                    <div className="text-navy-muted text-[11px]">{c.detail}</div>
                  </div>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <FiCheckCircle size={14} /> Cleared
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Issue Parameters Form */}
          <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-sm text-navy">Certificate Parameters</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-navy mb-1">Date of Leaving School</label>
                <input
                  type="date"
                  value={dateOfLeaving}
                  onChange={e => setDateOfLeaving(e.target.value)}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">Reason for Leaving</label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                >
                  <option>Parent's transfer to another city</option>
                  <option>Completed the highest school grade</option>
                  <option>Admission in residential institute</option>
                  <option>Other personal reasons</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">General Conduct</label>
                <select
                  value={conduct}
                  onChange={e => setConduct(e.target.value)}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                >
                  <option>Very good</option>
                  <option>Exemplary</option>
                  <option>Good</option>
                  <option>Satisfactory</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleIssue}
                  className="flex-1 py-2.5 bg-teal hover:bg-teal-hover text-white rounded-control font-semibold text-xs shadow-xs transition"
                >
                  Approve and Issue TC
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 border border-line rounded-control bg-surface hover:bg-page text-navy text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <FiPrinter size={14} /> Print
                </button>
              </div>
              <p className="text-[11px] text-navy-muted leading-tight">
                Issuing marks the student record status as Left. TC registration numbers are strictly consecutive and permanent.
              </p>
            </div>
          </div>
        </div>

        {/* Right Live Preview Column */}
        <div className="lg:col-span-7">
          <div className="bg-surface border-2 border-line rounded-panel p-8 shadow-md space-y-6 print:border-none print:shadow-none print:p-0">
            {/* School Header */}
            <div className="flex items-start justify-between border-b-2 border-navy pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-navy uppercase">
                  GuruConnect International Academy
                </h2>
                <p className="text-xs text-navy-muted">
                  Affiliated to CBSE · Affiliation No: 1730482 · School Code: 20491
                </p>
                <p className="text-xs text-navy-muted">
                  Campus: Sector 14, Mansarovar, Jaipur · Contact: (0141) 278-9000
                </p>
              </div>
              <div className="w-16 h-16 border-2 border-dashed border-line rounded-control flex flex-col items-center justify-center text-[10px] text-navy-muted font-mono">
                <span>[QR Code]</span>
                <span className="text-[8px]">Scan to verify</span>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center py-2">
              <span className="inline-block px-6 py-1 border-y-2 border-navy font-bold text-sm tracking-widest uppercase text-navy">
                Transfer Certificate
              </span>
            </div>

            {/* Meta Numbers */}
            <div className="flex items-center justify-between text-xs font-mono font-medium">
              <span>TC No: <b>{student.tcNo}</b></span>
              <span>Admission No: <b>{student.admNo}</b></span>
            </div>

            {/* Content Table */}
            <div className="space-y-2 text-xs divide-y divide-line/60">
              <div className="grid grid-cols-12 py-2">
                <span className="col-span-1 text-navy-muted">1.</span>
                <span className="col-span-5 text-navy-muted">Name of Student</span>
                <span className="col-span-6 font-bold text-navy">{student.name}</span>
              </div>

              <div className="grid grid-cols-12 py-2">
                <span className="col-span-1 text-navy-muted">2.</span>
                <span className="col-span-5 text-navy-muted">Father's / Guardian's Name</span>
                <span className="col-span-6 font-semibold text-navy">{student.fatherName}</span>
              </div>

              <div className="grid grid-cols-12 py-2">
                <span className="col-span-1 text-navy-muted">3.</span>
                <span className="col-span-5 text-navy-muted">Mother's Name</span>
                <span className="col-span-6 font-semibold text-navy">{student.motherName}</span>
              </div>

              <div className="grid grid-cols-12 py-2">
                <span className="col-span-1 text-navy-muted">4.</span>
                <span className="col-span-5 text-navy-muted">Nationality</span>
                <span className="col-span-6 font-medium text-navy">{student.nationality}</span>
              </div>

              <div className="grid grid-cols-12 py-2">
                <span className="col-span-1 text-navy-muted">5.</span>
                <span className="col-span-5 text-navy-muted">Date of Birth (in Christian Era)</span>
                <span className="col-span-6 font-mono font-semibold text-navy">{student.dob}</span>
              </div>

              <div className="grid grid-cols-12 py-2">
                <span className="col-span-1 text-navy-muted">6.</span>
                <span className="col-span-5 text-navy-muted">Class in which student last studied</span>
                <span className="col-span-6 font-bold text-navy">Class {student.classGrade}</span>
              </div>

              <div className="grid grid-cols-12 py-2">
                <span className="col-span-1 text-navy-muted">7.</span>
                <span className="col-span-5 text-navy-muted">Date of Student's Discharge</span>
                <span className="col-span-6 font-mono font-medium text-navy">{dateOfLeaving}</span>
              </div>

              <div className="grid grid-cols-12 py-2">
                <span className="col-span-1 text-navy-muted">8.</span>
                <span className="col-span-5 text-navy-muted">Reason for Leaving School</span>
                <span className="col-span-6 font-medium text-navy">{reason}</span>
              </div>

              <div className="grid grid-cols-12 py-2">
                <span className="col-span-1 text-navy-muted">9.</span>
                <span className="col-span-5 text-navy-muted">General Conduct</span>
                <span className="col-span-6 font-semibold text-navy">{conduct}</span>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-10 flex items-end justify-between text-xs">
              <div className="text-center space-y-1">
                <div className="w-28 border-b border-navy/60"></div>
                <span className="text-navy-muted text-[11px]">Class Teacher</span>
              </div>
              <div className="text-center space-y-1">
                <div className="w-28 border-b border-navy/60"></div>
                <span className="text-navy-muted text-[11px]">Accountant / Clerk</span>
              </div>
              <div className="text-center space-y-1">
                <div className="w-32 border-b border-navy"></div>
                <span className="font-bold text-navy text-[11px]">Principal Seal & Sign</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
