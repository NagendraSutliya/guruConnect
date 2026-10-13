import { useState } from "react";
import { Flag, Plus, Search, CheckCircle2, Shield, AlertCircle, Info, Sparkles, X } from "lucide-react";

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  state: "off" | "pilot" | "plan" | "all";
  audience: string;
  since: string;
  description: string;
}

const initialFlags: FeatureFlag[] = [
  {
    id: "1",
    name: "Live bus GPS",
    key: "transport.gps",
    state: "plan",
    audience: "Premium · 32 schools",
    since: "5 Oct",
    description: "Real-time bus tracking using mobile GPS beacon or onboard AIS-140 device."
  },
  {
    id: "2",
    name: "Holistic progress card",
    key: "exams.hpc",
    state: "pilot",
    audience: "Pilot: Shiksha Public School, Vidya Bharati Group",
    since: "28 Sep",
    description: "NEP 2020 compliant 360-degree multidimensional report cards with self and peer assessment."
  },
  {
    id: "3",
    name: "WhatsApp notices",
    key: "comms.whatsapp",
    state: "all",
    audience: "All schools with credits",
    since: "1 Aug",
    description: "Automated fee reminders, daily attendance, and report card PDF delivery over WhatsApp."
  },
  {
    id: "4",
    name: "Report card remark suggestions",
    key: "exams.remark_suggest",
    state: "off",
    audience: "Nobody yet",
    since: "—",
    description: "AI-assisted pedagogical remark suggestions based on term performance rubric."
  },
  {
    id: "5",
    name: "Biometric device sync",
    key: "attendance.devices",
    state: "plan",
    audience: "Standard and Premium",
    since: "12 Jul",
    description: "Real-time sync daemon for eSSL, Realtime, and ZKTeco biometric attendance punches."
  },
  {
    id: "6",
    name: "Hostel module",
    key: "hostel.core",
    state: "all",
    audience: "All schools on Premium",
    since: "1 Jun",
    description: "Hostel room allocation, mess billing, warden gate-passes, and curfew attendance."
  }
];

