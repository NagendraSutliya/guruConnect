import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { FiClock, FiCalendar, FiDownload, FiFileText, FiAward, FiAlertCircle } from "react-icons/fi";

const StudentTimetable: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"today" | "exams">("today");

  const todayPeriods = [
    { period: "P1", time: "08:00 – 08:40", subject: "Science", teacher: "Sunita Rathore", room: "Room 21", status: "Done" },
    { period: "P2", time: "08:40 – 09:20", subject: "Maths", teacher: "Ravi Kumar", room: "Room 21", status: "Done" },
    { period: "P3", time: "10:00 – 10:40", subject: "English", teacher: "Meenakshi Rao", room: "Room 21", status: "NOW", active: true },
    { period: "P4", time: "10:40 – 11:10", subject: "Hindi", teacher: "Kamla Devi", room: "Room 21", status: "NEXT" },
    { period: "P5", time: "11:10 – 11:50", subject: "Social science", teacher: "Rakesh Meena", room: "Room 21", status: "Later" },
    { period: "P6", time: "11:50 – 12:30", subject: "Sanskrit", teacher: "Hari Om Sharma", room: "Room 21", status: "Later" },
    { period: "P7", time: "12:30 – 01:10", subject: "Computer", teacher: "Neha Saini", room: "Lab 2", status: "Later" },
    { period: "P8", time: "01:10 – 01:50", subject: "Games", teacher: "Deepak Choudhary", room: "Sports Ground", status: "Later" },
  ];

  const examSchedule = [
    { date: "Mon 16 Nov", time: "09:00 – 11:30 AM", subject: "English", syllabus: "Literature chapters 1–7, grammar, essay & letter writing" },
    { date: "Wed 18 Nov", time: "09:00 – 11:30 AM", subject: "Maths", syllabus: "Chapters 1 to 8 (Linear Equations, Geometry, Exponents)" },
    { date: "Fri 20 Nov", time: "09:00 – 11:30 AM", subject: "Science", syllabus: "Chapters 1 to 7 (Combustion & Flame, Cell, Materials)" },
    { date: "Mon 23 Nov", time: "09:00 – 11:30 AM", subject: "Hindi", syllabus: "पाठ 1 से 8, व्याकरण, निबंध लेखन एवं अपठित गद्यांश" },
    { date: "Wed 25 Nov", time: "09:00 – 11:30 AM", subject: "Social science", syllabus: "History 1–4, Geography 1–3, Civics 1–3, Map work" },
    { date: "Fri 27 Nov", time: "09:00 – 11:30 AM", subject: "Sanskrit", syllabus: "पाठ 1 से 6, शब्द रूप एवं धातु रूप" },
  ];

  const handleDownloadDatesheet = () => {
    showToast("Downloading Half-Yearly examination date sheet PDF...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-small text-ink-secondary">Academics · Class 8-B</div>
          <h1 className="text-title font-semibold text-ink m-0">Timetable & Examinations</h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-surface-subtle p-1 rounded-control border border-line">
          <button
            type="button"
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2 rounded-control text-small font-semibold transition-all cursor-pointer ${
              activeTab === "today"
                ? "bg-surface text-ink shadow-2xs"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            Daily Timetable
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("exams")}
            className={`px-4 py-2 rounded-control text-small font-semibold transition-all cursor-pointer ${
              activeTab === "exams"
                ? "bg-surface text-ink shadow-2xs"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            Exam Date Sheet
          </button>
        </div>
      </div>

      {/* ================= TAB 1: DAILY TIMETABLE ================= */}
      {activeTab === "today" && (
        <div className="flex flex-col gap-4">
          <div className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="px-6 py-4 border-b border-line-row flex items-center justify-between bg-surface-subtle/50">
              <span className="text-body font-semibold text-ink">
                Tuesday Schedule · Class 8-B (8 Periods)
              </span>
              <span className="text-small text-ink-secondary">
                Room 21 · Class Teacher: Sunita Rathore
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line-row text-caption text-ink-secondary bg-surface-subtle/20">
                    <th className="py-3 px-6 font-semibold">Period</th>
                    <th className="py-3 px-6 font-semibold">Timing</th>
                    <th className="py-3 px-6 font-semibold">Subject</th>
                    <th className="py-3 px-6 font-semibold">Educator</th>
                    <th className="py-3 px-6 font-semibold">Location</th>
                    <th className="py-3 px-6 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row text-small">
                  {todayPeriods.map((p, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-surface-subtle/60 transition-colors ${
                        p.active ? "bg-primary-tint/60" : ""
                      }`}
                    >
                      <td className="py-3.5 px-6 font-mono font-semibold text-ink">
                        {p.period}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-ink-secondary">
                        {p.time}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-ink">
                        {p.subject}
                      </td>
                      <td className="py-3.5 px-6 text-ink-secondary">
                        {p.teacher}
                      </td>
                      <td className="py-3.5 px-6 text-ink-secondary">
                        {p.room}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {p.status === "NOW" ? (
                          <span className="font-semibold text-caption px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ● In Session (NOW)
                          </span>
                        ) : p.status === "NEXT" ? (
                          <span className="font-semibold text-caption px-2.5 py-1 rounded-full bg-primary-tint text-primary border border-primary/20">
                            Upcoming (NEXT)
                          </span>
                        ) : p.status === "Done" ? (
                          <span className="text-caption text-ink-muted">
                            Completed
                          </span>
                        ) : (
                          <span className="text-caption text-ink-secondary">
                            Later
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: EXAM DATE SHEET ================= */}
      {activeTab === "exams" && (
        <div className="flex flex-col gap-6">
          {/* Half-Yearly Hero Banner */}
          <div className="bg-nav-bg text-white rounded-card p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-caption font-semibold uppercase tracking-wider text-nav-muted">
                Upcoming Half-Yearly Examinations 2026-27
              </span>
              <h2 className="text-title font-semibold text-white mt-1 m-0">
                Starts Monday, 16 November 2026
              </h2>
              <span className="text-small text-nav-text mt-1">
                Exam Hours: 09:00 AM – 11:30 AM · Reporting time: 08:30 AM
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="font-mono text-3xl font-bold text-gold">
                  34 days
                </span>
                <span className="text-caption text-nav-muted">Countdown left</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadDatesheet}
                className="px-4 py-2.5 rounded-control bg-white/10 hover:bg-white/20 text-white text-small font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FiDownload size={16} /> Download Date Sheet
              </button>
            </div>
          </div>

          {/* Exam Table */}
          <div className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs">
            <div className="px-6 py-4 border-b border-line-row bg-surface-subtle/50">
              <span className="text-body font-semibold text-ink">
                Class 8-B Term 1 / Half-Yearly Examination Schedule
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line-row text-caption text-ink-secondary bg-surface-subtle/20">
                    <th className="py-3 px-6 font-semibold">Date & Day</th>
                    <th className="py-3 px-6 font-semibold">Timing</th>
                    <th className="py-3 px-6 font-semibold">Subject</th>
                    <th className="py-3 px-6 font-semibold">Prescribed Syllabus & Chapters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row text-small">
                  {examSchedule.map((exam, idx) => (
                    <tr key={idx} className="hover:bg-surface-subtle/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-ink whitespace-nowrap">
                        {exam.date}
                      </td>
                      <td className="py-4 px-6 font-mono text-ink-secondary whitespace-nowrap">
                        {exam.time}
                      </td>
                      <td className="py-4 px-6 font-semibold text-ink whitespace-nowrap">
                        {exam.subject}
                      </td>
                      <td className="py-4 px-6 text-ink-secondary leading-relaxed">
                        {exam.syllabus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-primary-tint/60 border border-primary-tint-border rounded-control flex items-center gap-3 text-small text-primary-dark">
            <FiAward size={18} className="shrink-0 text-primary" />
            <span>
              Admit cards will be distributed directly in class by your class teacher Sunita Rathore 1 week prior to exams.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
