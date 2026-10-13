import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, Bell, Check, ExternalLink } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  unread: boolean;
  time?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Support team asks to view Fees for 2 hours",
    subtitle: "Ticket TKT-0918 · review the request",
    link: "/admin/help-support",
    unread: true,
  },
  {
    id: "n2",
    title: "3 sections have not marked attendance",
    subtitle: "Cut-off 10:00 am · 7-B, 9-C, 11-Commerce",
    link: "/admin/attendance",
    unread: true,
  },
  {
    id: "n3",
    title: "Concession waiting for your approval",
    subtitle: "Aarav Gupta (5-A) · Rekha Jain",
    link: "/admin/approvals",
    unread: true,
  },
  {
    id: "n4",
    title: "Planned maintenance on Sunday night",
    subtitle: "From the software team · 18 Oct, 11:30 pm",
    link: "/admin/dashboard",
    unread: true,
  },
  {
    id: "n5",
    title: "₹4,96,300 received online yesterday",
    subtitle: "142 receipts · 4 need attention",
    link: "/admin/accounts",
    unread: false,
  },
  {
    id: "n6",
    title: "WhatsApp credits below 10%",
    subtitle: "3,120 left · buy more",
    link: "/admin/plan-billing",
    unread: false,
  },
  {
    id: "n7",
    title: "Report cards published for 6-A, 6-B",
    subtitle: "Visible to parents now",
    link: "/admin/exam",
    unread: false,
  },
];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [tab, setTab] = useState<"all" | "unread">("all");

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;
  const filtered = notifications.filter(n => (tab === "unread" ? n.unread : true));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Slide-out Drawer */}
      <aside 
        role="dialog" 
        aria-label="Notifications Drawer" 
        className="absolute top-16 right-4 sm:right-6 w-full max-w-[420px] max-h-[85vh] bg-white border border-line rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
      >
        {/* Drawer Header */}
        <div className="p-4 px-5 border-b border-line flex items-center justify-between bg-page/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-ink">Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-xs font-bold text-primary hover:text-primary-dark cursor-pointer transition-colors"
              >
                Mark all read
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-page transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-line bg-white">
          <button
            onClick={() => setTab("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === "all" ? "bg-nav-bg text-white" : "bg-page text-ink-secondary hover:text-ink"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTab("unread")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === "unread" ? "bg-nav-bg text-white" : "bg-page text-ink-secondary hover:text-ink"
            }`}
          >
            Unread · {unreadCount}
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-line custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-muted">
              No notifications to display in this view.
            </div>
          ) : (
            filtered.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                onClick={onClose}
                className={`p-3.5 px-5 flex items-start gap-3 transition-colors hover:bg-page/70 group ${
                  item.unread ? "bg-primary-tint/20" : "bg-white"
                }`}
              >
                {/* Dot indicator */}
                <span 
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.unread ? "bg-primary" : "bg-transparent"
                  }`} 
                />

                <div className="flex-1 min-w-0">
                  <div className={`text-xs ${item.unread ? "font-bold text-ink" : "font-medium text-ink-secondary"} group-hover:text-primary transition-colors`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-ink-muted mt-0.5 truncate">
                    {item.subtitle}
                  </div>
                </div>

                <ExternalLink className="w-3.5 h-3.5 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
              </Link>
            ))
          )}
        </div>

      </aside>
    </div>
  );
}
