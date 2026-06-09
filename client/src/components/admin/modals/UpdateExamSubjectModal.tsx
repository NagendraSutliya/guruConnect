import { useState } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";

type Props = {
  editData: any;
  setEditData: (data: any) => void;
  refreshList: () => void; // refresh parent table
};

const UpdateExamSubjectModal = ({
  editData,
  setEditData,
  refreshList,
}: Props) => {
  const { showToast } = useToast();
  const [localData, setLocalData] = useState(editData);
  const [loading, setLoading] = useState(false);

  if (!editData) return null;

  // --- Update function ---
  const handleUpdate = async () => {
    if (!localData.startTime || !localData.endTime || !localData.date) {
      return showToast("Date, start and end time are required", "warn");
    }

    try {
      setLoading(true);
      const payload = {
        date: localData.date,
        startTime: localData.startTime,
        endTime: localData.endTime,
        maxMarks: localData.maxMarks,
      };

      await api.put(`/admin/exam-subjects/${localData._id}`, payload);
      showToast("Exam subject updated successfully", "success");
      setEditData(null);
      refreshList();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setEditData(null)}></div>
      <div className="relative w-full max-w-md max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 animate-fadeIn scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Edit Exam Subject</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Modify the details for this exam subject.</p>
          </div>
          <button onClick={() => setEditData(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all">
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Subject</label>
              <input
                type="text"
                value={localData.subjectId?.name || ""}
                readOnly
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Date</label>
                <input
                  type="date"
                  value={localData.date.split("T")[0]}
                  onChange={(e) => setLocalData({ ...localData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Max Marks</label>
                <input
                  type="number"
                  value={localData.maxMarks}
                  onChange={(e) => setLocalData({ ...localData, maxMarks: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Start Time</label>
                <input
                  type="time"
                  value={localData.startTime}
                  onChange={(e) => setLocalData({ ...localData, startTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">End Time</label>
                <input
                  type="time"
                  value={localData.endTime}
                  onChange={(e) => setLocalData({ ...localData, endTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={() => setEditData(null)}
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
              "Update Exam Subject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateExamSubjectModal;
