import React, { useState } from "react";
import {
  FiSend,
  FiSmartphone,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiPlus,
  FiX
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface TeacherPTMRow {
  classGrade: string;
  teacherName: string;
  slots: ("Booked" | "Met" | "No-show" | "Free")[];
}

const TIME_SLOTS = [
  "12:30", "12:40", "12:50", "1:00", "1:10", "1:20",
  "1:30", "1:40", "1:50", "2:00", "2:10", "2:20"
];

const INITIAL_PTM_MATRIX: TeacherPTMRow[] = [
  {
    classGrade: "6-A",
    teacherName: "Ankit Sharma",
    slots: ["Met", "Met", "Booked", "Booked", "Booked", "Free", "Booked", "Booked", "Booked", "Booked", "Booked", "Booked"]
  },
  {
    classGrade: "6-B",
    teacherName: "Hemant Vyas",
    slots: ["Met", "No-show", "Booked", "Booked", "Booked", "Booked", "Free", "Booked", "Booked", "Booked", "Booked", "Booked"]
  },
  {
    classGrade: "6-C",
    teacherName: "Sunita Rathore",
    slots: ["Met", "Met", "Booked", "Booked", "Free", "Booked", "Booked", "Booked", "Booked", "Booked", "Free", "Booked"]
  }
];

export default function CommunicationPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"notices" | "ptm">("notices");

  // Notice Composer State (Screen 37)
  const [noticeTitle, setNoticeTitle] = useState("School closed on 20 October for Diwali break");
  const [noticeMessage, setNoticeMessage] = useState(
    "Dear parents, the school will remain closed from 20 to 24 October for the Diwali break. Classes resume on Monday, 26 October."
  );
  const [noticeHindi, setNoticeHindi] = useState(
    "प्रिय अभिभावक, दीपावली अवकाश के कारण विद्यालय 20 से 24 अक्टूबर तक बंद रहेगा।"
  );
  const [selectedAudience, setSelectedAudience] = useState("Whole school");
  const [channels, setChannels] = useState({
    app: true,
    whatsapp: true,
    sms: false
  });
  const [askAck, setAskAck] = useState(false);

  // PTM Matrix State (Screen 38)
  const [ptmMatrix, setPtmMatrix] = useState<TeacherPTMRow[]>(INITIAL_PTM_MATRIX);
  const [isNewPTMModalOpen, setIsNewPTMModalOpen] = useState(false);
  const [newPTMForm, setNewPTMForm] = useState({
    title: "Class 7 & 8 Mid-Term PTM",
    date: "2026-10-31",
    startTime: "12:30",
    endTime: "14:30",
    slotDuration: 10
  });

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    showToast(`Notice "${noticeTitle}" submitted for Principal approval and parent broadcast!`, "success");
  };

  const handleRemindUnbooked = () => {
    showToast("Automated SMS & WhatsApp reminder pushed to 5 unbooked parents!", "success");
  };

  const handleCreatePTM = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewPTMModalOpen(false);
    showToast(`PTM session "${newPTMForm.title}" scheduled for ${newPTMForm.date}!`, "success");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 37-Notices.html & 38-PTM.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary flex items-center gap-1.5">
            <span>Communication ›</span>
            <button
              type="button"
              onClick={() => setActiveTab("notices")}
              className={`hover:underline cursor-pointer ${
                activeTab === "notices" ? "font-semibold text-ink" : "text-primary"
              }`}
            >
              New notice
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab("ptm")}
              className={`hover:underline cursor-pointer ${
                activeTab === "ptm" ? "font-semibold text-ink" : "text-primary"
              }`}
            >
              PTM
            </button>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            {activeTab === "notices" ? "Send a notice" : "Class 6 PTM · today, 12:30–2:30 pm"}
          </h1>
          {activeTab === "ptm" && (
            <div className="text-[13px] text-ink-secondary">
              10-minute slots · parents booked from the app · Half-yearly marks summary shared with each teacher
            </div>
          )}
        </div>

        {activeTab === "ptm" && (
          <div className="flex gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleRemindUnbooked}
              className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Remind unbooked parents
            </button>
            <button
              type="button"
              onClick={() => setIsNewPTMModalOpen(true)}
              className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
            >
              <FiPlus size={15} />
              <span>New PTM</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 1: SEND A NOTICE (Matching 37-Notices.html) */}
      {activeTab === "notices" && (
        <div className="flex flex-wrap gap-5 items-start">
          {/* Left Form: Notice Composer */}
          <section className="flex-1 basis-[480px] min-w-0 bg-white border border-line rounded-card p-4 flex flex-col gap-4 shadow-xs">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
              Title
              <input
                type="text"
                required
                value={noticeTitle}
                onChange={e => setNoticeTitle(e.target.value)}
                className="min-h-[44px] px-3.5 border border-line-input rounded-control text-sm text-ink focus:border-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
              Message
              <textarea
                rows={4}
                required
                value={noticeMessage}
                onChange={e => setNoticeMessage(e.target.value)}
                className="p-3 border border-line-input rounded-control text-sm text-ink leading-relaxed focus:border-primary focus:outline-none resize-y"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
              <span>
                Hindi version <span className="font-normal text-ink-secondary">(optional)</span>
              </span>
              <textarea
                rows={2}
                value={noticeHindi}
                onChange={e => setNoticeHindi(e.target.value)}
                className="p-3 border border-line-input rounded-control text-sm text-ink leading-relaxed focus:border-primary focus:outline-none resize-y"
              />
            </label>

            {/* Target Audience Filter Pills */}
            <fieldset className="border-0 p-0 m-0 flex flex-col gap-2">
              <legend className="text-sm font-medium text-ink pb-1">Who receives it</legend>
              <div className="flex flex-wrap gap-2">
                {[
                  "Whole school",
                  "Pre-primary",
                  "Primary",
                  "Class / section…",
                  "Bus route…",
                  "Staff only"
                ].map(aud => {
                  const isSelected = selectedAudience === aud;
                  return (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => setSelectedAudience(aud)}
                      className={`min-h-[36px] px-3.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                        isSelected
                          ? "bg-nav-bg text-white border-nav-bg"
                          : "bg-white text-ink border-line-input hover:bg-slate-50"
                      }`}
                    >
                      {aud}
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-ink-secondary">
                1,248 students · 2,031 guardians · 96 staff
              </span>
            </fieldset>

            {/* Channels */}
            <fieldset className="border-0 p-0 m-0 flex flex-col gap-2.5 pt-2 border-t border-line/60">
              <legend className="text-sm font-medium text-ink pb-1">Channels</legend>

              <label className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.app}
                  onChange={e => setChannels(prev => ({ ...prev, app: e.target.checked }))}
                  className="w-4.5 h-4.5 text-primary rounded"
                />
                <span className="flex-1">App notification</span>
                <span className="text-xs text-ink-secondary">Free</span>
              </label>

              <label className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.whatsapp}
                  onChange={e => setChannels(prev => ({ ...prev, whatsapp: e.target.checked }))}
                  className="w-4.5 h-4.5 text-primary rounded"
                />
                <span className="flex-1">WhatsApp (approved template)</span>
                <span className="text-xs text-ink-secondary">≈ 2,031 credits</span>
              </label>

              <label className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.sms}
                  onChange={e => setChannels(prev => ({ ...prev, sms: e.target.checked }))}
                  className="w-4.5 h-4.5 text-primary rounded"
                />
                <span className="flex-1">SMS (only if app not opened in 10 min)</span>
                <span className="text-xs text-ink-secondary">Up to 2,031 credits</span>
              </label>
            </fieldset>

            <label className="flex items-center gap-2.5 text-sm text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={askAck}
                onChange={e => setAskAck(e.target.checked)}
                className="w-4.5 h-4.5 text-primary rounded"
              />
              <span>Ask parents to acknowledge (Yes / No)</span>
            </label>

            <div className="flex justify-end gap-2.5 pt-2.5 border-t border-line-row">
              <button
                type="button"
                onClick={() => showToast("Notice draft saved for scheduled broadcast.", "info")}
                className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-sm font-medium transition cursor-pointer shadow-xs"
              >
                Schedule
              </button>
              <button
                type="button"
                onClick={handleSendNotice}
                className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Send for principal approval
              </button>
            </div>
          </section>

          {/* Right Aside: Preview & Recent Notices (Matching 37-Notices.html) */}
          <aside className="flex-1 basis-[300px] max-w-full lg:max-w-[340px] flex flex-col gap-4">
            {/* Live Parent App Card Preview */}
            <section className="bg-white border border-line rounded-card p-4 flex flex-col gap-3 shadow-xs">
              <h2 className="m-0 text-sm font-semibold text-ink">Preview in parent app</h2>

              <div className="border border-line rounded-card p-3.5 bg-surface-subtle flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Notice · GuruConnect Institute
                </span>
                <span className="text-sm font-semibold text-ink leading-snug">
                  {noticeTitle}
                </span>
                <span className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                  {noticeMessage}
                </span>
              </div>
            </section>

            {/* Recent Notices */}
            <section className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
              <h2 className="m-0 mb-2 text-sm font-semibold text-ink">Recent notices</h2>

              <div className="py-2.5 border-t border-line-row flex flex-col gap-1">
                <div className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="font-semibold text-ink">PTM for Class 6 on 9 Oct</span>
                  <span className="text-ink-secondary shrink-0">02 Oct</span>
                </div>
                <span className="text-xs text-ink-secondary">98% delivered · 412 acknowledges</span>
              </div>

              <div className="py-2.5 border-t border-line-row flex flex-col gap-1">
                <div className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="font-semibold text-ink">Fee installment 3 due date reminder</span>
                  <span className="text-ink-secondary shrink-0">28 Sep</span>
                </div>
                <span className="text-xs text-ink-secondary">100% delivered · 88 online payments</span>
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* SECTION 2: PTM SCHEDULER & MATRIX (Matching 38-PTM.html) */}
      {activeTab === "ptm" && (
        <div className="space-y-4">
          {/* 4 KPI Cards (Matching 38-PTM.html) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
              <span className="text-xs text-ink-secondary font-medium">Slots</span>
              <span className="font-mono text-xl font-semibold text-ink">36</span>
            </div>

            <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
              <span className="text-xs text-ink-secondary font-medium">Booked</span>
              <span className="font-mono text-xl font-semibold text-ink">31</span>
            </div>

            <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
              <span className="text-xs text-ink-secondary font-medium">Met so far</span>
              <span className="font-mono text-xl font-semibold text-ink">4</span>
            </div>

            <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
              <span className="text-xs text-ink-secondary font-medium">No-shows</span>
              <span className="font-mono text-xl font-semibold text-ink">1</span>
            </div>
          </div>

          {/* Interactive PTM Matrix by Teacher (Matching 38-PTM.html) */}
          <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
            <div className="p-3.5 px-5 border-b border-line-row flex justify-between items-center gap-3 flex-wrap">
              <h2 className="m-0 text-base font-semibold text-ink">
                Slots by class teacher
              </h2>

              <div className="flex items-center gap-3.5 text-xs text-ink-secondary flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-[3px] bg-primary block" />
                  Booked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-[3px] bg-primary-soft block" />
                  Met
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-[3px] bg-warning-cell block" />
                  No-show
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-[3px] border border-dashed border-ink-secondary bg-white block" />
                  Free
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-[160px_repeat(12,minmax(44px,1fr))] min-w-[760px] text-xs">
                {/* Header Row */}
                <div className="p-2.5 px-4 bg-surface-head font-semibold text-ink">Teacher</div>
                {TIME_SLOTS.map(t => (
                  <div
                    key={t}
                    className="p-2.5 bg-surface-head font-mono text-[11.5px] text-center text-ink-secondary"
                  >
                    {t}
                  </div>
                ))}

                {/* Rows */}
                {ptmMatrix.map(row => (
                  <React.Fragment key={row.classGrade}>
                    <div className="p-2.5 px-4 border-t border-line-row flex flex-col justify-center">
                      <span className="font-semibold text-ink">{row.classGrade}</span>
                      <span className="text-[11px] text-ink-secondary">{row.teacherName}</span>
                    </div>

                    {row.slots.map((status, idx) => (
                      <div
                        key={idx}
                        className="p-2 border-t border-line-row flex items-center justify-center"
                      >
                        {status === "Met" && (
                          <span
                            title="Met"
                            className="w-full h-8 rounded-[5px] bg-primary-soft border border-primary-soft block cursor-pointer"
                          />
                        )}
                        {status === "Booked" && (
                          <span
                            title="Booked"
                            className="w-full h-8 rounded-[5px] bg-primary border border-primary block cursor-pointer"
                          />
                        )}
                        {status === "No-show" && (
                          <span
                            title="No-show"
                            className="w-full h-8 rounded-[5px] bg-warning-cell border border-warning-cell block cursor-pointer"
                          />
                        )}
                        {status === "Free" && (
                          <span
                            title="Free"
                            className="w-full h-8 rounded-[5px] bg-white border border-dashed border-ink-secondary block cursor-pointer"
                          />
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* New PTM Modal */}
      {isNewPTMModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Schedule New PTM Session</h3>
              <button
                type="button"
                onClick={() => setIsNewPTMModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePTM} className="space-y-3.5">
              <div>
                <label className="block text-ink font-medium mb-1">PTM Session Title</label>
                <input
                  type="text"
                  required
                  value={newPTMForm.title}
                  onChange={e => setNewPTMForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newPTMForm.date}
                    onChange={e => setNewPTMForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Slot Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={newPTMForm.slotDuration}
                    onChange={e => setNewPTMForm(prev => ({ ...prev, slotDuration: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newPTMForm.startTime}
                    onChange={e => setNewPTMForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={newPTMForm.endTime}
                    onChange={e => setNewPTMForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsNewPTMModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
                >
                  Generate Slot Grid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
