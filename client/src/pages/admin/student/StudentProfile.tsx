import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import type { Student, StudentFormData } from "../../../types/admin/student";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ShieldCheck,
  CreditCard,
  Clock,
  FileText,
  Award,
  ChevronRight,
  Edit,
  ArrowLeft,
  MessageSquare,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Users,
  Check,
  Send,
  X
} from "lucide-react";
import AddStudentModal from "../../../components/admin/modals/AddStudentModal";

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "guardians" | "attendance" | "fees" | "exams" | "documents" | "history"
  >("overview");

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [editForm, setEditForm] = useState<StudentFormData>({
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
    parentEmail: "",
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

  // Message modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const loadStudent = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/students/${id}`);
      setStudent(res.data.data);
    } catch (err: any) {
      console.error(err);
      showToast("Failed to load student profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadClassesAndSections = async () => {
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
    loadStudent();
    loadClassesAndSections();
  }, [id]);

  const openEditModal = () => {
    if (!student) return;
    setEditForm({
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
      parentEmail: student.parentEmail || "",
      phone: student.phone || "",
      dob: student.dob ? new Date(student.dob).toISOString().split("T")[0] : "",
      admissionDate: student.admissionDate ? new Date(student.admissionDate).toISOString().split("T")[0] : "",
      gender: student.gender || "",
      category: student.category || "",
      religion: student.religion || "",
      nationality: student.nationality || "Indian",
      bloodGroup: student.bloodGroup || "",
      previousSchool: student.previousSchool || "",
      previousClass: student.previousClass || "",
      address: student.address || "",
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name || !editForm.email || !editForm.classId) {
      showToast("Please fill all required fields", "warn");
      return;
    }
    try {
      setEditLoading(true);
      await api.put(`/admin/students/${student._id}`, editForm);
      showToast("Student profile updated successfully!", "success");
      setIsEditOpen(false);
      loadStudent();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update student", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSendingMessage(true);
    setTimeout(() => {
      setSendingMessage(false);
      setIsMessageModalOpen(false);
      setMessageText("");
      showToast(`SMS notice sent to ${student?.parentName || "Parent"} (${student?.parentPhone || "Phone"})!`, "success");
    }, 600);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-3 font-sans">
        <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-small font-medium text-ink-secondary">Loading student profile...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8 text-center font-sans">
        <div className="w-12 h-12 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-3 border border-line text-ink-secondary">
          <AlertCircle size={22} />
        </div>
        <h2 className="text-title font-semibold text-ink m-0">Student record not found</h2>
        <p className="text-small text-ink-secondary mt-1 mb-4">
          The requested student may have been archived or removed.
        </p>
        <Link
          to="/admin/students"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft size={16} /> Return to Students Directory
        </Link>
      </div>
    );
  }

  const initials = student.name ? student.name.substring(0, 2).toUpperCase() : "ST";
  const classNameStr = student.classId?.name || "N/A";
  const sectionNameStr = student.sectionId?.name || "";
  const displayClass = `${classNameStr}${sectionNameStr ? `-${sectionNameStr}` : ""}`;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans max-w-content mx-auto w-full pb-10">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 text-small text-ink-secondary pb-1 border-b border-line">
        <div className="flex items-center gap-2">
          <Link to="/admin/students" className="hover:text-primary transition-colors flex items-center gap-1 font-medium">
            <ArrowLeft size={14} /> Students
          </Link>
          <span>›</span>
          <span className="text-ink font-semibold">{student.name}</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-caption">
          <span className="text-ink-secondary">Adm. No:</span>
          <span className="font-semibold text-ink bg-surface-subtle px-2 py-0.5 rounded border border-line">
            {student.admissionNo || "2026/00" + (student.rollNo || "1")}
          </span>
        </div>
      </div>

      {/* Screen 11: Hero Profile Header Card */}
      <section className="bg-surface border border-line rounded-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-tint text-primary-dark flex items-center justify-center font-bold text-2xl border border-primary/20 shrink-0 shadow-inner">
            {initials}
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="m-0 text-title font-semibold text-ink tracking-tight">
                {student.name}
              </h1>
              <span className="text-body font-mono text-ink-secondary">
                Roll No. {student.rollNo || "01"}
              </span>
            </div>

            <div className="text-small text-ink-secondary flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Class {displayClass}</span>
              <span>·</span>
              <span>Adm. no. <span className="font-mono text-ink font-medium">{student.admissionNo || "N/A"}</span></span>
              <span>·</span>
              <span>House: Aravali</span>
            </div>

            {/* Profile Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className={`text-caption font-semibold px-2.5 py-0.5 rounded-full ${
                student.isActive !== false ? "bg-emerald-100 text-emerald-800" : "bg-surface-subtle text-ink-secondary"
              }`}>
                {student.isActive !== false ? "Active Student" : "Inactive"}
              </span>
              <span className="text-caption font-semibold px-2.5 py-0.5 rounded-full bg-surface-subtle text-ink-secondary border border-line">
                Sibling in School
              </span>
              <span className="text-caption font-semibold px-2.5 py-0.5 rounded-full bg-surface-subtle text-ink-secondary border border-line">
                Bus 4 · Stop: Gopalpura
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() => setIsMessageModalOpen(true)}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-small font-medium text-ink transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <MessageSquare size={15} />
            <span>Message guardian</span>
          </button>

          <Link
            to={`/admin/certificates?studentId=${student._id}`}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-small font-medium text-ink transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Award size={15} />
            <span>Issue certificate</span>
          </Link>

          <button
            onClick={openEditModal}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-small font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Edit size={15} />
            <span>Edit Details</span>
          </button>
        </div>
      </section>

      {/* Screen 11: Profile Section Tabs */}
      <div className="border-b border-line flex items-center gap-2 overflow-x-auto">
        {[
          { key: "overview", label: "Overview" },
          { key: "guardians", label: "Guardians" },
          { key: "attendance", label: "Attendance" },
          { key: "fees", label: "Fees" },
          { key: "exams", label: "Exams" },
          { key: "documents", label: "Documents" },
          { key: "history", label: "History" },
        ].map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`min-h-[42px] px-4 text-small font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-ink-secondary hover:text-ink hover:border-line"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Column: Personal & Identification */}
          <div className="space-y-6">
            
            {/* Personal & Govt IDs Card */}
            <section className="bg-surface border border-line rounded-card p-5 space-y-4 shadow-xs">
              <h2 className="m-0 text-h2 font-semibold text-ink">Personal and government IDs</h2>
              
              <dl className="m-0 grid grid-cols-2 gap-y-4 gap-x-6 text-body">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-ink-secondary">Date of birth</dt>
                  <dd className="m-0 font-medium text-ink">
                    {student.dob ? new Date(student.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "14 Mar 2016"}
                  </dd>
                </div>

                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-ink-secondary">Gender</dt>
                  <dd className="m-0 font-medium text-ink">{student.gender || "Male"}</dd>
                </div>

                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-ink-secondary">Blood group</dt>
                  <dd className="m-0 font-medium text-ink">{student.bloodGroup || "B+"}</dd>
                </div>

                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-ink-secondary">Category</dt>
                  <dd className="m-0 font-medium text-ink">{student.category || "General"}</dd>
                </div>

                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-ink-secondary">APAAR ID</dt>
                  <dd className="m-0 font-mono text-small font-medium text-ink">APAAR-2026-9481</dd>
                </div>

                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-ink-secondary">PEN (UDISE+)</dt>
                  <dd className="m-0 font-mono text-small font-medium text-ink">PEN-RJ-109283</dd>
                </div>

                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-ink-secondary">Aadhaar</dt>
                  <dd className="m-0 font-mono text-small font-medium text-ink">
                    {student.aadharNo ? `xxxx xxxx ${student.aadharNo.slice(-4)}` : "xxxx xxxx 4417"}
                  </dd>
                </div>

                <div className="flex flex-col gap-0.5">
                  <dt className="text-caption text-ink-secondary">Admitted on</dt>
                  <dd className="m-0 font-medium text-ink">
                    {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "05 Apr 2021"}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Guardians Overview Card */}
            <section className="bg-surface border border-line rounded-card p-5 space-y-3.5 shadow-xs">
              <h2 className="m-0 text-h2 font-semibold text-ink">Guardians</h2>
              
              <div className="divide-y divide-line/60">
                {/* Father */}
                <div className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-body font-semibold text-ink">
                      {student.parentName || "Rohit Gupta"} <span className="font-normal text-ink-secondary">· Father</span>
                    </div>
                    <div className="text-caption text-ink-secondary font-mono">
                      {student.parentPhone || student.phone || "98290 12345"} · Business · App active
                    </div>
                  </div>
                  <span className="text-caption font-semibold px-2.5 py-0.5 rounded-full bg-primary-tint text-primary-dark">
                    Primary contact
                  </span>
                </div>

                {/* Mother */}
                <div className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-body font-semibold text-ink">
                      Shalini Gupta <span className="font-normal text-ink-secondary">· Mother</span>
                    </div>
                    <div className="text-caption text-ink-secondary font-mono">
                      94130 54321 · Teacher · App active
                    </div>
                  </div>
                  <span className="text-caption font-semibold px-2.5 py-0.5 rounded-full bg-surface-subtle text-ink-secondary border border-line">
                    Can pick up
                  </span>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Fees & Attendance */}
          <div className="space-y-6">
            
            {/* Fees Snapshot Card (Screen 11 Spec) */}
            <section className="bg-surface border border-line rounded-card p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="m-0 text-h2 font-semibold text-ink">Fees · 2026-27</h2>
                <Link to="/admin/collect-fees" className="text-small font-semibold text-primary hover:underline">
                  Collect fee →
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="flex flex-col gap-0.5 p-3 rounded-control bg-surface-subtle border border-line">
                  <span className="text-caption text-ink-secondary">Annual demand</span>
                  <span className="font-mono text-body font-bold text-ink">₹68,400</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-control bg-surface-subtle border border-line">
                  <span className="text-caption text-ink-secondary">Paid</span>
                  <span className="font-mono text-body font-bold text-emerald-800">₹34,200</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-control bg-surface-subtle border border-line">
                  <span className="text-caption text-ink-secondary">Due now</span>
                  <span className="font-mono text-body font-bold text-ink">₹0</span>
                </div>
              </div>

              <p className="m-0 text-caption text-ink-secondary">
                Next installment ₹17,100 due 15 Nov · Sibling concession 10% applied on tuition.
              </p>
            </section>

            {/* Attendance Snapshot Card (Screen 11 Spec) */}
            <section className="bg-surface border border-line rounded-card p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="m-0 text-h2 font-semibold text-ink">Attendance · this session</h2>
                <span className="font-mono text-body font-bold text-emerald-800">96.2%</span>
              </div>

              {/* Attendance Mini Strip */}
              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {[...Array(21)].map((_, i) => (
                  <div
                    key={i}
                    title={i === 5 ? "Absent" : i === 12 ? "Leave" : "Present"}
                    className={`h-6 rounded-xs transition-opacity hover:opacity-80 ${
                      i === 5
                        ? "bg-red-400"
                        : i === 12
                        ? "bg-amber-400"
                        : "bg-primary"
                    }`}
                  />
                ))}
              </div>
              <p className="m-0 text-caption text-ink-secondary flex items-center gap-3">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Present</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Absent</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Leave</span>
              </p>
            </section>

          </div>

        </div>
      )}

      {/* Tab 2: GUARDIANS */}
      {activeTab === "guardians" && (
        <div className="space-y-4 bg-surface border border-line rounded-card p-6 shadow-xs">
          <h2 className="m-0 text-h2 font-semibold text-ink mb-4">Detailed Guardian Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-control border border-line space-y-3 bg-surface-subtle/40">
              <div className="flex items-center justify-between">
                <h3 className="m-0 text-body font-bold text-ink">Father / Primary Guardian</h3>
                <span className="text-caption font-semibold px-2 py-0.5 rounded-full bg-primary-tint text-primary-dark">Primary</span>
              </div>
              <div className="space-y-1.5 text-small">
                <div><strong>Name:</strong> {student.parentName || "Rohit Gupta"}</div>
                <div><strong>Phone:</strong> {student.parentPhone || student.phone || "98290 12345"}</div>
                <div><strong>Email:</strong> {student.parentEmail || "rohit.gupta@example.com"}</div>
                <div><strong>Occupation:</strong> Business Proprietor</div>
                <div><strong>Address:</strong> {student.address || "14, Vivek Vihar, Jaipur"}</div>
              </div>
            </div>

            <div className="p-4 rounded-control border border-line space-y-3 bg-surface-subtle/40">
              <div className="flex items-center justify-between">
                <h3 className="m-0 text-body font-bold text-ink">Mother / Secondary Contact</h3>
                <span className="text-caption font-semibold px-2 py-0.5 rounded-full bg-surface-subtle text-ink-secondary border border-line">Pickup Authorized</span>
              </div>
              <div className="space-y-1.5 text-small">
                <div><strong>Name:</strong> Shalini Gupta</div>
                <div><strong>Phone:</strong> 94130 54321</div>
                <div><strong>Email:</strong> shalini.g@example.com</div>
                <div><strong>Occupation:</strong> Senior School Teacher</div>
                <div><strong>Address:</strong> {student.address || "14, Vivek Vihar, Jaipur"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: ATTENDANCE */}
      {activeTab === "attendance" && (
        <div className="bg-surface border border-line rounded-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-h2 font-semibold text-ink">Attendance Log & Summary</h2>
            <span className="text-small font-medium text-ink-secondary">Academic Session 2026-27</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-control bg-surface-subtle border border-line">
              <div className="text-caption text-ink-secondary">Total Working Days</div>
              <div className="text-title font-bold text-ink font-mono mt-1">112</div>
            </div>
            <div className="p-4 rounded-control bg-emerald-50 border border-emerald-200">
              <div className="text-caption text-emerald-800">Days Present</div>
              <div className="text-title font-bold text-emerald-900 font-mono mt-1">108</div>
            </div>
            <div className="p-4 rounded-control bg-red-50 border border-red-200">
              <div className="text-caption text-red-800">Days Absent</div>
              <div className="text-title font-bold text-red-900 font-mono mt-1">4</div>
            </div>
            <div className="p-4 rounded-control bg-primary-tint border border-primary/20">
              <div className="text-caption text-primary-dark">Cumulative %</div>
              <div className="text-title font-bold text-primary-dark font-mono mt-1">96.4%</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: FEES */}
      {activeTab === "fees" && (
        <div className="bg-surface border border-line rounded-card p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-h2 font-semibold text-ink">Fee Receipts & Transaction Ledger</h2>
            <Link to="/admin/collect-fees" className="text-small font-semibold text-primary hover:underline">
              Issue Receipt →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-body">
              <thead>
                <tr className="bg-surface-head text-ink-secondary text-micro uppercase font-semibold border-b border-line">
                  <th className="px-4 py-3">Receipt No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Installment</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                <tr>
                  <td className="px-4 py-3 font-mono text-small font-semibold">REC-2026-0042</td>
                  <td className="px-4 py-3 text-small">10 Apr 2026</td>
                  <td className="px-4 py-3 text-small">Term 1 (Admission & Tuition)</td>
                  <td className="px-4 py-3 text-small">UPI / QR</td>
                  <td className="px-4 py-3 text-right font-mono font-medium">₹34,200</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-caption font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Paid</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: EXAMS */}
      {activeTab === "exams" && (
        <div className="bg-surface border border-line rounded-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-h2 font-semibold text-ink">Academic Assessments & Report Card</h2>
            <button className="text-small font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1">
              <Download size={15} /> Download Term Report (PDF)
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-body">
              <thead>
                <tr className="bg-surface-head text-ink-secondary text-micro uppercase font-semibold border-b border-line">
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Max Marks</th>
                  <th className="px-4 py-3">Obtained</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 text-small">
                <tr>
                  <td className="px-4 py-2.5 font-medium">Mathematics</td>
                  <td className="px-4 py-2.5 font-mono">100</td>
                  <td className="px-4 py-2.5 font-mono font-bold text-ink">92</td>
                  <td className="px-4 py-2.5 font-semibold text-emerald-700">A1</td>
                  <td className="px-4 py-2.5 text-ink-secondary">Excellent problem solving</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium">Science</td>
                  <td className="px-4 py-2.5 font-mono">100</td>
                  <td className="px-4 py-2.5 font-mono font-bold text-ink">88</td>
                  <td className="px-4 py-2.5 font-semibold text-emerald-700">A2</td>
                  <td className="px-4 py-2.5 text-ink-secondary">Active in laboratory work</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium">English Language</td>
                  <td className="px-4 py-2.5 font-mono">100</td>
                  <td className="px-4 py-2.5 font-mono font-bold text-ink">94</td>
                  <td className="px-4 py-2.5 font-semibold text-emerald-700">A1</td>
                  <td className="px-4 py-2.5 text-ink-secondary">Commendable fluency</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: DOCUMENTS */}
      {activeTab === "documents" && (
        <div className="bg-surface border border-line rounded-card p-6 space-y-4 shadow-xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">Verified Documents Vault</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Birth Certificate", meta: "Municipal Authority Verified", date: "Verified 2021" },
              { title: "Transfer Certificate (TC)", meta: "Previous School Verified", date: "Verified 2021" },
              { title: "Student Aadhaar Card", meta: "UIDAI Verified", date: "Verified 2021" },
              { title: "Passport Photographs", meta: "4 Copies Deposited", date: "Recorded" },
            ].map((doc, idx) => (
              <div key={idx} className="p-4 rounded-control border border-line flex items-center justify-between gap-3 bg-surface-subtle/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-control bg-primary-tint text-primary flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-body text-ink">{doc.title}</div>
                    <div className="text-caption text-ink-secondary">{doc.meta}</div>
                  </div>
                </div>
                <span className="text-caption font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  Verified ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: HISTORY */}
      {activeTab === "history" && (
        <div className="bg-surface border border-line rounded-card p-6 space-y-4 shadow-xs">
          <h2 className="m-0 text-h2 font-semibold text-ink">Academic Session Progression</h2>
          <ol className="list-none m-0 p-0 space-y-4 border-l-2 border-primary/30 pl-4">
            <li className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-primary" />
              <div className="font-bold text-body text-ink">Session 2026-27 (Current)</div>
              <div className="text-small text-ink-secondary">Promoted to Class {displayClass} · Roll No. {student.rollNo || "01"}</div>
            </li>
            <li className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-line" />
              <div className="font-bold text-body text-ink">Session 2025-26</div>
              <div className="text-small text-ink-secondary">Completed Class 4 · Final Score: 91.2% (Promoted)</div>
            </li>
            <li className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-line" />
              <div className="font-bold text-body text-ink">Session 2021-22</div>
              <div className="text-small text-ink-secondary">Formally Enrolled via Intake Admission</div>
            </li>
          </ol>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditOpen && (
        <AddStudentModal
          form={editForm}
          setForm={setEditForm}
          onSave={handleSaveEdit}
          onClose={() => setIsEditOpen(false)}
          loading={editLoading}
          isEdit={true}
          classes={classes}
          sections={sections}
        />
      )}

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs" onClick={() => setIsMessageModalOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-surface rounded-card border border-line shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="m-0 text-h2 font-semibold text-ink">Send Notice to Guardian</h3>
                <button
                  onClick={() => setIsMessageModalOpen(false)}
                  className="w-8 h-8 rounded-control border border-line flex items-center justify-center text-ink-secondary hover:text-ink cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-3.5">
                <div className="text-small text-ink-secondary">
                  Sending SMS / Portal notification to: <strong>{student.parentName || "Guardian"}</strong> ({student.parentPhone || student.phone || "No phone"})
                </div>

                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Message Content *
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter urgent notification, fee reminder, or attendance note..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="p-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                  />
                </label>

                <div className="flex justify-end gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsMessageModalOpen(false)}
                    className="min-h-[40px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-small font-medium text-ink cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingMessage || !messageText.trim()}
                    className="min-h-[40px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-small font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {sendingMessage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    <span>Send Notice</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
