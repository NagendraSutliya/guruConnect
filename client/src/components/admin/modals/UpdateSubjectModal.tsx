import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import type { Subject } from "../../../types/admin/subject";
import type { Class } from "../../../types/admin/class";
import type { Section } from "../../../types/admin/section";

type Props = {
  subject: Subject;
  classes: Class[];
  sections: Section[];
  onClose: () => void;
  onUpdated?: () => void;
};

const UpdateSubjectModal = ({
  subject,
  classes,
  sections,
  onClose,
  onUpdated,
}: Props) => {
  const { showToast } = useToast();
  const [name, setName] = useState(subject.name);
  const [selectedClass, setSelectedClass] = useState(subject.classId._id);
  const [selectedSection, setSelectedSection] = useState(
    subject.sectionId?._id || ""
  );
  const [loading, setLoading] = useState(false);

  // Load sections for selected class
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  useEffect(() => {
    const filteredSections = sections.filter(
      (s) => s.classId?._id === selectedClass
    );
    setAvailableSections(filteredSections);
    if (!filteredSections.find((s) => s._id === selectedSection))
      setSelectedSection("");
  }, [selectedClass, sections]);

  const handleSave = async () => {
    if (!name.trim() || !selectedClass) {
      showToast("Subject name and class are required", "warn");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/admin/subjects/${subject._id}`, {
        name,
        classId: selectedClass,
        sectionId: selectedSection || undefined,
        code: subject.code, // keep existing code
      });

      showToast("Subject updated successfully", "success");
      onUpdated?.();
      onClose();
    } catch (err: any) {
      console.log(err);
      showToast("Failed to update subject", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-[500px] max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 animate-fadeIn scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Edit Subject</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Modify the details for this subject.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all">
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Section (Optional)</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">All Sections</option>
                {availableSections.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Subject Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter subject name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center justify-center min-w-[120px] px-5 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              "Update Subject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSubjectModal;
