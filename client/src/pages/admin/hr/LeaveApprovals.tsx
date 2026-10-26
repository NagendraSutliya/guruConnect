import React, { useState } from "react";
import {
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiFileText,
  FiUserCheck,
  FiPlus
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface LeaveRequestItem {
  id: string;
  name: string;
  role: string;
  leaveType: string;
  dates: string;
  days: number;
  reason: string;
  balanceAfter: string;
  substituteNote: string;
  isUrgent?: boolean;
  status: "pending" | "approved" | "rejected";
}

const INITIAL_LEAVE_REQUESTS: LeaveRequestItem[] = [
  {
    id: "1",
    name: "Vikram Singh",
    role: "TGT Maths",
    leaveType: "Casual leave",
    dates: "12–14 Oct",
    days: 3,
    reason: "Family function in hometown",
    balanceAfter: "CL 5 of 12",
    substituteNote: "6 periods need substitutes (Classes 8-A, 8-B, 9-A)",
    status: "pending"
  },
  {
    id: "2",
    name: "Kamla Devi",
    role: "TGT Hindi",
    leaveType: "Sick leave",
    dates: "10 Oct",
    days: 1,
    reason: "Medical certificate attached (High viral fever)",
    balanceAfter: "SL 7 of 10",
    substituteNote: "4 periods tomorrow — urgent",
    isUrgent: true,
    status: "pending"
  },
  {
    id: "3",
    name: "Mohan Lal",
    role: "Driver · Bus 4",
    leaveType: "Casual leave",
    dates: "17 Oct",
    days: 1,
    reason: "Personal work at municipal office",
    balanceAfter: "CL 9 of 12",
    substituteNote: "Bus 4 needs a relief driver",
    isUrgent: true,
    status: "pending"
  },
  {
    id: "4",
    name: "Farah Ali",
    role: "Art teacher",
    leaveType: "Earned leave",
    dates: "2–6 Nov",
    days: 5,
    reason: "Family travel to hometown wedding",
    balanceAfter: "EL 13 of 15",
    substituteNote: "Overlaps Half-Yearly invigilation duty",
    status: "pending"
  }
];

export default function LeaveApprovals() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<LeaveRequestItem[]>(INITIAL_LEAVE_REQUESTS);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "policy">("pending");

  const [activeActionModal, setActiveActionModal] = useState<{
    request: LeaveRequestItem;
    action: "approve" | "reject";
  } | null>(null);

  const [rejectReason, setRejectReason] = useState("");
  const [substituteTeacher, setSubstituteTeacher] = useState("Sunita Rathore (Free Period)");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const pendingRequests = requests.filter(r => r.status === "pending");
  const approvedRequests = requests.filter(r => r.status === "approved");

  const handleConfirmAction = () => {
    if (!activeActionModal) return;
    const { request, action } = activeActionModal;

    setRequests(prev =>
      prev.map(r => (r.id === request.id ? { ...r, status: action === "approve" ? "approved" : "rejected" } : r))
    );

    if (action === "approve") {
      showToast(
        `Leave approved for ${request.name}! Substitution assigned to ${substituteTeacher} and attendance adjusted.`,
        "success"
      );
    } else {
      showToast(`Leave request for ${request.name} rejected.`, "info");
    }

    setActiveActionModal(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 29-Leave.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Staff › Leave requests
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Leave requests waiting for you
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Approved leave updates attendance and payroll, and opens the periods for substitution.
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsApplyModalOpen(true)}
          className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-[#08393F] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
        >
          <FiPlus size={15} />
          <span>Apply staff leave</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-line text-[13.5px] font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`min-h-[42px] px-4 border-b-[3px] transition-colors cursor-pointer ${
            activeTab === "pending"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-ink-secondary hover:text-ink"
          }`}
        >
          Pending requests ({pendingRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("approved")}
          className={`min-h-[42px] px-4 border-b-[3px] transition-colors cursor-pointer ${
            activeTab === "approved"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-ink-secondary hover:text-ink"
          }`}
        >
          Approved history ({approvedRequests.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("policy")}
          className={`min-h-[42px] px-4 border-b-[3px] transition-colors cursor-pointer ${
            activeTab === "policy"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-ink-secondary hover:text-ink"
          }`}
        >
          Leave rules &amp; balances
        </button>
      </div>

      {/* Pending Requests Tab */}
      {activeTab === "pending" && (
        <div className="flex flex-col gap-3 animate-fadeIn">
          {pendingRequests.map(req => {
            return (
              <article
                key={req.id}
                className={`bg-white border rounded-card p-5 flex flex-wrap gap-4 items-center justify-between shadow-xs transition-colors ${
                  req.isUrgent ? "border-[#EBC99C] bg-amber-50/20" : "border-line"
                }`}
              >
                <div className="flex-1 min-w-[300px] flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px] text-ink">{req.name}</span>
                    <span className="text-[13px] text-ink-secondary">· {req.role}</span>
                  </div>

                  <div className="text-[14px] text-ink">
                    {req.leaveType} · {req.dates} ·{" "}
                    <b className="font-semibold">{req.days} {req.days === 1 ? "day" : "days"}</b>
                  </div>

                  <div className="text-[13px] text-ink-secondary">
                    Reason: {req.reason}
                  </div>
                </div>

                <div className="flex-1 min-w-[220px] flex flex-col gap-1 text-[13px]">
                  <div>
                    Balance after:{" "}
                    <b className="font-mono font-medium text-ink">{req.balanceAfter}</b>
                  </div>
                  <div className="text-[#8F4A09] font-medium flex items-center gap-1.5">
                    <FiAlertTriangle size={13} className="shrink-0" />
                    <span>{req.substituteNote}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveActionModal({ request: req, action: "reject" })}
                    className="min-h-[32px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveActionModal({ request: req, action: "approve" })}
                    className="min-h-[32px] px-4 rounded-control bg-primary hover:bg-[#08393F] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    Approve
                  </button>
                </div>
              </article>
            );
          })}

          {pendingRequests.length === 0 && (
            <div className="bg-white border border-line rounded-card p-12 text-center text-ink-secondary space-y-2">
              <FiCheckCircle size={32} className="mx-auto text-emerald-600" />
              <div className="font-semibold text-ink text-base">All clear! No pending leave requests.</div>
              <p className="text-xs">Any new staff leave submissions will appear here automatically.</p>
            </div>
          )}
        </div>
      )}

      {/* Approved Tab */}
      {activeTab === "approved" && (
        <div className="space-y-3 animate-fadeIn">
          {approvedRequests.map(req => (
            <div
              key={req.id}
              className="bg-white border border-line rounded-card p-4 flex items-center justify-between text-xs shadow-xs"
            >
              <div>
                <span className="font-semibold text-ink text-sm">{req.name}</span> · {req.role}
                <div className="text-ink-secondary mt-0.5">
                  {req.leaveType} ({req.dates}) · Approved by Principal
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#1E5A33] font-semibold">
                Approved &amp; Scheduled
              </span>
            </div>
          ))}

          {approvedRequests.length === 0 && (
            <div className="bg-white border border-line rounded-card p-8 text-center text-ink-secondary text-xs">
              No approved requests in this session yet.
            </div>
          )}
        </div>
      )}

      {/* Policy Tab */}
      {activeTab === "policy" && (
        <div className="space-y-4 animate-fadeIn text-xs">
          <div className="bg-white border border-line rounded-card p-6 space-y-4 shadow-xs">
            <h3 className="font-semibold text-sm text-ink">Annual Staff Leave Entitlement Policy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-page rounded-control border border-line space-y-1">
                <span className="font-semibold text-ink text-[13px]">Casual Leave (CL)</span>
                <p className="text-ink-secondary">
                  12 days per academic session. Max 3 days consecutively. Cannot be clubbed with vacation.
                </p>
              </div>
              <div className="p-4 bg-page rounded-control border border-line space-y-1">
                <span className="font-semibold text-ink text-[13px]">Medical / Sick Leave (SL)</span>
                <p className="text-ink-secondary">
                  10 days per academic session with medical practitioner prescription for absences &gt; 2 days.
                </p>
              </div>
              <div className="p-4 bg-page rounded-control border border-line space-y-1">
                <span className="font-semibold text-ink text-[13px]">Earned Leave (EL)</span>
                <p className="text-ink-secondary">
                  Up to 30 days for non-vacation staff; 15 days for teaching staff upon duties performed in breaks.
                </p>
              </div>
            </div>
            <div className="p-3 bg-[#FFF6EC] rounded-control border border-[#EBC99C] text-[#5E3305]">
              <b>Unapproved Absence / LWP Rule:</b> 3 late arrivals in a month count as 0.5 day Leave Without Pay (LWP).
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal (Approve / Reject) */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">
                {activeActionModal.action === "approve"
                  ? `Approve Leave for ${activeActionModal.request.name}`
                  : `Reject Leave Request`}
              </h3>
              <button
                type="button"
                onClick={() => setActiveActionModal(null)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {activeActionModal.action === "approve" ? (
              <div className="space-y-3">
                <div className="p-3 bg-page border border-line rounded-control space-y-1">
                  <div><b>Leave:</b> {activeActionModal.request.leaveType} ({activeActionModal.request.dates})</div>
                  <div><b>Duration:</b> {activeActionModal.request.days} days</div>
                  <div><b>Balance after:</b> {activeActionModal.request.balanceAfter}</div>
                </div>

                <div>
                  <label className="block text-ink-secondary font-medium mb-1">
                    Assign Substitute Teacher (for {activeActionModal.request.substituteNote})
                  </label>
                  <select
                    value={substituteTeacher}
                    onChange={e => setSubstituteTeacher(e.target.value)}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none font-medium"
                  >
                    <option value="Sunita Rathore (Free Period)">Sunita Rathore (Free Period)</option>
                    <option value="Rachna Bose (Languages)">Rachna Bose (Languages)</option>
                    <option value="Deepak Choudhary (PET / Games)">Deepak Choudhary (PET / Games)</option>
                    <option value="Pooja Meena (Primary wing)">Pooja Meena (Primary wing)</option>
                    <option value="Relief Driver (Bus Fleet)">Relief Driver (Bus Fleet)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-ink-secondary">
                  Please provide a brief reason for rejecting this leave request for {activeActionModal.request.name}:
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Critical exam invigilation duties scheduled on these dates..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setActiveActionModal(null)}
                className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-control font-semibold shadow-xs ${
                  activeActionModal.action === "approve"
                    ? "bg-primary hover:bg-[#08393F]"
                    : "bg-red-700 hover:bg-red-800"
                }`}
              >
                {activeActionModal.action === "approve" ? "Confirm & Approve" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Staff Leave Entry Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Record Staff Leave</h3>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                setIsApplyModalOpen(false);
                showToast("Staff leave record saved and added to approval queue!", "success");
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-ink-secondary font-medium mb-1">Select Employee *</label>
                <select className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none font-medium">
                  <option>Sunita Rathore (EMP-0142) · TGT Science</option>
                  <option>Vikram Singh (EMP-0118) · TGT Maths</option>
                  <option>Rachna Bose (EMP-0097) · PGT English</option>
                  <option>Mohan Lal (EMP-0164) · Driver</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Leave Type *</label>
                  <select className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none font-medium">
                    <option>Casual leave (CL)</option>
                    <option>Sick leave (SL)</option>
                    <option>Earned leave (EL)</option>
                    <option>Leave without pay (LWP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-secondary font-medium mb-1">Days *</label>
                  <input
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-secondary font-medium mb-1">Reason / Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent family work, medical doctor appointment"
                  className="w-full p-2 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-[#08393F] text-white rounded-control font-semibold shadow-xs"
                >
                  Submit Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
