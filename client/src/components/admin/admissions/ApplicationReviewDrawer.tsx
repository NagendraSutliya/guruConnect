import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import { 
  X, 
  Check, 
  AlertCircle, 
  FileText, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  ChevronRight, 
  Download, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  Plus,
  MessageSquare,
  GraduationCap,
  CreditCard,
  RotateCcw,
  AlertTriangle,
  Edit
} from "lucide-react";
import { useToast } from "../../../context/ToastContext";

export interface ApplicationDetail {
  id: string;
  applicationNo: string;
  name: string;
  classGrade: string;
  appliedDate: string;
  counsellor: string;
  source: string;
  stage: "enquiry" | "followup" | "application" | "verification" | "test" | "approved" | "fee_paid" | "enrolled";
  status?: string;
  studentId?: string;
  dob: string;
  gender: string;
  category: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  address: string;
  previousSchool: string;
  siblingInSchool: string;
  transportNeeded: string;
  ageCheckText: string;
  interactionSchedule: {
    dateTimeRoom: string;
    outcome: "Not held yet" | "Recommended" | "Not recommended";
  };
  documents: {
    id: string;
    title: string;
    meta: string;
    status: "Verified" | "Pending" | "Rejected";
    verifiedBy?: string;
  }[];
  seatsSnapshot: {
    available: string;
    rteAvailable: string;
  };
  followUps: {
    id: string;
    dateType: string;
    text: string;
  }[];
  feePayment?: {
    amount: number;
    receiptNo: string;
    paidAt?: string;
    mode: string;
    isPaid: boolean;
  };
}

interface ApplicationReviewDrawerProps {
  application: ApplicationDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (appId: string, newStage: ApplicationDetail["stage"]) => void;
  onMarkLost?: (appId: string) => void;
  onEnrollSuccess?: (creds: { email: string; password: string }) => void;
  onEdit?: (application: ApplicationDetail) => void;
}

const STAGES = [
  { key: "enquiry", label: "Enquiry" },
  { key: "followup", label: "Follow-up" },
  { key: "application", label: "Application" },
  { key: "verification", label: "Documents verified" },
  { key: "test", label: "Interaction" },
  { key: "approved", label: "Approved" },
  { key: "fee_paid", label: "Fee paid" },
  { key: "enrolled", label: "Enrolled" },
];

