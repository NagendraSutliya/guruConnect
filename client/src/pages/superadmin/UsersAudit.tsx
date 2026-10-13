import { useState } from "react";
import { Users, Shield, Plus, Lock, Clock, Search, CheckCircle2, AlertCircle, X, ShieldAlert } from "lucide-react";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Support" | "Onboarding / Sales" | "Finance" | "Content & Compliance";
  twoStep: boolean;
  ipRestriction: string;
  lastActive: string;
}

const initialUsers: PlatformUser[] = [
  {
    id: "1",
    name: "Platform Owner",
    email: "owner@guruconnect.in",
    role: "Super Admin",
    twoStep: true,
    ipRestriction: "Office IPs only",
    lastActive: "Now"
  },
  {
    id: "2",
    name: "Ritika Bansal",
    email: "ritika@guruconnect.in",
    role: "Super Admin",
    twoStep: true,
    ipRestriction: "Office IPs only",
    lastActive: "2 h ago"
  },
  {
    id: "3",
    name: "Priya Kumari",
    email: "priya@guruconnect.in",
    role: "Support",
    twoStep: true,
    ipRestriction: "Any",
    lastActive: "10 min ago"
  },
  {
    id: "4",
    name: "Aman Shekhawat",
    email: "aman@guruconnect.in",
    role: "Onboarding / Sales",
    twoStep: true,
    ipRestriction: "Any",
    lastActive: "Yesterday"
  },
  {
    id: "5",
    name: "Kavita Jain",
    email: "kavita@guruconnect.in",
    role: "Finance",
    twoStep: true,
    ipRestriction: "Office IPs only",
    lastActive: "1 h ago"
  },
  {
    id: "6",
    name: "Dr. S. Mathur",
    email: "mathur@guruconnect.in",
    role: "Content & Compliance",
    twoStep: true,
    ipRestriction: "Any",
    lastActive: "3 days ago"
  }
];

const auditLogs = [
  {
    time: "10:42",
    tag: "SUPPORT",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    title: "Access requested · Bal Vidya Mandir · fees only, 2 h",
    author: "Priya Kumari · reason: receipt installment mapping"
  },
  {
    time: "10:05",
    tag: "BILLING",
    tagColor: "bg-sky-50 text-sky-700 border-sky-200",
    title: "Reminder 3 sent · Adarsh Vidya Niketan",
    author: "System (dunning schedule)"
  },
  {
    time: "09:31",
    tag: "SCHOOL",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "School account created · Sunrise Convent, Udaipur",
    author: "Aman Shekhawat · Premium trial, 30 days"
  },
  {
    time: "Yesterday",
    tag: "MASTER",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
    title: "Draft created · RBSE Secondary 2027-28 v1",
    author: "Dr. S. Mathur · NEP 2020 competency rubric"
  },
  {
    time: "Yesterday",
    tag: "BILLING",
    tagColor: "bg-sky-50 text-sky-700 border-sky-200",
    title: "Bank transfer recorded · INV/2627/0428 (₹1,06,200)",
    author: "Kavita Jain · UTR CMS3910842910"
  },
  {
    time: "Sat",
    tag: "SECURITY",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    title: "Hardware WebAuthn FIDO2 token enrolled",
    author: "Ritika Bansal · YubiKey 5C NFC"
  }
];

export default function SuperAdminUsersAudit() {
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [search, setSearch] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Support" as PlatformUser["role"],
    ipRestricted: true
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const user: PlatformUser = {
      id: String(Date.now()),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      twoStep: true,
      ipRestriction: newUser.ipRestricted ? "Office IPs only" : "Any",
      lastActive: "Invited"
    };

    setUsers([...users, user]);
    setShowInviteModal(false);
    setNewUser({ name: "", email: "", role: "Support", ipRestricted: true });
  };

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Platform Users & Immutable Audit
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Company personnel with platform operations access. Hardware 2FA is strictly enforced across all internal accounts.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Invite Platform User</span>
        </button>
      </div>

      {/* Security Status Card */}
      <div className="p-4 bg-surface rounded-2xl border border-line flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-primary shrink-0" />
          <span className="text-xs sm:text-sm text-ink-secondary">
            <strong className="text-ink">Enforced Security Boundary:</strong> 100% of staff accounts have TOTP/FIDO2 2FA enabled. Root actions require office CIDR IP match.
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
          6/6 2FA Active
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-line flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search platform users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 bg-surface text-ink text-xs sm:text-sm rounded-xl border border-line focus:outline-hidden"
            />
          </div>
          <span className="text-xs font-bold text-ink-secondary">{users.length} Platform Staff</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[760px]">
            <thead>
              <tr className="bg-surface border-b border-line text-xs font-bold text-ink-secondary uppercase">
                <th className="py-3 px-5">Staff Member</th>
                <th className="py-3 px-5">Platform Role</th>
                <th className="py-3 px-5">2FA Auth</th>
                <th className="py-3 px-5">IP Whitelist</th>
                <th className="py-3 px-5">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-ink">{user.name}</span>
                      <span className="font-mono text-xs text-ink-secondary">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 bg-surface border border-line text-xs font-bold text-ink rounded-lg">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>On</span>
                    </span>
                  </td>
                  <td className="py-4 px-5 text-xs text-ink-secondary font-medium">{user.ipRestriction}</td>
                  <td className="py-4 px-5 text-xs text-ink-secondary font-mono">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Audit Trail */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-line flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-ink m-0">Platform Audit Trail</h2>
            <p className="text-xs text-ink-secondary mt-0.5 mb-0">
              Cryptographically signed write-ahead log. Entries cannot be altered, masked, or expunged.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-ink-muted bg-surface px-2.5 py-1 rounded-md border border-line">
            SHA-256 HMAC
          </span>
        </div>

        <div className="divide-y divide-line">
          {auditLogs.map((log, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 hover:bg-surface/40 transition-colors">
              <span className="font-mono text-xs text-ink-secondary sm:w-20 shrink-0">{log.time}</span>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${log.tagColor}`}>
                      {log.tag}
                    </span>
                    <span className="text-sm font-semibold text-ink">{log.title}</span>
                  </div>
                  <span className="text-xs text-ink-secondary mt-1 block">{log.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Staff Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-line max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-ink mb-1">Invite Platform User</h3>
            <p className="text-xs text-ink-secondary mb-4">
              Add internal team member to GuruConnect Super Admin panel.
            </p>

            <form onSubmit={handleInvite} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Rathore"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Company Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikram@guruconnect.in"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Role & Permissions</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as PlatformUser["role"] })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden"
                >
                  <option value="Super Admin">Super Admin (Full Root Permissions)</option>
                  <option value="Support">Support (View As School & Tickets)</option>
                  <option value="Finance">Finance (Invoicing & Bank Reconciliation)</option>
                  <option value="Onboarding / Sales">Onboarding / Sales (Demo & School Creation)</option>
                  <option value="Content & Compliance">Content & Compliance (Curricular Masters)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ipRestrict"
                  checked={newUser.ipRestricted}
                  onChange={e => setNewUser({ ...newUser, ipRestricted: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <label htmlFor="ipRestrict" className="text-xs text-ink font-medium cursor-pointer">
                  Restrict login to whitelisted office IP subnets
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-ink-secondary hover:bg-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
