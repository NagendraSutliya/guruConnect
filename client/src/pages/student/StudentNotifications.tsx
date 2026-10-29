import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { FiBell, FiCheck, FiCheckCircle, FiClock, FiTrash2 } from "react-icons/fi";

interface NotificationItem {
  id: string;
  category: "homework" | "library" | "exam" | "result" | "notice";
  title: string;
  desc: string;
  time: string;
  link: string;
  unread: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { id: "notif1", category: "homework", title: "New homework assigned: Science Ch. 6 questions 1–5", desc: "Mrs. Sunita Rathore posted questions on Combustion & Flame. Submission deadline tomorrow.", time: "1 hour ago", link: "/student/homework", unread: true },
  { id: "notif2", category: "library", title: "Library book due in 2 days", desc: 'Your issued book "Wings of Fire" is due back on Thursday 15 October. Please return or renew at the counter.', time: "3 hours ago", link: "/student/library", unread: true },
  { id: "notif3", category: "homework", title: "Social science homework: redo requested", desc: 'Rakesh Meena noted: "Label the Godavari and Krishna delta clearly again."', time: "1 day ago", link: "/student/homework", unread: false },
  { id: "notif4", category: "exam", title: "Half-yearly examination date sheet published", desc: "Examinations commence Monday, 16 November 2026. Syllabus released.", time: "2 days ago", link: "/student/timetable", unread: false },
  { id: "notif5", category: "result", title: "Term 1 examination results published", desc: "Your official Term 1 evaluation has been approved. Overall grade: A1 (92.4%).", time: "5 days ago", link: "/student/results", unread: false },
  { id: "notif6", category: "notice", title: "New circular: Festival break 20–24 October", desc: "School will remain closed for Diwali break. Classes resume on Monday, 26 October.", time: "1 week ago", link: "/student/notices", unread: false },
];

const StudentNotifications: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "homework" | "exam">("all");

  const filtered = items.filter((item) => {
    if (activeFilter === "unread") return item.unread;
    if (activeFilter === "homework") return item.category === "homework";
    if (activeFilter === "exam") return item.category === "exam" || item.category === "result";
    return true;
  });

  const markAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
    showToast("All notifications marked as read.", "success");
  };

  const handleItemClick = (item: NotificationItem) => {
    setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)));
    navigate(item.link);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-small text-ink-secondary">Notifications & Activity Feed</div>
          <h1 className="text-title font-semibold text-ink m-0">Student Notifications</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-control border border-line bg-surface hover:bg-surface-subtle text-small font-semibold text-ink transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FiCheck size={15} /> Mark all as read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-2 overflow-x-auto">
        {[
          { id: "all", label: "All Activity" },
          { id: "unread", label: "Unread (2)" },
          { id: "homework", label: "Homework" },
          { id: "exam", label: "Exams & Results" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 rounded-control text-small font-semibold transition-all cursor-pointer ${
              activeFilter === tab.id
                ? "bg-nav-bg text-white shadow-2xs"
                : "bg-surface text-ink-secondary hover:text-ink hover:bg-surface-subtle border border-line"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List Card */}
      <div className="bg-surface border border-line rounded-card overflow-hidden shadow-2xs divide-y divide-line-row">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`p-4 px-6 flex items-start gap-4 transition-colors cursor-pointer ${
              item.unread ? "bg-primary-row hover:bg-[#ebf5f5]" : "hover:bg-surface-subtle/60"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                item.unread ? "bg-primary ring-4 ring-primary/20" : "bg-transparent"
              }`}
            />

            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-body leading-snug ${item.unread ? "font-bold text-ink" : "font-medium text-ink"}`}>
                  {item.title}
                </span>
                <span className="text-micro text-ink-secondary whitespace-nowrap font-mono shrink-0">
                  {item.time}
                </span>
              </div>
              <p className="text-small text-ink-secondary m-0 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-small text-ink-secondary">
            No notifications in this filter view.
          </div>
        )}
      </div>

      <div className="text-caption text-ink-secondary text-center px-4 leading-relaxed">
        Notifications keep you updated with homework submissions, exam date sheets, and library reminders in real-time.
      </div>
    </div>
  );
};

export default StudentNotifications;