export default function SuperAdminFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pilot" | "plan" | "off">("all");
  const [selectedFlagForNotes, setSelectedFlagForNotes] = useState<FeatureFlag | null>(null);
  const [showNewFlagModal, setShowNewFlagModal] = useState(false);

  const [newFlagData, setNewFlagData] = useState({
    name: "",
    key: "",
    state: "pilot" as "off" | "pilot" | "plan" | "all",
    description: "",
    audience: "Pilot schools"
  });

  const handleStateChange = (id: string, newState: "off" | "pilot" | "plan" | "all") => {
    setFlags(prev =>
      prev.map(f => {
        if (f.id === id) {
          let aud = f.audience;
          if (newState === "off") aud = "Nobody yet";
          else if (newState === "all") aud = "All schools";
          else if (newState === "plan") aud = "Standard & Premium tiers";
          else if (newState === "pilot") aud = "Selected pilot schools (2)";
          return { ...f, state: newState, audience: aud };
        }
        return f;
      })
    );
  };

  const handleCreateFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlagData.name || !newFlagData.key) return;

    const newFlag: FeatureFlag = {
      id: String(Date.now()),
      name: newFlagData.name,
      key: newFlagData.key,
      state: newFlagData.state,
      audience: newFlagData.audience,
      since: "Today",
      description: newFlagData.description || "Experimental platform capability."
    };

    setFlags([newFlag, ...flags]);
    setShowNewFlagModal(false);
    setNewFlagData({
      name: "",
      key: "",
      state: "pilot",
      description: "",
      audience: "Pilot schools"
    });
  };

  const filteredFlags = flags.filter(flag => {
    const matchesSearch =
      flag.name.toLowerCase().includes(search.toLowerCase()) ||
      flag.key.toLowerCase().includes(search.toLowerCase()) ||
      flag.audience.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "all" || flag.state === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Releases & Feature Flags
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Turn new modules on for pilot schools first. Turning a flag off hides the feature in the UI while preserving all data.
          </p>
        </div>

        <button
          onClick={() => setShowNewFlagModal(true)}
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>New Feature Flag</span>
        </button>
      </div>

      {/* Info Callout Banner */}
      <div className="p-4 bg-surface rounded-2xl border border-line flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-gold shrink-0" />
        <span className="text-xs sm:text-sm text-ink-secondary">
          <strong className="text-ink">Zero-downtime Rollouts:</strong> Flags update instantly on institutional client dashboards via WebSocket telemetry. No server restarts or client redeployments are required.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-line flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by flag name, module key or audience..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface text-ink text-xs sm:text-sm rounded-xl border border-line focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["all", "pilot", "plan", "off"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-nav-bg text-white shadow-xs"
                  : "bg-surface text-ink-secondary hover:text-ink hover:bg-line/40"
              }`}
            >
              {tab === "all" ? "All Flags" : tab === "plan" ? "Plan-based" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Flags Table */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[850px]">
            <thead>
              <tr className="bg-surface border-b border-line text-xs font-bold text-ink-secondary uppercase">
                <th className="py-3 px-5">Feature</th>
                <th className="py-3 px-5">State Rollout</th>
                <th className="py-3 px-5">Who Has It</th>
                <th className="py-3 px-5">Activated Since</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredFlags.map(flag => (
                <tr key={flag.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-ink">{flag.name}</span>
                      <span className="font-mono text-xs text-ink-secondary">{flag.key}</span>
                      <p className="text-xs text-ink-muted mt-0.5 max-w-sm line-clamp-1">{flag.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="inline-flex p-1 bg-surface rounded-full border border-line gap-1">
                      {(["off", "pilot", "plan", "all"] as const).map(st => {
                        const isSelected = flag.state === st;
                        const label =
                          st === "off"
                            ? "Off"
                            : st === "pilot"
                            ? "Pilot"
                            : st === "plan"
                            ? "Plan-based"
                            : "On for all";

                        return (
                          <button
                            key={st}
                            onClick={() => handleStateChange(flag.id, st)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-nav-bg text-white shadow-xs"
                                : "text-ink-secondary hover:text-ink hover:bg-white"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs text-ink-secondary font-medium">{flag.audience}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs font-mono text-ink-secondary">{flag.since}</span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => setSelectedFlagForNotes(flag)}
                      className="text-xs font-bold text-primary hover:text-primary-dark underline cursor-pointer"
                    >
                      Release notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Release Notes Modal */}
      {selectedFlagForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-line max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedFlagForNotes(null)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Flag className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink m-0">{selectedFlagForNotes.name}</h3>
            </div>
            <span className="font-mono text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-md inline-block mb-4">
              {selectedFlagForNotes.key}
            </span>

            <div className="space-y-3 text-sm text-ink-secondary">
              <p className="leading-relaxed">{selectedFlagForNotes.description}</p>
              <div className="p-3 bg-surface rounded-xl border border-line space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-ink-secondary">Current rollout:</span>
                  <span className="font-bold text-ink uppercase">{selectedFlagForNotes.state}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-secondary">Target audience:</span>
                  <span className="font-medium text-ink">{selectedFlagForNotes.audience}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-secondary">Release timestamp:</span>
                  <span className="font-mono text-ink">{selectedFlagForNotes.since}</span>
                </div>
              </div>
              <p className="text-xs text-ink-muted italic">
                Telemetry checks verify zero regression errors on institution tenants with this flag active.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedFlagForNotes(null)}
                className="px-4 py-2 bg-nav-bg text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Flag Modal */}
      {showNewFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-line max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowNewFlagModal(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-ink mb-1">Create Feature Flag</h3>
            <p className="text-xs text-ink-secondary mb-4">
              Add a new capability toggle for staged canary deployments.
            </p>

            <form onSubmit={handleCreateFlag} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Flag Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Question Paper Generator"
                  value={newFlagData.name}
                  onChange={e => setNewFlagData({ ...newFlagData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">System Key</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ai.exam_maker"
                  value={newFlagData.key}
                  onChange={e => setNewFlagData({ ...newFlagData, key: e.target.value })}
                  className="w-full px-3 py-2 bg-surface font-mono rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Initial State</label>
                <select
                  value={newFlagData.state}
                  onChange={e =>
                    setNewFlagData({
                      ...newFlagData,
                      state: e.target.value as "off" | "pilot" | "plan" | "all"
                    })
                  }
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value="off">Off (Invisible to all)</option>
                  <option value="pilot">Pilot (Specific schools only)</option>
                  <option value="plan">Plan-based (Based on tier)</option>
                  <option value="all">On for all</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of what this module does..."
                  value={newFlagData.description}
                  onChange={e => setNewFlagData({ ...newFlagData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFlagModal(false)}
                  className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-ink-secondary hover:bg-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Create Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
