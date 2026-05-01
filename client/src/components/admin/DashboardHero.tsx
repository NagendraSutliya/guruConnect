type DashboardHeroProps = {
  instituteName: string;
};

export default function DashboardHero({ instituteName }: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 px-8 py-6 shadow-lg mb-8">
      {/* Subtle Background Mesh */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] -mr-20 -mt-20" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Welcome to <span className="text-indigo-400">{instituteName}</span>
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em]">Management Portal v2.0</p>
            <span className="text-slate-600 text-[10px]">•</span>
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em]">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          System Status: Healthy
        </div>
      </div>
    </div>
  );
}
