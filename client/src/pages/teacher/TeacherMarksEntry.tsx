import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import {
  MdCheckCircle,
  MdSearch,
  MdFileDownload,
  MdFileUpload,
  MdCheck,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdAutoAwesome,
  MdCalculate,
  MdVisibility,
} from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export interface StudentMark {
  roll: string;
  name: string;
  gender: "M" | "F";
  pt: string; // Periodic Test /10
  nb: string; // Notebook /5
  se: string; // Subject Enrichment /5
  hy: string; // Half-Yearly /80
}

export interface StudentRemark {
  roll: string;
  name: string;
  gender: "M" | "F";
  band: string;
  remark: string;
  art: string;
  pe: string;
  discipline: string;
}

// Full 38 Students of Class 8-B consistent with Attendance and My Class rosters
const INITIAL_MARKS: StudentMark[] = [
  { roll: "01", name: "Aditi Sharma", gender: "F", pt: "9", nb: "5", se: "4", hy: "71" },
  { roll: "02", name: "Bhavesh Kumar", gender: "M", pt: "8", nb: "4", se: "4", hy: "62" },
  { roll: "03", name: "Charu Mehta", gender: "F", pt: "10", nb: "5", se: "5", hy: "76" },
  { roll: "04", name: "Dev Saini", gender: "M", pt: "AB", nb: "3", se: "4", hy: "48" },
  { roll: "05", name: "Esha Gupta", gender: "F", pt: "7", nb: "4", se: "3", hy: "55" },
  { roll: "06", name: "Faizan Ali", gender: "M", pt: "9", nb: "5", se: "5", hy: "84" }, // Validation flag: 84 > 80
  { roll: "07", name: "Garima Joshi", gender: "F", pt: "6", nb: "3", se: "4", hy: "39" },
  { roll: "08", name: "Hitesh Yadav", gender: "M", pt: "8", nb: "4", se: "4", hy: "ML" },
  { roll: "09", name: "Isha Kanwar", gender: "F", pt: "10", nb: "5", se: "5", hy: "79" },
  { roll: "10", name: "Jatin Soni", gender: "M", pt: "5", nb: "3", se: "3", hy: "22" },
  { roll: "11", name: "Khushi Verma", gender: "F", pt: "9", nb: "5", se: "4", hy: "68" },
  { roll: "12", name: "Lakshay Jain", gender: "M", pt: "8", nb: "4", se: "5", hy: "64" },
  { roll: "13", name: "Manan Khandelwal", gender: "M", pt: "9", nb: "4", se: "4", hy: "70" },
  { roll: "14", name: "Nandini Sen", gender: "F", pt: "10", nb: "5", se: "5", hy: "75" },
  { roll: "15", name: "Omkar Tiwari", gender: "M", pt: "7", nb: "3", se: "4", hy: "52" },
  { roll: "16", name: "Pari Rathore", gender: "F", pt: "9", nb: "5", se: "5", hy: "73" },
  { roll: "17", name: "Qasim Sheikh", gender: "M", pt: "8", nb: "4", se: "3", hy: "58" },
  { roll: "18", name: "Riya Kapoor", gender: "F", pt: "10", nb: "5", se: "5", hy: "77" },
  { roll: "19", name: "Samar Meena", gender: "M", pt: "6", nb: "3", se: "3", hy: "44" },
  { roll: "20", name: "Tanvi Deshmukh", gender: "F", pt: "9", nb: "5", se: "4", hy: "69" },
  { roll: "21", name: "Utkarsh Rawat", gender: "M", pt: "7", nb: "4", se: "4", hy: "56" },
  { roll: "22", name: "Vidhi Singhal", gender: "F", pt: "10", nb: "5", se: "5", hy: "78" },
  { roll: "23", name: "Yashvardhan Rao", gender: "M", pt: "8", nb: "4", se: "4", hy: "65" },
  { roll: "24", name: "Zara Khan", gender: "F", pt: "9", nb: "5", se: "5", hy: "72" },
  { roll: "25", name: "Aryan Mishra", gender: "M", pt: "8", nb: "4", se: "4", hy: "63" },
  { roll: "26", name: "Ananya Roy", gender: "F", pt: "10", nb: "5", se: "5", hy: "76" },
  { roll: "27", name: "Chirag Sethi", gender: "M", pt: "7", nb: "3", se: "3", hy: "49" },
  { roll: "28", name: "Drishti Nair", gender: "F", pt: "9", nb: "5", se: "4", hy: "67" },
  { roll: "29", name: "Farhan Akhtar", gender: "M", pt: "8", nb: "4", se: "4", hy: "60" },
  { roll: "30", name: "Gauri Shinde", gender: "F", pt: "10", nb: "5", se: "5", hy: "74" },
  { roll: "31", name: "Hardik Pandya", gender: "M", pt: "6", nb: "3", se: "3", hy: "42" },
  { roll: "32", name: "Ishita Sen", gender: "F", pt: "9", nb: "5", se: "5", hy: "70" },
  { roll: "33", name: "Jayant Chaudhary", gender: "M", pt: "7", nb: "4", se: "4", hy: "53" },
  { roll: "34", name: "Kritika Saxena", gender: "F", pt: "10", nb: "5", se: "5", hy: "77" },
  { roll: "35", name: "Luv Kushwaha", gender: "M", pt: "8", nb: "4", se: "4", hy: "61" },
  { roll: "36", name: "Meera Nambiar", gender: "F", pt: "9", nb: "5", se: "5", hy: "73" },
  { roll: "37", name: "Navin Jindal", gender: "M", pt: "7", nb: "4", se: "3", hy: "50" },
  { roll: "38", name: "Ojasvi Varma", gender: "F", pt: "10", nb: "5", se: "5", hy: "78" },
];

