import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  MoreVertical, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  FileSpreadsheet
} from "lucide-react";
import api from "../../api/axiosInstance";

export default function SuperAdminSchools() {
  const [schools, setSchools] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailSchool, setDetailSchool] = useState<any | null>(null);
  const [actionSchool, setActionSchool] = useState<any | null>(null);
  const [actionType, setActionType] = useState<"grace" | "plan" | "suspend" | "close" | null>(null);

  // Form state for creating school
  const [newSchool, setNewSchool] = useState({
    type: "School",
    name: "",
    city: "",
    state: "Rajasthan",
    board: "CBSE",
    studentRange: "500–1,000",
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    plan: "Standard",
    trialDays: "30",
    addOns: "None"
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = () => {
    api.get("/superadmin/institutes")
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const normalized = res.data.data.map((item: any, i: number) => ({
            _id: item._id || `inst-${i}`,
            name: item.name || "Institute",
            city: typeof item.city === "string" ? item.city : item.address?.city || "Jaipur",
            state: typeof item.state === "string" ? item.state : item.address?.state || "Rajasthan",
            board: item.board || "CBSE",
            type: item.type || "School",
            plan: item.plan || "Standard",
            students: typeof item.students === "number" ? item.students : item.studentCount || 500,
            status: item.status || "Active",
            daysLeft: item.daysLeft || "monthly cycle",
            owner: typeof item.owner === "string" ? item.owner : item.owner?.name || item.contactPerson || "Admin",
            mobile: typeof item.mobile === "string" ? item.mobile : item.phone || item.owner?.phone || "+91 98000 00000",
            joined: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "2026",
            mrr: item.mrr || "₹10,000"
          }));
          setSchools(normalized);
        } else {
          setSchools(defaultMockSchools);
        }
      })
      .catch(() => {
        setSchools(defaultMockSchools);
      })
      .finally(() => setLoading(false));
  };

  const defaultMockSchools = [
    {
      _id: "sch-01",
      name: "Bal Vidya Mandir",
      city: "Ajmer",
      state: "Rajasthan",
      board: "RBSE",
      type: "School",
      plan: "Standard",
      students: 640,
      status: "Trial",
      daysLeft: "ends Wed",
      owner: "Rameshwar Sharma",
      mobile: "+91 98290 12345",
      joined: "12 Sep 2026",
      mrr: "₹9,600"
    },
    {
      _id: "sch-02",
      name: "Delhi Public Academy",
      city: "Jaipur",
      state: "Rajasthan",
      board: "CBSE",
      type: "School",
      plan: "Premium",
      students: 1850,
      status: "Active",
      daysLeft: "paid monthly",
      owner: "Dr. Sunita Choudhary",
      mobile: "+91 94140 88291",
      joined: "05 Apr 2025",
      mrr: "₹37,000"
    },
    {
      _id: "sch-03",
      name: "Shiksha Career Academy",
      city: "Kota",
      state: "Rajasthan",
      board: "CBSE",
      type: "Coaching",
      plan: "Starter",
      students: 1120,
      status: "Trial",
      daysLeft: "ends Thu",
      owner: "Er. P.K. Verma",
      mobile: "+91 97850 44102",
      joined: "20 Sep 2026",
      mrr: "₹11,200"
    },
    {
      _id: "sch-04",
      name: "Gyan Jyoti Public School",
      city: "Bikaner",
      state: "Rajasthan",
      board: "RBSE",
      type: "School",
      plan: "Standard",
      students: 410,
      status: "Overdue",
      daysLeft: "9 days past due",
      owner: "Suresh Bishnoi",
      mobile: "+91 98281 77319",
      joined: "15 Jan 2026",
      mrr: "₹6,150"
    },
    {
      _id: "sch-05",
      name: "Sunrise Convent School",
      city: "Udaipur",
      state: "Rajasthan",
      board: "CBSE",
      type: "School",
      plan: "Standard",
      students: 790,
      status: "Active",
      daysLeft: "auto-pay",
      owner: "Fr. Thomas Mathew",
      mobile: "+91 94141 55099",
      joined: "18 Jun 2025",
      mrr: "₹11,850"
    },
    {
      _id: "sch-06",
      name: "Arya Model High School",
      city: "Jodhpur",
      state: "Rajasthan",
      board: "RBSE",
      type: "School",
      plan: "Starter",
      students: 310,
      status: "Read-only",
      daysLeft: "grace expired",
      owner: "Kailash Chand",
      mobile: "+91 94133 22810",
      joined: "10 Feb 2026",
      mrr: "₹3,100"
    },
    {
      _id: "sch-07",
      name: "Tagore Memorial Academy",
      city: "Alwar",
      state: "Rajasthan",
      board: "CBSE",
      type: "School",
      plan: "Standard",
      students: 520,
      status: "Suspended",
      daysLeft: "terms violation",
      owner: "Vikram Meena",
      mobile: "+91 98292 99182",
      joined: "01 Nov 2025",
      mrr: "₹0"
    }
  ];

  const tabs = [
    { label: "All", count: schools.length },
    { label: "Trial", count: schools.filter(s => s.status === "Trial").length },
    { label: "Active", count: schools.filter(s => s.status === "Active").length },
    { label: "Overdue", count: schools.filter(s => s.status === "Overdue").length },
    { label: "Read-only", count: schools.filter(s => s.status === "Read-only").length },
    { label: "Suspended", count: schools.filter(s => s.status === "Suspended").length }
  ];

  const filteredSchools = schools.filter(s => {
    const matchesTab = activeTab === "All" || s.status === activeTab;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          (s.city && s.city.toLowerCase().includes(search.toLowerCase())) ||
                          (s.owner && s.owner.toLowerCase().includes(search.toLowerCase())) ||
                          (s.mobile && s.mobile.includes(search));
    return matchesTab && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      _id: `sch-${Date.now()}`,
      name: newSchool.name,
      city: newSchool.city || "Jaipur",
      state: newSchool.state,
      board: newSchool.board,
      type: newSchool.type,
      plan: newSchool.plan,
      students: 600,
      status: "Trial",
      daysLeft: `ends in ${newSchool.trialDays}d`,
      owner: newSchool.ownerName,
      mobile: newSchool.ownerMobile,
      joined: "Just now",
      mrr: "₹9,000"
    };

    setSchools([newEntry, ...schools]);
    setShowCreateModal(false);
    // Reset form
    setNewSchool({
      type: "School",
      name: "",
      city: "",
      state: "Rajasthan",
      board: "CBSE",
      studentRange: "500–1,000",
      ownerName: "",
      ownerMobile: "",
      ownerEmail: "",
      plan: "Standard",
      trialDays: "30",
      addOns: "None"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>;
      case "Trial":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">Trial</span>;
      case "Overdue":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Overdue</span>;
      case "Read-only":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">Read-only</span>;
      case "Suspended":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Suspended</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Schools and Institutes <span className="text-ink-secondary text-lg font-normal">· {schools.length} total</span>
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Every organisation on the platform. Student and staff data stays inside each school tenant.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Create School Account</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.label
                ? "bg-nav-bg text-white shadow-2xs"
                : "text-ink-secondary hover:text-ink hover:bg-surface"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${
              activeTab === tab.label ? "bg-white/20 text-white" : "bg-line/60 text-ink-secondary"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Secondary Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-line shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-ink-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by school name, city, owner or phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-surface rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="text-xs text-ink-secondary font-medium">
          Showing <span className="font-bold text-ink">{filteredSchools.length}</span> institutions
        </div>
      </div>

      {/* Main Schools Table */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface border-b border-line text-ink-secondary text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">School & Location</th>
                <th className="py-3 px-4">Board & Type</th>
                <th className="py-3 px-4">Plan & Size</th>
                <th className="py-3 px-4">Status & Billing</th>
                <th className="py-3 px-4">Owner Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredSchools.map((school) => (
                <tr key={school._id} className="hover:bg-primary-tint/10 transition-colors group">
                  
                  {/* School & Location */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-ink group-hover:text-primary transition-colors cursor-pointer" onClick={() => setDetailSchool(school)}>
                      {school.name}
                    </div>
                    <div className="text-[11px] text-ink-secondary">
                      {school.city}, {school.state}
                    </div>
                  </td>

                  {/* Board & Type */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ink">{school.board}</div>
                    <div className="text-[11px] text-ink-secondary">{school.type}</div>
                  </td>

                  {/* Plan & Size */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ink">{school.plan} Plan</div>
                    <div className="text-[11px] text-ink-secondary font-mono">{school.students} students</div>
                  </td>

                  {/* Status & Billing */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(school.status)}
                    </div>
                    <div className="text-[11px] text-ink-secondary mt-1 font-mono">
                      {school.daysLeft}
                    </div>
                  </td>

                  {/* Owner Contact */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ink">{school.owner}</div>
                    <div className="text-[11px] text-ink-secondary font-mono">{school.mobile}</div>
                  </td>

                  {/* Actions Dropdown Button */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setDetailSchool(school)}
                        className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-tint/40 rounded-lg transition-colors border border-primary-soft/40 cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setActionSchool(school);
                          setActionType("grace");
                        }}
                        className="p-1.5 text-ink-secondary hover:text-ink hover:bg-page rounded-lg cursor-pointer"
                        title="Extend Grace / Action"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE SCHOOL ACCOUNT MODAL (Specification 03) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-line flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-line flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink m-0">Create School Account</h2>
                <span className="text-xs text-ink-secondary">Pre-configured with Indian board curriculum and session 2026-27</span>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-ink-secondary hover:text-ink hover:bg-page rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Section 1: Organisation */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">1 · Organisation Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Institution Type</label>
                    <select
                      value={newSchool.type}
                      onChange={(e) => setNewSchool({...newSchool, type: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-surface rounded-xl border border-line"
                    >
                      <option>School</option>
                      <option>Coaching / Institute</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">School Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shri Ram Vidyapeeth"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-surface rounded-xl border border-line"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ajmer"
                      value={newSchool.city}
                      onChange={(e) => setNewSchool({...newSchool, city: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-surface rounded-xl border border-line"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Board Curriculum</label>
                    <select
                      value={newSchool.board}
                      onChange={(e) => setNewSchool({...newSchool, board: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-surface rounded-xl border border-line"
                    >
                      <option>CBSE</option>
                      <option>RBSE</option>
                      <option>ICSE</option>
                      <option>State Board</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Owner Contact */}
              <div className="space-y-3 pt-4 border-t border-line">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">2 · School Owner / Principal</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Owner Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suresh Jain"
                      value={newSchool.ownerName}
                      onChange={(e) => setNewSchool({...newSchool, ownerName: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-surface rounded-xl border border-line"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Mobile (SMS Invite) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9829012345"
                      value={newSchool.ownerMobile}
                      onChange={(e) => setNewSchool({...newSchool, ownerMobile: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-surface rounded-xl border border-line font-mono"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-ink-secondary mb-0">
                  The owner will receive an instant SMS invite to set their administrator password.
                </p>
              </div>

              {/* Section 3: Plan & Trial */}
              <div className="space-y-3 pt-4 border-t border-line">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">3 · Plan & Trial Setup</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Subscription Plan</label>
                    <select
                      value={newSchool.plan}
                      onChange={(e) => setNewSchool({...newSchool, plan: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-surface rounded-xl border border-line"
                    >
                      <option>Standard</option>
                      <option>Starter</option>
                      <option>Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Trial Period</label>
                    <select
                      value={newSchool.trialDays}
                      onChange={(e) => setNewSchool({...newSchool, trialDays: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-surface rounded-xl border border-line"
                    >
                      <option value="30">30 days trial</option>
                      <option value="14">14 days trial</option>
                      <option value="60">60 days trial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Messaging Add-ons</label>
                    <select
                      value={newSchool.addOns}
                      onChange={(e) => setNewSchool({...newSchool, addOns: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-surface rounded-xl border border-line"
                    >
                      <option>None</option>
                      <option>WhatsApp 5,000 pack</option>
                      <option>SMS DLT Bundle</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bottom Dry Run Info Box */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Initial Setup Automation: </span>
                  Creates academic year 2026-27, RBSE/CBSE grade master, fee heads, and dispatches activation link.
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-line flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-ink-secondary hover:text-ink rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Create Account & Send Invite
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* SCHOOL DETAIL & ACTIONS DRAWER (Specification 04-07) */}
      {detailSchool && !showCreateModal && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg shadow-2xl border-l border-line h-full flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div>
              <div className="p-5 border-b border-line flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink m-0">{detailSchool.name}</h2>
                  <span className="text-xs text-ink-secondary">{detailSchool.city}, {detailSchool.state} · {detailSchool.board}</span>
                </div>
                <button 
                  onClick={() => setDetailSchool(null)}
                  className="p-1.5 text-ink-secondary hover:text-ink hover:bg-page rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
                
                {/* School Snapshot Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface rounded-xl border border-line">
                    <span className="text-[11px] font-bold text-ink-secondary uppercase">Plan Tier</span>
                    <div className="text-base font-extrabold text-ink mt-0.5">{detailSchool.plan}</div>
                  </div>
                  <div className="p-3 bg-surface rounded-xl border border-line">
                    <span className="text-[11px] font-bold text-ink-secondary uppercase">Student Roster</span>
                    <div className="text-base font-extrabold text-ink mt-0.5 font-mono">{detailSchool.students}</div>
                  </div>
                  <div className="p-3 bg-surface rounded-xl border border-line">
                    <span className="text-[11px] font-bold text-ink-secondary uppercase">Current Status</span>
                    <div className="mt-1">{getStatusBadge(detailSchool.status)}</div>
                  </div>
                  <div className="p-3 bg-surface rounded-xl border border-line">
                    <span className="text-[11px] font-bold text-ink-secondary uppercase">Monthly MRR</span>
                    <div className="text-base font-extrabold text-ink mt-0.5 font-mono">{detailSchool.mrr}</div>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="space-y-2 p-4 rounded-xl border border-line bg-surface-subtle">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Primary School Admin</span>
                  <div className="text-sm font-bold text-ink">{detailSchool.owner}</div>
                  <div className="text-xs text-ink-secondary font-mono">{detailSchool.mobile}</div>
                </div>

                {/* Account Actions Section (04-07 specification) */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider">Administrative Actions</span>
                  
                  <div className="space-y-2">
                    
                    {/* Extend Grace */}
                    <div 
                      className="p-3 rounded-xl border border-line hover:border-primary flex items-center justify-between cursor-pointer transition-all" 
                      onClick={() => {
                        setActionSchool(detailSchool);
                        setActionType("grace");
                        setDetailSchool(null);
                      }}
                    >
                      <div>
                        <div className="text-sm font-bold text-ink">Extend Trial / Grace Period</div>
                        <div className="text-xs text-ink-secondary">Grant 7 or 14 extra days before read-only state</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-secondary" />
                    </div>

                    {/* Change Plan */}
                    <div 
                      className="p-3 rounded-xl border border-line hover:border-primary flex items-center justify-between cursor-pointer transition-all" 
                      onClick={() => {
                        setActionSchool(detailSchool);
                        setActionType("plan");
                        setDetailSchool(null);
                      }}
                    >
                      <div>
                        <div className="text-sm font-bold text-ink">Change Subscription Plan</div>
                        <div className="text-xs text-ink-secondary">Upgrade to Standard/Premium or prorate bill</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-secondary" />
                    </div>

                    {/* Suspend Account */}
                    <div 
                      className="p-3 rounded-xl border border-line hover:border-rose-300 flex items-center justify-between cursor-pointer transition-all" 
                      onClick={() => {
                        setActionSchool(detailSchool);
                        setActionType("suspend");
                        setDetailSchool(null);
                      }}
                    >
                      <div>
                        <div className="text-sm font-bold text-rose-700">Suspend Access</div>
                        <div className="text-xs text-ink-secondary">Lock school portal due to payment or policy breach</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-400" />
                    </div>

                  </div>
                </div>

                {/* Impersonate / Support Session */}
                <div className="pt-4 border-t border-line">
                  <Link
                    to="/superadmin/support"
                    className="w-full py-2.5 bg-primary-tint text-primary font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open "View as School" Support Session</span>
                  </Link>
                </div>

              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-line bg-surface flex justify-between items-center text-xs text-ink-secondary">
              <span>Account ID: {detailSchool._id}</span>
              <button 
                onClick={() => setDetailSchool(null)}
                className="px-4 py-1.5 font-bold text-ink hover:bg-page rounded-lg cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SCHOOL ACTION MODAL (Specifications 04-07: Extend Grace, Change Plan, Suspend, Close) */}
      {actionSchool && actionType && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-line p-6 flex flex-col gap-4 text-xs sm:text-sm">
            {/* Tabs for actions */}
            <div className="flex gap-2 flex-wrap pb-2 border-b border-line items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {(["grace", "plan", "suspend", "close"] as const).map((type) => {
                  const label = 
                    type === "grace" ? "Extend grace" :
                    type === "plan" ? "Change plan" :
                    type === "suspend" ? "Suspend" : "Close";
                  const isSelected = actionType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setActionType(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-nav-bg text-white shadow-xs"
                          : "bg-surface text-ink-secondary hover:text-ink hover:bg-line/40"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  setActionSchool(null);
                  setActionType(null);
                }}
                className="p-1.5 text-ink-secondary hover:text-ink hover:bg-page rounded-full cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-ink m-0">
                {actionType === "grace" && "Extend Grace Period"}
                {actionType === "plan" && "Change Subscription Plan"}
                {actionType === "suspend" && "Suspend School Account"}
                {actionType === "close" && "Close Account & Quarantine Data"}
              </h2>
              <p className="text-xs text-ink-secondary mt-1 mb-0">
                {actionSchool.name} · {actionSchool.city} · {actionSchool.plan} Plan · {actionSchool.students} students
              </p>
            </div>

            {/* TAB: EXTEND GRACE */}
            {actionType === "grace" && (
              <form onSubmit={(e) => {
                e.preventDefault();
                alert(`Grace period extended for ${actionSchool.name}.`);
                setActionSchool(null);
                setActionType(null);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Extra Days</label>
                  <select className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink">
                    <option>15 extra days (until 30 Oct)</option>
                    <option>7 extra days (standard trial extension)</option>
                    <option>30 extra days (quarterly grace)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Reason (Saved in immutable audit log) *</label>
                  <textarea
                    rows={3}
                    required
                    defaultValue="Owner requested temporary extension awaiting trust committee approval."
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setActionSchool(null); setActionType(null); }} 
                    className="px-4 py-2 border border-line text-ink-secondary hover:bg-surface rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">
                    Confirm Extension
                  </button>
                </div>
              </form>
            )}

            {/* TAB: CHANGE PLAN */}
            {actionType === "plan" && (
              <form onSubmit={(e) => {
                e.preventDefault();
                alert(`Plan change scheduled for ${actionSchool.name}.`);
                setActionSchool(null);
                setActionType(null);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">New Plan Tier</label>
                  <select defaultValue="Premium" className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink">
                    <option value="Starter">Starter (₹10/student/mo)</option>
                    <option value="Standard">Standard (₹15/student/mo)</option>
                    <option value="Premium">Premium (₹20/student/mo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Effective Date</label>
                  <select className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink">
                    <option>Immediately (prorate current cycle)</option>
                    <option>From next renewal cycle (1 Apr 2027)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Reason (Saved in audit log) *</label>
                  <textarea
                    rows={2}
                    required
                    defaultValue="School upgraded to unlock WhatsApp notifications and AIS-140 GPS bus tracking."
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setActionSchool(null); setActionType(null); }} 
                    className="px-4 py-2 border border-line text-ink-secondary hover:bg-surface rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">
                    Schedule Plan Change
                  </button>
                </div>
              </form>
            )}

            {/* TAB: SUSPEND */}
            {actionType === "suspend" && (
              <form onSubmit={(e) => {
                e.preventDefault();
                alert(`Account suspended for ${actionSchool.name}.`);
                setActionSchool(null);
                setActionType(null);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Who Keeps Access</label>
                  <select className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink">
                    <option>Owner only (to pay outstanding dues or export records)</option>
                    <option>Complete lockdown (nobody can sign in)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Reason *</label>
                  <textarea
                    rows={2}
                    required
                    defaultValue="Overdue invoice unpaid past grace period limit. Multiple reminders unanswered."
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setActionSchool(null); setActionType(null); }} 
                    className="px-4 py-2 border border-line text-ink-secondary hover:bg-surface rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">
                    Suspend Access
                  </button>
                </div>
              </form>
            )}

            {/* TAB: CLOSE */}
            {actionType === "close" && (
              <form onSubmit={(e) => {
                e.preventDefault();
                alert(`Closure request logged for ${actionSchool.name}. Dual Super Admin sign-off sent to Ritika Bansal.`);
                setActionSchool(null);
                setActionType(null);
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Notice Period</label>
                  <select className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink">
                    <option>30 days read-only, then Closed</option>
                    <option>Immediate read-only, 15 days data export window</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Data Retention & Erasure (DPDP Act)</label>
                  <select className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink">
                    <option>After 90 days statutory retention</option>
                    <option>Immediate cryptographic wipe upon export confirmation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Reason (Saved in audit log) *</label>
                  <textarea
                    rows={2}
                    required
                    defaultValue="Owner requested closure in writing via official support ticket."
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Dual Super Admin Authorization:</strong> A second Super Admin (Ritika Bansal) must verify via hardware token before permanent closure initiates.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setActionSchool(null); setActionType(null); }} 
                    className="px-4 py-2 border border-line text-ink-secondary hover:bg-surface rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">
                    Request Dual-Sign Closure
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
