import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiEdit, FiTrash2, FiSearch, FiChevronLeft, FiPlus, FiClock, FiCalendar, FiTarget, FiActivity } from "react-icons/fi";
import api from "../../../api/axiosInstance";
import Toast from "../../../components/Toast";
import UpdateExamSubjectModal from "../../modals/admin/UpdateExamSubjectModal";

const ExamSubjectPanel = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const classId = location.state?.classId;

  const [subjects, setSubjects] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [form, setForm] = useState({
    subjectId: "",
    date: "",
    startTime: "",
    endTime: "",
    maxMarks: 100,
  });

  const [editData, setEditData] = useState<any>(null);

  const showToast = (toast: {
    message: string;
    type?: "success" | "error" | "info" | "warn";
  }) => setToastMessage(toast);

  const fetchData = async () => {
    if (!examId) return;
    try {
      setLoading(true);
      const [subRes, allSubRes] = await Promise.all([
        api.get(`/admin/exam-subjects/${examId}`),
        api.get("/admin/subjects"),
      ]);
      setSubjects(subRes.data.data || []);
      setAllSubjects(allSubRes.data.data || []);
    } catch (err) {
      showToast({ message: "Failed to synchronize exam subjects", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  const handleAdd = async () => {
    if (!form.subjectId || !form.date) {
      return showToast({ message: "Subject and Date are required", type: "warn" });
    }
    try {
      await api.post("/admin/exam-subjects", { examId, ...form });
      setForm({ subjectId: "", date: "", startTime: "", endTime: "", maxMarks: 100 });
      fetchData();
      showToast({ message: "Subject added to schedule", type: "success" });
    } catch (err: any) {
      showToast({ message: err.response?.data?.message || "Operation failed", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this subject from the examination schedule?")) return;
    try {
      await api.delete(`/admin/exam-subjects/${id}`);
      fetchData();
      showToast({ message: "Subject removed", type: "success" });
    } catch (err) {
      showToast({ message: "Delete failed", type: "error" });
    }
  };

  const getStatus = (date: string, start: string, end: string) => {
    const now = new Date();
    const examDate = new Date(date);
    const [startH, startM] = start.split(":");
    const [endH, endM] = end.split(":");
    const startDateTime = new Date(examDate);
    startDateTime.setHours(Number(startH), Number(startM));
    const endDateTime = new Date(examDate);
    endDateTime.setHours(Number(endH), Number(endM));

    if (now < startDateTime) return "upcoming";
    if (now >= startDateTime && now <= endDateTime) return "ongoing";
    return "completed";
  };

  const filtered = subjects.filter((s) =>
    s.subjectId?.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const filteredSubjects = useMemo(() => {
    if (!classId) return [];
    return allSubjects.filter((s: any) => s.classId === classId || s.classId?._id === classId);
  }, [allSubjects, classId]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {toastMessage && (
        <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}

      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <FiChevronLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Subject Scheduling</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Configure paper dates, timings, and weightage for this exam cycle.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiClock />
            <span>Sync Schedule</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Form Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm sticky top-32 space-y-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <div className="p-1 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                 <FiPlus className="text-white" />
               </div>
               Add Paper
            </h3>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Subject</label>
                <div className="relative">
                  <select
                    value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Choose Subject</option>
                    {filteredSubjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Examination Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                    />
                 </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Marks</label>
                <div className="relative">
                   <input
                     type="number"
                     value={form.maxMarks}
                     onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })}
                     className="w-full pl-5 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                   />
                   <FiTarget className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95"
              >
                Schedule Paper
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="xl:col-span-3">
           <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                   <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                   Paper Schedule
                 </h3>
                 <div className="relative w-full sm:w-80">
                   <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input
                     placeholder="Search scheduled papers..."
                     value={search}
                     onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                     className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                   />
                 </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-100">
                      <th className="px-8 py-5">Subject Details</th>
                      <th className="px-8 py-5">Date & Time</th>
                      <th className="px-8 py-5">Weightage</th>
                      <th className="px-8 py-5">Lifecycle</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading && paginatedExams.length === 0 ? (
                       <tr><td colSpan={5} className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest">Compiling Schedule...</td></tr>
                    ) : paginatedExams.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-16 text-center">
                          <div className="flex flex-col items-center opacity-30">
                            <FiActivity size={48} className="mb-3" />
                            <p className="text-sm font-black uppercase tracking-widest">No papers scheduled</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedExams.map((s) => {
                        const status = getStatus(s.date, s.startTime, s.endTime);
                        const statusColor = status === 'ongoing' ? 'bg-emerald-100 text-emerald-600' : status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-600';

                        return (
                          <tr key={s._id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                            <td className="px-8 py-5">
                               <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{s.subjectId?.name}</p>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paper ID: {s._id.slice(-6)}</span>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                     <FiCalendar className="text-indigo-400" />
                                     {new Date(s.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                     <FiClock />
                                     {s.startTime} - {s.endTime}
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg w-fit">
                                  <FiTarget className="text-slate-400" />
                                  <span className="text-xs font-black text-slate-600">{s.maxMarks}</span>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
                                 {status}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <div className="flex items-center justify-end gap-1">
                                 <button
                                   onClick={() => setEditData(s)}
                                   disabled={status !== "upcoming"}
                                   className={`p-2.5 rounded-xl transition-all ${status !== "upcoming" ? "opacity-30 cursor-not-allowed" : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"}`}
                                 >
                                   <FiEdit size={18} />
                                 </button>
                                 <button
                                   onClick={() => handleDelete(s._id)}
                                   className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                 >
                                   <FiTrash2 size={18} />
                                 </button>
                               </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && filtered.length > 0 && (
                <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 text-[11px] font-black uppercase tracking-widest text-slate-600">
                   <div className="flex items-center gap-4">
                      <span>Entries per page</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none"
                      >
                        {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
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

      {editData && (
        <UpdateExamSubjectModal
          editData={editData}
          setEditData={setEditData}
          refreshList={fetchData}
          setToast={showToast}
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

export default ExamSubjectPanel;
