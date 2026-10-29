import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import {
  MdSearch,
  MdClose,
  MdSend,
  MdCheckCircle,
  MdArrowForward,
  MdArrowBack,
  MdAttachFile,
  MdOutlineChat,
} from "react-icons/md";

interface Ticket {
  id: string;
  subject: string;
  meta: string;
  status: "Open" | "Waiting on you" | "Resolved";
  statusBg: string;
  statusColor: string;
}

interface GuideItem {
  id: string;
  title: string;
  category: string;
  stepsCount: string;
  content: string[];
}

const GUIDES: GuideItem[] = [
  {
    id: "g1",
    title: "Getting started checklist",
    category: "Setup",
    stepsCount: "6 steps",
    content: [
      "1. Verify institute details, affiliation no. and UDISE in Settings.",
      "2. Configure Academic Sessions and Terms in Academic Settings.",
      "3. Import or enroll student roster via Admissions › Records.",
      "4. Define Fee Structure with heads and installment schedules.",
      "5. Invite faculty members with auto-scoped class teacher roles.",
      "6. Activate biometric devices or configure daily morning attendance cutoff.",
    ],
  },
  {
    id: "g2",
    title: "Collect a fee and print a receipt",
    category: "Fees",
    stepsCount: "Fees",
    content: [
      "1. Open Fees › Counter from the main navigation sidebar.",
      "2. Scan student admission card or search student name/mobile number.",
      "3. The system automatically computes due installments and late fees.",
      "4. Select payment mode: Cash, UPI, Bank Transfer or Cheque.",
      "5. Click 'Collect & Print Receipt' to generate thermal slip or 3-inch laser receipt.",
    ],
  },
  {
    id: "g3",
    title: "Cancel or correct a receipt",
    category: "Fees",
    stepsCount: "Fees",
    content: [
      "1. Locate receipt in Counter transaction history or Daily Cash Closing.",
      "2. Click 'Void / Reversal' and enter mandatory administrative justification.",
      "3. If amount exceeds ₹10,000, multi-party Principal approval will be required.",
      "4. The system automatically logs an immutable CANCEL ledger record with IP address.",
    ],
  },
  {
    id: "g4",
    title: "Mark and correct attendance",
    category: "Attendance",
    stepsCount: "Attendance",
    content: [
      "1. Class teachers open Attendance on their portal or mobile tablet.",
      "2. All students default to 'Present'. Tap absentees to toggle red.",
      "3. Submit before cutoff (09:30 AM) to automatically dispatch SMS alerts to guardians.",
      "4. Corrections after cutoff require Class Teacher remark and Principal sync.",
    ],
  },
  {
    id: "g5",
    title: "Publish report cards",
    category: "Exams",
    stepsCount: "Exams",
    content: [
      "1. Confirm all subject teachers have locked marks entry.",
      "2. Exam Coordinator reviews grade conversions and class rank calculation.",
      "3. Navigate to Examinations › Results and click 'Generate CBSE Report Cards'.",
      "4. Preview watermarked PDF with Principal signature before unlocking parent app access.",
    ],
  },
  {
    id: "g6",
    title: "Add a section or subject",
    category: "Settings",
    stepsCount: "Settings",
    content: [
      "1. Go to Settings › Academic Masters.",
      "2. Select Target Class (e.g. Class 6) and click 'Add Section' (e.g. 6-C).",
      "3. Assign designated Class Teacher from Staff Directory.",
      "4. Attach curricular subjects and weekly lecture slot requirements in Routine Timetable.",
    ],
  },
];

const DEFAULT_TICKETS: Ticket[] = [
  {
    id: "TKT-0915",
    subject: "Parent app OTP not received (Jio numbers)",
    meta: "TKT-0915 · High · raised 10 Oct · support replied today",
    status: "Open",
    statusBg: "#E3EFEF",
    statusColor: "#08393F",
  },
  {
    id: "TKT-0897",
    subject: "Receipt shows wrong installment name",
    meta: "TKT-0897 · asked for a screenshot",
    status: "Waiting on you",
    statusBg: "#FFF6EC",
    statusColor: "#7A4106",
  },
  {
    id: "TKT-0861",
    subject: "How to add a third section to Class 6?",
    meta: "TKT-0861 · solved with a guide",
    status: "Resolved",
    statusBg: "#E4F1E8",
    statusColor: "#1E5A33",
  },
];

