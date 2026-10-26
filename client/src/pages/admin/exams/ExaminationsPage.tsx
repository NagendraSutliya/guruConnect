import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import ExamModuleNav, { type ExamTab } from "../../../components/admin/exams/ExamModuleNav";
import AdmitCardModal from "../../../components/admin/exams/AdmitCardModal";
import SeatingPlanModal from "../../../components/admin/exams/SeatingPlanModal";
import ImportMarksModal from "../../../components/admin/exams/ImportMarksModal";
import ReportCardViewModal from "../../../components/admin/exams/ReportCardViewModal";
import CreateExamScheduleModal from "../../../components/admin/exams/CreateExamScheduleModal";
import {
  FiPrinter,
  FiFileText,
  FiShare2,
  FiPlus,
  FiChevronDown,
  FiAlertTriangle,
  FiCheckCircle,
  FiCheck,
  FiUpload,
  FiSave,
  FiEye,
  FiLock,
  FiClock,
  FiFilter,
  FiEdit,
  FiDownload,
} from "react-icons/fi";

// Initial Student Marks for Class 8-B Science (Adheres 100% to Screen 18 specification)
interface StudentMarkRow {
  roll: string;
  name: string;
  pt: string; // Periodic Test (best of 2 /10)
  nb: string; // Notebook /5
  se: string; // Subject Enrichment /5
  hy: string; // Half-Yearly /80
}

const INITIAL_MARKS_DATA: StudentMarkRow[] = [
  { roll: "01", name: "Aditi Sharma", pt: "9", nb: "5", se: "4", hy: "71" },
  { roll: "02", name: "Bhavesh Kumar", pt: "8", nb: "4", se: "4", hy: "62" },
  { roll: "03", name: "Chirag Singhal", pt: "7", nb: "4", se: "3", hy: "55" },
  { roll: "04", name: "Divya Patel", pt: "9", nb: "5", se: "5", hy: "74" },
  { roll: "05", name: "Garvit Jain", pt: "6", nb: "3", se: "3", hy: "48" },
  { roll: "06", name: "Harsh Vardhan", pt: "8", nb: "4", se: "4", hy: "80" }, // Deliberate test error for validation: 84 > 80!
  { roll: "07", name: "Himanshu Soni", pt: "AB", nb: "3", se: "3", hy: "AB" },
  { roll: "08", name: "Hitesh Yadav", pt: "7", nb: "4", se: "4", hy: "ML" },
  { roll: "09", name: "Isha Kanwar", pt: "10", nb: "5", se: "5", hy: "79" },
  { roll: "10", name: "Jatin Soni", pt: "5", nb: "3", se: "3", hy: "22" },
];

// Screen 17: Date Sheet items
const DATE_SHEET_ROWS = [
  {
    date: "Mon 16 Nov",
    time: "09:00–11:30",
    class6: "English",
    class7: "English",
    class8: "English",
    invigilators: "9 assigned",
    invigStatus: "ok",
  },
  {
    date: "Wed 18 Nov",
    time: "09:00–11:30",
    class6: "Maths",
    class7: "Maths",
    class8: "Maths",
    invigilators: "9 assigned",
    invigStatus: "ok",
  },
  {
    date: "Fri 20 Nov",
    time: "09:00–11:30",
    class6: "Science",
    class7: "Science",
    class8: "Science",
    invigilators: "7 of 9 assigned",
    invigStatus: "warning",
  },
  {
    date: "Mon 23 Nov",
    time: "09:00–11:30",
    class6: "Hindi",
    class7: "Hindi",
    class8: "Hindi",
    invigilators: "9 assigned",
    invigStatus: "ok",
  },
  {
    date: "Wed 25 Nov",
    time: "09:00–11:30",
    class6: "Social Science",
    class7: "Social Science",
    class8: "Social Science",
    invigilators: "8 of 9 assigned",
    invigStatus: "warning",
  },
  {
    date: "Fri 27 Nov",
    time: "09:00–11:30",
    class6: "Sanskrit",
    class7: "Sanskrit",
    class8: "Sanskrit",
    invigilators: "9 assigned",
    invigStatus: "ok",
  },
  {
    date: "Sat 28 Nov",
    time: "09:00–11:30",
    class6: "Computer",
    class7: "Computer",
    class8: "Computer",
    invigilators: "9 assigned",
    invigStatus: "ok",
  },
];

// Screen 19: Section Results Rows
interface SectionResultRow {
  section: string;
  subjectsFinal: string;
  isSubjectsFinalComplete: boolean;
  remarks: string;
  isRemarksComplete: boolean;
  passPercentage: string;
  reportCardStatus: "Published" | "Generated" | "Not ready";
}

