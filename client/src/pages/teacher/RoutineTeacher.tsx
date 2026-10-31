import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import {
  MdCalendarToday,
  MdAccessTime,
  MdEventBusy,
  MdSwapHoriz,
  MdDownload,
  MdPrint,
  MdRoom,
  MdFilterList,
  MdMenuBook,
  MdFactCheck,
  MdGroups,
  MdClose
} from "react-icons/md";

interface TimetableSlot {
  subject: string;
  room: string;
  isSubstitute?: boolean;
  substituteTeacher?: string;
  isFree?: boolean;
  isClassTeacher?: boolean;
  topic?: string;
  periodName?: string;
  timeSlot?: string;
  dayName?: string;
}

interface PeriodRow {
  period: string;
  time: string;
  isLunch?: boolean;
  slots: Record<string, TimetableSlot>;
}

const DAYS = [
  { key: "mon", label: "Monday", date: "12 Oct", isToday: false },
  { key: "tue", label: "Tuesday", date: "13 Oct", isToday: true },
  { key: "wed", label: "Wednesday", date: "14 Oct", isToday: false },
  { key: "thu", label: "Thursday", date: "15 Oct", isToday: false },
  { key: "fri", label: "Friday", date: "16 Oct", isToday: false },
  { key: "sat", label: "Saturday", date: "17 Oct", isToday: false },
];

