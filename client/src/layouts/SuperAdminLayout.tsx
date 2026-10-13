import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  Receipt, 
  MessageSquare, 
  BookMarked, 
  HelpCircle, 
  Activity, 
  Megaphone, 
  Flag, 
  ShieldAlert, 
  Users2, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  ChevronDown,
  Calendar
} from "lucide-react";

export default function SuperAdminLayout() {
  const nav = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("superadmin");
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("role");
    nav("/superadmin/login");
  };

  const navItems = [
    { to: "/superadmin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/superadmin/schools", label: "Schools", icon: Building2 },
    { to: "/superadmin/demos", label: "Demo requests", icon: Calendar, badge: "9" },
    { to: "/superadmin/plans", label: "Plans & pricing", icon: Layers },
    { to: "/superadmin/billing", label: "Billing", icon: Receipt, badge: "9" },
    { to: "/superadmin/credits", label: "Message credits", icon: MessageSquare },
    { to: "/superadmin/masters", label: "Global masters", icon: BookMarked },
    { to: "/superadmin/support", label: "Support desk", icon: HelpCircle, badge: "6" },
    { to: "/superadmin/monitoring", label: "Monitoring", icon: Activity, badge: "2" },
    { to: "/superadmin/announcements", label: "Announcements", icon: Megaphone },
    { to: "/superadmin/flags", label: "Releases & flags", icon: Flag },
    { to: "/superadmin/data-requests", label: "Data requests", icon: ShieldAlert, badge: "1" },
    { to: "/superadmin/users", label: "Users & audit", icon: Users2 },
    { to: "/superadmin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-screen flex bg-page font-sans text-ink overflow-hidden selection:bg-gold selection:text-nav-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-nav-bg text-nav-text flex flex-col shrink-0 border-r border-nav-divider select-none">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-nav-divider flex flex-col gap-2.5">
          <div className="flex items-center">
            <img 
              src="/guruconnect-logo.png" 
              alt="guruConnect Logo" 
              className="h-16 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-[15px] leading-tight tracking-tight">
                guru<span className="text-gold">Connect</span>
              </span>
              <span className="text-[10px] text-nav-muted font-medium">Platform HQ</span>
            </div>
          </div>
          <span className="self-start text-[10px] font-bold tracking-wider text-nav-bg bg-gold px-2 py-0.5 rounded-md uppercase">
            Platform Admin
          </span>
        </div>

        {/* Navigation List */}
        <nav aria-label="Platform" className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to === "/superadmin/schools" && location.pathname.startsWith("/superadmin/schools"));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                  isActive
                    ? "bg-primary-tint/20 text-white font-bold border border-primary-soft/40 shadow-2xs"
                    : "text-nav-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-gold" : "text-nav-muted"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-gold/20 text-gold border border-gold/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer info & Logout */}
        <div className="p-3 border-t border-nav-divider flex flex-col gap-2 bg-nav-bg/50">
          <div className="px-2 py-1 text-[11px] text-nav-muted flex flex-col gap-0.5">
            <span className="font-semibold text-white/90">Super Admin Session</span>
            <span>Production · ap-south-1 (Mumbai)</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 w-full rounded-xl text-xs font-semibold text-nav-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out Platform</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-line px-6 sm:px-8 flex items-center justify-between gap-4 shrink-0 shadow-2xs">
          
          {/* Global Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school, owner mobile or invoice no..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-surface rounded-xl border border-line-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-ink placeholder:text-ink-secondary"
            />
          </div>

          {/* Right Profile & Notifications */}
          <div className="flex items-center gap-4">
            <button
              className="relative p-2 text-ink-secondary hover:text-ink hover:bg-page rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-white" />
            </button>

            <div className="h-7 w-px bg-line" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-tint border border-primary-soft text-primary-dark font-extrabold text-xs flex items-center justify-center shadow-xs">
                SA
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[13px] font-bold text-ink leading-tight">Master Admin</span>
                <span className="text-[11px] text-ink-secondary">superadmin@guruconnect.com</span>
              </div>
              <ChevronDown className="w-4 h-4 text-ink-secondary hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
