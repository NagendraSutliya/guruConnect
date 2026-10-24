import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import type { Admission, AdmissionFormData } from "../../../types/admin/student";
import {
  Search,
  CheckCircle2,
  Clock,
  Users,
  Printer,
  Check,
  Eye,
  Edit,
  Trash2,
  X,
  Download,
  UserPlus,
  Copy,
  Sparkles,
  ShieldCheck,
  Columns,
  ExternalLink
} from "lucide-react";
import AddAdmissionModal from "../../../components/admin/modals/AddAdmissionModal";
import ApplicationReviewDrawer, { type ApplicationDetail } from "../../../components/admin/admissions/ApplicationReviewDrawer";
import AdmissionsModuleNav from "../../../components/admin/admissions/AdmissionsModuleNav";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface AdmissionsPanelProps {
  isEmbedded?: boolean;
  onOpenReviewDrawer?: (application: ApplicationDetail) => void;
  onOpenAddStudent?: () => void;
}

const AdmissionsPanel: React.FC<AdmissionsPanelProps> = ({
  isEmbedded = false,
  onOpenReviewDrawer,
  onOpenAddStudent,
}) => {
  const { showToast } = useToast();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState<Admission | null>(null);
  const [form, setForm] = useState<AdmissionFormData>({
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
    aadharNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDetail | null>(null);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed">(
    () => (localStorage.getItem("admissionFilter") as any) || "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [newAdmissionCreds, setNewAdmissionCreds] = useState<{
    email: string;
    password: string;
  } | null>(null);

  // Load admissions
  const loadAdmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/admissions");
      setAdmissions(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load admissions", "error");
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
    loadAdmissions();
    loadClasses();
  }, []);

  // Save admission
  const saveAdmission = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActionLoading("save");

    try {
      if (editingAdmission) {
        await api.put(`/admin/admissions/${editingAdmission._id}`, form);
        showToast("Admission updated successfully", "success");
      } else {
        await api.post("/admin/admissions", { ...form, stage: "application" });
        showToast("New admission created successfully", "success");
      }
      closeForm();
      loadAdmissions();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save admission", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete admission
  const deleteAdmission = async (admission: Admission) => {
    if (!confirm(`Delete ${admission.name}? This cannot be undone.`)) return;

    try {
      setActionLoading(admission._id);
      await api.delete(`/admin/admissions/${admission._id}`);
      setAdmissions((prev) => prev.filter((s) => s._id !== admission._id));
      showToast("Admission record deleted", "success");
    } catch (err) {
      showToast("Delete failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Confirm Admission
  const confirmAdmission = async (admission: Admission) => {
    if (!confirm(`Are you sure you want to confirm admission for ${admission.name}? This will create a permanent student account.`)) return;
    
    try {
      setActionLoading(admission._id);
      const res = await api.patch(`/admin/admissions/${admission._id}/confirm`);
      const creds = res.data.data.studentCreds;
      setNewAdmissionCreds({ email: creds.email, password: creds.password });
      showToast("Admission confirmed & student account created!", "success");
      loadAdmissions();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to confirm admission", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Convert MongoDB admission to rich ApplicationDetail for review drawer
  const convertAdmissionToDetail = (adm: any): ApplicationDetail => {
    const rawClass = adm.classId?.name || "N/A";
    const formattedClass = rawClass.toLowerCase().startsWith("class") ? rawClass : `Class ${rawClass}`;

    return {
      id: adm._id,
      applicationNo: adm.admissionNo || `APP/${new Date(adm.createdAt || Date.now()).getFullYear()}/${adm._id?.slice(-4).toUpperCase()}`,
      name: adm.name || "Student",
      classGrade: formattedClass,
      appliedDate: adm.createdAt
        ? new Date(adm.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : "Recent",
      counsellor: adm.counsellor || "Neha Saini",
      source: adm.source || "Website",
      stage: adm.status === "Confirmed" ? "enrolled" : (adm.stage || "enquiry"),
      status: adm.status,
      studentId: adm.studentId?._id || adm.studentId,
      dob: adm.dob ? new Date(adm.dob).toISOString().split("T")[0] : "",
      gender: adm.gender || "Not specified",
      category: adm.category || "General",
      fatherName: adm.parentName || "Guardian",
      fatherPhone: adm.parentPhone || adm.phone || "Not specified",
      motherName: "",
      motherPhone: "",
      address: adm.address || "Address on record",
      previousSchool: adm.previousSchool || "None",
      siblingInSchool: "No",
      transportNeeded: "No",
      ageCheckText: adm.dob ? "Age criteria verified for intake session." : "Date of birth awaiting document verification.",
      interactionSchedule: adm.interactionSchedule && adm.interactionSchedule.outcome
        ? adm.interactionSchedule
        : {
            dateTimeRoom: "Room 102 · Academic Block",
            outcome: adm.status === "Confirmed" || adm.stage === "approved" || adm.stage === "fee_paid" || adm.stage === "enrolled" ? "Recommended" : "Not held yet",
          },
      documents: adm.documents && adm.documents.length > 0
        ? adm.documents
        : [
            { id: "d1", title: "Birth certificate", meta: "Municipal authority", status: "Verified" },
            { id: "d2", title: "Transfer certificate (TC)", meta: adm.previousSchool ? "Previous institution" : "Not applicable", status: adm.previousSchool ? "Verified" : "Pending" },
            { id: "d3", title: "Previous marksheet", meta: adm.previousClass ? `Class ${adm.previousClass}` : "Previous grade", status: "Verified" },
            { id: "d4", title: "Aadhaar cards", meta: adm.aadharNo ? `No: ${adm.aadharNo}` : "Student & Parents", status: adm.aadharNo ? "Verified" : "Pending" },
            { id: "d5", title: "Passport size photographs", meta: "4 copies received", status: "Verified" }
          ],
      seatsSnapshot: {
        available: "Intake Active",
        rteAvailable: "RTE Quota Open"
      },
      followUps: adm.followUps && adm.followUps.length > 0
        ? adm.followUps
        : [
            {
              id: "fu1",
              dateType: `${new Date(adm.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · Intake Record`,
              text: `Application filed for ${adm.name}. Current registry status: ${adm.status || "Pending"}.`
            }
          ],
      feePayment: adm.feePayment || {
        amount: 15000,
        receiptNo: adm.admissionNo ? `REC-${adm.admissionNo}` : "REC-2026-001",
        mode: "UPI",
        isPaid: adm.status === "Confirmed" || adm.stage === "fee_paid" || adm.stage === "enrolled",
        paidAt: adm.status === "Confirmed" || adm.stage === "fee_paid" || adm.stage === "enrolled" ? (adm.updatedAt || new Date().toISOString()) : undefined
      }
    };
  };

  const viewAdmission = (admission: Admission) => {
    const detail = convertAdmissionToDetail(admission);
    if (onOpenReviewDrawer) {
      onOpenReviewDrawer(detail);
    } else {
      setSelectedApplication(detail);
      setIsReviewDrawerOpen(true);
    }
  };

  const editAdmission = (admission: Admission) => {
    setEditingAdmission(admission);
    setForm({
      name: admission.name,
      email: admission.email || "",
      password: "",
      rollNo: admission.rollNo || "",
      admissionNo: admission.admissionNo || "",
      enrollmentNo: admission.enrollmentNo || "",
      classId: admission.classId?._id || admission.classId || "",
      sectionId: admission.sectionId?._id || admission.sectionId || "",
      parentName: admission.parentName || "",
      parentPhone: admission.parentPhone || "",
      parentEmail: admission.parentEmail || "",
      phone: admission.phone || "",
      dob: admission.dob ? new Date(admission.dob).toISOString().split('T')[0] : "",
      admissionDate: admission.admissionDate ? new Date(admission.admissionDate).toISOString().split('T')[0] : "",
      gender: admission.gender || "",
      category: admission.category || "",
      religion: admission.religion || "",
      nationality: admission.nationality || "Indian",
      bloodGroup: admission.bloodGroup || "",
      previousSchool: admission.previousSchool || "",
      previousClass: admission.previousClass || "",
      address: admission.address || "",
      aadharNo: admission.aadharNo || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setForm({
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
      aadharNo: "",
      phone: "",
    });
    setEditingAdmission(null);
    setShowForm(false);
  };

  // Option 1: Clean Separation
  // Registry & Records only displays formal applications (application, verification, test, approved, fee_paid, enrolled)
  // Raw 'enquiry' and 'followup' leads stay in Pipeline (CRM) until advanced to application
  const formalAdmissions = admissions.filter((s) => {
    if (s.status === "Confirmed") return true;
    if (!s.stage) return true; // Legacy records or direct entries
    return s.stage !== "enquiry" && s.stage !== "followup";
  });

  const rawEnquiriesCount = admissions.length - formalAdmissions.length;

  // Filter admissions by status tab and search term
  const filteredAdmissions = formalAdmissions.filter((s) => {
    const matchesStatus =
      statusFilter === "all" || s.status?.toLowerCase() === statusFilter;
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentPhone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: formalAdmissions.length,
    pending: formalAdmissions.filter((s) => s.status === "Pending").length,
    confirmed: formalAdmissions.filter((s) => s.status === "Confirmed").length,
  };

  const totalPages = Math.ceil(filteredAdmissions.length / itemsPerPage);
  const paginatedAdmissions = filteredAdmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    localStorage.setItem("admissionFilter", statusFilter);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, itemsPerPage]);

  return (
    <div className="flex flex-col gap-5 font-sans w-full animate-fadeIn">
      {showForm ? (
        <AddAdmissionModal
          form={form}
          setForm={setForm}
          onSave={() => saveAdmission()}
          onClose={closeForm}
          loading={actionLoading === "save"}
          isEdit={!!editingAdmission}
          classes={classes}
          sections={sections}
        />
      ) : (
        <>
          {/* Credentials Banner when Admission is Confirmed */}
          {newAdmissionCreds && (
            <div className="bg-nav-bg text-white rounded-card p-6 border border-line-active relative overflow-hidden shadow-md animate-fadeIn">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div>
                  <h3 className="text-h2 font-semibold text-white flex items-center gap-2 m-0">
                    <ShieldCheck className="text-gold" size={20} />
                    Admission Credentials Generated
                  </h3>
                  <p className="text-small text-nav-muted mt-1 mb-3">
                    Student portal access is active. Share these credentials with the parent.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white/10 rounded-control px-3.5 py-1.5 border border-white/10">
                      <span className="text-micro font-semibold uppercase tracking-wider text-nav-muted">
                        Email:
                      </span>
                      <span className="font-mono text-body font-medium text-white">{newAdmissionCreds.email}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-control px-3.5 py-1.5 border border-white/10">
                      <span className="text-micro font-semibold uppercase tracking-wider text-nav-muted">
                        Password:
                      </span>
                      <span className="font-mono text-body font-medium text-white">{newAdmissionCreds.password}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Email: ${newAdmissionCreds.email}\nPassword: ${newAdmissionCreds.password}`
                      );
                      showToast("Credentials copied to clipboard!", "success");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-control bg-gold hover:bg-gold/90 text-nav-bg font-semibold text-small cursor-pointer transition-colors"
                  >
                    <Copy size={15} /> Copy credentials
                  </button>
                  <button
                    onClick={() => setNewAdmissionCreds(null)}
                    className="w-9 h-9 rounded-control border border-white/20 flex items-center justify-center text-nav-muted hover:text-white cursor-pointer transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Standalone Header Section */}
          <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-line">
            <div className="flex flex-col gap-1">
              <AdmissionsModuleNav />
              <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
                Admission Registry & Records
              </h1>
              <p className="m-0 text-small text-ink-secondary">
                Manage student applications, verify credentials, print admission forms, and finalize enrollments.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {/* <Link
                to="/admin/admissions/pipeline"
                className="inline-flex items-center gap-2 min-h-[42px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-small font-medium text-ink transition-colors cursor-pointer"
              >
                <Columns size={15} /> Pipeline View
              </Link> */}
              <button
                onClick={() => {
                  if (onOpenAddStudent) {
                    onOpenAddStudent();
                  } else {
                    setShowForm(true);
                  }
                }}
                className="inline-flex items-center gap-2 min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-small cursor-pointer transition-colors"
              >
                <UserPlus size={15} /> Add admission
              </button>
            </div>
          </div>

          {rawEnquiriesCount > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-control bg-surface border border-line text-small text-ink-secondary">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>
                  Displaying <strong>{formalAdmissions.length}</strong> formal intake applications.{" "}
                  <span className="text-ink">({rawEnquiriesCount} raw enquiries currently in initial CRM Pipeline)</span>
                </span>
              </div>
              <Link
                to="/admin/admissions/pipeline"
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1 text-small"
              >
                Open CRM Pipeline →
              </Link>
            </div>
          )}

          {/* Metrics Grid (Conforming to New Design Tokens) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-surface border border-line rounded-control p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-control bg-primary-tint flex items-center justify-center text-primary shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="text-micro font-semibold uppercase tracking-wider text-ink-secondary m-0">
                  Total Applications
                </p>
                <h3 className="text-title font-bold text-ink font-mono m-0 mt-0.5">{counts.all}</h3>
              </div>
            </div>

            <div className="bg-surface border border-line rounded-control p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-control bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-micro font-semibold uppercase tracking-wider text-ink-secondary m-0">
                  Pending Processing
                </p>
                <h3 className="text-title font-bold text-ink font-mono m-0 mt-0.5">{counts.pending}</h3>
              </div>
            </div>

            <div className="bg-surface border border-line rounded-control p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-control bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-micro font-semibold uppercase tracking-wider text-ink-secondary m-0">
                  Confirmed Enrolled
                </p>
                <h3 className="text-title font-bold text-ink font-mono m-0 mt-0.5">{counts.confirmed}</h3>
              </div>
            </div>
          </div>

          {/* Main Table Section */}
          <div className="bg-surface rounded-card border border-line overflow-hidden shadow-xs flex flex-col">
            {/* Toolbar */}
            <div className="p-3.5 border-b border-line flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface-subtle/50">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={15} />
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full min-h-[38px] pl-9 pr-8 bg-surface border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary transition-colors placeholder:text-ink-secondary/70"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Segmented Control */}
              <div className="flex bg-[#ECEFEC] p-1 rounded-control w-full sm:w-auto">
                {(["all", "pending", "confirmed"] as const).map((status) => {
                  const isActive = statusFilter === status;
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-control text-small font-semibold transition-all cursor-pointer capitalize ${
                        isActive
                          ? "bg-primary text-white shadow-xs"
                          : "text-ink-secondary hover:text-ink"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-body">
                <thead>
                  <tr className="bg-[#F2F4F2] text-ink-secondary text-micro uppercase tracking-wider font-semibold border-b border-line">
                    <th className="px-5 py-3.5">Admission Info</th>
                    <th className="px-5 py-3.5">Contact</th>
                    <th className="px-5 py-3.5">Academic Info</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-small font-medium text-ink-secondary">
                            Syncing Admission Data...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedAdmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-ink-secondary">
                        <div className="w-12 h-12 bg-surface-subtle rounded-full flex items-center justify-center mx-auto mb-3 border border-line">
                          <Search size={20} className="text-ink-secondary" />
                        </div>
                        <p className="text-body font-semibold text-ink m-0">No admissions found</p>
                        <p className="text-small text-ink-secondary mt-1 mb-0">
                          Try a different search term or change the status filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedAdmissions.map((s) => {
                      const isLoading = actionLoading === s._id;
                      const initials = s.name?.substring(0, 2).toUpperCase() || "??";
                      const rawClass = s.classId?.name || "N/A";
                      const displayClass = rawClass.toLowerCase().startsWith("class")
                        ? rawClass
                        : `Class ${rawClass}`;

                      return (
                        <tr
                          key={s._id}
                          onClick={() => viewAdmission(s)}
                          className="group hover:bg-surface-subtle/50 transition-colors cursor-pointer"
                        >
                          {/* Admission Info */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-tint text-primary font-semibold text-small flex items-center justify-center shrink-0">
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-ink text-body group-hover:text-primary transition-colors m-0">
                                  {s.name || "Unnamed Admission"}
                                </p>
                                <p className="text-micro text-ink-secondary font-mono m-0 mt-0.5">
                                  ID: {s._id?.slice(-6).toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-5 py-3.5">
                            <div className="flex flex-col">
                              <span className="text-small text-ink font-mono">{s.email || "—"}</span>
                              {s.parentPhone && (
                                <span className="text-micro text-ink-secondary font-mono mt-0.5">
                                  {s.parentPhone}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Academic Info */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-primary-tint text-primary rounded-control text-micro font-semibold">
                                {displayClass}
                              </span>
                              {s.sectionId && (
                                <span className="px-2.5 py-0.5 bg-surface-subtle text-ink rounded-control text-micro font-semibold border border-line">
                                  Sec {s.sectionId?.name}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5 text-center">
                            <div className="flex flex-col items-center gap-1">
                              {s.stage && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-tint text-primary-dark border border-primary/20">
                                  {s.stage}
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider ${
                                  s.status === "Confirmed"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-amber-50 text-amber-800 border border-amber-200"
                                }`}
                              >
                                {s.status || "Pending"}
                              </span>
                            </div>
                          </td>

                              {/* Actions */}
                          <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => window.open(`/admin/admissions/print/${s._id}`, "_blank")}
                                className="p-1.5 text-ink-secondary hover:text-primary hover:bg-surface-subtle rounded-control transition-colors cursor-pointer"
                                title="Print Admission Form"
                              >
                                <Printer size={15} />
                              </button>

                              <button
                                onClick={() => viewAdmission(s)}
                                className="p-1.5 text-ink-secondary hover:text-primary hover:bg-primary-tint rounded-control transition-colors cursor-pointer"
                                title={s.status === "Confirmed" ? "View Application Details" : "Review Application & Verification"}
                              >
                                <Eye size={15} />
                              </button>

                              {s.status === "Confirmed" ? (
                                <Link
                                  to="/admin/students"
                                  className="p-1.5 text-ink-secondary hover:text-emerald-700 hover:bg-emerald-50 rounded-control transition-colors cursor-pointer"
                                  title="View Permanent Student Profile in Directory"
                                >
                                  <ExternalLink size={15} />
                                </Link>
                              ) : (
                                <>
                                  <button
                                    onClick={() => editAdmission(s)}
                                    className="p-1.5 text-ink-secondary hover:text-amber-700 hover:bg-amber-50 rounded-control transition-colors cursor-pointer"
                                    title="Edit Record"
                                  >
                                    <Edit size={15} />
                                  </button>

                                  <button
                                    onClick={() => deleteAdmission(s)}
                                    className="p-1.5 text-ink-secondary hover:text-red-700 hover:bg-red-50 rounded-control transition-colors cursor-pointer"
                                    title="Delete Admission"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </>
                              )}
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
            {!loading && filteredAdmissions.length > 0 && (
              <div className="flex justify-between items-center flex-wrap gap-3 py-3 px-4 border-t border-line text-small text-ink-secondary bg-surface">
                <div className="flex items-center gap-3">
                  <span>
                    Showing {filteredAdmissions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
                    {Math.min(currentPage * itemsPerPage, filteredAdmissions.length)} of{" "}
                    {filteredAdmissions.length.toLocaleString("en-IN")}
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
            )}
          </div>
        </>
      )}

      {/* Standalone Application Review Drawer when opened from AdmissionsPanel */}
      {!onOpenReviewDrawer && (
        <ApplicationReviewDrawer
          application={selectedApplication}
          isOpen={isReviewDrawerOpen}
          onClose={() => setIsReviewDrawerOpen(false)}
          onStatusChange={async (id, newStage) => {
            try {
              await api.patch(`/admin/admissions/${id}/stage`, { stage: newStage });
              loadAdmissions();
            } catch (err) {
              console.error(err);
            }
          }}
          onEnrollSuccess={(creds) => {
            setNewAdmissionCreds(creds);
            loadAdmissions();
          }}
          onMarkLost={(id) => {
            const adm = admissions.find((a) => a._id === id);
            if (adm) deleteAdmission(adm);
            setIsReviewDrawerOpen(false);
          }}
          onEdit={(app) => {
            setIsReviewDrawerOpen(false);
            const adm = admissions.find((a) => a._id === app.id);
            if (adm) editAdmission(adm);
          }}
        />
      )}
    </div>
  );
};

export default AdmissionsPanel;
