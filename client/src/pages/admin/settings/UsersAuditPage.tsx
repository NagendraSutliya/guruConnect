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

  return (
    <div className="min-h-screen bg-[#F5F6F3] font-sans text-[#17201D] p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto space-y-5">
        {/* Navigation Tabs (Screen 40 / 41 / 42) */}
        <nav aria-label="Users and audit" className="flex gap-1 border-b border-[#DDE2DE] overflow-x-auto">
          <button
            onClick={() => setActiveTab("users")}
            className={`min-h-[44px] flex items-center px-4 font-sans text-sm font-semibold transition border-b-[3px] ${
              activeTab === "users"
                ? "border-[#0E5A63] text-[#0E5A63]"
                : "border-transparent text-[#4F5B57] hover:text-[#17201D]"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`min-h-[44px] flex items-center px-4 font-sans text-sm font-semibold transition border-b-[3px] ${
              activeTab === "roles"
                ? "border-[#0E5A63] text-[#0E5A63]"
                : "border-transparent text-[#4F5B57] hover:text-[#17201D]"
            }`}
          >
            Roles & permissions
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`min-h-[44px] flex items-center px-4 font-sans text-sm font-semibold transition border-b-[3px] ${
              activeTab === "audit"
                ? "border-[#0E5A63] text-[#0E5A63]"
                : "border-transparent text-[#4F5B57] hover:text-[#17201D]"
            }`}
          >
            Audit log
          </button>
        </nav>

        {/* =========================================================================
            TAB 1: USERS (Screen 40)
           ========================================================================= */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#17201D]">Users</h1>
                <p className="text-sm text-[#4F5B57] mt-0.5">
                  108 staff logins · 2,031 parent logins (1,412 active in the app)
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="h-11 px-5 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white text-sm font-semibold transition flex items-center gap-2 shadow-xs"
              >
                <MdAdd size={18} /> Invite staff user
              </button>
            </div>

            {/* Filter Pills matching Screen 40 */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setUserFilter("staff")}
                className={`h-[38px] px-3.5 rounded-full text-[13px] font-medium transition border ${
                  userFilter === "staff"
                    ? "bg-[#12302D] text-white border-[#12302D]"
                    : "bg-white text-[#17201D] border-[#C9D1CD] hover:bg-[#F9FAF8]"
                }`}
              >
                Staff · 108
              </button>
              <button
                onClick={() => setUserFilter("parent")}
                className={`h-[38px] px-3.5 rounded-full text-[13px] font-medium transition border ${
                  userFilter === "parent"
                    ? "bg-[#12302D] text-white border-[#12302D]"
                    : "bg-white text-[#17201D] border-[#C9D1CD] hover:bg-[#F9FAF8]"
                }`}
              >
                Parents · 2,031
              </button>
              <button
                onClick={() => setUserFilter("locked")}
                className={`h-[38px] px-3.5 rounded-full text-[13px] font-medium transition border ${
                  userFilter === "locked"
                    ? "bg-[#12302D] text-white border-[#12302D]"
                    : "bg-white text-[#17201D] border-[#C9D1CD] hover:bg-[#F9FAF8]"
                }`}
              >
                Locked · 1
              </button>
              <button
                onClick={() => setUserFilter("2fa_missing")}
                className={`h-[38px] px-3.5 rounded-full text-[13px] font-medium transition border ${
                  userFilter === "2fa_missing"
                    ? "bg-[#12302D] text-white border-[#12302D]"
                    : "bg-white text-[#17201D] border-[#C9D1CD] hover:bg-[#F9FAF8]"
                }`}
              >
                Two-step missing · 2
              </button>

              <div className="ml-auto flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="relative flex-1 sm:w-64">
                  <MdSearch className="absolute left-3 top-2.5 text-[#4F5B57]" size={16} />
                  <input
                    type="search"
                    placeholder="Search name, username or role..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 h-[38px] text-xs bg-white border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                  />
                </div>
              </div>
            </div>

            {/* Users Table matching Screen 40 */}
            <div className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[900px] border-collapse">
                  <thead>
                    <tr className="bg-[#F2F4F2] text-[#17201D] border-b border-[#DDE2DE]">
                      <th className="py-3 px-4 font-semibold">User</th>
                      <th className="py-3 px-4 font-semibold">Roles</th>
                      <th className="py-3 px-4 font-semibold">Scope</th>
                      <th className="py-3 px-4 font-semibold">Two-step login</th>
                      <th className="py-3 px-4 font-semibold">Last active</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF1EF]">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F9FAF8] transition">
                        <td className="py-2.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#17201D]">{u.name}</span>
                            <span className="text-xs text-[#4F5B57] font-mono">{u.username}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {u.roles.map((r, i) => (
                              <span
                                key={i}
                                className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E3EFEF] text-[#08393F]"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-[#4F5B57] text-xs">{u.scope}</td>
                        <td className="py-2.5 px-4">
                          {u.twoStep === "on" && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E4F1E8] text-[#1E5A33]">
                              On
                            </span>
                          )}
                          {u.twoStep === "missing" && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFF6EC] text-[#7A4106]">
                              Required, not set
                            </span>
                          )}
                          {u.twoStep === "not_needed" && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F1F2EF] text-[#4F5B57]">
                              Not needed
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-[#4F5B57] text-xs font-mono">{u.lastActive}</td>
                        <td className="py-2 px-4 text-right">
                          {u.isLocked ? (
                            <button
                              onClick={() => handleUnlockUser(u.id, u.name)}
                              className="h-[34px] px-3 rounded-lg border border-[#0E5A63] bg-[#0E5A63] text-white text-xs font-semibold hover:bg-[#08393F] transition inline-flex items-center gap-1.5"
                            >
                              <MdLockOpen size={14} /> Unlock
                            </button>
                          ) : u.twoStep === "missing" ? (
                            <button
                              onClick={() => handleRemind2FA(u.name, u.mobile)}
                              className="h-[34px] px-3 rounded-lg border border-[#C9D1CD] bg-white text-[#17201D] text-xs font-medium hover:bg-[#F9FAF8] transition inline-flex items-center gap-1.5"
                            >
                              <MdSend size={13} /> Remind
                            </button>
                          ) : (
                            <button
                              onClick={() => showToast(`Edit user details for ${u.name}`, "info")}
                              className="h-[34px] px-3 rounded-lg border border-[#C9D1CD] bg-white text-[#17201D] text-xs font-medium hover:bg-[#F9FAF8] transition inline-flex items-center gap-1.5"
                            >
                              <MdEdit size={13} /> Edit
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
            <div className="flex-1 basis-[240px] max-w-[280px] bg-white border border-[#DDE2DE] rounded-xl p-2 flex flex-col gap-1 shadow-xs">
              {roles.map((r) => {
                const isSelected = r.id === selectedRoleId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoleId(r.id)}
                    className={`text-left min-h-[44px] px-3 py-1.5 rounded-lg border-0 font-sans flex justify-between items-center gap-2 transition ${
                      isSelected
                        ? "bg-[#E3EFEF] text-[#17201D]"
                        : "bg-transparent text-[#17201D] hover:bg-[#F9FAF8]"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className={`text-sm truncate ${isSelected ? "font-semibold" : "font-normal"}`}>
                        {r.name}
                      </span>
                      <span className="text-[11px] text-[#4F5B57]">{r.badge}</span>
                    </div>
                    <span className="font-mono text-xs text-[#4F5B57] bg-white/70 px-1.5 py-0.5 rounded border border-[#DDE2DE]">
                      {r.usersCount}
                    </span>
                  </button>
                );
              })}

              <button
                onClick={() => setShowCloneModal(true)}
                className="mt-2 mx-1 h-10 rounded-lg border border-dashed border-[#9AA8A3] bg-white hover:bg-[#F9FAF8] text-[13px] font-medium text-[#17201D] transition flex items-center justify-center gap-1.5"
              >
                <MdContentCopy size={14} /> Clone a role
              </button>
            </div>

            {/* Right Permissions Matrix */}
            <div className="flex-[999] basis-[540px] min-w-0 bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-[#EEF1EF] flex justify-between items-start gap-3 flex-wrap">
                <div>
                  <h2 className="text-xl font-semibold text-[#17201D]">{selectedRole.name}</h2>
                  <p className="text-xs text-[#4F5B57] mt-0.5">{selectedRole.description}</p>
                </div>
                <button
                  onClick={handleSaveRole}
                  className="h-10 px-5 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white text-sm font-semibold transition shadow-xs"
                >
                  Save role
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[760px] border-collapse">
                  <thead>
                    <tr className="bg-[#F2F4F2] text-[#17201D] border-b border-[#DDE2DE]">
                      <th className="py-3 px-4 font-semibold">Module</th>
                      {PERM_ACTIONS.map((a) => (
                        <th key={a} className="py-3 px-2 font-semibold text-center">
                          {a}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF1EF]">
                    {MODULES_LIST.map((mod) => {
                      const modPerms = selectedRole.permissions[mod] || {};
                      return (
                        <tr key={mod} className="hover:bg-[#F9FAF8] transition">
                          <td className="py-2.5 px-4 font-medium text-[#17201D]">{mod}</td>
                          {PERM_ACTIONS.map((act) => {
                            const isChecked = !!modPerms[act];
                            return (
                              <td key={act} className="py-2.5 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(mod, act)}
                                  className="w-[18px] h-[18px] rounded border-[#C9D1CD] text-[#0E5A63] focus:ring-[#0E5A63] cursor-pointer"
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
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#17201D]">Audit log</h1>
                <p className="text-sm text-[#4F5B57] mt-0.5">
                  Every change to students, marks, fees, payroll, roles and settings. Entries cannot be edited or deleted.
                </p>
              </div>
              <button
                onClick={handleExportAudit}
                className="h-10 px-4 rounded-lg border border-[#C9D1CD] bg-white hover:bg-[#F9FAF8] text-sm font-medium text-[#17201D] transition flex items-center gap-1.5 shadow-xs"
              >
                <MdFileDownload size={16} /> Export (watermarked)
              </button>
            </div>

            {/* Filter Bar matching Screen 42 */}
            <div className="flex flex-wrap items-center gap-3 bg-white border border-[#DDE2DE] rounded-xl p-3 shadow-xs">
              <label className="flex items-center gap-2 text-xs text-[#4F5B57] font-medium">
                Module
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="h-9 px-2.5 rounded-lg border border-[#C9D1CD] bg-white text-xs font-semibold text-[#17201D] focus:outline-none"
                >
                  <option value="All">All modules</option>
                  <option value="Fees">Fees</option>
                  <option value="Marks">Marks</option>
                  <option value="Students">Students</option>
                  <option value="Settings">Settings</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#4F5B57] font-medium">
                User
                <select
                  value={userAuditFilter}
                  onChange={(e) => setUserAuditFilter(e.target.value)}
                  className="h-9 px-2.5 rounded-lg border border-[#C9D1CD] bg-white text-xs font-semibold text-[#17201D] focus:outline-none"
                >
                  <option value="Anyone">Anyone</option>
                  <option value="Sunita">Sunita Rathore</option>
                  <option value="Rekha">Rekha Jain</option>
                  <option value="Meera">Meera Kumawat</option>
                  <option value="Dr. Kavita">Dr. Kavita Rao</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#4F5B57] font-medium">
                Date
                <input
                  type="date"
                  value={auditDate}
                  onChange={(e) => setAuditDate(e.target.value)}
                  className="h-9 px-2.5 rounded-lg border border-[#C9D1CD] bg-white text-xs text-[#17201D] focus:outline-none"
                />
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#17201D] ml-auto cursor-pointer">
                <input
                  type="checkbox"
                  checked={sensitiveOnly}
                  onChange={(e) => setSensitiveOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0E5A63] focus:ring-[#0E5A63]"
                />
                Sensitive actions only
              </label>
            </div>

            {/* Audit Log Timeline Entries */}
            <div className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-xs divide-y divide-[#EEF1EF]">
              {filteredAudit.map((entry) => (
                <div key={entry.id} className="grid grid-cols-[68px_1fr] gap-4 p-4 hover:bg-[#F9FAF8] transition">
                  <span className="font-mono text-xs text-[#4F5B57] pt-0.5">{entry.time}</span>

                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        style={{ backgroundColor: entry.badgeBg, color: entry.badgeColor }}
                        className="text-[11px] font-bold px-2 py-0.5 rounded tracking-wide uppercase"
                      >
                        {entry.actionBadge}
                      </span>
                      <span className="text-sm font-semibold text-[#17201D]">{entry.title}</span>
                    </div>

                    <span className="text-xs text-[#3B4643]">{entry.changeSummary}</span>

                    <span className="text-[11.5px] text-[#4F5B57] font-mono">
                      {entry.actor} · {entry.ip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: INVITE STAFF USER
         ========================================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DDE2DE] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EEF1EF] pb-3">
              <h3 className="font-semibold text-base text-[#17201D]">Invite Staff Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-[#4F5B57] hover:text-[#17201D]"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Joshi"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Mobile (Used for OTP Login)</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={inviteForm.mobile}
                  onChange={(e) => setInviteForm({ ...inviteForm, mobile: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Classes 9–10 or Whole school"
                  value={inviteForm.scope}
                  onChange={(e) => setInviteForm({ ...inviteForm, scope: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="h-10 px-4 rounded-lg border border-[#C9D1CD] text-[#17201D] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white font-semibold shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DDE2DE] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EEF1EF] pb-3">
              <h3 className="font-semibold text-base text-[#17201D]">Clone an Existing Role</h3>
              <button
                onClick={() => setShowCloneModal(false)}
                className="text-[#4F5B57] hover:text-[#17201D]"
              >
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleCloneRole} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Base Role to Copy From</label>
                <select
                  value={cloneForm.sourceRoleId}
                  onChange={(e) => setCloneForm({ ...cloneForm, sourceRoleId: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">New Role Name</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Class Coordinator"
                  value={cloneForm.newRoleName}
                  onChange={(e) => setCloneForm({ ...cloneForm, newRoleName: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Assigned Branch / Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Mansarovar Campus or Primary Wing"
                  value={cloneForm.scope}
                  onChange={(e) => setCloneForm({ ...cloneForm, scope: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCloneModal(false)}
                  className="h-10 px-4 rounded-lg border border-[#C9D1CD] text-[#17201D] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white font-semibold shadow-xs"
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
