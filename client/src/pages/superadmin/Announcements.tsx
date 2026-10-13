import { useState } from "react";
import { Megaphone, Send, Clock, CheckCircle2, AlertCircle, Bell, Users } from "lucide-react";

export default function SuperAdminAnnouncements() {
  const [title, setTitle] = useState("Planned infrastructure upgrade on Sunday night");
  const [message, setMessage] = useState("The platform will undergo scheduled database maintenance on Sunday 18 Oct from 11:30 PM to 01:00 AM IST. School attendance and fee collection will not be interrupted during daytime hours.");
  const [type, setType] = useState("Maintenance");
  const [audience, setAudience] = useState("All schools · admins and staff");
  const [sentSuccess, setSentSuccess] = useState(false);

  const announcementsList = [
    {
      id: "ANN-104",
      type: "Maintenance",
      title: "Planned maintenance on Sunday night",
      meta: "Scheduled for 18 Oct, 11:30 PM IST · All 162 schools",
      stats: "Scheduled"
    },
    {
      id: "ANN-103",
      type: "New feature",
      title: "RFID & Bus GPS Live Tracking Released",
      meta: "Sent 05 Oct · Premium plan · 32 schools",
      stats: "Seen by 29 schools · 91% open"
    },
    {
      id: "ANN-102",
      type: "Incident",
      title: "OTP SMS gateway latency on Airtel DLT",
      meta: "Sent 02 Oct · All schools · Resolved in 40 mins",
      stats: "Banner viewed by 148 schools"
    },
    {
      id: "ANN-101",
      type: "Billing",
      title: "GSTR-1 Tax invoices uploaded for Q2",
      meta: "Sent 25 Sep · Active Paid Schools",
      stats: "Email delivered to 118 admins"
    }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Platform Announcements & Broadcasts
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Push real-time notification banners to school panels, send email notices, or WhatsApp alerts to owners.
          </p>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          ✓ Announcement broadcast dispatched across 162 schools.
        </div>
      )}

      {/* Two Column Layout: Create Broadcast & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Create Form */}
        <form onSubmit={handleSend} className="lg:col-span-5 bg-white rounded-2xl border border-line p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-ink m-0">New Announcement</h2>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Notice Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-surface rounded-xl border border-line"
            >
              <option>Maintenance</option>
              <option>New feature</option>
              <option>Compliance change</option>
              <option>Billing</option>
              <option>Incident</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Title (Max 60 chars)</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-surface rounded-xl border border-line"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Message Body (Max 300 chars)</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-surface rounded-xl border border-line resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Target Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-surface rounded-xl border border-line"
            >
              <option>All schools · admins and staff</option>
              <option>Paid schools only</option>
              <option>Trial schools only</option>
              <option>Rajasthan schools (RBSE)</option>
            </select>
          </div>

          {/* Delivery Channels */}
          <div className="space-y-2 pt-2 border-t border-line">
            <span className="text-xs font-bold text-ink block">Broadcast Channels</span>
            <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-primary" />
              <span>Banner in school admin portal</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-primary" />
              <span>Email notice to school administrators</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
              <input type="checkbox" className="rounded text-primary" />
              <span>Direct WhatsApp to school owners</span>
            </label>
          </div>

          <div className="pt-3 border-t border-line flex justify-end gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-gold" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>

        {/* Broadcast History */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-line flex justify-between items-center">
            <h2 className="text-base font-bold text-ink m-0">Sent & Scheduled Announcements</h2>
          </div>

          <div className="divide-y divide-line/60">
            {announcementsList.map((ann) => (
              <div key={ann.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-primary-tint/10 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ann.type === "Maintenance"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : ann.type === "Incident"
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200"
                    }`}>
                      {ann.type}
                    </span>
                    <span className="text-sm font-bold text-ink">{ann.title}</span>
                  </div>
                  <div className="text-xs text-ink-secondary">{ann.meta}</div>
                </div>

                <div className="text-xs font-medium text-ink-secondary sm:text-right shrink-0">
                  {ann.stats}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