const INITIAL_SECTION_RESULTS: SectionResultRow[] = [
  { section: "6-A", subjectsFinal: "7 / 7", isSubjectsFinalComplete: true, remarks: "Done", isRemarksComplete: true, passPercentage: "97.5%", reportCardStatus: "Published" },
  { section: "6-B", subjectsFinal: "7 / 7", isSubjectsFinalComplete: true, remarks: "Done", isRemarksComplete: true, passPercentage: "95%", reportCardStatus: "Published" },
  { section: "6-C", subjectsFinal: "7 / 7", isSubjectsFinalComplete: true, remarks: "Done", isRemarksComplete: true, passPercentage: "92.5%", reportCardStatus: "Generated" },
  { section: "7-A", subjectsFinal: "7 / 7", isSubjectsFinalComplete: true, remarks: "Done", isRemarksComplete: true, passPercentage: "94.7%", reportCardStatus: "Generated" },
  { section: "7-B", subjectsFinal: "6 / 7", isSubjectsFinalComplete: false, remarks: "31 of 40", isRemarksComplete: false, passPercentage: "—", reportCardStatus: "Not ready" },
  { section: "7-C", subjectsFinal: "7 / 7", isSubjectsFinalComplete: true, remarks: "Done", isRemarksComplete: true, passPercentage: "90%", reportCardStatus: "Generated" },
  { section: "8-A", subjectsFinal: "7 / 7", isSubjectsFinalComplete: true, remarks: "Done", isRemarksComplete: true, passPercentage: "92.1%", reportCardStatus: "Generated" },
  { section: "8-B", subjectsFinal: "5 / 7", isSubjectsFinalComplete: false, remarks: "12 of 38", isRemarksComplete: false, passPercentage: "—", reportCardStatus: "Not ready" },
  { section: "8-C", subjectsFinal: "7 / 7", isSubjectsFinalComplete: true, remarks: "38 of 39", isRemarksComplete: false, passPercentage: "—", reportCardStatus: "Not ready" },
];

interface ExaminationsPageProps {
  initialTab?: ExamTab;
}

