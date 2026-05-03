import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiChevronDown, FiEdit, FiSearch, FiTrash2,  FiPlus, FiUserCheck, FiBookOpen } from "react-icons/fi";
import type {
  Teacher,
  Assignment,
  FormState,
} from "../../../types/admin/teacherassignment";
import type { Class } from "../../../types/admin/class";
import type { Section } from "../../../types/admin/section";
import type { Subject } from "../../../types/admin/subject";
import UpdateTeacherAssignmentModal from "../../modals/admin/UpdateTeacherAssignmentModal";
import { useToast } from "../../../context/ToastContext";

const TeacherAssignPanel = () => {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
  });
  const [subjectsForClass, setSubjectsForClass] = useState<Subject[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const load = async () => {
    try {
      setLoading(true);
      const [tRes, cRes, subRes, aRes] = await Promise.all([
        api.get("/admin/teachers?status=active"),
        api.get("/admin/classes"),
        api.get("/admin/subjects"),
        api.get("/admin/teacher-assign"),
      ]);

      setTeachers(tRes.data.data);
      setClasses(cRes.data.data);
      setSubjects(subRes.data.data);
      setAssignments(aRes.data.data);
    } catch (err) {
      showToast("Sync error: Failed to retrieve assignments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeTeachers = teachers.filter((t) => t.status === "active");

  useEffect(() => {
    if (!form.classId) {
      setSections([]);
      setSubjectsForClass([]);
      setForm((prev) => ({ ...prev, sectionId: "", subjectId: "" }));
      return;
    }

    const loadSectionsAndSubjects = async () => {
      try {
        const [secRes, subRes] = await Promise.all([
          api.get(`/admin/sections/class/${form.classId}`),
          api.get(`/admin/subjects/class/${form.classId}`)
        ]);
        setSections(secRes.data.data);
        setSubjectsForClass(subRes.data.data);
        setForm((prev) => ({ ...prev, sectionId: "", subjectId: "" }));
      } catch (err) {
        setSubjectsForClass([]);
        setForm((prev) => ({ ...prev, sectionId: "", subjectId: "" }));
      }
    };

    loadSectionsAndSubjects();
  }, [form.classId]);

  const assign = async () => {
    if (!form.teacherId || !form.classId || !form.subjectId) {
      showToast("Incomplete details: Teacher, Class, and Subject are required", "warn");
      return;
    }

    try {
      setLoading(true);
      const payload: Partial<Assignment> = {
        teacherId: teachers.find((t) => t._id === form.teacherId),
        classId: classes.find((c) => c._id === form.classId),
        subjectId: subjects.find((s) => s._id === form.subjectId),
      };

      if (form.sectionId) {
        payload.sectionId = sections.find((s) => s._id === form.sectionId) || null;
      }

      await api.post("/admin/teacher-assign", payload);
      showToast("Success: Faculty assigned to subject", "success");
      setForm({ teacherId: "", classId: "", sectionId: "", subjectId: "" });
      load();
    } catch (err: any) {
      showToast("Operation failed: Could not create assignment", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeAssignment = async (id: string) => {
    if (!confirm("Revoke this teaching assignment?")) return;
    try {
      await api.delete(`/admin/teacher-assign/${id}`);
      showToast("Assignment revoked", "success");
      load();
    } catch (err: any) {
      showToast("Delete operation failed", "error");
    }
  };

  const getName = (field: Teacher | Class | Section | Subject | null | undefined) => {
    if (!field) return "-";
    return field.name || "-";
  };

  const filteredAssignments = assignments.filter((a) =>
    getName(a.teacherId).toLowerCase().includes(search.toLowerCase()) ||
    getName(a.subjectId).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isValid = form.teacherId && form.classId && form.subjectId;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Faculty Distribution</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Orchestrate teaching assignments across classes and subjects.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiSearch />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Assignment Sidebar */}
        <div className="xl:col-span-1">
          <div className="bg-purple-100 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm sticky top-32 space-y-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <div className="p-1 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                 <FiPlus className="text-white" />
               </div>
               New Allocation
            </h3>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1">Select Faculty</label>
                <div className="relative">
                  <select
                    value={form.teacherId}
                    onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Choose Teacher</option>
                    {activeTeachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1">Assigned Subject</label>
                <div className="relative">
                  <select
                    value={form.classId}
                    onChange={(e) => setForm({ ...form, classId: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1">Class Section (Optional)</label>
                <div className="relative">
                  <select
                    value={form.sectionId}
                    onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                    disabled={!form.classId}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">All Sections</option>
                    {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Assignment</label>
                <div className="relative">
                  <select
                    value={form.subjectId}
                    onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                    disabled={!form.classId}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Select Subject</option>
                    {subjectsForClass.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <button
                disabled={!isValid || loading}
                onClick={assign}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Allocating..." : "Complete Allocation"}
              </button>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="xl:col-span-3">
           <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                   <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                   Active Assignments
                 </h3>
                 <div className="relative w-full sm:w-80">
                   <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input
                     placeholder="Search faculty or subject..."
                     value={search}
                     onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                     className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                   />
                 </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-green-50 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-100">
                      <th className="px-8 py-5">Faculty</th>
                      <th className="px-8 py-5">Course / Subject</th>
                      <th className="px-8 py-5">Class Group</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading && paginatedAssignments.length === 0 ? (
                       <tr><td colSpan={4} className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest">Updating Ledger...</td></tr>
                    ) : paginatedAssignments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-16 text-center">
                          <div className="flex flex-col items-center opacity-30">
                            <FiUserCheck size={48} className="mb-3" />
                            <p className="text-sm font-black uppercase tracking-widest">No allocations recorded</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedAssignments.map((a) => (
                        <tr key={a._id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shadow-lg">
                                   {getName(a.teacherId).charAt(0)}
                                </div>
                                <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{getName(a.teacherId)}</p>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-2">
                                <FiBookOpen className="text-indigo-400" />
                                <span className="text-sm font-bold text-slate-600">{getName(a.subjectId)}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex flex-col gap-1">
                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit">
                                  Class {getName(a.classId)}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Section {getName(a.sectionId) || "Open"}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-1">
                               <button
                                 onClick={() => setEditingAssignment(a)}
                                 className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                               >
                                 <FiEdit size={18} />
                               </button>
                               <button
                                 onClick={() => removeAssignment(a._id)}
                                 className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                               >
                                 <FiTrash2 size={18} />
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && filteredAssignments.length > 0 && (
                <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 text-[10px] font-black uppercase tracking-widest text-slate-400">
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

      {editingAssignment && (
        <UpdateTeacherAssignmentModal
          assignment={editingAssignment}
          teachers={teachers}
          classes={classes}
          sections={sections}
          subjects={subjects}
          loading={loading}
          onClose={() => setEditingAssignment(null)}
          onUpdate={setEditingAssignment}
          updateAssignment={load} // refresh after update
        />
      )}

      
    </div>
  );
};

export default TeacherAssignPanel;
