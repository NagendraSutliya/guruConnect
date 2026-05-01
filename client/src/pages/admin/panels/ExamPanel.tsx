import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import {
  FiBookOpen,
  FiEdit,
  FiSearch,
  FiX,
  FiTrash2,
  FiChevronDown,
  FiUser,
  FiAward,
  FiBarChart2,
  FiPlus,
  FiArrowRight,
  FiActivity,
} from "react-icons/fi";
import type { Exam } from "../../../types/admin/exam";
import type { Class } from "../../../types/admin/class";
import type { Section } from "../../../types/admin/section";
import EditExamModal from "../../modals/admin/UpdateExamModal";
import Toast from "../../../components/Toast";

const MetricCard = ({ title, value, icon, gradient }: any) => (
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-2xl shadow-lg transition-transform duration-500 group-hover:rotate-6`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
    </div>
  </div>
);

const ExamPanel = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    classId: "",
    sectionId: "",
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warn";
  } | null>(null);

  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadData = async () => {
    try {
      setLoading(true);
      const [examsRes, classRes, sectionRes, examSubRes] = await Promise.all([
        api.get("/admin/exams"),
        api.get("/admin/classes"),
        api.get("/admin/sections"),
        api.get("/admin/exam-subjects"),
      ]);

      const examData = examsRes.data.data;
      const examSubjects = examSubRes.data.data;

      const examsWithSubjects = examData.map((exam: any) => {
        const subjects = examSubjects.filter(
          (es: any) => es.examId?._id === exam._id
        );
        return { ...exam, subjects };
      });

      setExams(examsWithSubjects);
      setClasses(classRes.data.data);
      setSections(sectionRes.data.data);
    } catch (err) {
      setToast({ message: "Failed to load examination data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/admin/exams", form);
      setToast({ message: "Examination schedule created", type: "success" });
      setForm({ name: "", classId: "", sectionId: "" });
      setCurrentPage(1);
      loadData();
    } catch (err) {
      setToast({ message: "Failed to create examination", type: "error" });
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this examination? This will remove all associated subjects.")) return;
    try {
      await api.delete(`/admin/exams/${id}`);
      setToast({ message: "Examination deleted", type: "success" });
      loadData();
    } catch (err) {
      setToast({ message: "Delete operation failed", type: "error" });
    }
  };

  const updateExam = async () => {
    if (!editExam) return;
    try {
      await api.put(`/admin/exams/${editExam._id}`, editExam);
      setToast({ message: "Examination details updated", type: "success" });
      setEditExam(null);
      loadData();
    } catch (err) {
      setToast({ message: "Update operation failed", type: "error" });
    }
  };

  const examsubject = (exam: any) => {
    navigate(`/admin/exam-subjects/${exam._id}`, {
      state: { classId: exam.classId?._id || exam.classId },
    });
  };

  const getExamStatus = (subjects: any[] = []) => {
    if (!subjects.length) return "upcoming";
    const now = new Date();
    let hasOngoing = false;
    let allCompleted = true;

    for (let sub of subjects) {
      const examDate = new Date(sub.date);
      const [sh, sm] = sub.startTime.split(":");
      const [eh, em] = sub.endTime.split(":");
      const start = new Date(examDate);
      start.setHours(Number(sh), Number(sm));
      const end = new Date(examDate);
      end.setHours(Number(eh), Number(em));

      if (now >= start && now <= end) hasOngoing = true;
      if (now < end) allCompleted = false;
    }
    if (hasOngoing) return "active";
    if (allCompleted) return "completed";
    return "upcoming";
  };

  const filteredExams = useMemo(() => {
    return exams.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [exams, search]);

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExams.slice(start, start + itemsPerPage);
  }, [filteredExams, currentPage, itemsPerPage]);

  const filteredSections = useMemo(() => {
    if (!form.classId) return [];
    return sections.filter(
      (s: any) => s.classId === form.classId || s.classId?._id === form.classId
    );
  }, [sections, form.classId]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Examination Hub</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage exam cycles, schedules, and subject assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiActivity />
            <span>Sync Hub</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Exam Cycles" value={exams.length} icon={<FiBookOpen />} gradient="from-indigo-500 to-indigo-600" />
        <MetricCard title="Participating Classes" value={classes.length} icon={<FiUser />} gradient="from-purple-500 to-purple-600" />
        <MetricCard title="Sections Involved" value={sections.length} icon={<FiAward />} gradient="from-amber-500 to-amber-600" />
        <MetricCard title="Live Examinations" value={exams.filter(e => getExamStatus(e.subjects) === 'active').length} icon={<FiBarChart2 />} gradient="from-emerald-500 to-emerald-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Creation Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm sticky top-32 space-y-8">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <div className="p-1 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                 <FiPlus className="text-white" />
               </div>
               Create Cycle
            </h3>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cycle Name</label>
                <input
                  type="text"
                  placeholder="e.g. Final Term 2026"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Class</label>
                <div className="relative">
                  <select
                    value={form.classId}
                    onChange={(e) => setForm({ ...form, classId: e.target.value, sectionId: "" })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Specific (Optional)</label>
                <div className="relative">
                  <select
                    value={form.sectionId}
                    onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                    disabled={!form.classId}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">All Sections</option>
                    {filteredSections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={submit}
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
              >
                Launch Exam Cycle
              </button>
            </div>
          </div>
        </div>

        {/* Exam Table */}
        <div className="xl:col-span-2">
           <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                   <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                   Examination Cycles
                 </h3>
                 <div className="relative w-full sm:w-80">
                   <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input
                     placeholder="Search schedules..."
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
                      <th className="px-8 py-5">Exam Cycle</th>
                      <th className="px-8 py-5">Academic Level</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                       <tr><td colSpan={4} className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest">Syncing Exams...</td></tr>
                    ) : paginatedExams.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-16 text-center">
                          <div className="flex flex-col items-center opacity-30">
                            <FiBookOpen size={48} className="mb-3" />
                            <p className="text-sm font-black uppercase tracking-widest">No exams scheduled</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedExams.map((exam) => {
                        const status = getExamStatus(exam.subjects || []);
                        const statusColor = status === 'active' ? 'bg-emerald-100 text-emerald-600' : status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-600';

                        return (
                          <tr key={exam._id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                            <td className="px-8 py-5">
                              <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{exam.name}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                 <FiBarChart2 className="w-3 h-3 text-slate-400" />
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                   {exam.subjects?.length || 0} Subjects Assigned
                                 </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex flex-col gap-1">
                                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit">
                                    Class {exam.classId?.name || "N/A"}
                                  </span>
                                  {exam.sectionId && (
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Section {exam.sectionId.name}</span>
                                  )}
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
                                   onClick={() => examsubject(exam)}
                                   className="p-2.5 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all flex items-center gap-2"
                                   title="Manage Subjects"
                                 >
                                   <FiArrowRight size={16} />
                                   <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Schedule</span>
                                 </button>
                                 <button
                                   onClick={() => setEditExam(exam)}
                                   className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                                 >
                                   <FiEdit size={16} />
                                 </button>
                                 <button
                                   onClick={() => remove(exam._id)}
                                   className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                 >
                                   <FiTrash2 size={16} />
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
              {!loading && filteredExams.length > 0 && (
                <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 text-[11px] font-black uppercase tracking-widest text-slate-600">
                   <div className="flex items-center gap-4">
                      <span>Show per page</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none"
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

      {editExam && (
        <EditExamModal
          editExam={editExam}
          setEditExam={setEditExam}
          updateExam={updateExam}
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

export default ExamPanel;
