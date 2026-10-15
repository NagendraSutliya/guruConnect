import React, { useState } from "react";
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
  MessageSquare
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
}

interface ApplicationReviewDrawerProps {
  application: ApplicationDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (appId: string, newStage: ApplicationDetail["stage"]) => void;
  onMarkLost?: (appId: string) => void;
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
}: ApplicationReviewDrawerProps) {
  const { showToast } = useToast();
  
  const [outcome, setOutcome] = useState<string>(
    application?.interactionSchedule?.outcome || "Not held yet"
  );
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"Call" | "Visit" | "WhatsApp">("Call");
  const [localFollowUps, setLocalFollowUps] = useState(application?.followUps || []);
  const [activeStage, setActiveStage] = useState<ApplicationDetail["stage"]>(
    application?.stage || "verification"
  );

  React.useEffect(() => {
    if (application) {
      setOutcome(application.interactionSchedule?.outcome || "Not held yet");
      setLocalFollowUps(application.followUps || []);
      setActiveStage(application.stage || "verification");
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const currentStageIndex = STAGES.findIndex((s) => s.key === activeStage);

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

    setLocalFollowUps([newEntry, ...localFollowUps]);
    setNewNote("");
    showToast("Follow-up note logged", "success");
  };

  const handleAdvanceStage = () => {
    const nextIndex = currentStageIndex + 1;
    if (nextIndex < STAGES.length) {
      const nextStage = STAGES[nextIndex].key as ApplicationDetail["stage"];
      setActiveStage(nextStage);
      onStatusChange?.(application.id, nextStage);
      showToast(`Application moved to "${STAGES[nextIndex].label}"`, "success");
    } else {
      showToast("Student is already fully enrolled", "info");
    }
  };

  const handleDocumentAction = (docTitle: string, action: string) => {
    showToast(`${docTitle}: ${action}`, "info");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sliding Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-4xl bg-surface border-l border-line shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-line bg-surface flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex flex-col gap-1">
              <div className="text-small text-ink-secondary">
                Admissions › Application{" "}
                <span className="font-mono text-ink font-semibold">
                  {application.applicationNo}
                </span>
              </div>
              <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
                {application.name} · {application.classGrade}
              </h1>
              <div className="text-small text-ink-secondary">
                Applied online {application.appliedDate} · Counsellor {application.counsellor} · Source: {application.source}
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => {
                  onMarkLost?.(application.id);
                  showToast(`Application marked as lost`, "info");
                  onClose();
                }}
                className="min-h-[42px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-body font-medium text-ink transition-colors cursor-pointer"
              >
                Mark as lost
              </button>

              <button
                onClick={handleAdvanceStage}
                className="min-h-[42px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-body font-semibold transition-colors cursor-pointer"
              >
                {activeStage === "approved" || activeStage === "fee_paid"
                  ? "Enroll Student"
                  : "Send for principal approval"}
              </button>

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
          <div className="px-6 py-3 border-b border-line bg-surface-head overflow-x-auto shrink-0">
            <ol className="list-none m-0 p-0 flex items-center gap-1.5 min-w-max text-small">
              {STAGES.map((s, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                let badgeStyle = "bg-surface-column text-ink-secondary font-medium";
                if (isPassed) {
                  badgeStyle = "bg-primary-tint text-primary-dark font-medium";
                } else if (isCurrent) {
                  badgeStyle = "bg-primary text-white font-semibold shadow-xs";
                }

                return (
                  <li
                    key={s.key}
                    onClick={() => {
                      setActiveStage(s.key as ApplicationDetail["stage"]);
                      onStatusChange?.(application.id, s.key as ApplicationDetail["stage"]);
                    }}
                    className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${badgeStyle}`}
                  >
                    {isPassed && <span>✓</span>}
                    <span>{s.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Drawer Body (2 Columns layout matching 07-AdmissionForm.html) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Left Column (Details + Documents) */}
              <div className="flex-1 w-full space-y-6">
                
                {/* Application Details Card */}
                <section className="bg-surface rounded-card border border-line p-5 space-y-4">
                  <h2 className="m-0 text-h2 font-semibold text-ink">Application details</h2>
                  
                  <dl className="m-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-caption text-ink-secondary">Date of birth</dt>
                      <dd className="m-0 text-body font-medium text-ink">{application.dob}</dd>
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
                      <dt className="text-caption text-ink-secondary">Father</dt>
                      <dd className="m-0 text-body font-medium text-ink">
                        {application.fatherName} · {application.fatherPhone}
                      </dd>
                    </div>

                    <div className="flex flex-col gap-0.5 sm:col-span-2 md:col-span-1">
                      <dt className="text-caption text-ink-secondary">Mother</dt>
                      <dd className="m-0 text-body font-medium text-ink">
                        {application.motherName} · {application.motherPhone}
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

                {/* Documents Section */}
                <section className="bg-surface rounded-card border border-line overflow-hidden">
                  <div className="p-4 px-5 border-b border-line flex items-center justify-between">
                    <h2 className="m-0 text-h2 font-semibold text-ink">Documents</h2>
                    <span className="text-small text-ink-secondary">
                      {application.documents.filter((d) => d.status === "Verified").length} of {application.documents.length} verified
                    </span>
                  </div>

                  <div className="divide-y divide-line/60">
                    {application.documents.map((doc) => (
                      <div key={doc.id} className="p-4 px-5 flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-body font-medium text-ink truncate">{doc.title}</span>
                          <span className="text-caption text-ink-secondary truncate">{doc.meta}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span 
                            className={`px-2.5 py-0.5 rounded-full text-caption font-semibold ${
                              doc.status === "Verified"
                                ? "bg-success-bg text-success-text"
                                : "bg-warning-bg text-warning-text border border-warning-border"
                            }`}
                          >
                            {doc.status}
                          </span>

                          {doc.status === "Verified" ? (
                            <button
                              onClick={() => handleDocumentAction(doc.title, "Preview opened")}
                              className="min-h-[34px] px-3 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-caption font-medium text-ink transition-colors cursor-pointer"
                            >
                              View
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDocumentAction(doc.title, "Re-upload request sent via SMS")}
                              className="min-h-[34px] px-3 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-caption font-medium text-ink transition-colors cursor-pointer"
                            >
                              Request re-upload
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>

              {/* Right Column (Sidebar details: Interaction, Seats, Follow-up log) */}
              <aside className="w-full lg:w-80 flex flex-col gap-5 shrink-0">
                
                {/* Interaction Card */}
                <section className="bg-surface rounded-card border border-line p-5 space-y-3">
                  <h2 className="m-0 text-[15px] font-semibold text-ink">Interaction</h2>
                  <div className="text-body text-ink font-medium">
                    {application.interactionSchedule?.dateTimeRoom}
                  </div>
                  
                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Outcome
                    <select
                      value={outcome}
                      onChange={(e) => {
                        setOutcome(e.target.value);
                        showToast(`Interaction outcome updated to ${e.target.value}`, "success");
                      }}
                      className="min-h-[42px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                    >
                      <option value="Not held yet">Not held yet</option>
                      <option value="Recommended">Recommended</option>
                      <option value="Not recommended">Not recommended</option>
                    </select>
                  </label>
                </section>

                {/* Seats in Class Card */}
                <section className="bg-surface rounded-card border border-line p-5 space-y-2.5">
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
                <section className="bg-surface rounded-card border border-line p-5 space-y-3.5">
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
