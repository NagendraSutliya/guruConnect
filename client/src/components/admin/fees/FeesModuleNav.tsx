import React from "react";
import { Link, useLocation } from "react-router-dom";

export type FeeTab = "counter" | "structure" | "defaulters" | "online" | "closing" | "accounts";

interface FeesModuleNavProps {
  activeTab: FeeTab;
}

export default function FeesModuleNav({ activeTab }: FeesModuleNavProps) {
  const tabs = [
    { id: "counter", label: "Counter", path: "/admin/collect-fees" },
    { id: "structure", label: "Fee structure", path: "/admin/fee-structure" },
    { id: "defaulters", label: "Defaulters", path: "/admin/defaulters" },
    { id: "online", label: "Online payments", path: "/admin/reconciliation" },
    { id: "closing", label: "Cash closing", path: "/admin/cash-closing" },
    { id: "accounts", label: "Accounts", path: "/admin/accounts" },
  ];

  return (
    <nav
      aria-label="Fees & Accounts Navigation"
      className="flex items-center gap-1 border-b border-line overflow-x-auto scrollbar-none text-small font-medium select-none mb-5"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            to={tab.path}
            className={`min-h-[44px] flex items-center px-4 border-b-[3px] text-small whitespace-nowrap transition-colors ${
              isActive
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-ink-secondary hover:text-ink hover:border-slate-300"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
