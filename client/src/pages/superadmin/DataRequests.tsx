import { useState } from "react";
import { Database, Download, Trash2, AlertTriangle, ShieldCheck, CheckCircle2, Clock, Eye, Send, X, FileText } from "lucide-react";

interface DataRequest {
  id: string;
  type: string;
  code: string;
  school: string;
  requestedBy: string;
  approvals: string;
  status: "ready" | "waiting" | "notice" | "scheduled" | "done";
  actionText: string;
}

const initialRequests: DataRequest[] = [
  {
    id: "1",
    type: "School data export",
    code: "DR-0041",
    school: "Pioneer Classes, Jaipur",
    requestedBy: "Owner · 10 Oct",
    approvals: "Not needed",
    status: "ready",
    actionText: "Resend link"
  },
  {
    id: "2",
    type: "Account closure",
    code: "DR-0040",
    school: "Sanskar School, Pali",
    requestedBy: "Owner · 3 Nov (ticket TKT-0951)",
    approvals: "1 of 2 · waiting for Ritika Bansal",
    status: "waiting",
    actionText: "Approve"
  },
  {
    id: "3",
    type: "Account closure",
    code: "DR-0036",
    school: "Green Valley School, Alwar",
    requestedBy: "Owner · 1 Sep",
    approvals: "2 of 2",
    status: "notice",
    actionText: "View"
  },
  {
    id: "4",
    type: "Data deletion",
    code: "DR-0031",
    school: "Green Valley School, Alwar",
    requestedBy: "System · after retention",
    approvals: "0 of 2 · due 29 Dec",
    status: "scheduled",
    actionText: "View"
  },
  {
    id: "5",
    type: "School data export",
    code: "DR-0029",
    school: "Adarsh Vidya Niketan, Bikaner",
    requestedBy: "Support for owner · 2 Oct",
    approvals: "Not needed",
    status: "done",
    actionText: "View log"
  }
];

