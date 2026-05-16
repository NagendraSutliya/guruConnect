import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiUpload,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiFileText,
  FiExternalLink,
  FiFolder,
  FiPlus,
  FiPaperclip,
  FiTarget,
  FiActivity,
  FiBookOpen
} from "react-icons/fi";
import type { ResultClassAssignment } from "../../../types/teacher/types";
import { useToast } from "../../../context/ToastContext";
import { useTeacher } from "../../../context/TeacherContext";

const StudyMaterialPanel = () => {
  const { showToast } = useToast();
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<ResultClassAssignment[]>([]);

  const { 
    selectedClassId, setSelectedClassId, 
    selectedSectionId, setSelectedSectionId,
    selectedSubjectId, setSelectedSubjectId,
  } = useTeacher();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterMode, setFilterMode] = useState<"CHIPS" | "LIST">(() => (localStorage.getItem("guru_teacher_filter_mode") as any) || "CHIPS");

  useEffect(() => {
    fetchMaterials();
    fetchAssignments();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/teacher/study-material");
      // Handle nested paginated response { success, message, data: { data: [], total, ... } }
      const rawData = res.data?.data;
      const materialsArray = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : []);
      setMaterials(materialsArray);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get("/teacher-assign/my");
      const data = res.data?.data ?? [];
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const classes = Array.from(new Map(assignments.filter(a => a?.classId?._id).map((a) => [a.classId._id, a.classId])).values());
  const sections = Array.from(new Map(assignments.filter((a) => a?.classId?._id === selectedClassId && a?.sectionId?._id).map((a) => [a.sectionId._id, a.sectionId])).values());
  const subjects = Array.from(new Map(assignments.filter((a) => a?.classId?._id === selectedClassId && a?.sectionId?._id === selectedSectionId && a?.subjectId?._id).map((a) => [a.subjectId._id, a.subjectId])).values());

  const handleUpload = async () => {
    if (!title || !selectedClassId || !selectedSubjectId || !file) {
      return showToast("All fields are required", "error");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("classId", selectedClassId);
    formData.append("subjectId", selectedSubjectId);
    formData.append("file", file);

    try {
      setIsUploading(true);
      await api.post("/teacher/study-material", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setSelectedClassId("");
      setSelectedSectionId("");
      setSelectedSubjectId("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      showToast("Material uploaded successfully", "success");
      fetchMaterials();
    } catch (err) {
      console.error(err);
      showToast("Upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this material?")) return;
    try {
      await api.delete(`/teacher/study-material/${id}`);
      showToast("Material deleted", "success");
      fetchMaterials();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
      const matchesClass = selectedClassId ? m.classId?._id === selectedClassId : true;
      const matchesSubject = selectedSubjectId ? m.subjectId?._id === selectedSubjectId : true;
      return matchesSearch && matchesClass && matchesSubject;
    });
  }, [materials, search, selectedClassId, selectedSubjectId]);

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const paginatedMaterials = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMaterials.slice(start, start + itemsPerPage);
  }, [filteredMaterials, currentPage, itemsPerPage]);

  return (
    <div className="space-y-2">
      {/* Sticky Header - Synced Aura Style */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 mb-2 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Curriculum Vault</h1>
          <p className="text-xs text-slate-500 font-medium">Manage and distribute academic resources to your classes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">View Option</span>
            <div className="relative bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center w-40 h-9 overflow-hidden shadow-inner">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-md bg-gradient-to-r from-orange-500 to-rose-500 ${
                  filterMode === 'CHIPS' ? 'left-1' : 'left-[calc(50%+1px)]'
                }`}
              />
              <button 
                onClick={() => { setFilterMode("CHIPS"); localStorage.setItem("guru_teacher_filter_mode", "CHIPS"); }}
                className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'CHIPS' ? 'text-white' : 'text-slate-400'}`}
              >CHIPS</button>
              <button 
                onClick={() => { setFilterMode("LIST"); localStorage.setItem("guru_teacher_filter_mode", "LIST"); }}
                className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'LIST' ? 'text-white' : 'text-slate-400'}`}
              >LIST</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern High-Density Filter Vault */}
      <div className="card-clean px-6 py-2 bg-white/50 backdrop-blur-sm border-slate-300 mb-2">
        <div className="min-h-[50px] flex items-center">
          {filterMode === "CHIPS" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full animate-fade-in divide-x divide-slate-100">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiTarget className="text-indigo-600 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Class</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto no-scrollbar">
                  {classes.map((c) => (
                    <button
                      key={c?._id}
                      onClick={() => { setSelectedClassId(c?._id || ""); setSelectedSectionId(""); setSelectedSubjectId(""); }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                        selectedClassId === c?._id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                      }`}
                    >{c?.name}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 px-4">
                <div className="flex items-center gap-2">
                  <FiActivity className="text-emerald-500 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sections</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto no-scrollbar">
                  {selectedClassId ? sections.map((s) => (
                    <button
                      key={s?._id}
                      onClick={() => { setSelectedSectionId(s?._id || ""); setSelectedSubjectId(""); }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                        selectedSectionId === s?._id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-emerald-300'
                      }`}
                    >{s?.name}</button>
                  )) : <p className="text-[10px] font-bold text-slate-300 italic">Select class first</p>}
                </div>
              </div>

              <div className="space-y-3 px-4">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="text-rose-500 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subjects</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto no-scrollbar">
                  {selectedSectionId ? subjects.map((sub) => (
                    <button
                      key={sub?._id}
                      onClick={() => setSelectedSubjectId(sub?._id || "")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                        selectedSubjectId === sub?._id ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-rose-300'
                      }`}
                    >{sub?.name}</button>
                  )) : <p className="text-[10px] font-bold text-slate-300 italic">Select section first</p>}
                </div>
              </div>

              <div className="space-y-3 px-4">
                <div className="flex items-center gap-2">
                  <FiPlus className="text-amber-500 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Material Detail</label>
                </div>
                <div className="space-y-2">
                   <input
                    type="text"
                    placeholder="e.g. Chapter 1 Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-fade-in px-2">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Class</label>
                <div className="relative">
                  <select
                    value={selectedClassId}
                    onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSectionId(""); setSelectedSubjectId(""); }}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => <option key={c?._id} value={c?._id}>{c?.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Section</label>
                <div className="relative">
                  <select
                    value={selectedSectionId}
                    onChange={(e) => { setSelectedSectionId(e.target.value); setSelectedSubjectId(""); }}
                    disabled={!selectedClassId}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => <option key={s?._id} value={s?._id}>{s?.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Subject</label>
                <div className="relative">
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    disabled={!selectedSectionId}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => <option key={s?._id} value={s?._id}>{s?.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Material Title</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 1 Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 shadow-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Material Provisioning Action Bar */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex-1 w-full max-w-72">
              <div className="relative">
                <input
                  type="file"
                  ref={fileRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full px-4 py-2 border-2 border-dashed rounded-xl text-[10px] font-black 
                                flex items-center gap-2 transition-all ${
                                  file ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-inner' 
                                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}>
                   <FiPaperclip size={14} />
                   <span>{file ? file.name : "Attach academic payload (PDF, DOCX, ZIP)..."}</span>
                   {file && <span className="ml-auto text-[9px] text-indigo-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
                </div>
              </div>
           </div>
           <button
             onClick={handleUpload}
             disabled={isUploading || !title || !file || !selectedSubjectId}
             className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 uppercase tracking-widest disabled:opacity-50 whitespace-nowrap"
           >
             <FiUpload size={14} className={isUploading ? "animate-bounce" : ""} />
             <span>{isUploading ? "Uplinking..." : "Upload"}</span>
           </button>
        </div>
      </div>

      {/* Main Ledger Card */}
      <div className="card-clean relative overflow-hidden border-slate-300 flex flex-col">
        {/* Integrated Search Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur-md gap-4 shadow-sm">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Filter assets by title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredMaterials.length} Assets Found</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Syncing...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <FiFolder size={64} className="text-slate-300 mb-4" />
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">No curriculum assets indexed</p>
          </div>
        ) : (
          <div className="overflow-y-auto h-[calc(100vh-500px)] no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-green-50 shadow-sm">
                <tr className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-3">Asset Designation</th>
                  <th className="px-6 py-3">Classification</th>
                  <th className="px-6 py-3">Subject Feed</th>
                  <th className="px-6 py-3 text-center">Uplink</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedMaterials.map((m) => (
                  <tr key={m._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                            <FiFileText size={16} />
                         </div>
                         <p className="font-black text-slate-800 text-xs tracking-tight">{m.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                       <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                         Class {m.classId?.name || "N/A"}
                       </span>
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.subjectId?.name || "Global"}</p>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-black text-[9px] uppercase tracking-widest transition-all hover:gap-2"
                      >
                        <FiExternalLink size={12} /> Access File
                      </a>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Asset"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sync Pagination Footer */}
        {!loading && filteredMaterials.length > 0 && (
          <div className="px-6 py-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 shrink-0">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Show</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                >
                  {[5, 10, 25, 50].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30 shadow-sm"
                >Prev</button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                        currentPage === pageNum 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
                      }`}
                    >{pageNum}</button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30 shadow-sm"
                >Next</button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialPanel;
