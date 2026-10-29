import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TeacherEventCalendar from "../../components/teacher/TeacherEventCalendar";
import { 
  MdMenuBook, 
  MdGrade, 
  MdChatBubbleOutline 
} from "react-icons/md";

interface Period {
  time: string;
  name: string;
  topic: string;
  status: "Done" | "Next" | "Substitute" | "Later" | "Free";
  substituteFor?: string;
}

interface TodoItem {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  urgent?: boolean;
}

const DEFAULT_PERIODS: Period[] = [
  { time: "08:00", name: "8-B Science", topic: "Ch. 6 Combustion — types of combustion", status: "Done" },
  { time: "08:40", name: "7-A Science", topic: "Lab: candle flame zones", status: "Next" },
  { time: "10:00", name: "6-A English · substitute", topic: "For Rachna Bose · worksheet in resources", status: "Substitute", substituteFor: "Rachna Bose" },
  { time: "11:10", name: "8-A Science", topic: "Half-yearly paper discussion", status: "Later" },
  { time: "11:50", name: "7-B Science", topic: "Ch. 5 Coal and petroleum — revision", status: "Later" },
  { time: "12:30", name: "Free period", topic: "Marks entry due tomorrow", status: "Free" },
];

const DEFAULT_TODO_ITEMS: TodoItem[] = [
  {
    id: "td-1",
    title: "Half-Yearly Science 8-B marks",
    subtitle: "Due tomorrow 5 pm · 1 error to fix",
    path: "/teacher/results",
    urgent: true,
  },
  {
    id: "td-2",
    title: "Term 1 remarks · 8-B",
    subtitle: "26 of 38 done · due 16 Oct",
    path: "/teacher/results",
    urgent: false,
  },
  {
    id: "td-3",
    title: "Check homework · 7-A",
    subtitle: "34 of 40 submitted",
    path: "/teacher/homework",
    urgent: false,
  },
  {
    id: "td-4",
    title: "Leave request · Isha Kanwar (8-B)",
    subtitle: "14–15 Oct · fever",
    path: "/teacher/students",
    urgent: false,
  },
  {
    id: "td-5",
    title: "3 unread parent messages",
    subtitle: "Oldest 5 h ago",
    path: "/teacher/messages",
    urgent: false,
  },
];

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [attendanceDone] = useState(false);
  const [periods] = useState<Period[]>(DEFAULT_PERIODS);
  const [showAllPeriods, setShowAllPeriods] = useState(false);
  
  const [todoItems] = useState<TodoItem[]>(DEFAULT_TODO_ITEMS);
  const [showAllTodo, setShowAllTodo] = useState(false);

  const todayDateString = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const teacherFirstName = user?.name ? user.name.split(" ")[0] : "Sunita";
  const visiblePeriods = showAllPeriods ? periods : periods.slice(0, 2);
  const visibleTodo = showAllTodo ? todoItems : todoItems.slice(0, 2);

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn font-sans">
      {/* Greeting Header */}
      <div className="flex flex-col gap-1">
        <span className="text-small text-ink-secondary">{todayDateString}</span>
        <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
          Good morning, {teacherFirstName}
        </h1>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Class Teacher Attendance Card */}
          {!attendanceDone ? (
            <Link
              to="/teacher/attendance"
              className="bg-primary text-white rounded-card-m p-5 flex justify-between items-center gap-3 hover:bg-primary-dark transition-all group shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="text-small text-primary-soft font-medium">Class teacher · 8-B</span>
                <span className="text-[19px] font-semibold tracking-tight leading-snug">
                  Mark today's attendance
                </span>
                <span className="text-small text-primary-soft">
                  Due by 10:00 am · 38 students · 1 approved leave already filled
                </span>
              </div>
              <span className="text-2xl font-light text-white group-hover:translate-x-1 transition-transform">
                ›
              </span>
            </Link>
          ) : (
            <div className="bg-success-bg border border-success-text/20 text-success-text rounded-card-m p-5 flex justify-between items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-small font-semibold">Class teacher · 8-B</span>
                <span className="text-h2 font-semibold">
                  Today's attendance submitted at 8:52 am
                </span>
                <span className="text-small opacity-90">
                  36 Present · 1 Absent · 1 On leave · 94.7%
                </span>
              </div>
              <Link
                to="/teacher/attendance"
                className="text-small font-semibold underline hover:opacity-80"
              >
                Review
              </Link>
            </div>
          )}

          {/* My Periods Today (Shows 2 initially + '>' toggle) */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-line-row">
              <div className="flex items-center gap-2">
                <h2 className="m-0 text-h2 font-semibold text-ink">My periods today</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-subtle text-ink-secondary border border-line">
                  {periods.length} periods
                </span>
              </div>
              <Link
                to="/teacher/routine"
                className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-0.5 transition-colors group"
              >
                <span>Full timetable</span>
                <span className="text-sm font-bold group-hover:translate-x-0.5 transition-transform">›</span>
              </Link>
            </div>

            <div className="divide-y divide-line-row">
              {visiblePeriods.map((p, idx) => (
                <div key={idx} className="grid grid-cols-[56px_1fr_auto] gap-3 items-center py-2.5">
                  <span className="font-mono text-small text-ink-secondary">{p.time}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-body font-semibold text-ink truncate">{p.name}</span>
                    <span
                      className={`text-micro truncate ${
                        p.status === "Substitute" ? "text-warning-inline font-medium" : "text-ink-secondary"
                      }`}
                    >
                      {p.topic}
                    </span>
                  </div>
                  <div>
                    {p.status === "Done" && (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-success-bg text-success-text">
                        Done
                      </span>
                    )}
                    {p.status === "Next" && (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-primary-tint text-primary-dark">
                        Next
                      </span>
                    )}
                    {p.status === "Substitute" && (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-warning-bg text-warning-text">
                        Substitute
                      </span>
                    )}
                    {p.status === "Later" && (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-surface-head text-ink-secondary">
                        Later
                      </span>
                    )}
                    {p.status === "Free" && (
                      <span className="inline-block text-caption font-semibold px-2.5 py-1 rounded-full bg-surface-head text-ink-secondary">
                        Free
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Remaining periods toggle button */}
            {periods.length > 2 && (
              <div className="pt-2 border-t border-line-row">
                <button
                  type="button"
                  onClick={() => setShowAllPeriods(!showAllPeriods)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-control bg-surface-subtle hover:bg-surface-head text-xs font-semibold text-primary transition-colors cursor-pointer group select-none"
                >
                  <span className="flex items-center gap-2">
                    <span>
                      {showAllPeriods
                        ? "Show fewer periods"
                        : `View remaining ${periods.length - 2} periods`}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">
                      {periods.length} total
                    </span>
                  </span>
                  <span className="text-base font-bold group-hover:translate-x-1 transition-transform">
                    {showAllPeriods ? "‹" : "›"}
                  </span>
                </button>
              </div>
            )}
          </section>

          {/* To Do Section (Shows 2 initially + '>' toggle) */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-2">
            <div className="flex justify-between items-center pb-2 border-b border-line-row">
              <div className="flex items-center gap-2">
                <h2 className="m-0 text-h2 font-semibold text-ink">To do</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-subtle text-ink-secondary border border-line">
                  {todoItems.length} items
                </span>
              </div>
            </div>

            <div className="divide-y divide-line-row">
              {visibleTodo.map((td) => (
                <Link
                  key={td.id}
                  to={td.path}
                  className="flex justify-between items-center gap-3 py-3 text-ink hover:text-primary transition-colors group"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-body font-medium group-hover:underline">
                      {td.title}
                    </span>
                    <span className={`text-micro ${td.urgent ? "text-warning-inline font-medium" : "text-ink-secondary"}`}>
                      {td.subtitle}
                    </span>
                  </div>
                  <span className="text-ink-secondary group-hover:text-primary group-hover:translate-x-1 font-medium transition-transform">
                    ›
                  </span>
                </Link>
              ))}
            </div>

            {/* Remaining To-Do toggle button */}
            {todoItems.length > 2 && (
              <div className="pt-2 border-t border-line-row">
                <button
                  type="button"
                  onClick={() => setShowAllTodo(!showAllTodo)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-control bg-surface-subtle hover:bg-surface-head text-xs font-semibold text-primary transition-colors cursor-pointer group select-none"
                >
                  <span className="flex items-center gap-2">
                    <span>
                      {showAllTodo
                        ? "Show fewer items"
                        : `View remaining ${todoItems.length - 2} to-dos`}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">
                      {todoItems.length} total
                    </span>
                  </span>
                  <span className="text-base font-bold group-hover:translate-x-1 transition-transform">
                    {showAllTodo ? "‹" : "›"}
                  </span>
                </button>
              </div>
            )}
          </section>

          {/* Quick Actions Interactive Grid (Below To Do) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Post Homework */}
            <Link
              to="/teacher/homework"
              className="group p-4 rounded-card border border-line bg-surface hover:bg-surface-subtle hover:border-primary/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between gap-3 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-control bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MdMenuBook size={20} />
                </div>
                <span className="text-ink-secondary group-hover:text-primary group-hover:translate-x-1 transition-all text-sm font-semibold">
                  ›
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-body font-semibold text-ink group-hover:text-primary transition-colors">
                  Post homework
                </span>
                <span className="text-caption text-ink-secondary mt-0.5">
                  Share assignments & notes
                </span>
              </div>
            </Link>

            {/* Enter Marks */}
            <Link
              to="/teacher/results"
              className="group p-4 rounded-card border border-line bg-surface hover:bg-surface-subtle hover:border-primary/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between gap-3 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-control bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MdGrade size={20} />
                </div>
                <span className="text-ink-secondary group-hover:text-primary group-hover:translate-x-1 transition-all text-sm font-semibold">
                  ›
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-body font-semibold text-ink group-hover:text-primary transition-colors">
                  Enter marks
                </span>
                <span className="text-caption text-ink-secondary mt-0.5">
                  Record test & exam rubrics
                </span>
              </div>
            </Link>

            {/* Messages */}
            <Link
              to="/teacher/messages"
              className="group p-4 rounded-card border border-line bg-surface hover:bg-surface-subtle hover:border-primary/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between gap-3 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-control bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MdChatBubbleOutline size={20} />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                  3 unread
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-body font-semibold text-ink group-hover:text-primary transition-colors">
                    Messages
                  </span>
                  <span className="text-ink-secondary group-hover:text-primary group-hover:translate-x-1 transition-all text-sm font-semibold">
                    ›
                  </span>
                </div>
                <span className="text-caption text-ink-secondary mt-0.5">
                  Parent & faculty chat
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column (span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* School Event Calendar Widget */}
          <TeacherEventCalendar />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
