import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  FiClock, 
  FiCalendar, 
  FiBookOpen, 
  FiArrowRight, 
  FiAlertCircle, 
  FiFileText, 
  FiBookmark,
  FiAward
} from "react-icons/fi";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentName = user?.name || "Charu Mehta";
  const firstName = studentName.split(" ")[0];

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Banner Notice */}
      <div className="text-small text-ink-secondary">
        Student Portal · Class 8-B · Session 2026-27
      </div>

      {/* Hero Welcome Banner */}
      <section className="bg-surface border border-line rounded-card p-6 flex flex-wrap gap-6 items-center justify-between shadow-2xs">
        <div className="flex items-center gap-4 min-w-[280px]">
          <div className="w-16 h-16 rounded-hero bg-primary-tint text-primary-dark font-semibold text-2xl flex items-center justify-center border border-primary/20 shrink-0">
            CM
          </div>
          <div className="flex flex-col">
            <div className="text-small text-ink-secondary font-medium">Tuesday, 13 Oct 2026</div>
            <h1 className="text-title font-semibold tracking-tight text-ink m-0">
              Welcome, {firstName}
            </h1>
            <div className="text-small text-ink-secondary mt-0.5">
              Class 8-B · Roll 03 · Aravali House · Class Teacher: <span className="font-medium text-ink">Sunita Rathore</span>
            </div>
          </div>
        </div>

        {/* Quick Period Status Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#21524C] text-white border border-[#2d6e66] rounded-card p-3 px-4 flex flex-col gap-0.5 shadow-2xs min-w-[170px]">
            <span className="text-[11px] font-mono font-medium text-[#A9C2BD] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              NOW · 10:00 AM
            </span>
            <span className="text-[15px] font-semibold text-white tracking-tight">English</span>
            <span className="text-[12px] text-[#D5E4E0]">Meenakshi Rao · Room 21</span>
          </div>

          <div className="bg-surface-subtle border border-line rounded-card p-3 px-4 flex flex-col gap-0.5 min-w-[170px]">
            <span className="text-[11px] font-mono font-medium text-ink-secondary">
              NEXT · 10:40 AM
            </span>
            <span className="text-[15px] font-semibold text-ink tracking-tight">Hindi</span>
            <span className="text-[12px] text-ink-secondary">Kamla Devi · Room 21</span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: Homework & Academics */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Due Soon Homework Card */}
          <div className="bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-line-row">
              <div className="flex items-center gap-2">
                <FiBookOpen className="text-primary" size={18} />
                <h2 className="text-body font-semibold text-ink m-0">Homework Due Soon</h2>
              </div>
              <Link
                to="/student/homework"
                className="text-small font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>All assignments</span>
                <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {/* Item 1 */}
              <div className="p-3.5 rounded-control border border-line hover:border-primary/40 bg-surface-subtle/50 transition-all flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-small font-semibold text-ink">Science</span>
                    <span className="text-caption text-ink-secondary">· Sunita Rathore</span>
                  </div>
                  <span className="text-small text-ink-secondary mt-0.5 truncate">
                    Ch. 6 Combustion — questions 1–5 · due tomorrow
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-caption font-semibold px-2.5 py-1 rounded-full bg-[#FFF6EC] text-[#7A4106] border border-[#EBC99C]/60">
                    To do
                  </span>
                  <Link
                    to="/student/homework"
                    className="hidden sm:inline-block text-caption font-semibold text-primary hover:underline"
                  >
                    Submit photos →
                  </Link>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 rounded-control border border-line hover:border-primary/40 bg-surface-subtle/50 transition-all flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-small font-semibold text-ink">Maths</span>
                    <span className="text-caption text-ink-secondary">· Ravi Kumar</span>
                  </div>
                  <span className="text-small text-ink-secondary mt-0.5 truncate">
                    Ex. 7.2 all questions · notebook verification
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-caption font-semibold px-2.5 py-1 rounded-full bg-[#E3EFEF] text-[#08393F] border border-[#C5DEDD]">
                    Submitted
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 rounded-control border border-line hover:border-primary/40 bg-surface-subtle/50 transition-all flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-small font-semibold text-ink">English</span>
                    <span className="text-caption text-ink-secondary">· Meenakshi Rao</span>
                  </div>
                  <span className="text-small text-ink-secondary mt-0.5 truncate">
                    Essay: my favourite festival (150 words) · due Fri 16 Oct
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-caption font-semibold px-2.5 py-1 rounded-full bg-[#FFF6EC] text-[#7A4106] border border-[#EBC99C]/60">
                    To do
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Full Routine Snippet */}
          <div className="bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-line-row">
              <div className="flex items-center gap-2">
                <FiClock className="text-primary" size={18} />
                <h2 className="text-body font-semibold text-ink m-0">Today's Academic Schedule</h2>
              </div>
              <Link
                to="/student/timetable"
                className="text-small font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Full timetable</span>
                <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-control border border-line bg-surface-subtle flex flex-col gap-1">
                <span className="font-mono text-micro text-ink-secondary">P1 · 08:00</span>
                <span className="text-small font-semibold text-ink">Science</span>
                <span className="text-caption text-ink-secondary truncate">Sunita Rathore</span>
              </div>

              <div className="p-3 rounded-control border border-line bg-surface-subtle flex flex-col gap-1">
                <span className="font-mono text-micro text-ink-secondary">P2 · 08:40</span>
                <span className="text-small font-semibold text-ink">Maths</span>
                <span className="text-caption text-ink-secondary truncate">Ravi Kumar</span>
              </div>

              <div className="p-3 rounded-control border border-primary/40 bg-[#E3EFEF] flex flex-col gap-1">
                <span className="font-mono text-micro font-semibold text-primary">P3 · 10:00 (NOW)</span>
                <span className="text-small font-semibold text-ink">English</span>
                <span className="text-caption text-ink-secondary truncate">Meenakshi Rao</span>
              </div>

              <div className="p-3 rounded-control border border-line bg-surface-subtle flex flex-col gap-1">
                <span className="font-mono text-micro text-ink-secondary">P4 · 10:40 (NEXT)</span>
                <span className="text-small font-semibold text-ink">Hindi</span>
                <span className="text-caption text-ink-secondary truncate">Kamla Devi</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Exam Countdown, Library & Notices */}
        <div className="flex flex-col gap-6">
          
          {/* Upcoming Exam Countdown Card */}
          <div className="bg-[#12302D] text-white rounded-card p-6 shadow-xs flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-caption font-semibold uppercase tracking-wider text-[#A9C2BD]">
                Upcoming Exam
              </span>
              <span className="font-mono text-2xl font-bold text-[#E9B872]">
                34 d
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-title font-semibold text-white">Half-Yearly Examination</span>
              <span className="text-small text-[#D5E4E0] mt-1">
                Starts Mon 16 Nov · 9:00 – 11:30 AM
              </span>
              <span className="text-caption text-[#A9C2BD] mt-0.5">
                First paper: English (Chapters 1–7)
              </span>
            </div>

            <Link
              to="/student/timetable"
              className="mt-2 py-2 px-3 rounded-control bg-white/10 hover:bg-white/20 text-white text-small font-semibold transition-colors flex items-center justify-between"
            >
              <span>View Date Sheet & Syllabus</span>
              <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Library Book Alert Card */}
          <div className="bg-[#FFF8F0] border border-[#EBC99C] rounded-card p-5 flex flex-col gap-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-caption font-semibold uppercase tracking-wider text-[#8F4A09] flex items-center gap-1.5">
                <FiBookmark size={13} /> Library Notice
              </span>
              <span className="text-caption font-bold text-[#8F4A09] px-2 py-0.5 rounded-full bg-amber-100/80">
                Due in 2 days
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-body font-semibold text-[#17201D]">"Wings of Fire"</span>
              <span className="text-caption text-[#4F5B57]">
                A. P. J. Abdul Kalam · Return by Thu 15 Oct
              </span>
            </div>

            <Link
              to="/student/library"
              className="text-caption font-semibold text-[#8F4A09] hover:underline flex items-center gap-1 mt-1"
            >
              <span>Manage books & search catalogue →</span>
            </Link>
          </div>

          {/* Latest Notice Board Card */}
          <div className="bg-surface border border-line rounded-card p-5 flex flex-col gap-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-line-row">
              <span className="text-body font-semibold text-ink">Notice Board</span>
              <Link to="/student/notices" className="text-caption font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-micro font-semibold text-primary uppercase tracking-wide">
                Office · 12 Oct
              </span>
              <span className="text-small font-semibold text-ink leading-snug">
                School closed 20–24 Oct for the festival break
              </span>
              <span className="text-caption text-ink-secondary leading-relaxed mt-0.5">
                Classes will resume on Monday, 26 October 2026.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;