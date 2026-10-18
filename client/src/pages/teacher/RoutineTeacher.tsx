import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useToast } from "../../context/ToastContext";

interface TimetableSlot {
  subject: string;
  room: string;
  isSubstitute?: boolean;
  substituteTeacher?: string;
  isFree?: boolean;
}

interface PeriodRow {
  period: string;
  time: string;
  slots: Record<string, TimetableSlot>;
}

const DAYS = [
  { key: "mon", label: "Mon 12", isToday: false },
  { key: "tue", label: "Tue 13", isToday: true },
  { key: "wed", label: "Wed 14", isToday: false },
  { key: "thu", label: "Thu 15", isToday: false },
  { key: "fri", label: "Fri 16", isToday: false },
  { key: "sat", label: "Sat 17", isToday: false },
];

const PERIOD_ROWS: PeriodRow[] = [
  {
    period: "P1",
    time: "08:00",
    slots: {
      mon: { subject: "8-B Science", room: "Room 21" },
      tue: { subject: "8-B Science", room: "Room 21" },
      wed: { subject: "8-A Science", room: "Room 21" },
      thu: { subject: "7-B Science", room: "Room 17" },
      fri: { subject: "8-B Science", room: "Room 21" },
      sat: { subject: "7-A Science", room: "Room 17" },
    },
  },
  {
    period: "P2",
    time: "08:40",
    slots: {
      mon: { subject: "7-A Science", room: "Room 17" },
      tue: { subject: "7-A Science", room: "Room 17" },
      wed: { subject: "7-B Science", room: "Room 17" },
      thu: { subject: "8-A Science", room: "Room 21" },
      fri: { isFree: true, subject: "Free", room: "" },
      sat: { subject: "8-B Science", room: "Room 21" },
    },
  },
  {
    period: "P3",
    time: "10:00",
    slots: {
      mon: { isFree: true, subject: "Free", room: "" },
      tue: { subject: "6-A English", room: "Room 14", isSubstitute: true, substituteTeacher: "Rachna Bose" },
      wed: { subject: "8-B Science", room: "Room 21" },
      thu: { isFree: true, subject: "Free", room: "" },
      fri: { subject: "7-A Science", room: "Room 17" },
      sat: { isFree: true, subject: "Free", room: "" },
    },
  },
  {
    period: "P4",
    time: "10:40",
    slots: {
      mon: { subject: "8-A Science", room: "Room 21" },
      tue: { isFree: true, subject: "Free", room: "" },
      wed: { isFree: true, subject: "Free", room: "" },
      thu: { subject: "8-B Science", room: "Room 21" },
      fri: { subject: "8-A Science", room: "Room 21" },
      sat: { subject: "7-B Science", room: "Room 17" },
    },
  },
  {
    period: "P5",
    time: "11:10",
    slots: {
      mon: { subject: "7-B Science", room: "Room 17" },
      tue: { subject: "8-A Science", room: "Room 21" },
      wed: { subject: "7-A Science", room: "Room 17" },
      thu: { subject: "7-A Science", room: "Room 17" },
      fri: { subject: "7-B Science", room: "Room 17" },
      sat: { isFree: true, subject: "Free", room: "" },
    },
  },
  {
    period: "P6",
    time: "11:50",
    slots: {
      mon: { isFree: true, subject: "Free", room: "" },
      tue: { subject: "7-B Science", room: "Room 17" },
      wed: { subject: "8-A Science", room: "Room 21" },
      thu: { isFree: true, subject: "Free", room: "" },
      fri: { isFree: true, subject: "Free", room: "" },
      sat: { subject: "8-A Science", room: "Room 21" },
    },
  },
  {
    period: "P7",
    time: "12:30",
    slots: {
      mon: { subject: "8-B Class teacher", room: "Room 21" },
      tue: { isFree: true, subject: "Free", room: "" },
      wed: { isFree: true, subject: "Free", room: "" },
      thu: { subject: "7-B Science", room: "Room 17" },
      fri: { subject: "8-B Science", room: "Room 21" },
      sat: { isFree: true, subject: "Free", room: "" },
    },
  },
  {
    period: "P8",
    time: "13:10",
    slots: {
      mon: { isFree: true, subject: "Free", room: "" },
      tue: { isFree: true, subject: "Free", room: "" },
      wed: { subject: "8-B Science", room: "Room 21" },
      thu: { isFree: true, subject: "Free", room: "" },
      fri: { isFree: true, subject: "Free", room: "" },
      sat: { isFree: true, subject: "Free", room: "" },
    },
  },
];

