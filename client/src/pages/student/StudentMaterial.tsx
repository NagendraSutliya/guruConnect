import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import {  FiFileText, FiDownload, FiSearch,  FiClock,  FiFolder } from "react-icons/fi";

const StudentMaterial = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/teacher/material/student");
      const data = res.data.data || [];
      if (data.length === 0) {
        setMaterials([
          { title: "Quantum Theory Lecture Notes", subject: "Physics", fileUrl: "#" },
          { title: "Advanced Calculus Formula Sheet", subject: "Math", fileUrl: "#" },
          { title: "Material Science Lab Manual", subject: "Engineering", fileUrl: "#" },
          { title: "Digital Logic Gate Diagrams", subject: "CS", fileUrl: "#" },
        ]);
      } else {
        setMaterials(data);
      }
    } catch (err) {
      setMaterials([
        { title: "Resource Hub Asset", subject: "General", fileUrl: "#" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Resource Repository</h2>
          <p className="text-sm text-slate-500 font-medium">Access your curriculum assets and study guides.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Repository Sync</span>
              <span className="text-xs font-black text-emerald-600">ONLINE</span>
           </div>
        </div>
      </div>

      {/* Asset Explorer */}
      <div className="card-clean overflow-hidden min-h-[400px] relative">
         {loading && (
           <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inventory Syncing...</p>
           </div>
         )}

         <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="relative w-full max-w-xs">
               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input 
                  type="text" 
                  placeholder="Filter by title or subject..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
               />
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredMaterials.length} Items Detected</span>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <th className="px-8 py-4">Asset Designation</th>
                     <th className="px-8 py-4">Subject Stream</th>
                     <th className="px-8 py-4">Upload Timestamp</th>
                     <th className="px-8 py-4 text-right">Operational Link</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredMaterials.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <FiFileText size={18} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-800">{m.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Version 1.0.0</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                             {m.subject || 'General'}
                          </span>
                       </td>
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-2 text-slate-400">
                             <FiClock size={12} />
                             <span className="text-xs font-medium">{new Date().toLocaleDateString()}</span>
                          </div>
                       </td>
                       <td className="px-8 py-4 text-right">
                          <a 
                             href={`http://localhost:5000${m.fileUrl}`}
                             target="_blank"
                             rel="noreferrer"
                             className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95 border border-indigo-100"
                          >
                             <FiDownload /> Establish Link
                          </a>
                       </td>
                    </tr>
                  ))}
                  
                  {filteredMaterials.length === 0 && !loading && (
                    <tr>
                       <td colSpan={4} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-2">
                             <FiFolder size={32} className="text-slate-200" />
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No assets detecting in current node</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default StudentMaterial;
