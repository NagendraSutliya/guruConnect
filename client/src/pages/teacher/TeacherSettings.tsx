import { FiLock, FiBell, FiEye, FiGlobe, FiChevronRight, FiShield, FiCpu, FiLayout } from "react-icons/fi";

const SettingItem = ({ icon: Icon, title, desc, action }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all rounded-xl group cursor-pointer border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h4>
        <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
       {action}
       <FiChevronRight className="text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" size={16} />
    </div>
  </div>
);

const TeacherSettings = () => {
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Neat Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Settings</h2>
          <p className="text-xs text-slate-500 font-medium">Manage your portal preferences and security configurations</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           System Online
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="card-clean overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <FiLock className="text-indigo-500" /> Security Node
                </h3>
             </div>
             <div className="p-2 space-y-1">
                <SettingItem 
                  icon={FiLock} 
                  title="Credential Protocol" 
                  desc="Update your authentication parameters and security keys."
                />
                <SettingItem 
                  icon={FiShield} 
                  title="Dual-Layer Authentication" 
                  desc="Secure your account with multi-factor biometric sync."
                  action={<span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-bold uppercase rounded border border-rose-100">Inactive</span>}
                />
                <SettingItem 
                  icon={FiEye} 
                  title="Session Audit" 
                  desc="Monitor active hardware nodes logged into this account."
                />
             </div>
          </div>

          <div className="card-clean overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <FiLayout className="text-indigo-500" /> Preferences
                </h3>
             </div>
             <div className="p-2 space-y-1">
                <SettingItem 
                  icon={FiBell} 
                  title="Notification Engine" 
                  desc="Configure dispatch triggers for real-time system alerts."
                />
                <SettingItem 
                  icon={FiGlobe} 
                  title="Localization" 
                  desc="Adjust regional standards, language, and time offsets."
                  action={<span className="text-[11px] font-bold text-slate-400">English (Int)</span>}
                />
             </div>
          </div>

        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           
           <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                 <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
                    <FiCpu size={20} />
                 </div>
                 <h4 className="text-lg font-bold tracking-tight">System Constraints</h4>
                 <p className="text-slate-400 text-xs mt-2 leading-relaxed font-medium">
                    Critical configurations are strictly managed by institutional policy. Specialized overrides require IT administrator approval.
                 </p>
                 
                 <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Instance Sync</p>
                       <p className="text-[10px] font-bold text-emerald-400 uppercase">Synced</p>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                       <div className="bg-indigo-500 h-full w-[94%] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="card-clean p-6">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Instance Info</h4>
              <div className="space-y-4">
                 <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Portal Version</span>
                    <span className="text-slate-700 font-bold">2.4.0-Stable</span>
                 </div>
                 <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Core Protocol</span>
                    <span className="text-slate-700 font-bold">Encrypted (TLS)</span>
                 </div>
                 <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Last Audit</span>
                    <span className="text-slate-700 font-bold">01 May 2026</span>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherSettings;