export default function HelpSupportPage() {
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<"help" | "support_access">("help");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>(DEFAULT_TICKETS);
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);

  // Ticket Form
  const [ticketForm, setTicketForm] = useState({
    category: "Fees",
    subject: "",
    details: "",
    urgency: "Normal",
  });

  // Support Access Request state (Screen 47)
  const [supportRequestStatus, setSupportRequestStatus] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );

  const filteredGuides = GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.details.trim()) {
      showToast("Please provide ticket subject and explanation", "error");
      return;
    }
    const newTkt: Ticket = {
      id: `TKT-0${Math.floor(920 + Math.random() * 80)}`,
      subject: ticketForm.subject,
      meta: `TKT-0${Math.floor(920 + Math.random() * 80)} · ${ticketForm.urgency} · raised just now`,
      status: "Open",
      statusBg: "#E3EFEF",
      statusColor: "#08393F",
    };
    setTickets([newTkt, ...tickets]);
    setTicketForm({ category: "Fees", subject: "", details: "", urgency: "Normal" });
    showToast(`Support ticket ${newTkt.id} dispatched to GuruConnect engineers!`, "success");
  };

  const handleApproveAccess = () => {
    setSupportRequestStatus("approved");
    showToast("2-hour read-only access granted to Priya Kumari (Support). Recorded in Audit Log.", "success");
  };

  const handleRejectAccess = () => {
    setSupportRequestStatus("rejected");
    showToast("Support access request rejected.", "info");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* =========================================================================
          SCREEN 47 VIEW: SUPPORT ACCESS
         ========================================================================= */}
      {currentView === "support_access" ? (
        <div className="space-y-5">
          {/* Header Row */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-[13px] text-ink-secondary flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentView("help")}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Help & support
                </button>
                <span>›</span>
                <span className="text-ink">Support access</span>
              </div>
              <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
                Support access
              </h1>
              <div className="text-[13px] text-ink-secondary">
                The software team can see your school's data only when you allow it, only for the area and time you approve. Every action is recorded in your audit log.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView("help")}
              className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <MdArrowBack size={16} className="text-ink-secondary" />
              <span>Back to Help & support</span>
            </button>
          </div>

          {/* Decision Card matching Screen 47 */}
          {supportRequestStatus === "pending" && (
            <section className="bg-white border-2 border-primary rounded-card p-5 sm:p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning-bg text-warning-text">
                  Waiting for your decision
                </span>
              </div>

              <h2 className="text-lg font-semibold text-ink">
                Priya Kumari (Support) asks to view your Fees
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs py-3 border-y border-line-row">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-ink-secondary">Why</span>
                  <span className="font-medium text-ink leading-relaxed">
                    Check fee installment names on 12 receipts after import (ticket TKT-0897)
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-ink-secondary">Area</span>
                  <span className="font-medium text-ink">Fees only</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-ink-secondary">Access</span>
                  <span className="font-medium text-ink">Read-only</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-ink-secondary">For how long</span>
                  <span className="font-medium text-ink">2 hours from approval</span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={handleApproveAccess}
                  className="min-h-[40px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  Approve for 2 hours
                </button>
                <button
                  type="button"
                  onClick={handleRejectAccess}
                  className="min-h-[40px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-[13px] font-medium text-ink transition-colors cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </section>
          )}

          {supportRequestStatus === "approved" && (
            <section className="bg-success-bg/30 border border-success-border rounded-card p-5 flex justify-between items-center gap-4 flex-wrap shadow-xs">
              <div className="flex items-center gap-3">
                <MdCheckCircle className="text-success-text shrink-0" size={24} />
                <div>
                  <div className="font-semibold text-sm text-success-text">
                    Active Support Grant: Priya Kumari (Fees, Read-only)
                  </div>
                  <div className="text-xs text-ink-secondary">
                    Session expires in 1 hour 58 minutes. Every action is recorded in audit ledger.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSupportRequestStatus("rejected");
                  showToast("Access revoked immediately.", "info");
                }}
                className="min-h-[36px] px-3.5 rounded-control border border-danger-border bg-white text-xs font-semibold text-danger hover:bg-danger-bg transition-colors cursor-pointer"
              >
                Revoke now
              </button>
            </section>
          )}

          {supportRequestStatus === "rejected" && (
            <section className="bg-white border border-line rounded-card p-4 text-xs text-ink-secondary shadow-xs">
              No pending support requests. All requests resolved or expired.
            </section>
          )}

          {/* History Table matching Screen 47 */}
          <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-line-row">
              <h2 className="text-base font-semibold text-ink">History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="table-fixed w-full min-w-[760px] border-collapse text-left">
                <colgroup>
                  <col className="w-[120px]" />
                  <col className="w-[160px]" />
                  <col className="w-[200px]" />
                  <col className="w-[160px]" />
                  <col className="w-auto" />
                </colgroup>
                <thead>
                  <tr className="bg-surface-head text-ink border-b border-line text-xs font-semibold">
                    <th className="py-3 px-4">When</th>
                    <th className="py-3 px-4">Who</th>
                    <th className="py-3 px-4">Area</th>
                    <th className="py-3 px-4">Approved by</th>
                    <th className="py-3 px-4">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row">
                  <tr className="hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-4 text-xs font-medium text-ink">28 Sep</td>
                    <td className="py-3 px-4 text-xs text-ink">Priya Kumari</td>
                    <td className="py-3 px-4 text-xs text-ink">Whole school, read-only</td>
                    <td className="py-3 px-4 text-xs text-ink-secondary">Meera Kumawat</td>
                    <td className="py-3 px-4 text-xs text-ink-secondary">
                      Revoked by school after 40 min · 6 actions
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-4 text-xs font-medium text-ink">12 Aug</td>
                    <td className="py-3 px-4 text-xs text-ink">Aman Shekhawat</td>
                    <td className="py-3 px-4 text-xs text-ink">Import (write)</td>
                    <td className="py-3 px-4 text-xs text-ink-secondary">Meera Kumawat</td>
                    <td className="py-3 px-4 text-xs text-ink-secondary">
                      Ended on time · 214 actions (student import)
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-subtle transition-colors">
                    <td className="py-3 px-4 text-xs font-medium text-ink">20 Jul</td>
                    <td className="py-3 px-4 text-xs text-ink">Priya Kumari</td>
                    <td className="py-3 px-4 text-xs text-ink">Exams, read-only</td>
                    <td className="py-3 px-4 text-xs text-ink-secondary">Dr. Kavita Rao</td>
                    <td className="py-3 px-4 text-xs text-ink-secondary">
                      Ended on time · 9 actions
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        /* =========================================================================
            SCREEN 46 VIEW: HELP AND SUPPORT
           ========================================================================= */
        <div className="space-y-5">
          {/* Header Row */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-[13px] text-ink-secondary">
                Help & support
              </div>
              <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
                Help and support
              </h1>
              <div className="text-[13px] text-ink-secondary">
                Guides, your tickets to the software team, and support access requests.
              </div>
            </div>

            {/* Waiting banner button matching Screen 46 */}
            <button
              type="button"
              onClick={() => setCurrentView("support_access")}
              className="min-h-[42px] px-4 rounded-control bg-warning-bg border border-warning-border text-warning-text text-[13px] font-semibold transition-all hover:bg-warning-warm flex items-center gap-2 shadow-xs cursor-pointer active:scale-[0.98]"
            >
              <span className="w-2 h-2 rounded-full bg-warning-accent animate-pulse" />
              <span>1 support access request waiting</span>
            </button>
          </div>

          {/* 2 Column Layout matching Screen 46 */}
          <div className="flex flex-wrap gap-5 items-start">
            {/* Left Column: Search, Guides, Tickets */}
            <div className="flex-[999] basis-[520px] min-w-0 space-y-4">
              {/* Search Bar */}
              <div className="flex items-center gap-3 min-h-[46px] px-4 border border-line-input rounded-control bg-white shadow-xs focus-within:border-primary transition-colors">
                <MdSearch className="text-ink-secondary shrink-0" size={20} />
                <input
                  type="search"
                  placeholder="Search guides — for example: cancel a receipt, add a section"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-xs sm:text-[13.5px] text-ink outline-none placeholder:text-ink-muted"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-ink-secondary hover:text-ink cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* 6 Guide Cards Grid matching Screen 46 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredGuides.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGuide(g)}
                    className="text-left bg-white border border-line hover:border-primary rounded-card p-4 transition-all duration-150 flex flex-col gap-1.5 shadow-xs group cursor-pointer hover:shadow-sm"
                  >
                    <span className="text-[13.5px] font-semibold text-ink group-hover:text-primary transition-colors line-clamp-2">
                      {g.title}
                    </span>
                    <span className="text-xs text-ink-secondary mt-auto flex items-center justify-between">
                      <span>{g.stepsCount}</span>
                      <MdArrowForward size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </span>
                  </button>
                ))}
              </div>

              {/* My Tickets Section matching Screen 46 */}
              <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
                <div className="p-4 sm:p-5 border-b border-line-row flex justify-between items-center">
                  <h2 className="text-base font-semibold text-ink">My tickets</h2>
                  <span className="text-xs text-ink-secondary">{tickets.length} total</span>
                </div>
                <div className="divide-y divide-line-row">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 flex justify-between items-center gap-3 flex-wrap hover:bg-surface-subtle transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-ink">{t.subject}</span>
                        <span className="text-xs text-ink-secondary">{t.meta}</span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          t.status === "Open"
                            ? "bg-primary-tint text-primary-dark"
                            : t.status === "Waiting on you"
                            ? "bg-warning-bg text-warning-text"
                            : "bg-success-bg text-success-text"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Raise a Ticket Form matching Screen 46 */}
            <aside className="flex-1 basis-[320px] min-w-[280px] bg-white border border-line rounded-card p-5 flex flex-col gap-4 shadow-xs">
              <div className="pb-1 border-b border-line-row">
                <h2 className="text-base font-semibold text-ink">Raise a ticket</h2>
                <p className="text-xs text-ink-secondary mt-0.5">Software engineering & product support</p>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">What is it about?</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full h-10 px-3 border border-line-input rounded-control bg-surface-subtle focus:bg-white focus:outline-none focus:border-primary text-xs text-ink transition-colors cursor-pointer"
                  >
                    <option value="Fees">Fees</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Exams and report cards">Exams and report cards</option>
                    <option value="Login and users">Login and users</option>
                    <option value="Something else">Something else</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="One line summary"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full h-10 px-3 border border-line-input rounded-control bg-surface-subtle focus:bg-white focus:outline-none focus:border-primary text-xs text-ink transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Details</label>
                  <textarea
                    rows={4}
                    placeholder="What happened, which screen, and what you expected"
                    value={ticketForm.details}
                    onChange={(e) => setTicketForm({ ...ticketForm, details: e.target.value })}
                    className="w-full p-2.5 border border-line-input rounded-control bg-surface-subtle focus:bg-white focus:outline-none focus:border-primary text-xs text-ink transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Opening screenshot file picker...", "info")}
                  className="w-full min-h-[38px] px-3.5 border border-line-input rounded-control bg-white hover:bg-slate-50 text-xs font-medium text-ink transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MdAttachFile size={16} className="text-ink-secondary" />
                  <span>Attach screenshot</span>
                </button>

                <div>
                  <label className="block text-ink-secondary font-medium mb-1">How urgent?</label>
                  <select
                    value={ticketForm.urgency}
                    onChange={(e) => setTicketForm({ ...ticketForm, urgency: e.target.value })}
                    className="w-full h-10 px-3 border border-line-input rounded-control bg-surface-subtle focus:bg-white focus:outline-none focus:border-primary text-xs text-ink transition-colors cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High — work is stopped</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <MdSend size={16} />
                  <span>Send ticket</span>
                </button>

                <div className="pt-1 text-center border-t border-line-row">
                  <a
                    href="https://wa.me/919829012345"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-ink-secondary hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <MdOutlineChat size={15} />
                    <span>Or chat on WhatsApp: +91 98290 12345</span>
                  </a>
                </div>
              </form>
            </aside>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: GUIDE DETAIL WALKTHROUGH
         ========================================================================= */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-card border border-line max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-line-row pb-3">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wide">
                  {selectedGuide.category} Guide
                </span>
                <h3 className="font-semibold text-lg text-ink">{selectedGuide.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="w-8 h-8 rounded-control flex items-center justify-center text-ink-secondary hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="space-y-2 text-xs text-ink leading-relaxed">
              {selectedGuide.content.map((step, idx) => (
                <div key={idx} className="p-3 bg-surface-subtle border border-line-row rounded-control">
                  {step}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-line-row">
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="min-h-[38px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Understood, close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
