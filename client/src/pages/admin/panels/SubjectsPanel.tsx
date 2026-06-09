import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { FiTrash2, FiEdit, FiChevronDown, FiSearch,  FiPlus, FiBookOpen } from "react-icons/fi";
import type { Subject } from "../../../types/admin/subject";
import type { Section } from "../../../types/admin/section";
import type { Class } from "../../../types/admin/class";
import UpdateSubjectModal from "../../../components/admin/modals/UpdateSubjectModal";
import Pagination from "../../../components/common/Pagination";

const SubjectsPanel = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const cRes = await api.get("/admin/classes");
      setClasses(cRes.data.data);

      const sRes = await api.get("/admin/subjects");
      setSubjects(sRes.data.data);
    } catch (err: any) {
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const loadSections = async () => {
      if (!selectedClass) {
        setSections([]);
        setSelectedSection("");
        return;
      }
      try {
        const res = await api.get(`/admin/sections/class/${selectedClass}`);
        setSections(res.data.data);
        setSelectedSection("");
      } catch {
        setSections([]);
      }
    };
    loadSections();
  }, [selectedClass]);

  const generateCode = (subjectName: string, className: string) => {
    const sub = subjectName
      .trim()
      .substring(0, 4)
      .toUpperCase()
      .replace(/\s+/g, "");
    const grade = className.match(/\d+/)?.[0] || "";
    return sub + grade;
  };

  const saveSubject = async () => {
    if (!name.trim() || !selectedClass) {
     
      return;
    }

    try {
      const selectedClassObj = classes.find((c) => c._id === selectedClass);
      if (!selectedClassObj) throw new Error("Class not found");

      const generatedCode = editId
        ? subjects.find((s) => s._id === editId)?.code || ""
        : generateCode(name, selectedClassObj.name);

      const payload = {
        name,
        code: generatedCode,
        classId: selectedClass,
        sectionId: selectedSection || undefined,
      };

      if (editId) {
        await api.put(`/admin/subjects/${editId}`, payload);
        
        setEditId(null);
      } else {
        await api.post("/admin/subjects", payload);
      ;
      }

      setName("");
      setSelectedClass("");
      setSelectedSection("");
      loadData();
    } catch (err: any) {
     
    }
  };

  const editSubject = (s: Subject) => {
    setEditingSubject(s);
  };

  const deleteSubject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await api.delete(`/admin/subjects/${id}`);
     
    } catch {
      
    }
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.classId?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.sectionId?.name || "All").toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [subjects, search]);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubjects.slice(start, start + itemsPerPage);
  }, [filteredSubjects, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Subject Registry</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage core curriculum subjects and assign them to specific classes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiBookOpen />
            <span>Sync Library</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar: Configuration */}
        <div className="xl:col-span-1">
          <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm sticky top-32 space-y-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <div className="p-1 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                 <FiPlus className="text-white" />
               </div>
               Add Subject
            </h3>

            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class</label>
                  <div className="relative">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Select class</option>
                      {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section (Optional)</label>
                  <div className="relative">
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      disabled={!selectedClass}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="">All Sections</option>
                      {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  />
               </div>

               <button
                onClick={saveSubject}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95"
              >
                Create Subject
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Table */}
        <div className="xl:col-span-3">
           <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                   <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                   Subject List
                 </h3>
                 <div className="relative w-full sm:w-80">
                   <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input
                     placeholder="Search code, name or class..."
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
                      <th className="px-8 py-5">Code</th>
                      <th className="px-8 py-5">Subject Name</th>
                      <th className="px-8 py-5">Academic Area</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredSubjects.length > 0 ? (
                      paginatedSubjects.map((s) => (
                        <tr key={s._id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                          <td className="px-8 py-4">
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black tracking-widest border border-slate-200/50 group-hover:border-indigo-200 transition-colors">
                              {s.code}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-2">
                               <span className="text-xs font-bold text-slate-500">Class {s.classId?.name || "N/A"}</span>
                               <div className="w-1 h-1 rounded-full bg-slate-300" />
                               <span className="text-xs font-medium text-slate-400">Section: {s.sectionId?.name || "All"}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => editSubject(s)}
                                className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                onClick={() => deleteSubject(s._id)}
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
                        <td colSpan={4} className="p-16 text-center">
                          <div className="flex flex-col items-center opacity-30">
                            <FiBookOpen size={48} className="mb-3" />
                            <p className="text-sm font-black uppercase tracking-widest">No subjects defined</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && filteredSubjects.length > 0 && (
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

      {editingSubject && (
        <UpdateSubjectModal
          subject={editingSubject}
          classes={classes}
          sections={sections}
          onClose={() => setEditingSubject(null)}
          onUpdated={() => {
            loadData();
          }}
        />
      )}

     
    </div>
  );
};

export default SubjectsPanel;