const RoutineTeacher: React.FC = () => {
  const { showToast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

  const handleDownload = () => {
    showToast("Generating timetable PDF...", "info");
    window.print();
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
            My timetable
          </h1>
          <span className="text-body text-ink-secondary">
            Week of 12 Oct · 26 periods of 30 · substitutions in amber
          </span>
        </div>

        <button
          onClick={handleDownload}
          className="min-h-[44px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-body flex items-center gap-2 transition-colors shadow-2xs"
        >
          <FiDownload size={16} />
          Download PDF
        </button>
      </div>

      {/* Timetable Table Card */}
      <section className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[90px_repeat(6,minmax(130px,1fr))] min-w-[880px]">
            {/* Header Row */}
            <div className="p-3 bg-surface-head text-caption font-semibold text-ink-secondary border-b border-line">
              Period
            </div>
            {DAYS.map((d) => (
              <div
                key={d.key}
                className={`p-3 text-small font-semibold border-b border-l border-line ${
                  d.isToday ? "bg-primary-tint text-primary-dark font-bold" : "bg-surface-head text-ink"
                }`}
              >
                {d.label}
              </div>
            ))}

            {/* Grid Rows */}
            {PERIOD_ROWS.map((row) => (
              <React.Fragment key={row.period}>
                {/* Period Time Column */}
                <div className="p-2.5 px-3 border-t border-line flex flex-col justify-center bg-surface">
                  <span className="text-small font-semibold text-ink">{row.period}</span>
                  <span className="font-mono text-micro text-ink-secondary">{row.time}</span>
                </div>

                {/* Day Slot Cells */}
                {DAYS.map((d) => {
                  const slot = row.slots[d.key];
                  const isTodayCol = d.isToday;

                  return (
                    <div
                      key={d.key}
                      className={`p-1.5 border-t border-l border-line ${
                        isTodayCol ? "bg-surface-subtle" : "bg-surface"
                      }`}
                    >
                      {slot.isFree ? (
                        <div className="min-h-[50px] rounded-control p-2 bg-transparent border border-dashed border-line-input flex flex-col justify-center items-center select-none">
                          <span className="text-small font-semibold text-ink-secondary/60">
                            Free
                          </span>
                        </div>
                      ) : slot.isSubstitute ? (
                        <div
                          onClick={() => setSelectedSlot(slot)}
                          className="min-h-[50px] rounded-control p-2 bg-warning-bg border-2 border-warning-accent flex flex-col justify-center gap-0.5 cursor-pointer hover:shadow-xs transition-shadow"
                        >
                          <span className="text-small font-semibold text-warning-strong leading-tight">
                            {slot.subject}
                          </span>
                          <span className="text-micro text-warning-text leading-none">
                            Substitute · {slot.substituteTeacher}
                          </span>
                        </div>
                      ) : (
                        <div
                          onClick={() => setSelectedSlot(slot)}
                          className="min-h-[50px] rounded-control p-2 bg-[#E8F1E9] border border-transparent flex flex-col justify-center gap-0.5 cursor-pointer hover:bg-[#DEEADB] transition-colors"
                        >
                          <span className="text-small font-semibold text-ink leading-tight">
                            {slot.subject}
                          </span>
                          <span className="text-micro text-ink-secondary leading-none">
                            {slot.room}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Modal when clicking a period */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card p-6 max-w-md w-full shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-caption font-semibold uppercase text-primary tracking-wider">
                  Period Details
                </span>
                <h3 className="text-h2 font-semibold text-ink m-0 mt-0.5">
                  {selectedSlot.subject}
                </h3>
                <span className="text-small text-ink-secondary">{selectedSlot.room || "Campus"}</span>
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="text-ink-secondary hover:text-ink text-body font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {selectedSlot.isSubstitute && (
              <div className="p-3 bg-warning-bg border border-warning-border rounded-control text-small text-warning-strong">
                <strong>Substitute Assignment:</strong> Covering period for {selectedSlot.substituteTeacher}. Class lesson plan & worksheets available in Resources.
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2 border-t border-line-row">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineTeacher;
