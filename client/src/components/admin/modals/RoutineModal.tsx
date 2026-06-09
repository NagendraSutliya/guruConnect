import { useEffect, useState } from "react";
import type { Assignment } from "../../../types/admin/teacherassignment";
import type { Routine } from "../../../types/admin/routine";
import { FiChevronDown } from "react-icons/fi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (form: Routine) => void;
  subjects: Assignment[];
  initialData: Routine | null;
}

const RoutineModal = ({
  open,
  onClose,
  onSave,
  subjects,
  initialData,
}: Props) => {
  const [form, setForm] = useState<Routine>({
    classId: "",
    sectionId: "",
    subjectId: "",
    teacherId: "",
    day: "Monday",
    startTime: "",
    endTime: "",
  });

  const [selectedTeacherName, setSelectedTeacherName] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      const sId = typeof initialData.subjectId === 'string' ? initialData.subjectId : initialData.subjectId?._id;
      const tId = typeof initialData.teacherId === 'string' ? initialData.teacherId : initialData.teacherId?._id;
      
      if (sId && tId) {
        const assign = subjects.find(s => s.subjectId._id === sId && s.teacherId._id === tId);
        setSelectedTeacherName(assign?.teacherId.name || "Unassigned");
      } else {
        setSelectedTeacherName("");
      }
    }
  }, [initialData, subjects]);

  const handleAssignmentChange = (assignmentId: string) => {
    const assign = subjects.find((s) => s._id === assignmentId);
    if (!assign) {
      setForm(prev => ({ ...prev, subjectId: "", teacherId: "" }));
      setSelectedTeacherName("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      subjectId: assign.subjectId._id,
      teacherId: assign.teacherId._id,
    }));
    setSelectedTeacherName(assign.teacherId.name);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 animate-fadeIn scale-100 flex flex-col overflow-hidden">
        
        {/* Header - Professional Administrative Style */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-lg font-bold text-slate-800 tracking-tight">
               {form._id ? "Edit Routine Entry" : "Add Routine Entry"}
             </h3>
             <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
               <span className="text-xl leading-none">&times;</span>
             </button>
          </div>
          <div className="flex items-center gap-2">
             <span className="px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[9px] font-bold text-indigo-600 uppercase tracking-wider">
                {form.day}
             </span>
             <span className="text-[10px] font-semibold text-slate-400">
                {form.startTime || "00:00"} — {form.endTime || "00:00"}
             </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          <div className="space-y-4">
            {/* Subject Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
              <div className="relative group">
                <select
                  value={subjects.find(s => s.subjectId._id === form.subjectId && s.teacherId._id === form.teacherId)?._id || ""}
                  onChange={(e) => handleAssignmentChange(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-400 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.subjectId.name} ({s.teacherId.name})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <FiChevronDown size={14} />
                </div>
              </div>
            </div>

            {form.subjectId && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 animate-slideUp">
                 <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-100">
                    {selectedTeacherName.charAt(0)}
                 </div>
                 <div>
                    <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-wider">Scheduled Assignment</p>
                    <p className="text-[11px] font-bold text-slate-700">
                       {subjects.find(s => s.subjectId._id === form.subjectId)?.subjectId.name} 
                       <span className="mx-2 text-slate-300">|</span> 
                       {selectedTeacherName}
                    </p>
                 </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Start Time</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">End Time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-black transition-all shadow-md active:scale-95"
          >
            {form._id ? "Update Entry" : "Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default RoutineModal;
