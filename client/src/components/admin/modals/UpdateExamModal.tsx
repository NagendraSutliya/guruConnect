import type { Exam } from "../../../types/admin/exam";

type Props = {
  editExam: Exam | null;
  setEditExam: (exam: Exam | null) => void;
  updateExam: () => void;
};

const EditExamModal = ({ editExam, setEditExam, updateExam }: Props) => {
  if (!editExam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setEditExam(null)}></div>
      <div className="relative w-full max-w-md max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 animate-fadeIn scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Edit Exam</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Modify the name of this exam.</p>
          </div>
          <button onClick={() => setEditExam(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all">
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Exam Name</label>
              <input
                type="text"
                value={editExam.name}
                onChange={(e) => setEditExam({ ...editExam, name: e.target.value })}
                placeholder="Enter exam name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={() => setEditExam(null)}
            className="px-5 py-2 rounded-lg text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={updateExam}
            className="flex items-center justify-center min-w-[120px] px-5 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Update Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExamModal;
