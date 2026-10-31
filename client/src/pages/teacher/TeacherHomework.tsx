import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import {
  MdMenuBook,
  MdCheckCircle,
  MdWarningAmber,
  MdSearch,
  MdEdit,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdAdd,
  MdNotificationsActive,
  MdAttachFile,
  MdTrendingUp,
  MdScience,
  MdVisibility,
} from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export type SubmissionStatus = "Checked" | "Submitted" | "Not submitted" | "Redo";

export interface RequirementSubmission {
  student: string;
  detail: string;
  status: SubmissionStatus;
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  roll: string;
  classSection: string;
  homeworkId: string;
  homeworkTitle: string;
  submittedAt: string | null;
  status: SubmissionStatus;
  attachmentName?: string;
  teacherRemarks?: string;
}

export interface HomeworkAssignment {
  id: string;
  classSection: string;
  subject: string;
  topic: string;
  description: string;
  postedDate: string;
  dueDate: string;
  submissionType: "Photo in app" | "Notebook only";
  attachmentName?: string;
  totalStudents: number;
  submittedCount: number;
  checkedCount: number;
  redoCount: number;
}

export interface ChapterSyllabus {
  id: string;
  classSection: string;
  subject: string;
  chapterNumber: number;
  title: string;
  totalPeriods: number;
  completedPeriods: number;
  status: "Completed" | "In Progress" | "Planned";
  hasLabWork: boolean;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  notes?: string;
}

// ==========================================
// INITIAL DATA
// ==========================================
const REQUIREMENT_INITIAL_SUBMISSIONS: RequirementSubmission[] = [
  { student: "Aanya Bhatt", detail: "Photo · 8 Oct 7:40 pm", status: "Checked" },
  { student: "Advik Sharma", detail: "Photo · 8 Oct 8:10 pm", status: "Submitted" },
  { student: "Arnav Saini", detail: "—", status: "Not submitted" },
  { student: "Diya Tak", detail: "Photo · 9 Oct 6:55 am", status: "Redo" },
  { student: "Harshita Jain", detail: "Photo · 8 Oct 9:02 pm", status: "Submitted" },
  { student: "Kabir Meena", detail: "—", status: "Not submitted" },
];

const REQUIREMENT_SYLLABUS_PROGRESS = [
  { classSubject: "7-A Science", percent: 49, target: 55, isBehind: true },
  { classSubject: "7-B Science", percent: 47, target: 55, isBehind: true },
  { classSubject: "8-A Science", percent: 51, target: 55, isBehind: false },
  { classSubject: "8-B Science", percent: 52, target: 55, isBehind: false },
];

const INITIAL_ASSIGNMENTS: HomeworkAssignment[] = [
  {
    id: "HW-101",
    classSection: "7-A Science",
    subject: "Science",
    topic: "Ch. 6 Combustion and flame — zones of a flame",
    description: "Draw and label the three distinct zones of a candle flame. Answer Question 3 and Question 4 from NCERT textbook exercise.",
    postedDate: "2026-10-13",
    dueDate: "2026-10-15",
    submissionType: "Photo in app",
    attachmentName: "Worksheet_Ch6_Flame.pdf",
    totalStudents: 40,
    submittedCount: 34,
    checkedCount: 28,
    redoCount: 2,
  },
  {
    id: "HW-102",
    classSection: "8-B Science",
    subject: "Science",
    topic: "Ch. 5 Coal and Petroleum — fractional distillation",
    description: "Prepare a flow chart of fractional distillation of petroleum with boiling ranges and commercial applications of each fraction.",
    postedDate: "2026-10-12",
    dueDate: "2026-10-14",
    submissionType: "Notebook only",
    totalStudents: 38,
    submittedCount: 38,
    checkedCount: 35,
    redoCount: 3,
  },
  {
    id: "HW-103",
    classSection: "8-A Science",
    subject: "Science",
    topic: "Ch. 4 Materials: Metals and Non-Metals — chemical reactions",
    description: "Write balanced word equations for reactions of metals with dilute acids and bases. Solve worksheet section B.",
    postedDate: "2026-10-13",
    dueDate: "2026-10-16",
    submissionType: "Photo in app",
    attachmentName: "Metals_Reactions_Sheet.png",
    totalStudents: 42,
    submittedCount: 30,
    checkedCount: 25,
    redoCount: 1,
  },
  {
    id: "HW-104",
    classSection: "7-B Science",
    subject: "Science",
    topic: "Ch. 3 Synthetic Fibres and Plastics — characteristics comparison",
    description: "Compare thermoplastic and thermosetting polymers with 3 real-world examples each. Write in science fair notebook.",
    postedDate: "2026-10-11",
    dueDate: "2026-10-14",
    submissionType: "Notebook only",
    totalStudents: 39,
    submittedCount: 25,
    checkedCount: 18,
    redoCount: 2,
  },
];

const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: "SUB-01",
    studentName: "Aanya Bhatt",
    roll: "01",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: "8 Oct, 7:40 pm",
    status: "Checked",
    attachmentName: "IMG_Aanya_Ch6_Flame.jpg",
    teacherRemarks: "Very neat labeling of innermost and luminous zones. Good work!",
  },
  {
    id: "SUB-02",
    studentName: "Advik Sharma",
    roll: "02",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: "8 Oct, 8:10 pm",
    status: "Submitted",
    attachmentName: "Advik_Science_Flame.jpg",
  },
  {
    id: "SUB-03",
    studentName: "Arnav Saini",
    roll: "03",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: null,
    status: "Not submitted",
  },
  {
    id: "SUB-04",
    studentName: "Diya Tak",
    roll: "04",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: "9 Oct, 6:55 am",
    status: "Redo",
    attachmentName: "Diya_flame_sketch.png",
    teacherRemarks: "Please re-draw Q4 explanation with correct temperature annotations.",
  },
  {
    id: "SUB-05",
    studentName: "Harshita Jain",
    roll: "05",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: "8 Oct, 9:02 pm",
    status: "Submitted",
    attachmentName: "Harshita_Flame_HW.jpg",
  },
  {
    id: "SUB-06",
    studentName: "Kabir Meena",
    roll: "06",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: null,
    status: "Not submitted",
  },
  {
    id: "SUB-07",
    studentName: "Lavanya Goyal",
    roll: "07",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: "9 Oct, 7:15 am",
    status: "Checked",
    attachmentName: "Lavanya_Zones_Flame.pdf",
    teacherRemarks: "Excellent diagram and temperature gradient notes.",
  },
  {
    id: "SUB-08",
    studentName: "Manan Khandelwal",
    roll: "08",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: null,
    status: "Not submitted",
  },
  {
    id: "SUB-09",
    studentName: "Pari Rathore",
    roll: "09",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: "9 Oct, 8:00 am",
    status: "Checked",
    attachmentName: "Pari_Science_Q3.jpg",
  },
  {
    id: "SUB-10",
    studentName: "Reyansh Singhal",
    roll: "10",
    classSection: "7-A Science",
    homeworkId: "HW-101",
    homeworkTitle: "Ch. 6 Combustion and flame",
    submittedAt: "9 Oct, 8:40 am",
    status: "Submitted",
    attachmentName: "Reyansh_Ch6.pdf",
  },
  {
    id: "SUB-11",
    studentName: "Aarav Patel",
    roll: "01",
    classSection: "8-B Science",
    homeworkId: "HW-102",
    homeworkTitle: "Ch. 5 Coal and Petroleum",
    submittedAt: "13 Oct, 3:30 pm",
    status: "Checked",
  },
  {
    id: "SUB-12",
    studentName: "Bhavya Gupta",
    roll: "02",
    classSection: "8-B Science",
    homeworkId: "HW-102",
    homeworkTitle: "Ch. 5 Coal and Petroleum",
    submittedAt: "13 Oct, 4:00 pm",
    status: "Checked",
  },
];