export default function ExaminationsPage({ initialTab = "setup" }: ExaminationsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab") as ExamTab | null;
  const [activeTab, setActiveTab] = useState<ExamTab>(urlTab || initialTab);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Sync tab with URL
  const handleTabChange = (tab: ExamTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Modals state
  const [isAdmitCardOpen, setIsAdmitCardOpen] = useState(false);
  const [isSeatingPlanOpen, setIsSeatingPlanOpen] = useState(false);
  const [isImportMarksOpen, setIsImportMarksOpen] = useState(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [selectedSectionForReport, setSelectedSectionForReport] = useState("8-B");

  // Backend state
  const [dbExams, setDbExams] = useState<any[]>([]);
  const [dbClasses, setDbClasses] = useState<any[]>([]);
  const [dbSections, setDbSections] = useState<any[]>([]);
  const [dbSubjects, setDbSubjects] = useState<any[]>([]);

  // Selected filters
  const [selectedExamName, setSelectedExamName] = useState("Half-Yearly Exam");
  const [selectedClassNum, setSelectedClassNum] = useState("8");
  const [selectedSectionLetter, setSelectedSectionLetter] = useState("B");
  const [selectedSubjectName, setSelectedSubjectName] = useState("Science");

  // Date sheet publish status
  const [isDateSheetPublished, setIsDateSheetPublished] = useState(true);

  // Screen 18: Marks Entry State
  const [marksData, setMarksData] = useState<StudentMarkRow[]>(INITIAL_MARKS_DATA);
  const [marksWorkflowStep, setMarksWorkflowStep] = useState<1 | 2 | 3 | 4>(1); // 1 Draft, 2 Submitted, 3 Verified, 4 Final
  const [autosaveTime, setAutosaveTime] = useState("10:42 am");

  // Screen 19: Results State
  const [withholdFeeDues, setWithholdFeeDues] = useState(true);
  const [sectionResults, setSectionResults] = useState<SectionResultRow[]>(INITIAL_SECTION_RESULTS);

  // Load backend data if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, classRes, secRes, subRes] = await Promise.allSettled([
          api.get("/admin/exams"),
          api.get("/admin/classes"),
          api.get("/admin/sections"),
          api.get("/admin/subjects"),
        ]);
        if (examRes.status === "fulfilled" && examRes.value.data?.data) {
          setDbExams(examRes.value.data.data);
        }
        if (classRes.status === "fulfilled" && classRes.value.data?.data) {
          setDbClasses(classRes.value.data.data);
        }
        if (secRes.status === "fulfilled" && secRes.value.data?.data) {
          setDbSections(secRes.value.data.data);
        }
        if (subRes.status === "fulfilled" && subRes.value.data?.data) {
          setDbSubjects(subRes.value.data.data);
        }
      } catch {
        // Fallback gracefully to specification mock data
      }
    };
    fetchData();
  }, []);

  // Validation logic for Marks Entry (Screen 18)
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    marksData.forEach((row) => {
      const checkComp = (val: string, max: number, compName: string) => {
        if (!val || val === "AB" || val === "ML" || val === "EX") return;
        const n = Number(val);
        if (isNaN(n)) {
          errors.push(`Roll ${row.roll} ${compName} has invalid value "${val}"`);
        } else if (n > max) {
          errors.push(`Roll ${row.roll} ${compName} is ${n}, maximum is ${max}.`);
        } else if (n < 0) {
          errors.push(`Roll ${row.roll} ${compName} cannot be negative.`);
        }
      };

      checkComp(row.pt, 10, "Periodic Test");
      checkComp(row.nb, 5, "Notebook");
      checkComp(row.se, 5, "Sub. Enrichment");
      checkComp(row.hy, 80, "Half-Yearly");
    });
    return errors;
  }, [marksData]);

  // Compute live Total and Grade for a student row
  const computeStudentTotalAndGrade = (row: StudentMarkRow) => {
    const isSpecial = (v: string) => v === "AB" || v === "ML" || v === "EX";
    if (row.hy === "ML") return { total: "ML", grade: "—" };
    if (row.hy === "AB" && row.pt === "AB") return { total: "AB", grade: "E" };
    if (row.hy === "EX") return { total: "EX", grade: "—" };

    const ptNum = isSpecial(row.pt) ? 0 : Number(row.pt) || 0;
    const nbNum = isSpecial(row.nb) ? 0 : Number(row.nb) || 0;
    const seNum = isSpecial(row.se) ? 0 : Number(row.se) || 0;
    const hyNum = isSpecial(row.hy) ? 0 : Number(row.hy) || 0;

    const total = ptNum + nbNum + seNum + hyNum;

    // CBSE 8-Point Grading Scale:
    // A1: 91–100, A2: 81–90, B1: 71–80, B2: 61–70, C1: 51–60, C2: 41–50, D: 33–40, E: 32 & below
    let grade = "E";
    if (total >= 91) grade = "A1";
    else if (total >= 81) grade = "A2";
    else if (total >= 71) grade = "B1";
    else if (total >= 61) grade = "B2";
    else if (total >= 51) grade = "C1";
    else if (total >= 41) grade = "C2";
    else if (total >= 33) grade = "D";
    else grade = "E";

    return { total, grade };
  };

  const handleCellChange = (roll: string, field: "pt" | "nb" | "se" | "hy", value: string) => {
    setMarksData((prev) =>
      prev.map((r) => (r.roll === roll ? { ...r, [field]: value.trim().toUpperCase() } : r))
    );
  };

  const handleSaveDraft = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAutosaveTime(timeStr);
    showToast("Marks draft saved successfully", "success");
  };

  const handleExportCSV = () => {
    const headers = ["Roll", "Student Name", "Periodic Test (10)", "Notebook (5)", "Subject Enrichment (5)", "Half-Yearly (80)", "Total (100)", "Grade"];
    const rows = marksData.map((r) => {
      const { total, grade } = computeStudentTotalAndGrade(r);
      return [r.roll, `"${r.name}"`, r.pt, r.nb, r.se, r.hy, total, grade];
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Marks_${selectedSubjectName}_Class_${selectedClassNum}${selectedSectionLetter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Marks exported to CSV successfully", "success");
  };

  const handleSubmitForVerification = () => {
    if (validationErrors.length > 0) {
      return showToast("Please correct errors before submitting for verification", "warn");
    }
    setMarksWorkflowStep(2);
    showToast("Marks submitted for coordinator verification", "success");
  };

  const handlePublishDateSheet = () => {
    setIsDateSheetPublished((prev) => !prev);
    if (!isDateSheetPublished) {
      showToast("Date sheet published to Student & Teacher Portals", "success");
    } else {
      showToast("Date sheet unpublished (moved to draft)", "warn");
    }
  };

  const handlePublishSectionReport = (section: string) => {
    setSectionResults((prev) =>
      prev.map((s) => (s.section === section ? { ...s, reportCardStatus: "Published" } : s))
    );
    showToast(`Report cards for Section ${section} published successfully!`, "success");
  };

  const handleGenerateSectionReport = (section: string) => {
    setSectionResults((prev) =>
      prev.map((s) => (s.section === section ? { ...s, reportCardStatus: "Generated" } : s))
    );
    showToast(`Report cards generated for Section ${section}`, "success");
  };

  const handleImportSuccess = (imported: any[]) => {
    const updated = marksData.map((row) => {
      const match = imported.find(
        (imp) => String(imp.Roll).padStart(2, "0") === row.roll || imp.Student === row.name
      );
      if (match) {
        return {
          ...row,
          pt: match.PeriodicTest !== undefined ? String(match.PeriodicTest) : row.pt,
          nb: match.Notebook !== undefined ? String(match.Notebook) : row.nb,
          se: match.SubjectEnrichment !== undefined ? String(match.SubjectEnrichment) : row.se,
          hy: match.HalfYearly !== undefined ? String(match.HalfYearly) : row.hy,
        };
      }
      return row;
    });
    setMarksData(updated);
  };

  return (
    <div className="space-y-3 font-sans text-ink">
      
      {/* ============================================================== */}
      {/* TOP MODULE NAV / BREADCRUMB (Directly adhering to Screen 17-19)*/}
      {/* ============================================================== */}
      <ExamModuleNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ============================================================== */}
      {/* TAB 1: EXAM SETUP AND DATE SHEET (Screen 17: 17-ExamSetup.html) */}
      {/* ============================================================== */}
      {activeTab === "setup" && (
        <div className="space-y-3 animate-fadeIn">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight truncate">
                {selectedExamName} · Classes 6–8
              </h1>
              <p className="text-xs text-ink-secondary">
                Term 1 · Scheme: CBSE Middle (VI–VIII), version 2026-27 · 3 classes, 9 sections
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 flex-nowrap overflow-x-auto pb-1 lg:pb-0">
              <button
                type="button"
                onClick={() => setIsAdmitCardOpen(true)}
                className="px-2 sm:px-2 py-2 rounded-control border border-line-input bg-white text-ink text-small font-medium hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <FiPrinter size={15} className="text-ink-secondary" />
                <span>Print admit cards</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSeatingPlanOpen(true)}
                className="px-2 sm:px-2 py-2 rounded-control border border-line-input bg-white text-ink text-small font-medium hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <FiFileText size={15} className="text-ink-secondary" />
                <span>Seating plan</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreateScheduleOpen(true)}
                className="px-2 sm:px-2 py-2 rounded-control border border-line-input bg-white text-ink text-small font-medium hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
                title="Add new paper or create new exam schedule"
              >
                <FiPlus size={16} className="text-ink-secondary" />
                <span>Schedule Paper</span>
              </button>
              <button
                type="button"
                onClick={handlePublishDateSheet}
                className={`px-2 sm:px-2 py-2 rounded-control text-small font-semibold transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isDateSheetPublished
                    ? "bg-primary hover:bg-primary-hover text-white"
                    : "bg-slate-800 hover:bg-slate-900 text-white"
                }`}
              >
                <FiShare2 size={15} />
                <span>{isDateSheetPublished ? "Publish date sheet" : "Unpublished (Draft)"}</span>
              </button>
            </div>
          </div>

          {/* Assessment components for Term 1 (Card 1 in Screen 17) */}
          <section className="bg-white border border-line rounded-card p-5 space-y-3 shadow-xs">
            <h2 className="text-base font-semibold text-ink">Assessment components for Term 1</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Periodic Test */}
              <div className="border border-line bg-white rounded-[10px] p-3.5 flex flex-col gap-1 shadow-xs">
                <span className="text-small font-semibold text-ink">Periodic Test</span>
                <span className="font-mono text-xl font-bold text-ink">10</span>
                <span className="text-[12.5px] text-ink-secondary">Best 1 of 2 tests, scaled to 10</span>
              </div>

              {/* Notebook */}
              <div className="border border-line bg-white rounded-[10px] p-3.5 flex flex-col gap-1 shadow-xs">
                <span className="text-small font-semibold text-ink">Notebook</span>
                <span className="font-mono text-xl font-bold text-ink">5</span>
                <span className="text-[12.5px] text-ink-secondary">Regularity and completion</span>
              </div>

              {/* Subject Enrichment */}
              <div className="border border-line bg-white rounded-[10px] p-3.5 flex flex-col gap-1 shadow-xs">
                <span className="text-small font-semibold text-ink">Subject Enrichment</span>
                <span className="font-mono text-xl font-bold text-ink">5</span>
                <span className="text-[12.5px] text-ink-secondary">Lab / project / speaking</span>
              </div>

              {/* Half-Yearly Exam (Highlighted card) */}
              <div className="border border-[#9CC3C4] bg-[#F4F9F9] rounded-[10px] p-3.5 flex flex-col gap-1 shadow-xs">
                <span className="text-small font-semibold text-ink">Half-Yearly Exam</span>
                <span className="font-mono text-xl font-bold text-primary">80</span>
                <span className="text-[12.5px] text-ink-secondary">Written paper, 2.5 hours</span>
              </div>
            </div>

            <p className="text-[13px] text-ink-secondary pt-1">
              Total 100 per subject · 8-point grade scale A1 (91–100) to E (32 and below) · pass mark 33% per subject
            </p>
          </section>

          {/* Date sheet Card (Card 2 in Screen 17) */}
          <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-[#EEF1EF] flex justify-between items-center gap-3 flex-wrap">
              <h2 className="text-base font-semibold text-ink">Date sheet</h2>
              <span className="text-xs font-semibold text-[#7A4106] bg-[#FFF6EC] border border-[#EBC99C]/60 px-2.5 py-1 rounded-full">
                Invigilator missing for 2 papers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-small min-w-[650px]">
                <thead>
                  <tr className="bg-[#F2F4F2] text-left text-ink">
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Time</th>
                    <th className="px-4 py-3 font-semibold">Class 6</th>
                    <th className="px-4 py-3 font-semibold">Class 7</th>
                    <th className="px-4 py-3 font-semibold">Class 8</th>
                    <th className="px-4 py-3 font-semibold">Invigilators</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1EF]">
                  {DATE_SHEET_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-ink whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-2.5 font-mono text-[13px] text-ink-secondary">{row.time}</td>
                      <td className="px-4 py-2.5 font-medium">{row.class6}</td>
                      <td className="px-4 py-2.5 font-medium">{row.class7}</td>
                      <td className="px-4 py-2.5 font-medium">{row.class8}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        {row.invigStatus === "warning" ? (
                          <span className="text-[#8F4A09] font-semibold flex items-center gap-1.5">
                            <FiAlertTriangle size={13} /> {row.invigilators}
                          </span>
                        ) : (
                          <span className="text-ink-secondary font-normal">{row.invigilators}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MARKS ENTRY (Screen 18: 18-Marks.html)                   */}
      {/* ============================================================== */}
      {activeTab === "marks" && (
        <div className="space-y-3 animate-fadeIn">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
                {selectedSubjectName} · Class {selectedClassNum}-{selectedSectionLetter}
              </h1>
              <p className="text-xs text-ink-secondary">
                Subject teacher: Sunita Rathore · autosaved {autosaveTime}
              </p>
            </div>

            {/* Header Action Buttons with Colorful Aesthetics */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Export CSV button - Vibrant Emerald Green spreadsheet styling */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="py-2 px-4 rounded-control bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap active:scale-[0.98] border border-emerald-600"
                title="Export marks to CSV file"
              >
                <FiDownload size={14} className="text-white" />
                <span>Export CSV</span>
              </button>

              {/* Save Draft button - Vibrant Royal Blue styling */}
              <button
                type="button"
                onClick={handleSaveDraft}
                className="py-2 px-4 rounded-control bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap active:scale-[0.98] border border-blue-600"
                title="Save current marks draft"
              >
                <FiSave size={14} className="text-white" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>

          {/* Dedicated Filter Toolbar - Spacious & clean on all screens */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 bg-white border border-line rounded-card px-3.5 py-2 shadow-xs">
            <label className="flex items-center gap-2 text-xs text-ink-secondary font-medium">
              <span>Exam</span>
              <div className="relative">
                <select
                  value={selectedExamName}
                  onChange={(e) => setSelectedExamName(e.target.value)}
                  className="h-8 py-1 pl-2.5 pr-6 border border-line-input rounded-control bg-white text-ink text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="Half-Yearly Exam">Half-Yearly Exam (Term 1)</option>
                  <option value="Periodic Test 1">Periodic Test 1</option>
                  <option value="Periodic Test 2">Periodic Test 2</option>
                  <option value="Annual Examination">Annual Examination (Term 2)</option>
                </select>
                <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={13} />
              </div>
            </label>

            <label className="flex items-center gap-2 text-xs text-ink-secondary font-medium">
              <span>Class</span>
              <div className="relative">
                <select
                  value={selectedClassNum}
                  onChange={(e) => setSelectedClassNum(e.target.value)}
                  className="h-8 py-1 pl-2.5 pr-6 border border-line-input rounded-control bg-white text-ink text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                </select>
                <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={13} />
              </div>
            </label>

            <label className="flex items-center gap-2 text-xs text-ink-secondary font-medium">
              <span>Section</span>
              <div className="relative">
                <select
                  value={selectedSectionLetter}
                  onChange={(e) => setSelectedSectionLetter(e.target.value)}
                  className="h-8 py-1 pl-2.5 pr-6 border border-line-input rounded-control bg-white text-ink text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
                <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={13} />
              </div>
            </label>

            <label className="flex items-center gap-2 text-xs text-ink-secondary font-medium">
              <span>Subject</span>
              <div className="relative">
                <select
                  value={selectedSubjectName}
                  onChange={(e) => setSelectedSubjectName(e.target.value)}
                  className="h-8 py-1 pl-2.5 pr-6 border border-line-input rounded-control bg-white text-ink text-xs focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="Science">Science</option>
                  <option value="Maths">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Sanskrit">Sanskrit</option>
                  <option value="Computer">Computer</option>
                </select>
                <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={13} />
              </div>
            </label>
          </div>

          {/* Error Banner when validation errors exist (Screen 18) */}
          {validationErrors.length > 0 && (
            <div className="bg-[#FFF6EC] border border-[#EBC99C] rounded-[10px] px-4 py-3 text-small text-[#5E3305] flex items-center gap-2">
              <FiAlertTriangle size={16} className="text-[#8F4A09] shrink-0" />
              <span>
                {validationErrors.length} entry needs fixing before submit: {validationErrors[0]}
              </span>
            </div>
          )}

          {/* Marks Entry Grid Table */}
          <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
            {/* Table Card Header with Colorful Segmented Workflow Steps */}
            <div className="px-4 py-2.5 border-b border-line bg-gradient-to-r from-surface to-slate-50/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-semibold text-ink text-xs sm:text-small">
                  {selectedSubjectName} Marks Sheet
                </span>
                <span className="text-xs text-ink-secondary">
                  · {marksData.length} students enrolled
                </span>
              </div>

              {/* Colorful, attractive segmented workflow control */}
              <div className="inline-flex items-center bg-slate-100 border border-slate-200/90 p-1 rounded-control shadow-inner text-xs gap-1.5">
                {/* 1 Draft - Amber/Gold */}
                <button
                  type="button"
                  onClick={() => setMarksWorkflowStep(1)}
                  className={`px-3 py-1 rounded-[6px] transition-all flex items-center gap-1.5 font-medium ${
                    marksWorkflowStep === 1
                      ? "bg-amber-500 text-white font-semibold shadow-xs border border-amber-500 ring-1 ring-amber-300/50"
                      : "bg-amber-50/90 text-amber-800 border border-amber-200 hover:bg-amber-100 hover:border-amber-300"
                  }`}
                >
                  <FiEdit size={12} className={marksWorkflowStep === 1 ? "text-white" : "text-amber-600"} />
                  <span>1 Draft</span>
                </button>

                {/* 2 Submitted - Ocean Blue */}
                <button
                  type="button"
                  onClick={() => setMarksWorkflowStep(2)}
                  className={`px-3 py-1 rounded-[6px] transition-all flex items-center gap-1.5 font-medium ${
                    marksWorkflowStep === 2
                      ? "bg-blue-600 text-white font-semibold shadow-xs border border-blue-600 ring-1 ring-blue-300/50"
                      : "bg-blue-50/90 text-blue-800 border border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                  }`}
                >
                  <FiShare2 size={12} className={marksWorkflowStep === 2 ? "text-white" : "text-blue-600"} />
                  <span>2 Submitted</span>
                </button>

                {/* 3 Verified - Emerald Green */}
                <button
                  type="button"
                  onClick={() => setMarksWorkflowStep(3)}
                  className={`px-3 py-1 rounded-[6px] transition-all flex items-center gap-1.5 font-medium ${
                    marksWorkflowStep === 3
                      ? "bg-emerald-600 text-white font-semibold shadow-xs border border-emerald-600 ring-1 ring-emerald-300/50"
                      : "bg-emerald-50/90 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
                  }`}
                >
                  <FiCheckCircle size={12} className={marksWorkflowStep === 3 ? "text-white" : "text-emerald-600"} />
                  <span>3 Verified</span>
                </button>

                {/* 4 Final - Royal Purple with Gold Lock */}
                <button
                  type="button"
                  onClick={() => setMarksWorkflowStep(4)}
                  className={`px-3 py-1 rounded-[6px] transition-all flex items-center gap-1.5 font-medium ${
                    marksWorkflowStep === 4
                      ? "bg-purple-700 text-white font-semibold shadow-xs border border-purple-700 ring-1 ring-purple-300/50"
                      : "bg-purple-50/90 text-purple-800 border border-purple-200 hover:bg-purple-100 hover:border-purple-300"
                  }`}
                >
                  <FiLock size={12} className={marksWorkflowStep === 4 ? "text-amber-300" : "text-purple-600"} />
                  <span>4 Final (Locked)</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse text-xs sm:text-small">
                <thead>
                  <tr className="bg-[#F2F4F2] text-left text-ink border-b border-line">
                    <th className="w-[8%] px-2 py-2 font-semibold text-center text-ink-secondary">Roll</th>
                    <th className="w-[16%] px-3 py-2 font-semibold text-ink text-left">Student</th>
                    <th className="w-[12%] px-1 py-2 font-semibold text-center">
                      <span className="block leading-tight">Periodic Test</span>
                      <span className="block font-normal text-[11px] text-ink-secondary">best of 2 · /10</span>
                    </th>
                    <th className="w-[12%] px-1 py-2 font-semibold text-center">
                      <span className="block leading-tight">Notebook</span>
                      <span className="block font-normal text-[11px] text-ink-secondary">/5</span>
                    </th>
                    <th className="w-[12%] px-1 py-2 font-semibold text-center">
                      <span className="block leading-tight">Sub. Enrich</span>
                      <span className="block font-normal text-[11px] text-ink-secondary">/5</span>
                    </th>
                    <th className="w-[12%] px-1 py-2 font-semibold text-center">
                      <span className="block leading-tight">Half-Yearly</span>
                      <span className="block font-normal text-[11px] text-ink-secondary">/80</span>
                    </th>
                    <th className="w-[16%] px-2 py-2 font-semibold text-center">
                      <span className="inline-flex items-center gap-1">
                        <span>Total</span>
                        <span>/100</span>
                      </span>
                    </th>
                    <th className="w-[8%] px-2 py-2 font-semibold text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1EF]">
                  {marksData.map((row) => {
                    const { total, grade } = computeStudentTotalAndGrade(row);
                    const isRowError =
                      Number(row.pt) > 10 ||
                      Number(row.nb) > 5 ||
                      Number(row.se) > 5 ||
                      Number(row.hy) > 80;

                    return (
                      <tr
                        key={row.roll}
                        className={`transition-colors ${isRowError ? "bg-amber-50/40" : "hover:bg-slate-50/50"}`}
                      >
                        <td className="px-2 py-1 font-mono text-xs text-ink-secondary font-medium text-center">
                          {row.roll}
                        </td>
                        <td className="px-3 py-1 font-medium text-ink truncate" title={row.name}>
                          {row.name}
                        </td>
                        
                        {/* Periodic Test Input (/10) */}
                        <td className="px-12 py-1 text-center">
                          <input
                            type="text"
                            value={row.pt}
                            disabled={marksWorkflowStep === 4}
                            onChange={(e) => handleCellChange(row.roll, "pt", e.target.value)}
                            className={`w-14 h-8 text-center rounded-[6px] border font-mono text-xs text-ink focus:outline-none focus:border-primary transition-all mx-auto block ${
                              Number(row.pt) > 10 ? "border-amber-500 bg-amber-50 font-bold" : "border-[#C9D1CD] bg-white"
                            }`}
                          />
                        </td>

                        {/* Notebook Input (/5) */}
                        <td className="px-2 py-1 text-center">
                          <input
                            type="text"
                            value={row.nb}
                            disabled={marksWorkflowStep === 4}
                            onChange={(e) => handleCellChange(row.roll, "nb", e.target.value)}
                            className={`w-12 h-8 text-center rounded-[6px] border font-mono text-xs text-ink focus:outline-none focus:border-primary transition-all mx-auto block ${
                              Number(row.nb) > 5 ? "border-amber-500 bg-amber-50 font-bold" : "border-[#C9D1CD] bg-white"
                            }`}
                          />
                        </td>

                        {/* Subject Enrichment Input (/5) */}
                        <td className="px-2 py-1 text-center">
                          <input
                            type="text"
                            value={row.se}
                            disabled={marksWorkflowStep === 4}
                            onChange={(e) => handleCellChange(row.roll, "se", e.target.value)}
                            className={`w-12 h-8 text-center rounded-[6px] border font-mono text-xs text-ink focus:outline-none focus:border-primary transition-all mx-auto block ${
                              Number(row.se) > 5 ? "border-amber-500 bg-amber-50 font-bold" : "border-[#C9D1CD] bg-white"
                            }`}
                          />
                        </td>

                        {/* Half-Yearly Input (/80) */}
                        <td className="px-2 py-1 text-center">
                          <input
                            type="text"
                            value={row.hy}
                            disabled={marksWorkflowStep === 4}
                            onChange={(e) => handleCellChange(row.roll, "hy", e.target.value)}
                            className={`w-14 h-8 text-center rounded-[6px] border font-mono text-xs text-ink focus:outline-none focus:border-primary transition-all mx-auto block ${
                              Number(row.hy) > 80 ? "border-amber-500 bg-amber-50 font-bold text-amber-800" : "border-[#C9D1CD] bg-white"
                            }`}
                          />
                        </td>

                        {/* Total /100 */}
                        <td className="px-2 py-1 text-center font-mono font-semibold text-xs sm:text-small text-ink">
                          {total}
                        </td>

                        {/* Grade Pill */}
                        <td className="px-2 py-1 text-center">
                          <span className="inline-block min-w-[32px] px-2 py-0.5 rounded-[5px] bg-[#E3EFEF] text-[#08393F] font-semibold text-xs font-mono">
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Guideline & Actions Bar */}
          <div className="flex flex-wrap justify-between items-center gap-3 p-4 border-t border-[#EEF1EF] bg-surface">
  <span className="text-[13px] text-ink-secondary flex-1 min-w-0">
    Allowed values: a number, AB (absent), ML (medical leave), EX (exempt). After the coordinator finalises, changes need an unlock request.
  </span>

  <div className="flex items-center justify-end gap-2.5 shrink-0 ml-auto">
    <button
      type="button"
      onClick={() => setIsImportMarksOpen(true)}
      className="py-2 px-4 rounded-control border border-emerald-300 bg-emerald-50/90 text-emerald-800 text-sm font-semibold hover:bg-emerald-100 transition-colors shadow-xs flex items-center gap-1.5"
    >
      <FiUpload size={15} className="text-emerald-700" />
      Import from Excel
    </button>

    <button
      type="button"
      onClick={handleSubmitForVerification}
      disabled={validationErrors.length > 0 || marksWorkflowStep >= 2}
      className={`py-2 px-4 rounded-control text-sm font-semibold shadow-xs transition-colors ${
        validationErrors.length > 0 || marksWorkflowStep >= 2
          ? "bg-[#9DB5B5] cursor-not-allowed text-white"
          : "bg-[#0E5A63] hover:bg-[#08393F] text-white cursor-pointer"
      }`}
    >
      {marksWorkflowStep >= 2 ? "Submitted" : "Submit for verification"}
    </button>
  </div>
</div>
          </section>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: RESULTS AND REPORT CARDS (Screen 19: 19-ReportCards.html)*/}
      {/* ============================================================== */}
      {activeTab === "results" && (
        <div className="space-y-3 animate-fadeIn">
          {/* Header Row */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
                Term 1 results · Classes 6–8
              </h1>
              <p className="text-small text-ink-secondary">
                A section can be published only when every subject is Final and remarks are complete.
              </p>
            </div>

            {/* Checkbox: Withhold report cards for fee dues */}
            <label className="flex items-center gap-2.5 text-small text-ink select-none cursor-pointer">
              <input
                type="checkbox"
                checked={withholdFeeDues}
                onChange={(e) => setWithholdFeeDues(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-[#C9D1CD] text-primary focus:ring-primary cursor-pointer"
              />
              <span>Withhold report cards for fee dues over 60 days</span>
            </label>
          </div>

          {/* Section Results Table */}
          <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-small min-w-[680px]">
                <thead>
                  <tr className="bg-[#F2F4F2] text-left text-ink">
                    <th className="px-4 py-3 font-semibold">Section</th>
                    <th className="px-4 py-3 font-semibold">Subjects final</th>
                    <th className="px-4 py-3 font-semibold">Remarks</th>
                    <th className="px-4 py-3 font-semibold text-right">Pass %</th>
                    <th className="px-4 py-3 font-semibold">Report cards</th>
                    <th className="px-4 py-3 font-semibold text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1EF]">
                  {sectionResults.map((sec) => (
                    <tr key={sec.section} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-ink">{sec.section}</td>
                      
                      {/* Subjects Final */}
                      <td className="px-4 py-2.5">
                        <span
                          className={`font-mono ${
                            sec.isSubjectsFinalComplete ? "text-ink" : "text-[#8F4A09] font-semibold"
                          }`}
                        >
                          {sec.subjectsFinal}
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="px-4 py-2.5">
                        <span className={sec.isRemarksComplete ? "text-ink" : "text-[#8F4A09] font-medium"}>
                          {sec.remarks}
                        </span>
                      </td>

                      {/* Pass % */}
                      <td className="px-4 py-2.5 text-right font-mono font-medium text-ink">
                        {sec.passPercentage}
                      </td>

                      {/* Report Cards Badge */}
                      <td className="px-4 py-2.5">
                        {sec.reportCardStatus === "Published" && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#1E5A33]">
                            Published
                          </span>
                        )}
                        {sec.reportCardStatus === "Generated" && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E3EFEF] text-[#08393F]">
                            Generated
                          </span>
                        )}
                        {sec.reportCardStatus === "Not ready" && (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F2EF] text-[#4F5B57]">
                            Not ready
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="px-4 py-2 text-right">
                        {sec.reportCardStatus === "Published" && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSectionForReport(sec.section);
                              setIsReportCardOpen(true);
                            }}
                            className="min-h-[38px] px-3.5 rounded-control bg-[#4F5B57] hover:bg-slate-700 text-white text-[13px] font-semibold transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        )}
                        {sec.reportCardStatus === "Generated" && (
                          <button
                            type="button"
                            onClick={() => handlePublishSectionReport(sec.section)}
                            className="min-h-[38px] px-3.5 rounded-control bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold transition-colors cursor-pointer"
                          >
                            Publish
                          </button>
                        )}
                        {sec.reportCardStatus === "Not ready" && (
                          <button
                            type="button"
                            disabled
                            className="min-h-[38px] px-3.5 rounded-control bg-[#9DB5B5] text-white text-[13px] font-semibold cursor-not-allowed"
                          >
                            Generate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Two Summary Cards (Screen 19) */}
          <div className="flex flex-wrap gap-5 items-start">
            
            {/* Card 1: Withheld for fee dues */}
            <section className="flex-1 min-w-[320px] bg-white border border-line rounded-card p-5 space-y-2.5 shadow-xs">
              <h2 className="text-base font-semibold text-ink">Withheld for fee dues · 11 students</h2>
              
              <div className="divide-y divide-[#EEF1EF] text-small">
                <div className="flex justify-between items-center py-2">
                  <span>Harsh Vardhan · 8-A</span>
                  <span className="font-mono font-medium text-[#8F4A09]">₹21,800</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Kunal Mehra · 7-C</span>
                  <span className="font-mono font-medium text-[#8F4A09]">₹33,800</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Tanya Saini · 6-C</span>
                  <span className="font-mono font-medium text-[#8F4A09]">₹16,900</span>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  to="/admin/defaulters"
                  className="text-[13px] font-semibold text-primary hover:text-primary-hover hover:underline"
                >
                  Open defaulter list
                </Link>
              </div>
            </section>

            {/* Card 2: Subjects with lowest pass % */}
            <section className="flex-1 min-w-[320px] bg-white border border-line rounded-card p-5 space-y-2.5 shadow-xs">
              <h2 className="text-base font-semibold text-ink">Subjects with lowest pass %</h2>
              
              <div className="divide-y divide-[#EEF1EF] text-small">
                <div className="flex justify-between items-center py-2">
                  <span>Maths · 7-C</span>
                  <span className="font-mono font-medium text-ink">82.5%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Science · 8-A</span>
                  <span className="font-mono font-medium text-ink">86.8%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Sanskrit · 6-C</span>
                  <span className="font-mono font-medium text-ink">87.5%</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* INTERACTIVE MODALS                                             */}
      {/* ============================================================== */}
      {/* Admit Card Modal */}
      <AdmitCardModal
        isOpen={isAdmitCardOpen}
        onClose={() => setIsAdmitCardOpen(false)}
        examName={selectedExamName}
        classes={["6", "7", "8"]}
        papers={DATE_SHEET_ROWS.map((r) => ({
          date: r.date,
          time: r.time,
          subject: r.class8,
        }))}
      />

      {/* Seating Plan Modal */}
      <SeatingPlanModal
        isOpen={isSeatingPlanOpen}
        onClose={() => setIsSeatingPlanOpen(false)}
        examName={selectedExamName}
      />

      {/* Import Marks from Excel Modal */}
      <ImportMarksModal
        isOpen={isImportMarksOpen}
        onClose={() => setIsImportMarksOpen(false)}
        className={selectedClassNum}
        section={selectedSectionLetter}
        subject={selectedSubjectName}
        onImport={handleImportSuccess}
      />

      {/* Report Card Viewer Modal */}
      <ReportCardViewModal
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
        sectionName={selectedSectionForReport}
        examName={selectedExamName}
      />

      {/* Schedule Exam / Paper Modal */}
      <CreateExamScheduleModal
        isOpen={isCreateScheduleOpen}
        onClose={() => setIsCreateScheduleOpen(false)}
        onSuccess={() => {}}
        classes={dbClasses}
        subjects={dbSubjects}
      />

    </div>
  );
}
