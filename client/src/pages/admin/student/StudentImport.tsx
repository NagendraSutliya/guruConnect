import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  ArrowRight,
  RotateCcw,
  Info
} from "lucide-react";
import { useToast } from "../../../context/ToastContext";

interface ErrorRow {
  row: number;
  student: string;
  column: string;
  problem: string;
  fix: string;
}

const mockErrors: ErrorRow[] = [
  { row: 14, student: "Aditya Sharma", column: "Date of birth", problem: "Missing", fix: "Add DD-MM-YYYY" },
  { row: 37, student: "Khushi Meena", column: "Class", problem: "\"5 A\" not found", fix: "Use 5-A" },
  { row: 52, student: "Rohan Jat", column: "Guardian mobile", problem: "9 digits", fix: "Check the number" },
  { row: 88, student: "Priya Saini", column: "Admission no.", problem: "Already used by Pihu Sethi", fix: "Use a new number" },
  { row: 140, student: "Mohit Kumar", column: "Category", problem: "\"OBC-NCL\" not in list", fix: "Choose OBC" },
  { row: 206, student: "Simran Kaur", column: "Date of birth", problem: "Age 2 for Class 1", fix: "Check year" }
];

export default function StudentImport() {
  const [step, setStep] = useState<number>(4); // Step 4: Dry run
  const [errors, setErrors] = useState<ErrorRow[]>(mockErrors);
  const [readyCount, setReadyCount] = useState<number>(703);
  const [totalRows] = useState<number>(712);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSkipErrors = () => {
    showToast(`Batch scheduled! Importing ${readyCount} valid student records...`, "success");
    setTimeout(() => {
      navigate("/admin/students");
    }, 1200);
  };

  const handleDownloadTemplate = () => {
    showToast("Downloaded official student import template (students_template.xlsx)", "info");
  };

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb */}
      <div className="text-xs font-semibold text-ink-secondary">
        <Link to="/admin/students" className="hover:text-primary transition-colors">Students</Link> › Import from Excel
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight m-0">
            Import Students from Excel
          </h1>
          <p className="text-sm text-ink-secondary mt-1 m-0">
            Nothing is saved until the dry run is verified. You can undo any batch import within 24 hours.
          </p>
        </div>

        <button 
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-surface border border-line text-ink hover:border-primary hover:text-primary transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample Template</span>
        </button>
      </div>

      {/* Step Tracker (1 to 5) */}
      <ol className="list-none m-0 p-0 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { num: 1, title: "Download template", status: "Done" },
          { num: 2, title: "Upload file", status: "Done" },
          { num: 3, title: "Match columns", status: "Done" },
          { num: 4, title: "Dry run validation", status: "Now" },
          { num: 5, title: "Database commit", status: "Next" }
        ].map((s) => (
          <li 
            key={s.num} 
            className={`p-3 rounded-xl border flex flex-col gap-0.5 transition-all ${
              s.status === "Now" 
                ? "bg-primary-tint/30 border-primary shadow-2xs" 
                : s.status === "Done"
                ? "bg-white border-line"
                : "bg-surface border-line opacity-60"
            }`}
          >
            <span className={`text-[11px] font-bold ${
              s.status === "Done" ? "text-emerald-600" : s.status === "Now" ? "text-primary" : "text-ink-muted"
            }`}>
              {s.status}
            </span>
            <span className="text-xs font-bold text-ink truncate">
              {s.title}
            </span>
          </li>
        ))}
      </ol>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white border border-line rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-ink-secondary">Rows in uploaded file</span>
          <div className="font-mono text-2xl font-bold text-ink mt-1">{totalRows}</div>
        </div>

        <div className="bg-white border border-line rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-ink-secondary">Clean &amp; ready to import</span>
          <div className="font-mono text-2xl font-bold text-emerald-600 mt-1">{readyCount}</div>
        </div>

        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-amber-800">Rows with validation errors</span>
          <div className="font-mono text-2xl font-bold text-amber-700 mt-1">{errors.length}</div>
        </div>

        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-xs font-medium text-amber-800">Possible duplicate records</span>
          <div className="font-mono text-2xl font-bold text-amber-700 mt-1">4</div>
        </div>
      </div>

      {/* Error Resolution Table */}
      <section className="bg-white border border-line rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 px-6 border-b border-line flex flex-wrap items-center justify-between gap-3 bg-page/40">
          <div>
            <h2 className="text-sm font-bold text-ink m-0">
              Rows to fix · students_2026.xlsx
            </h2>
            <span className="text-xs text-ink-muted mt-0.5 block">
              Resolve these fields in your sheet or choose to proceed skipping invalid entries.
            </span>
          </div>

          <a 
            href="#download" 
            onClick={(e) => { e.preventDefault(); showToast("Generated error report spreadsheet", "info"); }}
            className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download error report (.xlsx)</span>
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface/80 text-ink-secondary text-xs uppercase font-bold border-b border-line">
                <th className="py-3 px-5 text-right w-16">Row</th>
                <th className="py-3 px-5">Student Name</th>
                <th className="py-3 px-5">Target Column</th>
                <th className="py-3 px-5">Identified Problem</th>
                <th className="py-3 px-5">Recommended Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line font-medium text-ink">
              {errors.map((err) => (
                <tr key={err.row} className="hover:bg-page/50 transition-colors">
                  <td className="py-3 px-5 text-right font-mono text-ink-muted">{err.row}</td>
                  <td className="py-3 px-5 font-bold">{err.student}</td>
                  <td className="py-3 px-5 text-ink-secondary">{err.column}</td>
                  <td className="py-3 px-5 text-amber-700 font-semibold">{err.problem}</td>
                  <td className="py-3 px-5 text-ink-secondary">{err.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-line flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-ink-secondary">
          <Info className="w-4 h-4 text-ink-muted shrink-0" />
          <span>
            Possible duplicates (same guardian mobile &amp; student DOB) will be linked as siblings unless designated otherwise.
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => showToast("Opening file chooser...", "info")}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-line text-ink hover:bg-page transition-colors cursor-pointer"
          >
            Upload Corrected File
          </button>

          <button 
            onClick={handleSkipErrors}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-dark text-white shadow-2xs transition-all active:scale-98 cursor-pointer flex items-center gap-2"
          >
            <span>Import {readyCount} Clean Rows, Skip {errors.length}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