const INITIAL_SYLLABUS: ChapterSyllabus[] = [
  {
    id: "SYL-7A-01",
    classSection: "7-A Science",
    subject: "Science",
    chapterNumber: 1,
    title: "Nutrition in Plants",
    totalPeriods: 8,
    completedPeriods: 8,
    status: "Completed",
    hasLabWork: true,
    targetCompletionDate: "2026-07-25",
    actualCompletionDate: "2026-07-24",
    notes: "Stomata slide observation completed in Biology lab.",
  },
  {
    id: "SYL-7A-02",
    classSection: "7-A Science",
    subject: "Science",
    chapterNumber: 2,
    title: "Nutrition in Animals",
    totalPeriods: 10,
    completedPeriods: 10,
    status: "Completed",
    hasLabWork: false,
    targetCompletionDate: "2026-08-18",
    actualCompletionDate: "2026-08-19",
  },
  {
    id: "SYL-7A-03",
    classSection: "7-A Science",
    subject: "Science",
    chapterNumber: 3,
    title: "Heat and Temperature",
    totalPeriods: 9,
    completedPeriods: 9,
    status: "Completed",
    hasLabWork: true,
    targetCompletionDate: "2026-09-08",
    actualCompletionDate: "2026-09-06",
  },
  {
    id: "SYL-7A-04",
    classSection: "7-A Science",
    subject: "Science",
    chapterNumber: 4,
    title: "Acids, Bases and Salts",
    totalPeriods: 9,
    completedPeriods: 9,
    status: "Completed",
    hasLabWork: true,
    targetCompletionDate: "2026-09-28",
    actualCompletionDate: "2026-09-29",
  },
  {
    id: "SYL-7A-05",
    classSection: "7-A Science",
    subject: "Science",
    chapterNumber: 5,
    title: "Physical and Chemical Changes",
    totalPeriods: 8,
    completedPeriods: 6,
    status: "In Progress",
    hasLabWork: true,
    targetCompletionDate: "2026-10-16",
    notes: "Rusting experiment underway in lab.",
  },
  {
    id: "SYL-7A-06",
    classSection: "7-A Science",
    subject: "Science",
    chapterNumber: 6,
    title: "Respiration in Organisms",
    totalPeriods: 8,
    completedPeriods: 0,
    status: "Planned",
    hasLabWork: true,
    targetCompletionDate: "2026-11-05",
  },
  {
    id: "SYL-7A-07",
    classSection: "7-A Science",
    subject: "Science",
    chapterNumber: 7,
    title: "Transportation in Animals and Plants",
    totalPeriods: 10,
    completedPeriods: 0,
    status: "Planned",
    hasLabWork: false,
    targetCompletionDate: "2026-11-25",
  },
  {
    id: "SYL-8B-01",
    classSection: "8-B Science",
    subject: "Science",
    chapterNumber: 1,
    title: "Crop Production and Management",
    totalPeriods: 9,
    completedPeriods: 9,
    status: "Completed",
    hasLabWork: false,
    targetCompletionDate: "2026-07-28",
    actualCompletionDate: "2026-07-26",
  },
  {
    id: "SYL-8B-02",
    classSection: "8-B Science",
    subject: "Science",
    chapterNumber: 2,
    title: "Microorganisms: Friend and Foe",
    totalPeriods: 10,
    completedPeriods: 10,
    status: "Completed",
    hasLabWork: true,
    targetCompletionDate: "2026-08-20",
    actualCompletionDate: "2026-08-18",
  },
  {
    id: "SYL-8B-03",
    classSection: "8-B Science",
    subject: "Science",
    chapterNumber: 3,
    title: "Coal and Petroleum",
    totalPeriods: 8,
    completedPeriods: 8,
    status: "Completed",
    hasLabWork: false,
    targetCompletionDate: "2026-09-15",
    actualCompletionDate: "2026-09-14",
  },
  {
    id: "SYL-8B-04",
    classSection: "8-B Science",
    subject: "Science",
    chapterNumber: 4,
    title: "Combustion and Flame",
    totalPeriods: 8,
    completedPeriods: 5,
    status: "In Progress",
    hasLabWork: true,
    targetCompletionDate: "2026-10-18",
  },
  {
    id: "SYL-8B-05",
    classSection: "8-B Science",
    subject: "Science",
    chapterNumber: 5,
    title: "Conservation of Plants and Animals",
    totalPeriods: 7,
    completedPeriods: 0,
    status: "Planned",
    hasLabWork: false,
    targetCompletionDate: "2026-11-10",
  },
];