const PERIOD_ROWS: PeriodRow[] = [
  {
    period: "P1",
    time: "08:00 - 08:40",
    slots: {
      mon: { subject: "8-B Science", room: "Room 21", topic: "Ch. 6 Combustion — types of combustion" },
      tue: { subject: "8-B Science", room: "Room 21", topic: "Ch. 6 Combustion — ignition temperature" },
      wed: { subject: "8-A Science", room: "Room 21", topic: "Ch. 5 Coal and Petroleum — fractional distillation" },
      thu: { subject: "7-B Science", room: "Room 17", topic: "Ch. 4 Heat & Temperature measurement" },
      fri: { subject: "8-B Science", room: "Room 21", topic: "Lab: Flame zones and calorific value" },
      sat: { subject: "7-A Science", room: "Room 17", topic: "Unit test revision and numericals" },
    },
  },
  {
    period: "P2",
    time: "08:40 - 09:20",
    slots: {
      mon: { subject: "7-A Science", room: "Room 17", topic: "Lab: candle flame zones experiment" },
      tue: { subject: "7-A Science", room: "Room 17", topic: "Ch. 4 Heat transfer — conduction in metals" },
      wed: { subject: "7-B Science", room: "Room 17", topic: "Ch. 4 Heat transfer — convection demo" },
      thu: { subject: "8-A Science", room: "Room 21", topic: "Ch. 5 Petroleum refining and petrochemicals" },
      fri: { isFree: true, subject: "Free Period", room: "", topic: "Office hours & lab equipment check" },
      sat: { subject: "8-B Science", room: "Room 21", topic: "Chapter recap and homework evaluation" },
    },
  },
  {
    period: "P3",
    time: "09:20 - 10:00",
    slots: {
      mon: { isFree: true, subject: "Free Period", room: "", topic: "Lesson plan documentation" },
      tue: {
        subject: "6-A English",
        room: "Room 14",
        isSubstitute: true,
        substituteTeacher: "Rachna Bose",
        topic: "Worksheet on Pronouns (available in Resources)",
      },
      wed: { subject: "8-B Science", room: "Room 21", topic: "Combustion Q&A and textbook exercise" },
      thu: { isFree: true, subject: "Free Period", room: "", topic: "Department curriculum meeting" },
      fri: { subject: "7-A Science", room: "Room 17", topic: "Worksheet evaluation & feedback" },
      sat: { isFree: true, subject: "Free Period", room: "", topic: "Weekly staff assembly review" },
    },
  },
  {
    period: "P4",
    time: "10:00 - 10:40",
    slots: {
      mon: { subject: "8-A Science", room: "Room 21", topic: "Fossil fuels formation and carbon content" },
      tue: { isFree: true, subject: "Free Period", room: "", topic: "Science exhibition project prep" },
      wed: { isFree: true, subject: "Free Period", room: "", topic: "Student doubt clearing session" },
      thu: { subject: "8-B Science", room: "Room 21", topic: "Fire extinguisher types and operation" },
      fri: { subject: "8-A Science", room: "Room 21", topic: "Half-yearly syllabus revision & sample paper" },
      sat: { subject: "7-B Science", room: "Room 17", topic: "Laboratory observation test" },
    },
  },
  {
    period: "LUNCH",
    time: "10:40 - 11:10",
    isLunch: true,
    slots: {},
  },
  {
    period: "P5",
    time: "11:10 - 11:50",
    slots: {
      mon: { subject: "7-B Science", room: "Room 17", topic: "Radiation experiments and thermometers" },
      tue: { subject: "8-A Science", room: "Room 21", topic: "Half-yearly paper discussion" },
      wed: { subject: "7-A Science", room: "Room 17", topic: "Sea breeze and land breeze convection" },
      thu: { subject: "7-A Science", room: "Room 17", topic: "Thermos flask construction & reflection" },
      fri: { subject: "7-B Science", room: "Room 17", topic: "Weekly assessment on Heat unit" },
      sat: { isFree: true, subject: "Free Period", room: "", topic: "Library book exchange" },
    },
  },
  {
    period: "P6",
    time: "11:50 - 12:30",
    slots: {
      mon: { isFree: true, subject: "Free Period", room: "", topic: "Grading term assignments" },
      tue: { subject: "7-B Science", room: "Room 17", topic: "Ch. 5 Coal and petroleum — revision" },
      wed: { subject: "8-A Science", room: "Room 21", topic: "Problem solving session" },
      thu: { isFree: true, subject: "Free Period", room: "", topic: "Teacher-parent phone check-ins" },
      fri: { isFree: true, subject: "Free Period", room: "", topic: "Lab inventory audit" },
      sat: { subject: "8-A Science", room: "Room 21", topic: "Science Olympiad prep quiz" },
    },
  },
  {
    period: "P7",
    time: "12:30 - 13:10",
    slots: {
      mon: { subject: "8-B Class Teacher", room: "Room 21", isClassTeacher: true, topic: "Attendance audit & diary check" },
      tue: { isFree: true, subject: "Free Period", room: "", topic: "Marks entry due tomorrow" },
      wed: { isFree: true, subject: "Free Period", room: "", topic: "Sports day house allocation" },
      thu: { subject: "7-B Science", room: "Room 17", topic: "Interactive Smart Board visual demo" },
      fri: { subject: "8-B Science", room: "Room 21", topic: "Weekly quiz & assignment review" },
      sat: { isFree: true, subject: "Free Period", room: "", topic: "Weekend planning" },
    },
  },
  {
    period: "P8",
    time: "13:10 - 13:50",
    slots: {
      mon: { isFree: true, subject: "Free Period", room: "", topic: "Co-curricular coordination" },
      tue: { isFree: true, subject: "Free Period", room: "", topic: "PTM preparation" },
      wed: { subject: "8-B Science", room: "Room 21", topic: "Remedial class for slow learners" },
      thu: { isFree: true, subject: "Free Period", room: "", topic: "Lesson plan submission" },
      fri: { isFree: true, subject: "Free Period", room: "", topic: "Faculty room meeting" },
      sat: { isFree: true, subject: "Free Period", room: "", topic: "Dispersal supervision" },
    },
  },
];

const CLASS_FILTER_OPTIONS = [
  { id: "all", label: "All Classes" },
  { id: "8-B", label: "8-B Science (My Class)" },
  { id: "7-A", label: "7-A Science" },
  { id: "7-B", label: "7-B Science" },
  { id: "8-A", label: "8-A Science" },
  { id: "6-A", label: "6-A English (Sub)" },
];

