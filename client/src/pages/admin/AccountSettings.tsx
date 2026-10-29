import { useState } from "react";
import { 
  MdLock, 
  MdSecurity, 
  MdNotifications, 
  MdDevices, 
  MdFingerprint
} from "react-icons/md";
import { useToast } from "../../context/ToastContext";

export default function AccountSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast("Passwords do not match", "error");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      showToast("Password updated successfully!", "success");
      setPasswords({ current: "", new: "", confirm: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">Settings › Account</div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight flex items-center gap-2">
            <MdSecurity className="text-primary" size={24} />
            <span>Account settings</span>
          </h1>
          <p className="text-[13px] text-ink-secondary mt-0.5">
            Security, credentials, and authentication preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-5 items-start">
        {/* Main Content (Left Column) */}
        <div className="flex-1 basis-[520px] min-w-0 flex flex-col gap-5">
          {/* Change Password Card */}
          <form onSubmit={handlePasswordChange} className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line-row">
              <MdLock size={18} className="text-primary" />
              <h2 className="text-base font-semibold text-ink m-0">Change password</h2>
            </div>

            <div className="space-y-3.5">
              <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                Current password
                <input 
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  New password
                  <input 
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
                  Confirm new password
                  <input 
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="min-h-[40px] px-3.5 border border-line-input rounded-control bg-white text-xs sm:text-[13px] text-ink focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-line-row flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="min-h-[40px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-xs sm:text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Processing..." : "Update credentials"}
              </button>
            </div>
          </form>

          {/* Communication Preferences Card */}
          <div className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line-row">
              <MdNotifications size={18} className="text-primary" />
              <h2 className="text-base font-semibold text-ink m-0">Communication preferences</h2>
            </div>

            <div className="divide-y divide-line-row">
              {[
                { title: "Email Notifications", desc: "Receive activity reports and system alerts via email.", active: true },
                { title: "Security Alerts", desc: "Get notified of new login attempts and credential changes.", active: true },
                { title: "Product Updates", desc: "Stay informed about new features and system improvements.", active: false },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="max-w-md">
                    <p className="text-xs sm:text-sm font-semibold text-ink">{pref.title}</p>
                    <p className="text-xs text-ink-secondary mt-0.5">{pref.desc}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    pref.active ? "bg-success-bg text-success-text" : "bg-surface-subtle text-ink-secondary border border-line-input"
                  }`}>
                    {pref.active ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Aside (Synced Right Panel) */}
        <aside className="flex-1 basis-[300px] max-w-full lg:max-w-[340px] flex flex-col gap-4">
          {/* Security Summary Card */}
          <div className="bg-white border border-line rounded-card p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-base font-semibold text-ink">Security health</h2>
              <span className="text-success text-xs font-bold">85% High</span>
            </div>
            
            <div className="w-full h-2 bg-surface-subtle border border-line-row rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-success rounded-full" />
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed">
              Your account security is high. Enable two-factor authentication to achieve 100% compliance.
            </p>

            <div className="space-y-2 pt-2 border-t border-line-row text-xs">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <MdFingerprint className="text-primary" size={16} />
                  <span className="text-ink font-medium">2FA status</span>
                </div>
                <span className="text-[11px] font-semibold text-warning-text bg-warning-bg px-2 py-0.5 rounded-full border border-warning-border">
                  Disabled
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <MdDevices className="text-primary" size={16} />
                  <span className="text-ink font-medium">Active devices</span>
                </div>
                <span className="text-[11px] font-mono text-ink-secondary">02 Active</span>
              </div>
            </div>
          </div>

          {/* Audit Rail Card */}
          <div className="bg-white border border-line rounded-card p-4 shadow-xs flex flex-col gap-2.5">
            <h2 className="m-0 text-sm font-semibold text-ink flex items-center gap-1.5">
              <MdSecurity size={16} className="text-primary" />
              <span>Session & security logs</span>
            </h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              All sign-ins, IP addresses, and credential changes are recorded in the central audit ledger.
            </p>
            <div className="pt-2 border-t border-line-row">
              <span className="text-xs font-semibold text-primary">
                Protected by TLS 1.3 End-to-End
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
