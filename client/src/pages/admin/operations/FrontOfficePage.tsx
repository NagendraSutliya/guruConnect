import React, { useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiCamera,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiPrinter,
  FiSearch,
  FiPlus,
  FiMessageSquare,
  FiShield
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  meetingWith: string;
  checkInTime: string;
  duration: string;
}

interface ComplaintTicket {
  ticketNo: string;
  subject: string;
  category: string;
  raisedBy: string;
  assignedTo: string;
  responseDue: string;
  status: "Open" | "In progress" | "Escalated" | "Resolved";
  isOverdue?: boolean;
}

const DEFAULT_VISITORS: Visitor[] = [
  { id: "1", name: "Rohit Gupta", phone: "98290 14210", purpose: "Parent of Aarav (5-A)", meetingWith: "Class Teacher (Sunita Rathore)", checkInTime: "10:05 AM", duration: "25 min" },
  { id: "2", name: "Anil Traders", phone: "94140 88219", purpose: "Vendor Delivery · Stationery", meetingWith: "Store Keeper", checkInTime: "09:40 AM", duration: "50 min" },
  { id: "3", name: "Priya Nair", phone: "98870 33412", purpose: "Admission Enquiry · Class 1", meetingWith: "Admission Counsellor", checkInTime: "10:12 AM", duration: "18 min" },
  { id: "4", name: "Rajesh (Electrician)", phone: "99280 11942", purpose: "Contractor Maintenance", meetingWith: "Facilities Head", checkInTime: "09:15 AM", duration: "1h 15m" }
];

const DEFAULT_COMPLAINTS: ComplaintTicket[] = [
  {
    ticketNo: "CMP/2627/0088",
    subject: "Bus 3 reached stop 20 minutes late, three days in a row",
    category: "Transport",
    raisedBy: "Parent of Ishita Rao (5-A)",
    assignedTo: "Transport Manager",
    responseDue: "Overdue by 6 h",
    status: "Escalated",
    isOverdue: true
  },
  {
    ticketNo: "CMP/2627/0091",
    subject: "Homework diary not synced on mobile app since Monday",
    category: "App / Communication",
    raisedBy: "Parent of Kabir Saxena (6-B)",
    assignedTo: "IT Support Admin",
    responseDue: "Today 3:00 pm",
    status: "In progress"
  },
  {
    ticketNo: "CMP/2627/0092",
    subject: "Water cooler on ground floor near junior block not cooling",
    category: "Facilities",
    raisedBy: "Class Teacher 4-B",
    assignedTo: "Store Keeper",
    responseDue: "Overdue by 1 day",
    status: "Escalated",
    isOverdue: true
  },
  {
    ticketNo: "CMP/2627/0095",
    subject: "Receipt shows wrong installment name for cash payment",
    category: "Fees",
    raisedBy: "Parent of Om Prakash (5-A)",
    assignedTo: "Accountant (Rekha Jain)",
    responseDue: "Tomorrow 12:00 pm",
    status: "In progress"
  }
];

