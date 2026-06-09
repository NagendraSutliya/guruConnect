import { FiLock, FiBell, FiEye, FiGlobe, FiChevronRight, FiShield, FiCpu, FiLayout, FiActivity, FiServer } from "react-icons/fi";

const SettingItem = ({ icon: Icon, title, desc, action }: any) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50/80 transition-all rounded-2xl group cursor-pointer border border-transparent hover:border-slate-200/60 active:scale-[0.98]">
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-slate-100/50 text-slate-500 flex items-center justify-center border border-slate-200/50 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-indigo-700 transition-colors">{title}</h4>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
       {action}
       <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all duration-300">
          <FiChevronRight size={18} />
       </div>
    </div>
  </div>
);

const TeacherSettings = () => {
  return (
    <div className="space-y-2">
      
      {/* Sticky Header - Synced Aura Style */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 mb-2 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Control Center</h1>
          <p className="text-xs text-slate-500 font-medium">Manage your institutional presence and security configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             System Integrity: Nominal
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="card-clean overflow-hidden border-slate-200 shadow-sm">
             <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/40">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <FiShield className="text-indigo-600" /> Security Node
                </h3>
             </div>
             <div className="p-3 space-y-1">
                <SettingItem 
                  icon={FiLock} 
                  title="Credential Protocol" 
                  desc="Synchronize your authentication parameters and security keys."
                />
                <SettingItem 
                  icon={FiShield} 
                  title="Dual-Layer Authentication" 
                  desc="Secure your account with multi-factor biometric sync."
                  action={<span className="px-2.5 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-black uppercase rounded-lg border border-rose-100">Inactive</span>}
                />
                <SettingItem 
                  icon={FiEye} 
                  title="Active Session Audit" 
                  desc="Monitor hardware nodes currently synchronized with this account."
                />
             </div>
          </div>

          <div className="card-clean overflow-hidden border-slate-200 shadow-sm">
             <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/40">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <FiLayout className="text-emerald-500" /> Portal Preferences
                </h3>
             </div>
             <div className="p-3 space-y-1">
                <SettingItem 
                  icon={FiBell} 
                  title="Notification Engine" 
                  desc="Configure dispatch triggers for real-time academic alerts."
                />
                <SettingItem 
                  icon={FiGlobe} 
                  title="Regional Localization" 
                  desc="Adjust institutional standards, language, and time offsets."
                  action={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">English (Int)</span>}
                />
             </div>
          </div>

        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           
           <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
              <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 text-indigo-400 flex items-center justify-center mb-6 border border-white/10 group-hover:border-indigo-500/50 transition-all duration-500">
                    <FiCpu size={24} />
                 </div>
                 <h4 className="text-xl font-black tracking-tight mb-2">System Constraints</h4>
                 <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    Critical configurations are strictly managed by institutional policy. Specialized overrides require IT administrator approval and cryptographic validation.
                 </p>
                 
                 <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                    <div>
                       <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resource Sync</p>
                          <p className="text-[10px] font-black text-indigo-400 uppercase">94% Active</p>
                       </div>
                       <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full w-[94%] shadow-[0_0_12px_rgba(99,102,241,0.4)]" />
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-help">
                       <FiServer className="text-indigo-400" size={20} />
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Instance Node</p>
                          <p className="text-xs font-bold text-slate-300 tracking-tight">GuruConnect Edge-01</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="card-clean p-6 border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <FiActivity className="text-emerald-500" size={16} />
                 <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Instance Metadata</h4>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Portal Version</span>
                    <span className="text-xs text-slate-800 font-black tracking-tight bg-slate-100 px-2.5 py-1 rounded-lg">2.4.0-Stable</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Core Protocol</span>
                    <span className="text-xs text-indigo-600 font-black tracking-tight">Encrypted (TLS)</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Last Audit</span>
                    <span className="text-xs text-slate-800 font-black tracking-tight">01 May 2026</span>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherSettings;
