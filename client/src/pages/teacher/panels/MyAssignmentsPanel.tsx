import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiBookOpen,
  FiLayers,
  FiBox,
  FiRefreshCw,
  FiGrid,
  FiList,
  FiSearch,
  FiX,
  FiChevronRight,
  FiCalendar,
  FiActivity
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import Pagination from "../../../components/common/Pagination";

const MetricCard = ({ title, value, icon: Icon, gradient }: any) => (
  <div className="relative overflow-hidden bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group flex-1">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110`} />
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-800">{value}</h3>
      </div>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

export default function MyAssignmentsPanel() {
  const { showToast } = useToast();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [view, setView] = useState<"table" | "card">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/teacher/assignments/my");
      setList(res.data.data || []);
    } catch (e) {
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return list.filter((a) =>
      `${a.classId?.name} ${a.sectionId?.name} ${a.subjectId?.name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [list, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const stats = useMemo(() => {
    return {
      total: list.length,
      classes: new Set(list.map((i) => i.classId?.name)).size,
      subjects: new Set(list.map((i) => i.subjectId?.name)).size,
    };
  }, [list]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">

      {/* Premium Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 border-b border-blue-200 shadow-sm backdrop-blur-md bg-white/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <FiBookOpen className="text-indigo-600" />
              Curriculum Map
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage and track your assigned academic sessions.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-black border border-slate-200 shadow-sm transition-all active:scale-95 text-[10px] uppercase tracking-widest"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              {loading ? "Syncing..." : "Sync Ledger"}
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-black shadow-lg shadow-indigo-100 transition-all active:scale-95 text-xs">
              <FiActivity />
              REPORT PROGRESS
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="flex flex-col sm:flex-row gap-6">
        <MetricCard title="Total Modules" value={stats.total} icon={FiBookOpen} gradient="from-blue-500 to-indigo-600" />
        <MetricCard title="Distinct Classes" value={stats.classes} icon={FiLayers} gradient="from-purple-500 to-indigo-600" />
        <MetricCard title="Subject Areas" value={stats.subjects} icon={FiBox} gradient="from-amber-400 to-orange-600" />
      </div>

      {/* Toolbar */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 p-5 rounded-[2rem] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <FiSearch size={16} />
          </div>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by class or subject..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setView("table")}
            className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              view === "table" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiList size={14} />
            List View
          </button>
          <button
            onClick={() => setView("card")}
            className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              view === "card" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiGrid size={14} />
            Grid View
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {view === "table" ? (
          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                  <th className="px-8 py-4">Class Designation</th>
                  <th className="px-8 py-4 text-center">Section</th>
                  <th className="px-8 py-4">Subject Focus</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedData.map((a) => (
                  <tr key={a._id} className="group hover:bg-indigo-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-700 text-sm">{a.classId?.name}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {a.sectionId?.name}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <p className="text-sm font-medium text-slate-600">{a.subjectId?.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setSelected(a)}
                        className="text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform"
                      >
                        Details <FiChevronRight />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedData.map((a) => (
              <div
                key={a._id}
                className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <FiLayers size={24} />
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {a.sectionId?.name}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-1">{a.classId?.name}</h3>
                <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-2">
                  <FiBookOpen size={14} className="text-indigo-400" />
                  {a.subjectId?.name}
                </p>
                <button
                  onClick={() => setSelected(a)}
                  className="w-full py-3 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  View Full Specs
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-[2rem]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <FiSearch size={40} />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching assignments found</p>
          </div>
        )}
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

      {/* Side Drawer Details */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideIn">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Assignment Context</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Detailed Module Specifications</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-800">
                <FiX size={24} />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                     <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                        <FiLayers size={24} />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Active Class</p>
                        <p className="text-lg font-black text-indigo-900">{selected.classId?.name}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Section</p>
                        <p className="font-bold text-slate-700">{selected.sectionId?.name}</p>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Students</p>
                        <p className="font-bold text-slate-700">Calculated...</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                    <FiActivity size={10} className="text-indigo-500" /> Subject Specifications
                  </h3>
                  <div className="p-6 border border-slate-100 rounded-2xl space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm font-medium text-slate-500">Core Subject</span>
                        <span className="text-sm font-bold text-slate-800">{selected.subjectId?.name}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm font-medium text-slate-500">Academic Year</span>
                        <span className="text-sm font-bold text-slate-800">2023-24</span>
                     </div>
                     <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-slate-500">Assignment ID</span>
                        <span className="text-xs font-mono text-slate-400">{selected._id}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
               <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <FiCalendar /> VIEW TIMETABLE
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