const INITIAL_REMARKS: StudentRemark[] = [
  { roll: "01", name: "Aditi Sharma", gender: "F", band: "Band A2", remark: "Aditi is attentive and asks good questions. She should practise diagrams for neater answers.", art: "A", pe: "A", discipline: "A" },
  { roll: "02", name: "Bhavesh Kumar", gender: "M", band: "Band B2", remark: "Bhavesh works steadily. Regular revision of science terms will improve his scores.", art: "B", pe: "A", discipline: "B" },
  { roll: "03", name: "Charu Mehta", gender: "F", band: "Band A1", remark: "Excellent understanding and very neat work. Keep reading beyond the textbook.", art: "A", pe: "B", discipline: "A" },
  { roll: "04", name: "Dev Saini", gender: "M", band: "Band C2", remark: "", art: "B", pe: "A", discipline: "B" },
  { roll: "05", name: "Esha Gupta", gender: "F", band: "Band C1", remark: "Esha is improving. Daily homework and asking doubts in class will help.", art: "A", pe: "B", discipline: "A" },
  { roll: "06", name: "Faizan Ali", gender: "M", band: "Band A1", remark: "Remarkable aptitude for laboratory experiments and problem solving.", art: "A", pe: "A", discipline: "A" },
  { roll: "07", name: "Garima Joshi", gender: "F", band: "Band C2", remark: "", art: "B", pe: "B", discipline: "B" },
  { roll: "08", name: "Hitesh Yadav", gender: "M", band: "Band B2", remark: "Missed exam due to certified medical leave. Needs re-test scheduling.", art: "A", pe: "B", discipline: "A" },
  { roll: "09", name: "Isha Kanwar", gender: "F", band: "Band A1", remark: "Exceptional grasp of scientific reasoning and exemplary notebook maintenance.", art: "A", pe: "A", discipline: "A" },
  { roll: "10", name: "Jatin Soni", gender: "M", band: "Band E", remark: "Requires remedial support and parent-teacher meeting regarding basic concepts.", art: "C", pe: "B", discipline: "C" },
  { roll: "11", name: "Khushi Verma", gender: "F", band: "Band B1", remark: "Consistent performer with positive attitude towards group assignments.", art: "A", pe: "A", discipline: "A" },
  { roll: "12", name: "Lakshay Jain", gender: "M", band: "Band B1", remark: "Active participant in classroom discussions. Good analytical skills.", art: "B", pe: "A", discipline: "B" },
  { roll: "13", name: "Manan Khandelwal", gender: "M", band: "Band B1", remark: "Very diligent in completing laboratory records on time.", art: "A", pe: "B", discipline: "A" },
  { roll: "14", name: "Nandini Sen", gender: "F", band: "Band A1", remark: "Brilliant conceptual clarity and thoughtful questions during science classes.", art: "A", pe: "A", discipline: "A" },
  { roll: "15", name: "Omkar Tiwari", gender: "M", band: "Band C1", remark: "", art: "B", pe: "B", discipline: "B" },
  { roll: "16", name: "Pari Rathore", gender: "F", band: "Band A2", remark: "Demonstrates keen interest in physics and chemistry demonstrations.", art: "A", pe: "A", discipline: "A" },
  { roll: "17", name: "Qasim Sheikh", gender: "M", band: "Band B2", remark: "Good progress. Needs to focus on balancing chemical equations.", art: "B", pe: "A", discipline: "B" },
  { roll: "18", name: "Riya Kapoor", gender: "F", band: "Band A1", remark: "Outstanding test scores and commendable leadership in group projects.", art: "A", pe: "A", discipline: "A" },
  { roll: "19", name: "Samar Meena", gender: "M", band: "Band C2", remark: "", art: "C", pe: "A", discipline: "B" },
  { roll: "20", name: "Tanvi Deshmukh", gender: "F", band: "Band B1", remark: "Well organized, methodical, and prompt in homework submission.", art: "A", pe: "B", discipline: "A" },
  { roll: "21", name: "Utkarsh Rawat", gender: "M", band: "Band C1", remark: "Regular revision will help Utkarsh translate concepts into better marks.", art: "B", pe: "A", discipline: "B" },
  { roll: "22", name: "Vidhi Singhal", gender: "F", band: "Band A1", remark: "Extremely sincere student. High precision in graph plotting and numericals.", art: "A", pe: "A", discipline: "A" },
  { roll: "23", name: "Yashvardhan Rao", gender: "M", band: "Band B1", remark: "Good performance. Can aim for A1 with more attention to NCERT exercise questions.", art: "A", pe: "A", discipline: "A" },
  { roll: "24", name: "Zara Khan", gender: "F", band: "Band A2", remark: "Bright student with keen curiosity. Keep up the high standard of work.", art: "A", pe: "A", discipline: "A" },
  { roll: "25", name: "Aryan Mishra", gender: "M", band: "Band B1", remark: "", art: "B", pe: "B", discipline: "B" },
  { roll: "26", name: "Ananya Roy", gender: "F", band: "Band A1", remark: "Superb analytical presentation and creative thinking in science models.", art: "A", pe: "A", discipline: "A" },
  { roll: "27", name: "Chirag Sethi", gender: "M", band: "Band C2", remark: "", art: "B", pe: "A", discipline: "B" },
  { roll: "28", name: "Drishti Nair", gender: "F", band: "Band B1", remark: "Methodical and attentive during practical sessions.", art: "A", pe: "B", discipline: "A" },
  { roll: "29", name: "Farhan Akhtar", gender: "M", band: "Band B2", remark: "", art: "B", pe: "A", discipline: "B" },
  { roll: "30", name: "Gauri Shinde", gender: "F", band: "Band A1", remark: "Consistent high achiever with excellent classroom discipline.", art: "A", pe: "A", discipline: "A" },
  { roll: "31", name: "Hardik Pandya", gender: "M", band: "Band C2", remark: "", art: "A", pe: "A", discipline: "B" },
  { roll: "32", name: "Ishita Sen", gender: "F", band: "Band B1", remark: "Very attentive in class. Expresses scientific ideas clearly.", art: "A", pe: "B", discipline: "A" },
  { roll: "33", name: "Jayant Chaudhary", gender: "M", band: "Band C1", remark: "", art: "B", pe: "A", discipline: "B" },
  { roll: "34", name: "Kritika Saxena", gender: "F", band: "Band A1", remark: "Outstanding scientific curiosity and immaculate answer sheets.", art: "A", pe: "A", discipline: "A" },
  { roll: "35", name: "Luv Kushwaha", gender: "M", band: "Band B2", remark: "", art: "B", pe: "A", discipline: "B" },
  { roll: "36", name: "Meera Nambiar", gender: "F", band: "Band A2", remark: "Excellent participation in science exhibitions and quizzes.", art: "A", pe: "A", discipline: "A" },
  { roll: "37", name: "Navin Jindal", gender: "M", band: "Band C1", remark: "", art: "B", pe: "B", discipline: "B" },
  { roll: "38", name: "Ojasvi Varma", gender: "F", band: "Band A1", remark: "Remarkable performance throughout Term 1. A pleasure to teach.", art: "A", pe: "A", discipline: "A" },
];

