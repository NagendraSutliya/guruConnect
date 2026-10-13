import React, { useState } from "react";
import {
  FiSend,
  FiCalendar,
  FiSmartphone,
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiCheckSquare,
  FiLayers
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface PTMSlot {
  id: string;
  teacher: string;
  grade: string;
  date: string;
  timeSlot: string;
  bookedSlots: number;
  totalSlots: number;
}

const DEFAULT_PTM: PTMSlot[] = [
  { id: "1", teacher: "Sunita Rathore", grade: "Class 8-B", date: "Saturday, 24 Oct", timeSlot: "09:00 AM – 12:30 PM", bookedSlots: 28, totalSlots: 32 },
  { id: "2", teacher: "Vikram Singh", grade: "Class 9-A", date: "Saturday, 24 Oct", timeSlot: "09:00 AM – 12:30 PM", bookedSlots: 30, totalSlots: 32 },
  { id: "3", teacher: "Rachna Bose", grade: "Class 10-A", date: "Saturday, 24 Oct", timeSlot: "09:00 AM – 12:30 PM", bookedSlots: 31, totalSlots: 32 },
  { id: "4", teacher: "Pooja Meena", grade: "Class 5-A", date: "Saturday, 24 Oct", timeSlot: "09:00 AM – 12:30 PM", bookedSlots: 24, totalSlots: 30 }
];

export default function CommunicationPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"notice" | "ptm">("notice");

  // Notice state
  const [title, setTitle] = useState("School closed on 20 October for Diwali break");
  const [message, setMessage] = useState(
    "Dear parents, the school will remain closed from 20 to 24 October for the Diwali festival break. Classes will resume normally on Monday, 26 October."
  );
  const [hindiMessage, setHindiMessage] = useState(
    "प्रिय अभिभावक, दीपावली अवकाश के कारण विद्यालय 20 से 24 अक्टूबर तक बंद रहेगा। कक्षाएं सोमवार, 26 अक्टूबर से यथावत संचालित होंगी।"
  );
  const [targetAudience, setTargetAudience] = useState("Whole school");
  const [channels, setChannels] = useState({
    app: true,
    whatsapp: true,
    sms: false
  });
  const [requireAck, setRequireAck] = useState(true);

  const handleBroadcast = () => {
    showToast(
      `Notice "${title}" dispatched to ${targetAudience} via ${
        channels.whatsapp ? "App Notification & WhatsApp" : "App Notification"
      }!`,
      "success"
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Communication › Broadcast System
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Notices, WhatsApp & PTM Scheduler</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Deliver bilingual notices across official Mobile App, WhatsApp templates, and schedule PTM slots.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line gap-2">
        <button
          onClick={() => setActiveTab("notice")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "notice"
              ? "border-teal text-teal"
              : "border-transparent text-navy-muted hover:text-navy"
          }`}
        >
          Send Notice Broadcast (Screen 37)
        </button>
        <button
          onClick={() => setActiveTab("ptm")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
            activeTab === "ptm"
              ? "border-teal text-teal"
              : "border-transparent text-navy-muted hover:text-navy"
          }`}
        >
          PTM Slot Scheduling (Screen 38)
        </button>
      </div>

      {activeTab === "notice" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Compose Form matching Screen 37 */}
          <div className="lg:col-span-7 bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4 text-xs">
            <div>
              <label className="block font-medium text-navy mb-1">Notice Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">Message in English *</label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full p-2.5 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal"
              />
            </div>

            <div>
              <label className="block font-medium text-navy mb-1">
                Hindi Version / हिंदी संस्करण <span className="text-navy-muted font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={hindiMessage}
                onChange={e => setHindiMessage(e.target.value)}
                className="w-full p-2.5 bg-page border border-line rounded-control text-navy focus:outline-none focus:border-teal font-sans"
              />
            </div>

            {/* Audience Targeting */}
            <div className="space-y-2 pt-2 border-t border-line">
              <label className="block font-bold text-navy">Target Audience</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Whole school",
                  "Pre-primary",
                  "Primary",
                  "Secondary",
                  "Bus route 4",
                  "Staff only"
                ].map(aud => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setTargetAudience(aud)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      targetAudience === aud
                        ? "bg-teal text-white shadow-xs"
                        : "border border-line bg-page text-navy-muted hover:text-navy"
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-navy-muted">
                Targeting: 1,248 students · 2,031 verified guardians · 96 staff members
              </div>
            </div>

            {/* Delivery Channels from Screen 37 */}
            <div className="space-y-2 pt-2 border-t border-line">
              <label className="block font-bold text-navy">Delivery Channels</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-control bg-page border border-line/60 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={channels.app}
                      onChange={e => setChannels({ ...channels, app: e.target.checked })}
                      className="rounded text-teal"
                    />
                    <span className="font-semibold text-navy">Parent Mobile App Notification</span>
                  </div>
                  <span className="font-bold text-emerald-700 text-[11px]">Free Unlimited</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-control bg-page border border-line/60 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={channels.whatsapp}
                      onChange={e => setChannels({ ...channels, whatsapp: e.target.checked })}
                      className="rounded text-teal"
                    />
                    <span className="font-semibold text-navy">WhatsApp (Verified Meta Business Template)</span>
                  </div>
                  <span className="font-mono text-navy-muted text-[11px]">≈ 2,031 credits</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-control bg-page border border-line/60 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={channels.sms}
                      onChange={e => setChannels({ ...channels, sms: e.target.checked })}
                      className="rounded text-teal"
                    />
                    <span className="font-semibold text-navy">SMS Fallback (If app unopened in 10 mins)</span>
                  </div>
                  <span className="font-mono text-navy-muted text-[11px]">Up to 2,031 credits</span>
                </label>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 font-medium text-navy">
              <input
                type="checkbox"
                checked={requireAck}
                onChange={e => setRequireAck(e.target.checked)}
                className="rounded text-teal"
              />
              <span>Require parent acknowledgment button (Yes / Confirmed)</span>
            </label>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
              <button
                type="button"
                onClick={() => showToast("Notice scheduled for 06:00 PM today.", "info")}
                className="px-4 py-2 border border-line rounded-control bg-surface hover:bg-page font-medium text-navy"
              >
                Schedule Delivery
              </button>
              <button
                type="button"
                onClick={handleBroadcast}
                className="flex items-center gap-1.5 px-5 py-2 bg-teal hover:bg-teal-hover text-white rounded-control font-bold shadow-xs transition"
              >
                <FiSend size={14} /> Send For Approval & Broadcast
              </button>
            </div>
          </div>

          {/* Right: Live Parent Mobile App Preview from Screen 37 */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-surface border-2 border-line rounded-panel p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-navy uppercase tracking-wider pb-2 border-b border-line">
                <span>Parent App Live Preview</span>
                <FiSmartphone size={15} className="text-teal" />
              </div>

              {/* Mobile Card Phone Frame */}
              <div className="bg-page border border-line rounded-panel p-4 space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-teal font-bold uppercase tracking-wide">
                  <span>Official Notice · Shiksha Public School</span>
                  <span className="text-navy-muted font-normal">Today</span>
                </div>

                <div className="font-bold text-sm text-navy">{title}</div>

                <p className="text-xs text-navy-muted leading-relaxed">{message}</p>

                {hindiMessage && (
                  <p className="text-xs text-navy font-medium leading-relaxed pt-2 border-t border-line/60">
                    {hindiMessage}
                  </p>
                )}

                {requireAck && (
                  <div className="pt-2 flex items-center gap-2">
                    <button className="flex-1 py-1.5 bg-teal text-white rounded font-bold text-[11px] shadow-xs">
                      Acknowledge & Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PTM Scheduler Tab matching Screen 38 */
        <div className="space-y-4">
          <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
            <div className="p-4 border-b border-line flex flex-wrap items-center justify-between gap-3 bg-page/30">
              <div>
                <h2 className="font-bold text-sm text-navy">Parent-Teacher Meeting (PTM) Sessions</h2>
                <p className="text-[11px] text-navy-muted">
                  10-minute automated booking slots allotted to parents to prevent corridor congestion.
                </p>
              </div>
              <button
                onClick={() => showToast("New PTM batch slots created.", "success")}
                className="px-3.5 py-1.5 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
              >
                + Schedule PTM Session
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Session Date</th>
                    <th className="py-3 px-4">Time Window</th>
                    <th className="py-3 px-4 text-center">Booked Slots</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {DEFAULT_PTM.map(slot => (
                    <tr key={slot.id} className="hover:bg-page/40 transition">
                      <td className="py-3 px-4 font-bold text-navy">{slot.teacher}</td>
                      <td className="py-3 px-4 font-semibold text-teal">{slot.grade}</td>
                      <td className="py-3 px-4 text-navy-muted font-medium">{slot.date}</td>
                      <td className="py-3 px-4 font-mono text-navy-muted">{slot.timeSlot}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-bold text-navy">
                          {slot.bookedSlots} / {slot.totalSlots}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => showToast(`Opening roster for ${slot.teacher}...`, "info")}
                          className="px-3 py-1 border border-line rounded-control bg-surface hover:bg-page font-semibold text-navy text-xs"
                        >
                          View Schedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
