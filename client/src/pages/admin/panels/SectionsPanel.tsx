import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { FiTrash2, FiEdit, FiChevronDown, FiSearch, FiX, FiPlus, FiLayers } from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import type { Section } from "../../../types/admin/section";
import type { Class } from "../../../types/admin/class";
import UpdateSectionModal from "../../../components/admin/modals/UpdateSectionModal";

const SectionsPanel = () => {
  const { showToast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        api.get("/admin/sections"),
        api.get("/admin/classes"),
      ]);
      setSections(s.data.data);
      setClasses(c.data.data);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddSection = async () => {
    if (!name || !classId) {
      showToast("Class and Section name are required", "warn");
      return;
    }

    try {
      await api.post("/admin/sections", { name, classId });
      showToast("Section created successfully", "success");
      setName("");
      setClassId("");
      load();
    } catch {
      showToast("Failed to create section", "error");
    }
  };

  const deleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await api.delete(`/admin/sections/${id}`);
      showToast("Section deleted", "success");
      load();
    } catch {
      showToast("Failed to delete section", "error");
    }
  };

  const editSection = (section: Section) => setEditingSection(section);

  const filteredSections = useMemo(() => {
    return sections.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.classId?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [sections, search]);

  const totalPages = Math.ceil(filteredSections.length / itemsPerPage);
  const paginatedSections = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSections.slice(start, start + itemsPerPage);
  }, [filteredSections, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Section Management</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Organize classes into smaller sections for better student distribution.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiLayers />
            <span>Sync Sections</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Configuration Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm sticky top-32 space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                 <FiPlus className="text-white" />
               </div>
               New Section
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Class</label>
                <div className="relative">
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select class</option>
                    {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Identifier</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Section A"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <button
                onClick={handleAddSection}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Add Section"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Table View */}
        <div className="xl:col-span-2">
          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                   <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                   Active Sections
                 </h3>
                <div className="relative w-full sm:w-64">
                   <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input
                     placeholder="Search sections..."
                     value={search}
                     onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                     className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                   />
                </div>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-100">
                     <th className="px-8 py-5">Parent Class</th>
                     <th className="px-8 py-5">Section Name</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {filteredSections.length > 0 ? (
                     paginatedSections.map((s) => (
                       <tr key={s._id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                         <td className="px-8 py-4">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-black uppercase tracking-wider border border-indigo-100/50">
                             {s.classId?.name || "N/A"}
                            </span>
                         </td>
                         <td className="px-8 py-4">
                           <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                         </td>
                         <td className="px-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                               <button
                                 onClick={() => editSection(s)}
                                 className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                               >
                                 <FiEdit size={16} />
                               </button>
                               <button
                                 onClick={() => deleteSection(s._id)}
                                 className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                               >
                                 <FiTrash2 size={16} />
                               </button>
                            </div>
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={3} className="p-16 text-center">
                          <div className="flex flex-col items-center opacity-30">
                            <FiLayers size={48} className="mb-3" />
                            <p className="text-sm font-black uppercase tracking-widest">No sections found</p>
                          </div>
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>

             {/* Pagination */}
             {!loading && filteredSections.length > 0 && (
               <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 text-[11px] font-black uppercase tracking-widest text-slate-600">
                  <div className="flex items-center gap-4">
                     <span>Show</span>
                     <select
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                     >
                       {[5, 10, 25].map(n => <option key={n} value={n}>{n}</option>)}
                     </select>
                  </div>
                  <div className="flex items-center gap-6">
                     <span>Page <span className="text-indigo-600 font-black">{currentPage}</span> of {totalPages || 1}</span>
                     <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 hover:bg-white hover:shadow-md rounded-xl transition-all disabled:opacity-30">Prev</button>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-2 hover:bg-white hover:shadow-md rounded-xl transition-all disabled:opacity-30">Next</button>
                     </div>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {editingSection && (
        <UpdateSectionModal
          section={editingSection}
          classes={classes}
          onClose={() => setEditingSection(null)}
          onUpdated={load}
        />
      )}

    </div>
  );
};

export default SectionsPanel;
