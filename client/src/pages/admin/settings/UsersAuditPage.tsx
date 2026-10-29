import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import {
  MdSecurity,
  MdAdd,
  MdLock,
  MdLockOpen,
  MdFileDownload,
  MdCheck,
  MdClose,
  MdSend,
  MdEdit,
  MdContentCopy,
  MdShield,
  MdSearch,
} from "react-icons/md";

interface UserItem {
  id: string;
  name: string;
  username: string;
  type: "staff" | "parent";
  roles: string[];
  scope: string;
  twoStep: "on" | "missing" | "not_needed";
  lastActive: string;
  isLocked?: boolean;
  mobile?: string;
  studentWard?: string;
}

const DEFAULT_USERS: UserItem[] = [
  {
    id: "u-1",
    name: "Meera Kumawat",
    username: "meera.k",
    type: "staff",
    roles: ["School Admin"],
    scope: "Whole school",
    twoStep: "on",
    lastActive: "2 min ago",
    mobile: "98290 61122",
  },
  {
    id: "u-2",
    name: "Dr. Kavita Rao",
    username: "principal",
    type: "staff",
    roles: ["Principal"],
    scope: "Whole school",
    twoStep: "on",
    lastActive: "1 h ago",
    mobile: "98290 54321",
  },
  {
    id: "u-3",
    name: "Rekha Jain",
    username: "rekha.j",
    type: "staff",
    roles: ["Accountant (Mansarovar)"],
    scope: "Mansarovar campus",
    twoStep: "on",
    lastActive: "10 min ago",
    mobile: "98290 87654",
  },
  {
    id: "u-4",
    name: "Anil Sharma",
    username: "anil.s",
    type: "staff",
    roles: ["Subject Teacher", "Exam Coordinator"],
    scope: "Classes 9–12 · exams",
    twoStep: "missing",
    lastActive: "35 min ago",
    mobile: "98290 23456",
  },
  {
    id: "u-5",
    name: "Sunita Rathore",
    username: "98290 31100",
    type: "staff",
    roles: ["Class Teacher", "Subject Teacher"],
    scope: "8-B · Science 7–8",
    twoStep: "not_needed",
    lastActive: "5 min ago",
    mobile: "98290 31100",
  },
  {
    id: "u-6",
    name: "Counter 2",
    username: "counter2",
    type: "staff",
    roles: ["Fee Counter Clerk"],
    scope: "Mansarovar campus",
    twoStep: "not_needed",
    lastActive: "Locked 08:47",
    isLocked: true,
    mobile: "98290 99887",
  },
  {
    id: "u-7",
    name: "Neha Saini",
    username: "neha.s",
    type: "staff",
    roles: ["Front Office"],
    scope: "Mansarovar campus",
    twoStep: "not_needed",
    lastActive: "Yesterday",
    mobile: "98290 44556",
  },
  {
    id: "u-8",
    name: "Vikram Singh",
    username: "99280 62233",
    type: "staff",
    roles: ["Subject Teacher"],
    scope: "Maths 7–8",
    twoStep: "not_needed",
    lastActive: "20 min ago",
    mobile: "99280 62233",
  },
  // Sample parents
  {
    id: "p-1",
    name: "Rajesh Sharma",
    username: "98290 11223",
    type: "parent",
    roles: ["Guardian / Parent"],
    scope: "Ward: Aarav Sharma (6-A)",
    twoStep: "on",
    lastActive: "Today 08:15",
    studentWard: "Aarav Sharma · 6-A",
    mobile: "98290 11223",
  },
  {
    id: "p-2",
    name: "Anita Meena",
    username: "98290 44332",
    type: "parent",
    roles: ["Guardian / Parent"],
    scope: "Ward: Arjun Meena (6-B)",
    twoStep: "on",
    lastActive: "Yesterday",
    studentWard: "Arjun Meena · 6-B",
    mobile: "98290 44332",
  },
  {
    id: "p-3",
    name: "Vikas Sethi",
    username: "98290 77889",
    type: "parent",
    roles: ["Guardian / Parent"],
    scope: "Ward: Pihu Sethi (4-C)",
    twoStep: "missing",
    lastActive: "3 days ago",
    studentWard: "Pihu Sethi · 4-C",
    mobile: "98290 77889",
  },
];

