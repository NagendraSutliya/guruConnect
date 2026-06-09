import { useState } from "react";
import { 
  MdLock, 
  MdSecurity, 
  MdNotifications, 
  MdDevices, 
  MdVpnKey,
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
    // Simulation of API call
    setTimeout(() => {
      showToast("Password updated successfully!", "success");
      setPasswords({ current: "", new: "", confirm: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdSecurity className="text-slate-700" />
            Account Settings
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Security, credentials, and authentication preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Security Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Security Score</h3>
              <span className="text-emerald-500 font-black text-sm">85%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[85%] h-full bg-emerald-500 rounded-full" />
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Your account security is high. Enable two-factor authentication to reach 100%.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <MdFingerprint className="text-indigo-600" size={18} />
                  <span className="text-xs font-bold text-slate-700">2FA Status</span>
                </div>
                <span className="text-[10px] font-black text-rose-500 uppercase">Disabled</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <MdDevices className="text-indigo-600" size={18} />
                  <span className="text-xs font-bold text-slate-700">Active Devices</span>
                </div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">02 Active</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <h4 className="font-black text-lg mb-2 relative z-10">Advanced Security</h4>
            <p className="text-indigo-200 text-xs leading-relaxed mb-6 relative z-10">
              Session logs and IP whitelistings are managed by the enterprise security module.
            </p>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10">
              View Logs
            </button>
            <MdVpnKey size={100} className="absolute -right-4 -bottom-4 opacity-10" />
          </div>
        </div>

        {/* Password Management */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handlePasswordChange} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdLock size={16} className="text-indigo-500" />
              Change Password
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Current Password</label>
                <input 
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">New Password</label>
                  <input 
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Confirm New Password</label>
                  <input 
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-70 uppercase tracking-widest"
              >
                {loading ? "Processing..." : "Update Credentials"}
              </button>
            </div>
          </form>

          {/* Preferences */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdNotifications size={16} className="text-orange-500" />
              Communication Preferences
            </div>
            <div className="space-y-4">
              {[
                { title: "Email Notifications", desc: "Receive activity reports and system alerts via email.", active: true },
                { title: "Security Alerts", desc: "Get notified of new login attempts and credential changes.", active: true },
                { title: "Product Updates", desc: "Stay informed about new features and system improvements.", active: false },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="max-w-md">
                    <p className="text-sm font-bold text-slate-800">{pref.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{pref.desc}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-all relative ${pref.active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pref.active ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
