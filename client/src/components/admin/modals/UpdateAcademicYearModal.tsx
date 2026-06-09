import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import type { AcademicYear } from "../../../types/admin/academicYear";

interface UpdateAcademicYearModalProps {
  year: AcademicYear;
  onClose: () => void;
  onUpdated: () => void; // callback to refresh parent data
}

const UpdateAcademicYearModal: React.FC<UpdateAcademicYearModalProps> = ({
  year,
  onClose,
  onUpdated,
}) => {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (year) {
      setForm({
        name: year.name,
        startDate: year.startDate.split("T")[0], // ensure yyyy-MM-dd format
        endDate: year.endDate.split("T")[0],
      });
    }
  }, [year]);

  const handleUpdate = async () => {
    if (!form.name || !form.startDate || !form.endDate)
      return showToast("Fill all fields", "warn");

    setLoading(true);
    try {
      console.log("Updating AcademicYear ID:", year._id, "with form:", form);
      await api.put(`/admin/academic/academic-year/${year._id}`, form);
      showToast("Updated successfully", "success");
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 animate-fadeIn scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Update Academic Year</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Modify the details for this academic year.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all">
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Year Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. 2025-2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
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
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center justify-center min-w-[120px] px-5 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              "Update Year"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAcademicYearModal;