export default function FrontOfficePage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"visitors" | "complaints">("visitors");
  const [visitorMode, setVisitorMode] = useState<"visitor" | "earlyPickup">("visitor");
  const [visitors, setVisitors] = useState<Visitor[]>(DEFAULT_VISITORS);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(DEFAULT_COMPLAINTS);

  // New Visitor Form State
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [purpose, setPurpose] = useState("Meet teacher");
  const [toMeet, setToMeet] = useState("Class Teacher");

  // New Complaint Form State
  const [isLogComplaintOpen, setIsLogComplaintOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    subject: "",
    category: "Academics",
    raisedBy: "",
    assignedTo: "Principal Office"
  });

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone) {
      showToast("Please provide visitor name and mobile number.", "error");
      return;
    }
    const created: Visitor = {
      id: String(Date.now()),
      name: visitorName,
      phone: visitorPhone,
      purpose: purpose,
      meetingWith: toMeet,
      checkInTime: "Just now",
      duration: "0 min"
    };
    setVisitors([created, ...visitors]);
    setVisitorName("");
    setVisitorPhone("");
    showToast(`Gate pass printed for ${created.name}. Visitor checked in.`, "success");
  };

  const handleCheckOut = (id: string) => {
    const v = visitors.find(item => item.id === id);
    setVisitors(prev => prev.filter(item => item.id !== id));
    showToast(`Checked out ${v?.name}. Gate pass marked exit.`, "info");
  };

  const handleLogComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.subject || !newComplaint.raisedBy) {
      showToast("Please fill in subject and applicant details.", "error");
      return;
    }
    const ticket: ComplaintTicket = {
      ticketNo: `CMP/2627/00${Math.floor(96 + Math.random() * 80)}`,
      subject: newComplaint.subject,
      category: newComplaint.category,
      raisedBy: newComplaint.raisedBy,
      assignedTo: newComplaint.assignedTo,
      responseDue: "In 72 hours",
      status: "Open"
    };
    setComplaints([ticket, ...complaints]);
    setIsLogComplaintOpen(false);
    setNewComplaint({ subject: "", category: "Academics", raisedBy: "", assignedTo: "Principal Office" });
    showToast(`Complaint Ticket ${ticket.ticketNo} logged with 72-hour SLA tracking!`, "success");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Operations › Front Office & Security
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Campus Gate Pass & Grievance Desk</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Real-time campus occupant control, biometric early student pickup, and 72-hour SLA complaint management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "complaints" && (
            <button
              onClick={() => setIsLogComplaintOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
            >
              <FiPlus size={15} /> Log New Complaint
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-line gap-2">
        <button
          onClick={() => setActiveTab("visitors")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "visitors"
              ? "border-teal text-teal"
              : "border-transparent text-navy-muted hover:text-navy"
          }`}
        >
          Gate Visitors & Early Pickup ({visitors.length} Inside)
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "complaints"
              ? "border-teal text-teal"
              : "border-transparent text-navy-muted hover:text-navy"
          }`}
        >
          Parent Complaints & Grievances ({complaints.length})
        </button>
      </div>

      {activeTab === "visitors" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Gate Pass Check-in Form matching Screen 35 */}
          <div className="lg:col-span-5 bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
            <div className="inline-flex w-full bg-page p-1 border border-line rounded-control text-xs">
              <button
                onClick={() => setVisitorMode("visitor")}
                className={`flex-1 py-1.5 rounded font-bold transition ${
                  visitorMode === "visitor" ? "bg-teal text-white shadow-xs" : "text-navy-muted hover:text-navy"
                }`}
              >
                Visitor Entry
              </button>
              <button
                onClick={() => setVisitorMode("earlyPickup")}
                className={`flex-1 py-1.5 rounded font-bold transition ${
                  visitorMode === "earlyPickup" ? "bg-teal text-white shadow-xs" : "text-navy-muted hover:text-navy"
                }`}
              >
                Early Student Pickup
              </button>
            </div>

            <form onSubmit={handleCheckIn} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-navy mb-1">Mobile Number *</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="98290 xxxxx"
                    value={visitorPhone}
                    onChange={e => setVisitorPhone(e.target.value)}
                    className="flex-1 px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => showToast("Verification OTP sent to visitor phone.", "info")}
                    className="px-3 py-2 border border-line rounded-control bg-page hover:bg-surface font-semibold text-navy text-xs"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  {visitorMode === "visitor" ? "Visitor Full Name *" : "Guardian Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kumawat"
                  value={visitorName}
                  onChange={e => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy mb-1">Purpose of Visit</label>
                  <select
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                  >
                    <option>Meet teacher</option>
                    <option>Vendor delivery</option>
                    <option>Admission enquiry</option>
                    <option>Fee payment desk</option>
                    <option>Principal appointment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-navy mb-1">Person to Meet</label>
                  <input
                    type="text"
                    value={toMeet}
                    onChange={e => setToMeet(e.target.value)}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-page rounded-control border border-line/70">
                <div className="w-14 h-14 rounded-control border border-dashed border-navy-muted flex flex-col items-center justify-center text-[9px] text-navy-muted font-bold">
                  <FiCamera size={14} /> Photo
                </div>
                <div>
                  <div className="font-semibold text-navy text-xs">Security Gate Webcam</div>
                  <div className="text-navy-muted text-[11px]">Capture badge picture for printout</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-teal hover:bg-teal-hover text-white rounded-control font-bold text-xs shadow-xs transition"
                >
                  Check In & Print Gate Pass
                </button>
              </div>
            </form>
          </div>

          {/* Right: Inside Campus Now Roster from Screen 35 */}
          <div className="lg:col-span-7 bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
            <div className="p-4 border-b border-line flex items-center justify-between gap-3 bg-page/30">
              <div>
                <h2 className="font-bold text-sm text-navy">
                  Inside Campus Now · {visitors.length}
                </h2>
                <p className="text-[11px] text-navy-muted">Real-time visitor logs on school premises</p>
              </div>
              <span className="font-mono text-xs font-semibold text-teal">
                31 Total Visitors Today
              </span>
            </div>

            <div className="divide-y divide-line text-xs">
              {visitors.map(v => (
                <div key={v.id} className="p-4 flex items-center justify-between gap-4 hover:bg-page/40 transition">
                  <div>
                    <div className="font-bold text-navy text-sm">{v.name}</div>
                    <div className="text-navy-muted text-[11px]">{v.purpose} · Meeting {v.meetingWith}</div>
                    <div className="font-mono text-navy-muted text-[10px] mt-0.5">{v.phone}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-navy-muted text-[11px] whitespace-nowrap">
                      In {v.checkInTime} ({v.duration})
                    </span>
                    <button
                      onClick={() => handleCheckOut(v.id)}
                      className="px-3 py-1.5 border border-line rounded-control bg-surface hover:bg-page font-semibold text-navy text-xs transition"
                    >
                      Check Out
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Complaints Tab matching Screen 36 */
        <div className="space-y-4">
          <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
            <div className="p-4 border-b border-line flex flex-wrap items-center justify-between gap-3 bg-page/30">
              <div>
                <h2 className="font-bold text-sm text-navy">Parent & Student Complaints</h2>
                <p className="text-[11px] text-navy-muted">
                  Every ticket receives a mandatory 72-hour resolution target. Overdue tickets automatically escalate to the Principal.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                    <th className="py-3 px-4 w-32">Ticket No.</th>
                    <th className="py-3 px-4">Subject & Category</th>
                    <th className="py-3 px-4">Raised By</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4">Response Due</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {complaints.map(t => (
                    <tr key={t.ticketNo} className="hover:bg-page/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-navy">{t.ticketNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-navy">{t.subject}</div>
                        <div className="text-navy-muted text-[11px]">{t.category}</div>
                      </td>
                      <td className="py-3 px-4 text-navy-muted font-medium">{t.raisedBy}</td>
                      <td className="py-3 px-4 font-medium text-navy">{t.assignedTo}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            t.isOverdue ? "text-red-700" : "text-navy-muted"
                          }`}
                        >
                          {t.responseDue}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            t.status === "Escalated"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : t.status === "In progress"
                              ? "bg-teal/10 text-teal border border-teal/20"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Log Complaint Modal */}
      {isLogComplaintOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-panel w-full max-w-md shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-bold text-base text-navy">Log Grievance Ticket</h3>
              <button
                onClick={() => setIsLogComplaintOpen(false)}
                className="text-navy-muted hover:text-navy text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogComplaint} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-navy mb-1">Subject / Issue Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken water cooler on 1st floor"
                  value={newComplaint.subject}
                  onChange={e => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy mb-1">Category</label>
                  <select
                    value={newComplaint.category}
                    onChange={e => setNewComplaint({ ...newComplaint, category: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Transport">Transport</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Fees">Fees & Billing</option>
                    <option value="App / Communication">App / Communication</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-navy mb-1">Assigned Department</label>
                  <select
                    value={newComplaint.assignedTo}
                    onChange={e => setNewComplaint({ ...newComplaint, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none"
                  >
                    <option value="Principal Office">Principal Office</option>
                    <option value="Transport Manager">Transport Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="IT Support Admin">IT Support Admin</option>
                    <option value="Store Keeper">Store Keeper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">Raised By (Parent or Staff Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parent of Ishita Rao (5-A)"
                  value={newComplaint.raisedBy}
                  onChange={e => setNewComplaint({ ...newComplaint, raisedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsLogComplaintOpen(false)}
                  className="px-4 py-2 border border-line rounded-control text-navy hover:bg-page font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal hover:bg-teal-hover text-white rounded-control font-semibold shadow-xs transition"
                >
                  Log Ticket (72h SLA)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
