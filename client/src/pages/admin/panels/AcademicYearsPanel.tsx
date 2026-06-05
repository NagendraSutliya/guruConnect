import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiEdit,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiSearch,  
  FiPlus,
  FiCalendar,
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import type { AcademicYear } from "../../../types/admin/academicYear";
import UpdateAcademicYearModal from "../../../components/admin/modals/UpdateAcademicYearModal";
import Pagination from "../../../components/common/Pagination";

const getDefaultSessionDates = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  let startYear, endYear;
  if (month < 7) {
    startYear = year - 1;
    endYear = year;
  } else {
    startYear = year;
    endYear = year + 1;
  }

  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return {
    startDate: formatLocalDate(new Date(startYear, 6, 1)),
    endDate: formatLocalDate(new Date(endYear, 3, 31)),
    name: `${startYear}-${endYear}`,
  };
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
};

const AcademicYearsPanel = () => {
  const { showToast } = useToast();
  const defaultDates = getDefaultSessionDates();

  const [years, setYears] = useState<AcademicYear[]>([]);
  const [form, setForm] = useState(defaultDates);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/academic/academic-year");
      setYears(res.data.data);
    } catch {
      showToast("Failed to load", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.startDate || !form.endDate)
      return showToast("Fill all fields", "warn");

    setLoading(true);
    try {
      await api.post("/admin/academic/academic-year", form);
      showToast("Academic year added", "success");
      setForm(defaultDates);
      load();
    } catch {
      showToast("Error creating academic year", "error");
    } finally {
      setLoading(false);
    }
  };

  const activate = async (id: string) => {
    await api.patch(`/admin/academic/academic-year/${id}/activate`);
    load();
  };

  const deactivate = async (id: string) => {
    await api.patch(`/admin/academic/academic-year/${id}/deactivate`);
    load();
  };

  const remove = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    await api.delete(`/admin/academic/academic-year/${id}`);
    load();
  };

  const edit = (y: AcademicYear) => {
    setEditingYear(y);
  };

  const filtered = years.filter(
    (y) =>
      y.name.toLowerCase().includes(search.toLowerCase()) ||
      (y.isActive ? "active" : "inactive").includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Academic Timeline</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Define and manage academic sessions and active school years.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiCalendar />
            <span>Sync Years</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left: Configuration Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm sticky top-32 space-y-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <div className="p-1 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                 <FiPlus className="text-white" />
               </div>
               New Session
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. 2026-2027"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Create Session"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Timeline View */}
        <div className="xl:col-span-3">
           <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                   <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                   Academic Sessions
                 </h3>
                 <div className="relative w-full sm:w-80">
                   <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input
                     placeholder="Search sessions..."
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
                      <th className="px-8 py-5">Session Year</th>
                      <th className="px-8 py-5">Duration</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.length > 0 ? (
                      paginated.map((y) => (
                        <tr key={y._id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                          <td className="px-8 py-4">
                            <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{y.name}</p>
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Starts</span>
                                  <span className="text-xs font-bold text-slate-600">{formatDate(y.startDate)}</span>
                               </div>
                               <div className="h-6 w-px bg-slate-200" />
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ends</span>
                                  <span className="text-xs font-bold text-slate-600">{formatDate(y.endDate)}</span>
                               </div>
                            </div>
                          </td>
                          <td className="px-8 py-4">
                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                               y.isActive ? "bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200/50" : "bg-slate-100 text-slate-500"
                             }`}>
                               {y.isActive ? "Active Session" : "Inactive"}
                             </span>
                          </td>
                          <td className="px-8 py-4 text-right">
                             <div className="flex items-center justify-end gap-1">
                               <button
                                 onClick={() => y.isActive ? deactivate(y._id) : activate(y._id)}
                                 className={`p-2.5 rounded-xl transition-all ${
                                   y.isActive ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                 }`}
                                 title={y.isActive ? "Deactivate Session" : "Set as Active"}
                               >
                                 {y.isActive ? <FiToggleLeft size={18} /> : <FiToggleRight size={18} />}
                               </button>
                               <button
                                 onClick={() => edit(y)}
                                 className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                               >
                                 <FiEdit size={18} />
                               </button>
                               <button
                                 onClick={() => remove(y._id)}
                                 className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                               >
                                 <FiTrash2 size={18} />
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-16 text-center">
                          <div className="flex flex-col items-center opacity-30">
                            <FiCalendar size={48} className="mb-3" />
                            <p className="text-sm font-black uppercase tracking-widest">No academic years defined</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && filtered.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
           </div>
        </div>
      </div>

      {editingYear && (
        <UpdateAcademicYearModal
          year={editingYear}
          onClose={() => setEditingYear(null)}
          onUpdated={load}
        />
      )}

    </div>
  );
};

export default AcademicYearsPanel;
