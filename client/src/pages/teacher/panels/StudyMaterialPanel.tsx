import { useEffect, useRef, useState } from "react";
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
  FiDownloadCloud,
  FiPaperclip
} from "react-icons/fi";
import type { ResultClassAssignment } from "../../../types/teacher/types";
import { useToast } from "../../../context/ToastContext";

const StudyMaterialPanel = () => {
  const { showToast } = useToast();
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<ResultClassAssignment[]>([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchMaterials();
    fetchAssignments();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/teacher/study-material");
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data.data) ? res.data.data : [];
      setMaterials(data);
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

  const classes = Array.from(new Map(assignments.map((a) => [a.classId._id, a.classId])).values());
  const sections = Array.from(new Map(assignments.filter((a) => a.classId._id === selectedClassId).map((a) => [a.sectionId?._id, a.sectionId])).values());
  const subjects = Array.from(new Map(assignments.filter((a) => a.classId._id === selectedClassId && a.sectionId?._id === selectedSectionId).map((a) => [a.subjectId?._id, a.subjectId])).values());

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
      await api.post("/study-material", formData, {
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
      await api.delete(`/study-material/${id}`);
      showToast("Material deleted", "success");
      fetchMaterials();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMaterials = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Neat Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Study Material</h2>
          <p className="text-xs text-slate-500 font-medium">Manage and distribute academic resources</p>
        </div>
        
        <button
          onClick={fetchMaterials}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-200 transition-all"
        >
          <FiDownloadCloud size={14} className={loading ? "animate-spin" : ""} />
          Sync Repository
        </button>
      </div>

      {/* Upload Interface */}
      <div className="card-clean p-6">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <FiPlus className="text-indigo-500" /> Dispatch New Asset
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Class</label>
            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSectionId(""); setSelectedSubjectId(""); }}
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-indigo-500/20 appearance-none cursor-pointer"
              >
                <option value="">Select Class</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Section</label>
            <div className="relative">
              <select
                value={selectedSectionId}
                onChange={(e) => { setSelectedSectionId(e.target.value); setSelectedSubjectId(""); }}
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-indigo-500/20 appearance-none cursor-pointer"
              >
                <option value="">Select Section</option>
                {sections.map((s) => <option key={s?._id} value={s?._id}>{s?.name}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
            <div className="relative">
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-indigo-500/20 appearance-none cursor-pointer"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => <option key={s?._id} value={s?._id}>{s?.name}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Material Title</label>
            <input
              type="text"
              placeholder="e.g. Chapter 1 Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:border-indigo-500/20"
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center gap-4">
           <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="file"
                  ref={fileRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full px-4 py-2 border-2 border-dashed rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${file ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                   <FiPaperclip size={14} />
                   {file ? file.name : "Attach academic payload (PDF, DOCX, ZIP)..."}
                </div>
              </div>
           </div>
           <button
             onClick={handleUpload}
             disabled={isUploading}
             className="bg-indigo-600 text-white px-8 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-30 transition-all flex items-center gap-2 whitespace-nowrap"
           >
             <FiUpload size={14} /> {isUploading ? "Uploading..." : "Commit Dispatch"}
           </button>
        </div>
      </div>

      {/* Professional Ledger */}
      <div className="card-clean overflow-hidden flex flex-col min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inventory Syncing...</p>
          </div>
        )}

        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
            />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {filteredMaterials.length} Items Indexed
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-3">Asset Title</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Subject Feed</th>
                <th className="px-6 py-3">Uplink</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((m) => (
                <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                          <FiFileText size={16} />
                       </div>
                       <p className="font-bold text-slate-700 text-xs">{m.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-widest border border-slate-200">
                      Class {m.classId?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-medium text-slate-500">{m.subjectId?.name || "N/A"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`http://localhost:5000${m.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold text-[10px] uppercase tracking-widest transition-colors"
                    >
                      <FiExternalLink size={12} /> View File
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-all"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMaterials.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FiFolder size={32} className="text-slate-200" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Repository is empty</p>
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

export default StudyMaterialPanel;