const REMARK_BANK: Record<string, string[]> = {
  A1: [
    "Outstanding performance. Demonstrates deep conceptual understanding and intellectual curiosity.",
    "Excellent mastery of all topics. Very consistent, methodical, and enthusiastic in class discussions.",
    "Exemplary performance with high precision in diagrams and descriptive answers.",
  ],
  A2: [
    "Very good grasp of scientific concepts. Regularly participates with thoughtful observations.",
    "Strong conceptual foundation. Minor attention to detail will help secure top honors.",
    "Shows remarkable aptitude in practical experiments and logical reasoning.",
  ],
  B1: [
    "Good academic progress. Works diligently and completes all assigned coursework promptly.",
    "Shows steady understanding. Needs slightly more practice in descriptive and analytical questions.",
    "Active participant in class who responds well to constructive feedback.",
  ],
  B2: [
    "Satisfactory performance. Regular revision and asking doubts will boost examination scores.",
    "Has good potential. Needs to be more consistent with homework submission and formula revision.",
    "Shows interest in classroom experiments; needs focused practice on written theory.",
  ],
  C1: [
    "Shows steady improvement. Additional practice and structured study time needed before Term 2.",
    "Capable of much better results. Focus in class and regular textbook reading will help.",
    "Needs to maintain neat notebooks and complete corrections regularly.",
  ],
  C2: [
    "Requires structured guidance and regular revision of fundamental definitions.",
    "Attendance and active class participation need immediate attention to improve grades.",
    "Encouraged to attend weekly doubt clearing sessions and revise NCERT exercises.",
  ],
  E: [
    "Requires intensive remedial support. Parent-teacher consultation recommended for study plan.",
    "Needs foundational strengthening in basic numeracy and scientific terminology.",
  ],
};

const calculateGrade = (total: number): string => {
  if (total >= 91) return "A1";
  if (total >= 81) return "A2";
  if (total >= 71) return "B1";
  if (total >= 61) return "B2";
  if (total >= 51) return "C1";
  if (total >= 41) return "C2";
  if (total >= 33) return "D";
  return "E";
};