const SYLLABUS_OVERVIEW = [
  { classSubject: "7-A Science", percent: 49, target: 55, isBehind: true, chaptersDone: 4, totalChapters: 12 },
  { classSubject: "7-B Science", percent: 47, target: 55, isBehind: true, chaptersDone: 4, totalChapters: 12 },
  { classSubject: "8-A Science", percent: 51, target: 55, isBehind: false, chaptersDone: 5, totalChapters: 13 },
  { classSubject: "8-B Science", percent: 52, target: 55, isBehind: false, chaptersDone: 5, totalChapters: 13 },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const TeacherHomework: React.FC = () => {
  const { showToast } = useToast();
  const location = useLocation();

  // Determine if Advanced View or Requirement View based on current URL path
  const isAdvancedView = location.pathname.includes("/advanced");

  // ==========================================
  // STATE FOR REQUIREMENT UI (Matching Screenshot)
  // ==========================================
  const [reqClass, setReqClass] = useState("7-A Science");
  const [reqTopic, setReqTopic] = useState("Ch. 6 Combustion and flame — zones of a flame");
  const [reqDescription, setReqDescription] = useState(
    "Draw and label the three zones of a candle flame. Answer Q 3 and Q 4."
  );
  const [reqDueDate, setReqDueDate] = useState("2026-10-15");
  const [reqSubmissionType, setReqSubmissionType] = useState("Photo in app");
  const [reqAttachment, setReqAttachment] = useState<string | null>(null);
  const [reqSubmissions, setReqSubmissions] = useState<RequirementSubmission[]>(REQUIREMENT_INITIAL_SUBMISSIONS);

  const handleReqPostHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const classNameOnly = reqClass.split(" ")[0];
    showToast(`Homework posted to ${classNameOnly} (40 students). Goes in 4:00 pm daily diary.`, "success");
  };

  const handleReqRemindNotSubmitted = () => {
    showToast("Sent reminder push notification to 6 parents with pending submissions", "info");
  };

  const handleReqFileAttach = () => {
    setReqAttachment("Worksheet_Ch6_Flame.pdf");
    showToast("Attached Worksheet_Ch6_Flame.pdf", "info");
  };

  // Toggle status in requirement list
  const handleToggleReqStatus = (index: number) => {
    const statuses: SubmissionStatus[] = ["Checked", "Submitted", "Not submitted", "Redo"];
    setReqSubmissions((prev) =>
      prev.map((sub, i) => {
        if (i !== index) return sub;
        const currentIdx = statuses.indexOf(sub.status);
        const nextStatus = statuses[(currentIdx + 1) % statuses.length];
        return { ...sub, status: nextStatus };
      })
    );
  };

  // ==========================================
  // STATE FOR ADVANCED MANAGEMENT UI
  // ==========================================
  const [activeTab, setActiveTab] = useState<"homework" | "submissions" | "syllabus">(() => {
    if (location.pathname.includes("syllabus")) return "syllabus";
    if (location.pathname.includes("submission") || location.pathname.includes("review")) return "submissions";
    return "homework";
  });

  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(INITIAL_ASSIGNMENTS);
  const [homeworkClassFilter, setHomeworkClassFilter] = useState("ALL");
  const [homeworkSearch, setHomeworkSearch] = useState("");

  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_SUBMISSIONS);
  const [submissionClassFilter, setSubmissionClassFilter] = useState("ALL");
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState<"ALL" | SubmissionStatus>("ALL");
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [selectedHomeworkId, setSelectedHomeworkId] = useState<string>("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [syllabusList, setSyllabusList] = useState<ChapterSyllabus[]>(INITIAL_SYLLABUS);
  const [syllabusClassFilter, setSyllabusClassFilter] = useState("7-A Science");

  // Modals state for advanced view
  const [showPostModal, setShowPostModal] = useState(false);
  const [newHwClass, setNewHwClass] = useState("7-A Science");
  const [newHwTopic, setNewHwTopic] = useState("");
  const [newHwDescription, setNewHwDescription] = useState("");
  const [newHwDueDate, setNewHwDueDate] = useState("2026-10-16");
  const [newHwSubmissionType, setNewHwSubmissionType] = useState<"Photo in app" | "Notebook only">("Photo in app");
  const [newHwAttachment, setNewHwAttachment] = useState<string | null>(null);

  const [editingSubmission, setEditingSubmission] = useState<StudentSubmission | null>(null);
  const [remarkText, setRemarkText] = useState("");

  const [editingChapter, setEditingChapter] = useState<ChapterSyllabus | null>(null);
  const [chapterStatusInput, setChapterStatusInput] = useState<"Completed" | "In Progress" | "Planned">("In Progress");
  const [chapterNotesInput, setChapterNotesInput] = useState("");

  // KPI Calculations
  const kpiMetrics = useMemo(() => {
    const totalAssigned = assignments.length;
    let totalExpectedSubmissions = 0;
    let totalCheckedSubmissions = 0;
    let totalPendingSubmissions = 0;

    assignments.forEach((a) => {
      totalExpectedSubmissions += a.totalStudents;
      totalCheckedSubmissions += a.checkedCount;
      totalPendingSubmissions += a.totalStudents - a.submittedCount;
    });

    const completionRate =
      totalExpectedSubmissions > 0
        ? ((totalCheckedSubmissions / totalExpectedSubmissions) * 100).toFixed(1)
        : "0.0";

    const behindCount = SYLLABUS_OVERVIEW.filter((s) => s.isBehind).length;

    return {
      totalAssigned,
      completionRate,
      totalCheckedSubmissions,
      totalPendingSubmissions,
      behindCount,
    };
  }, [assignments]);

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchClass = homeworkClassFilter === "ALL" || a.classSection === homeworkClassFilter;
      const matchSearch =
        a.topic.toLowerCase().includes(homeworkSearch.toLowerCase()) ||
        a.description.toLowerCase().includes(homeworkSearch.toLowerCase()) ||
        a.classSection.toLowerCase().includes(homeworkSearch.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [assignments, homeworkClassFilter, homeworkSearch]);

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchClass = submissionClassFilter === "ALL" || sub.classSection === submissionClassFilter;
      const matchHw = selectedHomeworkId === "ALL" || sub.homeworkId === selectedHomeworkId;
      const matchStatus = submissionStatusFilter === "ALL" || sub.status === submissionStatusFilter;
      const matchSearch =
        sub.studentName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
        sub.roll.includes(submissionSearch) ||
        sub.homeworkTitle.toLowerCase().includes(submissionSearch.toLowerCase());
      return matchClass && matchHw && matchStatus && matchSearch;
    });
  }, [submissions, submissionClassFilter, selectedHomeworkId, submissionStatusFilter, submissionSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [submissionClassFilter, selectedHomeworkId, submissionStatusFilter, submissionSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedSubmissions = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredSubmissions.slice(start, start + pageSize);
  }, [filteredSubmissions, activePage, pageSize]);

  const filteredSyllabus = useMemo(() => {
    return syllabusList.filter((s) => s.classSection === syllabusClassFilter);
  }, [syllabusList, syllabusClassFilter]);

  // Advanced Handlers
  const handlePostHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTopic.trim()) {
      showToast("Please enter a homework topic", "warn");
      return;
    }

    const newHw: HomeworkAssignment = {
      id: `HW-${Date.now().toString().slice(-3)}`,
      classSection: newHwClass,
      subject: "Science",
      topic: newHwTopic.trim(),
      description: newHwDescription.trim() || "Complete textbook questions and revise chapter notes.",
      postedDate: new Date().toISOString().split("T")[0],
      dueDate: newHwDueDate,
      submissionType: newHwSubmissionType,
      attachmentName: newHwAttachment || undefined,
      totalStudents: newHwClass.includes("7-A") ? 40 : newHwClass.includes("8-B") ? 38 : 42,
      submittedCount: 0,
      checkedCount: 0,
      redoCount: 0,
    };

    setAssignments([newHw, ...assignments]);
    setShowPostModal(false);
    setNewHwTopic("");
    setNewHwDescription("");
    setNewHwAttachment(null);
    showToast(
      `Homework posted to ${newHw.classSection} (${newHw.totalStudents} students). Sent in 4:00 pm daily diary.`,
      "success"
    );
  };

  const handleRemindPending = (classTarget?: string) => {
    const targetLabel = classTarget ? `${classTarget}` : "all classes";
    showToast(`Push reminder & SMS sent to parents with pending submissions for ${targetLabel}`, "info");
  };

  const handleUpdateSubmissionStatus = (id: string, newStatus: SubmissionStatus) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    showToast(`Submission marked as ${newStatus}`, "success");
  };

  const handleSaveRemark = () => {
    if (!editingSubmission) return;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === editingSubmission.id
          ? {
              ...s,
              teacherRemarks: remarkText.trim(),
              status: remarkText.trim() ? "Redo" : s.status,
            }
          : s
      )
    );
    showToast(`Remark saved for ${editingSubmission.studentName}`, "info");
    setEditingSubmission(null);
    setRemarkText("");
  };

  const handleSaveChapterProgress = () => {
    if (!editingChapter) return;
    setSyllabusList((prev) =>
      prev.map((c) =>
        c.id === editingChapter.id
          ? {
              ...c,
              status: chapterStatusInput,
              completedPeriods:
                chapterStatusInput === "Completed"
                  ? c.totalPeriods
                  : chapterStatusInput === "In Progress"
                  ? Math.floor(c.totalPeriods / 2)
                  : 0,
              notes: chapterNotesInput.trim() || c.notes,
              actualCompletionDate:
                chapterStatusInput === "Completed"
                  ? new Date().toISOString().split("T")[0]
                  : c.actualCompletionDate,
            }
          : c
      )
    );
    showToast(`Chapter progress updated for ${editingChapter.title}`, "success");
    setEditingChapter(null);
  };

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

  // Helper function to render Requirement View
  const renderRequirementUI = () => (
    <div className="flex flex-col gap-4 w-full animate-fadeIn font-sans pb-12">
      {/* ================= HEADER SECTION (SINGLE LINE ON LAPTOP) ================= */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="text-xs sm:text-[13px] text-ink-secondary flex items-center gap-1.5 mb-0.5 truncate">
            <Link to="/teacher/dashboard" className="hover:text-primary transition-colors shrink-0">
              Teacher Panel
            </Link>
            <span>›</span>
            <span className="text-ink-secondary shrink-0">Homework & syllabus</span>
            <span>›</span>
            <span className="text-primary font-semibold truncate">Requirement UI</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              Homework and syllabus
            </h1>
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Homework goes to parents in the daily diary at 4:00 pm.
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout from Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (span 5): Post Homework Card */}
        <section className="lg:col-span-5 bg-white border border-gray-200/85 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <h2 className="m-0 text-lg font-bold text-gray-900">Post homework</h2>

          <form onSubmit={handleReqPostHomework} className="flex flex-col gap-3.5">
            {/* Classes dropdown */}
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-800">
              <span>Classes</span>
              <div className="relative">
                <select
                  value={reqClass}
                  onChange={(e) => setReqClass(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 pr-8 rounded-xl border border-gray-300 bg-white text-sm text-gray-900 focus:border-[#134e4a] focus:ring-1 focus:ring-[#134e4a] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="7-A Science">7-A Science</option>
                  <option value="7-B Science">7-B Science</option>
                  <option value="8-A Science">8-A Science</option>
                  <option value="8-B Science">8-B Science</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                  ▼
                </div>
              </div>
            </label>

            {/* Topic dropdown */}
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-800">
              <span>Topic</span>
              <div className="relative">
                <select
                  value={reqTopic}
                  onChange={(e) => setReqTopic(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 pr-8 rounded-xl border border-gray-300 bg-white text-sm text-gray-900 focus:border-[#134e4a] focus:ring-1 focus:ring-[#134e4a] focus:outline-none appearance-none cursor-pointer truncate"
                >
                  <option value="Ch. 6 Combustion and flame — zones of a flame">
                    Ch. 6 Combustion and flame — zones of a flame
                  </option>
                  <option value="Ch. 5 Coal and Petroleum — distillation">
                    Ch. 5 Coal and Petroleum — distillation
                  </option>
                  <option value="Ch. 4 Materials: Metals and Non-Metals">
                    Ch. 4 Materials: Metals and Non-Metals
                  </option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                  ▼
                </div>
              </div>
            </label>

            {/* What to do textarea */}
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-800">
              <span>What to do</span>
              <textarea
                rows={3}
                required
                value={reqDescription}
                onChange={(e) => setReqDescription(e.target.value)}
                className="p-3 rounded-xl border border-gray-300 bg-white text-sm text-gray-900 focus:border-[#134e4a] focus:ring-1 focus:ring-[#134e4a] focus:outline-none resize-none leading-relaxed"
              />
            </label>

            {/* Due Date & Submission Mode in 2 Columns */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-800">
                <span>Due</span>
                <input
                  type="date"
                  value={reqDueDate}
                  onChange={(e) => setReqDueDate(e.target.value)}
                  className="min-h-[44px] px-3 rounded-xl border border-gray-300 bg-white text-sm text-gray-900 focus:border-[#134e4a] focus:ring-1 focus:ring-[#134e4a] focus:outline-none cursor-pointer"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-800">
                <span>Submission</span>
                <div className="relative">
                  <select
                    value={reqSubmissionType}
                    onChange={(e) => setReqSubmissionType(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 pr-8 rounded-xl border border-gray-300 bg-white text-sm text-gray-900 focus:border-[#134e4a] focus:ring-1 focus:ring-[#134e4a] focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="Photo in app">Photo in app</option>
                    <option value="Notebook only">Notebook only</option>
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                    ▼
                  </div>
                </div>
              </label>
            </div>

            {/* Attach PDF or image button */}
            {reqAttachment ? (
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-sm text-teal-900 flex items-center justify-between">
                <span className="truncate font-medium flex items-center gap-1.5">
                  <FiPaperclip size={15} /> {reqAttachment}
                </span>
                <button
                  type="button"
                  onClick={() => setReqAttachment(null)}
                  className="text-gray-500 hover:text-red-600 font-semibold text-xs ml-2 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleReqFileAttach}
                className="min-h-[44px] px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                Attach PDF or image
              </button>
            )}

            {/* Submit button in dark teal #134e4a */}
            <button
              type="submit"
              className="min-h-[48px] px-6 rounded-xl bg-[#134e4a] hover:bg-[#0f3f3c] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer mt-1"
            >
              Post to {reqClass.split(" ")[0]} (40 students)
            </button>
          </form>
        </section>

        {/* Right Column (span 7): Check Submissions & Syllabus Progress */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Card 1: Check Submissions Card */}
          <section className="bg-white border border-gray-200/85 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 px-6 border-b border-gray-100 flex justify-between items-center gap-3">
              <h2 className="m-0 text-base font-bold text-gray-900">
                Check · 7-A · Ch. 5 Q1–8
              </h2>
              <button
                type="button"
                onClick={handleReqRemindNotSubmitted}
                className="min-h-[34px] px-3.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                Remind 6 not submitted
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {reqSubmissions.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 px-6 flex justify-between items-center gap-3 hover:bg-gray-50/70 transition-colors"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {sub.student}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {sub.detail}
                    </span>
                  </div>

                  {/* Status Pills matching exact colors from image */}
                  <div
                    onClick={() => handleToggleReqStatus(idx)}
                    className="cursor-pointer"
                    title="Click to toggle status"
                  >
                    {sub.status === "Checked" && (
                      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#dcfce7] text-[#15803d]">
                        Checked
                      </span>
                    )}
                    {sub.status === "Submitted" && (
                      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#ccfbf1] text-[#0f766e]">
                        Submitted
                      </span>
                    )}
                    {sub.status === "Not submitted" && (
                      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c]">
                        Not submitted
                      </span>
                    )}
                    {sub.status === "Redo" && (
                      <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#f3f4f6] text-[#4b5563]">
                        Redo
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Card 2: Syllabus done vs planned */}
          <section className="bg-white border border-gray-200/85 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            <h2 className="m-0 text-base font-bold text-gray-900">
              Syllabus done vs planned
            </h2>

            <div className="flex flex-col gap-3.5 pt-1">
              {REQUIREMENT_SYLLABUS_PROGRESS.map((s, idx) => (
                <div key={idx} className="grid grid-cols-[110px_1fr_48px] gap-3 items-center text-sm">
                  <span className="font-semibold text-gray-900 truncate">{s.classSubject}</span>

                  <div className="relative h-3 bg-gray-100 rounded-full overflow-visible">
                    {/* Fill Bar: Amber/Brown for behind, Dark Teal for on track */}
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.isBehind ? "bg-[#c26d24]" : "bg-[#134e4a]"
                      }`}
                      style={{ width: `${s.percent}%` }}
                    />
                    {/* Vertical target marker line at 55% */}
                    <div
                      className="absolute -top-1 -bottom-1 w-[2px] bg-black z-10"
                      style={{ left: `${s.target}%` }}
                      title={`Target: ${s.target}%`}
                    />
                  </div>

                  <span className="font-mono text-sm text-gray-700 text-right font-medium">
                    {s.percent}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  // Helper function to render Advanced Management UI
  const renderAdvancedUI = () => (
    <div className="flex flex-col gap-4 w-full animate-fadeIn font-sans pb-12">
      {/* ================= HEADER SECTION (SINGLE LINE ON LAPTOP) ================= */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="text-xs sm:text-[13px] text-ink-secondary flex items-center gap-1.5 mb-0.5 truncate">
            <Link to="/teacher/dashboard" className="hover:text-primary transition-colors shrink-0">
              Teacher Panel
            </Link>
            <span>›</span>
            <span className="text-ink-secondary shrink-0">Homework & syllabus</span>
            <span>›</span>
            <span className="text-primary font-semibold truncate">Advanced Tracker</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              Homework & Syllabus Tracker
            </h1>
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Assign daily homework · Review & grade submissions · Track chapter-wise syllabus pace
          </div>
        </div>

        {/* Top-Right Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleRemindPending()}
            className="px-3 py-1.5 rounded-control border border-line-input bg-surface hover:bg-slate-50 text-ink text-xs font-semibold transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5"
            title="Send SMS/push alert to all students with pending submissions"
          >
            <MdNotificationsActive size={15} className="text-amber-600" />
            <span>Remind Pending ({kpiMetrics.totalPendingSubmissions})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPostModal(true)}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MdAdd size={16} />
            <span>Post Homework</span>
          </button>
        </div>
      </div>
      {/* 4 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Active Homework
            </span>
            <div className="w-8 h-8 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
              <MdMenuBook size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-ink">
              {kpiMetrics.totalAssigned}{" "}
              <span className="text-xs font-normal text-ink-secondary">Tasks</span>
            </div>
            <div className="text-xs text-ink-secondary mt-1 flex items-center justify-between">
              <span>Dispatches at 4:00 pm</span>
              <span className="text-primary font-semibold">Daily Diary</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Review Completion
            </span>
            <div className="w-8 h-8 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MdCheckCircle size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-emerald-800">
              {kpiMetrics.completionRate}%
            </div>
            <div className="text-xs text-ink-secondary mt-1 flex items-center justify-between">
              <span>{kpiMetrics.totalCheckedSubmissions} graded</span>
              <span className="text-emerald-700 font-semibold">
                {kpiMetrics.totalPendingSubmissions} pending
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Syllabus Progress
            </span>
            <div className="w-8 h-8 rounded-control bg-blue-50 text-blue-700 flex items-center justify-center">
              <MdTrendingUp size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-ink">50.2%</div>
            <div className="text-xs text-ink-secondary mt-1 flex items-center justify-between">
              <span>Mid-Oct Target: 55%</span>
              <span className="text-ink-secondary">Term 1/2</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Syllabus Alerts
            </span>
            <div className="w-8 h-8 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center">
              <MdWarningAmber size={18} />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono text-amber-800">
              {kpiMetrics.behindCount}{" "}
              <span className="text-xs font-normal text-ink-secondary">Behind Target</span>
            </div>
            <div className="text-xs text-ink-secondary mt-1 flex items-center justify-between">
              <span>7-A & 7-B Science</span>
              <span className="text-amber-700 font-semibold">Revision Req.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line">
        <button
          type="button"
          onClick={() => setActiveTab("homework")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "homework"
              ? "border-primary text-primary bg-primary-tint/30 rounded-t"
              : "border-transparent text-ink-secondary hover:text-ink hover:border-slate-300"
          }`}
        >
          <MdMenuBook size={16} />
          <span>Daily Homework ({assignments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("submissions")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "submissions"
              ? "border-primary text-primary bg-primary-tint/30 rounded-t"
              : "border-transparent text-ink-secondary hover:text-ink hover:border-slate-300"
          }`}
        >
          <MdCheckCircle size={16} />
          <span>Submissions & Grading ({submissions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("syllabus")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "syllabus"
              ? "border-primary text-primary bg-primary-tint/30 rounded-t"
              : "border-transparent text-ink-secondary hover:text-ink hover:border-slate-300"
          }`}
        >
          <MdTrendingUp size={16} />
          <span>Chapter-wise Syllabus Tracker</span>
        </button>
      </div>

      {/* Tab 1: Daily Homework Cards */}
      {activeTab === "homework" && (
        <div className="space-y-4">
          <div className="p-3 bg-surface border border-line rounded-card shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
                Filter Class:
              </span>
              <div className="relative">
                <select
                  value={homeworkClassFilter}
                  onChange={(e) => setHomeworkClassFilter(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-control border border-line-input bg-surface-subtle text-xs font-semibold text-ink focus:border-primary focus:outline-none shadow-2xs cursor-pointer appearance-none min-w-[170px]"
                >
                  <option value="ALL">All Classes (4)</option>
                  <option value="7-A Science">7-A Science</option>
                  <option value="7-B Science">7-B Science</option>
                  <option value="8-A Science">8-A Science</option>
                  <option value="8-B Science">8-B Science</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            <div className="relative min-w-[220px] flex-1 sm:max-w-xs ml-auto">
              <MdSearch
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none"
              />
              <input
                type="text"
                value={homeworkSearch}
                onChange={(e) => setHomeworkSearch(e.target.value)}
                placeholder="Search topic or chapter..."
                className="w-full pl-8 pr-7 h-9 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary/60 focus:bg-surface focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssignments.map((hw) => {
              const submissionRate = Math.round((hw.submittedCount / hw.totalStudents) * 100);
              const isDueSoon = hw.dueDate === "2026-10-14" || hw.dueDate === "2026-10-15";

              return (
                <div
                  key={hw.id}
                  className="p-5 bg-surface border border-line rounded-card shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-primary-tint text-primary-dark border border-primary-tint-border">
                          {hw.classSection}
                        </span>
                        <span className="text-[11px] text-ink-secondary">
                          Posted: {hw.postedDate}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isDueSoon
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-surface-subtle text-ink-secondary border border-line"
                        }`}
                      >
                        Due: {hw.dueDate}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-ink leading-snug">
                      {hw.topic}
                    </h3>

                    <p className="text-xs text-ink-secondary leading-relaxed mt-1.5 line-clamp-2">
                      {hw.description}
                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-subtle border border-line text-[11px] font-semibold text-ink-secondary">
                        <MdCheckCircle size={12} className="text-primary" />
                        {hw.submissionType}
                      </span>

                      {hw.attachmentName && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-800">
                          <MdAttachFile size={12} />
                          {hw.attachmentName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line-row">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-ink">
                        Submissions: {hw.submittedCount} / {hw.totalStudents} ({submissionRate}%)
                      </span>
                      <span className="text-ink-secondary">
                        {hw.checkedCount} checked · {hw.totalStudents - hw.submittedCount} missing
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${submissionRate}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHomeworkId(hw.id);
                          setActiveTab("submissions");
                        }}
                        className="h-8 px-3 rounded-control border border-line-input bg-surface-subtle hover:bg-slate-100 text-ink text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <MdVisibility size={14} className="text-primary" />
                        <span>Check Submissions ({hw.submittedCount})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemindPending(hw.classSection)}
                        className="h-8 px-3 rounded-control border border-line-input bg-surface hover:bg-amber-50 text-amber-800 hover:border-amber-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <MdNotificationsActive size={14} />
                        <span>Remind Missing ({hw.totalStudents - hw.submittedCount})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Submissions Roster with Status Filter & Pagination */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <div className="p-3.5 bg-surface border border-line rounded-card shadow-xs flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
                  Class:
                </span>
                <div className="relative">
                  <select
                    value={submissionClassFilter}
                    onChange={(e) => setSubmissionClassFilter(e.target.value)}
                    className="h-8 pl-3 pr-7 rounded-control border border-line-input bg-surface-subtle text-xs font-semibold text-ink focus:border-primary focus:outline-none shadow-2xs cursor-pointer appearance-none"
                  >
                    <option value="ALL">All Classes</option>
                    <option value="7-A Science">7-A Science</option>
                    <option value="8-B Science">8-B Science</option>
                  </select>
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-secondary text-[10px]">
                    ▼
                  </div>
                </div>

                <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider ml-1">
                  Task:
                </span>
                <div className="relative">
                  <select
                    value={selectedHomeworkId}
                    onChange={(e) => setSelectedHomeworkId(e.target.value)}
                    className="h-8 pl-3 pr-7 rounded-control border border-line-input bg-surface-subtle text-xs font-semibold text-ink focus:border-primary focus:outline-none shadow-2xs cursor-pointer appearance-none max-w-[200px] truncate"
                  >
                    <option value="ALL">All Tasks</option>
                    {assignments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.topic.split("—")[0]} ({a.classSection})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-secondary text-[10px]">
                    ▼
                  </div>
                </div>
              </div>

              <div className="relative min-w-[200px] flex-1 sm:max-w-xs ml-auto">
                <MdSearch
                  size={16}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none"
                />
                <input
                  type="text"
                  value={submissionSearch}
                  onChange={(e) => setSubmissionSearch(e.target.value)}
                  placeholder="Search student or roll..."
                  className="w-full pl-8 pr-7 h-8 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary/60 focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-line-row">
              <span className="text-[11px] font-semibold text-ink-secondary uppercase mr-1">
                Status:
              </span>
              <button
                type="button"
                onClick={() => setSubmissionStatusFilter("ALL")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  submissionStatusFilter === "ALL"
                    ? "bg-ink text-white shadow-xs"
                    : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
                }`}
              >
                All ({submissions.length})
              </button>
              <button
                type="button"
                onClick={() => setSubmissionStatusFilter("Checked")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  submissionStatusFilter === "Checked"
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
                }`}
              >
                Checked
              </button>
              <button
                type="button"
                onClick={() => setSubmissionStatusFilter("Submitted")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  submissionStatusFilter === "Submitted"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
                }`}
              >
                Submitted
              </button>
              <button
                type="button"
                onClick={() => setSubmissionStatusFilter("Not submitted")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  submissionStatusFilter === "Not submitted"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
                }`}
              >
                Not submitted
              </button>
              <button
                type="button"
                onClick={() => setSubmissionStatusFilter("Redo")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  submissionStatusFilter === "Redo"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-surface text-ink-secondary border border-line hover:bg-slate-100"
                }`}
              >
                Redo
              </button>
            </div>
          </div>

          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-line-row bg-surface-subtle text-caption font-semibold text-ink-secondary">
                    <th className="py-2.5 px-4 w-14">Roll</th>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Class & Topic</th>
                    <th className="py-2.5 px-4 w-44">Submitted Detail</th>
                    <th className="py-2.5 px-4 w-32">Status</th>
                    <th className="py-2.5 px-4 w-48 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row text-small">
                  {paginatedSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-semibold text-ink-secondary">
                        {sub.roll}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${getAvatarBg(
                              sub.roll
                            )}`}
                          >
                            {sub.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-ink">{sub.studentName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-ink truncate max-w-[220px]">
                            {sub.homeworkTitle}
                          </span>
                          <span className="text-[11px] text-ink-secondary">
                            {sub.classSection}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        {sub.submittedAt ? (
                          <div className="flex flex-col text-xs">
                            <span className="text-ink font-medium">{sub.submittedAt}</span>
                            {sub.attachmentName && (
                              <span className="text-blue-700 font-semibold truncate max-w-[160px] flex items-center gap-0.5">
                                <MdAttachFile size={11} /> {sub.attachmentName}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-ink-secondary italic">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {sub.status === "Checked" && (
                          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Checked
                          </span>
                        )}
                        {sub.status === "Submitted" && (
                          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            Submitted
                          </span>
                        )}
                        {sub.status === "Not submitted" && (
                          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            Not submitted
                          </span>
                        )}
                        {sub.status === "Redo" && (
                          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                            Redo
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateSubmissionStatus(sub.id, "Checked")}
                            className="h-7 px-2 rounded-control border border-line-input bg-surface hover:bg-emerald-50 text-emerald-700 text-xs font-semibold transition-colors cursor-pointer"
                            title="Mark Checked"
                          >
                            <MdCheck size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSubmission(sub);
                              setRemarkText(sub.teacherRemarks || "");
                            }}
                            className="h-7 px-2.5 rounded-control border border-line-input bg-surface hover:bg-slate-100 text-ink text-xs font-semibold transition-colors cursor-pointer"
                            title="Add remark / feedback"
                          >
                            <MdEdit size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 px-4 border-t border-line-row bg-surface-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-ink-secondary">
                Showing <strong>{(activePage - 1) * pageSize + 1}</strong> to{" "}
                <strong>{Math.min(activePage * pageSize, filteredSubmissions.length)}</strong> of{" "}
                <strong>{filteredSubmissions.length}</strong> submissions
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
                    <option value={20}>20</option>
                    <option value={50}>50</option>
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
        </div>
      )}

      {/* Tab 3: Chapter-wise Syllabus Tracker */}
      {activeTab === "syllabus" && (
        <div className="space-y-4">
          <div className="p-4 bg-surface border border-line rounded-card shadow-xs flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-ink">
                  Syllabus Done vs Planned Target
                </h2>
                <div className="text-xs text-ink-secondary">
                  Compare ongoing chapter completion against standard academic term benchmark (Target: 55% for Mid-October)
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ink-secondary uppercase">Class:</span>
                <div className="relative">
                  <select
                    value={syllabusClassFilter}
                    onChange={(e) => setSyllabusClassFilter(e.target.value)}
                    className="h-8 pl-3 pr-7 rounded-control border border-line-input bg-surface-subtle text-xs font-semibold text-ink focus:border-primary focus:outline-none shadow-2xs cursor-pointer appearance-none min-w-[160px]"
                  >
                    <option value="7-A Science">7-A Science</option>
                    <option value="7-B Science">7-B Science</option>
                    <option value="8-A Science">8-A Science</option>
                    <option value="8-B Science">8-B Science</option>
                  </select>
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-secondary text-[10px]">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {SYLLABUS_OVERVIEW.map((item) => (
                <div
                  key={item.classSubject}
                  onClick={() => setSyllabusClassFilter(item.classSubject)}
                  className={`p-3 rounded-control border transition-all cursor-pointer ${
                    syllabusClassFilter === item.classSubject
                      ? "bg-primary-tint/30 border-primary"
                      : "bg-surface-subtle border-line hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-ink">{item.classSubject}</span>
                    <span
                      className={`font-mono ${
                        item.isBehind ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {item.percent}%
                    </span>
                  </div>

                  <div className="relative h-2.5 bg-line-row rounded-full overflow-visible my-1.5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.isBehind ? "bg-amber-500" : "bg-primary"
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                    <div
                      className="absolute -top-1 -bottom-1 w-0.5 bg-ink"
                      style={{ left: `${item.target}%` }}
                      title={`Target: ${item.target}%`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-ink-secondary mt-1">
                    <span>{item.chaptersDone} / {item.totalChapters} chapters</span>
                    <span>{item.isBehind ? "Behind Pace" : "On Schedule"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="p-3.5 px-4 border-b border-line-row bg-surface-head flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-small text-ink">
                  {syllabusClassFilter} · Chapters Syllabus Plan
                </span>
                <span className="text-xs text-ink-secondary">
                  ({filteredSyllabus.length} Chapters planned)
                </span>
              </div>
              <span className="text-xs text-ink-secondary">
                Marker line indicates target pace (55%)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-line-row bg-surface-subtle text-caption font-semibold text-ink-secondary">
                    <th className="py-2.5 px-4 w-16">Ch #</th>
                    <th className="py-2.5 px-4">Chapter Name</th>
                    <th className="py-2.5 px-4 w-28">Periods</th>
                    <th className="py-2.5 px-4 w-28">Lab Work</th>
                    <th className="py-2.5 px-4 w-32">Status</th>
                    <th className="py-2.5 px-4 w-36">Target Date</th>
                    <th className="py-2.5 px-4 w-28 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row text-small">
                  {filteredSyllabus.map((ch) => (
                    <tr key={ch.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-semibold text-ink-secondary">
                        {ch.chapterNumber}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-ink">{ch.title}</span>
                          {ch.notes && (
                            <span className="text-[11px] text-ink-secondary italic mt-0.5">
                              {ch.notes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-xs font-mono">
                        <span className="font-semibold text-ink">{ch.completedPeriods}</span>
                        <span className="text-ink-secondary"> / {ch.totalPeriods}</span>
                      </td>
                      <td className="py-2.5 px-4 text-xs">
                        {ch.hasLabWork ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            <MdScience size={12} /> Yes
                          </span>
                        ) : (
                          <span className="text-ink-secondary">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {ch.status === "Completed" && (
                          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Completed
                          </span>
                        )}
                        {ch.status === "In Progress" && (
                          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            In Progress
                          </span>
                        )}
                        {ch.status === "Planned" && (
                          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            Planned
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-ink-secondary">
                        {ch.actualCompletionDate ? (
                          <span className="text-emerald-800 font-semibold">
                            {ch.actualCompletionDate}
                          </span>
                        ) : (
                          <span>{ch.targetCompletionDate}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingChapter(ch);
                            setChapterStatusInput(ch.status);
                            setChapterNotesInput(ch.notes || "");
                          }}
                          className="h-7 px-2.5 rounded-control border border-line-input bg-surface hover:bg-slate-100 text-ink text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fadeIn max-w-content mx-auto pb-16 font-sans">
      {isAdvancedView ? renderAdvancedUI() : renderRequirementUI()}

      {/* ================= MODAL 1: POST HOMEWORK (ADVANCED) ================= */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface rounded-card border border-line shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-line-row bg-surface-head flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-ink text-base">Post Daily Homework</h3>
                <p className="text-xs text-ink-secondary">
                  Goes to student and parent daily diary at 4:00 pm
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="w-8 h-8 rounded-control text-ink-secondary hover:text-ink hover:bg-surface-subtle flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostHomeworkSubmit} className="p-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                  <span>Class & Section</span>
                  <select
                    value={newHwClass}
                    onChange={(e) => setNewHwClass(e.target.value)}
                    className="h-9 px-3 rounded-control border border-line-input bg-surface text-xs text-ink focus:border-primary focus:outline-none"
                  >
                    <option value="7-A Science">7-A Science</option>
                    <option value="7-B Science">7-B Science</option>
                    <option value="8-A Science">8-A Science</option>
                    <option value="8-B Science">8-B Science</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                  <span>Due Date</span>
                  <input
                    type="date"
                    value={newHwDueDate}
                    onChange={(e) => setNewHwDueDate(e.target.value)}
                    className="h-9 px-3 rounded-control border border-line-input bg-surface text-xs text-ink focus:border-primary focus:outline-none"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                <span>Topic / Chapter Title</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ch. 6 Combustion and flame — zones of a flame"
                  value={newHwTopic}
                  onChange={(e) => setNewHwTopic(e.target.value)}
                  className="h-9 px-3 rounded-control border border-line-input bg-surface text-xs text-ink focus:border-primary focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                <span>Detailed Instructions / Questions</span>
                <textarea
                  rows={3}
                  required
                  placeholder="Draw and label diagram, answer exercise questions..."
                  value={newHwDescription}
                  onChange={(e) => setNewHwDescription(e.target.value)}
                  className="p-2.5 rounded-control border border-line-input bg-surface text-xs text-ink focus:border-primary focus:outline-none resize-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                  <span>Submission Type</span>
                  <select
                    value={newHwSubmissionType}
                    onChange={(e) =>
                      setNewHwSubmissionType(e.target.value as "Photo in app" | "Notebook only")
                    }
                    className="h-9 px-3 rounded-control border border-line-input bg-surface text-xs text-ink focus:border-primary focus:outline-none"
                  >
                    <option value="Photo in app">Photo in app</option>
                    <option value="Notebook only">Notebook only</option>
                  </select>
                </label>

                <div className="flex flex-col gap-1 text-xs font-semibold text-ink">
                  <span>Attachment</span>
                  {newHwAttachment ? (
                    <div className="h-9 px-2.5 rounded-control bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
                      <span className="truncate max-w-[120px]">{newHwAttachment}</span>
                      <button
                        type="button"
                        onClick={() => setNewHwAttachment(null)}
                        className="text-rose-600 font-bold ml-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setNewHwAttachment("Science_Worksheet.pdf")}
                      className="h-9 px-3 rounded-control border border-line-input bg-surface hover:bg-slate-50 text-ink text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MdAttachFile size={14} /> Attach PDF / Img
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 border-t border-line-row flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-control border border-line-input text-ink text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-control bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                >
                  Post Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: SUBMISSION REMARK / FEEDBACK ================= */}
      {editingSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface rounded-card border border-line shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-line-row bg-surface-head flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-ink text-base">
                  Feedback for {editingSubmission.studentName}
                </h3>
                <p className="text-xs text-ink-secondary">
                  Roll #{editingSubmission.roll} · {editingSubmission.classSection}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingSubmission(null)}
                className="w-8 h-8 rounded-control text-ink-secondary hover:text-ink hover:bg-surface-subtle flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                <span>Teacher Remark / Redo Request Note</span>
                <textarea
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="e.g. Please redraw the diagrams with clear annotations and resubmit."
                  className="p-2.5 rounded-control border border-line-input bg-surface text-xs text-ink focus:border-primary focus:outline-none resize-none"
                />
              </label>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateSubmissionStatus(editingSubmission.id, "Checked");
                    setEditingSubmission(null);
                  }}
                  className="flex-1 py-2 rounded-control bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  Mark Checked
                </button>

                <button
                  type="button"
                  onClick={handleSaveRemark}
                  className="flex-1 py-2 rounded-control bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  Request Redo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: UPDATE CHAPTER SYLLABUS ================= */}
      {editingChapter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface rounded-card border border-line shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-line-row bg-surface-head flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-ink text-base">
                  Update Ch. {editingChapter.chapterNumber} Progress
                </h3>
                <p className="text-xs text-ink-secondary">
                  {editingChapter.title} ({editingChapter.classSection})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingChapter(null)}
                className="w-8 h-8 rounded-control text-ink-secondary hover:text-ink hover:bg-surface-subtle flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                <span>Status</span>
                <select
                  value={chapterStatusInput}
                  onChange={(e) =>
                    setChapterStatusInput(
                      e.target.value as "Completed" | "In Progress" | "Planned"
                    )
                  }
                  className="h-9 px-3 rounded-control border border-line-input bg-surface text-xs text-ink focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                <span>Lab / Practical Work Notes</span>
                <textarea
                  rows={2}
                  value={chapterNotesInput}
                  onChange={(e) => setChapterNotesInput(e.target.value)}
                  placeholder="Notes about experiment completion, revision dates..."
                  className="p-2.5 rounded-control border border-line-input bg-surface text-xs text-ink focus:border-primary focus:outline-none resize-none"
                />
              </label>

              <div className="p-3 border-t border-line-row flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingChapter(null)}
                  className="px-4 py-2 rounded-control border border-line-input text-ink text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChapterProgress}
                  className="px-5 py-2 rounded-control bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                >
                  Save Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherHomework;
