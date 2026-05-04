import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import RoutineModal from "../../../components/admin/modals/RoutineModal";
import CopyTimetableModal from "../../../components/admin/modals/CopyTimetableModal";
import type { Assignment } from "../../../types/admin/teacherassignment";
import type { Routine } from "../../../types/admin/routine";
import { FiChevronDown, FiCalendar, FiClock, FiTrash2, FiPlus, FiFilter, FiDownload, FiCopy, FiRefreshCcw, FiTrash } from "react-icons/fi";
import html2pdf from "html2pdf.js";
import { generateAutoSchedule } from "../../../utils/autoScheduler";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const defaultTimeSlots = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
];

const getSubjectColor = (subjectName: string) => {
  const colors = [
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', leftBorder: 'border-l-blue-500', badgeBg: 'bg-blue-100' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', leftBorder: 'border-l-emerald-500', badgeBg: 'bg-emerald-100' },
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', leftBorder: 'border-l-purple-500', badgeBg: 'bg-purple-100' },
    { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', leftBorder: 'border-l-amber-500', badgeBg: 'bg-amber-100' },
    { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', leftBorder: 'border-l-rose-500', badgeBg: 'bg-rose-100' },
    { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', leftBorder: 'border-l-indigo-500', badgeBg: 'bg-indigo-100' },
  ];
  const hash = subjectName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const RoutinePanel = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [routine, setRoutine] = useState<Routine[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Routine | null>(null);

  useEffect(() => {
    api
      .get("/admin/teacher-assign")
      .then((res) => setAssignments(res.data.data || []))
      .catch(() => showToast("Failed to load assignments", "error"));
  }, []);

  const refreshRoutine = () => {
    if (!selectedClassId || !selectedSectionId) return;
    api
      .get("/admin/routine", {
        params: { classId: selectedClassId, sectionId: selectedSectionId },
      })
      .then((res) => setRoutine(res.data.data || []))
      .catch(() => showToast("Failed to load routine", "error"));
  };

  useEffect(() => {
    refreshRoutine();
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
    let slots = routine.map((r) => `${r.startTime}-${r.endTime}`);
    if (slots.length === 0) slots = defaultTimeSlots;
    slots = Array.from(new Set(slots));

    const timeRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
    return slots.filter((s) => timeRegex.test(s)).sort((a, b) => {
      const timeA = a.split("-")[0];
      const timeB = b.split("-")[0];
      return timeA.localeCompare(timeB);
    });
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
      refreshRoutine();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to save routine entry", "error");
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

  // --- Advanced Features ---
  const handleAutoSchedule = async () => {
    if (!confirm("This will auto-fill empty slots based on your existing teacher assignments. Proceed?")) return;
    const newSlots = generateAutoSchedule(assignments, routine, days, timeSlots, selectedClassId, selectedSectionId);
    if (!newSlots.length) return showToast("No slots could be automatically assigned. Verify assignments or check for conflicts.", "warn");
    
    try {
      await api.post("/admin/routine", newSlots);
      showToast("Auto-schedule applied successfully!", "success");
      refreshRoutine();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Auto-schedule failed", "error");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear the entire timetable for this section?")) return;
    try {
      await api.delete(`/admin/routine/bulk?classId=${selectedClassId}&sectionId=${selectedSectionId}`);
      setRoutine([]);
      showToast("Timetable cleared", "success");
    } catch {
      showToast("Failed to clear timetable", "error");
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById("timetable-grid");
    if (!element) return;
    
    const opt = {
      margin: 0.5,
      filename: `timetable_${classes.find(c => c._id === selectedClassId)?.name}_${sections.find(s => s._id === selectedSectionId)?.name}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, slot: Routine) => {
    e.dataTransfer.setData("application/json", JSON.stringify(slot));
  };

  const handleDrop = async (e: React.DragEvent, targetDay: string, targetTime: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    
    const sourceSlot: Routine = JSON.parse(data);
    const [tStart, tEnd] = targetTime.split("-");

    // Ignore if dropped in the same slot
    if (sourceSlot.day === targetDay && sourceSlot.startTime === tStart) return;

    const updatedSlot = {
      ...sourceSlot,
      day: targetDay,
      startTime: tStart,
      endTime: tEnd,
    };

    await saveRoutine(updatedSlot);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
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
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCopyModalOpen(true)}
            disabled={!selectedClassId || !selectedSectionId}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-xs disabled:opacity-50"
          >
            <FiCopy /> Copy From...
          </button>
          <button
            onClick={handleExportPDF}
            disabled={!routine.length}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-xs disabled:opacity-50"
          >
            <FiDownload /> Export PDF
          </button>
          <button
            onClick={handleClearAll}
            disabled={!routine.length}
            className="flex items-center gap-1.5 bg-white border border-rose-200 hover:border-rose-300 hover:bg-rose-50 text-rose-600 px-3 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-xs disabled:opacity-50"
          >
            <FiTrash /> Clear All
          </button>
          <button
            onClick={handleAutoSchedule}
            disabled={!selectedClassId || !selectedSectionId || subjects.length === 0}
            className="flex items-center gap-1.5 bg-white border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-xs disabled:opacity-50"
          >
            <FiRefreshCcw /> Auto-Schedule
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
        </div>
      ) : (
        <div id="timetable-grid" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto p-3">
            <table className="w-full border-separate border-spacing-1.5">
              <thead>
                <tr>
                  <th className="w-20 px-1 py-4 text-center">
                    <FiClock className="mx-auto text-slate-400 mb-1" size={16} />
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Time</span>
                  </th>
                  {days.map((d) => (
                    <th key={d} className="min-w-[150px] px-2 py-4 text-center bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{d}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    {/* Time Column */}
                    <td className="px-2 py-4">
                      <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl h-full py-4 px-2">
                        <span className="text-xs font-black text-slate-700">{time.split("-")[0]}</span>
                        <span className="text-[10px] font-bold text-slate-400 my-0.5">to</span>
                        <span className="text-xs font-black text-slate-700">{time.split("-")[1]}</span>
                      </div>
                    </td>

                    {/* Slots */}
                    {days.map((day) => {
                      const slot = getSlot(day, time);
                      const isLunch = time === "12:00-13:00";

                      return (
                        <td
                          key={day}
                          onClick={() => !isLunch && openModal(day, time, slot)}
                          onDragOver={isLunch ? undefined : handleDragOver}
                          onDrop={isLunch ? undefined : (e) => handleDrop(e, day, time)}
                          className={`h-32 align-top ${isLunch ? "bg-slate-50/50" : ""}`}
                        >
                          {isLunch ? (
                            <div className="h-full flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-amber-50/20">
                               <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] rotate-90">Lunch Break</span>
                            </div>
                          ) : slot ? (
                            (() => {
                              const sId = typeof slot.subjectId === 'string' ? slot.subjectId : slot.subjectId?._id;
                              const subjectName = subjectMap[sId]?.subject || (typeof slot.subjectId === 'object' ? (slot.subjectId as any).name : "Unknown");
                              const teacherName = subjectMap[sId]?.teacher || (typeof slot.teacherId === 'object' ? (slot.teacherId as any).name : "Unknown");
                              const color = getSubjectColor(subjectName);

                              return (
                                <div
                                  draggable
                                  onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, slot); }}
                                  className={`group relative h-full flex flex-col justify-between p-3 rounded-2xl border-l-4 border-y border-r transition-all duration-300 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md hover:-translate-y-1 ${color.bg} ${color.border} ${color.leftBorder}`}
                                >
                                  {/* Top Row: Delete & Badge */}
                                  <div className="flex items-start justify-between mb-1">
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${color.badgeBg} ${color.text}`}>
                                      Subject
                                    </span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); deleteSlot(slot); }}
                                      className="text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 bg-white/50 hover:bg-white p-1 rounded-full"
                                    >
                                      <FiTrash2 size={12} />
                                    </button>
                                  </div>

                                  {/* Middle Row: Subject Name */}
                                  <p className={`text-xs font-black leading-tight mb-1 truncate-2-lines ${color.text}`}>
                                    {subjectName}
                                  </p>

                                  {/* Bottom Row: Teacher */}
                                  <div className="flex items-center gap-1.5 mt-auto">
                                    <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[8px] font-black ${color.text} ${color.badgeBg}`}>
                                      {teacherName.charAt(0)}
                                    </div>
                                    <p className={`text-[9px] font-bold truncate ${color.text} opacity-80`}>
                                      {teacherName}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="group h-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500 flex items-center justify-center transition-all">
                                <FiPlus size={16} />
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all">Add Slot</span>
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

      <CopyTimetableModal
        open={copyModalOpen}
        onClose={() => setCopyModalOpen(false)}
        onSuccess={refreshRoutine}
        assignments={assignments}
        targetClassId={selectedClassId}
        targetSectionId={selectedSectionId}
      />
    </div>
  );
};

export default RoutinePanel;
