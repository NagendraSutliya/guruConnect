import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Users, 
  Clock, 
  IndianRupee, 
  AlertCircle, 
  HelpCircle, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight
} from "lucide-react";
import api from "../../api/axiosInstance";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/superadmin/dashboard-stats")
      .then((res) => {
        setStats(res.data.data);
      })
      .catch(() => {
        // Fallback default mock stats matching specification
        setStats({
          totalInstitutes: 162,
          activeInstitutes: 128,
          trialInstitutes: 23,
          totalStudents: 146820,
          totalRevenue: 2850000,
          overdueCount: 9,
          openTickets: 6,
          trialsEndingSoon: 7
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const todayFormatted = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  const endingTrials = [
    { name: "Bal Vidya Mandir, Ajmer", plan: "Standard", students: 640, status: "Healthy", daysLeft: "ends Wed", note: "Fees and attendance live" },
    { name: "Shiksha Career Academy, Kota", plan: "Starter", students: 1120, status: "Healthy", daysLeft: "ends Thu", note: "Admissions CRM active" },
    { name: "Gyan Jyoti Public School, Bikaner", plan: "Standard", students: 410, status: "Low use", daysLeft: "ends Fri", note: "No attendance logged this week" },
    { name: "Sunrise Convent School, Udaipur", plan: "Premium", students: 280, status: "Not set up", daysLeft: "ends Sun", note: "Setup wizard at Step 3" }
  ];

  const recentTickets = [
    { id: "TCK-8092", school: "Delhi Public Academy, Jaipur", subject: "CBSE Report Card XML generation issue", time: "18m ago", priority: "High", assigned: "Naveen K." },
    { id: "TCK-8089", school: "St. Xavier Higher Secondary, Alwar", subject: "Need DLT template approval for SMS fees notice", time: "1h ago", priority: "Medium", assigned: "Pooja S." },
    { id: "TCK-8081", school: "Vivekanand Vidya Niketan, Sikar", subject: "Bank reconciliation UPI QR mismatch query", time: "4h ago", priority: "Urgent", assigned: "Rahul M." }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-[1360px] mx-auto pb-12">
      
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-secondary mb-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Platform Overview
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Real-time status of all schools, billing run, and infrastructure performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/superadmin/schools"
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Create School Account</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards (6-grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Active Schools */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider">Active Schools</span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-ink tracking-tight font-mono">
              {stats?.activeInstitutes || 128}
            </span>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md self-start border border-emerald-200/50">
            +6 this month
          </span>
        </div>

        {/* On Trial */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider">On Trial</span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-ink tracking-tight font-mono">
              {stats?.trialInstitutes || 23}
            </span>
          </div>
          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md self-start border border-amber-200/50">
            7 ending this week
          </span>
        </div>

        {/* Students on platform */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider">Total Students</span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-ink tracking-tight font-mono">
              {(stats?.totalStudents || 146820).toLocaleString("en-IN")}
            </span>
          </div>
          <span className="text-xs font-medium text-ink-secondary">
            Billable, all schools
          </span>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider">Monthly MRR</span>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-lg font-bold text-ink">₹</span>
            <span className="text-3xl font-extrabold text-ink tracking-tight font-mono">
              {((stats?.totalRevenue || 2850000) / 100000).toFixed(2)}L
            </span>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md self-start border border-emerald-200/50">
            +8.4% MoM
          </span>
        </div>

        {/* Overdue */}
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Overdue Invoices</span>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-lg font-bold text-amber-900">₹</span>
            <span className="text-3xl font-extrabold text-amber-900 tracking-tight font-mono">
              1.42L
            </span>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md self-start">
            9 schools past due
          </span>
        </div>

        {/* Open Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider">Open Tickets</span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-ink tracking-tight font-mono">
              {stats?.openTickets || 6}
            </span>
          </div>
          <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md self-start border border-rose-200/50">
            1 waiting &gt;24h
          </span>
        </div>

      </div>

      {/* Two Column Grid: Trials Ending in 7 days & Open Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left: Trials Ending in 7 Days */}
        <div className="bg-white rounded-2xl border border-line p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink m-0">Trials Ending in 7 Days</h2>
              <span className="text-xs text-ink-secondary">Action required to convert to paid subscriptions</span>
            </div>
            <Link
              to="/superadmin/schools"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all (7)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-line/70">
            {endingTrials.map((t, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-1 last:pb-0">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-ink truncate hover:text-primary cursor-pointer">
                    {t.name}
                  </div>
                  <div className="text-xs text-ink-secondary flex items-center gap-2 mt-0.5">
                    <span className="font-medium text-ink">{t.plan} Plan</span>
                    <span>·</span>
                    <span>{t.students} students</span>
                    <span>·</span>
                    <span className="text-ink-secondary truncate">{t.note}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === "Healthy" 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : t.status === "Low use"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}>
                    {t.status}
                  </span>
                  <span className="text-[11px] text-ink-secondary font-medium">{t.daysLeft}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-line flex justify-end">
            <Link 
              to="/superadmin/schools"
              className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Extend Grace Period or Send Quotation →
            </Link>
          </div>
        </div>

        {/* Right: Urgent Support Tickets */}
        <div className="bg-white rounded-2xl border border-line p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink m-0">Recent Support Queue</h2>
              <span className="text-xs text-ink-secondary">Real-time issues raised by school principals</span>
            </div>
            <Link
              to="/superadmin/support"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Support Desk</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-line/70">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="py-3.5 flex items-start justify-between gap-3 first:pt-1 last:pb-0">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary bg-primary-tint/60 px-1.5 py-0.5 rounded">
                      {ticket.id}
                    </span>
                    <span className="text-xs font-semibold text-ink-secondary truncate">
                      {ticket.school}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-ink truncate">
                    {ticket.subject}
                  </div>
                  <div className="text-[11px] text-ink-secondary flex items-center gap-2">
                    <span>{ticket.time}</span>
                    <span>·</span>
                    <span>Assigned: {ticket.assigned}</span>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  ticket.priority === "Urgent"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : ticket.priority === "High"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  {ticket.priority}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-line flex justify-end">
            <Link 
              to="/superadmin/support"
              className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Open Support Queue (6 active) →
            </Link>
          </div>
        </div>

      </div>

      {/* System Status Banner */}
      <div className="bg-surface-subtle rounded-2xl border border-line p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-ink">All Systems Operational. </span>
            <span className="text-ink-secondary">WhatsApp API 99.98% · SMS DLT Gateway Active · Daily Database Backups Encrypted</span>
          </div>
        </div>
        <Link
          to="/superadmin/monitoring"
          className="text-xs font-bold text-primary hover:underline shrink-0"
        >
          View Infrastructure Telemetry →
        </Link>
      </div>

    </div>
  );
}
