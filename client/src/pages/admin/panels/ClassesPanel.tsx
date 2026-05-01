import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { FiChevronDown, FiEdit, FiSearch, FiTrash2, FiX, FiPlus, FiBox } from "react-icons/fi";
import Toast from "../../../components/Toast";
import type { Class } from "../../../types/admin/class";
import type { Section } from "../../../types/admin/section";
import type { AcademicYear } from "../../../types/admin/academicYear";
import UpdateClassModal from "../../modals/admin/UpdateClassModal";

const ClassesPanel = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<any>(null);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const showToast = (message: string, type = "info") =>
    setToastMessage({ message, type });

  useEffect(() => {
    api
      .get("/admin/academic/academic-year")
      .then((res) => {
        setYears(res.data.data);
        const activeYear = res.data.data.find((y: any) => y.isActive);
        if (activeYear) setAcademicYearId(activeYear._id);
      })
      .catch((err) => console.log(err.response?.data));
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/classes");
      setClasses(res.data.data);
    } catch (err) {
      showToast("Failed to load classes", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async () => {
    try {
      const res = await api.get("/admin/sections");
      setSections(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadClasses();
    loadSections();
  }, []);

  const handleAddClass = async () => {
    if (!name || !academicYearId) {
      showToast("All fields required", "warn");
      return;
    }

    try {
      await api.post("/admin/classes", { name, academicYearId });
      showToast("Class created successfully", "success");
      setName("");
      loadClasses();
      loadSections();
    } catch (err) {
      showToast("Failed to create class", "error");
    }
  };

  const deleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await api.delete(`/admin/classes/${id}`);
      showToast("Class deleted", "success");
      loadClasses();
      loadSections();
    } catch {
      showToast("Failed to delete class", "error");
    }
  };

  const editClass = (cls: Class) => setEditingClass(cls);

  const filteredClasses = useMemo(() => {
    return classes.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.academicYearId?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [classes, search]);

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClasses.slice(start, start + itemsPerPage);
  }, [filteredClasses, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Class Management</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Configure academic classes and their associated sections.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadClasses}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiSearch />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Add Class Form */}
        <div className="xl:col-span-1">
          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm sticky top-32">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
               <div className="p-1 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                 <FiPlus className="text-white" />
               </div>
               New Class
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
                <div className="relative">
                  <select
                    value={academicYearId}
                    onChange={(e) => setAcademicYearId(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select year</option>
                    {years.map((y) => (
                      <option key={y._id} value={y._id}>
                        {y.name} {y.isActive ? "(Active)" : ""}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Class 10 or Grade A"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <button
                onClick={handleAddClass}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Create Class"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Classes Table */}
        <div className="xl:col-span-2">
          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                 <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                 Active Classes
               </h3>
               <div className="relative">
                 <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input
                   placeholder="Search classes..."
                   value={search}
                   onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                   className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none lg:w-64"
                 />
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-8 py-5">Year</th>
                    <th className="px-8 py-5">Class Name</th>
                    <th className="px-8 py-5">Sections</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-500 font-bold">Loading records...</td>
                    </tr>
                  ) : paginatedClasses.length > 0 ? (
                    paginatedClasses.map((c) => {
                      const classSections = sections.filter((s) => s.classId?._id === c._id);
                      return (
                        <tr key={c._id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                          <td className="px-8 py-4">
                            <span className="text-xs font-black text-slate-400 uppercase">{c.academicYearId?.name || "N/A"}</span>
                          </td>
                          <td className="px-8 py-4">
                            <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{c.name}</p>
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex flex-wrap gap-2">
                              {classSections.length > 0 ? (
                                classSections.map((s) => (
                                  <span key={s._id} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                                    {s.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] font-bold text-slate-300 italic uppercase">No sections yet</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => editClass(c)}
                                className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                onClick={() => deleteClass(c._id)}
                                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="flex flex-col items-center opacity-30">
                          <FiBox size={48} className="mb-2" />
                          <p className="text-sm font-black uppercase tracking-widest">No classes found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && filteredClasses.length > 0 && (
              <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30 text-xs font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-3">
                  <span>Rows:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-white border border-slate-200 rounded-xl px-2 py-1 outline-none"
                  >
                    {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <span>Page <span className="text-indigo-600">{currentPage}</span> of {totalPages || 1}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-30 hover:bg-white hover:shadow-md rounded-lg">Prev</button>
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 disabled:opacity-30 hover:bg-white hover:shadow-md rounded-lg">Next</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingClass && (
        <UpdateClassModal
          cls={editingClass}
          years={years}
          onClose={() => setEditingClass(null)}
          onUpdated={() => {
            loadClasses();
            loadSections();
          }}
        />
      )}

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ClassesPanel;
