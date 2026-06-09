import { useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import type { Assignment } from "../../../types/admin/teacherassignment";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assignments: Assignment[];
  targetClassId: string;
  targetSectionId: string;
}

const CopyTimetableModal = ({ open, onClose, onSuccess, assignments, targetClassId, targetSectionId }: Props) => {
  const { showToast } = useToast();
  const [sourceClassId, setSourceClassId] = useState("");
  const [sourceSectionId, setSourceSectionId] = useState("");
  const [loading, setLoading] = useState(false);

  const classes = useMemo(() => {
    return Array.from(new Map(
      assignments
        .filter(a => a.classId?._id)
        .map((a) => [a.classId!._id, a.classId!])
    ).values());
  }, [assignments]);

  const sections = useMemo(() => {
    const filtered = assignments.filter((a) => a.classId?._id === sourceClassId && a.sectionId?._id);
    return Array.from(new Map(filtered.map((a) => [a.sectionId!._id, a.sectionId!])).values());
  }, [assignments, sourceClassId]);

  if (!open) return null;

  const handleCopy = async () => {
    if (!sourceClassId || !sourceSectionId) return showToast("Select a source class and section", "warn");
    if (sourceClassId === targetClassId && sourceSectionId === targetSectionId) {
      return showToast("Source and target cannot be the same", "warn");
    }

    setLoading(true);
    try {
      await api.post("/admin/routine/copy", {
        fromClassId: sourceClassId,
        fromSectionId: sourceSectionId,
        toClassId: targetClassId,
        toSectionId: targetSectionId,
      });
      showToast("Timetable copied successfully!", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to copy timetable", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-[400px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 animate-fadeIn scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Copy Timetable</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Select a source section to copy its routine.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all">
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Source Grade</label>
              <select
                value={sourceClassId}
                onChange={(e) => {setSourceClassId(e.target.value); setSourceSectionId("");}}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Source Section</label>
              <select
                value={sourceSectionId}
                disabled={!sourceClassId}
                onChange={(e) => setSourceSectionId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">Select Section</option>
                {sections.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            disabled={loading}
            className="flex items-center justify-center min-w-[120px] px-5 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Copying..." : "Copy Timetable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyTimetableModal;
