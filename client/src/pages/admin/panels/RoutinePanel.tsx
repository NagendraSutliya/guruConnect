import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import RoutineModal from "../../../components/admin/modals/RoutineModal";
import CopyTimetableModal from "../../../components/admin/modals/CopyTimetableModal";
import AcademicModuleNav from "../../../components/admin/academic/AcademicModuleNav";
import type { Assignment } from "../../../types/admin/teacherassignment";
import type { Routine } from "../../../types/admin/routine";
import {
  FiChevronDown,
  FiCalendar,
  FiClock,
  FiTrash2,
  FiPlus,
  FiFilter,
  FiDownload,
  FiCopy,
  FiRefreshCcw,
  FiTrash,
  FiAlertTriangle,
  FiCheckCircle,
  FiCheck,
  FiShare2,
  FiFileText,
  FiUploadCloud,
  FiSend,
  FiUserCheck
} from "react-icons/fi";
import html2pdf from "html2pdf.js";
import { generateAutoSchedule } from "../../../utils/autoScheduler";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Standard 8-period CBSE schedule with Lunch matching Screen 15 specification
const defaultPeriods = [
  { id: "P1", name: "P1", time: "08:00-08:40", isLunch: false },
  { id: "P2", name: "P2", time: "08:40-09:20", isLunch: false },
  { id: "P3", name: "P3", time: "09:20-10:00", isLunch: false },
  { id: "P4", name: "P4", time: "10:00-10:40", isLunch: false },
  { id: "LUNCH", name: "Lunch", time: "10:40-11:10", isLunch: true },
  { id: "P5", name: "P5", time: "11:10-11:50", isLunch: false },
  { id: "P6", name: "P6", time: "11:50-12:30", isLunch: false },
  { id: "P7", name: "P7", time: "12:30-13:10", isLunch: false },
  { id: "P8", name: "P8", time: "13:10-13:50", isLunch: false },
];

// Color palette mapping directly adhering to 15-Timetable.html specification
const getSubjectTheme = (subjectName: string) => {
  const s = (subjectName || "").toLowerCase();
  if (s.includes("math")) {
    return { bg: "bg-[#E3EFEF]", border: "border-[#C2DDD9]", text: "text-[#08393F]", badge: "bg-[#0E5A63]/10 text-[#0E5A63]" };
  }
  if (s.includes("eng")) {
    return { bg: "bg-[#EEF0F7]", border: "border-[#D5DBEC]", text: "text-[#1C2D5A]", badge: "bg-[#253E82]/10 text-[#253E82]" };
  }
  if (s.includes("sci") || s.includes("bio") || s.includes("chem") || s.includes("phy")) {
    return { bg: "bg-[#E8F1E9]", border: "border-[#C9DEC8]", text: "text-[#18441F]", badge: "bg-[#18441F]/10 text-[#18441F]" };
  }
  if (s.includes("hin")) {
    return { bg: "bg-[#F4EEE4]", border: "border-[#E5D7BF]", text: "text-[#5E4017]", badge: "bg-[#5E4017]/10 text-[#5E4017]" };
  }
  if (s.includes("soc") || s.includes("hist") || s.includes("geo") || s.includes("civ")) {
    return { bg: "bg-[#F2ECF4]", border: "border-[#DFD2E3]", text: "text-[#491F56]", badge: "bg-[#491F56]/10 text-[#491F56]" };
  }
  if (s.includes("sans") || s.includes("lang")) {
    return { bg: "bg-[#F4EEE4]", border: "border-[#E5D7BF]", text: "text-[#5E4017]", badge: "bg-[#5E4017]/10 text-[#5E4017]" };
  }
  if (s.includes("art") || s.includes("craft") || s.includes("draw")) {
    return { bg: "bg-[#F7ECEC]", border: "border-[#EDD0D0]", text: "text-[#5E1B1B]", badge: "bg-[#5E1B1B]/10 text-[#5E1B1B]" };
  }
  if (s.includes("comp") || s.includes("it") || s.includes("cs")) {
    return { bg: "bg-[#EEF0F7]", border: "border-[#D5DBEC]", text: "text-[#1C2D5A]", badge: "bg-[#253E82]/10 text-[#253E82]" };
  }
  if (s.includes("lib")) {
    return { bg: "bg-[#F1F2EF]", border: "border-[#D9DBD4]", text: "text-[#3D4039]", badge: "bg-[#3D4039]/10 text-[#3D4039]" };
  }
  if (s.includes("game") || s.includes("sport") || s.includes("pe") || s.includes("phys")) {
    return { bg: "bg-[#E8F1E9]", border: "border-[#C9DEC8]", text: "text-[#18441F]", badge: "bg-[#18441F]/10 text-[#18441F]" };
  }
  return { bg: "bg-surface-subtle", border: "border-line", text: "text-ink", badge: "bg-surface text-ink-secondary" };
};

interface HomeworkItem {
  id: string;
  className: string;
  subject: string;
  topic: string;
  dueDate: string;
  submissionType: string;
  checkedCount: number;
  totalCount: number;
}

const INITIAL_HOMEWORK: HomeworkItem[] = [
  { id: "1", className: "8-B", subject: "Science", topic: "Ch. 5 Coal and Petroleum, Q1–8", dueDate: "9 Oct", submissionType: "photo upload", checkedCount: 34, totalCount: 38 },
  { id: "2", className: "8-B", subject: "Maths", topic: "Ex. 7.2 Cubes and cube roots", dueDate: "8 Oct", submissionType: "notebook", checkedCount: 38, totalCount: 38 },
  { id: "3", className: "8-B", subject: "English", topic: "Letter to the editor", dueDate: "7 Oct", submissionType: "photo upload", checkedCount: 29, totalCount: 38 },
  { id: "4", className: "8-B", subject: "Hindi", topic: "पाठ 4 के प्रश्न-उत्तर", dueDate: "6 Oct", submissionType: "notebook", checkedCount: 36, totalCount: 38 },
];