export default function ApplicationReviewDrawer({
  application,
  isOpen,
  onClose,
  onStatusChange,
  onMarkLost,
  onEnrollSuccess,
  onEdit,
}: ApplicationReviewDrawerProps) {
  const { showToast } = useToast();
  
  const [activeStage, setActiveStage] = useState<ApplicationDetail["stage"]>(
    application?.stage || "verification"
  );
  const [outcome, setOutcome] = useState<string>(
    application?.interactionSchedule?.outcome || "Not held yet"
  );
  const [dateTimeRoom, setDateTimeRoom] = useState<string>(
    application?.interactionSchedule?.dateTimeRoom || "Room 102 · Academic Block"
  );
  const [localDocuments, setLocalDocuments] = useState<ApplicationDetail["documents"]>(
    application?.documents || []
  );
  const [localFollowUps, setLocalFollowUps] = useState(application?.followUps || []);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"Call" | "Visit" | "WhatsApp">("Call");
  const [enrolling, setEnrolling] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null);

  // Fee payment state
  const [localFeePayment, setLocalFeePayment] = useState({
    amount: application?.feePayment?.amount || 15000,
    receiptNo: application?.feePayment?.receiptNo || (application?.applicationNo ? `REC-${application.applicationNo.replace(/[^a-zA-Z0-9]/g, "")}` : "REC-2026-001"),
    mode: application?.feePayment?.mode || "UPI",
    isPaid: Boolean(application?.feePayment?.isPaid || application?.stage === "fee_paid" || application?.stage === "enrolled" || application?.status === "Confirmed"),
    paidAt: application?.feePayment?.paidAt
  });

  useEffect(() => {
    if (application) {
      const initialStage = application.status === "Confirmed" ? "enrolled" : (application.stage || "verification");
      setActiveStage(initialStage);
      setOutcome(application.interactionSchedule?.outcome || "Not held yet");
      setDateTimeRoom(application.interactionSchedule?.dateTimeRoom || "Room 102 · Academic Block");
      setLocalFollowUps(application.followUps || []);
      
      const defaultDocs: ApplicationDetail["documents"] = [
        { id: "d1", title: "Birth certificate", meta: "Municipal / Civil authority", status: "Verified" },
        { id: "d2", title: "Transfer certificate (TC)", meta: application.previousSchool ? `From ${application.previousSchool}` : "Previous institution", status: application.previousSchool ? "Verified" : "Pending" },
        { id: "d3", title: "Previous marksheet", meta: "Academic report card", status: "Verified" },
        { id: "d4", title: "Aadhaar cards", meta: "Student & Parent identity", status: "Pending" },
        { id: "d5", title: "Passport size photographs", meta: "4 copies received", status: "Verified" }
      ];

      setLocalDocuments(
        application.documents && application.documents.length > 0
          ? application.documents
          : defaultDocs
      );

      const feeIsPaid = Boolean(
        application.feePayment?.isPaid ||
        initialStage === "fee_paid" ||
        initialStage === "enrolled" ||
        application.status === "Confirmed"
      );

      setLocalFeePayment({
        amount: application.feePayment?.amount || 15000,
        receiptNo: application.feePayment?.receiptNo || (application.applicationNo ? `REC-${application.applicationNo.replace(/[^a-zA-Z0-9]/g, "")}` : "REC-2026-001"),
        mode: application.feePayment?.mode || "UPI",
        isPaid: feeIsPaid,
        paidAt: application.feePayment?.paidAt
      });

      setCreatedCreds(null);
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const currentStageIndex = STAGES.findIndex((s) => s.key === activeStage);

  // Sync updates to MongoDB
  const syncToBackend = async (patchData: Record<string, any>) => {
    try {
      await api.patch(`/admin/admissions/${application.id}`, patchData);
    } catch (err) {
      console.error("Failed to sync admission changes to database:", err);
    }
  };

  // --- Stage Requirements Engine ---
  interface StageRequirement {
    id: string;
    title: string;
    met: boolean;
    helpText: string;
    sectionId?: string;
  }

  const getStageRequirements = (stage: ApplicationDetail["stage"]): {
    requirements: StageRequirement[];
    canAdvance: boolean;
    nextStageKey: ApplicationDetail["stage"] | null;
    nextStageLabel: string | null;
  } => {
    const currentIndex = STAGES.findIndex((s) => s.key === stage);
    const nextStage = currentIndex >= 0 && currentIndex < STAGES.length - 1 ? STAGES[currentIndex + 1] : null;

    let reqs: StageRequirement[] = [];

    switch (stage) {
      case "enquiry":
        reqs = [
          {
            id: "contact",
            title: "Guardian Contact Number",
            met: Boolean(application.fatherPhone && application.fatherPhone !== "Not specified"),
            helpText: "Valid mobile phone number required to follow up with parents.",
            sectionId: "details-section"
          },
          {
            id: "counsellor",
            title: "Assigned Counsellor",
            met: Boolean(application.counsellor),
            helpText: "Admission counsellor must be assigned to handle this lead.",
            sectionId: "details-section"
          },
          {
            id: "initial-log",
            title: "Initial Contact Note Logged",
            met: localFollowUps.length > 0,
            helpText: "At least one call or visit note must be recorded in the Follow-up log.",
            sectionId: "followup-section"
          }
        ];
        break;

      case "followup":
        reqs = [
          {
            id: "followup-note",
            title: "Follow-up Note Recorded",
            met: localFollowUps.length > 0,
            helpText: "Log conversation details confirming parent interest in formal application.",
            sectionId: "followup-section"
          },
          {
            id: "target-class",
            title: "Target Class Specified",
            met: Boolean(application.classGrade),
            helpText: "Class grade must be assigned.",
            sectionId: "details-section"
          }
        ];
        break;

      case "application":
        reqs = [
          {
            id: "applicant-name",
            title: "Applicant Full Name",
            met: Boolean(application.name?.trim()),
            helpText: "Student legal name is required.",
            sectionId: "details-section"
          },
          {
            id: "class-assigned",
            title: "Applied Class / Grade",
            met: Boolean(application.classGrade),
            helpText: "Class grade must be selected.",
            sectionId: "details-section"
          },
          {
            id: "docs-provided",
            title: "Mandatory Document Checklist",
            met: localDocuments.length > 0,
            helpText: "Required document list must be initialized.",
            sectionId: "documents-section"
          }
        ];
        break;

      case "verification": {
        const pendingDocs = localDocuments.filter((d) => d.status !== "Verified");
        reqs = [
          {
            id: "docs-verified",
            title: `All Documents Verified (${localDocuments.length - pendingDocs.length}/${localDocuments.length})`,
            met: localDocuments.length > 0 && pendingDocs.length === 0,
            helpText: pendingDocs.length === 0
              ? "All certificates and identity documents verified successfully."
              : `${pendingDocs.length} document(s) pending verification: ${pendingDocs.map(d => d.title).join(", ")}. Verify each below or use 'Verify All'.`,
            sectionId: "documents-section"
          }
        ];
        break;
      }

      case "test":
        reqs = [
          {
            id: "interaction-recommended",
            title: "Interaction / Assessment Outcome: Recommended",
            met: outcome === "Recommended",
            helpText: outcome === "Recommended"
              ? "Applicant successfully cleared interaction and is recommended for approval."
              : outcome === "Not recommended"
              ? "Applicant outcome is set to 'Not recommended'. You can reschedule or mark as lost."
              : "Interaction assessment outcome is still 'Not held yet'. Select 'Recommended' once held.",
            sectionId: "interaction-section"
          }
        ];
        break;

      case "approved":
        reqs = [
          {
            id: "fee-payment",
            title: `Admission Fee Payment (₹${(localFeePayment.amount || 15000).toLocaleString()})`,
            met: Boolean(localFeePayment.isPaid),
            helpText: localFeePayment.isPaid
              ? `Fee confirmed: ₹${(localFeePayment.amount || 15000).toLocaleString()} via ${localFeePayment.mode} (${localFeePayment.receiptNo || 'Receipt on file'})`
              : "Payment of admission / intake fee must be confirmed before proceeding.",
            sectionId: "fee-section"
          }
        ];
        break;

      case "fee_paid":
        reqs = [
          {
            id: "ready-enrollment",
            title: "Ready for Permanent Enrollment",
            met: true,
            helpText: "All verification and payments complete! Click 'Enroll Student & Generate ID' to allocate Roll No and generate credentials.",
            sectionId: "enroll-section"
          }
        ];
        break;

      case "enrolled":
        reqs = [
          {
            id: "fully-enrolled",
            title: "Permanent Academic Profile Active",
            met: true,
            helpText: "Student is actively enrolled in the institution registry."
          }
        ];
        break;
    }

    const canAdvance = reqs.length > 0 && reqs.every((r) => r.met);
    return {
      requirements: reqs,
      canAdvance,
      nextStageKey: nextStage ? (nextStage.key as ApplicationDetail["stage"]) : null,
      nextStageLabel: nextStage ? nextStage.label : null
    };
  };

  const validation = getStageRequirements(activeStage);
  const metCount = validation.requirements.filter((r) => r.met).length;
  const totalCount = validation.requirements.length;

  // Advance stage with strict requirement checking
  const handleAdvanceStage = () => {
    if (!validation.canAdvance) {
      const missing = validation.requirements.filter((r) => !r.met).map((r) => r.title).join(", ");
      showToast(`Cannot advance: Requirement pending: ${missing}`, "error");

      const firstUnmet = validation.requirements.find((r) => !r.met);
      if (firstUnmet?.sectionId) {
        const el = document.getElementById(firstUnmet.sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (validation.nextStageKey) {
      const nextKey = validation.nextStageKey;
      setActiveStage(nextKey);
      syncToBackend({ stage: nextKey });
      onStatusChange?.(application.id, nextKey);
      showToast(`Stage advanced to "${validation.nextStageLabel}"`, "success");
    } else {
      showToast("Student is already fully enrolled", "info");
    }
  };

  // Pipeline stage pill click guard
  const handleStagePillClick = (targetStage: ApplicationDetail["stage"], targetIndex: number) => {
    if (targetIndex === currentStageIndex) return;

    if (targetIndex < currentStageIndex) {
      setActiveStage(targetStage);
      showToast(`Viewing stage: ${STAGES[targetIndex].label}`, "info");
      return;
    }

    // Trying to move forward: check current stage requirements first
    if (!validation.canAdvance) {
      const missing = validation.requirements.filter((r) => !r.met).map((r) => r.title).join(", ");
      showToast(`Cannot advance to ${STAGES[targetIndex].label}: Fulfill current stage requirements first (${missing})`, "error");
      return;
    }

    if (targetIndex > currentStageIndex + 1) {
      showToast(`Please complete each stage in order. Advance to "${STAGES[currentStageIndex + 1].label}" first.`, "info");
      return;
    }

    handleAdvanceStage();
  };

  // Document verification actions
  const handleVerifyDocument = (docId: string) => {
    const updated = localDocuments.map((d) =>
      d.id === docId ? { ...d, status: "Verified" as const } : d
    );
    setLocalDocuments(updated);
    syncToBackend({ documents: updated });
    showToast("Document verified", "success");
  };

  const handleRejectDocument = (docId: string) => {
    const updated = localDocuments.map((d) =>
      d.id === docId ? { ...d, status: "Rejected" as const } : d
    );
    setLocalDocuments(updated);
    syncToBackend({ documents: updated });
    showToast("Document marked as Rejected / Needs Re-upload", "info");
  };

  const handleResetDocument = (docId: string) => {
    const updated = localDocuments.map((d) =>
      d.id === docId ? { ...d, status: "Pending" as const } : d
    );
    setLocalDocuments(updated);
    syncToBackend({ documents: updated });
    showToast("Document status set to Pending", "info");
  };

  const handleVerifyAllDocuments = () => {
    const updated = localDocuments.map((d) => ({ ...d, status: "Verified" as const }));
    setLocalDocuments(updated);
    syncToBackend({ documents: updated });
    showToast(`All ${updated.length} documents verified!`, "success");
  };

  // Interaction Outcome action
  const handleOutcomeChange = (newOutcome: string) => {
    setOutcome(newOutcome);
    syncToBackend({
      interactionSchedule: {
        dateTimeRoom,
        outcome: newOutcome
      }
    });
    showToast(`Interaction outcome set to: ${newOutcome}`, "success");
  };

  // Follow-up logging action
  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const todayStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    const newEntry = {
      id: `f-${Date.now()}`,
      dateType: `${todayStr} · ${noteType}`,
      text: newNote.trim(),
    };

    const updated = [newEntry, ...localFollowUps];
    setLocalFollowUps(updated);
    setNewNote("");
    syncToBackend({ followUps: updated });
    showToast("Follow-up note logged", "success");
  };

  // Fee payment confirmation action
  const handleConfirmFeePayment = () => {
    const updatedFee = {
      amount: localFeePayment.amount || 15000,
      receiptNo: localFeePayment.receiptNo || `REC-${Date.now().toString().slice(-6)}`,
      mode: localFeePayment.mode || "UPI",
      isPaid: true,
      paidAt: new Date().toISOString()
    };
    setLocalFeePayment(updatedFee);
    setActiveStage("fee_paid");
    syncToBackend({ feePayment: updatedFee, stage: "fee_paid" });
    onStatusChange?.(application.id, "fee_paid");
    showToast("Admission fee recorded! Stage moved to 'Fee paid'", "success");
  };

  // Permanent student enrollment action
  const handleEnrollStudent = async () => {
    const confirmMsg = `Are you sure you want to finalize admission for ${application.name} (${application.classGrade})? This will allocate the next Roll Number and create a permanent student account with portal login credentials.`;
    if (!window.confirm(confirmMsg)) return;

    setEnrolling(true);
    try {
      const res = await api.patch(`/admin/admissions/${application.id}/confirm`);
      const creds = res.data?.data?.studentCreds;
      if (creds) {
        setCreatedCreds(creds);
        onEnrollSuccess?.(creds);
      }
      setActiveStage("enrolled");
      onStatusChange?.(application.id, "enrolled");
      showToast(`Admission confirmed! Student account generated for ${application.name}`, "success");
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to confirm admission", "error");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sliding Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-4xl bg-surface border-l border-line shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 overflow-hidden">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-line bg-surface flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex flex-col gap-1">
              <div className="text-small text-ink-secondary flex items-center gap-2">
                <span>Admissions › Application</span>
                <span className="font-mono text-ink font-semibold px-2 py-0.5 rounded bg-surface-subtle border border-line">
                  {application.applicationNo}
                </span>
              </div>
              <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
                {application.name} · {application.classGrade}
              </h1>
              <div className="text-small text-ink-secondary">
                Applied online {application.appliedDate} · Counsellor: {application.counsellor} · Source: {application.source}
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {activeStage !== "enrolled" && (
                <button
                  onClick={() => {
                    onMarkLost?.(application.id);
                    showToast(`Application marked as lost`, "info");
                    onClose();
                  }}
                  className="min-h-[42px] px-3.5 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-small font-medium text-ink-secondary hover:text-red-700 transition-colors cursor-pointer"
                >
                  Mark as lost
                </button>
              )}

              {/* Primary Action Button */}
              {activeStage === "enrolled" ? (
                <Link
                  to="/admin/students"
                  className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-body font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <GraduationCap size={16} />
                  <span>View in Student Directory →</span>
                </Link>
              ) : activeStage === "fee_paid" || (activeStage === "approved" && localFeePayment.isPaid) ? (
                <button
                  onClick={handleEnrollStudent}
                  disabled={enrolling}
                  className="min-h-[42px] px-5 rounded-control bg-emerald-700 hover:bg-emerald-800 text-white text-body font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {enrolling ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <GraduationCap size={16} />
                  )}
                  <span>Enroll Student & Generate ID</span>
                </button>
              ) : (
                <button
                  onClick={handleAdvanceStage}
                  className={`min-h-[42px] px-5 rounded-control text-body font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                    validation.canAdvance
                      ? "bg-primary hover:bg-primary-dark text-white"
                      : "bg-surface-subtle hover:bg-amber-50 text-amber-900 border border-amber-300"
                  }`}
                  title={
                    validation.canAdvance
                      ? `Advance to ${validation.nextStageLabel}`
                      : `Fulfill requirements first (${metCount}/${totalCount} completed)`
                  }
                >
                  {validation.canAdvance ? (
                    <>
                      <span>Advance to {validation.nextStageLabel || "Next Stage"}</span>
                      <ChevronRight size={16} />
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                      <span>Requirements Pending ({metCount}/{totalCount})</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-control border border-line flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Pipeline Stage Tracker */}
          <div className="px-6 py-2.5 border-b border-line bg-surface-head overflow-x-auto shrink-0">
            <ol className="list-none m-0 p-0 flex items-center gap-1.5 min-w-max text-small">
              {STAGES.map((s, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                let badgeStyle = "bg-surface-column text-ink-secondary hover:text-ink hover:bg-surface-subtle";
                if (isPassed) {
                  badgeStyle = "bg-primary-tint text-primary-dark font-medium";
                } else if (isCurrent) {
                  badgeStyle = "bg-primary text-white font-semibold shadow-xs";
                }

                return (
                  <li
                    key={s.key}
                    onClick={() => handleStagePillClick(s.key as ApplicationDetail["stage"], idx)}
                    className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 select-none ${badgeStyle}`}
                    title={isCurrent ? "Current Stage" : isPassed ? "Completed Stage (Click to inspect)" : "Future Stage (Requirements must be fulfilled)"}
                  >
                    {isPassed && <Check size={13} className="shrink-0" />}
                    <span>{s.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Stage Requirements Guard Banner */}
          <div className="px-6 py-3 bg-surface-subtle border-b border-line shrink-0">
            <div className={`p-3 rounded-card border transition-all ${
              validation.canAdvance
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                : "bg-amber-50/90 border-amber-200 text-amber-950"
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  {validation.canAdvance ? (
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-amber-700 shrink-0" />
                  )}
                  <span className="font-semibold text-small">
                    Current Stage: <span className="capitalize">{activeStage.replace("_", " ")}</span>
                    {validation.nextStageLabel ? ` → Target: ${validation.nextStageLabel}` : ""}
                  </span>
                </div>
                <span className={`text-caption font-semibold px-2 py-0.5 rounded-full ${
                  validation.canAdvance ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {metCount} of {totalCount} Requirements Met
                </span>
              </div>

              {/* Requirement Checklist */}
              <div className="space-y-1.5 pt-1">
                {validation.requirements.map((req) => (
                  <div key={req.id} className="flex items-start gap-2 text-caption">
                    <span className="mt-0.5">
                      {req.met ? (
                        <Check size={14} className="text-emerald-700 shrink-0 font-bold" />
                      ) : (
                        <AlertTriangle size={14} className="text-amber-700 shrink-0" />
                      )}
                    </span>
                    <div className="flex-1">
                      <span className={`font-medium ${req.met ? "text-emerald-900" : "text-amber-900 font-semibold"}`}>
                        {req.title}:
                      </span>{" "}
                      <span className={req.met ? "text-emerald-800/80" : "text-amber-800"}>
                        {req.helpText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Credentials Banner when newly enrolled */}
          {createdCreds && (
            <div className="mx-6 mt-4 p-4 rounded-card bg-nav-bg text-white border border-gold/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fadeIn shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-control bg-gold/20 flex items-center justify-center text-gold shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="m-0 text-body font-semibold text-white">Student Account Created Successfully!</h4>
                  <p className="m-0 text-caption text-nav-muted">Login credentials for Student & Parent Portal access:</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-caption bg-white/10 px-3 py-1.5 rounded-control text-white border border-white/10">
                  Email: <strong>{createdCreds.email}</strong>
                </span>
                <span className="font-mono text-caption bg-white/10 px-3 py-1.5 rounded-control text-gold border border-gold/20">
                  Password: <strong>{createdCreds.password}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Calm Enrolled Indicator if already enrolled and not newly generated */}
          {activeStage === "enrolled" && !createdCreds && (
            <div className="mx-6 mt-3 px-4 py-2.5 rounded-control bg-emerald-50 border border-emerald-200 text-emerald-900 text-small flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <span>Student is officially enrolled. Academic profile is active in the Student Directory.</span>
              </div>
              <Link
                to="/admin/students"
                className="text-caption font-semibold text-emerald-800 hover:underline shrink-0"
              >
                View Student Profile →
              </Link>
            </div>
          )}

          {/* Drawer Body (2 Columns layout matching 07-AdmissionForm.html) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Left Column (Details + Documents + Fee Collection) */}
              <div className="flex-1 w-full space-y-6">
                
                {/* Application Details Card */}
                <section id="details-section" className="bg-surface rounded-card border border-line p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0 text-h2 font-semibold text-ink">Application details</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-caption text-ink-secondary">
                        Class: <strong className="text-ink">{application.classGrade}</strong>
                      </span>
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(application)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-caption font-semibold text-ink-secondary hover:text-primary transition-colors cursor-pointer shadow-xs"
                          title="Edit application and personal details"
                        >
                          <Edit size={13} />
                          <span>Edit Details</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <dl className="m-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-caption text-ink-secondary">Date of birth</dt>
                      <dd className="m-0 text-body font-medium text-ink">{application.dob || "Awaiting verification"}</dd>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <dt className="text-caption text-ink-secondary">Gender</dt>
                      <dd className="m-0 text-body font-medium text-ink">{application.gender}</dd>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <dt className="text-caption text-ink-secondary">Category</dt>
                      <dd className="m-0 text-body font-medium text-ink">{application.category}</dd>
                    </div>

                    <div className="flex flex-col gap-0.5 sm:col-span-2 md:col-span-1">
                      <dt className="text-caption text-ink-secondary">Father / Guardian</dt>
                      <dd className="m-0 text-body font-medium text-ink">
                        {application.fatherName} · <span className="font-mono text-small">{application.fatherPhone}</span>
                      </dd>
                    </div>

                    <div className="flex flex-col gap-0.5 sm:col-span-2 md:col-span-1">
                      <dt className="text-caption text-ink-secondary">Mother</dt>
                      <dd className="m-0 text-body font-medium text-ink">
                        {application.motherName || "Not provided"} {application.motherPhone ? `· ${application.motherPhone}` : ""}
                      </dd>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <dt className="text-caption text-ink-secondary">Previous school</dt>
                      <dd className="m-0 text-body font-medium text-ink">{application.previousSchool}</dd>
                    </div>

                    <div className="flex flex-col gap-0.5 sm:col-span-2">
                      <dt className="text-caption text-ink-secondary">Address</dt>
                      <dd className="m-0 text-body font-medium text-ink">{application.address}</dd>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <dt className="text-caption text-ink-secondary">Sibling in school</dt>
                      <dd className="m-0 text-body font-medium text-ink">{application.siblingInSchool}</dd>
                    </div>

                    <div className="flex flex-col gap-0.5 sm:col-span-2">
                      <dt className="text-caption text-ink-secondary">Transport needed</dt>
                      <dd className="m-0 text-body font-medium text-ink">{application.transportNeeded}</dd>
                    </div>
                  </dl>

                  {/* Age Check Banner (07-AdmissionForm spec) */}
                  <div className="p-3 rounded-control bg-success-bg text-success-text text-small font-medium flex items-center gap-2">
                    <ShieldCheck size={16} className="shrink-0" />
                    <span>{application.ageCheckText}</span>
                  </div>
                </section>

                {/* Documents Section (With interactive verification buttons) */}
                <section id="documents-section" className="bg-surface rounded-card border border-line overflow-hidden shadow-xs">
                  <div className="p-4 px-5 border-b border-line flex flex-wrap items-center justify-between gap-3 bg-surface-head">
                    <div>
                      <h2 className="m-0 text-h2 font-semibold text-ink">Document Verification</h2>
                      <p className="m-0 text-caption text-ink-secondary">
                        {localDocuments.filter((d) => d.status === "Verified").length} of {localDocuments.length} verified
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleVerifyAllDocuments}
                        className="min-h-[34px] px-3 rounded-control bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-caption font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Mark all pending documents as verified"
                      >
                        <Check size={14} />
                        <span>Verify All</span>
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-line/60">
                    {localDocuments.map((doc) => (
                      <div key={doc.id} className="p-4 px-5 flex flex-wrap items-center justify-between gap-3 hover:bg-surface-subtle/50 transition-colors">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-body font-medium text-ink">{doc.title}</span>
                          <span className="text-caption text-ink-secondary">{doc.meta}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span 
                            className={`px-2.5 py-0.5 rounded-full text-caption font-semibold flex items-center gap-1 ${
                              doc.status === "Verified"
                                ? "bg-success-bg text-success-text"
                                : doc.status === "Rejected"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-warning-bg text-warning-text border border-warning-border"
                            }`}
                          >
                            {doc.status === "Verified" && <Check size={12} />}
                            {doc.status}
                          </span>

                          {doc.status === "Verified" ? (
                            <button
                              type="button"
                              onClick={() => handleResetDocument(doc.id)}
                              className="min-h-[32px] px-2.5 rounded-control border border-line text-caption font-medium text-ink-secondary hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
                              title="Revert to pending"
                            >
                              Reset
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleVerifyDocument(doc.id)}
                                className="min-h-[32px] px-3 rounded-control bg-emerald-700 hover:bg-emerald-800 text-white text-caption font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              >
                                <Check size={13} /> Verify
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectDocument(doc.id)}
                                className="min-h-[32px] px-2.5 rounded-control border border-line text-caption font-medium text-ink-secondary hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Admission Fee Payment Card */}
                <section id="fee-section" className="bg-surface rounded-card border border-line p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-control bg-primary-tint flex items-center justify-center text-primary-dark shrink-0">
                        <CreditCard size={17} />
                      </div>
                      <div>
                        <h2 className="m-0 text-h2 font-semibold text-ink">Admission Fee Confirmation</h2>
                        <p className="m-0 text-caption text-ink-secondary">Required to advance from 'Approved' to 'Fee paid'</p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-caption font-semibold flex items-center gap-1.5 ${
                      localFeePayment.isPaid
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {localFeePayment.isPaid ? <Check size={13} /> : <Clock size={13} />}
                      {localFeePayment.isPaid ? "Payment Received" : "Payment Pending"}
                    </span>
                  </div>

                  {localFeePayment.isPaid ? (
                    <div className="p-4 rounded-control bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-wrap items-center justify-between gap-3 text-small">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-body">
                          ₹{localFeePayment.amount.toLocaleString()} Confirmed Paid
                        </div>
                        <div className="text-caption text-emerald-800">
                          Receipt No: <span className="font-mono font-semibold">{localFeePayment.receiptNo}</span> · Mode: {localFeePayment.mode}
                        </div>
                      </div>
                      <span className="text-caption font-medium text-emerald-700">
                        Recorded on file
                      </span>
                    </div>
                  ) : (
                    <div className="bg-surface-subtle p-4 rounded-control border border-line space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className="flex flex-col gap-1 text-caption font-medium text-ink">
                          Fee Amount (₹)
                          <input
                            type="number"
                            value={localFeePayment.amount}
                            onChange={(e) => setLocalFeePayment({ ...localFeePayment, amount: Number(e.target.value) })}
                            className="min-h-[38px] px-3 border border-line-input rounded-control bg-surface font-mono text-body text-ink focus:outline-none focus:border-primary"
                          />
                        </label>

                        <label className="flex flex-col gap-1 text-caption font-medium text-ink">
                          Payment Mode
                          <select
                            value={localFeePayment.mode}
                            onChange={(e) => setLocalFeePayment({ ...localFeePayment, mode: e.target.value })}
                            className="min-h-[38px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                          >
                            <option value="UPI">UPI / QR Code</option>
                            <option value="Cash">Cash</option>
                            <option value="Net Banking">Net Banking / NEFT</option>
                            <option value="Cheque">Cheque</option>
                          </select>
                        </label>

                        <label className="flex flex-col gap-1 text-caption font-medium text-ink">
                          Receipt / Ref Number
                          <input
                            type="text"
                            value={localFeePayment.receiptNo}
                            onChange={(e) => setLocalFeePayment({ ...localFeePayment, receiptNo: e.target.value })}
                            className="min-h-[38px] px-3 border border-line-input rounded-control bg-surface font-mono text-body text-ink focus:outline-none focus:border-primary"
                          />
                        </label>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleConfirmFeePayment}
                          className="min-h-[38px] px-5 rounded-control bg-emerald-700 hover:bg-emerald-800 text-white text-small font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Check size={15} />
                          <span>Record & Confirm Fee Payment</span>
                        </button>
                      </div>
                    </div>
                  )}
                </section>

              </div>

              {/* Right Column (Sidebar details: Interaction, Seats, Follow-up log) */}
              <aside className="w-full lg:w-80 flex flex-col gap-5 shrink-0">
                
                {/* Interaction / Test Card */}
                <section id="interaction-section" className="bg-surface rounded-card border border-line p-5 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0 text-[15px] font-semibold text-ink">Interaction / Test</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-caption font-semibold ${
                      outcome === "Recommended"
                        ? "bg-emerald-100 text-emerald-800"
                        : outcome === "Not recommended"
                        ? "bg-red-100 text-red-800"
                        : "bg-surface-subtle text-ink-secondary"
                    }`}>
                      {outcome}
                    </span>
                  </div>

                  <div className="text-body text-ink font-medium">
                    {dateTimeRoom}
                  </div>
                  
                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Evaluation Outcome *
                    <select
                      value={outcome}
                      onChange={(e) => handleOutcomeChange(e.target.value)}
                      className={`min-h-[42px] px-3 border rounded-control bg-surface text-body font-medium text-ink focus:outline-none ${
                        outcome === "Recommended"
                          ? "border-emerald-500 bg-emerald-50/30"
                          : "border-line-input focus:border-primary"
                      }`}
                    >
                      <option value="Not held yet">Not held yet</option>
                      <option value="Recommended">Recommended (Approved for Admission)</option>
                      <option value="Not recommended">Not recommended</option>
                    </select>
                  </label>

                  <p className="m-0 text-caption text-ink-secondary">
                    * Stage can only advance to <strong>Approved</strong> when outcome is set to <strong>Recommended</strong>.
                  </p>
                </section>

                {/* Seats in Class Card */}
                <section className="bg-surface rounded-card border border-line p-5 space-y-2.5 shadow-xs">
                  <h2 className="m-0 text-[15px] font-semibold text-ink">
                    Seats in {application.classGrade} · Intake
                  </h2>
                  <div className="flex justify-between items-center text-body">
                    <span className="text-ink-secondary">Available</span>
                    <span className="font-mono font-medium text-ink">
                      {application.seatsSnapshot?.available}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-body">
                    <span className="text-ink-secondary">RTE seats available</span>
                    <span className="font-mono font-medium text-ink">
                      {application.seatsSnapshot?.rteAvailable}
                    </span>
                  </div>
                </section>

                {/* Follow-up Log Card */}
                <section id="followup-section" className="bg-surface rounded-card border border-line p-5 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h2 className="m-0 text-[15px] font-semibold text-ink">Follow-up log</h2>
                    <span className="text-caption text-ink-secondary">{localFollowUps.length} entries</span>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {localFollowUps.map((fu) => (
                      <div key={fu.id} className="pt-2 border-t border-line/60 flex flex-col gap-0.5">
                        <span className="text-micro font-medium text-ink-secondary">{fu.dateType}</span>
                        <span className="text-small text-ink leading-snug">{fu.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add Follow-up Form */}
                  <form onSubmit={handleAddFollowUp} className="pt-2 border-t border-line space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={noteType}
                        onChange={(e) => setNoteType(e.target.value as any)}
                        className="text-caption border border-line-input rounded-control px-2 py-1 bg-surface text-ink focus:outline-none"
                      >
                        <option value="Call">Call</option>
                        <option value="Visit">Visit</option>
                        <option value="WhatsApp">WhatsApp</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Add interaction note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="flex-1 text-caption border border-line-input rounded-control px-2.5 py-1 bg-surface text-ink focus:outline-none focus:border-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="w-full min-h-[36px] rounded-control bg-surface border border-line hover:bg-surface-subtle text-caption font-semibold text-ink transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} /> Add follow-up
                    </button>
                  </form>
                </section>

              </aside>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
