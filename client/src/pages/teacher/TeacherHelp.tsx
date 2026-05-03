import { FiHelpCircle, FiBook, FiMessageCircle, FiVideo, FiSearch, FiChevronRight, FiCpu, FiLifeBuoy } from "react-icons/fi";

const TeacherHelp = () => {
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      
      {/* Neat Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Assistance Hub</h2>
          <p className="text-xs text-slate-500 font-medium">Documentation, tutorials, and institutional support channels</p>
        </div>
        
        <div className="relative w-full max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search help nodes..."
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* High-Density Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="card-clean p-6 group cursor-pointer hover:border-indigo-200 transition-all">
           <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm border border-indigo-100">
              <FiBook size={20} />
           </div>
           <h3 className="text-sm font-bold text-slate-800 tracking-tight">Documentation</h3>
           <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">Technical blueprints and user guides for the Teacher Portal ecosystem.</p>
           <div className="mt-6 flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
              Explore Nodes <FiChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
           </div>
        </div>

        <div className="card-clean p-6 group cursor-pointer hover:border-purple-200 transition-all">
           <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm border border-purple-100">
              <FiVideo size={20} />
           </div>
           <h3 className="text-sm font-bold text-slate-800 tracking-tight">Visual Walkthroughs</h3>
           <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">On-demand video tutorials covering core administrative operations.</p>
           <div className="mt-6 flex items-center gap-1.5 text-[10px] font-bold text-purple-600 uppercase tracking-widest">
              Stream Now <FiChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
           </div>
        </div>

        <div className="card-clean p-6 group cursor-pointer hover:border-emerald-200 transition-all">
           <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm border border-emerald-100">
              <FiMessageCircle size={20} />
           </div>
           <h3 className="text-sm font-bold text-slate-800 tracking-tight">Direct Support</h3>
           <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">Real-time communication with the institutional IT response team.</p>
           <div className="mt-6 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              Establish Uplink <FiChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
           </div>
        </div>
      </div>

      {/* Professional Support Hero */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
         <div className="max-w-xl relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <FiLifeBuoy size={20} />
               </div>
               <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Priority Support Required?</span>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight">Critical Assistance Protocol</h2>
            <p className="text-slate-400 mt-3 text-xs leading-relaxed font-medium">
               The technical response team is active 24/7 for critical system failures, security breaches, or high-priority examination emergencies.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-3">
               <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                  Open Critical Ticket
               </button>
               <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10">
                  Dial Support Desk
               </button>
            </div>
         </div>
         
         <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
         <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* System Status Node */}
      <div className="card-clean p-4 flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
               <FiCpu size={16} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Status</p>
               <p className="text-[11px] font-bold text-slate-700">All modules synchronized and active</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">99.9% Uptime</span>
         </div>
      </div>

    </div>
  );
};

export default TeacherHelp;
