import React, { useState } from "react";
import {
  FiDownload,
  FiMail,
  FiFileText,
  FiCheckCircle,
  FiX,
  FiPrinter
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface ClassEfficiency {
  className: string;
  efficiency: number;
  dueAmount: string;
}

const EFFICIENCY_DATA: ClassEfficiency[] = [
  { className: "Nursery", efficiency: 91, dueAmount: "₹18,400 due" },
  { className: "Class 1", efficiency: 88, dueAmount: "₹42,600 due" },
  { className: "Class 2", efficiency: 86, dueAmount: "₹51,200 due" },
  { className: "Class 3", efficiency: 84, dueAmount: "₹60,800 due" },
  { className: "Class 4", efficiency: 79, dueAmount: "₹88,300 due" },
  { className: "Class 5", efficiency: 83, dueAmount: "₹70,100 due" },
  { className: "Class 6", efficiency: 71, dueAmount: "₹1,32,400 due" },
  { className: "Class 7", efficiency: 77, dueAmount: "₹1,04,900 due" },
  { className: "Class 8", efficiency: 74, dueAmount: "₹1,18,600 due" },
  { className: "Class 9", efficiency: 85, dueAmount: "₹79,300 due" }
];

const REPORT_CATEGORIES = [
  {
    category: "Students",
    reports: ["Strength register", "Category and gender", "RTE register", "UDISE+ data sheet"]
  },
  {
    category: "Attendance",
    reports: ["Monthly class register", "Chronic absentees", "Staff register"]
  },
  {
    category: "Fees",
    reports: ["Daily collection", "Defaulters with contact", "Concession register", "Online settlement match"]
  },
  {
    category: "Exams",
    reports: ["Tabulation register", "Subject analysis", "Result summary"]
  },
  {
    category: "HR",
    reports: ["Payroll register", "PF / ESI / TDS statements"]
  }
];

export default function ReportsPage() {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const handleExportExcel = () => {
    const csvHeader = "Class,Collection Efficiency (%),Dues Pending\n";
    const csvRows = EFFICIENCY_DATA.map(d => `"${d.className}",${d.efficiency},"${d.dueAmount}"`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Fee_Collection_Efficiency_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Fee efficiency report exported as Excel / CSV!", "success");
  };

  const handleScheduleEmail = () => {
    showToast("Automated daily efficiency summary scheduled for 6:00 PM to Management!", "success");
  };

  const handleOpenReport = (reportName: string) => {
    setSelectedReport(reportName);
    showToast(`Generating report: ${reportName}...`, "info");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 39-Reports.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">Reports</div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Fee collection efficiency by class
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Collected against demand due till 9 Oct 2026 · refreshed 15 minutes ago
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExportExcel}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FiDownload size={14} className="text-ink-secondary" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={handleScheduleEmail}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FiMail size={14} className="text-ink-secondary" />
            <span>Email daily at 6 pm</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout (Matching 39-Reports.html) */}
      <div className="flex flex-wrap gap-5 items-start">
        {/* Left Section: Fee Efficiency Target Bars */}
        <section className="flex-1 basis-[520px] min-w-0 bg-white border border-line rounded-card p-5 flex flex-col gap-3.5 shadow-xs">
          <div className="flex justify-between items-baseline gap-3 flex-wrap">
            <h2 className="m-0 text-base font-semibold text-ink">
              School average 82.4% · target 90%
            </h2>
            <span className="text-xs text-warning-inline font-medium bg-warning-bg px-2 py-0.5 rounded border border-warning-border">
              Orange = below 75%
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {EFFICIENCY_DATA.map(item => {
              const isLow = item.efficiency < 75;
              return (
                <div
                  key={item.className}
                  className="grid grid-cols-[80px_1fr_50px_100px] sm:grid-cols-[90px_1fr_64px_110px] gap-3 items-center text-xs sm:text-[13.5px]"
                >
                  <span className="font-semibold text-ink">{item.className}</span>

                  <span className="relative h-3.5 bg-line-row rounded-[4px] overflow-hidden block">
                    <span
                      className={`block h-full rounded-[4px] transition-all duration-300 ${
                        isLow ? "bg-warning-chart" : "bg-primary"
                      }`}
                      style={{ width: `${item.efficiency}%` }}
                    />
                    {/* Target 90% benchmark vertical indicator line */}
                    <span
                      className="absolute -top-0.5 -bottom-0.5 w-[2px] bg-ink"
                      style={{ left: "90%" }}
                      title="Institutional target 90%"
                    />
                  </span>

                  <span className="font-mono text-right font-medium text-ink">
                    {item.efficiency}%
                  </span>

                  <span className="font-mono text-ink-secondary text-right">
                    {item.dueAmount}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-ink-secondary pt-2 border-t border-line/60">
            Black vertical marker marks the 90% collection benchmark target.
          </div>
        </section>

        {/* Right Aside: Comprehensive Report Library (Matching 39-Reports.html) */}
        <aside className="flex-1 basis-[300px] max-w-full lg:max-w-[340px] bg-white border border-line rounded-card p-4 flex flex-col gap-3.5 shadow-xs">
          <h2 className="m-0 text-base font-semibold text-ink">Report library</h2>

          {REPORT_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.category}
              className={`flex flex-col gap-1.5 pt-2.5 ${
                idx > 0 ? "border-t border-line-row" : ""
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {cat.category}
              </span>

              <div className="flex flex-col gap-0.5">
                {cat.reports.map(rep => (
                  <button
                    key={rep}
                    type="button"
                    onClick={() => handleOpenReport(rep)}
                    className="text-left py-1 text-sm text-ink hover:text-primary transition-colors cursor-pointer"
                  >
                    {rep}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* Generated Report Quick View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-lg shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs text-ink">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <div>
                <span className="text-[11px] text-ink-secondary uppercase">Report Generator</span>
                <h3 className="font-semibold text-base text-ink">{selectedReport}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-line rounded-control space-y-2 text-xs">
              <div className="font-semibold text-ink">Parameters & Scope:</div>
              <div className="grid grid-cols-2 gap-2 text-ink-secondary">
                <div>Academic Session: <b>2026-27</b></div>
                <div>Institution: <b>GuruConnect Institute</b></div>
                <div>Generated: <b>Today at {new Date().toLocaleTimeString()}</b></div>
                <div>Status: <b className="text-emerald-700">Audit Verified</b></div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`${selectedReport} downloaded in official Excel / PDF format!`, "success");
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs flex items-center gap-1.5"
              >
                <FiDownload size={13} />
                <span>Download Report (PDF/Excel)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
