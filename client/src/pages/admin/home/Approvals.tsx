import React, { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  ShieldAlert, 
  ArrowRight,
  Filter
} from "lucide-react";
import { useToast } from "../../../context/ToastContext";

interface ApprovalItem {
  id: string;
  category: "Concession" | "Marks unlock" | "Transfer certificate" | "Staff leave" | "Receipt cancellation" | "Notice";
  title: string;
  requestedBy: string;
  timeAgo: string;
  impactText: string;
  isUrgent?: boolean;
  status: "pending" | "approved" | "rejected";
}

const initialApprovals: ApprovalItem[] = [
  {
    id: "app-1",
    category: "Concession",
    title: "Sibling concession 15% · Aarav Gupta (5-A)",
    requestedBy: "Rekha Jain, Accountant · 2 h ago",
    timeAgo: "Waiting 2 h ago",
    impactText: "₹2,025 per installment · above ₹1,500 limit",
    status: "pending"
  },
  {
    id: "app-2",
    category: "Marks unlock",
    title: "Half-Yearly Science · Class 8-B · 3 entries",
    requestedBy: "Sunita Rathore · today 10:40",
    timeAgo: "Waiting Today",
    impactText: "Report cards for 8-B wait for this",
    status: "pending"
  },
  {
    id: "app-3",
    category: "Transfer certificate",
    title: "Riya Choudhary (10-A)",
    requestedBy: "Prepared by Neha Saini · yesterday",
    timeAgo: "Waiting 1 day",
    impactText: "All dues and library cleared",
    status: "pending"
  },
  {
    id: "app-4",
    category: "Staff leave",
    title: "Vikram Singh · 12–14 Oct (CL)",
    requestedBy: "Applied 8 Oct",
    timeAgo: "Waiting 3 days",
    impactText: "6 periods need substitutes",
    isUrgent: true,
    status: "pending"
  },
  {
    id: "app-5",
    category: "Receipt cancellation",
    title: "RCP/2627/004190 · ₹16,900 · wrong student",
    requestedBy: "Requested by Rekha Jain · 9 Oct",
    timeAgo: "Waiting 3 days",
    impactText: "Reversal entry will be posted",
    isUrgent: true,
    status: "pending"
  },
  {
    id: "app-6",
    category: "Notice",
    title: "School closed 20–24 Oct for Diwali",
    requestedBy: "Drafted by Meera Kumawat · today",
    timeAgo: "Waiting Today",
    impactText: "Whole school · 2,031 guardians",
    status: "pending"
  }
];

const categories = [
  "All", 
  "Concession", 
  "Marks unlock", 
  "Transfer certificate", 
  "Staff leave", 
  "Receipt cancellation", 
  "Notice"
] as const;

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>(initialApprovals);
  const [activeTab, setActiveTab] = useState<string>("All");
  const { showToast } = useToast();

  const handleAction = (id: string, action: "approve" | "reject") => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: action === "approve" ? "approved" : "rejected" };
      }
      return item;
    }));

    const target = items.find(i => i.id === id);
    if (action === "approve") {
      showToast(`Approved: ${target?.title}`, "success");
    } else {
      showToast(`Rejected request: ${target?.title}`, "info");
    }
  };

  const filtered = items.filter(item => {
    if (activeTab === "All") return item.status === "pending";
    return item.category === activeTab && item.status === "pending";
  });

  const pendingCount = items.filter(i => i.status === "pending").length;
  const urgentCount = items.filter(i => i.status === "pending" && i.isUrgent).length;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-ink-secondary mb-1">
            Home › Multi-approver Inbox
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight m-0">
            Approvals Inbox
          </h1>
          <p className="text-sm text-ink-secondary mt-1 m-0">
            Everything waiting for a second authorized person. You cannot approve your own requests.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>{pendingCount} waiting · {urgentCount} urgent (&gt;2 days)</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 pt-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`min-h-[36px] px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeTab === cat
                ? "bg-nav-bg text-white border-nav-bg shadow-2xs"
                : "bg-surface text-ink-secondary border-line hover:border-ink-muted hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-surface border border-line rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-ink m-0">All clear! No pending approvals</h3>
            <p className="text-xs text-ink-secondary mt-1 m-0">
              There are no action items waiting in the {activeTab === "All" ? "inbox" : activeTab} queue.
            </p>
          </div>
        ) : (
          filtered.map(item => (
            <article
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:shadow-xs ${
                item.isUrgent ? "border-amber-300 bg-amber-50/20" : "border-line"
              }`}
            >
              {/* Left Details */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-primary-tint/50 px-2 py-0.5 rounded-md border border-primary-soft/30">
                    {item.category}
                  </span>
                  <span className={`text-xs font-semibold ${item.isUrgent ? "text-amber-700" : "text-ink-secondary"}`}>
                    {item.timeAgo}
                  </span>
                </div>

                <div className="text-[15px] font-bold text-ink">
                  {item.title}
                </div>

                <div className="text-xs text-ink-secondary">
                  {item.requestedBy}
                </div>
              </div>

              {/* Middle Context Impact */}
              <div className="md:w-64 text-xs font-medium text-ink-secondary border-y md:border-y-0 md:border-l border-line py-2 md:py-0 md:pl-4">
                <div className="text-[11px] uppercase tracking-wider text-ink-muted font-bold mb-0.5">
                  Audit &amp; Impact
                </div>
                {item.impactText}
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleAction(item.id, "reject")}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-line hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-ink transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(item.id, "approve")}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-dark text-white shadow-2xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
              </div>

            </article>
          ))
        )}
      </div>

    </div>
  );
}
