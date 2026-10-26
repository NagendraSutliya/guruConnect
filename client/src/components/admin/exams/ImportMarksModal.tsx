import React, { useState } from "react";
import Papa from "papaparse";
import { FiX, FiUploadCloud, FiDownload, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface ImportMarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  section: string;
  subject: string;
  onImport: (importedRows: any[]) => void;
}

export default function ImportMarksModal({
  isOpen,
  onClose,
  className,
  section,
  subject,
  onImport,
}: ImportMarksModalProps) {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const downloadSampleTemplate = () => {
    const csvContent =
      "Roll,Student,PeriodicTest,Notebook,SubjectEnrichment,HalfYearly\n" +
      "01,Aditi Sharma,9,5,4,71\n" +
      "02,Bhavesh Kumar,8,4,4,62\n" +
      "03,Chirag Singhal,7,4,3,55\n" +
      "04,Divya Patel,9,5,5,74\n" +
      "05,Garvit Jain,6,3,3,48\n" +
      "06,Harsh Vardhan,8,4,4,70\n" +
      "07,Himanshu Soni,AB,3,3,AB\n" +
      "08,Hitesh Yadav,7,4,4,ML\n" +
      "09,Isha Kanwar,10,5,5,79\n" +
      "10,Jatin Soni,5,3,3,22\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Marks_Template_Class${className}_${section}_${subject}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);
    setErrors([]);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsProcessing(false);
        const data = results.data as any[];
        const validationErrors: string[] = [];

        data.forEach((row, index) => {
          const pt = String(row.PeriodicTest || row.PT || "").trim().toUpperCase();
          const nb = String(row.Notebook || row.NB || "").trim().toUpperCase();
          const se = String(row.SubjectEnrichment || row.SE || "").trim().toUpperCase();
          const hy = String(row.HalfYearly || row.HY || row.Exam || "").trim().toUpperCase();

          const checkVal = (val: string, max: number, name: string) => {
            if (val === "" || val === "AB" || val === "ML" || val === "EX") return;
            const num = Number(val);
            if (isNaN(num)) {
              validationErrors.push(`Row ${index + 1} (${row.Student || "Roll " + row.Roll}): Invalid ${name} value "${val}"`);
            } else if (num < 0 || num > max) {
              validationErrors.push(`Row ${index + 1} (${row.Student || "Roll " + row.Roll}): ${name} is ${num}, maximum is ${max}`);
            }
          };

          checkVal(pt, 10, "Periodic Test");
          checkVal(nb, 5, "Notebook");
          checkVal(se, 5, "Subject Enrichment");
          checkVal(hy, 80, "Half-Yearly");
        });

        setParsedData(data);
        setErrors(validationErrors);
      },
      error: () => {
        setIsProcessing(false);
        showToast("Failed to parse CSV file", "error");
      },
    });
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) {
      return showToast("No valid records found to import", "warn");
    }
    if (errors.length > 0) {
      return showToast("Please resolve validation errors before importing", "error");
    }

    onImport(parsedData);
    showToast(`Successfully imported marks for ${parsedData.length} students!`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface">
          <div>
            <h3 className="font-semibold text-lg text-ink">Import Marks from Excel / CSV</h3>
            <p className="text-xs text-ink-secondary">
              Class {className}-{section} · {subject} · Allowed values: Number, AB, ML, EX
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-hover flex items-center justify-center text-ink-secondary hover:text-ink transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Step 1: Template Download */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-line rounded-lg">
            <div>
              <p className="font-semibold text-sm text-ink">Need the pre-formatted template?</p>
              <p className="text-xs text-ink-secondary">Includes student rolls and maximum marks for each component.</p>
            </div>
            <button
              onClick={downloadSampleTemplate}
              className="px-3.5 py-2 bg-white border border-line-input rounded-control text-ink text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FiDownload size={14} className="text-primary" />
              Download Template
            </button>
          </div>

          {/* Step 2: File Upload Drop Area */}
          <label className="border-2 border-dashed border-line-input hover:border-primary/60 rounded-xl p-6 bg-surface flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FiUploadCloud size={24} />
            </div>
            <span className="font-semibold text-sm text-ink">Click to upload spreadsheet or drag and drop</span>
            <span className="text-xs text-ink-secondary mt-1">Supports CSV, XLS, XLSX files up to 5MB</span>
            {file && (
              <span className="mt-3 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                Selected: {file.name} ({parsedData.length} rows loaded)
              </span>
            )}
          </label>

          {/* Validation Warnings / Error Banner */}
          {errors.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-[13px] text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <FiAlertCircle size={16} />
                <span>{errors.length} validation issues found:</span>
              </div>
              <ul className="list-disc pl-5 max-h-32 overflow-y-auto space-y-1 text-xs">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && errors.length === 0 && (
            <div className="border border-line rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-slate-100 text-xs font-bold text-ink flex items-center justify-between">
                <span>Spreadsheet Preview ({parsedData.length} records verified)</span>
                <span className="text-success font-semibold flex items-center gap-1">
                  <FiCheckCircle size={13} /> Ready to import
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-line text-ink-secondary font-medium">
                    <tr>
                      <th className="p-2">Roll</th>
                      <th className="p-2">Student</th>
                      <th className="p-2 text-center">PT /10</th>
                      <th className="p-2 text-center">NB /5</th>
                      <th className="p-2 text-center">SE /5</th>
                      <th className="p-2 text-center">HY /80</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {parsedData.slice(0, 6).map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-2 font-mono font-bold">{r.Roll || i + 1}</td>
                        <td className="p-2 font-medium">{r.Student || "—"}</td>
                        <td className="p-2 text-center font-mono">{r.PeriodicTest || r.PT || "—"}</td>
                        <td className="p-2 text-center font-mono">{r.Notebook || r.NB || "—"}</td>
                        <td className="p-2 text-center font-mono">{r.SubjectEnrichment || r.SE || "—"}</td>
                        <td className="p-2 text-center font-mono">{r.HalfYearly || r.HY || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-surface">
          <span className="text-xs text-ink-secondary">Validates against maximum mark thresholds before committing.</span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-line-input rounded-control text-ink text-small font-medium hover:bg-surface-hover"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={parsedData.length === 0 || errors.length > 0 || isProcessing}
              className="px-5 py-2 bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-control text-small font-semibold shadow-sm transition-colors"
            >
              Import {parsedData.length > 0 ? `${parsedData.length} Records` : "Marks"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
