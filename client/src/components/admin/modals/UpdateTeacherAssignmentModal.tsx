import { FiX, FiUser, FiBook, FiLayers, FiCheckCircle } from "react-icons/fi";
import { MdClass } from "react-icons/md";
import type {
  Teacher,
  Assignment,
} from "../../../types/admin/teacherassignment";
import type { Class } from "../../../types/admin/class";
import type { Section } from "../../../types/admin/section";
import type { Subject } from "../../../types/admin/subject";

type Props = {
  assignment: Assignment;
  teachers: Teacher[];
  classes: Class[];
  sections: Section[];
  subjects: Subject[];
  loading: boolean;
  onClose: () => void;
  onUpdate: (updated: Assignment) => void;
  updateAssignment: () => void;
};

const UpdateTeacherAssignmentModal = ({
  assignment,
  teachers,
  classes,
  sections,
  subjects,
  loading,
  onClose,
  onUpdate,
  updateAssignment,
}: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 animate-fadeIn scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Edit Assignment
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Modify the faculty assignment details below.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teacher Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                <FiUser size={12} className="text-blue-500" />
                Assign Faculty
              </label>
              <select
                value={assignment.teacherId?._id || ""}
                onChange={(e) =>
                  onUpdate({
                    ...assignment,
                    teacherId:
                      teachers.find((t) => t._id === e.target.value) ||
                      assignment.teacherId,
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                <MdClass size={12} className="text-indigo-500" />
                Select Class
              </label>
              <select
                value={assignment.classId?._id || ""}
                onChange={(e) =>
                  onUpdate({
                    ...assignment,
                    classId:
                      classes.find((c) => c._id === e.target.value) ||
                      assignment.classId,
                    sectionId: null,
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                <FiLayers size={12} className="text-emerald-500" />
                Select Section
              </label>
              <select
                value={assignment.sectionId?._id || ""}
                onChange={(e) =>
                  onUpdate({
                    ...assignment,
                    sectionId:
                      sections.find((s) => s._id === e.target.value) || null,
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">All / No Section</option>
                {sections
                  .filter((s) => s.classId?._id === assignment.classId?._id)
                  .map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2">
                <FiBook size={12} className="text-amber-500" />
                Assigned Subject
              </label>
              <select
                value={assignment.subjectId?._id || ""}
                onChange={(e) =>
                  onUpdate({
                    ...assignment,
                    subjectId:
                      subjects.find((s) => s._id === e.target.value) ||
                      assignment.subjectId,
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
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
            onClick={updateAssignment}
            disabled={loading}
            className="flex items-center justify-center min-w-[160px] px-5 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FiCheckCircle />
                <span>Save Changes</span>
              </div>
            )}
          </button>
        </div>
      </div>
      
     
    </div>
  );
};

export default UpdateTeacherAssignmentModal;
