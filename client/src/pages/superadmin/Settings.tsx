import { useState } from "react";
import { Settings, Shield, Key, Send, CheckCircle2, AlertTriangle, Building, Lock, X, RefreshCw } from "lucide-react";

interface ProviderConfig {
  id: string;
  category: string;
  status: "Working" | "Check DNS" | "Complete";
  statusType: "success" | "warning" | "neutral";
  fields: { label: string; value: string; isMono?: boolean }[];
  canTest?: boolean;
}

const initialProviders: ProviderConfig[] = [
  {
    id: "sms",
    category: "SMS (DLT Gateway)",
    status: "Working",
    statusType: "success",
    fields: [
      { label: "Provider", value: "ValueFirst / Gupshup Telecom" },
      { label: "Sender ID", value: "GURUSC", isMono: true },
      { label: "DLT Entity ID", value: "1101569420000031892", isMono: true },
      { label: "API Key", value: "•••••••• 7c2f", isMono: true }
    ],
    canTest: true
  },
  {
    id: "whatsapp",
    category: "WhatsApp Business API",
    status: "Working",
    statusType: "success",
    fields: [
      { label: "Business Provider", value: "Meta Cloud API (Official BSP)" },
      { label: "Number", value: "+91 98290 12345", isMono: true },
      { label: "Approved Templates", value: "14 templates active" },
      { label: "API Key", value: "•••••••• 91ab", isMono: true }
    ],
    canTest: true
  },
  {
    id: "email",
    category: "Email (Transactional SMTP)",
    status: "Check DNS",
    statusType: "warning",
    fields: [
      { label: "Sending Domain", value: "mail.guruconnect.in" },
      { label: "SPF / DKIM", value: "OK / OK" },
      { label: "DMARC", value: "p=none (Enforce reject before next quarter)" },
      { label: "API Key", value: "•••••••• 0d44", isMono: true }
    ],
    canTest: true
  },
  {
    id: "payments",
    category: "Platform Payments & Payouts",
    status: "Working",
    statusType: "success",
    fields: [
      { label: "Gateway", value: "Razorpay Route · Platform Master Account" },
      { label: "Webhook", value: "Last received 10:42 am (200 OK)" },
      { label: "Live Key ID", value: "•••••••• e8f1", isMono: true }
    ],
    canTest: false
  },
  {
    id: "company",
    category: "Company Profile & Invoicing",
    status: "Complete",
    statusType: "success",
    fields: [
      { label: "Legal Name", value: "GuruConnect EdTech Technologies Pvt Ltd" },
      { label: "GSTIN", value: "08AABCG9812K1Z9 (Rajasthan, Code 08)", isMono: true },
      { label: "Invoice Prefix", value: "INV/2627/", isMono: true },
      { label: "Bank Account", value: "HDFC Bank · A/C ••••4471 · HDFC0001824", isMono: true }
    ],
    canTest: false
  },
  {
    id: "security",
    category: "Security & Support Boundaries",
    status: "Complete",
    statusType: "success",
    fields: [
      { label: "Office Whitelist CIDR", value: "3 IP subnets configured" },
      { label: "Session Timeout", value: "15 minutes idle" },
      { label: "Support Ticket SLA", value: "High 4h · Med 8h · Low 24h" },
      { label: "Impersonation Cap", value: "Default 2h · maximum 24h auto-expiry" }
    ],
    canTest: false
  }
];

export default function SuperAdminSettings() {
  const [providers, setProviders] = useState<ProviderConfig[]>(initialProviders);
  const [editingProvider, setEditingProvider] = useState<ProviderConfig | null>(null);
  const [testingProvider, setTestingProvider] = useState<ProviderConfig | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [testRecipient, setTestRecipient] = useState("");
  const [testSent, setTestSent] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length < 6) {
      alert("Please enter a valid 6-digit 2FA verification code.");
      return;
    }
    alert(`Configuration updated for ${editingProvider?.category}.`);
    setEditingProvider(null);
    setTwoFactorCode("");
  };

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    setTestSent(true);
    setTimeout(() => {
      setTestSent(false);
      setTestingProvider(null);
      setTestRecipient("");
      alert("Test packet dispatched successfully with 200 OK provider ACK.");
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Platform Gateway & API Settings
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            System gateways and master secrets. Modifying production keys requires dual Super Admin hardware 2FA challenge.
          </p>
        </div>
      </div>

      {/* Grid of 6 Settings Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {providers.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-line p-5 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-line">
                <h2 className="text-base font-bold text-ink m-0">{p.category}</h2>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    p.statusType === "success"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {p.fields.map((f, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-3 py-1 border-b border-line/60 last:border-0">
                    <span className="text-ink-secondary shrink-0">{f.label}</span>
                    <span
                      className={`text-right font-medium text-ink break-all ${
                        f.isMono ? "font-mono font-semibold" : ""
                      }`}
                    >
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-line">
              <button
                onClick={() => setEditingProvider(p)}
                className="px-3 py-1.5 bg-white border border-line text-ink hover:bg-surface text-xs font-bold rounded-lg shadow-2xs flex-1 cursor-pointer"
              >
                Edit Key
              </button>
              {p.canTest && (
                <button
                  onClick={() => setTestingProvider(p)}
                  className="px-3 py-1.5 bg-surface text-ink-secondary hover:text-ink hover:bg-line/40 text-xs font-bold rounded-lg flex-1 cursor-pointer"
                >
                  Send Test
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Provider Modal */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-line max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingProvider(null)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink m-0">Edit {editingProvider.category}</h3>
            </div>
            <p className="text-xs text-ink-secondary mb-4">
              Enter updated API credentials. All webhooks and active sessions will re-negotiate on submit.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Production Secret Key / Token</label>
                <input
                  type="password"
                  required
                  placeholder="Enter secret token / key"
                  className="w-full px-3 py-2 bg-surface font-mono rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Hardware 2FA Required</span>
                </span>
                <p className="text-[11px] text-amber-700 m-0">
                  Enter 6-digit TOTP code from your authenticator device to verify platform root authority.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000 000"
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3 py-2 bg-white font-mono text-center tracking-widest font-bold rounded-lg border border-amber-300 text-sm focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-ink-secondary hover:bg-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save & Validate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Test Modal */}
      {testingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-line max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setTestingProvider(null)}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink m-0">Test {testingProvider.category}</h3>
            </div>
            <p className="text-xs text-ink-secondary mb-4">
              Send an instant ping payload to verify downstream gateway routing.
            </p>

            <form onSubmit={handleSendTest} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  {testingProvider.id === "email" ? "Test Email Address" : "Test Mobile Number (+91)"}
                </label>
                <input
                  type={testingProvider.id === "email" ? "email" : "tel"}
                  required
                  placeholder={testingProvider.id === "email" ? "admin@domain.com" : "9829012345"}
                  value={testRecipient}
                  onChange={e => setTestRecipient(e.target.value)}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-xs sm:text-sm text-ink focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTestingProvider(null)}
                  className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-ink-secondary hover:bg-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={testSent}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  {testSent && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{testSent ? "Dispatching..." : "Send Test Ping"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
