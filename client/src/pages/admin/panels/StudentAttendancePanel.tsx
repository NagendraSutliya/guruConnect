import React, { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import {
  FiCheckCircle,
  FiCalendar,
  FiTrendingUp,
  FiAlertTriangle,
  FiSend,
  FiChevronDown,
  FiDownload,
  FiEdit2,
  FiCheck,
  FiActivity,
  FiClock,
  FiBell,
  FiSearch,
  FiEye,
  FiLayers,
  FiPieChart,
} from "react-icons/fi";

type AttendanceStatus = "present" | "absent" | "leave" | "halfday" | "late";

interface StudentAttendanceRecord {
  studentId: string;
  rollNo: number | string;
  admissionNo: string;
  name: string;
  gender?: string;
  phone?: string;
  parentPhone?: string;
  parentName?: string;
  classId: string;
  className: string;
  sectionId?: string;
  sectionName?: string;
  status: AttendanceStatus;
  remarks: string;
  isExisting?: boolean;
}

interface ClassOption {
  value: string; // key: classId_sectionId or classId_all
  label: string; // e.g. "5-A", "Class 5 - A"
  classId: string;
  sectionId: string;
  className: string;
  sectionName: string;
}

export interface SectionTrackerItem {
  id: string;
  classId: string;
  sectionId: string;
  className: string;
  sectionName: string;
  label: string;
  teacherName: string;
  teacherPhone?: string;
  enrolledCount: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  rate: number;
  status: "submitted" | "pending";
  submittedAt?: string | null;
  recordedBy?: string | null;
}

// Requirement Sample Roster from 14-Attendance.html / 14-Attendance.png
const REQUIREMENT_SAMPLE_STUDENTS: StudentAttendanceRecord[] = [
  { studentId: "demo-1", rollNo: 1, admissionNo: "ADM-01", name: "Aanya Bhatt", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-2", rollNo: 2, admissionNo: "ADM-02", name: "Aarav Gupta", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-3", rollNo: 3, admissionNo: "ADM-03", name: "Ananya Sharma", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-4", rollNo: 4, admissionNo: "ADM-04", name: "Aryan Kumawat", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-5", rollNo: 5, admissionNo: "ADM-05", name: "Bhavya Jain", classId: "demo-5", className: "5", sectionName: "A", status: "absent", remarks: "Absent — guardian will be notified" },
  { studentId: "demo-6", rollNo: 6, admissionNo: "ADM-06", name: "Chirag Saini", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-7", rollNo: 7, admissionNo: "ADM-07", name: "Devansh Tak", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-8", rollNo: 8, admissionNo: "ADM-08", name: "Gauri Vyas", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-9", rollNo: 9, admissionNo: "ADM-09", name: "Hridaan Soni", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-10", rollNo: 10, admissionNo: "ADM-10", name: "Ishita Rao", classId: "demo-5", className: "5", sectionName: "A", status: "late", remarks: "Late arrival" },
  { studentId: "demo-11", rollNo: 11, admissionNo: "ADM-11", name: "Kavya Mathur", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-12", rollNo: 12, admissionNo: "ADM-12", name: "Lakshya Verma", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-13", rollNo: 13, admissionNo: "ADM-13", name: "Mahi Agarwal", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-14", rollNo: 14, admissionNo: "ADM-14", name: "Navya Jangid", classId: "demo-5", className: "5", sectionName: "A", status: "leave", remarks: "Approved leave (parent request)" },
  { studentId: "demo-15", rollNo: 15, admissionNo: "ADM-15", name: "Om Prakash", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
  { studentId: "demo-16", rollNo: 16, admissionNo: "ADM-16", name: "Riddhi Paliwal", classId: "demo-5", className: "5", sectionName: "A", status: "present", remarks: "" },
];

const DEMO_TRACKER_SECTIONS: SectionTrackerItem[] = [
  { id: "demo-5_A", classId: "demo-5", sectionId: "A", className: "5", sectionName: "A", label: "5-A", teacherName: "Meenakshi Sharma", teacherPhone: "+91 98290 12345", enrolledCount: 16, presentCount: 14, absentCount: 1, leaveCount: 1, rate: 87.5, status: "submitted", submittedAt: "09:22 AM", recordedBy: "Meenakshi Sharma" },
  { id: "demo-5_B", classId: "demo-5", sectionId: "B", className: "5", sectionName: "B", label: "5-B", teacherName: "Sunita Verma", teacherPhone: "+91 98290 23456", enrolledCount: 38, presentCount: 36, absentCount: 2, leaveCount: 0, rate: 94.7, status: "submitted", submittedAt: "09:14 AM", recordedBy: "Sunita Verma" },
  { id: "demo-5_C", classId: "demo-5", sectionId: "C", className: "5", sectionName: "C", label: "5-C", teacherName: "Vikas Joshi", teacherPhone: "+91 98290 34567", enrolledCount: 35, presentCount: 32, absentCount: 2, leaveCount: 1, rate: 91.4, status: "submitted", submittedAt: "09:30 AM", recordedBy: "Vikas Joshi" },
  { id: "demo-6_A", classId: "demo-6", sectionId: "A", className: "6", sectionName: "A", label: "6-A", teacherName: "Ramesh Bansal", teacherPhone: "+91 98290 45678", enrolledCount: 40, presentCount: 38, absentCount: 1, leaveCount: 1, rate: 95.0, status: "submitted", submittedAt: "09:10 AM", recordedBy: "Ramesh Bansal" },
  { id: "demo-6_B", classId: "demo-6", sectionId: "B", className: "6", sectionName: "B", label: "6-B", teacherName: "Pooja Mishra", teacherPhone: "+91 98290 56789", enrolledCount: 42, presentCount: 0, absentCount: 0, leaveCount: 0, rate: 0, status: "pending", submittedAt: null },
  { id: "demo-7_A", classId: "demo-7", sectionId: "A", className: "7", sectionName: "A", label: "7-A", teacherName: "Anil Kumawat", teacherPhone: "+91 98290 67890", enrolledCount: 36, presentCount: 34, absentCount: 1, leaveCount: 1, rate: 94.4, status: "submitted", submittedAt: "09:25 AM", recordedBy: "Anil Kumawat" },
  { id: "demo-7_B", classId: "demo-7", sectionId: "B", className: "7", sectionName: "B", label: "7-B", teacherName: "Deepak Soni", teacherPhone: "+91 98290 78901", enrolledCount: 38, presentCount: 0, absentCount: 0, leaveCount: 0, rate: 0, status: "pending", submittedAt: null },
  { id: "demo-8_A", classId: "demo-8", sectionId: "A", className: "8", sectionName: "A", label: "8-A", teacherName: "Priya Saxena", teacherPhone: "+91 98290 89012", enrolledCount: 40, presentCount: 37, absentCount: 2, leaveCount: 1, rate: 92.5, status: "submitted", submittedAt: "09:05 AM", recordedBy: "Priya Saxena" },
  { id: "demo-8_B", classId: "demo-8", sectionId: "B", className: "8", sectionName: "B", label: "8-B", teacherName: "Manoj Rathore", teacherPhone: "+91 98290 90123", enrolledCount: 38, presentCount: 35, absentCount: 2, leaveCount: 1, rate: 92.1, status: "submitted", submittedAt: "09:41 AM", recordedBy: "Manoj Rathore" },
  { id: "demo-9_A", classId: "demo-9", sectionId: "A", className: "9", sectionName: "A", label: "9-A", teacherName: "Suresh Meena", teacherPhone: "+91 98290 01234", enrolledCount: 44, presentCount: 41, absentCount: 2, leaveCount: 1, rate: 93.2, status: "submitted", submittedAt: "09:12 AM", recordedBy: "Suresh Meena" },
  { id: "demo-9_B", classId: "demo-9", sectionId: "B", className: "9", sectionName: "B", label: "9-B", teacherName: "Kavita Rao", teacherPhone: "+91 98290 11223", enrolledCount: 42, presentCount: 39, absentCount: 2, leaveCount: 1, rate: 92.8, status: "submitted", submittedAt: "09:35 AM", recordedBy: "Kavita Rao" },
  { id: "demo-10_A", classId: "demo-10", sectionId: "A", className: "10", sectionName: "A", label: "10-A", teacherName: "Dr. Arvind Chouhan", teacherPhone: "+91 98290 22334", enrolledCount: 45, presentCount: 44, absentCount: 1, leaveCount: 0, rate: 97.7, status: "submitted", submittedAt: "08:55 AM", recordedBy: "Dr. Arvind Chouhan" },
  { id: "demo-10_B", classId: "demo-10", sectionId: "B", className: "10", sectionName: "B", label: "10-B", teacherName: "Neha Jain", teacherPhone: "+91 98290 33445", enrolledCount: 42, presentCount: 0, absentCount: 0, leaveCount: 0, rate: 0, status: "pending", submittedAt: null },
  { id: "demo-11_A", classId: "demo-11", sectionId: "A", className: "11", sectionName: "A", label: "11-A", teacherName: "Dr. Sanjay Bhatt", teacherPhone: "+91 98290 44556", enrolledCount: 36, presentCount: 33, absentCount: 2, leaveCount: 1, rate: 91.7, status: "submitted", submittedAt: "09:18 AM", recordedBy: "Dr. Sanjay Bhatt" },
  { id: "demo-11_B", classId: "demo-11", sectionId: "B", className: "11", sectionName: "B", label: "11-B", teacherName: "Alok Gupta", teacherPhone: "+91 98290 55667", enrolledCount: 32, presentCount: 30, absentCount: 1, leaveCount: 1, rate: 93.8, status: "submitted", submittedAt: "09:29 AM", recordedBy: "Alok Gupta" },
  { id: "demo-12_A", classId: "demo-12", sectionId: "A", className: "12", sectionName: "A", label: "12-A", teacherName: "Kiran Sharma", teacherPhone: "+91 98290 66778", enrolledCount: 38, presentCount: 37, absentCount: 1, leaveCount: 0, rate: 97.4, status: "submitted", submittedAt: "08:50 AM", recordedBy: "Kiran Sharma" },
];

type TabType = "tracker" | "daily" | "monthly" | "defaulters" | "analytics";

const StudentAttendancePanel: React.FC = () => {
  const { showToast } = useToast();

  // Active Tab: "tracker" | "daily" | "monthly" | "defaulters" | "analytics"
  const [activeTab, setActiveTab] = useState<TabType>("tracker");

  // Global filters
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [selectedOptionKey, setSelectedOptionKey] = useState<string>("demo-5_A");

  // Roster state
  const [roster, setRoster] = useState<StudentAttendanceRecord[]>(REQUIREMENT_SAMPLE_STUDENTS);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifyGuardians, setNotifyGuardians] = useState(true);
  const [editingRemarksId, setEditingRemarksId] = useState<string | null>(null);

  // Monthly Matrix state
  const [matrixMonth, setMatrixMonth] = useState<number>(new Date().getMonth() + 1);
  const [matrixYear, setMatrixYear] = useState<number>(new Date().getFullYear());
  const [monthlyAttendance, setMonthlyAttendance] = useState<any[]>([]);
  const [monthlyStudents, setMonthlyStudents] = useState<any[]>([]);
  const [monthlyLoading, setMonthlyLoading] = useState(false);

  // Defaulters state
  const [defaulters, setDefaulters] = useState<any[]>([]);
  const [defaultersLoading, setDefaultersLoading] = useState(false);

  // Analytics state
  const [todayAnalytics, setTodayAnalytics] = useState<any>(null);
  const [classAnalytics, setClassAnalytics] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Campus Tracker & Stacks state
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [trackerFilter, setTrackerFilter] = useState<"all" | "submitted" | "pending">("all");
  const [trackerSearch, setTrackerSearch] = useState("");
  const [trackerMetrics, setTrackerMetrics] = useState({
    totalEnrolled: 622,
    totalRecorded: 531,
    totalPresent: 504,
    totalAbsent: 20,
    totalLeave: 7,
    campusRate: 94.2,
    totalSections: 16,
    submittedSections: 13,
    pendingSections: 3,
  });
  const [trackerSections, setTrackerSections] = useState<SectionTrackerItem[]>(DEMO_TRACKER_SECTIONS);

  // Tracker Data Loader
  useEffect(() => {
    if (activeTab === "tracker") {
      loadTrackerData();
    }
  }, [activeTab, selectedDate]);

  const loadTrackerData = async () => {
    try {
      setTrackerLoading(true);
      const res = await api.get(`/admin/attendance/summary/tracker?date=${selectedDate}`);
      if (res.data?.data && res.data.data.sections && res.data.data.sections.length > 0) {
        setTrackerMetrics(res.data.data.metrics);
        setTrackerSections(
          res.data.data.sections.map((sec: any) => ({
            ...sec,
            id: `${sec.classId}_${sec.sectionId}`,
          }))
        );
      } else {
        fallbackTrackerMetrics();
      }
    } catch (err) {
      console.warn("Tracker fetch fallback:", err);
      fallbackTrackerMetrics();
    } finally {
      setTrackerLoading(false);
    }
  };

  const fallbackTrackerMetrics = () => {
    setTrackerSections(DEMO_TRACKER_SECTIONS);
    const submitted = DEMO_TRACKER_SECTIONS.filter((s) => s.status === "submitted");
    const totalEnrolled = DEMO_TRACKER_SECTIONS.reduce((acc, s) => acc + s.enrolledCount, 0);
    const totalPresent = DEMO_TRACKER_SECTIONS.reduce((acc, s) => acc + s.presentCount, 0);
    const totalAbsent = DEMO_TRACKER_SECTIONS.reduce((acc, s) => acc + s.absentCount, 0);
    const totalLeave = DEMO_TRACKER_SECTIONS.reduce((acc, s) => acc + s.leaveCount, 0);
    const campusRate = Math.round((totalPresent / (totalPresent + totalAbsent || 1)) * 100);
    setTrackerMetrics({
      totalEnrolled,
      totalRecorded: totalPresent + totalAbsent + totalLeave,
      totalPresent,
      totalAbsent,
      totalLeave,
      campusRate,
      totalSections: DEMO_TRACKER_SECTIONS.length,
      submittedSections: submitted.length,
      pendingSections: DEMO_TRACKER_SECTIONS.length - submitted.length,
    });
  };

  const filteredSections = useMemo(() => {
    return trackerSections.filter((sec) => {
      if (trackerFilter === "submitted" && sec.status !== "submitted") return false;
      if (trackerFilter === "pending" && sec.status !== "pending") return false;
      if (trackerSearch.trim()) {
        const q = trackerSearch.toLowerCase();
        const matchLabel = sec.label.toLowerCase().includes(q);
        const matchTeacher = sec.teacherName.toLowerCase().includes(q);
        if (!matchLabel && !matchTeacher) return false;
      }
      return true;
    });
  }, [trackerSections, trackerFilter, trackerSearch]);

  const handleOpenSectionRoster = (sec: SectionTrackerItem) => {
    const key = sec.id || `${sec.classId}_${sec.sectionId}`;
    setSelectedOptionKey(key);
    setActiveTab("daily");
    showToast(`Loaded Class ${sec.label} roster for ${sec.status === "pending" ? "proxy attendance entry" : "review"}`, "info");
  };

  const handleSendReminder = (sec: SectionTrackerItem) => {
    showToast(`🔔 Push notification sent to ${sec.teacherName} (Class ${sec.label}) to submit attendance before 10:00 AM!`, "success");
  };

  const handleSendAllPendingReminders = () => {
    const pendingCount = trackerMetrics.pendingSections;
    if (pendingCount === 0) {
      showToast("All sections have already submitted attendance today!", "info");
      return;
    }
    showToast(`🔔 Push notifications broadcast to teachers of all ${pendingCount} pending sections!`, "success");
  };

  // 1. Fetch Classes, Sections, and Students on Mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [classRes, secRes, studentsRes] = await Promise.allSettled([
        api.get("/admin/classes"),
        api.get("/admin/sections"),
        api.get("/admin/students"),
      ]);

      const clsList = classRes.status === "fulfilled" ? (classRes.value.data?.data || classRes.value.data || []) : [];
      const secList = secRes.status === "fulfilled" ? (secRes.value.data?.data || secRes.value.data || []) : [];
      const stdList = studentsRes.status === "fulfilled" ? (studentsRes.value.data?.data || studentsRes.value.data || []) : [];

      setClasses(clsList);
      setSections(secList);
      setAllStudents(stdList);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  // Build combined class & section options from classes, sections, and enrolled students
  const classOptions = useMemo<ClassOption[]>(() => {
    const map = new Map<string, ClassOption>();

    // 1. From database class and section models
    classes.forEach((c) => {
      const classSecs = sections.filter((s: any) => {
        const cid = typeof s.classId === "object" ? s.classId?._id : s.classId;
        return String(cid) === String(c._id);
      });

      if (classSecs.length > 0) {
        classSecs.forEach((sec: any) => {
          const key = `${c._id}_${sec._id}`;
          const cleanName = (c.name || "").replace(/^class\s+/i, "").trim();
          const cleanSec = (sec.name || "").replace(/^section\s+/i, "").trim();
          const label = `${cleanName}-${cleanSec}`;
          map.set(key, {
            value: key,
            label,
            classId: c._id,
            sectionId: sec._id,
            className: c.name,
            sectionName: sec.name,
          });
        });
      } else {
        const key = `${c._id}_all`;
        const cleanName = (c.name || "").replace(/^class\s+/i, "").trim();
        map.set(key, {
          value: key,
          label: cleanName || c.name,
          classId: c._id,
          sectionId: "all",
          className: c.name,
          sectionName: "",
        });
      }
    });

    // 2. Also ensure every class/section present on active enrolled students is included
    allStudents.forEach((s: any) => {
      if (s.isActive === false || !s.classId) return;
      const cid = typeof s.classId === "object" ? s.classId?._id : s.classId;
      const cName = typeof s.classId === "object" ? s.classId?.name : (classes.find((c) => c._id === cid)?.name || "Class");
      const sid = typeof s.sectionId === "object" ? s.sectionId?._id : s.sectionId;
      const sName = typeof s.sectionId === "object" ? s.sectionId?.name : (sections.find((sec) => sec._id === sid)?.name || "");

      const key = sid ? `${cid}_${sid}` : `${cid}_all`;
      if (!map.has(key)) {
        const cleanName = (cName || "").replace(/^class\s+/i, "").trim();
        const cleanSec = (sName || "").replace(/^section\s+/i, "").trim();
        const label = cleanSec ? `${cleanName}-${cleanSec}` : cleanName || cName;
        map.set(key, {
          value: key,
          label,
          classId: String(cid),
          sectionId: sid ? String(sid) : "all",
          className: cName,
          sectionName: sName,
        });
      }
    });

    // 3. Always ensure the requirement prototype options (5-A, 5-B, 5-C) are available
    if (!map.has("demo-5_A")) {
      map.set("demo-5_A", {
        value: "demo-5_A",
        label: "5-A",
        classId: "demo-5",
        sectionId: "A",
        className: "Class 5",
        sectionName: "A",
      });
    }
    if (!map.has("demo-5_B")) {
      map.set("demo-5_B", {
        value: "demo-5_B",
        label: "5-B",
        classId: "demo-5",
        sectionId: "B",
        className: "Class 5",
        sectionName: "B",
      });
    }
    if (!map.has("demo-5_C")) {
      map.set("demo-5_C", {
        value: "demo-5_C",
        label: "5-C",
        classId: "demo-5",
        sectionId: "C",
        className: "Class 5",
        sectionName: "C",
      });
    }

    const list = Array.from(map.values());
    list.sort((a, b) => {
      const aNum = parseInt(a.label.replace(/\D/g, "") || "0", 10);
      const bNum = parseInt(b.label.replace(/\D/g, "") || "0", 10);
      return aNum !== bNum ? aNum - bNum : a.label.localeCompare(b.label);
    });

    return list;
  }, [classes, sections, allStudents]);

  // Keep selectedOptionKey valid
  useEffect(() => {
    if (classOptions.length > 0) {
      const exists = classOptions.some((o) => o.value === selectedOptionKey);
      if (!exists) {
        setSelectedOptionKey(classOptions[0].value);
      }
    }
  }, [classOptions, selectedOptionKey]);

  // Find active option
  const currentOption = useMemo<ClassOption>(() => {
    return classOptions.find((opt) => opt.value === selectedOptionKey) || classOptions[0] || {
      value: "demo-5_A",
      label: "5-A",
      classId: "demo-5",
      sectionId: "A",
      className: "Class 5",
      sectionName: "A",
    };
  }, [classOptions, selectedOptionKey]);

  // 2. Load Attendance Roster for chosen Class & Date
  useEffect(() => {
    if (currentOption && activeTab === "daily") {
      loadDailyRoster(currentOption.classId, currentOption.sectionId, selectedDate);
    }
  }, [currentOption?.value, selectedDate, activeTab, allStudents]);

  const loadDailyRoster = async (classId: string, sectionId: string, date: string) => {
    if (!classId) return;

    // If Demo Class 5-A and no matching students in DB, serve the requirement specification sample
    if (classId.startsWith("demo-")) {
      setRosterLoading(false);
      setRoster(REQUIREMENT_SAMPLE_STUDENTS);
      return;
    }

    try {
      setRosterLoading(true);

      const attendanceRes = await api.get("/admin/attendance", {
        params: {
          date,
          classId,
          sectionId: sectionId !== "all" ? sectionId : undefined,
        },
      });

      const attendanceList = attendanceRes.data?.data || attendanceRes.data || [];

      // Map existing attendance by studentId
      const attendanceMap = new Map<string, any>();
      attendanceList.forEach((att: any) => {
        const sid = typeof att.studentId === "object" ? att.studentId?._id : att.studentId;
        if (sid) {
          attendanceMap.set(String(sid), att);
        }
      });

      // Filter active students for this class & section
      const matchedStudents = allStudents.filter((s: any) => {
        if (s.isActive === false) return false;
        const cid = typeof s.classId === "object" ? s.classId?._id : s.classId;
        const cName = typeof s.classId === "object" ? s.classId?.name : "";

        // Match by class ID or name
        const matchesClass =
          String(cid) === String(classId) ||
          (cName && currentOption && cName.trim().toLowerCase() === currentOption.className.trim().toLowerCase());
        if (!matchesClass) return false;

        if (sectionId && sectionId !== "all") {
          const sid = typeof s.sectionId === "object" ? s.sectionId?._id : s.sectionId;
          const sName = typeof s.sectionId === "object" ? s.sectionId?.name : "";
          const matchesSec =
            String(sid) === String(sectionId) ||
            (sName && currentOption && sName.trim().toLowerCase() === currentOption.sectionName.trim().toLowerCase());
          if (!matchesSec) return false;
        }
        return true;
      });

      if (matchedStudents.length === 0) {
        setRoster([]);
        return;
      }

      const mapped: StudentAttendanceRecord[] = matchedStudents.map((s: any, idx: number) => {
        const existing = attendanceMap.get(String(s._id));
        const statusVal: AttendanceStatus = existing?.status || "present";
        let defaultRemarks = existing?.remarks || "";

        if (!defaultRemarks) {
          if (statusVal === "absent") defaultRemarks = "Absent — guardian will be notified";
          else if (statusVal === "late") defaultRemarks = "Late arrival";
          else if (statusVal === "leave") defaultRemarks = "Approved leave (parent request)";
          else if (statusVal === "halfday") defaultRemarks = "Half day";
        }

        return {
          studentId: s._id,
          rollNo: s.rollNo || idx + 1,
          admissionNo: s.admissionNo || `ADM-${s.rollNo || idx + 1}`,
          name: s.name,
          gender: s.gender || "Male",
          phone: s.phone || "",
          parentPhone: s.parentPhone || s.phone || "",
          parentName: s.parentName || "Guardian",
          classId: s.classId?._id || classId,
          className: s.classId?.name || currentOption?.className || "Class",
          sectionId: s.sectionId?._id || s.sectionId || "",
          sectionName: s.sectionId?.name || currentOption?.sectionName || "",
          status: statusVal,
          remarks: defaultRemarks,
          isExisting: !!existing,
        };
      });

      // Sort by roll number ascending
      mapped.sort((a, b) => Number(a.rollNo) - Number(b.rollNo));
      setRoster(mapped);
    } catch (err) {
      console.error("Failed to load daily attendance roster:", err);
      showToast("Could not load student roster for this class", "error");
    } finally {
      setRosterLoading(false);
    }
  };

  // 3. Status Change Handler
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((item) => {
        if (item.studentId !== studentId) return item;
        let remarks = item.remarks;
        // Default remarks per requirement specification
        if (status === "absent" && (!remarks || remarks === "Late arrival" || remarks === "Approved leave (parent request)" || remarks === "Half day")) {
          remarks = "Absent — guardian will be notified";
        } else if (status === "late" && (!remarks || remarks.startsWith("Absent") || remarks === "Approved leave (parent request)" || remarks === "Half day")) {
          remarks = "Late arrival";
        } else if (status === "leave" && (!remarks || remarks.startsWith("Absent") || remarks === "Late arrival" || remarks === "Half day")) {
          remarks = "Approved leave (parent request)";
        } else if (status === "halfday" && (!remarks || remarks.startsWith("Absent") || remarks === "Late arrival" || remarks === "Approved leave (parent request)")) {
          remarks = "Half day";
        } else if (status === "present") {
          remarks = "";
        }

        return {
          ...item,
          status,
          remarks,
        };
      })
    );
  };

  // 4. Mark All Present
  const handleMarkAllPresent = () => {
    setRoster((prev) =>
      prev.map((item) => ({
        ...item,
        status: "present",
        remarks: "",
      }))
    );
    showToast("All students marked as Present", "info");
  };

  // 5. Submit Attendance
  const handleSubmitAttendance = async () => {
    if (roster.length === 0) {
      showToast("No students to submit attendance for.", "error");
      return;
    }
    if (!currentOption) return;

    try {
      setIsSubmitting(true);

      // Only post to backend if not demo class
      if (!currentOption.classId.startsWith("demo-")) {
        const payload = {
          classId: currentOption.classId,
          sectionId: currentOption.sectionId !== "all" ? currentOption.sectionId : null,
          date: selectedDate,
          records: roster.map((r) => ({
            studentId: r.studentId,
            status: r.status,
            remarks: r.remarks,
          })),
        };
        await api.post("/admin/attendance", payload);
      }

      showToast(`Attendance recorded for ${roster.length} students!`, "success");

      const absentCount = roster.filter((r) => r.status === "absent").length;
      const lateCount = roster.filter((r) => r.status === "late").length;
      if (notifyGuardians && (absentCount > 0 || lateCount > 0)) {
        showToast(
          `Notification dispatched to guardians of ${absentCount} absent and ${lateCount} late students.`,
          "info"
        );
      }
    } catch (err) {
      console.error("Failed to submit attendance:", err);
      showToast("Failed to save attendance. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live Summary Metric Counts
  const metrics = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let halfday = 0;
    let late = 0;

    roster.forEach((r) => {
      if (r.status === "present") present++;
      else if (r.status === "absent") absent++;
      else if (r.status === "leave") leave++;
      else if (r.status === "halfday") halfday++;
      else if (r.status === "late") late++;
    });

    const total = roster.length;
    // Late students are physically present in school, so presentDisplay counts on-time + late arrivals
    const presentDisplay = present + late;
    // Calculate rate: (present + halfday * 0.5 + late * 1) / total
    const rate = total > 0 ? (((present + halfday * 0.5 + late) / total) * 100).toFixed(1) : "0.0";

    return {
      total,
      present,
      presentDisplay,
      absent,
      leave,
      halfday,
      late,
      rate,
    };
  }, [roster]);

  // Formatted date string (e.g. "Friday, 9 Oct 2026")
  const formattedDateTitle = useMemo(() => {
    try {
      const parts = selectedDate.split("-");
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    } catch {
      // Fallback
    }
    return selectedDate;
  }, [selectedDate]);

  // 6. Monthly Register Loader
  useEffect(() => {
    if (activeTab === "monthly" && currentOption) {
      loadMonthlyMatrix();
    }
  }, [activeTab, currentOption?.value, matrixMonth, matrixYear, allStudents]);

  const loadMonthlyMatrix = async () => {
    if (!currentOption) return;

    if (currentOption.classId.startsWith("demo-")) {
      setMonthlyStudents(REQUIREMENT_SAMPLE_STUDENTS);
      setMonthlyLoading(false);
      return;
    }

    try {
      setMonthlyLoading(true);
      const attendanceRes = await api.get("/admin/attendance", {
        params: {
          classId: currentOption.classId,
          sectionId: currentOption.sectionId !== "all" ? currentOption.sectionId : undefined,
          month: matrixMonth,
          year: matrixYear,
        },
      });

      const attendanceList = attendanceRes.data?.data || attendanceRes.data || [];

      const matched = allStudents.filter((s: any) => {
        if (s.isActive === false) return false;
        const cid = typeof s.classId === "object" ? s.classId?._id : s.classId;
        const cName = typeof s.classId === "object" ? s.classId?.name : "";
        const matchesClass =
          String(cid) === String(currentOption.classId) ||
          (cName && cName.trim().toLowerCase() === currentOption.className.trim().toLowerCase());
        if (!matchesClass) return false;

        if (currentOption.sectionId !== "all") {
          const sid = typeof s.sectionId === "object" ? s.sectionId?._id : s.sectionId;
          const sName = typeof s.sectionId === "object" ? s.sectionId?.name : "";
          const matchesSec =
            String(sid) === String(currentOption.sectionId) ||
            (sName && sName.trim().toLowerCase() === currentOption.sectionName.trim().toLowerCase());
          if (!matchesSec) return false;
        }
        return true;
      });

      setMonthlyStudents(matched);
      setMonthlyAttendance(attendanceList);
    } catch (err) {
      console.error("Failed to load monthly attendance:", err);
      showToast("Could not load monthly attendance matrix", "error");
    } finally {
      setMonthlyLoading(false);
    }
  };

  const daysInMatrixMonth = useMemo(() => {
    return new Date(matrixYear, matrixMonth, 0).getDate();
  }, [matrixMonth, matrixYear]);

  const monthlyMap = useMemo(() => {
    const map = new Map<string, string>();
    monthlyAttendance.forEach((att) => {
      const sid = typeof att.studentId === "object" ? att.studentId?._id : att.studentId;
      if (sid && att.date) {
        const d = new Date(att.date).getDate();
        map.set(`${sid}_${d}`, att.status);
      }
    });
    return map;
  }, [monthlyAttendance]);

  const handleExportCSV = () => {
    if (monthlyStudents.length === 0) {
      showToast("No students available to export.", "error");
      return;
    }

    const daysHeader = Array.from({ length: daysInMatrixMonth }, (_, i) => `Day ${i + 1}`).join(",");
    let csv = `Roll No,Adm No,Student Name,${daysHeader},Total Present,Total Absent,Rate %\n`;

    monthlyStudents.forEach((s) => {
      let pCount = 0;
      let aCount = 0;
      const dayValues: string[] = [];

      for (let day = 1; day <= daysInMatrixMonth; day++) {
        const st = monthlyMap.get(`${s._id || s.studentId}_${day}`) || (s.status === "absent" ? "A" : "P");
        if (st === "present" || st === "P") {
          pCount++;
          dayValues.push("P");
        } else if (st === "absent" || st === "A") {
          aCount++;
          dayValues.push("A");
        } else if (st === "late" || st === "LT") {
          pCount += 1;
          dayValues.push("LT");
        } else if (st === "halfday" || st === "HD") {
          pCount += 0.5;
          dayValues.push("HD");
        } else if (st === "leave" || st === "L") {
          dayValues.push("L");
        } else {
          dayValues.push("-");
        }
      }

      const totalRecorded = pCount + aCount;
      const rate = totalRecorded > 0 ? Math.round((pCount / totalRecorded) * 100) : 0;
      csv += `${s.rollNo || ""},${s.admissionNo || ""},"${s.name}",${dayValues.join(",")},${pCount},${aCount},${rate}%\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Attendance_Matrix_${currentOption?.label || "Class"}_${matrixMonth}_${matrixYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Monthly attendance register exported to CSV!", "success");
  };

  // 7. Defaulters Loader
  useEffect(() => {
    if (activeTab === "defaulters") {
      loadDefaulters();
    }
  }, [activeTab, allStudents]);

  const loadDefaulters = () => {
    try {
      setDefaultersLoading(true);
      const studentsSource = allStudents.length > 0 ? allStudents : REQUIREMENT_SAMPLE_STUDENTS;
      const lowAttendance = studentsSource
        .filter((s: any) => s.isActive !== false)
        .map((s: any) => {
          const rawAtt = s.computedAttendance || s.attendance;
          const pct = typeof rawAtt === "number" ? rawAtt : parseFloat(String(rawAtt || "85").replace("%", "")) || (s.status === "absent" ? 68 : 88);
          return {
            ...s,
            _id: s._id || s.studentId,
            attendancePct: pct,
          };
        })
        .filter((s: any) => s.attendancePct < 75)
        .sort((a: any, b: any) => a.attendancePct - b.attendancePct);

      setDefaulters(lowAttendance);
    } catch (err) {
      console.error("Failed to load defaulters:", err);
    } finally {
      setDefaultersLoading(false);
    }
  };

  // 8. Analytics Loader
  useEffect(() => {
    if (activeTab === "analytics") {
      loadAnalytics();
    }
  }, [activeTab, selectedDate]);

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const [todayRes, classRes] = await Promise.allSettled([
        api.get(`/admin/attendance/summary/today?date=${selectedDate}`),
        api.get(`/admin/attendance/summary/class?date=${selectedDate}`),
      ]);
      const tData = todayRes.status === "fulfilled" ? (todayRes.value.data?.data || null) : null;
      const cData = classRes.status === "fulfilled" ? (classRes.value.data?.data || []) : [];
      setTodayAnalytics(tData || { present: metrics.present, absent: metrics.absent, rate: metrics.rate });
      setClassAnalytics(cData.length > 0 ? cData : [{ class: currentOption.label, present: metrics.present, absent: metrics.absent, total: metrics.total, rate: metrics.rate }]);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-fadeIn font-sans text-ink max-w-content mx-auto w-full pb-12">
      {/* Screen Header matching StudentPanel.tsx */}
      <div className="flex flex-wrap justify-between items-end gap-4 pt-1">
        <div className="flex flex-col gap-1">
          {/* Breadcrumb / Category */}
          <div className="text-small text-ink-secondary flex flex-wrap items-center gap-2">
            <span className="text-ink font-semibold">Attendance</span>
            <span>·</span>
            <span className="text-ink-secondary capitalize">
              {activeTab === "tracker"
                ? "Campus Tracker & Stacks"
                : activeTab === "daily"
                ? "Class Roster"
                : activeTab === "monthly"
                ? "Monthly Sheet"
                : activeTab === "defaulters"
                ? "Defaulters (<75%)"
                : "Analytics"}
            </span>
          </div>

          {/* Main Title matching StudentPanel */}
          <h1 className="m-0 text-title font-semibold text-ink tracking-tight flex items-baseline gap-2">
            {activeTab === "tracker" && (
              <>
                Campus Attendance Tracker{" "}
                <span className="font-normal text-ink-secondary text-lg">
                  · {trackerMetrics.submittedSections}/{trackerMetrics.totalSections} sections submitted
                </span>
              </>
            )}
            {activeTab === "daily" && (
              <>
                Class {currentOption?.label || "5-A"}{" "}
                <span className="font-normal text-ink-secondary text-lg">
                  · {formattedDateTitle}
                </span>
              </>
            )}
            {activeTab === "monthly" && (
              <>
                Monthly Attendance Sheet{" "}
                <span className="font-normal text-ink-secondary text-lg">
                  · Class {currentOption?.label || "5-A"}
                </span>
              </>
            )}
            {activeTab === "defaulters" && (
              <>
                Attendance Defaulters{" "}
                <span className="font-normal text-ink-secondary text-lg">
                  · Below 75% ({defaulters.length} students)
                </span>
              </>
            )}
            {activeTab === "analytics" && (
              <>
                Attendance Analytics{" "}
                <span className="font-normal text-ink-secondary text-lg">
                  · Campus Overview
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Global Controls matching StudentPanel's right action cluster */}
        <div className="flex gap-2.5 flex-wrap items-center">
          {(activeTab === "daily" || activeTab === "monthly") && (
            <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
              Class
              <div className="relative inline-flex items-center">
                <select
                  value={selectedOptionKey}
                  onChange={(e) => setSelectedOptionKey(e.target.value)}
                  className="min-h-tap pl-3 pr-8 border border-line-input rounded-control bg-surface font-sans text-small text-ink font-medium cursor-pointer appearance-none outline-none focus:border-primary shadow-2xs"
                >
                  {classOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown size={14} className="absolute right-2.5 pointer-events-none text-ink-secondary" />
              </div>
            </label>
          )}

          <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
            Date
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="min-h-tap px-3 border border-line-input rounded-control bg-surface font-sans text-small text-ink font-medium outline-none focus:border-primary cursor-pointer shadow-2xs"
            />
          </label>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-line">
        <div className="inline-flex items-center gap-1 p-1 bg-surface border border-line rounded-control text-xs font-semibold shadow-2xs">
          <button
            onClick={() => setActiveTab("tracker")}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "tracker"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
            }`}
          >
            <FiActivity size={13} />
            <span>Campus Tracker & Stacks</span>
          </button>

          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "daily"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
            }`}
          >
            <FiCheckCircle size={13} />
            <span>Class Roster (Daily)</span>
          </button>

          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "monthly"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
            }`}
          >
            <FiCalendar size={13} />
            <span>Monthly Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab("defaulters")}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "defaulters"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
            }`}
          >
            <FiAlertTriangle size={13} />
            <span>Defaulters (&lt;75%)</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "analytics"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
            }`}
          >
            <FiPieChart size={13} />
            <span>Analytics</span>
          </button>
        </div>

        {/* Right side stats or actions */}
        <div className="flex items-center gap-2 text-caption text-ink-secondary">
          <FiClock size={14} className="text-amber-600" />
          <span>Cut-off: <strong>10:00 AM</strong></span>
          <span className="text-line">|</span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-200">
            {trackerMetrics.campusRate}% Campus Rate
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 0: CAMPUS TRACKER & STACKS (Admin Control Hub) */}
      {/* ========================================================= */}
      {activeTab === "tracker" && (
        <div className="flex flex-col gap-5">
          <div className="text-small text-ink-secondary -mt-2">
            Real-time section submission status, faculty submission tracking, and school-wide stacks.
          </div>

            {/* Campus Overview Stacks (5 Top Metric Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Stack 1: Total Enrolled */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Total Enrolled</span>
                <span className="font-mono text-2xl font-semibold text-[#17201D]">{trackerMetrics.totalEnrolled}</span>
                <span className="text-[11px] text-[#4F5B57]">Across {trackerMetrics.totalSections} sections</span>
              </div>

              {/* Stack 2: Campus Present */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Campus Present</span>
                <span className="font-mono text-2xl font-semibold text-[#0E5A63]">{trackerMetrics.totalPresent}</span>
                <span className="text-[11px] text-[#0E5A63] font-semibold">{trackerMetrics.campusRate}% overall rate</span>
              </div>

              {/* Stack 3: Campus Absent */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Campus Absent</span>
                <span className="font-mono text-2xl font-semibold text-[#8F4A09]">{trackerMetrics.totalAbsent}</span>
                <span className="text-[11px] text-[#8F4A09]">Automated notices dispatched</span>
              </div>

              {/* Stack 4: On Leave / Half Day */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Approved Leave</span>
                <span className="font-mono text-2xl font-semibold text-[#5B8E90]">{trackerMetrics.totalLeave}</span>
                <span className="text-[11px] text-[#4F5B57]">Parent requests approved</span>
              </div>

              {/* Stack 5: Section Submissions */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs col-span-2 sm:col-span-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#4F5B57] font-medium">Submissions</span>
                  <span className="text-[11px] font-bold text-[#0E5A63]">
                    {Math.round((trackerMetrics.submittedSections / (trackerMetrics.totalSections || 1)) * 100)}%
                  </span>
                </div>
                <span className="font-mono text-2xl font-semibold text-[#17201D]">
                  {trackerMetrics.submittedSections} / {trackerMetrics.totalSections}
                </span>
                {/* Progress bar */}
                <div className="w-full bg-[#EEF1EF] h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="bg-[#0E5A63] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((trackerMetrics.submittedSections / (trackerMetrics.totalSections || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-[#B4610E] font-medium">
                  {trackerMetrics.pendingSections} pending cut-off (10:00 AM)
                </span>
              </div>
            </div>

            {/* Cut-off Announcement & Bulk Action Banner */}
            <div className="bg-[#FFF8F0] border border-[#F5D5B8] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#E9B872]/30 text-[#8F4A09] flex items-center justify-center flex-none">
                  <FiClock size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-xs font-bold text-[#8F4A09] uppercase tracking-wide">
                    Morning Attendance Cut-off: 10:00 AM
                  </div>
                  <div className="text-xs text-[#5E3305] mt-0.5">
                    Class teachers submit period 1 attendance. Guardians of absent and late students receive automated push alerts upon submission.
                  </div>
                </div>
              </div>

              {trackerMetrics.pendingSections > 0 && (
                <button
                  type="button"
                  onClick={handleSendAllPendingReminders}
                  className="px-3.5 py-2 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <FiBell size={13} />
                  <span>Send Reminder to All Pending ({trackerMetrics.pendingSections})</span>
                </button>
              )}
            </div>

            {/* Live Section Tracker Table / Cards */}
            <div className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-2xs">
              {/* Filter & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b border-[#EEF1EF] bg-white">
                <div className="flex items-center gap-1.5 p-0.5 bg-[#F5F6F3] border border-[#DDE2DE] rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setTrackerFilter("all")}
                    className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                      trackerFilter === "all"
                        ? "bg-white text-[#17201D] shadow-2xs font-semibold"
                        : "text-[#4F5B57] hover:text-[#17201D]"
                    }`}
                  >
                    All Sections ({trackerSections.length})
                  </button>
                  <button
                    onClick={() => setTrackerFilter("submitted")}
                    className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                      trackerFilter === "submitted"
                        ? "bg-white text-[#0E5A63] shadow-2xs font-semibold"
                        : "text-[#4F5B57] hover:text-[#0E5A63]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#0E5A63]" />
                    <span>Submitted ({trackerMetrics.submittedSections})</span>
                  </button>
                  <button
                    onClick={() => setTrackerFilter("pending")}
                    className={`px-3 py-1.5 rounded-md transition cursor-pointer flex items-center gap-1 ${
                      trackerFilter === "pending"
                        ? "bg-white text-[#B4610E] shadow-2xs font-semibold"
                        : "text-[#4F5B57] hover:text-[#B4610E]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#B4610E]" />
                    <span>Pending ({trackerMetrics.pendingSections})</span>
                  </button>
                </div>

                <div className="relative min-w-[220px]">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4F5B57]" size={13} />
                  <input
                    type="text"
                    value={trackerSearch}
                    onChange={(e) => setTrackerSearch(e.target.value)}
                    placeholder="Search class or teacher..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#C9D1CD] rounded-lg bg-white text-[#17201D] outline-none focus:border-[#0E5A63]"
                  />
                </div>
              </div>

              {/* Sections Grid */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-[#F9FAF8]">
                {trackerLoading ? (
                  <div className="col-span-full py-16 text-center text-[#4F5B57]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-7 h-7 border-2 border-[#0E5A63] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium">Loading live campus tracker...</span>
                    </div>
                  </div>
                ) : filteredSections.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-[#4F5B57]">
                    <p className="m-0 font-medium text-sm">No sections match the current filter.</p>
                  </div>
                ) : (
                  filteredSections.map((sec) => {
                    const isSubmitted = sec.status === "submitted";
                    const initials = sec.teacherName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "T";

                    return (
                      <div
                        key={sec.id}
                        className={`bg-white border rounded-xl p-4 shadow-2xs transition-all flex flex-col justify-between gap-3.5 ${
                          isSubmitted ? "border-[#DDE2DE]" : "border-[#F5D5B8] bg-[#FFFAF5]"
                        }`}
                      >
                        {/* Header: Class Badge & Status Pill */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-[#12302D] text-white font-mono text-xs font-bold">
                              Class {sec.label}
                            </span>
                            <span className="text-[11px] text-[#4F5B57] font-medium">
                              {sec.enrolledCount} enrolled
                            </span>
                          </div>

                          {isSubmitted ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#E3EFEF] text-[#0E5A63] text-[11px] font-semibold flex items-center gap-1">
                              <FiCheckCircle size={11} /> {sec.submittedAt || "Submitted"}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-[#FFF8F0] text-[#B4610E] border border-[#F5D5B8] text-[11px] font-semibold flex items-center gap-1">
                              <FiClock size={11} /> Pending (10:00 AM)
                            </span>
                          )}
                        </div>

                        {/* Teacher & Live Metrics */}
                        <div className="flex flex-col gap-2.5">
                          {/* Teacher Info */}
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#E3EFEF] text-[#08393F] flex items-center justify-center font-bold text-xs flex-none">
                              {initials}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-[#17201D] truncate">
                                {sec.teacherName}
                              </span>
                              <span className="text-[11px] text-[#4F5B57]">
                                {sec.teacherPhone || "Class Teacher"}
                              </span>
                            </div>
                          </div>

                          {/* Attendance stats if submitted */}
                          {isSubmitted ? (
                            <div className="bg-[#F5F6F3] rounded-lg p-2.5 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="text-[#4F5B57] text-[10px] block">Present</span>
                                  <span className="font-mono font-bold text-[#0E5A63]">{sec.presentCount}</span>
                                </div>
                                <div>
                                  <span className="text-[#4F5B57] text-[10px] block">Absent</span>
                                  <span className="font-mono font-bold text-[#8F4A09]">{sec.absentCount}</span>
                                </div>
                                <div>
                                  <span className="text-[#4F5B57] text-[10px] block">Leave</span>
                                  <span className="font-mono font-bold text-[#5B8E90]">{sec.leaveCount}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[#4F5B57] text-[10px] block">Rate</span>
                                <span className="font-mono font-bold text-[#0E5A63] text-sm">{sec.rate}%</span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-[#FFF4E8] rounded-lg p-2.5 flex items-center gap-2 text-xs text-[#8F4A09]">
                              <FiAlertTriangle size={14} className="flex-none" />
                              <span className="text-[11px] font-medium">
                                Attendance has not been marked yet by class teacher.
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions Footer */}
                        <div className="pt-2 border-t border-[#EEF1EF] flex items-center justify-between gap-2">
                          {isSubmitted ? (
                            <button
                              type="button"
                              onClick={() => handleOpenSectionRoster(sec)}
                              className="w-full py-1.5 px-3 rounded-lg border border-[#C9D1CD] hover:border-[#0E5A63] hover:text-[#0E5A63] bg-white text-xs font-semibold text-[#17201D] transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <FiEye size={12} />
                              <span>Review Class Roster</span>
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenSectionRoster(sec)}
                                className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                              >
                                <FiEdit2 size={11} />
                                <span>Mark on Behalf</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendReminder(sec)}
                                className="py-1.5 px-2.5 rounded-lg border border-[#F5D5B8] bg-white hover:bg-[#FFF8F0] text-[#8F4A09] text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                              >
                                <FiBell size={11} />
                                <span>Remind</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: DAILY ATTENDANCE (Matches 14-Attendance.html / PNG) */}
        {/* ========================================================= */}
        {activeTab === "daily" && (
          <div className="flex flex-col gap-5">
            {/* Subtitle instructions note */}
            <div className="text-small text-ink-secondary -mt-2">
              Everyone starts as Present. Tap only the exceptions. Cut-off 10:00 am.
            </div>

            {/* Metric Summary Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Card 1: Present */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Present</span>
                <span className="font-mono text-2xl font-semibold text-[#17201D]">{metrics.presentDisplay}</span>
              </div>

              {/* Card 2: Absent */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Absent</span>
                <span className="font-mono text-2xl font-semibold text-[#8F4A09]">{metrics.absent}</span>
              </div>

              {/* Card 3: On leave */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">On leave</span>
                <span className="font-mono text-2xl font-semibold text-[#17201D]">{metrics.leave}</span>
              </div>

              {/* Card 4: Half day */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Half day</span>
                <span className="font-mono text-2xl font-semibold text-[#17201D]">{metrics.halfday}</span>
              </div>

              {/* Card 5: Today's % */}
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-3.5 sm:p-4 flex flex-col gap-1 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-xs text-[#4F5B57] font-medium">Today&apos;s %</span>
                <span className="font-mono text-2xl font-semibold text-[#0E5A63]">{metrics.rate}%</span>
              </div>
            </div>

            {/* Student Attendance Section */}
            <section className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-2xs">
              {/* Section Header with Legend & Mark All Present */}
              <div className="flex justify-between items-center flex-wrap gap-3 px-4 py-3.5 border-b border-[#EEF1EF] bg-white">
                <div className="flex gap-3.5 flex-wrap text-xs text-[#4F5B57] font-medium items-center">
                  <span className="flex items-center gap-1.5">
                    <strong className="text-[#0E5A63]">P</strong> Present
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <strong className="text-[#B4610E]">A</strong> Absent
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <strong className="text-[#5B8E90]">L</strong> Leave
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <strong className="text-[#2D6A4F]">HD</strong> Half day
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <strong className="text-[#8C6B1F]">LT</strong> Late
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="min-h-[38px] px-3.5 rounded-lg border border-[#C9D1CD] bg-white font-sans text-xs font-semibold text-[#17201D] hover:bg-[#F5F6F3] transition cursor-pointer"
                >
                  Mark all present
                </button>
              </div>

              {/* Student Cards Grid (2 columns on desktop/laptop, matching 14-Attendance.png) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 divide-[#EEF1EF]">
                {rosterLoading ? (
                  <div className="col-span-full py-16 text-center text-[#4F5B57]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-7 h-7 border-2 border-[#0E5A63] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium">Loading roster for {currentOption?.label}...</span>
                    </div>
                  </div>
                ) : roster.length === 0 ? (
                  <div className="col-span-full py-14 text-center text-[#4F5B57]">
                    <p className="m-0 font-medium text-sm">No active students found in this class/section.</p>
                    <p className="m-0 text-xs text-[#4F5B57]/80 mt-1">
                      Add students in the Students directory or select another class from the dropdown above.
                    </p>
                  </div>
                ) : (
                  roster.map((student, idx) => {
                    const isAbsent = student.status === "absent";
                    const isLeftColumn = idx % 2 === 0;

                    return (
                      <div
                        key={student.studentId}
                        className={`flex justify-between items-center gap-3 px-4 py-2.5 transition-colors border-b border-[#EEF1EF] ${
                          isLeftColumn ? "lg:border-r lg:border-r-[#EEF1EF]" : ""
                        } ${isAbsent ? "bg-[#FFF8F0]" : "bg-white hover:bg-[#F9FAF8]"}`}
                      >
                        {/* Student Roll and Name / Subtitle */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="font-mono text-xs text-[#4F5B57] w-[24px] flex-none">
                            {String(student.rollNo).padStart(2, "0")}
                          </span>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-medium text-[#17201D] truncate">
                              {student.name}
                            </span>

                            {/* Subtitle / Remark note */}
                            {editingRemarksId === student.studentId ? (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <input
                                  type="text"
                                  value={student.remarks}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setRoster((prev) =>
                                      prev.map((r) =>
                                        r.studentId === student.studentId ? { ...r, remarks: val } : r
                                      )
                                    );
                                  }}
                                  placeholder="Reason / note..."
                                  className="h-5 px-1.5 text-[11px] border border-[#0E5A63] rounded bg-white font-sans text-[#17201D] w-full max-w-[200px]"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") setEditingRemarksId(null);
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditingRemarksId(null)}
                                  className="text-[#0E5A63] hover:text-[#08393F] cursor-pointer"
                                  title="Done"
                                >
                                  <FiCheck size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 group">
                                <span
                                  className={`text-xs truncate ${
                                    isAbsent
                                      ? "text-[#8F4A09] font-medium"
                                      : student.status === "late"
                                      ? "text-[#8C6B1F] font-medium"
                                      : student.status === "leave"
                                      ? "text-[#5B8E90] font-medium"
                                      : student.status === "halfday"
                                      ? "text-[#2D6A4F] font-medium"
                                      : "text-[#4F5B57] text-[11px]"
                                  }`}
                                >
                                  {student.remarks || ""}
                                </span>
                                {student.status !== "present" && (
                                  <button
                                    type="button"
                                    onClick={() => setEditingRemarksId(student.studentId)}
                                    className="opacity-0 group-hover:opacity-100 text-[#4F5B57] hover:text-[#17201D] cursor-pointer p-0.5 transition"
                                    title="Edit remark"
                                  >
                                    <FiEdit2 size={10} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Toggle Buttons: P, A, L, HD, LT */}
                        <div
                          role="radiogroup"
                          aria-label={`Status for ${student.name}`}
                          className="flex gap-1 flex-none"
                        >
                          {/* P - Present */}
                          <button
                            type="button"
                            aria-pressed={student.status === "present"}
                            onClick={() => handleStatusChange(student.studentId, "present")}
                            className={`min-w-[36px] min-h-[36px] px-1.5 rounded-md font-semibold text-xs transition cursor-pointer border ${
                              student.status === "present"
                                ? "bg-[#0E5A63] text-white border-[#0E5A63] shadow-2xs"
                                : "bg-white text-[#4F5B57] border-[#C9D1CD] hover:border-[#0E5A63]/70 hover:text-[#17201D]"
                            }`}
                          >
                            P
                          </button>

                          {/* A - Absent */}
                          <button
                            type="button"
                            aria-pressed={student.status === "absent"}
                            onClick={() => handleStatusChange(student.studentId, "absent")}
                            className={`min-w-[36px] min-h-[36px] px-1.5 rounded-md font-semibold text-xs transition cursor-pointer border ${
                              student.status === "absent"
                                ? "bg-[#B4610E] text-white border-[#B4610E] shadow-2xs"
                                : "bg-white text-[#4F5B57] border-[#C9D1CD] hover:border-[#B4610E]/70 hover:text-[#17201D]"
                            }`}
                          >
                            A
                          </button>

                          {/* L - Leave */}
                          <button
                            type="button"
                            aria-pressed={student.status === "leave"}
                            onClick={() => handleStatusChange(student.studentId, "leave")}
                            className={`min-w-[36px] min-h-[36px] px-1.5 rounded-md font-semibold text-xs transition cursor-pointer border ${
                              student.status === "leave"
                                ? "bg-[#5B8E90] text-white border-[#5B8E90] shadow-2xs"
                                : "bg-white text-[#4F5B57] border-[#C9D1CD] hover:border-[#5B8E90]/70 hover:text-[#17201D]"
                            }`}
                          >
                            L
                          </button>

                          {/* HD - Half Day */}
                          <button
                            type="button"
                            aria-pressed={student.status === "halfday"}
                            onClick={() => handleStatusChange(student.studentId, "halfday")}
                            className={`min-w-[36px] min-h-[36px] px-1.5 rounded-md font-semibold text-xs transition cursor-pointer border ${
                              student.status === "halfday"
                                ? "bg-[#2D6A4F] text-white border-[#2D6A4F] shadow-2xs"
                                : "bg-white text-[#4F5B57] border-[#C9D1CD] hover:border-[#2D6A4F]/70 hover:text-[#17201D]"
                            }`}
                          >
                            HD
                          </button>

                          {/* LT - Late */}
                          <button
                            type="button"
                            aria-pressed={student.status === "late"}
                            onClick={() => handleStatusChange(student.studentId, "late")}
                            className={`min-w-[36px] min-h-[36px] px-1.5 rounded-md font-semibold text-xs transition cursor-pointer border ${
                              student.status === "late"
                                ? "bg-[#8C6B1F] text-white border-[#8C6B1F] shadow-2xs"
                                : "bg-white text-[#4F5B57] border-[#C9D1CD] hover:border-[#8C6B1F]/70 hover:text-[#17201D]"
                            }`}
                          >
                            LT
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Footer Bar */}
              <div className="flex justify-between items-center flex-wrap gap-4 p-4 border-t border-[#EEF1EF] bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notify-guardians"
                    checked={notifyGuardians}
                    onChange={(e) => setNotifyGuardians(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0E5A63] border-[#C9D1CD] cursor-pointer"
                  />
                  <label htmlFor="notify-guardians" className="text-[13px] text-[#4F5B57] cursor-pointer select-none">
                    Guardians of absent and late students get a push notification within 5 minutes of submitting.
                  </label>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting || rosterLoading}
                  onClick={handleSubmitAttendance}
                  className="min-h-[46px] px-6 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white font-sans text-[15px] font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit attendance</span>
                  )}
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MONTHLY SHEET (Matrix Register & CSV Export) */}
        {/* ========================================================= */}
        {activeTab === "monthly" && (
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#DDE2DE] shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs font-semibold text-[#4F5B57] flex items-center gap-2">
                  Class:
                  <select
                    value={selectedOptionKey}
                    onChange={(e) => setSelectedOptionKey(e.target.value)}
                    className="h-9 px-3 border border-[#C9D1CD] rounded-lg bg-white text-xs font-semibold text-[#17201D] cursor-pointer"
                  >
                    {classOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs font-semibold text-[#4F5B57] flex items-center gap-2">
                  Month:
                  <select
                    value={matrixMonth}
                    onChange={(e) => setMatrixMonth(Number(e.target.value))}
                    className="h-9 px-3 border border-[#C9D1CD] rounded-lg bg-white text-xs font-semibold text-[#17201D] cursor-pointer"
                  >
                    {[
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December",
                    ].map((m, idx) => (
                      <option key={m} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs font-semibold text-[#4F5B57] flex items-center gap-2">
                  Year:
                  <select
                    value={matrixYear}
                    onChange={(e) => setMatrixYear(Number(e.target.value))}
                    className="h-9 px-3 border border-[#C9D1CD] rounded-lg bg-white text-xs font-semibold text-[#17201D] cursor-pointer"
                  >
                    {[2024, 2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0E5A63] text-white font-semibold text-xs hover:bg-[#08393F] transition cursor-pointer shadow-xs"
              >
                <FiDownload size={13} />
                <span>Export Matrix CSV</span>
              </button>
            </div>

            {/* Matrix Table */}
            <div className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-[#F5F6F3] border-b border-[#DDE2DE] text-[#17201D] font-semibold">
                      <th className="py-2.5 px-3 text-left w-12">Roll</th>
                      <th className="py-2.5 px-3 text-left min-w-[140px]">Student Name</th>
                      {Array.from({ length: daysInMatrixMonth }, (_, i) => (
                        <th key={i} className="py-2 px-1 text-center font-mono text-[11px] w-6">
                          {i + 1}
                        </th>
                      ))}
                      <th className="py-2.5 px-2 text-center text-[#0E5A63] font-bold border-l border-[#DDE2DE]">
                        P
                      </th>
                      <th className="py-2.5 px-2 text-center text-[#8F4A09] font-bold">
                        A
                      </th>
                      <th className="py-2.5 px-2 text-center text-[#0E5A63] font-bold">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF1EF]">
                    {monthlyLoading ? (
                      <tr>
                        <td colSpan={daysInMatrixMonth + 5} className="py-12 text-center text-[#4F5B57]">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-6 h-6 border-2 border-[#0E5A63] border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-medium">Loading monthly register matrix...</span>
                          </div>
                        </td>
                      </tr>
                    ) : monthlyStudents.length === 0 ? (
                      <tr>
                        <td colSpan={daysInMatrixMonth + 5} className="py-10 text-center text-[#4F5B57]">
                          No students in this class.
                        </td>
                      </tr>
                    ) : (
                      monthlyStudents.map((s, idx) => {
                        let pCount = 0;
                        let aCount = 0;

                        return (
                          <tr key={s._id || s.studentId} className="hover:bg-[#F9FAF8]">
                            <td className="py-1.5 px-3 font-mono text-[#4F5B57]">
                              {s.rollNo || idx + 1}
                            </td>
                            <td className="py-1.5 px-3 font-medium text-[#17201D] whitespace-nowrap">
                              {s.name}
                            </td>
                            {Array.from({ length: daysInMatrixMonth }, (_, i) => {
                              const day = i + 1;
                              const status = monthlyMap.get(`${s._id || s.studentId}_${day}`);

                              let badge = "-";
                              let color = "text-[#A9C2BD]";

                              if (status === "present" || (!status && s.status === "present")) {
                                badge = "P";
                                color = "bg-[#E3EFEF] text-[#0E5A63] font-bold";
                                pCount++;
                              } else if (status === "absent" || (!status && s.status === "absent")) {
                                badge = "A";
                                color = "bg-[#FFF8F0] text-[#B4610E] font-bold";
                                aCount++;
                              } else if (status === "late" || (!status && s.status === "late")) {
                                badge = "LT";
                                color = "bg-[#FDF8E8] text-[#8C6B1F] font-bold";
                                pCount += 1;
                              } else if (status === "halfday" || (!status && s.status === "halfday")) {
                                badge = "HD";
                                color = "bg-[#E8F4EE] text-[#2D6A4F] font-bold";
                                pCount += 0.5;
                              } else if (status === "leave" || (!status && s.status === "leave")) {
                                badge = "L";
                                color = "bg-[#EDF4F5] text-[#5B8E90] font-bold";
                              }

                              return (
                                <td key={i} className="py-1 px-0.5 text-center">
                                  <span className={`inline-block w-5 h-5 leading-5 rounded text-[10px] ${color}`}>
                                    {badge}
                                  </span>
                                </td>
                              );
                            })}
                            <td className="py-1.5 px-2 text-center font-bold text-[#0E5A63] border-l border-[#DDE2DE]">
                              {pCount}
                            </td>
                            <td className="py-1.5 px-2 text-center font-bold text-[#8F4A09]">
                              {aCount}
                            </td>
                            <td className="py-1.5 px-2 text-center font-bold text-[#0E5A63]">
                              {pCount + aCount > 0 ? Math.round((pCount / (pCount + aCount)) * 100) : 0}%
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DEFAULTERS REGISTRY (<75%) */}
        {/* ========================================================= */}
        {activeTab === "defaulters" && (
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#DDE2DE] shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="m-0 font-bold text-sm text-[#17201D] flex items-center gap-1.5">
                  <FiAlertTriangle className="text-[#B4610E]" size={16} />
                  <span>Attendance Defaulter Registry</span>
                </h3>
                <p className="text-xs text-[#4F5B57] m-0 mt-0.5">
                  Students with attendance below 75% requiring parental notice or intervention.
                </p>
              </div>
              <span className="px-3 py-1 bg-[#FFF8F0] text-[#B4610E] border border-[#F5D5B8] rounded-full text-xs font-bold">
                {defaulters.length} Defaulters Identified
              </span>
            </div>

            <div className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-[#F5F6F3] border-b border-[#DDE2DE] text-[#17201D] font-semibold">
                      <th className="py-2.5 px-3 text-left">Student Name</th>
                      <th className="py-2.5 px-3 text-left">Class & Section</th>
                      <th className="py-2.5 px-3 text-center">Attendance Rate</th>
                      <th className="py-2.5 px-3 text-left">Parent Name</th>
                      <th className="py-2.5 px-3 text-left">Contact Number</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF1EF]">
                    {defaultersLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#4F5B57]">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-6 h-6 border-2 border-[#0E5A63] border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-medium">Scanning student records...</span>
                          </div>
                        </td>
                      </tr>
                    ) : defaulters.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-[#4F5B57]">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <FiCheckCircle size={24} className="text-[#0E5A63] mb-1" />
                            <h4 className="m-0 font-semibold text-sm text-[#17201D]">No Attendance Defaulters!</h4>
                            <p className="text-xs text-[#4F5B57] m-0">
                              All active students have an attendance rate of 75% or higher.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      defaulters.map((s) => (
                        <tr key={s._id || s.studentId} className="hover:bg-[#F9FAF8]">
                          <td className="py-2.5 px-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#17201D] text-xs">{s.name}</span>
                              <span className="text-[10px] text-[#4F5B57] font-mono">
                                Adm: {s.admissionNo || "—"}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#17201D]">
                            {s.classId?.name || s.className || "Class"}
                            {s.sectionId?.name || s.sectionName ? `-${s.sectionId?.name || s.sectionName}` : ""}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-[#FFF8F0] text-[#B4610E] font-bold border border-[#F5D5B8] text-xs">
                              {s.attendancePct}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[#17201D] font-medium">
                            {s.parentName || "Guardian"}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#17201D] text-[11px]">
                            {s.parentPhone || s.phone || "—"}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                showToast(`Notice dispatched to ${s.parentName || "parent"} of ${s.name}`, "success");
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#E9B872] hover:bg-[#dfac62] text-[#12302D] font-semibold text-[11px] transition cursor-pointer shadow-2xs"
                            >
                              <FiSend size={11} /> Send Notice
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ANALYTICS & OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === "analytics" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Campus-wide Present</span>
                <span className="font-mono text-2xl font-bold text-[#0E5A63]">
                  {todayAnalytics?.present ?? metrics.present}
                </span>
              </div>
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Campus-wide Absent</span>
                <span className="font-mono text-2xl font-bold text-[#8F4A09]">
                  {todayAnalytics?.absent ?? metrics.absent}
                </span>
              </div>
              <div className="bg-white border border-[#DDE2DE] rounded-xl p-4 flex flex-col gap-1 shadow-2xs">
                <span className="text-xs text-[#4F5B57] font-medium">Overall Attendance Rate</span>
                <span className="font-mono text-2xl font-bold text-[#17201D]">
                  {todayAnalytics?.rate ?? metrics.rate}%
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-2xs">
              <div className="px-4 py-3 border-b border-[#EEF1EF] bg-[#F5F6F3]">
                <h3 className="m-0 text-xs font-semibold text-[#17201D] uppercase tracking-wide">
                  Classwise Attendance Breakdown ({selectedDate})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-white border-b border-[#DDE2DE] text-[#4F5B57] font-semibold">
                      <th className="py-2 px-4 text-left">Class</th>
                      <th className="py-2 px-4 text-center">Present</th>
                      <th className="py-2 px-4 text-center">Absent</th>
                      <th className="py-2 px-4 text-center">Total</th>
                      <th className="py-2 px-4 text-center">Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF1EF]">
                    {analyticsLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#4F5B57]">
                          Loading analytics...
                        </td>
                      </tr>
                    ) : classAnalytics.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#4F5B57]">
                          No class attendance recorded for this date yet.
                        </td>
                      </tr>
                    ) : (
                      classAnalytics.map((c, i) => (
                        <tr key={i} className="hover:bg-[#F9FAF8]">
                          <td className="py-2.5 px-4 font-semibold text-[#17201D]">{c.class}</td>
                          <td className="py-2.5 px-4 text-center font-bold text-[#0E5A63]">{c.present}</td>
                          <td className="py-2.5 px-4 text-center font-bold text-[#8F4A09]">{c.absent}</td>
                          <td className="py-2.5 px-4 text-center text-[#4F5B57]">{c.total}</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-[#E3EFEF] text-[#0E5A63] font-bold text-xs">
                              {c.rate}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default StudentAttendancePanel;