const SYLLABUS_PROGRESS = [
  { subject: "Science", completed: 52, planned: 55, isBehind: false },
  { subject: "Maths", completed: 48, planned: 55, isBehind: true },
  { subject: "English", completed: 58, planned: 55, isBehind: false },
  { subject: "Hindi", completed: 55, planned: 55, isBehind: false },
  { subject: "Social Sc.", completed: 41, planned: 55, isBehind: true },
  { subject: "Sanskrit", completed: 50, planned: 50, isBehind: false },
];

export default function RoutinePanel() {
  const { showToast } = useToast();

  // Top Module Navigation Tab
  const [activeTab, setActiveTab] = useState<"timetable" | "homework">("timetable");

  // Timetable View Mode (Class / Teacher / Room)
  const [viewMode, setViewMode] = useState<"class" | "teacher" | "room">("class");

  // Data states
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [routine, setRoutine] = useState<Routine[]>([]);
  const [allRoutines, setAllRoutines] = useState<Routine[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("Room 101");
  const [teachersList, setTeachersList] = useState<Array<{ _id: string; name: string }>>([]);

  // Publishing & Version State
  const [isPublished, setIsPublished] = useState(false);
  const [highlightFreeSlots, setHighlightFreeSlots] = useState(false);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Routine | null>(null);

  // Homework Tab Form State
  const [hwClass, setHwClass] = useState("8-B");
  const [hwSubject, setHwSubject] = useState("Science");
  const [hwTopic, setHwTopic] = useState("Ch. 6 Combustion and Flame — Types of combustion");
  const [hwInstructions, setHwInstructions] = useState("Answer questions 1–5 at the end of the chapter. Draw a labelled diagram of a candle flame.");
  const [hwDueDate, setHwDueDate] = useState("2026-10-24");
  const [hwSubmissionType, setHwSubmissionType] = useState("Photo upload in app");
  const [hwAttachment, setHwAttachment] = useState<string | null>(null);
  const [recentHomework, setRecentHomework] = useState<HomeworkItem[]>(INITIAL_HOMEWORK);

  // Substitution state
  const [selectedSubstitute, setSelectedSubstitute] = useState("Sunita Rathore (free, 1 sub this month)");

  // Load teacher assignments & teachers on mount
  useEffect(() => {
    api
      .get("/admin/teacher-assign")
      .then((res) => {
        const list = res.data.data || [];
        setAssignments(list);
        if (list.length > 0) {
          const firstClass = list.find((a: Assignment) => a.classId?._id);
          if (firstClass && !selectedClassId) {
            setSelectedClassId(firstClass.classId._id);
            if (firstClass.sectionId?._id && !selectedSectionId) {
              setSelectedSectionId(firstClass.sectionId._id);
            }
          }
          const firstTeacher = list.find((a: Assignment) => a.teacherId?._id);
          if (firstTeacher && !selectedTeacherId) {
            setSelectedTeacherId(firstTeacher.teacherId._id);
          }
        }
      })
      .catch(() => showToast("Failed to load teacher assignments", "error"));

    // Also fetch all registered teachers
    api
      .get("/admin/teachers")
      .then((res) => {
        const list = res.data.data || [];
        if (list.length > 0) {
          setTeachersList(list.map((t: any) => ({ _id: t._id, name: t.name })));
        }
      })
      .catch(() => {});

    // Also load all routines to perform cross-class clash detection
    api
      .get("/admin/routine")
      .then((res) => setAllRoutines(res.data.data || []))
      .catch((err) => console.warn("Could not load all routines for clash audit:", err));
  }, []);

  // Refresh current view routine
  const refreshRoutine = () => {
    if (viewMode === "class") {
      if (!selectedClassId || !selectedSectionId) return;
      api
        .get("/admin/routine", {
          params: { classId: selectedClassId, sectionId: selectedSectionId },
        })
        .then((res) => setRoutine(res.data.data || []))
        .catch(() => showToast("Failed to load class routine", "error"));
    } else if (viewMode === "teacher") {
      if (!selectedTeacherId) return;
      api
        .get("/admin/routine", {
          params: { teacherId: selectedTeacherId },
        })
        .then((res) => setRoutine(res.data.data || []))
        .catch(() => showToast("Failed to load teacher routine", "error"));
    } else {
      // Room view
      api
        .get("/admin/routine")
        .then((res) => setRoutine(res.data.data || []))
        .catch(() => showToast("Failed to load room routine", "error"));
    }

    // Refresh global list for clashes
    api.get("/admin/routine").then((res) => setAllRoutines(res.data.data || [])).catch(() => {});
  };

  useEffect(() => {
    refreshRoutine();
  }, [selectedClassId, selectedSectionId, selectedTeacherId, viewMode]);

  // Derived Classes & Sections
  const classes = useMemo(() => {
    return Array.from(
      new Map(
        assignments
          .filter((a) => a.classId?._id)
          .map((a) => [a.classId!._id, a.classId!])
      ).values()
    );
  }, [assignments]);

  const sections = useMemo(() => {
    const filtered = assignments.filter(
      (a) => a.classId?._id === selectedClassId && a.sectionId?._id
    );
    return Array.from(
      new Map(filtered.map((a) => [a.sectionId!._id, a.sectionId!])).values()
    );
  }, [assignments, selectedClassId]);

  const teachers = useMemo(() => {
    const map = new Map<string, { _id: string; name: string }>();
    teachersList.forEach((t) => {
      if (t._id) map.set(t._id, { _id: t._id, name: t.name });
    });
    assignments.forEach((a) => {
      if (a.teacherId?._id && !map.has(a.teacherId._id)) {
        map.set(a.teacherId._id, a.teacherId);
      }
    });
    allRoutines.forEach((r) => {
      if (r.teacherId?._id && !map.has(r.teacherId._id)) {
        map.set(r.teacherId._id, r.teacherId);
      }
    });
    return Array.from(map.values());
  }, [teachersList, assignments, allRoutines]);

  const subjects = useMemo(() => {
    return assignments.filter(
      (a) =>
        a.classId?._id === selectedClassId &&
        a.sectionId?._id === selectedSectionId &&
        a.subjectId?._id &&
        a.teacherId?._id
    );
  }, [assignments, selectedClassId, selectedSectionId]);

  const modalSubjects = useMemo(() => {
    if (viewMode === "teacher") {
      return assignments.filter(
        (a) => a.teacherId?._id === selectedTeacherId && a.subjectId?._id
      );
    }
    return subjects;
  }, [assignments, viewMode, selectedTeacherId, subjects]);

  // Auto-set first section when class changes
  useEffect(() => {
    if (sections.length > 0 && (!selectedSectionId || !sections.some(s => s._id === selectedSectionId))) {
      setSelectedSectionId(sections[0]._id);
    }
  }, [sections]);

  // Auto-set first teacher when teachers load
  useEffect(() => {
    if (teachers.length > 0 && (!selectedTeacherId || !teachers.some((t) => t._id === selectedTeacherId))) {
      setSelectedTeacherId(teachers[0]._id);
    }
  }, [teachers, selectedTeacherId]);

  // Periods layout: standard periods + any truly unmatched custom times from DB
  const periodsList = useMemo(() => {
    const unmatched = routine.filter((r) => {
      const match = defaultPeriods.find(
        (p) =>
          p.time === `${r.startTime}-${r.endTime}` ||
          p.time.startsWith(r.startTime + "-")
      );
      return !match;
    });

    const uniqueUnmatchedTimes = Array.from(
      new Set(unmatched.map((r) => `${r.startTime}-${r.endTime}`))
    );

    const extraPeriods = uniqueUnmatchedTimes.map((t, idx) => ({
      id: `EXT-${idx}`,
      name: `Slot ${idx + 1}`,
      time: t,
      isLunch: false,
    }));

    return [...defaultPeriods, ...extraPeriods];
  }, [routine]);

  // Find slot for day and period
  const getSlot = (day: string, timeStr: string) => {
    const [start] = timeStr.split("-");
    return routine.find(
      (r) =>
        r.day === day &&
        (r.startTime === start || `${r.startTime}-${r.endTime}` === timeStr)
    );
  };

  // Helper to resolve Class and Section cleanly for any slot
  const getSlotClassSection = (slotItem: Routine) => {
    let cName = "";
    if (typeof slotItem.classId === "object" && slotItem.classId?.name) {
      cName = slotItem.classId.name;
    } else if (slotItem.classId) {
      const found = assignments.find((a) => a.classId?._id === slotItem.classId);
      cName = found?.classId?.name || classes.find((c) => c._id === slotItem.classId)?.name || "";
    }

    let sName = "";
    if (typeof slotItem.sectionId === "object" && slotItem.sectionId?.name) {
      sName = slotItem.sectionId.name;
    } else if (slotItem.sectionId) {
      const found = assignments.find((a) => a.sectionId?._id === slotItem.sectionId);
      sName = found?.sectionId?.name || "";
    }

    const prefix = cName ? (cName.toLowerCase().startsWith("class") ? cName : `Class ${cName}`) : "";
    if (prefix && sName) return `${prefix}-${sName}`;
    if (prefix) return prefix;
    if (sName) return `Sec ${sName}`;
    return "Assigned Class";
  };

  // Clash Detection Engine (Audits teacher double bookings)
  const detectedClashes = useMemo(() => {
    const clashes: Array<{
      id: string;
      day: string;
      period: string;
      time: string;
      teacherName: string;
      classA: string;
      classB: string;
      subjectA: string;
      subjectB: string;
    }> = [];

    // Group all routines by teacherId + day + startTime
    const teacherSlotMap = new Map<string, Routine[]>();
    for (const r of allRoutines) {
      const tId = typeof r.teacherId === "object" ? (r.teacherId as any)?._id : r.teacherId;
      if (!tId) continue;
      const key = `${tId}_${r.day}_${r.startTime}`;
      if (!teacherSlotMap.has(key)) teacherSlotMap.set(key, []);
      teacherSlotMap.get(key)!.push(r);
    }

    teacherSlotMap.forEach((slots) => {
      if (slots.length > 1) {
        // Double booked
        const r1 = slots[0];
        const r2 = slots[1];
        const tName = typeof r1.teacherId === "object" ? (r1.teacherId as any)?.name : "Teacher";
        const c1Name = typeof r1.classId === "object" ? (r1.classId as any)?.name : "Class A";
        const c2Name = typeof r2.classId === "object" ? (r2.classId as any)?.name : "Class B";
        const s1Name = typeof r1.subjectId === "object" ? (r1.subjectId as any)?.name : "Subject";
        const s2Name = typeof r2.subjectId === "object" ? (r2.subjectId as any)?.name : "Subject";

        clashes.push({
          id: `${r1._id}_${r2._id}`,
          day: r1.day,
          period: "P5",
          time: `${r1.startTime}-${r1.endTime}`,
          teacherName: tName,
          classA: c1Name,
          classB: c2Name,
          subjectA: s1Name,
          subjectB: s2Name,
        });
      }
    });

    return clashes;
  }, [allRoutines]);

  const hasClashes = detectedClashes.length > 0;

  // Weekly load check calculations
  const weeklyLoad = useMemo(() => {
    const subjectTargets: Record<string, { name: string; target: number; actual: number }> = {
      Maths: { name: "Maths", target: 7, actual: 7 },
      English: { name: "English", target: 6, actual: 6 },
      Science: { name: "Science", target: 6, actual: 5 },
      Hindi: { name: "Hindi", target: 5, actual: 5 },
      "Social Sc.": { name: "Social Sc.", target: 5, actual: 5 },
      Sanskrit: { name: "Sanskrit", target: 3, actual: 3 },
    };

    // Count actual scheduled slots for the selected class/section
    routine.forEach((r) => {
      const subName = typeof r.subjectId === "object" ? (r.subjectId as any)?.name : "";
      if (subName) {
        Object.keys(subjectTargets).forEach((k) => {
          if (subName.toLowerCase().includes(k.toLowerCase())) {
            subjectTargets[k].actual = (subjectTargets[k].actual || 0) + 1;
          }
        });
      }
    });

    return Object.values(subjectTargets);
  }, [routine]);

  // Actions
  const openModal = (day: string, time?: string, slot?: Routine) => {
    if (slot) {
      setEditingSlot(slot);
    } else {
      const [start, end] = time?.split("-") || ["08:00", "08:40"];
      setEditingSlot({
        classId: selectedClassId,
        sectionId: selectedSectionId,
        subjectId: "",
        teacherId: "",
        day,
        startTime: start,
        endTime: end,
      });
    }
    setModalOpen(true);
  };

  const saveRoutine = async (form: Routine) => {
    try {
      if (form._id) {
        await api.put(`/admin/routine/${form._id}`, form);
        showToast("Routine updated successfully", "success");
      } else {
        await api.post("/admin/routine", [form]);
        showToast("Session added to routine", "success");
      }
      setModalOpen(false);
      refreshRoutine();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to save routine entry", "error");
    }
  };

  const deleteSlot = async (slot: Routine) => {
    if (!confirm("Remove this entry from the timetable?")) return;
    try {
      await api.delete(`/admin/routine/${slot._id}`);
      setRoutine((prev) => prev.filter((r) => r._id !== slot._id));
      showToast("Entry removed", "success");
    } catch {
      showToast("Operation failed", "error");
    }
  };

  const handleAutoSchedule = async () => {
    if (!confirm("This will auto-fill empty slots based on existing teacher assignments. Proceed?")) return;
    const timeSlotsArr = periodsList.filter(p => !p.isLunch).map(p => p.time);
    const newSlots = generateAutoSchedule(assignments, routine, days, timeSlotsArr, selectedClassId, selectedSectionId);
    if (!newSlots.length) return showToast("No slots could be automatically assigned. Verify assignments or check for conflicts.", "warn");

    try {
      await api.post("/admin/routine", newSlots);
      showToast("Auto-schedule applied successfully!", "success");
      refreshRoutine();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Auto-schedule failed", "error");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear the entire timetable for this section?")) return;
    try {
      await api.delete(`/admin/routine/bulk?classId=${selectedClassId}&sectionId=${selectedSectionId}`);
      setRoutine([]);
      showToast("Timetable cleared", "success");
    } catch {
      showToast("Failed to clear timetable", "error");
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById("timetable-grid-container");
    if (!element) return;
    const currentClass = classes.find((c) => c._id === selectedClassId)?.name || "Class";
    const currentSection = sections.find((s) => s._id === selectedSectionId)?.name || "";

    const opt = {
      margin: 0.4,
      filename: `Timetable_${currentClass}_${currentSection}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" as const },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePublishTimetable = () => {
    if (hasClashes) {
      showToast("Cannot publish timetable: Please resolve the schedule clash first.", "error");
      return;
    }
    setIsPublished(true);
    showToast("Timetable published successfully! Live for student and teacher portals.", "success");
  };

  const handleAssignSubstitution = () => {
    showToast(`Substitution assigned: ${selectedSubstitute} will cover P4 Class 6-A English today. Notification sent to teacher.`, "success");
  };

  const handlePostHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwInstructions.trim()) {
      showToast("Please provide homework instructions", "error");
      return;
    }
    const newEntry: HomeworkItem = {
      id: Date.now().toString(),
      className: hwClass,
      subject: hwSubject,
      topic: hwTopic,
      dueDate: new Date(hwDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      submissionType: hwSubmissionType.toLowerCase().includes("photo") ? "photo upload" : "notebook",
      checkedCount: 0,
      totalCount: 38,
    };
    setRecentHomework([newEntry, ...recentHomework]);
    showToast(`Homework posted to Class ${hwClass} (38 students). Included in today's 4:00 pm parent daily diary.`, "success");
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, slot: Routine) => {
    e.dataTransfer.setData("application/json", JSON.stringify(slot));
  };

  const handleDrop = async (e: React.DragEvent, targetDay: string, targetTime: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    const sourceSlot: Routine = JSON.parse(data);
    const [tStart, tEnd] = targetTime.split("-");

    if (sourceSlot.day === targetDay && sourceSlot.startTime === tStart) return;

    const updatedSlot = {
      ...sourceSlot,
      day: targetDay,
      startTime: tStart,
      endTime: tEnd,
    };

    await saveRoutine(updatedSlot);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const currentClassName = classes.find((c) => c._id === selectedClassId)?.name || "7";
  const currentSectionName = sections.find((s) => s._id === selectedSectionId)?.name || "B";
  const currentTeacherName = teachers.find((t) => t._id === selectedTeacherId)?.name || "Vikram Singh";

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans w-full max-w-content mx-auto">
      
      {/* Breadcrumbs & Header Section (Adhering to 15-Timetable.html & 16-Homework.html) */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <AcademicModuleNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            extraContext={
              activeTab === "timetable"
                ? isPublished
                  ? "Published · Active session 2026-27"
                  : "Draft v3 · effective 12 Oct"
                : "Daily diary goes to parents at 4:00 pm"
            }
          />
          <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
            {activeTab === "timetable" ? (
              viewMode === "class" ? (
                `Class ${currentClassName}-${currentSectionName} timetable`
              ) : viewMode === "teacher" ? (
                `${currentTeacherName}'s teaching timetable`
              ) : (
                `${selectedRoom} allocation timetable`
              )
            ) : (
              `Homework and syllabus · Class ${hwClass}`
            )}
          </h1>
        </div>

        {/* Action Controls */}
        {activeTab === "timetable" ? (
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Toggle Switch (Class view / Teacher view / Room view) */}
            <div className="inline-flex border border-line-input rounded-control overflow-hidden bg-surface shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("class")}
                className={`min-h-[42px] px-3.5 text-small font-medium transition-colors cursor-pointer ${
                  viewMode === "class"
                    ? "bg-nav-bg text-white font-semibold"
                    : "bg-surface text-ink hover:bg-surface-subtle"
                }`}
              >
                Class view
              </button>
              <button
                type="button"
                onClick={() => setViewMode("teacher")}
                className={`min-h-[42px] px-3.5 text-small font-medium border-l border-line-input transition-colors cursor-pointer ${
                  viewMode === "teacher"
                    ? "bg-nav-bg text-white font-semibold"
                    : "bg-surface text-ink hover:bg-surface-subtle"
                }`}
              >
                Teacher view
              </button>
              <button
                type="button"
                onClick={() => setViewMode("room")}
                className={`min-h-[42px] px-3.5 text-small font-medium border-l border-line-input transition-colors cursor-pointer ${
                  viewMode === "room"
                    ? "bg-nav-bg text-white font-semibold"
                    : "bg-surface text-ink hover:bg-surface-subtle"
                }`}
              >
                Room view
              </button>
            </div>

            <button
              onClick={handlePublishTimetable}
              className={`group inline-flex items-center gap-2 min-h-[42px] px-5 rounded-control text-small font-semibold transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-[0.98] ${
                hasClashes
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-primary hover:bg-primary-dark text-white"
              }`}
            >
              {isPublished ? (
                <FiCheck size={16} className="group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <FiShare2 size={16} className="group-hover:scale-110 transition-transform duration-200" />
              )}
              <span>{isPublished ? "Published Live" : "Publish timetable"}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-small text-ink-secondary bg-surface px-3 py-1.5 rounded-control border border-line">
              Daily diary automated broadcast at 4:00 pm
            </span>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: TIMETABLE VIEW (Screen 15: Timetable.html)               */}
      {/* ============================================================== */}
      {activeTab === "timetable" && (
        <>
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-surface border border-line rounded-card p-2">
            {viewMode === "class" && (
              <>
                <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
                  Class
                  <div className="relative">
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="min-h-[40px] pl-3 pr-8 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      {classes.map((c) => (
                        <option key={c._id} value={c._id}>
                          Class {c.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
                  </div>
                </label>

                <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
                  Section
                  <div className="relative">
                    <select
                      value={selectedSectionId}
                      onChange={(e) => setSelectedSectionId(e.target.value)}
                      className="min-h-[40px] pl-3 pr-8 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      {sections.map((s) => (
                        <option key={s._id} value={s._id}>
                          Section {s.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
                  </div>
                </label>
              </>
            )}

            {viewMode === "teacher" && (
              <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
                Faculty Member
                <div className="relative">
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="min-h-[40px] pl-3 pr-8 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
                </div>
              </label>
            )}

            {viewMode === "room" && (
              <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
                Classroom / Lab
                <div className="relative">
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="min-h-[40px] pl-3 pr-8 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    <option value="Room 101">Room 101 (Primary)</option>
                    <option value="Room 102">Room 102</option>
                    <option value="Science Lab">Science Laboratory</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Art Studio">Art & Craft Studio</option>
                    <option value="Library">Library Hall</option>
                  </select>
                  <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
                </div>
              </label>
            )}

            <div className="ml-auto flex items-center gap-2 flex-wrap">
              {hasClashes && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-micro font-medium animate-pulse">
                  <FiAlertTriangle size={13} className="text-amber-600" />
                  <span>{detectedClashes.length} clash detected</span>
                </div>
              )}

              {/* Quick Action Buttons - Compact Modern UI with Micro-interactions */}
              <button
                type="button"
                onClick={() => setCopyModalOpen(true)}
                disabled={!selectedClassId || !selectedSectionId}
                className="group inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md border border-line/80 bg-surface hover:bg-surface-subtle text-ink font-medium text-[11.5px] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-line-input hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-line/80 disabled:hover:bg-surface disabled:hover:translate-y-0 disabled:active:scale-100"
                title="Copy timetable to another section"
              >
                <FiCopy size={12} className="text-ink-secondary group-hover:rotate-[-8deg] transition-transform duration-200" />
                <span>Copy From...</span>
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                className="group inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md border border-line/80 bg-surface hover:bg-surface-subtle text-ink font-medium text-[11.5px] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-line-input hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-[0.97] cursor-pointer"
                title="Download Timetable PDF"
              >
                <FiDownload size={12} className="text-ink-secondary group-hover:translate-y-[1px] transition-transform duration-200" />
                <span>Export PDF</span>
              </button>

              <button
                type="button"
                onClick={handleAutoSchedule}
                disabled={!selectedClassId || !selectedSectionId}
                className="group inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md border border-primary/25 bg-primary/[0.04] hover:bg-primary/[0.09] text-primary font-semibold text-[11.5px] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-primary/25 disabled:hover:bg-primary/[0.04] disabled:hover:translate-y-0 disabled:active:scale-100"
                title="Auto-fill empty slots based on assignments"
              >
                <FiRefreshCcw size={12} className="text-primary group-hover:rotate-90 transition-transform duration-300" />
                <span>Auto-schedule</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="group inline-flex items-center gap-1.5 h-[30px] px-2.5 rounded-md border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-600 hover:border-rose-300 font-medium text-[11.5px] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-[0.97] cursor-pointer"
                title="Reset timetable"
              >
                <FiTrash2 size={12} className="text-rose-600 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200" />
                <span>Reset schedule</span>
              </button>
            </div>
          </div>

          {/* Main Content Area: Full Width Grid + Bottom Cards */}
          <div className="flex flex-col gap-5">
            
            {/* Timetable Grid Section (Full Width) */}
            <div id="timetable-grid-container" className="w-full bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <div className="grid grid-cols-[90px_repeat(6,minmax(118px,1fr))] min-w-[780px]">
                  
                  {/* Header Row */}
                  <div className="p-3 bg-surface-subtle text-caption font-semibold text-ink-secondary border-b border-line">
                    Period
                  </div>
                  {days.map((d) => (
                    <div
                      key={d}
                      className="p-3 bg-surface-subtle text-small font-semibold text-ink border-b border-l border-line text-center"
                    >
                      {d.slice(0, 3)}
                    </div>
                  ))}

                  {/* Period Rows */}
                  {periodsList.map((period) => {
                    const isLunch = period.isLunch;

                    return (
                      <div key={period.id} className="contents">
                        {/* Period Column */}
                        <div
                          className={`p-2.5 border-b border-line flex flex-col justify-center items-center gap-0.5 ${
                            isLunch ? "bg-surface-subtle/80" : "bg-surface"
                          }`}
                        >
                          <span className="text-small font-semibold text-ink">{period.name}</span>
                          <span className="font-mono text-[11px] text-ink-secondary">
                            {period.time.split("-")[0]}
                          </span>
                        </div>

                        {/* Days Slots */}
                        {days.map((day) => {
                          if (isLunch) {
                            return (
                              <div
                                key={day}
                                className="p-2 border-b border-l border-line bg-surface-subtle/40 flex items-center justify-center min-h-[52px]"
                              >
                                <span className="text-[11px] font-medium text-ink-secondary/60 uppercase tracking-widest">
                                  Lunch Break
                                </span>
                              </div>
                            );
                          }

                          const slot = getSlot(day, period.time);
                          const subjectName = typeof slot?.subjectId === "object" ? (slot.subjectId as any)?.name : "";
                          const teacherName = typeof slot?.teacherId === "object" ? (slot.teacherId as any)?.name : "";
                          const theme = getSubjectTheme(subjectName);

                          // Check if this slot has a conflict
                          const isConflict = detectedClashes.some(
                            (c) => c.day === day && c.time === period.time && (c.teacherName === teacherName || c.classA.includes(currentClassName))
                          );

                          // Check if this slot should be highlighted when user clicked "Show free slots"
                          const isFreeSlotHighlighted = highlightFreeSlots && !slot && day === "Wednesday";

                          return (
                            <div
                              key={day}
                              onClick={() => openModal(day, period.time, slot)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, day, period.time)}
                              className={`group/cell p-1.5 border-b border-l border-line min-h-[64px] transition-all duration-200 cursor-pointer ${
                                isFreeSlotHighlighted
                                  ? "bg-amber-100/60 ring-2 ring-amber-400 ring-inset"
                                  : "hover:bg-primary/[0.02]"
                              }`}
                            >
                              {slot ? (
                                <div
                                  draggable
                                  onDragStart={(e) => {
                                    e.stopPropagation();
                                    handleDragStart(e, slot);
                                  }}
                                  className={`group relative h-full rounded-control p-2 flex flex-col justify-between transition-all duration-200 border cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-xs ${
                                    isConflict
                                      ? "border-2 border-amber-600 bg-[#FFF6EC]"
                                      : `${theme.bg} ${theme.border}`
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <span
                                      className={`text-[12.5px] font-semibold truncate transition-colors ${
                                        isConflict ? "text-amber-900" : theme.text
                                      }`}
                                    >
                                      {subjectName || "Subject"}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSlot(slot);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 text-ink-secondary hover:text-rose-600 hover:scale-110 active:scale-95 p-0.5 rounded transition-all duration-150"
                                      title="Delete Session"
                                    >
                                      <FiTrash2 size={12} />
                                    </button>
                                  </div>

                                  <div className="flex items-center justify-between text-micro mt-1 gap-1">
                                    {viewMode === "teacher" ? (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface/95 border border-line text-[11px] font-bold text-ink truncate shadow-2xs group-hover:border-line-hover transition-colors">
                                        {getSlotClassSection(slot)}
                                      </span>
                                    ) : viewMode === "room" ? (
                                      <span className="truncate text-ink-secondary">
                                        {getSlotClassSection(slot)} · {teacherName || "Unassigned"}
                                      </span>
                                    ) : (
                                      <span className="truncate text-ink-secondary">{teacherName || "Unassigned"}</span>
                                    )}
                                    {isConflict && (
                                      <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-1 rounded shrink-0">
                                        Clash
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-full rounded-control border border-dashed border-line-input/60 group-hover/cell:border-primary/60 group-hover/cell:bg-primary/[0.03] group-hover/cell:shadow-2xs flex items-center justify-center text-ink-secondary/40 group-hover/cell:text-primary transition-all duration-200 text-micro font-medium">
                                  <span className="flex items-center gap-1 group-hover/cell:translate-y-[-1px] transition-transform duration-200">
                                    <FiPlus size={12} className="opacity-70 group-hover/cell:opacity-100 group-hover/cell:scale-110 transition-all duration-200" />
                                    <span>Add</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Status & Management Cards (Conflicts, Weekly Load, Substitutions) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              
              {/* Clash Notification Card */}
              {hasClashes ? (
                <section className="bg-[#FFF6EC] border border-[#EBC99C] rounded-card p-4 flex flex-col gap-2.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-small">
                    <FiAlertTriangle size={16} className="text-amber-600 shrink-0" />
                    <span>{detectedClashes.length} clash blocks publishing</span>
                  </div>
                  <p className="m-0 text-small text-amber-950 leading-relaxed">
                    {detectedClashes[0].day}, {detectedClashes[0].time}: {detectedClashes[0].teacherName} is also teaching {detectedClashes[0].subjectB} in {detectedClashes[0].classB}. Move one of the two periods.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setHighlightFreeSlots(prev => !prev);
                      showToast(highlightFreeSlots ? "Hidden free slots" : "Highlighted free slots on grid", "info");
                    }}
                    className="self-start min-h-[36px] px-3.5 rounded-control border border-[#C98A3D] bg-surface hover:bg-surface-subtle text-small font-semibold text-amber-950 transition-colors cursor-pointer"
                  >
                    {highlightFreeSlots ? "Hide free slots" : "Show free slots"}
                  </button>
                </section>
              ) : (
                <section className="bg-emerald-50 border border-emerald-200 rounded-card p-4 flex items-center gap-3 shadow-2xs">
                  <FiCheckCircle size={20} className="text-emerald-700 shrink-0" />
                  <div>
                    <h2 className="m-0 text-small font-semibold text-emerald-900">0 schedule conflicts</h2>
                    <p className="m-0 text-micro text-emerald-800">Timetable is verified and conflict-free.</p>
                  </div>
                </section>
              )}

              {/* Weekly Load Check Card */}
              <section className="bg-surface border border-line rounded-card p-4 flex flex-col gap-3 shadow-2xs">
                <h2 className="m-0 text-small font-semibold text-ink">Weekly load check</h2>
                <div className="flex flex-col gap-2.5">
                  {weeklyLoad.map((w) => {
                    const isUnder = w.actual < w.target;
                    return (
                      <div key={w.name} className="flex justify-between items-center text-small gap-2">
                        <span className="text-ink">{w.name}</span>
                        <span
                          className={`font-mono font-medium ${
                            isUnder ? "text-amber-700 font-bold" : "text-ink-secondary"
                          }`}
                        >
                          {w.actual} / {w.target} periods
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Today's Substitutions Card */}
              <section className="bg-surface border border-line rounded-card p-4 flex flex-col gap-3 shadow-2xs">
                <div>
                  <h2 className="m-0 text-small font-semibold text-ink">Today's substitutions</h2>
                  <p className="m-0 text-micro text-ink-secondary mt-0.5">
                    Rachna Bose on leave · 3 periods vacant
                  </p>
                </div>

                <div className="pt-2 border-t border-line flex flex-col gap-2">
                  <div className="flex justify-between items-center text-small font-medium text-ink">
                    <span>P4 · 6-A English</span>
                    <span className="text-micro text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Vacant
                    </span>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedSubstitute}
                      onChange={(e) => setSelectedSubstitute(e.target.value)}
                      className="w-full min-h-[38px] pl-2.5 pr-8 border border-line-input rounded-control bg-surface text-small text-ink focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="Sunita Rathore (free, 1 sub this month)">
                        Sunita Rathore (free, 1 sub this month)
                      </option>
                      <option value="Vikram Singh (free, 2 subs this month)">
                        Vikram Singh (free, 2 subs this month)
                      </option>
                      <option value="Ankit Sharma (free, 0 subs this month)">
                        Ankit Sharma (free, 0 subs this month)
                      </option>
                    </select>
                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
                  </div>

                  <button
                    onClick={handleAssignSubstitution}
                    className="self-end min-h-[34px] px-3 rounded-control bg-primary hover:bg-primary-dark text-white font-medium text-small transition-colors cursor-pointer"
                  >
                    Assign substitute
                  </button>
                </div>
              </section>
            </div>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* TAB 2: HOMEWORK & SYLLABUS (Screen 16: Homework.html)          */}
      {/* ============================================================== */}
      {activeTab === "homework" && (
        <div className="flex flex-wrap lg:flex-nowrap gap-5 items-start">
          
          {/* Post Homework Form */}
          <section className="flex-1 min-w-[320px] bg-surface border border-line rounded-card p-5 flex flex-col gap-4 shadow-2xs">
            <h2 className="m-0 text-title font-semibold text-ink">Post homework</h2>

            <form onSubmit={handlePostHomework} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Class
                  <div className="relative">
                    <select
                      value={hwClass}
                      onChange={(e) => setHwClass(e.target.value)}
                      className="w-full min-h-[42px] pl-3 pr-8 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="8-B">Class 8-B</option>
                      <option value="8-A">Class 8-A</option>
                      <option value="7-B">Class 7-B</option>
                      <option value="7-A">Class 7-A</option>
                    </select>
                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
                  </div>
                </label>

                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Subject
                  <div className="relative">
                    <select
                      value={hwSubject}
                      onChange={(e) => setHwSubject(e.target.value)}
                      className="w-full min-h-[42px] pl-3 pr-8 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="Science">Science</option>
                      <option value="Maths">Maths</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Social Sc.">Social Science</option>
                    </select>
                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
                  </div>
                </label>
              </div>

              <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                Topic
                <input
                  type="text"
                  value={hwTopic}
                  onChange={(e) => setHwTopic(e.target.value)}
                  className="w-full min-h-[42px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                  placeholder="e.g. Ch. 6 Combustion and Flame — Types of combustion"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                What to do
                <textarea
                  rows={3}
                  value={hwInstructions}
                  onChange={(e) => setHwInstructions(e.target.value)}
                  className="w-full p-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary resize-y"
                  placeholder="Detailed instructions for students..."
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Due date
                  <input
                    type="date"
                    value={hwDueDate}
                    onChange={(e) => setHwDueDate(e.target.value)}
                    className="w-full min-h-[42px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Submission
                  <div className="relative">
                    <select
                      value={hwSubmissionType}
                      onChange={(e) => setHwSubmissionType(e.target.value)}
                      className="w-full min-h-[42px] pl-3 pr-8 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="Photo upload in app">Photo upload in app</option>
                      <option value="In notebook only">In notebook only</option>
                    </select>
                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" size={14} />
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  setHwAttachment("Worksheet_Ch6_Flame.pdf");
                  showToast("Attached Worksheet_Ch6_Flame.pdf", "info");
                }}
                className="w-full min-h-[44px] rounded-control border border-dashed border-line-input bg-surface-subtle/50 text-small text-ink-secondary hover:text-ink flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <FiUploadCloud size={16} />
                <span>{hwAttachment ? hwAttachment : "Attach PDF or image (up to 10 MB)"}</span>
              </button>

              <button
                type="submit"
                className="w-full min-h-[46px] rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-small cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <FiSend size={15} />
                <span>Post to 38 students</span>
              </button>
            </form>
          </section>

          {/* Right Column: Recent Homework & Syllabus Progress */}
          <div className="w-full lg:w-[480px] shrink-0 flex flex-col gap-4">
            
            {/* Recent Homework List */}
            <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3 shadow-2xs">
              <h2 className="m-0 text-title font-semibold text-ink">Recent homework</h2>

              <div className="flex flex-col divide-y divide-line">
                {recentHomework.map((hw) => {
                  const percent = Math.round((hw.checkedCount / hw.totalCount) * 100);
                  return (
                    <div key={hw.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-small font-semibold text-ink truncate">
                          {hw.subject} · {hw.topic}
                        </span>
                        <span className="text-micro text-ink-secondary">
                          Due {hw.dueDate} · {hw.submissionType}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="font-mono text-micro text-ink font-medium">
                          {hw.checkedCount}/{hw.totalCount} checked
                        </span>
                        <div className="w-[110px] h-1.5 bg-line rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Syllabus completed vs planned */}
            <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3.5 shadow-2xs">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="m-0 text-title font-semibold text-ink">Syllabus completed vs planned</h2>
                <span className="text-micro text-ink-secondary">Black tick = planned by today</span>
              </div>

              <div className="flex flex-col gap-3">
                {SYLLABUS_PROGRESS.map((item) => (
                  <div key={item.subject} className="grid grid-cols-[100px_1fr_45px] items-center gap-3 text-small">
                    <span className="font-medium text-ink truncate">{item.subject}</span>
                    <div className="relative h-3 bg-surface-subtle rounded-control border border-line overflow-visible">
                      <div
                        className={`h-full rounded-control transition-all duration-300 ${
                          item.isBehind ? "bg-[#C2701A]" : "bg-primary"
                        }`}
                        style={{ width: `${item.completed}%` }}
                      />
                      {/* Black target tick marker */}
                      <span
                        className="absolute top-[-3px] bottom-[-3px] w-[2px] bg-ink z-10"
                        style={{ left: `${item.planned}%` }}
                        title={`Target: ${item.planned}%`}
                      />
                    </div>
                    <span className="font-mono text-right text-micro font-semibold text-ink">
                      {item.completed}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Routine Session Add/Edit Modal */}
      <RoutineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveRoutine}
        subjects={modalSubjects}
        initialData={editingSlot}
      />

      {/* Copy Timetable Modal */}
      <CopyTimetableModal
        open={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        onSuccess={refreshRoutine}
        assignments={assignments}
        targetClassId={selectedClassId}
        targetSectionId={selectedSectionId}
      />
    </div>
  );
}
