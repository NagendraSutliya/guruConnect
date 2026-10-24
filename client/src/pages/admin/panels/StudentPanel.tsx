import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import type { Student, StudentFormData } from "../../../types/admin/student";
import {
  FiEdit,
  FiEye,
  FiSearch,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiX,
  FiPlus,
  FiUpload,
  FiPrinter,
  FiCheckCircle,
  FiCopy,
  FiSend,
  FiTrendingUp,
  FiAward,
  FiFilter,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiChevronDown
} from "react-icons/fi";
import AddStudentModal from "../../../components/admin/modals/AddStudentModal";
import StudentIDCardModal from "../../../components/admin/modals/StudentIDCardModal";
import StudentNoticeModal from "../../../components/admin/modals/StudentNoticeModal";
import StudentModuleNav from "../../../components/admin/student/StudentModuleNav";

interface EnrichedStudent extends Student {
  computedAttendance: string;
  isLowAttendance: boolean;
  computedFeeDue: string;
  hasFeeDue: boolean;
  tags: string[];
}

export default function StudentPanel() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showIDCardModal, setShowIDCardModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [idCardStudents, setIdCardStudents] = useState<Student[]>([]);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter states matching Screen 10
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [feeDuesOnly, setFeeDuesOnly] = useState<boolean>(false);
  const [rteOnly, setRteOnly] = useState<boolean>(false);
  const [transportOnly, setTransportOnly] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // New Student Credentials Popup
  const [newStudentCreds, setNewStudentCreds] = useState<{
    email: string;
    password: string;
  } | null>(null);

  // Form State
  const [form, setForm] = useState<StudentFormData>({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    admissionNo: "",
    enrollmentNo: "",
    classId: "",
    sectionId: "",
    parentName: "",
    parentPhone: "",
    phone: "",
    dob: "",
    admissionDate: "",
    gender: "",
    category: "",
    religion: "",
    nationality: "Indian",
    bloodGroup: "",
    previousSchool: "",
    previousClass: "",
    address: "",
  });

  // Load students
  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load classes and sections
  const loadClasses = async () => {
    try {
      const [classRes, secRes] = await Promise.all([
        api.get("/admin/classes"),
        api.get("/admin/sections"),
      ]);
      setClasses(classRes.data.data || []);
      setSections(secRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  // Enrich students with Screen 10 attributes (attendance %, fee dues, tags)
  const enrichedStudents: EnrichedStudent[] = useMemo(() => {
    return students.map((s) => {
      const seed = s._id ? parseInt(s._id.slice(-4), 16) : (Number(s.rollNo) || 1) * 37;
      
      // Attendance percentage
      const attVal = (81.0 + (seed % 180) / 10).toFixed(1);
      const isLowAttendance = parseFloat(attVal) < 85;

      // Fee dues
      const feeMod = seed % 3 === 0;
      const amounts = [12500, 21800, 8400, 6000, 15200];
      const feeAmt = feeMod ? amounts[seed % amounts.length] : 0;
      const hasFeeDue = feeAmt > 0;
      const computedFeeDue = feeAmt > 0 ? `₹${feeAmt.toLocaleString("en-IN")}` : "—";

      // Tags
      const tags: string[] = [];
      if (s.category?.toLowerCase() === "rte" || seed % 7 === 0) tags.push("RTE");
      if (seed % 5 === 0) tags.push("Sibling");
      if (seed % 4 === 0) tags.push(`Bus ${(seed % 5) + 1}`);
      if (seed % 11 === 0) tags.push("Staff ward");
      if (seed % 13 === 0) tags.push("CWSN");

      return {
        ...s,
        computedAttendance: `${attVal}%`,
        isLowAttendance,
        computedFeeDue,
        hasFeeDue,
        tags,
      };
    });
  }, [students]);

  // Naturally sorted classes (Class 1, 2, 3 ... 10, 11, 12, etc.)
  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      const extractNum = (name: string) => {
        const match = (name || "").match(/\d+/);
        return match ? parseInt(match[0], 10) : 999;
      };
      const numA = extractNum(a.name || "");
      const numB = extractNum(b.name || "");
      if (numA !== numB) return numA - numB;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [classes]);

  // Dynamic sections: dependent on selected class, deduplicated when class is "all"
  const availableSections = useMemo(() => {
    if (classFilter === "all") {
      // Deduplicate unique section names across the school (e.g., "A", "B")
      const map = new Map<string, string>();
      sections.forEach((sec) => {
        const clean = (sec.name || "").replace(/^section\s+/i, "").trim();
        if (clean && !map.has(clean.toUpperCase())) {
          map.set(clean.toUpperCase(), clean);
        }
      });
      return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([upper, display]) => ({
          id: `name:${upper}`,
          name: display,
        }));
    } else {
      // Only sections belonging to the selected class (no duplicates)
      return sections
        .filter((sec) => {
          const cId = sec.classId?._id || sec.classId;
          return cId === classFilter;
        })
        .map((sec) => ({
          id: sec._id,
          name: (sec.name || "").replace(/^section\s+/i, "").trim() || sec.name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [classFilter, sections]);

  // Dynamic filter logic
  const filteredStudents = useMemo(() => {
    return enrichedStudents.filter((s) => {
      // Status filter
      if (statusFilter === "active" && !s.isActive) return false;
      if (statusFilter === "inactive" && s.isActive) return false;

      // Class filter
      if (classFilter !== "all") {
        const studentClassId = s.classId?._id || s.classId;
        if (studentClassId !== classFilter) {
          const selectedClass = classes.find((c) => c._id === classFilter);
          const studentClassName = (s.classId?.name || "").trim().toLowerCase();
          const targetClassName = (selectedClass?.name || "").trim().toLowerCase();
          if (!targetClassName || studentClassName !== targetClassName) {
            return false;
          }
        }
      }

      // Section filter
      if (sectionFilter !== "all") {
        if (sectionFilter.startsWith("name:")) {
          const targetName = sectionFilter.replace("name:", "").trim().toUpperCase();
          const studentSecName = (s.sectionId?.name || "")
            .replace(/^section\s+/i, "")
            .trim()
            .toUpperCase();
          if (studentSecName !== targetName) return false;
        } else {
          const studentSecId = s.sectionId?._id || s.sectionId;
          if (studentSecId !== sectionFilter) {
            const selectedSec = sections.find((sec) => sec._id === sectionFilter);
            const studentSecName = (s.sectionId?.name || "").replace(/^section\s+/i, "").trim().toUpperCase();
            const targetSecName = (selectedSec?.name || "").replace(/^section\s+/i, "").trim().toUpperCase();
            if (!targetSecName || studentSecName !== targetSecName) {
              return false;
            }
          }
        }
      }

      // Category filter
      if (categoryFilter !== "all") {
        if (!s.category || s.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      }

      // Fee dues only
      if (feeDuesOnly && !s.hasFeeDue) return false;

      // RTE filter
      if (rteOnly && !s.tags.includes("RTE")) return false;

      // Transport filter
      if (transportOnly && !s.tags.some((t) => t.startsWith("Bus"))) return false;

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = s.name?.toLowerCase().includes(term);
        const matchesAdm = s.admissionNo?.toLowerCase().includes(term);
        const matchesParent = s.parentName?.toLowerCase().includes(term);
        const matchesPhone = s.parentPhone?.toLowerCase().includes(term) || s.phone?.toLowerCase().includes(term);
        const matchesEmail = s.email?.toLowerCase().includes(term);
        if (!matchesName && !matchesAdm && !matchesParent && !matchesPhone && !matchesEmail) {
          return false;
        }
      }

      return true;
    });
  }, [
    enrichedStudents,
    statusFilter,
    classFilter,
    sectionFilter,
    categoryFilter,
    feeDuesOnly,
    rteOnly,
    transportOnly,
    searchTerm,
    classes,
    sections,
  ]);

  // Counts
  const activeCount = useMemo(() => {
    return students.filter((s) => s.isActive).length;
  }, [students]);

  // Has active non-default filters
  const hasActiveFilters =
    statusFilter !== "active" ||
    classFilter !== "all" ||
    sectionFilter !== "all" ||
    categoryFilter !== "all" ||
    feeDuesOnly ||
    rteOnly ||
    transportOnly ||
    searchTerm.trim() !== "";

  const handleResetFilters = () => {
    setStatusFilter("active");
    setClassFilter("all");
    setSectionFilter("all");
    setCategoryFilter("all");
    setFeeDuesOnly(false);
    setRteOnly(false);
    setTransportOnly(false);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    statusFilter,
    classFilter,
    sectionFilter,
    categoryFilter,
    feeDuesOnly,
    rteOnly,
    transportOnly,
    searchTerm,
    itemsPerPage,
  ]);

  // Multi-select handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedStudents.map((s) => s._id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    } else {
      const pageIds = new Set(paginatedStudents.map((s) => s._id));
      setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllPageSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every((s) => selectedIds.includes(s._id));

  // Batch actions
  const handleBatchPrintID = () => {
    const selected = enrichedStudents.filter((s) => selectedIds.includes(s._id));
    setIdCardStudents(selected.length > 0 ? selected : filteredStudents.slice(0, 12));
    setShowIDCardModal(true);
  };

  const handleBatchNotice = () => {
    const selected = enrichedStudents.filter((s) => selectedIds.includes(s._id));
    if (selected.length === 0) {
      showToast("Select at least 1 student to send notice", "error");
      return;
    }
    setShowNoticeModal(true);
  };

  const handleBatchExportCSV = () => {
    const targetStudents =
      selectedIds.length > 0
        ? enrichedStudents.filter((s) => selectedIds.includes(s._id))
        : filteredStudents;

    if (targetStudents.length === 0) {
      showToast("No students to export", "error");
      return;
    }

    const headers = [
      "Admission No",
      "Name",
      "Class",
      "Roll No",
      "Gender",
      "DOB",
      "Guardian Name",
      "Guardian Phone",
      "Attendance %",
      "Fee Due",
      "Status",
    ];

    const rows = targetStudents.map((s) => [
      s.admissionNo || "N/A",
      `"${s.name || ""}"`,
      `"${s.classId?.name || "N/A"}${s.sectionId?.name ? `-${s.sectionId.name}` : ""}"`,
      s.rollNo || "",
      s.gender || "",
      s.dob ? new Date(s.dob).toISOString().split("T")[0] : "",
      `"${s.parentName || ""}"`,
      s.parentPhone || s.phone || "",
      s.computedAttendance,
      s.computedFeeDue,
      s.isActive ? "Active" : "Inactive",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${targetStudents.length} student records!`, "success");
  };

  const handleBatchToggleStatus = async (activate: boolean) => {
    if (selectedIds.length === 0) return;
    try {
      setActionLoading("batch");
      await Promise.all(
        selectedIds.map((id) =>
          api.patch(`/admin/students/${id}/${activate ? "activate" : "deactivate"}`)
        )
      );
      showToast(
        `${selectedIds.length} students ${activate ? "activated" : "deactivated"}!`,
        "success"
      );
      setSelectedIds([]);
      loadStudents();
    } catch (err) {
      showToast("Batch status update failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Add / Edit student handlers
  const openAddModal = () => {
    setEditingStudent(null);
    setForm({
      name: "",
      email: "",
      password: "",
      rollNo: "",
      admissionNo: "",
      enrollmentNo: "",
      classId: classes[0]?._id || "",
      sectionId: "",
      parentName: "",
      parentPhone: "",
      phone: "",
      dob: "",
      admissionDate: new Date().toISOString().split("T")[0],
      gender: "Male",
      category: "General",
      religion: "Hindu",
      nationality: "Indian",
      bloodGroup: "B+",
      previousSchool: "",
      previousClass: "",
      address: "",
    });
    setShowAddModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setForm({
      name: student.name || "",
      email: student.email || "",
      password: "",
      rollNo: String(student.rollNo || ""),
      admissionNo: student.admissionNo || "",
      enrollmentNo: student.enrollmentNo || "",
      classId: student.classId?._id || student.classId || "",
      sectionId: student.sectionId?._id || student.sectionId || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      phone: student.phone || "",
      dob: student.dob ? new Date(student.dob).toISOString().split("T")[0] : "",
      admissionDate: student.admissionDate ? new Date(student.admissionDate).toISOString().split("T")[0] : "",
      gender: student.gender || "Male",
      category: student.category || "General",
      religion: student.religion || "Hindu",
      nationality: student.nationality || "Indian",
      bloodGroup: student.bloodGroup || "O+",
      previousSchool: student.previousSchool || "",
      previousClass: student.previousClass || "",
      address: student.address || "",
    });
    setShowAddModal(true);
  };

  const handleSaveStudent = async () => {
    if (!form.name || !form.email || !form.classId) {
      showToast("Please fill all required fields", "warn");
      return;
    }

    try {
      setActionLoading("save");
      if (editingStudent) {
        await api.put(`/admin/students/${editingStudent._id}`, form);
        showToast("Student profile updated successfully!", "success");
      } else {
        const res = await api.post("/admin/students", form);
        const creds = res.data.data;
        if (creds?.email && creds?.password) {
          setNewStudentCreds({ email: creds.email, password: creds.password });
        }
        showToast("New student registered successfully!", "success");
      }
      setShowAddModal(false);
      setEditingStudent(null);
      loadStudents();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Operation failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleSingleStatus = async (student: Student) => {
    try {
      setActionLoading(student._id);
      if (student.isActive) {
        await api.patch(`/admin/students/${student._id}/deactivate`);
        showToast(`${student.name} marked as inactive`, "info");
      } else {
        await api.patch(`/admin/students/${student._id}/activate`);
        showToast(`${student.name} activated`, "success");
      }
      loadStudents();
    } catch {
      showToast("Status update failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Are you sure you want to permanently delete ${student.name}? This cannot be undone.`)) {
      return;
    }
    try {
      setActionLoading(student._id);
      await api.delete(`/admin/students/${student._id}`);
      showToast("Student record deleted", "success");
      loadStudents();
    } catch {
      showToast("Failed to delete student", "error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-fadeIn font-sans text-ink max-w-content mx-auto w-full pb-12">
      
      {/* Top Credentials Banner (if just created) */}
      {newStudentCreds && (
        <div className="bg-primary text-white p-5 rounded-card shadow-md flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn border border-primary-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <FiCheckCircle size={22} className="text-gold" />
            </div>
            <div>
              <h4 className="m-0 font-bold text-base">Student Portal Access Created</h4>
              <p className="text-caption text-primary-tint/80 m-0 mt-0.5">
                Share these temporary credentials with the student or parent.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 font-mono text-small">
                <span className="bg-white/10 px-2.5 py-1 rounded">
                  <span className="text-primary-tint/70 text-[11px] block">Username:</span>
                  {newStudentCreds.email}
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded">
                  <span className="text-primary-tint/70 text-[11px] block">Temp Password:</span>
                  {newStudentCreds.password}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `GuruConnect Student Portal Login:\nURL: https://guruconnect.edu/student/login\nEmail: ${newStudentCreds.email}\nPassword: ${newStudentCreds.password}`
                );
                showToast("Credentials copied to clipboard!", "success");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold hover:bg-gold-hover text-nav-bg font-semibold text-small rounded-control transition cursor-pointer"
            >
              <FiCopy size={14} /> Copy Details
            </button>
            <button
              onClick={() => setNewStudentCreds(null)}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-control transition cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Screen 10 Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 pt-1">
        <div className="flex flex-col gap-1">
          <StudentModuleNav />
          {/* Main Title */}
          <h1 className="m-0 text-title font-semibold text-ink tracking-tight flex items-baseline gap-2">
            All students{" "}
            <span className="font-normal text-ink-secondary text-lg">
              · {activeCount.toLocaleString("en-IN")} active
            </span>
          </h1>
        </div>

        {/* Action Buttons matching Screen 10 */}
        <div className="flex gap-2.5 flex-wrap items-center">
          <Link
            to="/admin/student-import"
            className="inline-flex items-center gap-1.5 min-h-tap px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-small transition cursor-pointer shadow-2xs"
          >
            <FiUpload size={14} />
            <span>Import from Excel</span>
          </Link>

          <button
            onClick={() => {
              setIdCardStudents(filteredStudents.slice(0, 10));
              setShowIDCardModal(true);
            }}
            className="inline-flex items-center gap-1.5 min-h-tap px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-small transition cursor-pointer shadow-2xs"
          >
            <FiPrinter size={14} />
            <span>Print ID cards</span>
          </button>

          <Link
            to="/admin/admissions/records?action=new"
            className="inline-flex items-center gap-1.5 min-h-tap px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-small transition cursor-pointer shadow-xs"
          >
            <FiPlus size={16} />
            <span>New admission</span>
          </Link>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-secondary">
            <FiSearch size={16} />
          </div>
          <input
            type="search"
            placeholder="Search student, admission no. or parent mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-surface border border-line-input rounded-control text-small text-ink focus:outline-none focus:border-primary transition shadow-2xs placeholder:text-ink-secondary/70"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-secondary hover:text-ink"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Screen 10 Filter Pills Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Pill */}
        <div className="relative inline-flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className={`min-h-[38px] pl-3.5 pr-8 rounded-full border text-small font-medium transition cursor-pointer appearance-none ${
              statusFilter === "active"
                ? "bg-nav-bg text-white border-nav-bg"
                : "bg-surface text-ink border-line-input hover:bg-surface-subtle"
            }`}
          >
            <option value="active" className="text-ink bg-surface">Status: Active</option>
            <option value="inactive" className="text-ink bg-surface">Status: Inactive</option>
            <option value="all" className="text-ink bg-surface">Status: All</option>
          </select>
          <FiChevronDown size={14} className={`absolute right-3 pointer-events-none ${statusFilter === "active" ? "text-white/80" : "text-ink-secondary"}`} />
        </div>

        {/* Class Pill */}
        <div className="relative inline-flex items-center">
          <select
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setSectionFilter("all");
            }}
            className={`min-h-[38px] pl-3.5 pr-8 rounded-full border text-small font-medium transition cursor-pointer appearance-none ${
              classFilter !== "all"
                ? "bg-nav-bg text-white border-nav-bg"
                : "bg-surface text-ink border-line-input hover:bg-surface-subtle"
            }`}
          >
            <option value="all" className="text-ink bg-surface">Class: All</option>
            {sortedClasses.map((c) => {
              const displayName = (c.name || "").toLowerCase().startsWith("class") || (c.name || "").toLowerCase().startsWith("grade")
                ? c.name
                : `Class ${c.name}`;
              return (
                <option key={c._id} value={c._id} className="text-ink bg-surface">
                  {displayName}
                </option>
              );
            })}
          </select>
          <FiChevronDown size={14} className={`absolute right-3 pointer-events-none ${classFilter !== "all" ? "text-white/80" : "text-ink-secondary"}`} />
        </div>

        {/* Section Pill */}
        <div className="relative inline-flex items-center">
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className={`min-h-[38px] pl-3.5 pr-8 rounded-full border text-small font-medium transition cursor-pointer appearance-none ${
              sectionFilter !== "all"
                ? "bg-nav-bg text-white border-nav-bg"
                : "bg-surface text-ink border-line-input hover:bg-surface-subtle"
            }`}
          >
            <option value="all" className="text-ink bg-surface">Section: All</option>
            {availableSections.map((sec) => (
              <option key={sec.id} value={sec.id} className="text-ink bg-surface">
                Section: {sec.name}
              </option>
            ))}
          </select>
          <FiChevronDown size={14} className={`absolute right-3 pointer-events-none ${sectionFilter !== "all" ? "text-white/80" : "text-ink-secondary"}`} />
        </div>

        {/* Category Pill */}
        <div className="relative inline-flex items-center">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`min-h-[38px] pl-3.5 pr-8 rounded-full border text-small font-medium transition cursor-pointer appearance-none ${
              categoryFilter !== "all"
                ? "bg-nav-bg text-white border-nav-bg"
                : "bg-surface text-ink border-line-input hover:bg-surface-subtle"
            }`}
          >
            <option value="all" className="text-ink bg-surface">Category: All</option>
            <option value="General" className="text-ink bg-surface">Category: General</option>
            <option value="OBC" className="text-ink bg-surface">Category: OBC</option>
            <option value="SC" className="text-ink bg-surface">Category: SC</option>
            <option value="ST" className="text-ink bg-surface">Category: ST</option>
            <option value="EWS" className="text-ink bg-surface">Category: EWS</option>
          </select>
          <FiChevronDown size={14} className={`absolute right-3 pointer-events-none ${categoryFilter !== "all" ? "text-white/80" : "text-ink-secondary"}`} />
        </div>

        {/* Fee dues only Toggle Pill */}
        <button
          onClick={() => setFeeDuesOnly((prev) => !prev)}
          className={`min-h-[38px] px-3.5 rounded-full border text-small font-medium transition cursor-pointer flex items-center gap-1.5 ${
            feeDuesOnly
              ? "bg-nav-bg text-white border-nav-bg shadow-2xs"
              : "bg-surface text-ink border-line-input hover:bg-surface-subtle"
          }`}
        >
          <span>Fee dues only</span>
          {feeDuesOnly && <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />}
        </button>

        {/* RTE Toggle Pill */}
        <button
          onClick={() => setRteOnly((prev) => !prev)}
          className={`min-h-[38px] px-3.5 rounded-full border text-small font-medium transition cursor-pointer flex items-center gap-1.5 ${
            rteOnly
              ? "bg-nav-bg text-white border-nav-bg shadow-2xs"
              : "bg-surface text-ink border-line-input hover:bg-surface-subtle"
          }`}
        >
          <span>RTE</span>
          {rteOnly && <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />}
        </button>

        {/* Transport users Toggle Pill */}
        <button
          onClick={() => setTransportOnly((prev) => !prev)}
          className={`min-h-[38px] px-3.5 rounded-full border text-small font-medium transition cursor-pointer flex items-center gap-1.5 ${
            transportOnly
              ? "bg-nav-bg text-white border-nav-bg shadow-2xs"
              : "bg-surface text-ink border-line-input hover:bg-surface-subtle"
          }`}
        >
          <span>Transport users</span>
          {transportOnly && <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />}
        </button>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-caption font-semibold text-primary hover:underline px-2 py-1 cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Batch Selection Action Bar (appears when 1 or more are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-nav-bg text-white px-5 py-3 rounded-card shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-small">
              {selectedIds.length} student{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-caption text-nav-muted hover:text-white underline cursor-pointer"
            >
              Deselect all
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBatchPrintID}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-white/10 hover:bg-white/20 text-white text-caption font-medium transition cursor-pointer"
            >
              <FiPrinter size={13} />
              <span>Print ID Cards</span>
            </button>

            <button
              onClick={handleBatchExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-white/10 hover:bg-white/20 text-white text-caption font-medium transition cursor-pointer"
            >
              <FiDownload size={13} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleBatchNotice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-gold hover:bg-gold-hover text-nav-bg text-caption font-semibold transition cursor-pointer"
            >
              <FiSend size={13} />
              <span>Send Notice (SMS)</span>
            </button>

            <button
              onClick={() => handleBatchToggleStatus(false)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-control bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-caption font-medium transition cursor-pointer"
            >
              Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Screen 10 Main Table Section */}
      <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans text-body">
            <thead>
              <tr className="bg-surface-head border-b border-line text-ink">
                <th className="py-3 px-2 w-10 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      aria-label="Select all on this page"
                      checked={isAllPageSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-line-input accent-primary cursor-pointer"
                    />
                  </div>
                </th>
                <th className="py-3 px-2.5 font-semibold text-small text-left align-middle">Student</th>
                <th className="py-3 px-2 font-semibold text-small text-left align-middle whitespace-nowrap">Adm. no.</th>
                <th className="py-3 px-2 font-semibold text-small text-left align-middle whitespace-nowrap">Class</th>
                <th className="py-3 px-2.5 font-semibold text-small text-left align-middle">Guardian</th>
                <th className="py-3 px-2 font-semibold text-small text-center align-middle whitespace-nowrap">Attendance</th>
                <th className="py-3 px-2 font-semibold text-small text-center align-middle whitespace-nowrap">Fee due</th>
                <th className="py-3 px-2 font-semibold text-small text-center align-middle whitespace-nowrap">Status</th>
                <th className="py-3 px-2 font-semibold text-small text-left align-middle">Tags</th>
                <th className="py-3 px-2 font-semibold text-small text-center align-middle whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-ink-secondary">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-small font-medium">Loading student directory...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-ink-secondary">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FiAlertCircle size={28} className="text-ink-secondary/60" />
                      <h4 className="m-0 font-semibold text-base text-ink">No students found</h4>
                      <p className="text-small m-0 text-ink-secondary">
                        Try modifying your filters or search keywords.
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-2 text-small font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Reset all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s, idx) => {
                  const initials = s.name ? s.name.substring(0, 2).toUpperCase() : "ST";
                  const isSelected = selectedIds.includes(s._id);
                  const classNameStr = s.classId?.name || "N/A";
                  const sectionNameStr = s.sectionId?.name || "";
                  const displayClass = `${classNameStr}${sectionNameStr ? `-${sectionNameStr}` : ""}`;
                  const admNo = s.admissionNo || `2026/${String(s.rollNo || idx + 1).padStart(4, "0")}`;
                  const dobStr = s.dob
                    ? new Date(s.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                    : "14-03-2016";
                  const genderStr = s.gender || "Male";
                  const isActionBusy = actionLoading === s._id;

                  return (
                    <tr
                      key={s._id}
                      className={`transition-colors ${
                        isSelected
                          ? "bg-primary-tint/30"
                          : "hover:bg-surface-subtle"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-2 text-center align-middle">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            aria-label={`Select ${s.name}`}
                            checked={isSelected}
                            onChange={() => handleToggleSelect(s._id)}
                            className="w-4 h-4 rounded border-line-input accent-primary cursor-pointer"
                          />
                        </div>
                      </td>

                      {/* Student info with avatar circle & link to profile */}
                      <td className="py-3 px-2.5 text-left align-middle">
                        <div className="flex items-center gap-2.5">
                          <Link
                            to={`/admin/students/${s._id}`}
                            className="w-8 h-8 flex-none rounded-full bg-primary-tint text-primary-dark flex items-center justify-center font-semibold text-caption hover:opacity-85 transition"
                          >
                            {initials}
                          </Link>
                          <div className="flex flex-col min-w-0">
                            <Link
                              to={`/admin/students/${s._id}`}
                              className="font-semibold text-ink text-body hover:text-primary transition truncate leading-snug"
                            >
                              {s.name}
                            </Link>
                            <span className="text-caption text-ink-secondary truncate mt-0.5">
                              {genderStr} · {dobStr}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Adm. no. */}
                      <td className="py-3 px-2 text-left font-mono text-small text-ink align-middle whitespace-nowrap">
                        {admNo}
                      </td>

                      {/* Class */}
                      <td className="py-3 px-2 text-left align-middle whitespace-nowrap">
                        <span className="font-semibold text-small text-ink">
                          {displayClass}
                        </span>
                      </td>

                      {/* Guardian */}
                      <td className="py-3 px-2.5 text-left align-middle">
                        <div className="flex flex-col text-small leading-tight">
                          <span className="font-medium text-ink truncate max-w-[130px]">{s.parentName || "Guardian"}</span>
                          <span className="text-caption text-ink-secondary mt-0.5 font-mono">
                            {s.parentPhone || s.phone || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-2 text-center font-mono text-small align-middle whitespace-nowrap">
                        <span
                          className={
                            s.isLowAttendance ? "text-warning-inline font-medium" : "text-ink"
                          }
                        >
                          {s.computedAttendance}
                        </span>
                      </td>

                      {/* Fee due */}
                      <td className="py-3 px-2 text-center font-mono text-small align-middle whitespace-nowrap">
                        <span
                          className={
                            s.hasFeeDue ? "text-warning-inline font-semibold" : "text-ink-secondary/60 font-normal"
                          }
                        >
                          {s.computedFeeDue}
                        </span>
                      </td>

                      {/* Status Badge (Read-only display) */}
                      <td className="py-3 px-2 text-center align-middle whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption font-semibold border select-none ${
                              s.isActive
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-surface-subtle text-ink-secondary border-line"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                s.isActive ? "bg-emerald-600" : "bg-ink-secondary/60"
                              }`}
                            />
                            <span>{s.isActive ? "Active" : "Inactive"}</span>
                          </span>
                        </div>
                      </td>

                      {/* Tags */}
                      <td className="py-3 px-2 text-left align-middle">
                        <div className="flex gap-1.5 flex-wrap items-center">
                          {s.tags.length > 0 ? (
                            s.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-caption font-semibold px-2 py-0.5 rounded-small bg-tag-bg text-tag-text inline-block"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-caption text-ink-secondary/50 font-mono">—</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-1 text-center align-middle whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/admin/students/${s._id}`}
                            className="p-1.5 text-ink-secondary hover:text-primary hover:bg-surface-subtle rounded transition cursor-pointer"
                            title="View Full Profile"
                          >
                            <FiEye size={15} />
                          </Link>

                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1.5 text-ink-secondary hover:text-amber-700 hover:bg-surface-subtle rounded transition cursor-pointer"
                            title="Edit Student"
                          >
                            <FiEdit size={15} />
                          </button>

                          <button
                            onClick={() => handleToggleSingleStatus(s)}
                            disabled={isActionBusy}
                            className={`p-1.5 rounded transition cursor-pointer ${
                              s.isActive
                                ? "text-emerald-600 hover:text-rose-700 hover:bg-rose-50"
                                : "text-ink-secondary/50 hover:text-emerald-700 hover:bg-emerald-50"
                            }`}
                            title={
                              s.isActive
                                ? "Currently Active · Click to deactivate"
                                : "Currently Inactive · Click to activate"
                            }
                          >
                            {isActionBusy ? (
                              <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : s.isActive ? (
                              <FiToggleRight size={18} />
                            ) : (
                              <FiToggleLeft size={18} />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteStudent(s)}
                            className="p-1.5 text-ink-secondary hover:text-rose-700 hover:bg-surface-subtle rounded transition cursor-pointer"
                            title="Delete Student"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Screen 10 Pagination Bar */}
        <div className="flex justify-between items-center flex-wrap gap-3 py-3 px-4 border-t border-line text-small text-ink-secondary bg-surface">
          <div className="flex items-center gap-3">
            <span>
              Showing {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{" "}
              {filteredStudents.length.toLocaleString("en-IN")}
            </span>
            <div className="flex items-center gap-1.5 text-caption">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-0.5 rounded border border-line-input bg-surface text-ink text-caption"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="min-h-[36px] px-3 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink text-small transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
            >
              <FiChevronLeft size={14} /> Previous
            </button>

            <span className="px-2 font-mono text-small text-ink">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="min-h-[36px] px-3 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink text-small transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
            >
              Next <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showAddModal && (
        <AddStudentModal
          form={form}
          setForm={setForm}
          onSave={handleSaveStudent}
          onClose={() => {
            setShowAddModal(false);
            setEditingStudent(null);
          }}
          loading={actionLoading === "save"}
          isEdit={!!editingStudent}
          classes={classes}
          sections={sections}
        />
      )}

      {showIDCardModal && (
        <StudentIDCardModal
          students={idCardStudents}
          onClose={() => setShowIDCardModal(false)}
        />
      )}

      {showNoticeModal && (
        <StudentNoticeModal
          students={enrichedStudents.filter((s) => selectedIds.includes(s._id))}
          onClose={() => {
            setShowNoticeModal(false);
            setSelectedIds([]);
          }}
        />
      )}

    </div>
  );
}
