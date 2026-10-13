import React, { useState } from "react";
import {
  FiHelpCircle,
  FiSearch,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiSend,
  FiLock,
  FiShield,
  FiPaperclip
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface SupportTicket {
  ticketId: string;
  subject: string;
  meta: string;
  status: "Open" | "Waiting on you" | "Resolved";
}

const DEFAULT_TICKETS: SupportTicket[] = [
  { ticketId: "TKT-0915", subject: "Parent app OTP not received on certain Jio numbers", meta: "High Urgency · Raised 10 Oct · Support replied today", status: "Open" },
  { ticketId: "TKT-0897", subject: "Receipt shows wrong installment term name", meta: "Normal · Support requested screenshot of payment slip", status: "Waiting on you" },
  { ticketId: "TKT-0861", subject: "How to configure a third section (C) in Class 6?", meta: "Solved via Setup Guide walkthrough", status: "Resolved" }
];

const GUIDES = [
  { title: "Getting started institutional checklist", steps: "6 foundational steps", category: "Setup" },
  { title: "Collect a fee and print a branded receipt", steps: "Fee Counter", category: "Fees" },
  { title: "Cancel or correct a mistakenly posted receipt", steps: "Reversals & Audit", category: "Fees" },
  { title: "Mark and reconcile biometric staff attendance", steps: "Biometric Sync", category: "Attendance" },
  { title: "Generate and publish CBSE report cards", steps: "Marks & Grading", category: "Exams" },
  { title: "Add a new academic section or subject", steps: "Curriculum Masters", category: "Settings" }
];

export default function HelpSupportPage() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>(DEFAULT_TICKETS);
  const [searchGuide, setSearchGuide] = useState("");
  const [supportAccessActive, setSupportAccessActive] = useState(false);

  // Ticket Form
  const [category, setCategory] = useState("Fees");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [urgency, setUrgency] = useState("Normal");

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !details) {
      showToast("Please provide subject and ticket explanation.", "error");
      return;
    }
    const newTkt: SupportTicket = {
      ticketId: `TKT-0${Math.floor(920 + Math.random() * 80)}`,
      subject: subject,
      meta: `${urgency} Urgency · Raised just now`,
      status: "Open"
    };
    setTickets([newTkt, ...tickets]);
    setSubject("");
    setDetails("");
    showToast(`Support ticket ${newTkt.ticketId} assigned to Engineering Team!`, "success");
  };

  const toggleSupportAccess = () => {
    const next = !supportAccessActive;
    setSupportAccessActive(next);
    if (next) {
      showToast("Temporary 2-hour technical support impersonation access granted.", "success");
    } else {
      showToast("Technical support access revoked immediately.", "info");
    }
  };

  const filteredGuides = GUIDES.filter(g =>
    g.title.toLowerCase().includes(searchGuide.toLowerCase()) ||
    g.category.toLowerCase().includes(searchGuide.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Help & Technical Support</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Interactive knowledge base, engineering helpdesk tickets, and remote support access control.
          </p>
        </div>

        {/* Screen 47: Support Access Grant Banner */}
        <button
          onClick={toggleSupportAccess}
          className={`flex items-center gap-2 px-4 py-2 rounded-control text-xs font-bold transition border ${
            supportAccessActive
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
          }`}
        >
          <FiShield size={14} />
          {supportAccessActive ? "Support Access Active (Expires in 1h 45m)" : "Grant 2h Support Access"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Guides & Tickets */}
        <div className="lg:col-span-7 space-y-5">
          {/* Guide Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-muted" size={16} />
            <input
              type="text"
              placeholder="Search guides — for example: cancel a receipt, add a section..."
              value={searchGuide}
              onChange={e => setSearchGuide(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-line rounded-panel text-xs text-navy shadow-xs focus:outline-none focus:border-teal"
            />
          </div>

          {/* Quick Guides Grid from Screen 46 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {filteredGuides.map(guide => (
              <div
                key={guide.title}
                onClick={() => showToast(`Opening '${guide.title}' guide...`, "info")}
                className="bg-surface border border-line rounded-control p-3.5 shadow-xs hover:border-teal cursor-pointer transition space-y-1"
              >
                <div className="font-bold text-navy text-sm leading-snug">{guide.title}</div>
                <div className="text-navy-muted text-[11px]">
                  {guide.steps} · <span className="text-teal font-medium">{guide.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* My Tickets List from Screen 46 */}
          <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b border-line bg-page/30 flex items-center justify-between">
              <h2 className="font-bold text-sm text-navy">My Support Tickets</h2>
              <span className="text-navy-muted text-[11px]">Engineering SLA Target: Under 4 Hours</span>
            </div>

            <div className="divide-y divide-line">
              {tickets.map(tkt => (
                <div key={tkt.ticketId} className="p-4 flex items-center justify-between gap-4 hover:bg-page/40 transition">
                  <div className="space-y-1">
                    <div className="font-bold text-navy text-sm">{tkt.subject}</div>
                    <div className="text-navy-muted text-[11px]">
                      <span className="font-mono font-bold text-navy">{tkt.ticketId}</span> · {tkt.meta}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] whitespace-nowrap ${
                      tkt.status === "Open"
                        ? "bg-teal/10 text-teal border border-teal/20"
                        : tkt.status === "Waiting on you"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {tkt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Raise a Ticket Form from Screen 46 */}
        <div className="lg:col-span-5 bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4 text-xs">
          <h2 className="font-bold text-sm text-navy border-b border-line pb-3">
            Raise an Engineering Ticket
          </h2>

          <form onSubmit={handleCreateTicket} className="space-y-3.5">
            <div>
              <label className="block font-medium text-navy mb-1">What is the query about?</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
              >
                <option value="Fees">Fees & Payment Gateway</option>
                <option value="Attendance">Biometric Attendance</option>
                <option value="Exams">Exams & Report Cards</option>
                <option value="Parent App">Parent App & Logins</option>
                <option value="Something Else">General Technical Issue</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">One-line Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cannot generate Class 8 report cards"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">Detailed Explanation *</label>
              <textarea
                rows={4}
                required
                placeholder="Describe what occurred, which screen, student IDs, and error message if any..."
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="w-full p-2.5 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-navy mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value)}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High — Operations Blocked</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-navy mb-1">Attach Screenshot</label>
                <button
                  type="button"
                  onClick={() => showToast("Screenshot attachment dialog opened.", "info")}
                  className="w-full py-2 border border-line rounded-control bg-page hover:bg-surface font-semibold text-navy text-xs flex items-center justify-center gap-1.5"
                >
                  <FiPaperclip size={13} /> Upload File
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-teal hover:bg-teal-hover text-white rounded-control font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
              >
                <FiSend size={14} /> Submit Ticket to Support Desk
              </button>
            </div>
            <div className="text-center text-[11px] text-navy-muted">
              Or direct WhatsApp hotline: <b className="text-navy font-mono">+91 98290 00000</b>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
