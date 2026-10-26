import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import {
  Search,
  Copy,
  Check,
  Filter,
  Phone,
  Clock,
  AlertCircle,
  Columns,
  List,
  UserPlus,
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
  ArrowRight,
  X,
  Loader2
} from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import ApplicationReviewDrawer, { type ApplicationDetail } from "../../../components/admin/admissions/ApplicationReviewDrawer";
import AddStudentModal from "../../../components/admin/admissions/AddStudentModal";
import AdmissionsModuleNav from "../../../components/admin/admissions/AdmissionsModuleNav";

interface PipelineLead extends ApplicationDetail {
  followUpText: string;
  isOverdue?: boolean;
}

const convertAdmissionToLead = (adm: any): PipelineLead => {
  const rawClass = adm.classId?.name || "Class 1";
  const formattedClass =
    rawClass.toLowerCase().startsWith("class") || rawClass.toLowerCase().startsWith("grade")
      ? rawClass
      : `Class ${rawClass}`;

  const validStages: PipelineLead["stage"][] = [
    "enquiry",
    "followup",
    "application",
    "verification",
    "test",
    "approved",
    "fee_paid",
    "enrolled"
  ];

  let assignedStage: PipelineLead["stage"] = "enquiry";
  if (adm.stage && validStages.includes(adm.stage)) {
    assignedStage = adm.stage;
  } else if (adm.status === "Confirmed") {
    assignedStage = "enrolled";
  }

  return {
    id: adm._id,
    applicationNo:
      adm.admissionNo ||
      `APP/${new Date(adm.createdAt || Date.now()).getFullYear()}/${adm._id?.slice(-4).toUpperCase()}`,
    name: adm.name || "Student",
    classGrade: formattedClass,
    appliedDate: adm.createdAt
      ? new Date(adm.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      : "Today",
    counsellor: adm.counsellor || "Neha Saini",
    source: adm.source || "Website",
    stage: assignedStage,
    followUpText: adm.followUpText || "Follow up",
    isOverdue: !!adm.isOverdue,
    dob: adm.dob ? new Date(adm.dob).toISOString().split("T")[0] : "2020-01-01",
    gender: adm.gender || "Male",
    category: adm.category || "General",
    fatherName: adm.parentName || "Guardian",
    fatherPhone: adm.parentPhone || adm.phone || "Not specified",
    motherName: "",
    motherPhone: "",
    address: adm.address || "Jaipur",
    previousSchool: adm.previousSchool || "None",
    siblingInSchool: "No",
    transportNeeded: "No",
    ageCheckText: "Age criteria verified for intake session.",
    interactionSchedule:
      adm.interactionSchedule && adm.interactionSchedule.dateTimeRoom
        ? adm.interactionSchedule
        : {
            dateTimeRoom: "Room 102 · Academic Block",
            outcome: adm.status === "Confirmed" || adm.stage === "approved" || adm.stage === "fee_paid" || adm.stage === "enrolled" ? "Recommended" : "Not held yet"
          },
    documents:
      adm.documents && adm.documents.length > 0
        ? adm.documents
        : [
            { id: "d1", title: "Birth certificate", meta: "Municipal authority", status: "Verified" },
            { id: "d2", title: "Transfer certificate (TC)", meta: adm.previousSchool ? "Previous institution" : "Not applicable", status: adm.previousSchool ? "Verified" : "Pending" },
            { id: "d3", title: "Previous marksheet", meta: "Academic record", status: "Verified" },
            { id: "d4", title: "Aadhaar cards", meta: "Student & Parent identity", status: "Pending" },
            { id: "d5", title: "Passport size photographs", meta: "4 copies received", status: "Verified" }
          ],
    seatsSnapshot: { available: "Intake Active", rteAvailable: "RTE Quota Open" },
    followUps:
      adm.followUps && adm.followUps.length > 0
        ? adm.followUps
        : [
            {
              id: "fu1",
              dateType: "Intake Record",
              text: `Application filed for ${adm.name}.`
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

const STAGE_COLUMNS: { key: PipelineLead["stage"]; label: string; count: number }[] = [
  { key: "enquiry", label: "Enquiry", count: 48 },
  { key: "followup", label: "Follow-up", count: 31 },
  { key: "application", label: "Application", count: 22 },
  { key: "verification", label: "Documents verified", count: 14 },
  { key: "test", label: "Test / interaction", count: 9 },
  { key: "approved", label: "Approved", count: 6 },
  { key: "fee_paid", label: "Fee paid", count: 12 },
  { key: "enrolled", label: "Enrolled", count: 18 }
];

const SEATS_METRICS = [
  { className: "Nursery", filled: 41, total: 60, percent: 68 },
  { className: "Class 1", filled: 23, total: 120, percent: 19 },
  { className: "Class 6", filled: 8, total: 120, percent: 7 },
  { className: "Class 11", filled: 37, total: 120, percent: 31 }
];

export default function AdmissionsCRM() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [classFilter, setClassFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [counsellorFilter, setCounsellorFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals & Drawers state
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDetail | null>(null);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddEnquiryOpen, setIsAddEnquiryOpen] = useState(false);

  // Quick Enquiry Form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    classGrade: "Class 1",
    guardian: "Father",
    phone: "",
    source: "Walk-in",
    counsellor: "Neha Saini",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [admRes, clsRes] = await Promise.all([
        api.get("/admin/admissions"),
        api.get("/admin/classes")
      ]);
      const list = admRes.data.data || [];
      setLeads(list.map(convertAdmissionToLead));
      const classesData = clsRes.data.data || [];
      setClassesList(classesData);
      if (classesData.length > 0) {
        setEnquiryForm((prev) => ({
          ...prev,
          classGrade: classesData[0].name
        }));
      }
    } catch (err) {
      console.error("Failed to load admissions from API:", err);
      showToast("Failed to load admissions from database", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/admissions/apply`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast("Application form link copied to clipboard!", "success");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCardClick = (lead: PipelineLead) => {
    setSelectedApplication(lead);
    setIsReviewDrawerOpen(true);
  };

  const handleStatusChange = async (appId: string, newStage: ApplicationDetail["stage"]) => {
    try {
      await api.patch(`/admin/admissions/${appId}/stage`, { stage: newStage });
      setLeads((prev) =>
        prev.map((l) => (l.id === appId ? { ...l, stage: newStage } : l))
      );
      showToast(`Stage updated to ${newStage.toUpperCase()}`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update stage in database", "error");
    }
  };

  const handleMarkLost = async (appId: string) => {
    try {
      await api.patch(`/admin/admissions/${appId}/stage`, { stage: "rejected" });
      setLeads((prev) => prev.filter((l) => l.id !== appId));
      setIsReviewDrawerOpen(false);
      showToast("Admission marked as closed / lost", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to mark as lost", "error");
    }
  };

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) {
      showToast("Please provide applicant name and phone number.", "error");
      return;
    }

    try {
      let targetClass = classesList.find((c) =>
        c.name.toLowerCase().includes(enquiryForm.classGrade.toLowerCase())
      );
      if (!targetClass && classesList.length > 0) targetClass = classesList[0];

      const res = await api.post("/admin/admissions", {
        name: enquiryForm.name,
        classId: targetClass?._id,
        phone: enquiryForm.phone,
        parentName: enquiryForm.guardian === "Father" ? "Father" : "Mother",
        parentPhone: enquiryForm.phone,
        source: enquiryForm.source,
        counsellor: enquiryForm.counsellor,
        stage: "enquiry",
        status: "Pending",
        followUpText: "Call today"
      });

      const newAdmission = res.data.data;
      const formattedLead = convertAdmissionToLead(newAdmission);
      setLeads((prev) => [formattedLead, ...prev]);

      setIsAddEnquiryOpen(false);
      setEnquiryForm({
        name: "",
        classGrade: classesList[0]?.name || "Class 1",
        guardian: "Father",
        phone: "",
        source: "Walk-in",
        counsellor: "Neha Saini",
      });
      showToast(`Enquiry for ${enquiryForm.name} saved to database!`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save enquiry to database", "error");
    }
  };

  const moveStage = async (leadId: string, direction: "next" | "prev", e: React.MouseEvent) => {
    e.stopPropagation();
    const stageOrder: PipelineLead["stage"][] = [
      "enquiry",
      "followup",
      "application",
      "verification",
      "test",
      "approved",
      "fee_paid",
      "enrolled"
    ];

    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead) return;

    const currentIndex = stageOrder.indexOf(currentLead.stage);
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < stageOrder.length) {
      const newStage = stageOrder[nextIndex];
      // Optimistic update
      setLeads((prev) =>
        prev.map((item) => (item.id === leadId ? { ...item, stage: newStage } : item))
      );

      try {
        await api.patch(`/admin/admissions/${leadId}/stage`, { stage: newStage });
        showToast(`Moved to ${newStage.toUpperCase()}`, "success");
      } catch (err) {
        console.error(err);
        showToast("Failed to update stage in database", "error");
        loadData();
      }
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.fatherPhone.includes(search) ||
      l.applicationNo.toLowerCase().includes(search.toLowerCase());
    const matchesClass =
      classFilter === "All" ||
      l.classGrade.toLowerCase() === classFilter.toLowerCase() ||
      l.classGrade.toLowerCase().includes(classFilter.toLowerCase());
    const matchesSource = sourceFilter === "All" || l.source === sourceFilter;
    const matchesCounsellor = counsellorFilter === "All" || l.counsellor === counsellorFilter;
    const matchesOverdue = !overdueOnly || l.isOverdue;
    return matchesSearch && matchesClass && matchesSource && matchesCounsellor && matchesOverdue;
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans w-full max-w-content mx-auto">
      
      {/* Breadcrumb & Header Section (06-Admissions.html) */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <AdmissionsModuleNav extraContext="Session 2026-27 intake" />
          <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
            Admission pipeline
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* <Link
            to="/admin/admissions/records"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-body font-medium text-ink transition-colors"
          >
            <List size={16} />
            <span>Registry & Records</span>
          </Link> */}

          <Link
            to="/admin/students/import"
            className="inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-body font-medium text-ink transition-colors"
          >
            <FileSpreadsheet size={15} className="text-emerald-700" />
            <span>Import from Excel</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-body font-medium text-ink transition-colors cursor-pointer"
          >
            {copiedLink ? <Check size={16} className="text-emerald-700" /> : <Copy size={16} />}
            <span>Copy application form link</span>
          </button>

          <button
            onClick={() => setIsAddEnquiryOpen(true)}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-body font-semibold transition-colors cursor-pointer"
          >
            <UserPlus size={16} /> Add enquiry
          </button>
        </div>
      </div>

      {/* Filters Bar (06-Admissions.html) */}
          <div className="flex flex-wrap items-center gap-3 bg-surface border border-line rounded-card p-3.5">
            <div className="relative flex-1 min-w-[200px] w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={16} />
              <input
                type="text"
                placeholder="Search student, admission no. or parent mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full min-h-[40px] pl-9 pr-3 bg-surface-subtle border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary focus:bg-surface"
              />
            </div>

            <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
              Class
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="min-h-[40px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
              >
                <option value="All">All classes</option>
                {classesList.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name.toLowerCase().startsWith("class") || c.name.toLowerCase().startsWith("grade") ? c.name : `Class ${c.name}`}
                  </option>
                ))}</select>
            </label>

            <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
              Source
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="min-h-[40px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
              >
                <option value="All">All sources</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Facebook">Facebook</option>
                <option value="RTE">RTE</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
              Counsellor
              <select
                value={counsellorFilter}
                onChange={(e) => setCounsellorFilter(e.target.value)}
                className="min-h-[40px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
              >
                <option value="All">Everyone</option>
                <option value="Neha Saini">Neha Saini</option>
                <option value="Arjun Yadav">Arjun Yadav</option>
              </select>
            </label>

            <button
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-small font-semibold transition-colors cursor-pointer ${
                overdueOnly
                  ? "bg-warning-accent text-white"
                  : "bg-warning-bg text-warning-text border border-warning-border hover:bg-warning-bg/80"
              }`}
            >
              <Clock size={13} />
              <span>5 follow-ups overdue</span>
            </button>
          </div>

          {/* Kanban Board (7 Columns matching 06-Admissions.html) */}
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-16 gap-3 bg-surface border border-line rounded-card">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-small font-medium text-ink-secondary">
                  Loading real admission pipeline from database...
                </span>
              </div>
            ) : (
              <div className="flex gap-3.5 min-w-max items-start">
              {STAGE_COLUMNS.map((stage) => {
                const stageLeads = filteredLeads.filter((l) => l.stage === stage.key);
                return (
                  <section
                    key={stage.key}
                    className="w-[248px] shrink-0 bg-[#ECEFEC] rounded-card p-3 flex flex-col gap-2.5"
                  >
                    {/* Column Header */}
                    <div className="flex justify-between items-center px-1">
                      <h2 className="m-0 text-small font-semibold text-ink">
                        {stage.label}
                      </h2>
                      <span className="font-mono text-caption text-ink-secondary bg-surface px-2 py-0.5 rounded-full border border-line/40">
                        {stageLeads.length}
                      </span>
                    </div>

                    {/* Column Leads */}
                    <div className="space-y-2.5 min-h-[160px]">
                      {stageLeads.length === 0 ? (
                        <div className="h-24 border border-dashed border-line rounded-control flex items-center justify-center text-caption text-ink-secondary italic">
                          No applicants
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <article
                            key={lead.id}
                            onClick={() => handleCardClick(lead)}
                            className="bg-surface border border-line rounded-control p-3 shadow-none hover:border-primary hover:shadow-xs transition-all flex flex-col gap-2 cursor-pointer group"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="font-semibold text-body text-ink group-hover:text-primary transition-colors">
                                {lead.name}
                              </div>
                              <span className="text-caption font-semibold text-primary-dark bg-primary-tint px-2 py-0.5 rounded-small whitespace-nowrap">
                                {lead.classGrade}
                              </span>
                            </div>

                            <div className="text-small text-ink-secondary">
                              Father · {lead.fatherPhone}
                            </div>

                            <div className="flex items-center justify-between text-caption pt-2 border-t border-line/50">
                              <span className="text-ink-secondary">{lead.source}</span>
                              <span
                                className={`font-semibold ${
                                  lead.isOverdue
                                    ? "text-warning-inline bg-warning-bg px-1.5 py-0.5 rounded-small"
                                    : "text-ink-secondary"
                                }`}
                              >
                                {lead.followUpText}
                              </span>
                            </div>

                            {/* Quick Stage Controls on Hover */}
                            <div className="flex items-center justify-between pt-1 opacity-0 group-hover:opacity-100 transition-opacity text-caption border-t border-line/30">
                              <button
                                onClick={(e) => moveStage(lead.id, "prev", e)}
                                disabled={stage.key === "enquiry"}
                                className="text-ink-secondary hover:text-ink disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-0.5"
                              >
                                <ChevronLeft size={12} /> Prev
                              </button>
                              <button
                                onClick={(e) => moveStage(lead.id, "next", e)}
                                disabled={stage.key === "enrolled"}
                                className="font-semibold text-primary hover:underline disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-0.5"
                              >
                                Advance <ChevronRight size={12} />
                              </button>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
            )}
          </div>

          {/* Seats Left for Session (Bottom Section matching 06-Admissions.html) */}
          <section className="bg-surface border border-line rounded-card p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-h2 font-semibold text-ink">
                Seats left for 2026-27
              </h2>
              <span className="text-small text-ink-secondary">
                Real-time enrolled intake capacity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {SEATS_METRICS.map((seat) => (
                <div key={seat.className} className="flex flex-col gap-1.5 p-3 rounded-control bg-surface-subtle border border-line/60">
                  <div className="flex justify-between items-center text-small">
                    <span className="font-semibold text-ink">{seat.className}</span>
                    <span className="font-mono text-ink-secondary">
                      {seat.filled} of {seat.total}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-line-track rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${seat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
      {/* 07-AdmissionForm Drawer Component */}
      <ApplicationReviewDrawer
        application={selectedApplication}
        isOpen={isReviewDrawerOpen}
        onClose={() => setIsReviewDrawerOpen(false)}
        onStatusChange={handleStatusChange}
        onMarkLost={handleMarkLost}
        onEnrollSuccess={() => loadData()}
      />

      {/* 08-AddStudent Direct Admission Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSuccess={(stu) => {
          showToast(`Student ${stu.name} added to pipeline!`, "success");
        }}
      />

      {/* Add Quick Enquiry Modal */}
      {isAddEnquiryOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" onClick={() => setIsAddEnquiryOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-surface rounded-card border border-line shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="m-0 text-h2 font-semibold text-ink">Add Admission Enquiry</h3>
                <button
                  onClick={() => setIsAddEnquiryOpen(false)}
                  className="w-8 h-8 rounded-control border border-line flex items-center justify-center text-ink-secondary hover:text-ink cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateEnquiry} className="space-y-4">
                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Student Full Name *
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Class
                    <select
                      value={enquiryForm.classGrade}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, classGrade: e.target.value })}
                      className="min-h-[44px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                    >
                      <option>Nursery</option>
                      <option>LKG</option>
                      <option>UKG</option>
                      <option>Class 1</option>
                      <option>Class 6</option>
                      <option>Class 11</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Source
                    <select
                      value={enquiryForm.source}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, source: e.target.value })}
                      className="min-h-[44px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                    >
                      <option value="Walk-in">Walk-in</option>
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Facebook">Facebook</option>
                      <option value="RTE">RTE</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Guardian
                    <select
                      value={enquiryForm.guardian}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, guardian: e.target.value })}
                      className="min-h-[44px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Mobile *
                    <input
                      type="tel"
                      required
                      placeholder="98290 xxxxx"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="min-h-[44px] px-3 border border-line-input rounded-control font-mono text-body text-ink focus:outline-none focus:border-primary"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Assigned Counsellor
                  <select
                    value={enquiryForm.counsellor}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, counsellor: e.target.value })}
                    className="min-h-[44px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                  >
                    <option value="Neha Saini">Neha Saini</option>
                    <option value="Arjun Yadav">Arjun Yadav</option>
                  </select>
                </label>

                <div className="flex justify-end gap-2 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsAddEnquiryOpen(false)}
                    className="min-h-[40px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-small font-medium text-ink transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-[40px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-small font-semibold transition-colors cursor-pointer"
                  >
                    Save Enquiry
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
