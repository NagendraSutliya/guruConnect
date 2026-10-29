import React, { useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCamera,
  FiClock,
  FiPrinter,
  FiSearch,
  FiPlus,
  FiMessageSquare,
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiX
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface InsideVisitor {
  id: string;
  name: string;
  phone: string;
  relationOrType: string;
  purpose: string;
  inTime: string;
  duration: string;
  gatePassNo: string;
}

interface ComplaintRow {
  id: string;
  ticketNo: string;
  subject: string;
  category: "Transport" | "App / communication" | "Facilities" | "Academics" | "Fees" | "Library";
  raisedBy: string;
  assignedTo: string;
  responseDue: string;
  isOverdue?: boolean;
  status: "Open" | "In progress" | "Escalated" | "Resolved";
  resolutionNote?: string;
}

const INITIAL_VISITORS: InsideVisitor[] = [
  {
    id: "v-1",
    name: "Rohit Gupta",
    phone: "98290 14210",
    relationOrType: "Parent of Aarav (5-A)",
    purpose: "Meet class teacher",
    inTime: "10:05",
    duration: "25 min",
    gatePassNo: "GP-2627/0841"
  },
  {
    id: "v-2",
    name: "Anil Traders",
    phone: "94140 88219",
    relationOrType: "Vendor",
    purpose: "Stationery delivery · store",
    inTime: "09:40",
    duration: "50 min",
    gatePassNo: "GP-2627/0840"
  },
  {
    id: "v-3",
    name: "Priya Nair",
    phone: "98870 33412",
    relationOrType: "Admission enquiry",
    purpose: "Class 1 · counsellor",
    inTime: "10:12",
    duration: "18 min",
    gatePassNo: "GP-2627/0842"
  },
  {
    id: "v-4",
    name: "Rajesh (electrician)",
    phone: "99280 11942",
    relationOrType: "Contractor",
    purpose: "Utility block electricals",
    inTime: "08:15",
    duration: "2 h 15 min",
    gatePassNo: "GP-2627/0838"
  },
  {
    id: "v-5",
    name: "Seema Kanwar",
    phone: "97840 22104",
    relationOrType: "Parent",
    purpose: "Fee counter receipt clarification",
    inTime: "10:20",
    duration: "10 min",
    gatePassNo: "GP-2627/0843"
  },
  {
    id: "v-6",
    name: "Dinesh Verma",
    phone: "96490 11928",
    relationOrType: "Courier service",
    purpose: "Principal office delivery",
    inTime: "10:25",
    duration: "5 min",
    gatePassNo: "GP-2627/0844"
  }
];

const INITIAL_COMPLAINTS: ComplaintRow[] = [
  {
    id: "c-1",
    ticketNo: "CMP/2627/0088",
    subject: "Bus 3 reached stop 20 minutes late, three days in a row",
    category: "Transport",
    raisedBy: "Parent of Ishita Rao (5-A)",
    assignedTo: "Transport manager",
    responseDue: "Overdue by 6 h",
    isOverdue: true,
    status: "Escalated"
  },
  {
    id: "c-2",
    ticketNo: "CMP/2627/0091",
    subject: "Homework diary not received on app since Monday",
    category: "App / communication",
    raisedBy: "Parent of Kabir Saxena (6-B)",
    assignedTo: "IT admin",
    responseDue: "Today 3:00 pm",
    status: "In progress"
  },
  {
    id: "c-3",
    ticketNo: "CMP/2627/0092",
    subject: "Water cooler on ground floor not cooling",
    category: "Facilities",
    raisedBy: "Class teacher 4-B",
    assignedTo: "Store keeper",
    responseDue: "Overdue by 1 day",
    isOverdue: true,
    status: "Escalated"
  },
  {
    id: "c-4",
    ticketNo: "CMP/2627/0094",
    subject: "Request to change section for sibling together",
    category: "Academics",
    raisedBy: "Parent of Navya Jangid",
    assignedTo: "Vice principal",
    responseDue: "Sat 10 Oct",
    status: "Open"
  },
  {
    id: "c-5",
    ticketNo: "CMP/2627/0095",
    subject: "Receipt shows wrong installment name",
    category: "Fees",
    raisedBy: "Parent of Om Prakash (5-A)",
    assignedTo: "Accountant",
    responseDue: "Sat 10 Oct",
    status: "In progress"
  },
  {
    id: "c-6",
    ticketNo: "CMP/2627/0083",
    subject: "Library fine charged after book was returned",
    category: "Library",
    raisedBy: "Parent of Diya Choudhary (7-B)",
    assignedTo: "Librarian",
    responseDue: "Closed 7 Oct",
    status: "Resolved"
  }
];

export default function FrontOfficePage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"visitors" | "complaints">("visitors");
  const [visitorMode, setVisitorMode] = useState<"visitor" | "earlyPickup">("visitor");
  const [visitors, setVisitors] = useState<InsideVisitor[]>(INITIAL_VISITORS);
  const [complaints, setComplaints] = useState<ComplaintRow[]>(INITIAL_COMPLAINTS);
  const [complaintFilter, setComplaintFilter] = useState("Open · 7");

  // New Check-in Form State (Screen 35)
  const [checkinForm, setCheckinForm] = useState({
    mobile: "98290 41209",
    name: "Suresh Kumawat",
    purpose: "Vendor delivery",
    toMeet: "Store keeper"
  });

  const [printedPass, setPrintedPass] = useState<InsideVisitor | null>(null);

  // New Complaint Form State (Screen 36)
  const [isLogComplaintOpen, setIsLogComplaintOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    subject: "",
    category: "Transport" as ComplaintRow["category"],
    raisedBy: "",
    assignedTo: "Transport manager"
  });

  // Action / Resolution modal
  const [selectedTicket, setSelectedTicket] = useState<ComplaintRow | null>(null);

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkinForm.name.trim() || !checkinForm.mobile.trim()) return;

    const created: InsideVisitor = {
      id: `v-${Date.now()}`,
      name: checkinForm.name,
      phone: checkinForm.mobile,
      relationOrType: checkinForm.purpose === "Meet teacher" ? "Parent" : "Visitor",
      purpose: `${checkinForm.purpose} · ${checkinForm.toMeet}`,
      inTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      duration: "Just now",
      gatePassNo: `GP-2627/0${visitors.length + 845}`
    };

    setVisitors(prev => [created, ...prev]);
    setPrintedPass(created);
    showToast(`Visitor ${created.name} checked in! Gate Pass #${created.gatePassNo} generated.`, "success");
  };

  const handleCheckout = (visitor: InsideVisitor) => {
    setVisitors(prev => prev.filter(v => v.id !== visitor.id));
    showToast(`Visitor ${visitor.name} successfully checked out at main gate.`, "success");
  };

  const handleLogComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.subject.trim() || !newComplaint.raisedBy.trim()) return;

    const ticket: ComplaintRow = {
      id: `cmp-${Date.now()}`,
      ticketNo: `CMP/2627/00${complaints.length + 96}`,
      subject: newComplaint.subject,
      category: newComplaint.category,
      raisedBy: newComplaint.raisedBy,
      assignedTo: newComplaint.assignedTo,
      responseDue: "72 h from now",
      status: "Open"
    };

    setComplaints(prev => [ticket, ...prev]);
    setIsLogComplaintOpen(false);
    setNewComplaint({
      subject: "",
      category: "Transport",
      raisedBy: "",
      assignedTo: "Transport manager"
    });
    showToast(`Ticket #${ticket.ticketNo} registered with 72-hour SLA response target!`, "success");
  };

  const handleResolveTicket = (ticketId: string) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === ticketId ? { ...c, status: "Resolved", responseDue: "Resolved today" } : c
      )
    );
    setSelectedTicket(null);
    showToast("Complaint marked as resolved and parent updated on app!", "success");
  };

  const filteredComplaints = complaints.filter(c => {
    if (complaintFilter.startsWith("Open")) return c.status !== "Resolved";
    if (complaintFilter.startsWith("Overdue")) return c.isOverdue;
    if (complaintFilter.startsWith("Resolved")) return c.status === "Resolved";
    return true;
  });

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 35-Visitors.html & 36-Complaints.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary flex items-center gap-1.5">
            <span>Front Office ›</span>
            <button
              type="button"
              onClick={() => setActiveTab("visitors")}
              className={`hover:underline cursor-pointer ${
                activeTab === "visitors" ? "font-semibold text-ink" : "text-primary"
              }`}
            >
              Visitors · Early pickup
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab("complaints")}
              className={`hover:underline cursor-pointer ${
                activeTab === "complaints" ? "font-semibold text-ink" : "text-primary"
              }`}
            >
              Complaints
            </button>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            {activeTab === "visitors" ? "Gate and visitors · today" : "Parent complaints"}
          </h1>
          {activeTab === "complaints" && (
            <div className="text-[13px] text-ink-secondary">
              Every complaint gets a ticket number and a 72-hour response target. Overdue tickets go to the principal.
            </div>
          )}
        </div>

        {activeTab === "complaints" && (
          <button
            type="button"
            onClick={() => setIsLogComplaintOpen(true)}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            <FiPlus size={15} />
            <span>Log complaint</span>
          </button>
        )}
      </div>

      {/* SECTION 1: VISITORS & GATE PASS DESK (Screen 35) */}
      {activeTab === "visitors" && (
        <div className="flex flex-wrap gap-5 items-start">
          {/* Left Form: Check-in Desk */}
          <section className="flex-1 basis-[340px] bg-white border border-line rounded-card p-5 flex flex-col gap-3.5 shadow-xs">
            {/* Entry Mode Switcher */}
            <div className="grid grid-cols-2 bg-surface-segmented rounded-control p-1">
              <button
                type="button"
                onClick={() => setVisitorMode("visitor")}
                className={`min-h-[38px] rounded-control font-semibold text-xs transition-all cursor-pointer ${
                  visitorMode === "visitor" ? "bg-white text-ink shadow-xs" : "text-ink-secondary"
                }`}
              >
                Visitor entry
              </button>
              <button
                type="button"
                onClick={() => setVisitorMode("earlyPickup")}
                className={`min-h-[38px] rounded-control font-medium text-xs transition-all cursor-pointer ${
                  visitorMode === "earlyPickup" ? "bg-white text-ink shadow-xs font-semibold" : "text-ink-secondary"
                }`}
              >
                Early pickup
              </button>
            </div>

            <form onSubmit={handleCheckinSubmit} className="flex flex-col gap-3.5">
              <label className="flex flex-col gap-1 text-xs font-medium text-ink">
                Mobile number
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    value={checkinForm.mobile}
                    onChange={e => setCheckinForm(prev => ({ ...prev, mobile: e.target.value }))}
                    className="flex-1 min-h-[42px] px-3 border border-line-input rounded-control font-mono text-sm text-ink focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => showToast(`OTP 4819 sent to ${checkinForm.mobile}`, "info")}
                    className="min-h-[42px] px-3.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-xs font-medium transition cursor-pointer"
                  >
                    Send OTP
                  </button>
                </div>
              </label>

              <label className="flex flex-col gap-1 text-xs font-medium text-ink">
                Name
                <input
                  type="text"
                  required
                  value={checkinForm.name}
                  onChange={e => setCheckinForm(prev => ({ ...prev, name: e.target.value }))}
                  className="min-h-[42px] px-3 border border-line-input rounded-control text-sm text-ink focus:border-primary focus:outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex flex-col gap-1 text-xs font-medium text-ink">
                  Purpose
                  <select
                    value={checkinForm.purpose}
                    onChange={e => setCheckinForm(prev => ({ ...prev, purpose: e.target.value }))}
                    className="min-h-[42px] px-2.5 border border-line-input rounded-control bg-white text-xs text-ink focus:border-primary focus:outline-none"
                  >
                    <option>Vendor delivery</option>
                    <option>Meet teacher</option>
                    <option>Admission enquiry</option>
                    <option>Fee payment</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-xs font-medium text-ink">
                  To meet
                  <select
                    value={checkinForm.toMeet}
                    onChange={e => setCheckinForm(prev => ({ ...prev, toMeet: e.target.value }))}
                    className="min-h-[42px] px-2.5 border border-line-input rounded-control bg-white text-xs text-ink focus:border-primary focus:outline-none"
                  >
                    <option>Store keeper</option>
                    <option>Class teacher</option>
                    <option>Principal</option>
                    <option>Accountant</option>
                  </select>
                </label>
              </div>

              <div className="flex gap-3 items-center pt-1">
                <div className="w-16 h-16 rounded-control border border-dashed border-ink-muted bg-surface-subtle flex items-center justify-center text-[10px] text-ink-secondary text-center">
                  [Photo]
                </div>
                <button
                  type="button"
                  onClick={() => showToast("Webcam photo captured for gate pass badge!", "info")}
                  className="min-h-[38px] px-3 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <FiCamera size={13} />
                  <span>Take photo</span>
                </button>
              </div>

              <button
                type="submit"
                className="min-h-[44px] rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] mt-1"
              >
                Check in and print gate pass
              </button>
            </form>
          </section>

          {/* Right: Inside Campus Register (Matching 35-Visitors.html) */}
          <section className="flex-1 basis-[460px] min-w-0 bg-white border border-line rounded-card overflow-hidden shadow-xs">
            <div className="p-3.5 px-5 border-b border-line-row flex justify-between items-center gap-3 flex-wrap">
              <h2 className="m-0 text-base font-semibold text-ink">
                Inside campus now · {visitors.length}
              </h2>
              <span className="text-xs text-ink-secondary">31 visitors today</span>
            </div>

            <div className="divide-y divide-line-row">
              {visitors.map(visitor => (
                <div
                  key={visitor.id}
                  className="p-3 px-5 flex justify-between items-center gap-3 flex-wrap hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-semibold text-sm text-ink">{visitor.name}</span>
                    <span className="text-xs text-ink-secondary truncate">
                      {visitor.relationOrType} · {visitor.purpose}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs text-ink-secondary">
                      In {visitor.inTime} · {visitor.duration}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCheckout(visitor)}
                      className="min-h-[36px] px-3 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-xs font-medium transition cursor-pointer shadow-xs"
                    >
                      Check out
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* SECTION 2: PARENT COMPLAINTS & GRIEVANCES (Screen 36) */}
      {activeTab === "complaints" && (
        <div className="space-y-4">
          {/* Filter Pills (Matching 36-Complaints.html) */}
          <div className="flex flex-wrap gap-2">
            {[
              "Open · 7",
              "Overdue · 2",
              "Resolved this month · 19",
              "All categories"
            ].map(pill => {
              const isActive = complaintFilter === pill;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setComplaintFilter(pill)}
                  className={`min-h-[36px] px-4 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                    isActive
                      ? "bg-nav-bg text-white border-nav-bg"
                      : "bg-white text-ink border-line-input hover:bg-slate-50"
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          {/* Complaints Table (Matching 36-Complaints.html) */}
          <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse text-sm min-w-[880px]">
                <colgroup>
                  <col className="w-[150px]" />
                  <col className="w-auto" />
                  <col className="w-[190px]" />
                  <col className="w-[160px]" />
                  <col className="w-[150px]" />
                  <col className="w-[130px]" />
                </colgroup>
                <thead>
                  <tr className="bg-surface-head text-left text-xs text-ink font-semibold">
                    <th className="py-3 px-4 font-semibold whitespace-nowrap">Ticket</th>
                    <th className="py-3 px-4 font-semibold">Subject</th>
                    <th className="py-3 px-4 font-semibold">Raised by</th>
                    <th className="py-3 px-4 font-semibold">Assigned to</th>
                    <th className="py-3 px-4 font-semibold whitespace-nowrap">Response due</th>
                    <th className="py-3 px-4 font-semibold whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-ink-secondary">
                        No complaints found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map(item => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedTicket(item)}
                        className="border-t border-line-row hover:bg-slate-50/70 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 px-4 font-mono text-xs text-ink whitespace-nowrap">
                          {item.ticketNo}
                        </td>
                        <td className="py-2.5 px-4 text-xs">
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-ink break-words">{item.subject}</span>
                            <span className="text-[11px] text-ink-secondary">{item.category}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-xs text-ink-secondary truncate" title={item.raisedBy}>
                          {item.raisedBy}
                        </td>
                        <td className="py-2.5 px-4 text-xs text-ink truncate" title={item.assignedTo}>
                          {item.assignedTo}
                        </td>
                        <td
                          className={`py-2.5 px-4 text-xs font-semibold whitespace-nowrap ${
                            item.isOverdue ? "text-warning-inline" : "text-ink-secondary font-normal"
                          }`}
                        >
                          {item.responseDue}
                        </td>
                        <td className="py-2.5 px-4 text-xs whitespace-nowrap">
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap leading-tight ${
                              item.status === "Escalated"
                                ? "bg-warning-bg text-warning-text"
                                : item.status === "In progress"
                                ? "bg-primary-tint text-primary"
                                : item.status === "Resolved"
                                ? "bg-success-bg text-success-text"
                                : "bg-[#F1F2EF] text-ink-secondary"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Printable Gate Pass Modal */}
      {printedPass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-sm shadow-xl p-5 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs text-ink">
            <div className="flex justify-between items-center pb-2 border-b border-line">
              <span className="font-bold text-xs uppercase tracking-wider text-primary">
                Official Visitor Gate Pass
              </span>
              <button
                type="button"
                onClick={() => setPrintedPass(null)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="border border-line rounded p-4 text-center space-y-2 bg-slate-50">
              <div className="font-bold text-sm text-ink">{printedPass.name}</div>
              <div className="font-mono text-xs font-bold text-primary">{printedPass.gatePassNo}</div>
              <div className="text-[11px] text-ink-secondary">
                {printedPass.relationOrType} · {printedPass.purpose}
              </div>
              <div className="text-xs font-mono pt-1 border-t border-line/60">
                In: {printedPass.inTime} · Date: 26 Oct 2026
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setPrintedPass(null);
                }}
                className="px-4 py-2 bg-primary text-white rounded font-semibold text-xs flex items-center gap-1.5"
              >
                <FiPrinter size={13} />
                <span>Print Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Complaint Modal */}
      {isLogComplaintOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Log Parent Complaint</h3>
              <button
                type="button"
                onClick={() => setIsLogComplaintOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogComplaint} className="space-y-3.5">
              <div>
                <label className="block text-ink font-medium mb-1">Subject / Complaint Summary</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe grievance or issue reported by parent..."
                  value={newComplaint.subject}
                  onChange={e => setNewComplaint(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Category</label>
                  <select
                    value={newComplaint.category}
                    onChange={e => setNewComplaint(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  >
                    <option>Transport</option>
                    <option>App / communication</option>
                    <option>Facilities</option>
                    <option>Academics</option>
                    <option>Fees</option>
                    <option>Library</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Assigned Department</label>
                  <select
                    value={newComplaint.assignedTo}
                    onChange={e => setNewComplaint(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  >
                    <option>Transport manager</option>
                    <option>IT admin</option>
                    <option>Vice principal</option>
                    <option>Store keeper</option>
                    <option>Accountant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Raised by (Parent Name & Student)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parent of Ishita Rao (5-A)"
                  value={newComplaint.raisedBy}
                  onChange={e => setNewComplaint(prev => ({ ...prev, raisedBy: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsLogComplaintOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
                >
                  Generate Ticket (72h SLA)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <div>
                <span className="font-mono text-xs font-bold text-primary">{selectedTicket.ticketNo}</span>
                <h3 className="font-semibold text-sm text-ink">{selectedTicket.subject}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-line rounded-control space-y-1.5 text-ink-secondary">
              <div><b>Raised by:</b> {selectedTicket.raisedBy}</div>
              <div><b>Assigned to:</b> {selectedTicket.assignedTo}</div>
              <div><b>SLA Response target:</b> {selectedTicket.responseDue}</div>
              <div><b>Current status:</b> {selectedTicket.status}</div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
              >
                Close
              </button>
              {selectedTicket.status !== "Resolved" && (
                <button
                  type="button"
                  onClick={() => handleResolveTicket(selectedTicket.id)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-control font-semibold shadow-xs"
                >
                  Mark as Resolved & Notify Parent
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
