import React, { useState } from "react";
import {
  FiDownload,
  FiMail,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiPieChart,
  FiTrendingUp
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface ClassEfficiency {
  className: string;
  efficiency: number;
  dueAmount: number;
}

const CLASS_DATA: ClassEfficiency[] = [
  { className: "Nursery", efficiency: 91, dueAmount: 18400 },
  { className: "Class 1", efficiency: 88, dueAmount: 42600 },
  { className: "Class 2", efficiency: 86, dueAmount: 51200 },
  { className: "Class 3", efficiency: 84, dueAmount: 60800 },
  { className: "Class 4", efficiency: 79, dueAmount: 88300 },
  { className: "Class 5", efficiency: 83, dueAmount: 72100 },
  { className: "Class 6", efficiency: 72, dueAmount: 114500 },
  { className: "Class 7", efficiency: 89, dueAmount: 38900 },
  { className: "Class 8", efficiency: 85, dueAmount: 56400 },
  { className: "Class 9", efficiency: 77, dueAmount: 98200 },
  { className: "Class 10", efficiency: 94, dueAmount: 22100 }
];

export default function ReportsPage() {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState("feeEfficiency");

  const handleExportExcel = () => {
    showToast("Generating Excel efficiency report...", "success");
  };

  const handleScheduleEmail = () => {
    showToast("Daily automated report email scheduled for 06:00 PM to Management.", "success");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Reports & Business Intelligence
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Fee Collection Efficiency by Class</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Collected against scheduled demand due till 14 Oct 2026 · Refreshed 15 minutes ago
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-semibold text-navy transition"
          >
            <FiDownload size={14} /> Export Excel
          </button>
          <button
            onClick={handleScheduleEmail}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
          >
            <FiMail size={14} /> Email Daily at 6 PM
          </button>
        </div>
      </div>

      {/* Metrics Banner from Screen 39 */}
      <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
          <h2 className="text-base font-bold text-navy">
            School Average Collection: <span className="text-teal font-mono">82.4%</span> · Institutional Target:{" "}
            <span className="font-mono text-navy-muted">90.0%</span>
          </h2>
          <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Orange indicator = Below 75% Recovery Threshold
          </span>
        </div>

        {/* Efficiency Horizontal Target Bars matching Screen 39 */}
        <div className="space-y-3.5">
          {CLASS_DATA.map(item => {
            const isWarning = item.efficiency < 75;
            return (
              <div
                key={item.className}
                className="grid grid-cols-12 gap-3 items-center text-xs"
              >
                <span className="col-span-2 font-bold text-navy">{item.className}</span>

                {/* Progress bar with 90% benchmark marker */}
                <div className="col-span-6 relative h-4 bg-slate-100 rounded-control overflow-hidden border border-line/60">
                  <div
                    className={`h-full rounded-control transition-all duration-500 ${
                      isWarning ? "bg-amber-600" : "bg-teal"
                    }`}
                    style={{ width: `${item.efficiency}%` }}
                  />
                  {/* 90% Target line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-navy shadow-xs"
                    style={{ left: "90%" }}
                    title="Target: 90%"
                  />
                </div>

                <span
                  className={`col-span-2 font-mono font-bold text-right ${
                    isWarning ? "text-amber-800" : "text-navy"
                  }`}
                >
                  {item.efficiency}%
                </span>

                <span className="col-span-2 font-mono text-navy-muted text-right">
                  ₹{item.dueAmount.toLocaleString("en-IN")} due
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
