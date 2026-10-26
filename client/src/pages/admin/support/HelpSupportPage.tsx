import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import {
  MdHelpOutline,
  MdSearch,
  MdShield,
  MdClose,
  MdSend,
  MdCheckCircle,
  MdArrowForward,
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
    <div className="min-h-screen bg-[#F5F6F3] font-sans text-[#17201D] p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto space-y-5">
        {/* =========================================================================
            SCREEN 47 VIEW: SUPPORT ACCESS
           ========================================================================= */}
        {currentView === "support_access" ? (
          <div className="space-y-4">
            <div className="text-xs text-[#4F5B57]">
              <button
                onClick={() => setCurrentView("help")}
                className="hover:text-[#0E5A63] underline"
              >
                Help and support
              </button>{" "}
              › Support access
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#17201D]">Support access</h1>
              <p className="text-sm text-[#4F5B57] mt-0.5">
                The software team can see your school's data only when you allow it, only for the area and time you approve. Every action is recorded in your audit log.
              </p>
            </div>

            {/* Decision Card matching Screen 47 */}
            {supportRequestStatus === "pending" && (
              <section className="bg-white border-2 border-[#0E5A63] rounded-2xl p-6 flex flex-col gap-3.5 shadow-xs">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF6EC] text-[#7A4106] self-start">
                  Waiting for your decision
                </span>

                <h2 className="text-lg font-semibold text-[#17201D]">
                  Priya Kumari (Support) asks to view your Fees
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm py-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#4F5B57]">Why</span>
                    <span className="font-medium text-[#17201D]">
                      Check fee installment names on 12 receipts after import (ticket TKT-0897)
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#4F5B57]">Area</span>
                    <span className="font-medium text-[#17201D]">Fees only</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#4F5B57]">Access</span>
                    <span className="font-medium text-[#17201D]">Read-only</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#4F5B57]">For how long</span>
                    <span className="font-medium text-[#17201D]">2 hours from approval</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2 flex-wrap">
                  <button
                    onClick={handleApproveAccess}
                    className="h-11 px-5 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white text-sm font-semibold transition shadow-xs"
                  >
                    Approve for 2 hours
                  </button>
                  <button
                    onClick={handleRejectAccess}
                    className="h-11 px-4 rounded-lg border border-[#C9D1CD] bg-white hover:bg-[#F9FAF8] text-sm font-medium text-[#17201D] transition"
                  >
                    Reject
                  </button>
                </div>
              </section>
            )}

            {supportRequestStatus === "approved" && (
              <section className="bg-[#E4F1E8]/30 border border-[#1E5A33]/30 rounded-2xl p-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <MdCheckCircle className="text-[#1E5A33]" size={24} />
                  <div>
                    <div className="font-semibold text-sm text-[#1E5A33]">
                      Active Support Grant: Priya Kumari (Fees, Read-only)
                    </div>
                    <div className="text-xs text-[#4F5B57]">Session expires in 1 hour 58 minutes.</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSupportRequestStatus("rejected");
                    showToast("Access revoked immediately.", "info");
                  }}
                  className="h-9 px-3 rounded-lg border border-[#C9D1CD] bg-white text-xs font-semibold text-[#9B1C1C]"
                >
                  Revoke now
                </button>
              </section>
            )}

            {supportRequestStatus === "rejected" && (
              <section className="bg-white border border-[#DDE2DE] rounded-xl p-4 text-xs text-[#4F5B57]">
                No pending support requests. All requests rejected or expired.
              </section>
            )}

            {/* History Table matching Screen 47 */}
            <section className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[#EEF1EF]">
                <h2 className="text-base font-semibold text-[#17201D]">History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[760px] border-collapse">
                  <thead>
                    <tr className="bg-[#F2F4F2] text-[#17201D] border-b border-[#DDE2DE]">
                      <th className="py-3 px-4 font-semibold">When</th>
                      <th className="py-3 px-4 font-semibold">Who</th>
                      <th className="py-3 px-4 font-semibold">Area</th>
                      <th className="py-3 px-4 font-semibold">Approved by</th>
                      <th className="py-3 px-4 font-semibold">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF1EF]">
                    <tr className="hover:bg-[#F9FAF8] transition">
                      <td className="py-2.5 px-4 text-xs font-medium text-[#17201D]">28 Sep</td>
                      <td className="py-2.5 px-4 text-xs text-[#17201D]">Priya Kumari</td>
                      <td className="py-2.5 px-4 text-xs text-[#17201D]">Whole school, read-only</td>
                      <td className="py-2.5 px-4 text-xs text-[#4F5B57]">Meera Kumawat</td>
                      <td className="py-2.5 px-4 text-xs text-[#4F5B57]">
                        Revoked by school after 40 min · 6 actions
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F9FAF8] transition">
                      <td className="py-2.5 px-4 text-xs font-medium text-[#17201D]">12 Aug</td>
                      <td className="py-2.5 px-4 text-xs text-[#17201D]">Aman Shekhawat</td>
                      <td className="py-2.5 px-4 text-xs text-[#17201D]">Import (write)</td>
                      <td className="py-2.5 px-4 text-xs text-[#4F5B57]">Meera Kumawat</td>
                      <td className="py-2.5 px-4 text-xs text-[#4F5B57]">
                        Ended on time · 214 actions (student import)
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F9FAF8] transition">
                      <td className="py-2.5 px-4 text-xs font-medium text-[#17201D]">20 Jul</td>
                      <td className="py-2.5 px-4 text-xs text-[#17201D]">Priya Kumari</td>
                      <td className="py-2.5 px-4 text-xs text-[#17201D]">Exams, read-only</td>
                      <td className="py-2.5 px-4 text-xs text-[#4F5B57]">Dr. Kavita Rao</td>
                      <td className="py-2.5 px-4 text-xs text-[#4F5B57]">Ended on time · 9 actions</td>
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
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#17201D]">Help and support</h1>
                <p className="text-sm text-[#4F5B57] mt-0.5">
                  Guides, your tickets to the software team, and support access requests.
                </p>
              </div>

              {/* Waiting banner matching Screen 46 */}
              <button
                onClick={() => setCurrentView("support_access")}
                className="h-11 px-4 rounded-lg bg-[#FFF6EC] border border-[#EBC99C] text-[#7A4106] text-sm font-semibold transition hover:bg-[#FFEED9] flex items-center gap-2 shadow-xs"
              >
                1 support access request waiting
              </button>
            </div>

            {/* 2 Column Layout matching Screen 46 */}
            <div className="flex flex-wrap gap-5 items-start">
              {/* Left Column: Search, Guides, Tickets */}
              <div className="flex-[999] basis-[520px] min-w-0 space-y-4">
                {/* Search Bar */}
                <div className="flex items-center gap-3 h-[52px] px-4 border border-[#C9D1CD] rounded-xl bg-white shadow-xs">
                  <MdSearch className="text-[#4F5B57]" size={20} />
                  <input
                    type="search"
                    placeholder="Search guides — for example: cancel a receipt, add a section"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-sm text-[#17201D] outline-none"
                  />
                </div>

                {/* 6 Guide Cards Grid matching Screen 46 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredGuides.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGuide(g)}
                      className="text-left bg-white border border-[#DDE2DE] hover:border-[#0E5A63] rounded-xl p-3.5 transition flex flex-col gap-1 shadow-xs group"
                    >
                      <span className="text-sm font-semibold text-[#17201D] group-hover:text-[#0E5A63]">
                        {g.title}
                      </span>
                      <span className="text-xs text-[#4F5B57]">{g.stepsCount}</span>
                    </button>
                  ))}
                </div>

                {/* My Tickets Section matching Screen 46 */}
                <section className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-[#EEF1EF]">
                    <h2 className="text-base font-semibold text-[#17201D]">My tickets</h2>
                  </div>
                  <div className="divide-y divide-[#EEF1EF]">
                    {tickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 flex justify-between items-center gap-3 flex-wrap hover:bg-[#F9FAF8] transition"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-[#17201D]">{t.subject}</span>
                          <span className="text-xs text-[#4F5B57]">{t.meta}</span>
                        </div>
                        <span
                          style={{ backgroundColor: t.statusBg, color: t.statusColor }}
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        >
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Raise a Ticket Form matching Screen 46 */}
              <aside className="flex-1 basis-[320px] bg-white border border-[#DDE2DE] rounded-xl p-5 flex flex-col gap-3 shadow-xs">
                <h2 className="text-base font-semibold text-[#17201D]">Raise a ticket</h2>

                <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#17201D] font-medium mb-1">What is it about?</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full h-11 px-3 border border-[#C9D1CD] rounded-lg bg-white text-xs text-[#17201D]"
                    >
                      <option value="Fees">Fees</option>
                      <option value="Attendance">Attendance</option>
                      <option value="Exams and report cards">Exams and report cards</option>
                      <option value="Login and users">Login and users</option>
                      <option value="Something else">Something else</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#17201D] font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="One line summary"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      className="w-full h-11 px-3 border border-[#C9D1CD] rounded-lg bg-white text-xs text-[#17201D]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#17201D] font-medium mb-1">Details</label>
                    <textarea
                      rows={4}
                      placeholder="What happened, which screen, and what you expected"
                      value={ticketForm.details}
                      onChange={(e) => setTicketForm({ ...ticketForm, details: e.target.value })}
                      className="w-full p-2.5 border border-[#C9D1CD] rounded-lg bg-white text-xs text-[#17201D]"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast("Opening screenshot file picker...", "info")}
                    className="w-full h-10 px-3 border border-[#C9D1CD] rounded-lg bg-white hover:bg-[#F9FAF8] text-xs font-medium text-[#17201D] transition flex items-center justify-center gap-1.5"
                  >
                    <MdAttachFile size={16} /> Attach screenshot
                  </button>

                  <div>
                    <label className="block text-[#17201D] font-medium mb-1">How urgent?</label>
                    <select
                      value={ticketForm.urgency}
                      onChange={(e) => setTicketForm({ ...ticketForm, urgency: e.target.value })}
                      className="w-full h-11 px-3 border border-[#C9D1CD] rounded-lg bg-white text-xs text-[#17201D]"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High — work is stopped</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white text-sm font-semibold transition shadow-xs"
                  >
                    Send ticket
                  </button>

                  <div className="pt-1 text-center">
                    <a
                      href="https://wa.me/919829012345"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#4F5B57] hover:text-[#0E5A63] inline-flex items-center gap-1"
                    >
                      <MdOutlineChat size={14} /> Or chat on WhatsApp: +91 98290 12345
                    </a>
                  </div>
                </form>
              </aside>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: GUIDE DETAIL WALKTHROUGH
         ========================================================================= */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DDE2DE] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-[#EEF1EF] pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#0E5A63] uppercase tracking-wide">
                  {selectedGuide.category} Guide
                </span>
                <h3 className="font-semibold text-lg text-[#17201D]">{selectedGuide.title}</h3>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="text-[#4F5B57] hover:text-[#17201D]"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#17201D] leading-relaxed">
              {selectedGuide.content.map((step, idx) => (
                <div key={idx} className="p-2.5 bg-[#F9FAF8] border border-[#EEF1EF] rounded-lg">
                  {step}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedGuide(null)}
                className="h-10 px-5 rounded-lg bg-[#0E5A63] text-white text-xs font-semibold"
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
