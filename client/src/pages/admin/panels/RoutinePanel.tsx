import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import RoutineModal from "../../modals/admin/RoutineModal";
import type { Assignment } from "../../../types/admin/teacherassignment";
import type { Routine } from "../../../types/admin/routine";
import { FiChevronDown, FiCalendar, FiClock, FiTrash2, FiPlus, FiFilter } from "react-icons/fi";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const defaultTimeSlots = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "Lunch",
  "01:00-02:00",
  "02:00-03:00",
  "03:00-04:00",
];

const RoutinePanel = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [routine, setRoutine] = useState<Routine[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Routine | null>(null);

  useEffect(() => {
    api
      .get("/admin/teacher-assign")
      .then((res) => setAssignments(res.data.data || []))
      .catch(() => showToast("Failed to load assignments", "error"));
  }, []);

  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) return;
    api
      .get("/admin/routine", {
        params: { classId: selectedClassId, sectionId: selectedSectionId },
      })
      .then((res) => setRoutine(res.data.data || []))
      .catch(() => showToast("Failed to load routine", "error"));
  }, [selectedClassId, selectedSectionId]);

  const classes = useMemo(() => {
    return Array.from(new Map(assignments.map((a) => [a.classId._id, a.classId])).values());
  }, [assignments]);

  const sections = useMemo(() => {
    const filtered = assignments.filter((a) => a.classId._id === selectedClassId && a.sectionId);
    return Array.from(new Map(filtered.map((a) => [a.sectionId!._id, a.sectionId!])).values());
  }, [assignments, selectedClassId]);

  const subjects = useMemo(() => {
    return assignments.filter(
      (a) => a.classId._id === selectedClassId && a.sectionId?._id === selectedSectionId && a.subjectId && a.teacherId
    );
  }, [assignments, selectedClassId, selectedSectionId]);

  const timeSlots = useMemo(() => {
    return routine.length
      ? Array.from(new Set(routine.map((r) => `${r.startTime}-${r.endTime}`)))
      : defaultTimeSlots;
  }, [routine]);

  const getSlot = (day: string, time: string) => {
    const [start, end] = time.split("-");
    return routine.find((r) => r.day === day && r.startTime === start && r.endTime === end);
  };

  const openModal = (day: string, time?: string, slot?: Routine) => {
    if (slot) {
      setEditingSlot(slot);
    } else {
      const [start, end] = time?.split("-") || ["", ""];
      setEditingSlot({
        classId: selectedClassId,
        sectionId: selectedSectionId,
        subjectId: "",
        teacherId: "",
        day,
        startTime: start,
        endTime: end,
      });
    }
    setModalOpen(true);
  };

  const saveRoutine = async (form: Routine) => {
    try {
      if (form._id) {
        await api.put(`/admin/routine/${form._id}`, form);
        showToast("Routine updated successfully", "success");
      } else {
        await api.post("/admin/routine", [form]);
        showToast("Session added to routine", "success");
      }
      setModalOpen(false);
      const res = await api.get("/admin/routine", {
        params: { classId: selectedClassId, sectionId: selectedSectionId },
      });
      setRoutine(res.data.data || []);
    } catch {
      showToast("Failed to save routine entry", "error");
    }
  };

  const deleteSlot = async (slot: Routine) => {
    if (!confirm("Remove this entry from the timetable?")) return;
    try {
      await api.delete(`/admin/routine/${slot._id}`);
      setRoutine((prev) => prev.filter((r) => r._id !== slot._id));
      showToast("Entry removed", "success");
    } catch {
      showToast("Operation failed", "error");
    }
  };

  const subjectMap = useMemo(() => {
    const map: Record<string, { subject: string; teacher: string }> = {};
    subjects.forEach((s) => {
      map[s.subjectId._id] = { subject: s.subjectId.name, teacher: s.teacherId.name };
    });
    return map;
  }, [subjects]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Academic Timetable</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Configure weekly routines and class schedules for students.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!selectedClassId || !selectedSectionId) return;
              api.get("/admin/routine", { params: { classId: selectedClassId, sectionId: selectedSectionId } }).then(res => setRoutine(res.data.data || []));
            }}
            disabled={!selectedClassId || !selectedSectionId}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm disabled:opacity-50"
          >
            <FiClock />
            <span>Sync Routine</span>
          </button>
        </div>
      </div>

      {/* Selection Bar */}
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm flex flex-col md:flex-row items-center gap-6">
         <div className="flex flex-col gap-1.5 w-full md:w-64">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1">Academic Grade</label>
           <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => {setSelectedClassId(e.target.value); setSelectedSectionId("");}}
                className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Class</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>
        </div>

         <div className="flex flex-col gap-1.5 w-full md:w-64">
            <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1">Class Section</label>
           <div className="relative">
              <select
                value={selectedSectionId}
                disabled={!selectedClassId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">Select Section</option>
                {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>
        </div>

        {selectedClassId && selectedSectionId && (
          <div className="hidden lg:flex items-center gap-3 px-6 py-4 bg-indigo-50 rounded-3xl border border-indigo-100 ml-auto">
             <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <FiCalendar />
             </div>
             <div>
                <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Active Schedule</p>
                <p className="text-sm font-black text-indigo-600">Class {classes.find(c => c._id === selectedClassId)?.name} - {sections.find(s => s._id === selectedSectionId)?.name}</p>
             </div>
          </div>
        )}
      </div>

      {/* Grid Content */}
      {!selectedClassId || !selectedSectionId ? (
        <div className="bg-white/70 backdrop-blur-md rounded-[3rem] border border-white/20 py-32 text-center shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-slate-300">
             <FiCalendar size={32} />
           </div>
           <h3 className="text-lg font-black text-slate-800">No Timetable Selected</h3>
           <p className="text-slate-500 font-medium mt-2">Select a class and section above to manage their weekly schedule.</p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-md rounded-[3rem] border border-white/20 py-32 text-center shadow-sm">
           <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-amber-300">
             <FiFilter size={32} />
           </div>
           <h3 className="text-lg font-black text-slate-800">Prerequisites Missing</h3>
           <p className="text-slate-500 font-medium mt-2">No subjects or teachers have been assigned to this section yet.</p>
           <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all">Go to Assignments</button>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-8 py-6 text-left border-r border-slate-800">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-indigo-400" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Time Slot</span>
                    </div>
                  </th>
                  {days.map((d) => (
                    <th key={d} className="px-8 py-6 text-center min-w-[200px]">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">{d}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeSlots.map((time, idx) => (
                  <tr key={time} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 bg-slate-50/50 border-r border-slate-100 font-black text-slate-400 text-xs text-center">
                      {time}
                    </td>
                    {days.map((day) => {
                      const slot = getSlot(day, time);
                      const isLunch = time === "Lunch";

                      return (
                        <td
                          key={day}
                          onClick={() => !isLunch && openModal(day, time, slot)}
                          className={`p-3 h-32 align-top transition-all duration-300 ${isLunch ? "bg-amber-50/30" : "cursor-pointer group relative hover:bg-indigo-50/30"}`}
                        >
                          {isLunch ? (
                             <div className="h-full flex items-center justify-center">
                                <span className="text-[10px] font-black text-amber-300 uppercase tracking-[0.4em] rotate-90">Lunch</span>
                             </div>
                          ) : slot ? (
                            <div className="h-full flex flex-col justify-between rounded-3xl bg-white border border-slate-100 p-4 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-indigo-200 transition-all duration-500">
                               <div>
                                  <div className="flex items-center justify-between mb-2">
                                     <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase tracking-wider border border-indigo-100">Core</span>
                                     <button
                                        onClick={(e) => { e.stopPropagation(); deleteSlot(slot); }}
                                        className="text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                                      >
                                        <FiTrash2 size={14} />
                                      </button>
                                  </div>
                                  <p className="text-xs font-black text-slate-800 leading-tight">
                                    {subjectMap[slot.subjectId]?.subject || "N/A"}
                                  </p>
                               </div>
                               <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                                  <div className="w-5 h-5 rounded-lg bg-indigo-500 flex items-center justify-center text-[8px] font-black text-white">
                                    {subjectMap[slot.subjectId]?.teacher?.charAt(0)}
                                  </div>
                                  <p className="text-[10px] font-bold text-slate-400 truncate">
                                    {subjectMap[slot.subjectId]?.teacher || ""}
                                  </p>
                               </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-100 group-hover:border-indigo-300 group-hover:bg-white group-hover:shadow-inner transition-all duration-500 text-slate-200 group-hover:text-indigo-400">
                               <FiPlus className="group-hover:scale-110 transition-transform" />
                               <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100">Assign Slot</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RoutineModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveRoutine}
        subjects={subjects}
        initialData={editingSlot}
      />

    </div>
  );
};

export default RoutinePanel;
