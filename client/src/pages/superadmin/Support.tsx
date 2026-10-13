import { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  ExternalLink, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  UserCheck,
  ChevronRight,
  MessageSquare
} from "lucide-react";

export default function SuperAdminSupport() {
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const tickets = [
    {
      id: "TCK-8092",
      school: "Delhi Public Academy, Jaipur",
      module: "Exams & Reports",
      subject: "CBSE Report Card XML grading tags mismatch for Class X",
      priority: "High",
      time: "18m ago",
      assigned: "Naveen K.",
      status: "Investigating"
    },
    {
      id: "TCK-8089",
      school: "St. Xavier Higher Secondary, Alwar",
      module: "Communication",
      subject: "Need DLT Principal Consent approval for pending fee SMS template",
      priority: "Medium",
      time: "1h ago",
      assigned: "Pooja S.",
      status: "Waiting on School"
    },
    {
      id: "TCK-8081",
      school: "Vivekanand Vidya Niketan, Sikar",
      module: "Fees & Banking",
      subject: "UPI Dynamic QR collection webhook retry reconciliation",
      priority: "Urgent",
      time: "4h ago",
      assigned: "Rahul M.",
      status: "Investigating"
    },
    {
      id: "TCK-8075",
      school: "Bal Vidya Mandir, Ajmer",
      module: "Admissions CRM",
      subject: "Sibling auto-concession calculation discount not applying on sibling B",
      priority: "Normal",
      time: "6h ago",
      assigned: "Naveen K.",
      status: "Resolved"
    }
  ];

  const handleStartSession = (schoolName: string) => {
    setActiveSession({
      school: schoolName,
      module: "All Modules (Read-only)",
      expiresIn: "30 min",
      sessionToken: "SUPP-SESS-982104"
    });
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      
      {/* Top Banner when a Support Session is Live */}
      {activeSession && (
        <div className="bg-rose-900 text-white p-4 rounded-2xl shadow-md border border-rose-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-gold shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-extrabold text-white">LIVE AUDITED SUPPORT SESSION: </span>
              <span>Viewing <b className="text-gold">{activeSession.school}</b> · Read-only access · Session token: <code className="font-mono">{activeSession.sessionToken}</code></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-white/20 px-2.5 py-1 rounded-md">{activeSession.expiresIn} left</span>
            <button
              onClick={() => setActiveSession(null)}
              className="px-4 py-1.5 bg-white text-rose-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-xs"
            >
              End Session
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Support Desk & "View as School"
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Support tickets raised by school staff and audited impersonation sessions for technical debugging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleStartSession("Shiksha Public School")}
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-gold" />
            <span>Launch Impersonation Session</span>
          </button>
        </div>
      </div>

      {/* SLA Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Open Tickets</span>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">6</div>
          <span className="text-xs text-ink-secondary">Across 162 schools</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Urgent SLA Breaches</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">0</div>
          <span className="text-xs text-emerald-800 font-semibold">100% SLA met today</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Avg Resolution Time</span>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">28 min</div>
          <span className="text-xs text-ink-secondary">First reply: 6m</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs">
          <span className="text-xs font-bold text-ink-secondary uppercase">Support Sessions Today</span>
          <div className="text-2xl font-extrabold text-primary font-mono mt-1">3</div>
          <span className="text-xs text-ink-secondary">Fully logged in audit trail</span>
        </div>
      </div>

      {/* Tickets Queue Table */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-line flex justify-between items-center">
          <h2 className="text-base font-bold text-ink m-0">Live Support Tickets</h2>
          <div className="text-xs text-ink-secondary">Sorted by priority SLA</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface border-b border-line text-ink-secondary text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">School & Module</th>
                <th className="py-3 px-4">Subject Query</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-primary-tint/10 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">{t.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-ink">{t.school}</div>
                    <div className="text-[11px] text-ink-secondary">{t.module}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-ink max-w-sm">
                    {t.subject}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      t.priority === "Urgent"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : t.priority === "High"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-semibold text-ink">{t.assigned}</div>
                    <div className="text-ink-secondary">{t.time}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-bold text-ink-secondary">{t.status}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleStartSession(t.school)}
                      className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-tint/40 rounded-lg border border-primary-soft/40 flex items-center gap-1.5 ml-auto"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View as School</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
