import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Period {
  time: string;
  name: string;
  topic: string;
  status: "Done" | "Next" | "Substitute" | "Later" | "Free";
  substituteFor?: string;
}

const DEFAULT_PERIODS: Period[] = [
  { time: "08:00", name: "8-B Science", topic: "Ch. 6 Combustion — types of combustion", status: "Done" },
  { time: "08:40", name: "7-A Science", topic: "Lab: candle flame zones", status: "Next" },
  { time: "10:00", name: "6-A English · substitute", topic: "For Rachna Bose · worksheet in resources", status: "Substitute", substituteFor: "Rachna Bose" },
  { time: "11:10", name: "8-A Science", topic: "Half-yearly paper discussion", status: "Later" },
  { time: "11:50", name: "7-B Science", topic: "Ch. 5 Coal and petroleum — revision", status: "Later" },
  { time: "12:30", name: "Free period", topic: "Marks entry due tomorrow", status: "Free" },
];

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [attendanceDone] = useState(false);
  const [periods] = useState<Period[]>(DEFAULT_PERIODS);

  const todayDateString = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const teacherFirstName = user?.name ? user.name.split(" ")[0] : "Sunita";

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

          {/* My Periods Today */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-line-row">
              <h2 className="m-0 text-h2 font-semibold text-ink">My periods today</h2>
              <span className="text-small text-ink-secondary">{periods.length} periods</span>
            </div>

            <div className="divide-y divide-line-row">
              {periods.map((p, idx) => (
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
          </section>
        </div>

        {/* Right Column (span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* To Do Section */}
          <section className="bg-surface border border-line rounded-card p-5 flex flex-col gap-1">
            <h2 className="m-0 text-h2 font-semibold text-ink pb-2 border-b border-line-row">
              To do
            </h2>

            <div className="divide-y divide-line-row">
              <Link
                to="/teacher/results"
                className="flex justify-between items-center gap-3 py-3 text-ink hover:text-primary transition-colors group"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-body font-medium group-hover:underline">
                    Half-Yearly Science 8-B marks
                  </span>
                  <span className="text-micro text-warning-inline">
                    Due tomorrow 5 pm · 1 error to fix
                  </span>
                </div>
                <span className="text-ink-secondary group-hover:text-primary font-medium">›</span>
              </Link>

              <Link
                to="/teacher/results"
                className="flex justify-between items-center gap-3 py-3 text-ink hover:text-primary transition-colors group"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-body font-medium group-hover:underline">
                    Term 1 remarks · 8-B
                  </span>
                  <span className="text-micro text-ink-secondary">26 of 38 done · due 16 Oct</span>
                </div>
                <span className="text-ink-secondary group-hover:text-primary font-medium">›</span>
              </Link>

              <Link
                to="/teacher/homework"
                className="flex justify-between items-center gap-3 py-3 text-ink hover:text-primary transition-colors group"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-body font-medium group-hover:underline">
                    Check homework · 7-A
                  </span>
                  <span className="text-micro text-ink-secondary">34 of 40 submitted</span>
                </div>
                <span className="text-ink-secondary group-hover:text-primary font-medium">›</span>
              </Link>

              <Link
                to="/teacher/students"
                className="flex justify-between items-center gap-3 py-3 text-ink hover:text-primary transition-colors group"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-body font-medium group-hover:underline">
                    Leave request · Isha Kanwar (8-B)
                  </span>
                  <span className="text-micro text-ink-secondary">14–15 Oct · fever</span>
                </div>
                <span className="text-ink-secondary group-hover:text-primary font-medium">›</span>
              </Link>

              <Link
                to="/teacher/messages"
                className="flex justify-between items-center gap-3 py-3 text-ink hover:text-primary transition-colors group"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-body font-medium group-hover:underline">
                    3 unread parent messages
                  </span>
                  <span className="text-micro text-ink-secondary">Oldest 5 h ago</span>
                </div>
                <span className="text-ink-secondary group-hover:text-primary font-medium">›</span>
              </Link>
            </div>
          </section>

          {/* Quick Actions 3-Button Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <Link
              to="/teacher/homework"
              className="min-h-[56px] px-3.5 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-body flex items-center justify-center text-center transition-colors shadow-2xs"
            >
              Post homework
            </Link>
            <Link
              to="/teacher/results"
              className="min-h-[56px] px-3.5 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-body flex items-center justify-center text-center transition-colors shadow-2xs"
            >
              Enter marks
            </Link>
            <Link
              to="/teacher/messages"
              className="min-h-[56px] px-3.5 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-medium text-body flex items-center justify-center text-center transition-colors shadow-2xs"
            >
              Messages · 3
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
