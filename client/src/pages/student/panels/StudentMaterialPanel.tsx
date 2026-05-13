import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiFileText,
  FiDownload,
  FiSearch,
  FiClock,
  FiFolder,
  FiCpu,
  FiBook,
  FiGrid,
  FiZap,
} from "react-icons/fi";

const StudentMaterialPanel = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/material");
      setMaterials(res.data.data || []);
    } catch (err) {
      console.error("Failed to load materials", err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const subjectCount = [...new Set(materials.map(m => m.subject))].length;

  // Group by Subject
  const groupedMaterials = filteredMaterials.reduce((acc: any, m: any) => {
    const subj = m.subject || "General Resources";
    if (!acc[subj]) acc[subj] = [];
    acc[subj].push(m);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Digital Repository...</p>
      </div>
    );

  return (
    <div className="space-y-2 animate-fade-in pb-12">
      
      {/* 1. SYNCED STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-xl rounded-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 shadow-sm">
        <div>
           <h1 className="text-xl font-black text-blue-700 tracking-tight leading-none">Digital Assets</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">Resource Repository & Study Node</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-white shadow-xl shadow-slate-200 flex items-center gap-4">
              <div className="text-right border-r border-white/10 pr-4">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Repo Status</p>
                 <h4 className="text-sm font-black text-emerald-400 leading-none mt-1">ONLINE</h4>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Total Items</p>
                 <h4 className="text-sm font-black text-white leading-none mt-1">{materials.length}</h4>
              </div>
           </div>
        </div>
      </div>

      {/* 2. SYNCED ANALYTICS VITALS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Assets", val: materials.length, icon: FiFolder, color: "text-blue-500", bg: "bg-blue-50", hb: "hover:border-blue-500", hbg: "hover:bg-blue-50/30" },
          { label: "Stream Count", val: subjectCount, icon: FiGrid, color: "text-amber-500", bg: "bg-amber-50", hb: "hover:border-amber-500", hbg: "hover:bg-amber-50/30" },
          { label: "Recent Nodes", val: filteredMaterials.length > 0 ? "2 NEW" : "SYNCED", icon: FiZap, color: "text-emerald-500", bg: "bg-emerald-50", hb: "hover:border-emerald-500", hbg: "hover:bg-emerald-50/30" },
          { label: "System Sync", val: "ACTIVE", icon: FiCpu, color: "text-indigo-500", bg: "bg-indigo-50", hb: "hover:border-indigo-500", hbg: "hover:bg-indigo-50/30" },
        ].map((item, i) => (
          <div key={i} className={`card-clean p-4 mb-3 bg-white border-slate-200 group ${item.hb} ${item.hbg} hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
             <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm`}>
                   <item.icon size={16} />
                </div>
                <span className="text-lg font-black text-slate-800 tracking-tighter">{item.val}</span>
             </div>
             <div className="mt-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none group-hover:text-slate-600 transition-colors">{item.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* 3. ASSET SEARCH & FILTERS */}
      <div className="flex items-center justify-between gap-4 mb-4">
         <div className="relative flex-1 max-w-sm group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input
               type="text"
               placeholder="Search by asset title or subject..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none hover:border-slate-300"
            />
         </div>
      </div>

      {/* 4. GROUPED ASSET LEDGER */}
      <div className="space-y-6">
        {Object.entries(groupedMaterials).map(([subject, items]: [string, any], idx) => (
          <div key={idx} className="space-y-3 animate-slide-up">
            <div className="flex items-center gap-4 px-2">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-sm" />
                  <h3 className="bg-blue-500 rounded-full px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">{subject}</h3>
               </div>
               <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="card-clean border-slate-200 bg-white overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                           <th className="px-4 py-3">Asset Designation</th>
                           <th className="px-4 py-3">Operational Timeline</th>
                           <th className="px-4 py-3 text-right">Resource Link</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {items.map((m: any, i: number) => (
                           <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                              <td className="px-4 py-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all shadow-sm">
                                       <FiFileText size={18} />
                                    </div>
                                    <div>
                                       <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none">{m.title}</h4>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Verified Content Node</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-4 py-4">
                                 <div className="flex items-center gap-2 text-slate-600">
                                    <FiClock size={14} className="text-indigo-500" />
                                    <span className="text-xs font-black tracking-tight">{new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                 </div>
                              </td>
                              <td className="px-4 py-4 text-right">
                                 <a
                                    href={`http://localhost:5000${m.fileUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-sm transform group-hover:translate-x-1"
                                 >
                                    <FiDownload size={14} /> Download Asset
                                 </a>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="py-32 text-center card-clean border-dashed border-slate-200 bg-white">
           <FiFolder size={48} className="text-slate-100 mx-auto mb-4" />
           <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No Assets Detected in Repository</p>
        </div>
      )}
    </div>
  );
};

export default StudentMaterialPanel;
