import React, { useState } from "react";
import { FiBell, FiCalendar, FiTag, FiFileText } from "react-icons/fi";

interface Notice {
  id: string;
  title: string;
  description: string;
  fullContent?: string;
  category: "holiday" | "academic" | "activities";
  issuer: string;
  date: string;
  unread?: boolean;
}

const DEFAULT_NOTICES: Notice[] = [
  {
    id: "n1",
    title: "School closed 20–24 Oct for the festival break",
    description: "Classes resume on Monday 26 October 2026. Happy Diwali and festive greetings to all students and staff.",
    fullContent: "The school will remain closed from Tuesday, 20 October 2026 to Saturday, 24 October 2026 on account of Diwali festival holidays. All academic and co-curricular sessions will resume on Monday, 26 October at standard reporting time (07:45 AM).",
    category: "holiday",
    issuer: "Office of the Principal",
    date: "12 Oct 2026",
    unread: true,
  },
  {
    id: "n2",
    title: "Bring your science model on Thursday",
    description: "Models for the annual inter-school science exhibition, Class 8-B.",
    fullContent: "All students of Class 8-B participating in the Science Exhibition are required to submit their working models or chart displays to Mrs. Sunita Rathore during the zero period on Thursday, 15 October.",
    category: "academic",
    issuer: "Class Teacher · Sunita Rathore",
    date: "12 Oct 2026",
    unread: false,
  },
  {
    id: "n3",
    title: "Half-yearly examination date sheet & syllabus release",
    description: "Exams commence from 16 Nov. Check prescribed chapters in the Timetable tab.",
    fullContent: "The detailed schedule for the upcoming Half-Yearly Examinations 2026-27 has been finalized. Admit cards will be distributed on 9 November. Please refer to your student portal timetable for subject chapter breakdowns.",
    category: "academic",
    issuer: "Examination Cell",
    date: "28 Sep 2026",
    unread: false,
  },
  {
    id: "n4",
    title: "Inter-house GK & Science Quiz competition, 3 Nov",
    description: "Submit student nominations to your respective house captain by Friday.",
    fullContent: "The annual Inter-House Quiz competition for Middle School (Classes 6 to 8) will be held in the auditorium on Tuesday, 3 November. Each house will field a 4-member team. Interested students should contact house captains.",
    category: "activities",
    issuer: "Co-curricular Committee",
    date: "25 Sep 2026",
    unread: false,
  },
];

const StudentNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  const [activeCategory, setActiveCategory] = useState<"all" | "academic" | "holiday" | "activities">("all");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(DEFAULT_NOTICES[0]);

  const filtered = notices.filter(
    (n) => activeCategory === "all" || n.category === activeCategory
  );

  const handleSelect = (notice: Notice) => {
    setSelectedNotice(notice);
    setNotices((prev) =>
      prev.map((n) => (n.id === notice.id ? { ...n, unread: false } : n))
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Header & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-small text-ink-secondary">Announcements & Circulars</div>
          <h1 className="text-title font-semibold text-ink m-0">School Notice Board</h1>
        </div>

        <div className="flex items-center gap-1.5 bg-surface-subtle p-1 rounded-control border border-line">
          {[
            { id: "all", label: "All Notices" },
            { id: "academic", label: "Academic" },
            { id: "holiday", label: "Holidays" },
            { id: "activities", label: "Events" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-control text-small font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-surface text-ink shadow-2xs"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Desktop View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Notice List Feed (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {filtered.map((item) => {
            const isSelected = selectedNotice?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-4 rounded-card border transition-all cursor-pointer shadow-2xs flex gap-3 ${
                  isSelected
                    ? "bg-surface border-primary ring-2 ring-primary/10"
                    : item.unread
                    ? "bg-primary-row border-line hover:border-primary/40"
                    : "bg-surface border-line hover:border-primary/40"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.unread ? "bg-primary" : "bg-transparent"
                  }`}
                />
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <span className={`text-small leading-snug ${item.unread ? "font-bold text-ink" : "font-semibold text-ink"}`}>
                    {item.title}
                  </span>
                  <span className="text-caption text-ink-secondary line-clamp-2">
                    {item.description}
                  </span>
                  <div className="flex items-center justify-between text-micro text-ink-muted mt-2 pt-2 border-t border-line-row">
                    <span>{item.issuer}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice Full Reader Area (7 cols) */}
        {selectedNotice && (
          <div className="lg:col-span-7 bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-5">
            <div className="flex flex-col gap-2 pb-4 border-b border-line-row">
              <div className="flex items-center justify-between text-caption text-ink-secondary">
                <span className="font-semibold text-primary uppercase tracking-wider">
                  {selectedNotice.issuer}
                </span>
                <span>{selectedNotice.date}</span>
              </div>
              <h2 className="text-title font-semibold text-ink m-0 leading-tight">
                {selectedNotice.title}
              </h2>
            </div>

            <div className="text-body text-ink leading-relaxed p-4 bg-surface-subtle rounded-control border border-line">
              {selectedNotice.fullContent || selectedNotice.description}
            </div>

            <div className="p-3 bg-surface-subtle/50 border border-line-row rounded-control text-caption text-ink-secondary">
              Notice circulated for Class 8-B. Official consent or permission slips are signed directly by parents via the Parent Portal.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotices;