export default function SuperAdminDataRequests() {
  const [requests, setRequests] = useState<DataRequest[]>(initialRequests);
  const [showBreachModal, setShowBreachModal] = useState(false);
  const [breachLogged, setBreachLogged] = useState(false);
  const [selectedReq, setSelectedReq] = useState<DataRequest | null>(null);

  const [breachForm, setBreachForm] = useState({
    title: "",
    schoolsAffected: "",
    detectedAt: "",
    severity: "Low",
    details: ""
  });

  const getStatusBadge = (status: DataRequest["status"]) => {
    switch (status) {
      case "ready":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Ready</span>;
      case "waiting":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Waiting approval</span>;
      case "notice":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-sky-50 text-sky-700 border border-sky-200">Notice period</span>;
      case "scheduled":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-surface text-ink-secondary border border-line">Scheduled</span>;
      case "done":
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-surface text-ink-muted border border-line">Done</span>;
    }
  };

  const handleApprove = (reqId: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === reqId ? { ...r, approvals: "2 of 2 · Approved", status: "notice", actionText: "View" } : r))
    );
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            DPDP Data Requests & Erasure
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Exports, closures and deletions under India DPDP Act 2023. Closing an account and deleting data always requires dual Super Admin sign-off.
          </p>
        </div>

        <button
          onClick={() => setShowBreachModal(true)}
          className="px-4 py-2.5 bg-white border border-line text-ink text-xs sm:text-sm font-bold rounded-xl shadow-2xs hover:bg-surface flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Log a Data Breach</span>
        </button>
      </div>

      {/* DPDP Compliance Card */}
      <div className="p-4 bg-surface rounded-2xl border border-line flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm text-ink-secondary">
            <strong className="text-ink">Dual-Key Authorization:</strong> Permanent erasure triggers a 30-day immutable cryptographic quarantine. Both primary Super Admins must authorize via hardware 2FA token.
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-ink-secondary bg-white px-2.5 py-1 rounded-md border border-line shrink-0 hidden md:inline">
          DPDP Act 2023 §12
        </span>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[900px]">
            <thead>
              <tr className="bg-surface border-b border-line text-xs font-bold text-ink-secondary uppercase">
                <th className="py-3 px-5">Request</th>
                <th className="py-3 px-5">School</th>
                <th className="py-3 px-5">Requested By</th>
                <th className="py-3 px-5">Approvals</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-ink">{req.type}</span>
                      <span className="font-mono text-xs text-primary font-semibold">{req.code}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 font-semibold text-ink">{req.school}</td>
                  <td className="py-4 px-5 text-xs text-ink-secondary">{req.requestedBy}</td>
                  <td className="py-4 px-5">
                    <span
                      className={`text-xs font-medium ${
                        req.approvals.includes("waiting") ? "text-amber-700 font-bold" : "text-ink-secondary"
                      }`}
                    >
                      {req.approvals}
                    </span>
                  </td>
                  <td className="py-4 px-5">{getStatusBadge(req.status)}</td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => {
                        if (req.status === "waiting") setSelectedReq(req);
                        else alert(`Viewing details for request ${req.code}`);
                      }}
                      className="px-3 py-1.5 bg-white border border-line text-ink hover:bg-surface text-xs font-bold rounded-lg shadow-2xs cursor-pointer"
                    >
                      {req.actionText}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Breach Log Section */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink m-0">DPDP Incident & Breach Log</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            0 Open Incidents
          </span>
        </div>

        {breachLogged ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2 text-amber-900">
            <div className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>INC-2026-001 · Under Review by Data Protection Officer</span>
            </div>
            <p>Title: {breachForm.title}</p>
            <p>Schools: {breachForm.schoolsAffected} · Reported to CERT-In & DPB within statutory 6-hour window.</p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed m-0">
            No personal data breaches recorded. If one occurs: record discovery timestamp, affected institutions, impacted user data classes, and containment actions taken. Inform affected schools within 24 hours of confirmation and assist them in notifying the Data Protection Board of India.
          </p>
        )}
      </div>

      {/* Approve Request Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-line max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedReq(null)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-ink mb-1">Dual Super Admin Approval</h3>
            <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md mb-4 inline-block">
              {selectedReq.code} · {selectedReq.type}
            </span>

            <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
              You are approving the account closure and initiation of the 30-day data retention quarantine for{" "}
              <strong>{selectedReq.school}</strong>. This action is permanently recorded in the immutable platform audit trail.
            </p>

            <div className="p-3 bg-surface rounded-xl border border-line text-xs space-y-1 mb-5">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Sign-off 1:</span>
                <span className="font-bold text-emerald-700">Ritika Bansal (Authorized)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Sign-off 2:</span>
                <span className="font-bold text-amber-700">Pending (Your approval)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-ink-secondary hover:bg-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedReq.id)}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Sign & Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Data Breach Modal */}
      {showBreachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-line max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowBreachModal(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-ink m-0">Log Security Incident</h3>
            </div>
            <p className="text-xs text-ink-secondary mb-4">
              Formal record under India DPDP Act regulations.
            </p>

            <form
              onSubmit={e => {
                e.preventDefault();
                setBreachLogged(true);
                setShowBreachModal(false);
              }}
              className="space-y-4 text-sm"
            >
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unauthorized S3 export attempt on test bucket"
                  value={breachForm.title}
                  onChange={e => setBreachForm({ ...breachForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Schools Impacted</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vidya Bharati Group (1 branch)"
                  value={breachForm.schoolsAffected}
                  onChange={e => setBreachForm({ ...breachForm, schoolsAffected: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Impact Severity</label>
                <select
                  value={breachForm.severity}
                  onChange={e => setBreachForm({ ...breachForm, severity: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Low">Low - Contained, no PII leaked</option>
                  <option value="Medium">Medium - Isolated student contact info</option>
                  <option value="High">High - Financial or credential compromise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Immediate Containment Action</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe containment steps and remediation..."
                  value={breachForm.details}
                  onChange={e => setBreachForm({ ...breachForm, details: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBreachModal(false)}
                  className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-ink-secondary hover:bg-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