const getGradeBadge = (grade: string) => {
  switch (grade) {
    case "A1":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "A2":
      return "bg-teal-50 text-teal-800 border-teal-200";
    case "B1":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "B2":
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    case "C1":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "C2":
      return "bg-orange-50 text-orange-800 border-orange-200";
    case "D":
      return "bg-purple-50 text-purple-800 border-purple-200";
    case "E":
      return "bg-rose-50 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const TeacherMarksEntry: React.FC = () => {
  const { showToast } = useToast();
  const location = useLocation();

  // Active Tab: "marks" | "remarks" (URL-aware)
  const [activeTab, setActiveTab] = useState<"marks" | "remarks">(() => {
    if (location.pathname.includes("remark")) return "remarks";
    return "marks";
  });

  const [selectedSection, setSelectedSection] = useState("8-B Science · Draft");
  const [marks, setMarks] = useState<StudentMark[]>(INITIAL_MARKS);
  const [remarks, setRemarks] = useState<StudentRemark[]>(INITIAL_REMARKS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [remarkStatusFilter, setRemarkStatusFilter] = useState<"ALL" | "DONE" | "PENDING">("ALL");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Remark Bank Modal State
  const [bankModalStudent, setBankModalStudent] = useState<StudentRemark | null>(null);

  // Student Report Card Preview Modal State
  const [previewStudentRoll, setPreviewStudentRoll] = useState<string | null>(null);

  // Excel Import File simulation state
  const [isImporting, setIsImporting] = useState(false);

  // Floating status / validation pop toast state
  const [showStatusToast, setShowStatusToast] = useState(true);

  // Validation Check
  const validationErrors = useMemo(() => {
    const errors: { roll: string; name: string; field: string; val: number; max: number }[] = [];
    marks.forEach((m) => {
      const ptVal = parseFloat(m.pt);
      if (!isNaN(ptVal) && ptVal > 10) errors.push({ roll: m.roll, name: m.name, field: "PT", val: ptVal, max: 10 });
      const nbVal = parseFloat(m.nb);
      if (!isNaN(nbVal) && nbVal > 5) errors.push({ roll: m.roll, name: m.name, field: "NB", val: nbVal, max: 5 });
      const seVal = parseFloat(m.se);
      if (!isNaN(seVal) && seVal > 5) errors.push({ roll: m.roll, name: m.name, field: "SE", val: seVal, max: 5 });
      const hyVal = parseFloat(m.hy);
      if (!isNaN(hyVal) && hyVal > 80) errors.push({ roll: m.roll, name: m.name, field: "HY", val: hyVal, max: 80 });
    });
    return errors;
  }, [marks]);

  // Automatically reopen status toast whenever validation issues are detected
  useEffect(() => {
    if (validationErrors.length > 0) {
      setShowStatusToast(true);
    }
  }, [validationErrors.length]);

  // Computed Metrics
  const computedMetrics = useMemo(() => {
    let totalScoreSum = 0;
    let scoredCount = 0;
    let highestScore = 0;
    let highestScorer = "";
    let passCount = 0;

    const gradeTally: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0, D: 0, E: 0 };

    marks.forEach((m) => {
      const ptNum = parseFloat(m.pt);
      const nbNum = parseFloat(m.nb);
      const seNum = parseFloat(m.se);
      const hyNum = parseFloat(m.hy);

      if (!isNaN(hyNum) && hyNum <= 80) {
        const sum = (!isNaN(ptNum) ? ptNum : 0) + (!isNaN(nbNum) ? nbNum : 0) + (!isNaN(seNum) ? seNum : 0) + hyNum;
        totalScoreSum += sum;
        scoredCount++;
        if (sum > highestScore) {
          highestScore = sum;
          highestScorer = m.name;
        }
        if (sum >= 33) passCount++;
        const grade = calculateGrade(sum);
        if (gradeTally[grade] !== undefined) gradeTally[grade]++;
      }
    });

    const classAverage = scoredCount > 0 ? (totalScoreSum / scoredCount).toFixed(1) : "0.0";
    const passPercentage = marks.length > 0 ? ((passCount / marks.length) * 100).toFixed(1) : "0.0";

    const completedRemarksCount = remarks.filter((r) => r.remark.trim().length > 0).length;

    return {
      classAverage,
      highestScore,
      highestScorer,
      passPercentage,
      passCount,
      gradeTally,
      completedRemarksCount,
      totalRemarksCount: remarks.length,
    };
  }, [marks, remarks]);

  // Filtered Marks
  const filteredMarks = useMemo(() => {
    return marks.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.roll.includes(searchQuery);
      return matchSearch;
    });
  }, [marks, searchQuery]);

  // Filtered Remarks
  const filteredRemarks = useMemo(() => {
    return remarks.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.roll.includes(searchQuery);
      if (!matchSearch) return false;

      if (remarkStatusFilter === "DONE") return r.remark.trim().length > 0;
      if (remarkStatusFilter === "PENDING") return r.remark.trim().length === 0;
      return true;
    });
  }, [remarks, searchQuery, remarkStatusFilter]);

  // Pagination reset on filter/search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, remarkStatusFilter, activeTab]);

  const currentListLength = activeTab === "marks" ? filteredMarks.length : filteredRemarks.length;
  const totalPages = Math.max(1, Math.ceil(currentListLength / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedMarks = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredMarks.slice(start, start + pageSize);
  }, [filteredMarks, activePage, pageSize]);

  const paginatedRemarks = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredRemarks.slice(start, start + pageSize);
  }, [filteredRemarks, activePage, pageSize]);

  // Mark Change Handlers
  const handleMarkChange = (roll: string, field: "pt" | "nb" | "se" | "hy", value: string) => {
    setMarks((prev) =>
      prev.map((m) => (m.roll === roll ? { ...m, [field]: value.toUpperCase() } : m))
    );
  };

  const handleFixValidation = (roll: string, field: string, maxVal: number) => {
    setMarks((prev) =>
      prev.map((m) => {
        if (m.roll !== roll) return m;
        if (field === "HY") return { ...m, hy: maxVal.toString() };
        if (field === "PT") return { ...m, pt: maxVal.toString() };
        if (field === "NB") return { ...m, nb: maxVal.toString() };
        if (field === "SE") return { ...m, se: maxVal.toString() };
        return m;
      })
    );
    showToast(`Corrected Roll ${roll} ${field} to maximum allowed (${maxVal})`, "success");
  };

  const handleRemarkChange = (roll: string, value: string) => {
    setRemarks((prev) =>
      prev.map((r) => (r.roll === roll ? { ...r, remark: value } : r))
    );
  };

  const handleCoScholasticChange = (roll: string, field: "art" | "pe" | "discipline", value: string) => {
    setRemarks((prev) =>
      prev.map((r) => (r.roll === roll ? { ...r, [field]: value } : r))
    );
  };

  const handleApplyRemarkPreset = (roll: string, text: string) => {
    handleRemarkChange(roll, text);
    setBankModalStudent(null);
    showToast(`Applied preset remark for Roll ${roll}`, "info");
  };

  const handleExportCSV = () => {
    const headers = ["Roll", "Student Name", "PT (/10)", "NB (/5)", "SE (/5)", "HY (/80)", "Total (/100)", "Grade"];
    const rows = marks.map((m) => {
      const ptNum = parseFloat(m.pt);
      const nbNum = parseFloat(m.nb);
      const seNum = parseFloat(m.se);
      const hyNum = parseFloat(m.hy);
      let total = "—";
      let grade = "—";
      if (!isNaN(hyNum) && hyNum <= 80) {
        const sum = (!isNaN(ptNum) ? ptNum : 0) + (!isNaN(nbNum) ? nbNum : 0) + (!isNaN(seNum) ? seNum : 0) + hyNum;
        total = sum.toString();
        grade = calculateGrade(sum);
      }
      return [m.roll, `"${m.name}"`, m.pt, m.nb, m.se, m.hy, total, grade].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Class_8B_Science_HalfYearly_Gradesheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded Class 8-B Gradesheet CSV", "success");
  };

  const handleImportExcel = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      showToast("Excel spreadsheet imported successfully. 38 student scores refreshed.", "success");
    }, 1200);
  };

  const handleSubmitMarks = () => {
    if (validationErrors.length > 0) {
      showToast(
        `Cannot submit: Please fix ${validationErrors.length} entry exceeding maximum marks (e.g. Roll ${validationErrors[0].roll} ${validationErrors[0].name}).`,
        "error"
      );
      return;
    }
    showToast("Marks submitted to Examination Coordinator for audit and report card generation.", "success");
  };

  const handleSubmitRemarks = () => {
    const pendingCount = remarks.length - computedMetrics.completedRemarksCount;
    if (pendingCount > 0) {
      showToast(`Submitted ${computedMetrics.completedRemarksCount} remarks. ${pendingCount} pending can be filled before 16 Oct.`, "info");
    } else {
      showToast("All 38 class teacher remarks submitted successfully!", "success");
    }
  };

  // Avatar helper
  const getAvatarBg = (roll: string) => {
    const n = parseInt(roll, 10) || 1;
    const colors = [
      "bg-teal-50 text-teal-800 border-teal-200/80",
      "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      "bg-blue-50 text-blue-800 border-blue-200/80",
      "bg-indigo-50 text-indigo-800 border-indigo-200/80",
      "bg-slate-100 text-slate-700 border-slate-300",
      "bg-cyan-50 text-cyan-800 border-cyan-200/80",
    ];
    return colors[n % colors.length];
  };

  return (
    <>
      {/* Floating Status Pop Notification (Fixed Overlay - completely outside normal document flow, no page shift/jump) */}
      {showStatusToast && (
        <aside
          aria-label="Mark validation notification"
          className="fixed top-20 right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-3rem)] pointer-events-none transition-all duration-200"
        >
          <div className="pointer-events-auto">
            {validationErrors.length > 0 ? (
              <div className="bg-amber-50/95 backdrop-blur-md border border-amber-300 rounded-card p-3.5 shadow-xl flex items-start justify-between gap-3 text-xs text-amber-950">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <FiAlertTriangle size={15} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-900">Mark Ceiling Warning</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                        {validationErrors.length} Issue{validationErrors.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="leading-snug text-ink-secondary text-[11.5px]">
                      <strong>Roll {validationErrors[0].roll} {validationErrors[0].name}</strong> entered{" "}
                      <strong className="text-rose-700">{validationErrors[0].val}</strong> for {validationErrors[0].field} (max {validationErrors[0].max}).
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleFixValidation(
                            validationErrors[0].roll,
                            validationErrors[0].field,
                            validationErrors[0].max
                          )
                        }
                        className="px-2.5 py-1 rounded bg-amber-700 hover:bg-amber-800 text-white font-semibold text-[11px] cursor-pointer shadow-2xs transition-colors"
                      >
                        Auto-Clamp to {validationErrors[0].max}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStatusToast(false)}
                  className="p-1 rounded text-amber-700 hover:text-amber-900 hover:bg-amber-200/50 transition-colors shrink-0 cursor-pointer"
                  title="Dismiss"
                  aria-label="Dismiss notification"
                >
                  <MdClose size={16} />
                </button>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-md border border-emerald-300 rounded-card p-3 shadow-xl flex items-center justify-between gap-3 text-xs text-emerald-950">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <MdCheckCircle size={17} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-emerald-900">CBSE Validated</span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                        Verified
                      </span>
                    </div>
                    <span className="text-[11.5px] text-ink-secondary leading-snug">
                      All mark entries are validated and within CBSE maximum caps. Autosaved at 10:42 am.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStatusToast(false)}
                  className="p-1 rounded text-ink-muted hover:text-ink hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                  title="Dismiss"
                  aria-label="Dismiss notification"
                >
                  <MdClose size={16} />
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      <div className="flex flex-col gap-4 w-full animate-fadeIn font-sans pb-12">
      {/* ================= HEADER SECTION (SINGLE LINE ON LAPTOP) ================= */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex flex-col gap-0.5 min-w-0">
          {/* Breadcrumb */}
          <div className="text-xs sm:text-[13px] text-ink-secondary flex items-center gap-1.5 mb-0.5 truncate">
            <Link to="/teacher/dashboard" className="hover:text-primary transition-colors shrink-0">
              Teacher Panel
            </Link>
            <span>›</span>
            <span className="text-ink shrink-0">Marks & Remarks</span>
            <span>›</span>
            <span className="text-primary font-semibold truncate">Half-Yearly Term 1</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              Marks & Remarks Gradebook
            </h1>
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Enter periodic test, notebook, subject enrichment & half-yearly scores · Class teacher co-scholastic remarks
          </div>
        </div>

        {/* Top-Right Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleImportExcel}
            disabled={isImporting}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5"
            title="Import scores from pre-formatted school excel sheet"
          >
            <MdFileUpload size={15} className="text-primary" />
            <span>{isImporting ? "Importing..." : "Import Excel"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Export marks register to CSV"
          >
            <MdFileDownload size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ================= SECTION SELECTOR & TABS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-2">
        {/* Class Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
            Class:
          </span>
          <div className="relative">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              aria-label="Select Class & Subject"
              className="h-9 pl-3 pr-8 rounded-control border border-line-input bg-surface-subtle text-xs font-semibold text-ink focus:border-primary focus:outline-none shadow-2xs cursor-pointer appearance-none min-w-[220px]"
            >
              <option value="8-B Science · Draft">Class 8-B · Science (Draft)</option>
              <option value="8-A Science · Submitted">Class 8-A · Science (Submitted)</option>
              <option value="7-A Science · Submitted">Class 7-A · Science (Submitted)</option>
              <option value="7-B Science · Submitted">Class 7-B · Science (Submitted)</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* Tab Switcher: Marks Entry vs Remarks */}
        <div className="flex items-center gap-1.5 bg-surface-subtle p-1 rounded-control border border-line self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("marks")}
            className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "marks"
                ? "bg-primary text-white shadow-xs"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            <MdCalculate size={15} />
            <span>Marks Entry ({marks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("remarks")}
            className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "remarks"
                ? "bg-primary text-white shadow-xs"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            <MdAutoAwesome size={15} />
            <span>Class Teacher Remarks ({computedMetrics.completedRemarksCount}/{remarks.length})</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: MARKS ENTRY ================= */}
      {activeTab === "marks" && (
        <div className="space-y-4">
          {/* Table Toolbar */}
          <div className="p-3 bg-surface border border-line rounded-card shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-ink-secondary">
              <span className="font-semibold text-ink">Assessment Weightage:</span>
              <span className="px-2 py-0.5 rounded bg-surface-subtle border border-line">PT: 10</span>
              <span className="px-2 py-0.5 rounded bg-surface-subtle border border-line">NB: 5</span>
              <span className="px-2 py-0.5 rounded bg-surface-subtle border border-line">SE: 5</span>
              <span className="px-2 py-0.5 rounded bg-surface-subtle border border-line">HY: 80</span>
              <span className="px-2 py-0.5 rounded bg-primary-tint text-primary-dark font-bold border border-primary-tint-border">
                Total: 100
              </span>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs ml-auto">
              <MdSearch
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or roll..."
                className="w-full pl-8 pr-7 h-9 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary/60 focus:bg-surface focus:border-primary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Gradebook Table */}
          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-line-row bg-surface-subtle text-caption font-semibold text-ink-secondary">
                    <th className="py-2.5 px-4 w-16">Roll</th>
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-3 w-24 text-center">PT /10</th>
                    <th className="py-2.5 px-3 w-24 text-center">NB /5</th>
                    <th className="py-2.5 px-3 w-24 text-center">SE /5</th>
                    <th className="py-2.5 px-3 w-28 text-center">HY /80</th>
                    <th className="py-2.5 px-4 text-right w-24">Total /100</th>
                    <th className="py-2.5 px-4 text-center w-24">Grade</th>
                    <th className="py-2.5 px-3 text-right w-16">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row text-small">
                  {paginatedMarks.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-ink-secondary">
                        No students found matching your search.
                      </td>
                    </tr>
                  ) : (
                    paginatedMarks.map((m) => {
                      const ptNum = parseFloat(m.pt);
                      const nbNum = parseFloat(m.nb);
                      const seNum = parseFloat(m.se);
                      const hyNum = parseFloat(m.hy);

                      const isPtInvalid = !isNaN(ptNum) && ptNum > 10;
                      const isNbInvalid = !isNaN(nbNum) && nbNum > 5;
                      const isSeInvalid = !isNaN(seNum) && seNum > 5;
                      const isHyInvalid = !isNaN(hyNum) && hyNum > 80;

                      let totalStr = "—";
                      let gradeStr = "—";

                      if (!isHyInvalid && !isPtInvalid && !isNbInvalid && !isSeInvalid) {
                        if (m.hy === "ML" || m.pt === "ML") {
                          totalStr = "ML";
                          gradeStr = "—";
                        } else if (m.hy === "AB" || m.pt === "AB") {
                          totalStr = "AB";
                          gradeStr = "E";
                        } else {
                          const validPt = !isNaN(ptNum) ? ptNum : 0;
                          const validNb = !isNaN(nbNum) ? nbNum : 0;
                          const validSe = !isNaN(seNum) ? seNum : 0;
                          const validHy = !isNaN(hyNum) ? hyNum : 0;
                          const sum = validPt + validNb + validSe + validHy;
                          totalStr = sum.toString();
                          gradeStr = calculateGrade(sum);
                        }
                      }

                      return (
                        <tr
                          key={m.roll}
                          className={`hover:bg-slate-50/60 transition-colors ${
                            isHyInvalid || isPtInvalid || isNbInvalid || isSeInvalid ? "bg-rose-50/30" : ""
                          }`}
                        >
                          {/* Roll */}
                          <td className="py-2.5 px-4 font-mono font-semibold text-ink-secondary">
                            {m.roll}
                          </td>

                          {/* Student Name & Avatar */}
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${getAvatarBg(
                                  m.roll
                                )}`}
                              >
                                {m.name.slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-semibold text-ink">{m.name}</span>
                            </div>
                          </td>

                          {/* PT /10 */}
                          <td className="py-2 px-3 text-center">
                            <input
                              aria-label={`Periodic Test for ${m.name}`}
                              value={m.pt}
                              onChange={(e) => handleMarkChange(m.roll, "pt", e.target.value)}
                              className={`w-16 h-8 text-center rounded-control font-mono text-xs font-semibold focus:outline-none transition-colors ${
                                isPtInvalid
                                  ? "border-2 border-rose-500 bg-rose-50 text-rose-900"
                                  : "border border-line-input bg-surface text-ink focus:border-primary"
                              }`}
                            />
                          </td>

                          {/* NB /5 */}
                          <td className="py-2 px-3 text-center">
                            <input
                              aria-label={`Notebook for ${m.name}`}
                              value={m.nb}
                              onChange={(e) => handleMarkChange(m.roll, "nb", e.target.value)}
                              className={`w-16 h-8 text-center rounded-control font-mono text-xs font-semibold focus:outline-none transition-colors ${
                                isNbInvalid
                                  ? "border-2 border-rose-500 bg-rose-50 text-rose-900"
                                  : "border border-line-input bg-surface text-ink focus:border-primary"
                              }`}
                            />
                          </td>

                          {/* SE /5 */}
                          <td className="py-2 px-3 text-center">
                            <input
                              aria-label={`Subject Enrichment for ${m.name}`}
                              value={m.se}
                              onChange={(e) => handleMarkChange(m.roll, "se", e.target.value)}
                              className={`w-16 h-8 text-center rounded-control font-mono text-xs font-semibold focus:outline-none transition-colors ${
                                isSeInvalid
                                  ? "border-2 border-rose-500 bg-rose-50 text-rose-900"
                                  : "border border-line-input bg-surface text-ink focus:border-primary"
                              }`}
                            />
                          </td>

                          {/* HY /80 */}
                          <td className="py-2 px-3 text-center">
                            <input
                              aria-label={`Half-Yearly for ${m.name}`}
                              value={m.hy}
                              onChange={(e) => handleMarkChange(m.roll, "hy", e.target.value)}
                              className={`w-20 h-8 text-center rounded-control font-mono text-xs font-bold focus:outline-none transition-colors ${
                                isHyInvalid
                                  ? "border-2 border-rose-500 bg-rose-100 text-rose-900 animate-pulse"
                                  : "border border-line-input bg-surface text-ink focus:border-primary"
                              }`}
                            />
                          </td>

                          {/* Total */}
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-ink">
                            {totalStr}
                          </td>

                          {/* Grade Badge */}
                          <td className="py-2.5 px-4 text-center">
                            <span
                              className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${getGradeBadge(
                                gradeStr
                              )}`}
                            >
                              {gradeStr}
                            </span>
                          </td>

                          {/* Action Button */}
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => setPreviewStudentRoll(m.roll)}
                              className="text-ink-secondary hover:text-primary transition-colors p-1"
                              title="View student report card summary"
                            >
                              <MdVisibility size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="p-3 px-4 border-t border-line-row bg-surface-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-ink-secondary">
                Showing <strong>{(activePage - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(activePage * pageSize, filteredMarks.length)}</strong> of{" "}
                <strong>{filteredMarks.length}</strong> students
              </div>

              <div className="flex items-center gap-3 ml-auto flex-wrap">
                <div className="flex items-center gap-1.5 text-ink-secondary">
                  <span className="text-[11px]">Rows per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-7 px-2 rounded-control border border-line-input bg-surface text-ink text-xs font-semibold focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={38}>All (38)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={activePage <= 1}
                    className="h-7 w-7 rounded-control border border-line-input bg-surface hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-surface text-ink flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                  >
                    <MdChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-7 min-w-[28px] px-1.5 rounded-control text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                        activePage === pageNum
                          ? "bg-primary border-primary text-white font-bold"
                          : "bg-surface border-line-input text-ink hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={activePage >= totalPages}
                    className="h-7 w-7 rounded-control border border-line-input bg-surface hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-surface text-ink flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                  >
                    <MdChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Action Card */}
          <div className="p-4 bg-surface border border-line rounded-card shadow-xs flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-ink-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Autosaved draft · Editable until tomorrow 5:00 pm cut-off</span>
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={() => showToast("Draft saved to cloud", "info")}
                className="px-4 py-2 rounded-control border border-line-input bg-surface hover:bg-slate-50 text-ink text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={handleSubmitMarks}
                disabled={validationErrors.length > 0}
                className="px-6 py-2 rounded-control bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: REMARKS (CLASS TEACHER) ================= */}
      {activeTab === "remarks" && (
        <div className="space-y-4">
          {/* Remarks Toolbar */}
          <div className="p-3.5 bg-surface border border-line rounded-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider mr-1">
                Filter:
              </span>
              <button
                type="button"
                onClick={() => setRemarkStatusFilter("ALL")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  remarkStatusFilter === "ALL"
                    ? "bg-ink text-white shadow-xs"
                    : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
                }`}
              >
                All ({remarks.length})
              </button>
              <button
                type="button"
                onClick={() => setRemarkStatusFilter("DONE")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  remarkStatusFilter === "DONE"
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
                }`}
              >
                Completed ({computedMetrics.completedRemarksCount})
              </button>
              <button
                type="button"
                onClick={() => setRemarkStatusFilter("PENDING")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  remarkStatusFilter === "PENDING"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
                }`}
              >
                Pending ({remarks.length - computedMetrics.completedRemarksCount})
              </button>
            </div>

            {/* Search */}
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <MdSearch
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or roll..."
                className="w-full pl-8 pr-7 h-8 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary/60 focus:bg-surface focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Remarks List */}
          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="divide-y divide-line-row">
              {paginatedRemarks.length === 0 ? (
                <div className="p-8 text-center text-ink-secondary text-small">
                  No students match your filter.
                </div>
              ) : (
                paginatedRemarks.map((r) => {
                  const isDone = r.remark.trim().length > 0;

                  return (
                    <div
                      key={r.roll}
                      className="grid grid-cols-1 md:grid-cols-[200px_1fr_240px] gap-4 items-start p-4 hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Left: Student Info & Band */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-ink-secondary">
                            #{r.roll}
                          </span>
                          <span className="font-semibold text-sm text-ink">{r.name}</span>
                        </div>
                        <span className="text-xs font-bold text-primary">{r.band}</span>
                        <button
                          type="button"
                          onClick={() => setBankModalStudent(r)}
                          className="text-xs text-primary hover:underline font-semibold mt-1 inline-flex items-center gap-1 text-left cursor-pointer"
                        >
                          <MdAutoAwesome size={13} /> Suggest from Bank
                        </button>
                      </div>

                      {/* Center: Remark Input Textarea */}
                      <div className="flex flex-col gap-1 w-full">
                        <textarea
                          rows={2}
                          value={r.remark}
                          placeholder="[Choose from remark bank or enter personalized classroom observation]"
                          onChange={(e) => handleRemarkChange(r.roll, e.target.value)}
                          className={`p-2.5 rounded-control border text-xs text-ink leading-relaxed focus:border-primary focus:outline-none resize-none transition-colors ${
                            isDone ? "border-line-input bg-surface" : "border-dashed border-amber-300 bg-amber-50/20"
                          }`}
                        />
                        <div className="flex justify-between items-center text-[11px] text-ink-secondary px-1">
                          <span>{r.remark.length} characters</span>
                          {isDone ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                              <MdCheck size={12} /> Ready
                            </span>
                          ) : (
                            <span className="text-amber-700 font-semibold">Pending</span>
                          )}
                        </div>
                      </div>

                      {/* Right: Co-Scholastic Assessment (Art, PE, Discipline) */}
                      <div className="flex flex-col gap-1.5 bg-surface-subtle p-2.5 rounded-control border border-line">
                        <span className="text-[10px] font-bold text-ink-secondary uppercase tracking-wider">
                          Co-Scholastic Grades
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {/* Art */}
                          <label className="flex flex-col gap-0.5 text-[11px] font-semibold text-ink">
                            <span className="truncate">Art</span>
                            <select
                              value={r.art}
                              onChange={(e) => handleCoScholasticChange(r.roll, "art", e.target.value)}
                              className="h-7 px-1.5 rounded border border-line-input bg-surface text-xs font-bold text-center cursor-pointer focus:outline-none focus:border-primary"
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="—">—</option>
                            </select>
                          </label>

                          {/* PE */}
                          <label className="flex flex-col gap-0.5 text-[11px] font-semibold text-ink">
                            <span className="truncate">PE</span>
                            <select
                              value={r.pe}
                              onChange={(e) => handleCoScholasticChange(r.roll, "pe", e.target.value)}
                              className="h-7 px-1.5 rounded border border-line-input bg-surface text-xs font-bold text-center cursor-pointer focus:outline-none focus:border-primary"
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="—">—</option>
                            </select>
                          </label>

                          {/* Discipline */}
                          <label className="flex flex-col gap-0.5 text-[11px] font-semibold text-ink">
                            <span className="truncate">Discipline</span>
                            <select
                              value={r.discipline}
                              onChange={(e) => handleCoScholasticChange(r.roll, "discipline", e.target.value)}
                              className="h-7 px-1.5 rounded border border-line-input bg-surface text-xs font-bold text-center cursor-pointer focus:outline-none focus:border-primary"
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="—">—</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Remarks Pagination */}
            <div className="p-3 px-4 border-t border-line-row bg-surface-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-ink-secondary">
                Showing <strong>{(activePage - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(activePage * pageSize, filteredRemarks.length)}</strong> of{" "}
                <strong>{filteredRemarks.length}</strong> students
              </div>

              <div className="flex items-center gap-3 ml-auto flex-wrap">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={activePage <= 1}
                    className="h-7 w-7 rounded-control border border-line-input bg-surface hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-surface text-ink flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                  >
                    <MdChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-7 min-w-[28px] px-1.5 rounded-control text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                        activePage === pageNum
                          ? "bg-primary border-primary text-white font-bold"
                          : "bg-surface border-line-input text-ink hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={activePage >= totalPages}
                    className="h-7 w-7 rounded-control border border-line-input bg-surface hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-surface text-ink flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                  >
                    <MdChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Action Card for Remarks */}
          <div className="p-4 bg-surface border border-line rounded-card shadow-xs flex flex-wrap justify-between items-center gap-4">
            <span className="text-xs text-ink-secondary">
              Pick from the remark bank for the student's performance band, then personalize. Attendance is linked automatically.
            </span>

            <button
              type="button"
              onClick={handleSubmitRemarks}
              className="px-6 py-2 rounded-control bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Submit All Remarks
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: REMARK BANK SUGGESTION ================= */}
      {bankModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface rounded-card border border-line shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-line-row bg-surface-head flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-ink text-base">
                  Remark Bank for {bankModalStudent.name}
                </h3>
                <p className="text-xs text-ink-secondary">
                  Roll #{bankModalStudent.roll} · {bankModalStudent.band}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBankModalStudent(null)}
                className="w-8 h-8 rounded-control text-ink-secondary hover:text-ink hover:bg-surface-subtle flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
                Recommended for {bankModalStudent.band}:
              </span>

              <div className="space-y-2">
                {(REMARK_BANK[bankModalStudent.band.replace("Band ", "")] || REMARK_BANK["B1"]).map(
                  (template, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-control border border-line hover:border-primary hover:bg-primary-tint/20 transition-all flex flex-col justify-between gap-2.5 group"
                    >
                      <p className="text-xs text-ink leading-relaxed">{template}</p>
                      <button
                        type="button"
                        onClick={() => handleApplyRemarkPreset(bankModalStudent.roll, template)}
                        className="self-end px-3 py-1 rounded bg-primary text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs hover:bg-primary-dark"
                      >
                        Apply this remark
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="p-3 px-4 border-t border-line-row bg-surface-subtle flex justify-end">
              <button
                type="button"
                onClick={() => setBankModalStudent(null)}
                className="px-4 py-1.5 rounded-control border border-line-input text-ink text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: STUDENT REPORT CARD PREVIEW ================= */}
      {previewStudentRoll && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          {(() => {
            const studentMark = marks.find((m) => m.roll === previewStudentRoll);
            const studentRemark = remarks.find((r) => r.roll === previewStudentRoll);
            if (!studentMark) return null;

            const pt = parseFloat(studentMark.pt) || 0;
            const nb = parseFloat(studentMark.nb) || 0;
            const se = parseFloat(studentMark.se) || 0;
            const hy = parseFloat(studentMark.hy) || 0;
            const total = pt + nb + se + hy;
            const grade = calculateGrade(total);

            return (
              <div className="bg-surface rounded-card border border-line shadow-xl max-w-md w-full overflow-hidden">
                <div className="p-4 border-b border-line-row bg-surface-head flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-ink text-base">
                      {studentMark.name} · Report Card Summary
                    </h3>
                    <p className="text-xs text-ink-secondary">
                      Roll #{studentMark.roll} · Class 8-B · Term 1
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewStudentRoll(null)}
                    className="w-8 h-8 rounded-control text-ink-secondary hover:text-ink hover:bg-surface-subtle flex items-center justify-center text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {/* Total & Grade Banner */}
                  <div className="p-3.5 rounded-control bg-primary-tint border border-primary-tint-border flex items-center justify-between">
                    <div>
                      <span className="text-xs text-primary-dark font-medium">Half-Yearly Score</span>
                      <div className="text-2xl font-bold font-mono text-ink">
                        {total}{" "}
                        <span className="text-xs font-normal text-ink-secondary">/ 100</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-primary-dark font-medium">Final Grade</span>
                      <div className="text-xl font-bold text-primary font-mono">{grade}</div>
                    </div>
                  </div>

                  {/* Component Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-ink-secondary uppercase tracking-wider text-[10px]">
                      Component Breakdown
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded bg-surface-subtle border border-line">
                        <span className="text-[10px] text-ink-secondary block">PT /10</span>
                        <strong className="text-sm font-mono text-ink">{studentMark.pt}</strong>
                      </div>
                      <div className="p-2 rounded bg-surface-subtle border border-line">
                        <span className="text-[10px] text-ink-secondary block">NB /5</span>
                        <strong className="text-sm font-mono text-ink">{studentMark.nb}</strong>
                      </div>
                      <div className="p-2 rounded bg-surface-subtle border border-line">
                        <span className="text-[10px] text-ink-secondary block">SE /5</span>
                        <strong className="text-sm font-mono text-ink">{studentMark.se}</strong>
                      </div>
                      <div className="p-2 rounded bg-surface-subtle border border-line">
                        <span className="text-[10px] text-ink-secondary block">HY /80</span>
                        <strong className="text-sm font-mono text-ink">{studentMark.hy}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Remark */}
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-ink-secondary uppercase tracking-wider text-[10px]">
                      Class Teacher Remark
                    </span>
                    <div className="p-2.5 rounded bg-surface-subtle border border-line text-ink leading-relaxed">
                      {studentRemark?.remark || (
                        <span className="italic text-ink-secondary">Remark pending...</span>
                      )}
                    </div>
                  </div>

                  {/* Co-Scholastic */}
                  {studentRemark && (
                    <div className="flex justify-between items-center text-xs p-2.5 rounded bg-surface-subtle border border-line">
                      <span>Art: <strong>{studentRemark.art}</strong></span>
                      <span>PE: <strong>{studentRemark.pe}</strong></span>
                      <span>Discipline: <strong>{studentRemark.discipline}</strong></span>
                    </div>
                  )}
                </div>

                <div className="p-3 px-4 border-t border-line-row bg-surface-subtle flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPreviewStudentRoll(null)}
                    className="px-4 py-1.5 rounded-control border border-line-input text-ink text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
    </>
  );
};

export default TeacherMarksEntry;
