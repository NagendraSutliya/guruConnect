import React, { useState, useMemo } from "react";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiCheckCircle
} from "react-icons/fi";

export interface SchoolEvent {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  type: "holiday" | "event" | "exam" | "meeting";
  description?: string;
  time?: string;
  venue?: string;
}

// Generate relative date string YYYY-MM-DD
const getDateWithOffset = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DEFAULT_EVENTS: SchoolEvent[] = [
  {
    id: "ev-1",
    title: "Special Science Lab Workshop",
    date: getDateWithOffset(0), // Today
    type: "event",
    time: "10:30 AM - 12:00 PM",
    venue: "Physics & Chemistry Lab 2",
    description: "Hands-on demonstration session for Grade 7 & 8 students.",
  },
  {
    id: "ev-2",
    title: "Inter-House Sports Meet",
    date: getDateWithOffset(3),
    type: "event",
    time: "08:30 AM - 02:00 PM",
    venue: "Main Athletic Grounds",
    description: "Track & field heats, relay race, and tug of war.",
  },
  {
    id: "ev-3",
    title: "Regional Festival Holiday",
    date: getDateWithOffset(6),
    type: "holiday",
    time: "All Day",
    description: "School closed for all students, faculty, and administrative staff.",
  },
  {
    id: "ev-4",
    title: "Parent-Teacher Meeting (PTM)",
    date: getDateWithOffset(10),
    type: "meeting",
    time: "09:00 AM - 01:00 PM",
    venue: "Respective Classrooms",
    description: "Discussion on Term 1 progress, attendance, and quarterly assessments.",
  },
  {
    id: "ev-5",
    title: "Half-Yearly Examinations Begin",
    date: getDateWithOffset(15),
    type: "exam",
    time: "08:30 AM - 11:30 AM",
    venue: "Examination Halls A & B",
    description: "Written examination for Grades 6 through 10. Admit cards mandatory.",
  },
  {
    id: "ev-6",
    title: "National Science Olympiad",
    date: getDateWithOffset(22),
    type: "exam",
    time: "10:00 AM - 12:00 PM",
    venue: "Auditorium",
    description: "Registered students to report by 9:30 AM sharp.",
  },
  {
    id: "ev-7",
    title: "Staff Academic Review Meeting",
    date: getDateWithOffset(28),
    type: "meeting",
    time: "02:30 PM - 04:00 PM",
    venue: "Conference Hall",
    description: "Syllabus tracking and upcoming board exam preparation strategy.",
  },
];

const TYPE_CONFIG = {
  holiday: {
    label: "Holiday",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
    dotClass: "bg-amber-500",
    borderLeftClass: "border-l-amber-500",
  },
  event: {
    label: "Event",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dotClass: "bg-emerald-500",
    borderLeftClass: "border-l-emerald-500",
  },
  exam: {
    label: "Exam",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200/80",
    dotClass: "bg-purple-500",
    borderLeftClass: "border-l-purple-500",
  },
  meeting: {
    label: "Meeting",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80",
    dotClass: "bg-blue-500",
    borderLeftClass: "border-l-blue-500",
  },
};

const TeacherEventCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>("all");
  const [events] = useState<SchoolEvent[]>(DEFAULT_EVENTS);

  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(todayStr);
  };

  // Month metadata
  const monthName = currentDate.toLocaleString("en-US", { month: "long" });
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Map events to date strings for quick lookup
  const eventsByDate = useMemo(() => {
    const map: Record<string, SchoolEvent[]> = {};
    events.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  // Filtered upcoming events list
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Date filter
      if (selectedDate && ev.date !== selectedDate) return false;
      // Type filter
      if (activeTypeFilter !== "all" && ev.type !== activeTypeFilter) return false;
      return true;
    });
  }, [events, selectedDate, activeTypeFilter]);

  // Days array for calendar grid
  const days = useMemo(() => {
    const arr: { dayNum: number; dateStr: string; isCurrentMonth: boolean }[] = [];
    
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfWeek; i++) {
      arr.push({ dayNum: 0, dateStr: "", isCurrentMonth: false });
    }
    
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const monthPadded = String(currentMonth + 1).padStart(2, "0");
      const dayPadded = String(i).padStart(2, "0");
      const dateStr = `${currentYear}-${monthPadded}-${dayPadded}`;
      arr.push({ dayNum: i, dateStr, isCurrentMonth: true });
    }
    
    return arr;
  }, [currentYear, currentMonth, firstDayOfWeek, daysInMonth]);

  const weekHeaders = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="bg-surface border border-line rounded-card overflow-hidden shadow-xs flex flex-col font-sans">
      
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-line flex items-center justify-between gap-3 bg-surface-head">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center shrink-0">
            <FiCalendar size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink leading-tight">School Calendar</h3>
            <p className="text-[11px] text-ink-secondary leading-none mt-0.5">Events, exams & holidays</p>
          </div>
        </div>

        {/* Month selector navigation */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToday}
            className="px-2 py-1 text-[11px] font-semibold text-ink-secondary hover:text-ink hover:bg-surface rounded-control border border-line transition-colors cursor-pointer"
            title="Jump to today"
          >
            Today
          </button>
          <div className="flex items-center bg-surface border border-line rounded-control p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-ink-secondary hover:text-ink hover:bg-surface-subtle rounded-control transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <FiChevronLeft size={15} />
            </button>
            <span className="text-xs font-semibold text-ink px-2 min-w-[95px] text-center select-none">
              {monthName.slice(0, 3)} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-ink-secondary hover:text-ink hover:bg-surface-subtle rounded-control transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <FiChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Mini Calendar Grid */}
      <div className="p-4 border-b border-line bg-surface">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
          {weekHeaders.map((w, idx) => (
            <span 
              key={idx} 
              className={`text-[11px] font-bold ${idx === 0 || idx === 6 ? "text-amber-600/80" : "text-ink-secondary"}`}
            >
              {w}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((item, idx) => {
            if (!item.isCurrentMonth) {
              return <div key={idx} className="h-8" />;
            }

            const isToday = item.dateStr === todayStr;
            const isSelected = selectedDate === item.dateStr;
            const dayEvents = eventsByDate[item.dateStr] || [];
            const hasEvents = dayEvents.length > 0;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (selectedDate === item.dateStr) {
                    setSelectedDate(null); // Toggle off
                  } else {
                    setSelectedDate(item.dateStr);
                  }
                }}
                className={`h-8 w-full rounded-control flex flex-col items-center justify-center relative transition-all cursor-pointer select-none text-xs ${
                  isSelected
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : isToday
                    ? "bg-primary-tint text-primary-dark font-bold border border-primary/30"
                    : "text-ink hover:bg-surface-subtle"
                }`}
                title={
                  hasEvents
                    ? `${item.dayNum} ${monthName}: ${dayEvents.map((e) => e.title).join(", ")}`
                    : undefined
                }
              >
                <span>{item.dayNum}</span>
                
                {/* Event Dots */}
                {hasEvents && (
                  <div className="flex items-center gap-0.5 absolute bottom-1">
                    {dayEvents.slice(0, 3).map((e, dotIdx) => {
                      const dotBg = isSelected
                        ? "bg-white"
                        : TYPE_CONFIG[e.type]?.dotClass || "bg-primary";
                      return (
                        <span
                          key={dotIdx}
                          className={`w-1 h-1 rounded-full ${dotBg}`}
                        />
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-line text-[11px] text-ink-secondary flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Event
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Holiday
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Exam
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Meeting
            </span>
          </div>

          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Events List Section */}
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">
              {selectedDate ? (
                <>
                  Events on {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </>
              ) : (
                "Upcoming Schedule"
              )}
            </h4>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-surface-subtle text-ink-secondary border border-line">
              {filteredEvents.length}
            </span>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1">
            {(["all", "event", "holiday", "exam"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTypeFilter(t)}
                className={`px-2 py-0.5 rounded-control text-[11px] font-medium transition-colors capitalize cursor-pointer ${
                  activeTypeFilter === t
                    ? "bg-primary text-white font-semibold"
                    : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-0.5">
          {filteredEvents.length === 0 ? (
            <div className="py-6 text-center text-ink-secondary text-xs flex flex-col items-center justify-center gap-1">
              <FiCheckCircle size={20} className="text-slate-300" />
              <span>No events scheduled for this selection.</span>
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-primary font-semibold text-xs mt-1 hover:underline"
                >
                  View all upcoming events
                </button>
              )}
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.event;
              const evDate = new Date(ev.date + "T00:00:00");
              const dayStr = evDate.toLocaleDateString("en-IN", { day: "numeric" });
              const monthStr = evDate.toLocaleDateString("en-IN", { month: "short" });
              const isToday = ev.date === todayStr;

              return (
                <div
                  key={ev.id}
                  className={`p-3 rounded-card border border-line bg-surface hover:bg-surface-subtle transition-all flex items-start gap-3 border-l-4 ${cfg.borderLeftClass} group`}
                >
                  {/* Date badge */}
                  <div className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 rounded-control bg-surface-head border border-line shrink-0">
                    <span className="text-[10px] font-bold text-ink-secondary uppercase leading-none">
                      {monthStr}
                    </span>
                    <span className="text-base font-bold text-ink leading-tight">
                      {dayStr}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-ink group-hover:text-primary transition-colors line-clamp-1">
                        {ev.title}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white leading-none">
                          Today
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${cfg.badgeClass} leading-none ml-auto shrink-0`}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {ev.description && (
                      <p className="text-[11px] text-ink-secondary mt-1 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>
                    )}

                    {/* Metadata chips */}
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-ink-secondary flex-wrap">
                      {ev.time && (
                        <span className="flex items-center gap-1">
                          <FiClock size={12} className="text-slate-400" />
                          <span>{ev.time}</span>
                        </span>
                      )}
                      {ev.venue && (
                        <span className="flex items-center gap-1">
                          <FiMapPin size={12} className="text-slate-400" />
                          <span className="truncate max-w-[150px]">{ev.venue}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherEventCalendar;
