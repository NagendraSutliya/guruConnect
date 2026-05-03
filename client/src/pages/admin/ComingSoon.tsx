import { MdConstruction, MdAutoGraph, MdTimer } from "react-icons/md";

export default function ComingSoon({ featureName }: { featureName: string }) {
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center p-8 animate-fadeIn">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200 animate-bounce">
          <MdConstruction size={48} />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white animate-pulse">
          <MdAutoGraph size={20} />
        </div>
      </div>

      <div className="text-center max-w-md">
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">{featureName}</h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
          <MdTimer size={14} /> Under Construction
        </div>
        
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
          Our engineers are currently building the <span className="text-indigo-600 font-bold">{featureName}</span> module. This premium feature will be part of the next GuruConnect system update.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-sm font-bold text-slate-800">Developing...</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ETA</p>
            <p className="text-sm font-bold text-slate-800">Q3 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
