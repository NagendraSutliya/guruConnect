import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import AnalyticsChart from "../../components/admin/AnalyticsChart";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState("7days");
  const analyticsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/stats?range=${selectedRange}`)
      .then(res => setStats(res.data.data))
      .catch(err => console.error("Stats fetch error:", err))
      .finally(() => setLoading(false));
  }, [selectedRange]);

  const handleCardClick = (category: string) => {
    setActiveCategory(category);
    setTimeout(() => {
      analyticsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-content mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-small text-ink-secondary">
            {today} · Session 2026-27
            {stats?.plan && (
              <>
                <span>·</span>
                <span className="uppercase text-[10px] tracking-wider font-bold bg-primary-tint text-primary-dark px-1.5 py-0.5 rounded-sm">
                  {stats.plan} PLAN
                </span>
              </>
            )}
          </div>
          <h1 className="m-0 text-title font-semibold tracking-tight text-ink">Good morning, {user?.name?.split(' ')[0] || 'Admin'}</h1>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/admin/admissions" className="inline-flex items-center min-h-[44px] px-[18px] rounded-control border border-line-input bg-surface text-ink font-medium text-body hover:bg-surface-subtle transition-colors">
            New admission
          </Link>
          <Link to="/admin/fees" className="inline-flex items-center min-h-[44px] px-[18px] rounded-control bg-primary text-white font-semibold text-body hover:bg-primary-dark transition-colors">
            Collect fee
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Students */}
        <div onClick={() => handleCardClick("students")} className="bg-surface border border-line rounded-card p-5 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] hover:border-primary-soft hover:shadow-sm transition-all">
          <div className="text-small text-ink-secondary font-medium">Active students</div>
          <div className="font-mono text-kpi font-medium text-ink">{stats?.students || 0}</div>
          <div className="text-small text-ink-secondary">Total enrolled across all classes</div>
        </div>
        
        {/* Total Teachers */}
        <div onClick={() => handleCardClick("teachers")} className="bg-surface border border-line rounded-card p-5 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] hover:border-primary-soft hover:shadow-sm transition-all">
          <div className="text-small text-ink-secondary font-medium">Total Teachers</div>
          <div className="font-mono text-kpi font-medium text-ink">{stats?.teachers || 0}</div>
          <div className="text-small text-ink-secondary">+{stats?.newTeachersToday || 0} joined today</div>
        </div>
        
        {/* Total Feedback */}
        <div onClick={() => handleCardClick("feedback")} className="bg-surface border border-line rounded-card p-5 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] hover:border-primary-soft hover:shadow-sm transition-all">
          <div className="text-small text-ink-secondary font-medium">Total Feedback</div>
          <div className="font-mono text-kpi font-medium text-ink">{stats?.totalFeedback || 0}</div>
          <div className="text-small text-ink-secondary">{stats?.feedbackToday || 0} received today</div>
        </div>
        
        {/* Avg Rating */}
        <div onClick={() => handleCardClick("rating")} className="bg-surface border border-line rounded-card p-5 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] hover:border-primary-soft hover:shadow-sm transition-all">
          <div className="text-small text-ink-secondary font-medium">Avg Rating</div>
          <div className="font-mono text-kpi font-medium text-ink">{stats?.avgRating ? stats.avgRating.toFixed(1) : "0.0"}</div>
          <div className="text-small text-ink-secondary">Out of 5 stars</div>
        </div>

        {/* Today's Attendance (Static but interactive) */}
        <div onClick={() => handleCardClick("attendance")} className="bg-surface border border-line rounded-card p-5 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] hover:border-primary-soft hover:shadow-sm transition-all">
          <div className="text-small text-ink-secondary font-medium">Today's attendance</div>
          <div className="font-mono text-kpi font-medium text-ink">93.4%</div>
          <div className="text-small text-ink-secondary">1,084 present of 1,161 marked</div>
        </div>
        
        {/* Collected in October (Static but interactive) */}
        <div onClick={() => handleCardClick("fees")} className="bg-surface border border-line rounded-card p-5 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] hover:border-primary-soft hover:shadow-sm transition-all">
          <div className="text-small text-ink-secondary font-medium">Collected in October</div>
          <div className="font-mono text-kpi font-medium text-ink">₹18,42,500</div>
          <div className="text-small text-ink-secondary">70.6% of ₹26,10,000 due</div>
        </div>
        
        {/* Outstanding dues (Warning) */}
        <div onClick={() => handleCardClick("dues")} className="bg-warning-bg border border-warning-border rounded-card p-5 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] hover:shadow-sm transition-all">
          <div className="text-small text-warning-strong font-semibold">Outstanding dues</div>
          <div className="font-mono text-kpi font-medium text-warning-strong">₹7,67,500</div>
          <div className="text-small text-warning-strong">184 defaulters over 15 days</div>
        </div>

        {/* Institute Plan */}
        <div onClick={() => handleCardClick("plan")} className="bg-surface border border-line rounded-card p-5 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] hover:border-primary-soft hover:shadow-sm transition-all">
          <div className="text-small text-ink-secondary font-medium">Current Plan</div>
          <div className="font-mono text-kpi font-medium text-ink uppercase">{stats?.plan || "FREE"}</div>
          <div className="text-small text-ink-secondary">Capacity: {Math.max(0, 5000 - (stats?.students || 0))} slots</div>
        </div>
      </div>

      {/* Main Grid: Left & Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column (span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Attendance Reminder (Static content to maintain layout) */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center gap-3">
              <h2 className="m-0 text-h2 font-semibold text-ink">Attendance not marked · cut-off 10:00 am</h2>
              <span className="text-caption font-semibold text-warning-strong bg-warning-bg px-2.5 py-1 rounded-full">3 sections</span>
            </div>
            
            <div className="flex justify-between items-center gap-3 py-3 border-t border-line-row">
              <div className="flex flex-col gap-0.5">
                <div className="font-semibold text-body text-ink">Class 7-B</div>
                <div className="text-small text-ink-secondary">Class teacher: Ankit Sharma</div>
              </div>
              <button className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-surface text-small font-medium text-ink hover:bg-surface-subtle transition-colors">
                Send reminder
              </button>
            </div>
            
            <div className="flex justify-between items-center gap-3 py-3 border-t border-line-row">
              <div className="flex flex-col gap-0.5">
                <div className="font-semibold text-body text-ink">Class 9-C</div>
                <div className="text-small text-ink-secondary">Class teacher: Anil Sharma</div>
              </div>
              <button className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-surface text-small font-medium text-ink hover:bg-surface-subtle transition-colors">
                Send reminder
              </button>
            </div>
            
            <div className="flex justify-between items-center gap-3 py-3 border-t border-line-row">
              <div className="flex flex-col gap-0.5">
                <div className="font-semibold text-body text-ink">Class 11-Commerce</div>
                <div className="text-small text-ink-secondary">Class teacher: Rakesh Jain</div>
              </div>
              <button className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-surface text-small font-medium text-ink hover:bg-surface-subtle transition-colors">
                Send reminder
              </button>
            </div>
          </section>

          {/* Student Enrollment Chart */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3">
            <div className="flex justify-between items-baseline gap-3">
              <h2 className="m-0 text-h2 font-semibold text-ink">Student Enrollment · last 7 days</h2>
              <Link to="/admin/students" className="text-small font-medium text-primary hover:underline">View all</Link>
            </div>
            
            <div className="flex items-end gap-3.5 h-[180px] pt-2 border-b border-line">
              {stats?.trends?.students && stats.trends.students.length > 0 ? (
                stats.trends.students.map((trend: any, i: number) => {
                  const maxCount = Math.max(...stats.trends.students.map((t: any) => t.count), 1);
                  const heightPercentage = Math.max((trend.count / maxCount) * 100, 5);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                      <div className="font-mono text-micro text-ink-secondary">{trend.count}</div>
                      <div className={`w-full max-w-[44px] bg-primary-soft rounded-t-small`} style={{ height: `${heightPercentage}%` }} />
                      <div className="text-center text-caption text-ink-secondary mt-1">{new Date(trend._id).toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center text-small text-ink-secondary self-center">No enrollment data for the last 7 days.</div>
              )}
            </div>
          </section>

          {/* Feedback Trend Chart */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3">
            <div className="flex justify-between items-baseline gap-3">
              <h2 className="m-0 text-h2 font-semibold text-ink">Feedback Received · last 7 days</h2>
              <Link to="/admin/feedback" className="text-small font-medium text-primary hover:underline">View all</Link>
            </div>
            
            <div className="flex items-end gap-3.5 h-[180px] pt-2 border-b border-line">
              {stats?.trends?.feedback && stats.trends.feedback.length > 0 ? (
                stats.trends.feedback.map((trend: any, i: number) => {
                  const maxCount = Math.max(...stats.trends.feedback.map((t: any) => t.count), 1);
                  const heightPercentage = Math.max((trend.count / maxCount) * 100, 5);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                      <div className="font-mono text-micro text-ink-secondary">{trend.count}</div>
                      <div className={`w-full max-w-[44px] bg-gold rounded-t-small`} style={{ height: `${heightPercentage}%` }} />
                      <div className="text-center text-caption text-ink-secondary mt-1">{new Date(trend._id).toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full text-center text-small text-ink-secondary self-center">No feedback data for the last 7 days.</div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column (span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* AI Insights (Real-time calculated capacity) */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-4">
            <h2 className="m-0 text-h2 font-semibold text-ink">AI Insights</h2>
            
            <div className="flex items-start gap-3 py-3 border-t border-line-row">
              <div className="w-8 h-8 rounded-control bg-success-bg text-success-text flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-body font-semibold text-ink tracking-tight">System Capacity</div>
                <div className="text-small text-ink-secondary leading-relaxed">
                  Your {stats?.plan || "current"} plan can accommodate 
                  {" "}<strong>{Math.max(0, 5000 - (stats?.students || 0))}</strong> more students optimally.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3 border-t border-line-row">
              <div className="w-8 h-8 rounded-control bg-warning-bg text-warning-strong flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-body font-semibold text-ink tracking-tight">Engagement Alert</div>
                <div className="text-small text-ink-secondary leading-relaxed">
                  Feedback submissions have {stats?.feedbackToday > 0 ? "been active today." : "been low recently. Consider sending a reminder."}
                </div>
              </div>
            </div>
          </section>

          {/* Waiting for Approval */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-1 h-full">
            <h2 className="m-0 mb-2 text-h2 font-semibold text-ink">Waiting for your approval</h2>
            
            {[
              { type: "Concession", title: "Sibling concession 15% · Aarav Gupta (5-A)", desc: "Requested by Accountant · 2 h ago" },
              { type: "Marks unlock", title: "Half-Yearly Science · Class 8-B", desc: "Teacher: Sunita Rathore · typo in 3 entries" },
              { type: "Transfer certificate", title: "Riya Choudhary (10-A)", desc: "All dues cleared · library cleared" },
              { type: "Staff leave", title: "Vikram Singh · 12–14 Oct (CL)", desc: "6 periods need substitutes" }
            ].map((approval, i) => (
              <div key={i} className="flex justify-between items-center gap-3 py-3 border-t border-line-row">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="text-caption font-semibold text-primary uppercase tracking-wider">{approval.type}</div>
                  <div className="text-body font-medium text-ink truncate">{approval.title}</div>
                  <div className="text-small text-ink-secondary truncate">{approval.desc}</div>
                </div>
                <button className="min-h-[40px] px-3.5 rounded-control border-0 bg-primary-tint text-primary-dark font-semibold text-small hover:bg-primary-soft/50 transition-colors">
                  Review
                </button>
              </div>
            ))}
          </section>

          {/* Today Timeline */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3">
            <h2 className="m-0 text-h2 font-semibold text-ink">Today</h2>
            
            {[
              { time: "10:00", text: "Attendance cut-off" },
              { time: "12:30", text: "Class 6 PTM — 31 slots booked" },
              { time: "16:00", text: "Homework diary sent to parents" }
            ].map((event, i) => (
              <div key={i} className="flex gap-3.5 items-baseline">
                <div className="font-mono text-small text-ink-secondary w-[48px] flex-none">{event.time}</div>
                <div className="text-body text-ink">{event.text}</div>
              </div>
            ))}
          </section>
        </div>
        
      </div>

      {/* Analytics Chart Section */}
      <div ref={analyticsRef} className="pt-2 w-full min-w-0">
        <AnalyticsChart 
          stats={stats} 
          activeCategory={activeCategory} 
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
      </div>
    </div>
  );
}