interface RoleDef {
  id: string;
  name: string;
  badge: "Default" | "Custom" | "Default · auto scope";
  usersCount: number;
  description: string;
  permissions: Record<string, Record<string, boolean>>;
}

const MODULES_LIST = [
  "Students",
  "Attendance",
  "Examinations",
  "Fees",
  "Accounts",
  "Staff & HR",
  "Transport",
  "Hostel",
  "Library",
  "Inventory",
  "Reports",
  "Settings",
];

const PERM_ACTIONS = ["View", "Create", "Edit", "Delete", "Approve", "Print", "Export"];

const DEFAULT_ROLES: RoleDef[] = [
  {
    id: "admin",
    name: "School Admin",
    badge: "Default",
    usersCount: 3,
    description: "Full access across all school branches, finance, staff and system settings",
    permissions: MODULES_LIST.reduce((acc, m) => {
      acc[m] = PERM_ACTIONS.reduce((pAcc, a) => ({ ...pAcc, [a]: true }), {});
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
  {
    id: "principal",
    name: "Principal",
    badge: "Default",
    usersCount: 1,
    description: "Academic supervision, TC issuance, disciplinary approvals, audit inspection",
    permissions: MODULES_LIST.reduce((acc, m) => {
      acc[m] = {
        View: true,
        Create: true,
        Edit: m !== "Settings",
        Delete: false,
        Approve: true,
        Print: true,
        Export: true,
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
  {
    id: "class_teacher",
    name: "Class Teacher",
    badge: "Default · auto scope",
    usersCount: 41,
    description: "Scoped to assigned class: attendance, report remarks, student homework and notices",
    permissions: MODULES_LIST.reduce((acc, m) => {
      const isRelevant = ["Students", "Attendance", "Examinations", "Reports"].includes(m);
      acc[m] = {
        View: isRelevant,
        Create: ["Attendance", "Examinations"].includes(m),
        Edit: ["Attendance", "Examinations"].includes(m),
        Delete: false,
        Approve: false,
        Print: isRelevant,
        Export: isRelevant,
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
  {
    id: "subject_teacher",
    name: "Subject Teacher",
    badge: "Default · auto scope",
    usersCount: 58,
    description: "Enter subject marks, mark lesson syllabus, create homework and assignments",
    permissions: MODULES_LIST.reduce((acc, m) => {
      const isRelevant = ["Attendance", "Examinations"].includes(m);
      acc[m] = {
        View: isRelevant,
        Create: isRelevant,
        Edit: isRelevant,
        Delete: false,
        Approve: false,
        Print: isRelevant,
        Export: false,
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
  {
    id: "exam_coord",
    name: "Exam Coordinator",
    badge: "Default",
    usersCount: 2,
    description: "Define exam schedules, grade thresholds, verify marks entry, lock/unlock ledger",
    permissions: MODULES_LIST.reduce((acc, m) => {
      const isExams = ["Examinations", "Students", "Reports"].includes(m);
      acc[m] = {
        View: isExams,
        Create: m === "Examinations",
        Edit: m === "Examinations",
        Delete: false,
        Approve: m === "Examinations",
        Print: isExams,
        Export: isExams,
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
  {
    id: "accountant_mansarovar",
    name: "Accountant (Mansarovar)",
    badge: "Custom",
    usersCount: 2,
    description: "Cloned from Accountant · scope: one branch · 2 users",
    permissions: MODULES_LIST.reduce((acc, m) => {
      const isFinance = ["Fees", "Accounts", "Students", "Reports"].includes(m);
      acc[m] = {
        View: isFinance,
        Create: ["Fees", "Accounts"].includes(m),
        Edit: ["Fees", "Accounts"].includes(m),
        Delete: false,
        Approve: m === "Fees",
        Print: isFinance,
        Export: isFinance,
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
  {
    id: "fee_clerk",
    name: "Fee Counter Clerk",
    badge: "Default",
    usersCount: 3,
    description: "Counter collections, receipt printing, daily cash hand-over register",
    permissions: MODULES_LIST.reduce((acc, m) => {
      acc[m] = {
        View: m === "Fees" || m === "Students",
        Create: m === "Fees",
        Edit: false,
        Delete: false,
        Approve: false,
        Print: m === "Fees",
        Export: false,
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
  {
    id: "front_office",
    name: "Front Office",
    badge: "Default",
    usersCount: 2,
    description: "Visitor badges, parent reception, telephone directory, complaints intake",
    permissions: MODULES_LIST.reduce((acc, m) => {
      acc[m] = {
        View: ["Students", "Staff & HR"].includes(m),
        Create: false,
        Edit: false,
        Delete: false,
        Approve: false,
        Print: true,
        Export: false,
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
  {
    id: "hr_mgr",
    name: "HR Manager",
    badge: "Default",
    usersCount: 1,
    description: "Staff hiring records, biometric sync, leave recommendations, monthly payroll",
    permissions: MODULES_LIST.reduce((acc, m) => {
      acc[m] = {
        View: ["Staff & HR", "Reports"].includes(m),
        Create: m === "Staff & HR",
        Edit: m === "Staff & HR",
        Delete: false,
        Approve: m === "Staff & HR",
        Print: m === "Staff & HR",
        Export: m === "Staff & HR",
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
  {
    id: "librarian",
    name: "Librarian",
    badge: "Default",
    usersCount: 1,
    description: "Book barcode cataloging, student card check-out, fine receipts",
    permissions: MODULES_LIST.reduce((acc, m) => {
      acc[m] = {
        View: ["Library", "Students"].includes(m),
        Create: m === "Library",
        Edit: m === "Library",
        Delete: false,
        Approve: false,
        Print: m === "Library",
        Export: m === "Library",
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>),
  },
];

interface AuditEntry {
  id: string;
  time: string;
  actionBadge: "UNLOCK" | "CANCEL" | "UPDATE" | "CREATE" | "EXPORT" | "LOCK";
  badgeBg: string;
  badgeColor: string;
  module: string;
  title: string;
  changeSummary: string;
  actor: string;
  ip: string;
  isSensitive?: boolean;
}

const DEFAULT_AUDIT: AuditEntry[] = [
  {
    id: "aud-1",
    time: "10:42",
    actionBadge: "UNLOCK",
    badgeBg: "#FFF6EC",
    badgeColor: "#7A4106",
    module: "Marks",
    title: "Marks · Half-Yearly Science 8-B",
    changeSummary: "Roll 06: 84 → 74 · reason: typing error",
    actor: "Sunita Rathore (request) · approved by Exam Coordinator",
    ip: "10.0.4.21",
    isSensitive: true,
  },
  {
    id: "aud-2",
    time: "10:31",
    actionBadge: "CANCEL",
    badgeBg: "#FFF6EC",
    badgeColor: "#7A4106",
    module: "Fees",
    title: "Receipt RCP/2627/004190",
    changeSummary: "₹16,900 · wrong student selected · reversal entry posted",
    actor: "Accountant Rekha Jain · approved by Principal",
    ip: "10.0.2.14",
    isSensitive: true,
  },
  {
    id: "aud-3",
    time: "10:12",
    actionBadge: "UPDATE",
    badgeBg: "#E3EFEF",
    badgeColor: "#08393F",
    module: "Students",
    title: "Student · Aarav Gupta · father's mobile",
    changeSummary: "98290 1xxxx → 98290 7xxxx · parent request from app",
    actor: "Meera Kumawat · School Admin",
    ip: "10.0.1.5",
    isSensitive: false,
  },
  {
    id: "aud-4",
    time: "09:58",
    actionBadge: "CREATE",
    badgeBg: "#E4F1E8",
    badgeColor: "#1E5A33",
    module: "Fees",
    title: "Concession · Pihu Sethi",
    changeSummary: "Sibling 10% on tuition, 2026-27",
    actor: "Accountant Rekha Jain · pending approval",
    ip: "10.0.2.14",
    isSensitive: true,
  },
  {
    id: "aud-5",
    time: "09:40",
    actionBadge: "EXPORT",
    badgeBg: "#F1EEE6",
    badgeColor: "#5A4A24",
    module: "Students",
    title: "Student list · Class 10 (52 rows)",
    changeSummary: "Excel, watermarked with requester UID",
    actor: "Exam Coordinator Anil Sharma",
    ip: "10.0.4.18",
    isSensitive: false,
  },
  {
    id: "aud-6",
    time: "09:05",
    actionBadge: "UPDATE",
    badgeBg: "#E3EFEF",
    badgeColor: "#08393F",
    module: "Settings",
    title: "School Profile · CBSE Affiliation details updated",
    changeSummary: "Affiliation no. renewed through March 2028",
    actor: "Dr. Kavita Rao · Principal",
    ip: "10.0.1.2",
    isSensitive: true,
  },
  {
    id: "aud-7",
    time: "08:47",
    actionBadge: "LOCK",
    badgeBg: "#FDE8E8",
    badgeColor: "#9B1C1C",
    module: "Fees",
    title: "Fee Counter Terminal 2 Suspended",
    changeSummary: "Excessive failed sign-in attempts from unexpected IP subnet",
    actor: "Automated Threat Defense Sentinel",
    ip: "192.168.1.99",
    isSensitive: true,
  },
];

export default function UsersAuditPage({ initialTab }: { initialTab?: "users" | "roles" | "audit" }) {
  const { showToast } = useToast();
  const location = useLocation();

  // Determine initial tab from props or route
  const defaultTab = useMemo(() => {
    if (initialTab) return initialTab;
    if (location.pathname.includes("roles")) return "roles";
    if (location.pathname.includes("audit")) return "audit";
    return "users";
  }, [initialTab, location.pathname]);

  const [activeTab, setActiveTab] = useState<"users" | "roles" | "audit">(defaultTab);

  // Users State (Screen 40)
  const [users, setUsers] = useState<UserItem[]>(DEFAULT_USERS);
  const [userFilter, setUserFilter] = useState<"staff" | "parent" | "locked" | "2fa_missing">("staff");
  const [userSearch, setUserSearch] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "Subject Teacher",
    scope: "Classes 6–8",
  });

  // Roles State (Screen 41)
  const [roles, setRoles] = useState<RoleDef[]>(DEFAULT_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState("accountant_mansarovar");
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [cloneForm, setCloneForm] = useState({
    sourceRoleId: "accountant_mansarovar",
    newRoleName: "",
    scope: "One branch",
  });

  // Audit State (Screen 42)
  const [auditEntries] = useState<AuditEntry[]>(DEFAULT_AUDIT);
  const [moduleFilter, setModuleFilter] = useState("All");
  const [userAuditFilter, setUserAuditFilter] = useState("Anyone");
  const [auditDate, setAuditDate] = useState("2026-10-09");
  const [sensitiveOnly, setSensitiveOnly] = useState(false);

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  // Users Filter
  const filteredUsers = users.filter((u) => {
    if (userFilter === "staff" && u.type !== "staff") return false;
    if (userFilter === "parent" && u.type !== "parent") return false;
    if (userFilter === "locked" && !u.isLocked) return false;
    if (userFilter === "2fa_missing" && u.twoStep !== "missing") return false;

    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.roles.some((r) => r.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Audit Filter
  const filteredAudit = auditEntries.filter((e) => {
    if (moduleFilter !== "All" && e.module !== moduleFilter) return false;
    if (userAuditFilter !== "Anyone" && !e.actor.includes(userAuditFilter)) return false;
    if (sensitiveOnly && !e.isSensitive) return false;
    return true;
  });

  const handleUnlockUser = (id: string, name: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isLocked: false, lastActive: "Just now" } : u))
    );
    showToast(`Account for ${name} unlocked successfully.`, "success");
  };

  const handleRemind2FA = (name: string, mobile?: string) => {
    showToast(`2-Step verification reminder sent via WhatsApp to ${name} (${mobile || "registered phone"}).`, "info");
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.mobile) {
      showToast("Please provide staff name and mobile number.", "error");
      return;
    }
    const newUser: UserItem = {
      id: `u-${Date.now()}`,
      name: inviteForm.name,
      username: inviteForm.mobile,
      type: "staff",
      roles: [inviteForm.role],
      scope: inviteForm.scope,
      twoStep: "missing",
      lastActive: "Invited just now",
      mobile: inviteForm.mobile,
    };
    setUsers([newUser, ...users]);
    setShowInviteModal(false);
    setInviteForm({ name: "", mobile: "", email: "", role: "Subject Teacher", scope: "Classes 6–8" });
    showToast(`Invitation SMS & WhatsApp dispatch sent to ${newUser.name}.`, "success");
  };

  const handleTogglePermission = (mod: string, act: string) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRoleId) return r;
        const currentMod = r.permissions[mod] || {};
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [mod]: {
              ...currentMod,
              [act]: !currentMod[act],
            },
          },
        };
      })
    );
  };

  const handleSaveRole = () => {
    showToast(`Permissions updated for role "${selectedRole.name}".`, "success");
  };

  const handleCloneRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneForm.newRoleName.trim()) {
      showToast("Please specify a title for the new role.", "error");
      return;
    }
    const source = roles.find((r) => r.id === cloneForm.sourceRoleId) || roles[0];
    const newId = `role-${Date.now()}`;
    const newRole: RoleDef = {
      id: newId,
      name: cloneForm.newRoleName,
      badge: "Custom",
      usersCount: 0,
      description: `Cloned from ${source.name} · scope: ${cloneForm.scope}`,
      permissions: JSON.parse(JSON.stringify(source.permissions)),
    };
    setRoles([...roles, newRole]);
    setSelectedRoleId(newId);
    setShowCloneModal(false);
    setCloneForm({ sourceRoleId: "accountant_mansarovar", newRoleName: "", scope: "One branch" });
    showToast(`Role "${newRole.name}" created and loaded into access matrix!`, "success");
  };

  const handleExportAudit = () => {
    showToast("Generating watermarked audit ledger (PDF) with digital timestamp...", "info");
  };

  const tabTitles = {
    users: {
      breadcrumb: "Users",
      title: "Users",
      subtitle: "108 staff logins · 2,031 parent logins (1,412 active in the app)",
    },
    roles: {
      breadcrumb: "Roles & permissions",
      title: "Roles and permissions",
      subtitle: "11 standard roles · 2 custom roles · fine-grained action permissions",
    },
    audit: {
      breadcrumb: "Audit log",
      title: "System audit log",
      subtitle: "Every change to students, marks, fees, payroll, roles and settings. Entries cannot be edited or deleted.",
    },
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching Settings, Reports & Communication) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
           Users & Audit › {tabTitles[activeTab].breadcrumb}
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            {tabTitles[activeTab].title}
          </h1>
          <div className="text-[13px] text-ink-secondary">
            {tabTitles[activeTab].subtitle}
          </div>
        </div>

        {activeTab === "users" && (
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-2 active:scale-[0.98]"
          >
            <MdAdd size={18} />
            <span>Invite staff user</span>
          </button>
        )}
        {activeTab === "roles" && (
          <button
            type="button"
            onClick={handleSaveRole}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-2 active:scale-[0.98]"
          >
            <MdCheck size={18} />
            <span>Save role</span>
          </button>
        )}
        {activeTab === "audit" && (
          <button
            type="button"
            onClick={handleExportAudit}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-[13px] font-semibold text-ink transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <MdFileDownload size={16} />
            <span>Export (watermarked)</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs (Screen 40 / 41 / 42) */}
      <nav aria-label="Users and audit" className="flex gap-1 border-b border-line overflow-x-auto">
        {[
          { id: "users", label: "Users" },
          { id: "roles", label: "Roles & permissions" },
          { id: "audit", label: "Audit log" },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`min-h-[28px] px-4 text-sm font-semibold whitespace-nowrap transition border-b-[3px] font-sans cursor-pointer ${
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-ink-secondary hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

        {/* =========================================================================
            TAB 1: USERS (Screen 40)
           ========================================================================= */}
        {activeTab === "users" && (
        <div className="space-y-4">
          {/* Filter Pills matching Screen 40 */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "staff", label: "Staff · 108" },
              { id: "parent", label: "Parents · 2,031" },
              { id: "locked", label: "Locked · 1" },
              { id: "2fa_missing", label: "Two-step missing · 2" },
            ].map((pill) => {
              const isActive = userFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setUserFilter(pill.id as any)}
                  className={`min-h-[36px] px-3.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                    isActive
                      ? "bg-nav-bg text-white border-nav-bg"
                      : "bg-white text-ink border-line-input hover:bg-slate-50"
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <div className="relative flex-1 sm:w-64">
                <MdSearch className="absolute left-3 top-2.5 text-ink-secondary" size={16} />
                <input
                  type="search"
                  placeholder="Search name, username or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 min-h-[36px] text-xs bg-white border border-line-input rounded-control focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Users Table matching Screen 40 */}
          <div className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[900px] border-collapse table-fixed">
                <colgroup>
                  <col className="w-[210px]" />
                  <col className="w-auto" />
                  <col className="w-[170px]" />
                  <col className="w-[170px]" />
                  <col className="w-[130px]" />
                  <col className="w-[120px]" />
                </colgroup>
                <thead>
                  <tr className="bg-surface-head text-ink border-b border-line text-xs font-semibold">
                    <th className="py-3 px-4 font-semibold whitespace-nowrap">User</th>
                    <th className="py-3 px-4 font-semibold">Roles</th>
                    <th className="py-3 px-4 font-semibold">Scope</th>
                    <th className="py-3 px-4 font-semibold whitespace-nowrap">Two-step login</th>
                    <th className="py-3 px-4 font-semibold whitespace-nowrap">Last active</th>
                    <th className="py-3 px-4 font-semibold text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-ink text-sm truncate">{u.name}</span>
                          <span className="text-xs text-ink-secondary font-mono">{u.username}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {u.roles.map((r, i) => (
                            <span
                              key={i}
                              className="text-xs font-semibold px-2 py-0.5 rounded-control bg-primary-tint text-primary-dark whitespace-nowrap"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-ink-secondary text-xs truncate" title={u.scope}>
                        {u.scope}
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        {u.twoStep === "on" && (
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success-bg text-success-text whitespace-nowrap">
                            On
                          </span>
                        )}
                        {u.twoStep === "missing" && (
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-warning-bg text-warning-text whitespace-nowrap">
                            Required, not set
                          </span>
                        )}
                        {u.twoStep === "not_needed" && (
                          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F1F2EF] text-ink-secondary whitespace-nowrap">
                            Not needed
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-ink-secondary text-xs font-mono whitespace-nowrap">
                        {u.lastActive}
                      </td>
                      <td className="py-2 px-4 text-right whitespace-nowrap">
                        {u.isLocked ? (
                          <button
                            type="button"
                            onClick={() => handleUnlockUser(u.id, u.name)}
                            className="min-h-[34px] px-3 rounded-control border border-primary bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <MdLockOpen size={14} /> <span>Unlock</span>
                          </button>
                        ) : u.twoStep === "missing" ? (
                          <button
                            type="button"
                            onClick={() => handleRemind2FA(u.name, u.mobile)}
                            className="min-h-[34px] px-3 rounded-control border border-line-input bg-white text-ink text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <MdSend size={13} className="text-ink-secondary" /> <span>Remind</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => showToast(`Edit user details for ${u.name}`, "info")}
                            className="min-h-[34px] px-3 rounded-control border border-line-input bg-white text-ink text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <MdEdit size={13} className="text-ink-secondary" /> <span>Edit</span>
                          </button>
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

        {/* =========================================================================
            TAB 2: ROLES & PERMISSIONS (Screen 41)
           ========================================================================= */}
        {activeTab === "roles" && (
        <div className="flex flex-wrap gap-5 items-start">
          {/* Left Roles Sidebar */}
          <div className="flex-1 basis-[240px] max-w-[280px] bg-white border border-line rounded-card p-2.5 flex flex-col gap-1 shadow-xs">
            {roles.map((r) => {
              const isSelected = r.id === selectedRoleId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`text-left min-h-[44px] px-3 py-1.5 rounded-control border-0 font-sans flex justify-between items-center gap-2 transition cursor-pointer ${
                    isSelected
                      ? "bg-primary-tint text-ink font-semibold"
                      : "bg-transparent text-ink hover:bg-surface-subtle font-normal"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm truncate">{r.name}</span>
                    <span className="text-[11px] text-ink-secondary font-normal">{r.badge}</span>
                  </div>
                  <span className="font-mono text-xs text-ink-secondary bg-white/70 px-1.5 py-0.5 rounded border border-line">
                    {r.usersCount}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowCloneModal(true)}
              className="mt-2 mx-1 min-h-[38px] rounded-control border border-dashed border-line-input bg-surface-subtle hover:bg-slate-50 text-xs font-medium text-ink transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MdContentCopy size={14} /> <span>Clone a role</span>
            </button>
          </div>

          {/* Right Permissions Matrix */}
          <div className="flex-[999] basis-[540px] min-w-0 bg-white border border-line rounded-card overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-line-row flex justify-between items-start gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-semibold text-ink m-0">{selectedRole.name}</h2>
                <p className="text-xs text-ink-secondary mt-1">{selectedRole.description}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[760px] border-collapse">
                <thead>
                  <tr className="bg-surface-head text-ink border-b border-line text-xs font-semibold">
                    <th className="py-3 px-4 font-semibold">Module</th>
                    {PERM_ACTIONS.map((a) => (
                      <th key={a} className="py-3 px-2 font-semibold text-center whitespace-nowrap">
                        {a}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-row">
                  {MODULES_LIST.map((mod) => {
                    const modPerms = selectedRole.permissions[mod] || {};
                    return (
                      <tr key={mod} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-ink text-xs sm:text-sm">{mod}</td>
                        {PERM_ACTIONS.map((act) => {
                          const isChecked = !!modPerms[act];
                          return (
                            <td key={act} className="py-2.5 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(mod, act)}
                                aria-label={`${mod} ${act}`}
                                className="w-[18px] h-[18px] rounded border-line-input text-primary focus:ring-primary cursor-pointer"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* =========================================================================
            TAB 3: AUDIT LOG (Screen 42)
           ========================================================================= */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            {/* Filter Bar matching Screen 42 */}
            <div className="flex flex-wrap items-center gap-3 bg-white border border-line rounded-card p-3.5 shadow-xs">
              <label className="flex items-center gap-2 text-xs text-ink-secondary font-medium">
                Module
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="min-h-[36px] px-2.5 rounded-control border border-line-input bg-white text-xs font-semibold text-ink focus:outline-none focus:border-primary"
                >
                  <option value="All">All modules</option>
                  <option value="Fees">Fees</option>
                  <option value="Marks">Marks</option>
                  <option value="Students">Students</option>
                  <option value="Settings">Settings</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs text-ink-secondary font-medium">
                User
                <select
                  value={userAuditFilter}
                  onChange={(e) => setUserAuditFilter(e.target.value)}
                  className="min-h-[36px] px-2.5 rounded-control border border-line-input bg-white text-xs font-semibold text-ink focus:outline-none focus:border-primary"
                >
                  <option value="Anyone">Anyone</option>
                  <option value="Sunita">Sunita Rathore</option>
                  <option value="Rekha">Rekha Jain</option>
                  <option value="Meera">Meera Kumawat</option>
                  <option value="Dr. Kavita">Dr. Kavita Rao</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs text-ink-secondary font-medium">
                Date
                <input
                  type="date"
                  value={auditDate}
                  onChange={(e) => setAuditDate(e.target.value)}
                  className="min-h-[36px] px-2.5 rounded-control border border-line-input bg-white text-xs text-ink focus:outline-none focus:border-primary"
                />
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-ink ml-auto cursor-pointer">
                <input
                  type="checkbox"
                  checked={sensitiveOnly}
                  onChange={(e) => setSensitiveOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <span>Sensitive actions only</span>
              </label>
            </div>

            {/* Audit Log Timeline Entries */}
            <div className="bg-white border border-line rounded-card overflow-hidden shadow-xs divide-y divide-line-row">
              {filteredAudit.map((entry) => (
                <div key={entry.id} className="grid grid-cols-[68px_1fr] gap-4 p-4 hover:bg-slate-50/70 transition-colors">
                  <span className="font-mono text-xs text-ink-secondary pt-0.5">{entry.time}</span>

                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        style={{ backgroundColor: entry.badgeBg, color: entry.badgeColor }}
                        className="text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase inline-flex items-center"
                      >
                        {entry.actionBadge}
                      </span>
                      <span className="text-sm font-semibold text-ink">{entry.title}</span>
                    </div>

                    <span className="text-xs text-ink-body2">{entry.changeSummary}</span>

                    <span className="text-[11.5px] text-ink-secondary font-mono">
                      {entry.actor} · {entry.ip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* =========================================================================
          MODAL: INVITE STAFF USER
         ========================================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card border border-line max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-line-row pb-3">
              <h3 className="font-semibold text-base text-ink m-0">Invite Staff Member</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-ink-secondary hover:text-ink cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-ink font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Joshi"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full min-h-[38px] px-3 bg-white border border-line-input rounded-control focus:outline-none focus:border-primary text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Mobile (Used for OTP Login)</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={inviteForm.mobile}
                  onChange={(e) => setInviteForm({ ...inviteForm, mobile: e.target.value })}
                  className="w-full min-h-[38px] px-3 bg-white border border-line-input rounded-control focus:outline-none focus:border-primary text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full min-h-[38px] px-3 bg-white border border-line-input rounded-control focus:outline-none focus:border-primary text-xs"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Classes 9–10 or Whole school"
                  value={inviteForm.scope}
                  onChange={(e) => setInviteForm({ ...inviteForm, scope: e.target.value })}
                  className="w-full min-h-[38px] px-3 bg-white border border-line-input rounded-control focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-line-row">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="min-h-[38px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[38px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CLONE A ROLE
         ========================================================================= */}
      {showCloneModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card border border-line max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-line-row pb-3">
              <h3 className="font-semibold text-base text-ink m-0">Clone an Existing Role</h3>
              <button
                type="button"
                onClick={() => setShowCloneModal(false)}
                className="text-ink-secondary hover:text-ink cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleCloneRole} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-ink font-semibold mb-1">Base Role to Copy From</label>
                <select
                  value={cloneForm.sourceRoleId}
                  onChange={(e) => setCloneForm({ ...cloneForm, sourceRoleId: e.target.value })}
                  className="w-full min-h-[38px] px-3 bg-white border border-line-input rounded-control focus:outline-none focus:border-primary text-xs"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">New Role Name</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Class Coordinator"
                  value={cloneForm.newRoleName}
                  onChange={(e) => setCloneForm({ ...cloneForm, newRoleName: e.target.value })}
                  className="w-full min-h-[38px] px-3 bg-white border border-line-input rounded-control focus:outline-none focus:border-primary text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Assigned Branch / Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Mansarovar Campus or Primary Wing"
                  value={cloneForm.scope}
                  onChange={(e) => setCloneForm({ ...cloneForm, scope: e.target.value })}
                  className="w-full min-h-[38px] px-3 bg-white border border-line-input rounded-control focus:outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-line-row">
                <button
                  type="button"
                  onClick={() => setShowCloneModal(false)}
                  className="min-h-[38px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[38px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  Create Cloned Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