export default function RoutineTeacher() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<"grid" | "day">("grid");
  const [selectedDayKey, setSelectedDayKey] = useState<string>("tue"); // default today
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

  const handleDownloadPDF = () => {
    showToast("Generating timetable PDF...", "info");
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to check if slot matches filter
  const matchesFilter = (slot: TimetableSlot) => {
    if (selectedClassFilter === "all") return true;
    if (slot.isFree) return false;
    return slot.subject.toLowerCase().includes(selectedClassFilter.toLowerCase());
  };

  // Calculate day metrics for "Day Focus View"
  const currentDayInfo = DAYS.find((d) => d.key === selectedDayKey) || DAYS[1];
  const dayPeriods = PERIOD_ROWS.filter((r) => !r.isLunch).map((r) => {
    const slot = r.slots[selectedDayKey];
    return {
      period: r.period,
      time: r.time,
      ...slot,
    };
  });

  return (
    <div className="flex flex-col gap-4 w-full animate-fadeIn font-sans pb-12">
      {/* ================= HEADER SECTION (SINGLE LINE ON LAPTOP) ================= */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="text-xs sm:text-[13px] text-ink-secondary flex items-center gap-1.5 mb-0.5 truncate">
            <Link to="/teacher/dashboard" className="hover:text-primary transition-colors shrink-0">
              Teacher Panel
            </Link>
            <span>›</span>
            <span className="text-ink shrink-0">My Timetable</span>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              My Timetable
            </h1>
          </div>
          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Weekly teaching schedule, period allocations, and substitute duties · Academic Session 2026-27
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5"
          >
            <MdPrint size={15} className="text-primary" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MdDownload size={16} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* ================= 4 KPI SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Teaching Load */}
        <div className="px-4 py-1 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Weekly Load
            </span>
            <div className="w-8 h-8 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
              <MdAccessTime size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold text-ink">26 Periods</div>
            <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>86.7% capacity</span>
              <span className="text-primary font-semibold">Max 30 / week</span>
            </div>
          </div>
        </div>

        {/* Card 2: Today's Classes */}
        <div className="px-4 py-1 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Today's Classes
            </span>
            <div className="w-8 h-8 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MdCalendarToday size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold text-ink">5 Periods</div>
            <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>2 completed · 1 upcoming</span>
              <span className="text-emerald-700 font-semibold">Tuesday</span>
            </div>
          </div>
        </div>

        {/* Card 3: Free / Prep Periods */}
        <div className="px-4 py-1 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Planning & Free
            </span>
            <div className="w-8 h-8 rounded-control bg-blue-50 text-blue-700 flex items-center justify-center">
              <MdEventBusy size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold text-ink">6 Periods</div>
            <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>Lesson prep & grading</span>
              <span className="text-blue-700 font-semibold">1 free today</span>
            </div>
          </div>
        </div>

        {/* Card 4: Substitute Coverage */}
        <div className="px-4 py-1 rounded-card border border-line bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
              Substitute Duty
            </span>
            <div className="w-8 h-8 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center">
              <MdSwapHoriz size={18} />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold text-amber-700">1 Assigned</div>
            <div className="text-xs text-ink-secondary mt-0.5 flex items-center justify-between">
              <span>P3 (6-A English)</span>
              <span className="text-amber-700 font-semibold">For Rachna Bose</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTROL & FILTER TOOLBAR ================= */}
      <div className="p-3 bg-surface border border-line rounded-card shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: View Switcher (Grid vs Day) */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-surface-subtle border border-line-input rounded-control">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-primary text-white shadow-xs"
                  : "text-ink-secondary hover:text-ink hover:bg-surface"
              }`}
            >
              <MdCalendarToday size={14} />
              <span>Weekly Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "day"
                  ? "bg-primary text-white shadow-xs"
                  : "text-ink-secondary hover:text-ink hover:bg-surface"
              }`}
            >
              <MdAccessTime size={14} />
              <span>Day Focus View</span>
            </button>
          </div>

          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <MdFilterList size={16} className="text-ink-secondary shrink-0" />
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="h-9 px-3 rounded-control border border-line-input bg-surface text-xs font-semibold text-ink focus:border-primary focus:outline-none transition-colors"
            >
              {CLASS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Legend Indicators */}
        <div className="flex items-center gap-3 text-xs text-ink-secondary flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Regular Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>Class Teacher Duty</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Substitute</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Free / Prep</span>
          </div>
        </div>
      </div>

      {/* ================= VIEW 1: WEEKLY GRID VIEW ================= */}
      {viewMode === "grid" && (
        <section className="bg-surface border border-line rounded-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[100px_repeat(6,minmax(140px,1fr))] min-w-[940px]">
              
              {/* Header: Period Column */}
              <div className="p-3 bg-surface-head text-xs font-semibold text-ink-secondary border-b border-line flex items-center justify-center">
                Period / Time
              </div>

              {/* Header: Days Columns */}
              {DAYS.map((d) => (
                <div
                  key={d.key}
                  className={`p-3 text-center border-b border-l border-line transition-colors ${
                    d.isToday
                      ? "bg-primary text-white font-bold"
                      : "bg-surface-head text-ink"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-xs font-bold">{d.label}</span>
                    {d.isToday && (
                      <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-full bg-white text-primary">
                        Today
                      </span>
                    )}
                  </div>
                  <div className={`text-[11px] font-medium ${d.isToday ? "text-white/80" : "text-ink-secondary"}`}>
                    {d.date}
                  </div>
                </div>
              ))}

              {/* Grid Rows */}
              {PERIOD_ROWS.map((row) => {
                // Lunch Break Full Width Row
                if (row.isLunch) {
                  return (
                    <div
                      key={row.period}
                      className="col-span-7 py-2.5 px-4 bg-amber-50/70 border-t border-b border-amber-200/80 text-center flex items-center justify-center gap-2 select-none"
                    >
                      <span className="text-sm">🍴</span>
                      <span className="text-xs font-bold text-amber-900 tracking-wide">
                        Recess & Lunch Break (10:40 AM - 11:10 AM)
                      </span>
                      <span className="text-[11px] font-medium text-amber-700/90">
                        · 30 mins interval
                      </span>
                    </div>
                  );
                }

                return (
                  <React.Fragment key={row.period}>
                    {/* Period Label Column */}
                    <div className="p-3 border-t border-line flex flex-col justify-center items-center bg-surface-head/40 text-center">
                      <span className="text-xs font-bold text-ink bg-surface border border-line px-2 py-0.5 rounded-control shadow-2xs">
                        {row.period}
                      </span>
                      <span className="font-mono text-[11px] text-ink-secondary mt-1">
                        {row.time.split(" - ")[0]}
                      </span>
                      <span className="font-mono text-[10px] text-ink-secondary/70">
                        {row.time.split(" - ")[1]}
                      </span>
                    </div>

                    {/* Day Slot Cells */}
                    {DAYS.map((d) => {
                      const slot = row.slots[d.key];
                      const isTodayCol = d.isToday;
                      const isMatch = matchesFilter(slot);

                      return (
                        <div
                          key={d.key}
                          className={`p-2 border-t border-l border-line transition-all ${
                            isTodayCol ? "bg-primary/5" : "bg-surface"
                          } ${!isMatch ? "opacity-35" : "opacity-100"}`}
                        >
                          {slot.isFree ? (
                            // Free Period Box
                            <div
                              onClick={() =>
                                setSelectedSlot({
                                  ...slot,
                                  periodName: row.period,
                                  timeSlot: row.time,
                                  dayName: `${d.label} (${d.date})`,
                                })
                              }
                              className="min-h-[58px] rounded-control p-2 border border-dashed border-line-input bg-transparent hover:bg-surface-subtle flex flex-col justify-center items-center select-none transition-colors cursor-pointer group"
                            >
                              <span className="text-xs font-medium text-ink-secondary/60 group-hover:text-ink-secondary">
                                Free Period
                              </span>
                              <span className="text-[10px] text-ink-secondary/50">
                                Planning & Prep
                              </span>
                            </div>
                          ) : slot.isSubstitute ? (
                            // Substitute Period Box
                            <div
                              onClick={() =>
                                setSelectedSlot({
                                  ...slot,
                                  periodName: row.period,
                                  timeSlot: row.time,
                                  dayName: `${d.label} (${d.date})`,
                                })
                              }
                              className="min-h-[58px] rounded-control p-2.5 bg-amber-50 border-2 border-amber-400 hover:bg-amber-100/90 hover:shadow-xs flex flex-col justify-center gap-0.5 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-amber-950 truncate">
                                  {slot.subject}
                                </span>
                                <span className="text-[9px] font-extrabold px-1 rounded-full bg-amber-200 text-amber-900 leading-tight">
                                  SUB
                                </span>
                              </div>
                              <span className="text-[10px] text-amber-800 font-medium truncate">
                                For {slot.substituteTeacher}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-amber-900/80 mt-0.5">
                                <MdRoom size={11} className="shrink-0" />
                                <span className="truncate">{slot.room}</span>
                              </div>
                            </div>
                          ) : slot.isClassTeacher ? (
                            // Class Teacher Period Box
                            <div
                              onClick={() =>
                                setSelectedSlot({
                                  ...slot,
                                  periodName: row.period,
                                  timeSlot: row.time,
                                  dayName: `${d.label} (${d.date})`,
                                })
                              }
                              className="min-h-[58px] rounded-control p-2.5 bg-primary-tint/70 border border-primary/40 hover:bg-primary-tint hover:shadow-xs flex flex-col justify-center gap-0.5 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-primary-dark truncate">
                                  {slot.subject}
                                </span>
                                <span className="text-[9px] font-bold px-1 rounded-full bg-primary text-white leading-tight">
                                  CT
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-primary-dark/80 mt-0.5">
                                <MdRoom size={11} className="shrink-0" />
                                <span className="truncate">{slot.room}</span>
                              </div>
                            </div>
                          ) : (
                            // Regular Subject Period Box
                            <div
                              onClick={() =>
                                setSelectedSlot({
                                  ...slot,
                                  periodName: row.period,
                                  timeSlot: row.time,
                                  dayName: `${d.label} (${d.date})`,
                                })
                              }
                              className="min-h-[58px] rounded-control p-2.5 bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100/70 hover:shadow-xs flex flex-col justify-center gap-0.5 cursor-pointer transition-all group"
                            >
                              <span className="text-xs font-bold text-emerald-950 truncate group-hover:text-primary transition-colors">
                                {slot.subject}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-emerald-800 mt-0.5">
                                <MdRoom size={11} className="shrink-0 text-emerald-600" />
                                <span className="truncate font-medium">{slot.room}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= VIEW 2: DAY FOCUS VIEW ================= */}
      {viewMode === "day" && (
        <div className="space-y-4">
          {/* Day Selection Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {DAYS.map((d) => {
              const isSelected = selectedDayKey === d.key;
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDayKey(d.key)}
                  className={`min-w-[130px] p-3 rounded-card border transition-all text-left cursor-pointer flex flex-col ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface border-line text-ink hover:bg-surface-subtle"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{d.label}</span>
                    {d.isToday && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                          isSelected ? "bg-white text-primary" : "bg-primary-tint text-primary-dark"
                        }`}
                      >
                        Today
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] mt-0.5 ${isSelected ? "text-white/80" : "text-ink-secondary"}`}>
                    {d.date}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timeline List for Selected Day */}
          <div className="bg-surface border border-line rounded-card p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <h3 className="text-sm font-bold text-ink">
                  Schedule for {currentDayInfo.label}, {currentDayInfo.date}
                </h3>
                <p className="text-xs text-ink-secondary">
                  8 scheduled periods · including 1 recess break
                </p>
              </div>
              {currentDayInfo.isToday && (
                <span className="text-xs font-bold text-primary bg-primary-tint px-3 py-1 rounded-full border border-primary/20">
                  Current Active Day
                </span>
              )}
            </div>

            <div className="space-y-2.5 pt-1">
              {dayPeriods.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedSlot({
                      subject: item.subject,
                      room: item.room,
                      isFree: item.isFree,
                      isSubstitute: item.isSubstitute,
                      substituteTeacher: item.substituteTeacher,
                      isClassTeacher: item.isClassTeacher,
                      topic: item.topic,
                      periodName: item.period,
                      timeSlot: item.time,
                      dayName: `${currentDayInfo.label} (${currentDayInfo.date})`,
                    })
                  }
                  className={`p-3.5 rounded-card border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer group ${
                    item.isSubstitute
                      ? "bg-amber-50/70 border-amber-300 hover:bg-amber-100/70"
                      : item.isClassTeacher
                      ? "bg-primary-tint/40 border-primary/30 hover:bg-primary-tint/70"
                      : item.isFree
                      ? "bg-surface-subtle border-dashed border-line-input hover:bg-surface-head"
                      : "bg-surface border-line hover:border-primary/40 hover:shadow-xs"
                  }`}
                >
                  {/* Left: Period & Time */}
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <span className="w-9 h-9 rounded-control bg-surface border border-line flex items-center justify-center text-xs font-bold text-ink shadow-2xs shrink-0">
                      {item.period}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-semibold text-ink">{item.time}</span>
                      <span className="text-[11px] text-ink-secondary">40 Minutes</span>
                    </div>
                  </div>

                  {/* Middle: Subject & Topic */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ink group-hover:text-primary transition-colors">
                        {item.subject}
                      </span>
                      {item.isSubstitute && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                          Substitute · For {item.substituteTeacher}
                        </span>
                      )}
                      {item.isClassTeacher && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">
                          Class Teacher Period
                        </span>
                      )}
                    </div>
                    {item.topic && (
                      <p className="text-xs text-ink-secondary mt-0.5 truncate">
                        {item.topic}
                      </p>
                    )}
                  </div>

                  {/* Right: Room & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    {item.room ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-ink-secondary bg-surface-subtle px-2.5 py-1 rounded-control border border-line">
                        <MdRoom size={13} className="text-primary" />
                        <span>{item.room}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-ink-secondary font-medium">
                        Planning / Free
                      </span>
                    )}
                    <span className="text-ink-secondary group-hover:text-primary group-hover:translate-x-1 transition-all font-bold text-sm">
                      ›
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PERIOD DETAILS ================= */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card max-w-lg w-full shadow-2xl overflow-hidden flex flex-col font-sans">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-line bg-surface-head flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-control bg-primary text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  {selectedSlot.periodName || "Slot"}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink leading-tight">
                    {selectedSlot.subject}
                  </h3>
                  <span className="text-xs text-ink-secondary">
                    {selectedSlot.dayName} · {selectedSlot.timeSlot}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="p-1 rounded-control text-ink-secondary hover:text-ink hover:bg-surface transition-colors cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Substitute Banner if applicable */}
              {selectedSlot.isSubstitute && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-card flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    !
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      Substitute Duty: Covering for {selectedSlot.substituteTeacher}
                    </h4>
                    <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                      Please take attendance for Grade 6-A. The class worksheet on Pronouns has been uploaded to the student resources portal.
                    </p>
                  </div>
                </div>
              )}

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-subtle border border-line rounded-card">
                <div>
                  <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block">
                    Classroom / Venue
                  </span>
                  <span className="text-xs font-bold text-ink mt-0.5 block">
                    {selectedSlot.room || "Faculty Room (Free / Prep)"}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block">
                    Teaching Role
                  </span>
                  <span className="text-xs font-bold text-ink mt-0.5 block">
                    {selectedSlot.isSubstitute
                      ? "Substitute Teacher"
                      : selectedSlot.isClassTeacher
                      ? "Class Teacher (8-B)"
                      : selectedSlot.isFree
                      ? "Planning & Office Hours"
                      : "Subject Teacher"}
                  </span>
                </div>

                <div className="col-span-2 pt-2 border-t border-line">
                  <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block">
                    Lesson Topic / Objective
                  </span>
                  <span className="text-xs font-medium text-ink mt-0.5 block leading-relaxed">
                    {selectedSlot.topic || "Regular curriculum lesson and student practice."}
                  </span>
                </div>
              </div>

              {/* Quick Actions if active class */}
              {!selectedSlot.isFree && (
                <div>
                  <span className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider block mb-2">
                    Quick Actions For This Class
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlot(null);
                        navigate("/teacher/attendance");
                      }}
                      className="p-2.5 rounded-control border border-line bg-surface hover:bg-surface-subtle text-xs font-semibold text-ink flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <MdFactCheck size={16} className="text-primary" />
                      <span>Attendance</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlot(null);
                        navigate("/teacher/homework");
                      }}
                      className="p-2.5 rounded-control border border-line bg-surface hover:bg-surface-subtle text-xs font-semibold text-ink flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <MdMenuBook size={16} className="text-emerald-600" />
                      <span>Homework</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlot(null);
                        navigate("/teacher/students");
                      }}
                      className="p-2.5 rounded-control border border-line bg-surface hover:bg-surface-subtle text-xs font-semibold text-ink flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <MdGroups size={16} className="text-blue-600" />
                      <span>Class Roster</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-line bg-surface-subtle flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-1.5 rounded-control bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
