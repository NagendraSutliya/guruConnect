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
    return Array.from(new Map(
      assignments
        .filter(a => a.classId?._id)
        .map((a) => [a.classId!._id, a.classId!])
    ).values());
  }, [assignments]);

  const sections = useMemo(() => {
    const filtered = assignments.filter((a) => a.classId?._id === selectedClassId && a.sectionId?._id);
    return Array.from(new Map(filtered.map((a) => [a.sectionId!._id, a.sectionId!])).values());
  }, [assignments, selectedClassId]);

  const subjects = useMemo(() => {
    return assignments.filter(
      (a) => a.classId?._id === selectedClassId && a.sectionId?._id === selectedSectionId && a.subjectId?._id && a.teacherId?._id
    );
  }, [assignments, selectedClassId, selectedSectionId]);

  const timeSlots = useMemo(() => {
    // Baseline slots that should always be present
    const baseSlots = [...defaultTimeSlots];
    
    // Add any custom slots from existing routine
    const customSlots = routine.map((r) => `${r.startTime}-${r.endTime}`);
    
    // Merge and deduplicate
    let allSlots = Array.from(new Set([...baseSlots, ...customSlots]));

    const timeRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
    return allSlots.filter((s) => timeRegex.test(s)).sort((a, b) => {
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


  return (
    <div className="space-y-2">
      
      {/* Sticky Header - Aura Style */}
      <div className="bg-gradient-to-r from-slate-50/90 via-white/80 to-slate-100/90 backdrop-blur-xl -mx-6 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 mb-2 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Academic Timetable</h1>
          <p className="text-xs text-slate-500 font-medium">Synchronize weekly lectures and classroom distributions.</p>
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

      <div className="space-y-6 pt-2">
        {/* Selection Bar */}
        <div className="card-clean px-4 py-2 flex flex-col md:flex-row items-end gap-6 bg-white/40 backdrop-blur-sm border-slate-200 shadow-sm">
           <div className="flex flex-col gap-2 w-full md:w-64">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Class</label>
              <div className="relative group">
                <select
                  value={selectedClassId}
                  onChange={(e) => {setSelectedClassId(e.target.value); setSelectedSectionId("");}}
                  className="w-full pl-5 pr-10 py-2 bg-white group-hover:bg-white border-2 border-slate-200 group-hover:border-blue-400 rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-1 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
              </div>
           </div>

           <div className="flex flex-col gap-2 w-full md:w-64">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Section</label>
              <div className="relative group">
                <select
                  value={selectedSectionId}
                  disabled={!selectedClassId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="w-full pl-5 pr-10 py-2 bg-white group-hover:bg-white border-2 border-slate-200 group-hover:border-blue-400 rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-1 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select Section</option>
                  {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
              </div>
           </div>

           {selectedClassId && selectedSectionId && (
             <div className="hidden lg:flex items-center gap-4 px-6 py-2 bg-indigo-50 rounded-2xl border border-indigo-100 ml-auto animate-fadeIn">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                   <FiCalendar size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Focus</p>
                   <p className="text-sm font-black text-slate-800">Grade {classes.find(c => c._id === selectedClassId)?.name} — {sections.find(s => s._id === selectedSectionId)?.name}</p>
                </div>
             </div>
           )}
        </div>

        {/* Grid Content */}
        {!selectedClassId || !selectedSectionId ? (
          <div className="card-clean py-32 text-center bg-white/40 border-slate-200 shadow-sm">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <FiCalendar size={32} />
             </div>
             <h3 className="text-lg font-black text-slate-800">No Timetable Selected</h3>
             <p className="text-xs text-slate-500 font-medium mt-1">Select a grade and section above to initialize management.</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="card-clean py-32 text-center bg-white/40 border-slate-200 shadow-sm">
             <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-400">
               <FiFilter size={32} />
             </div>
             <h3 className="text-lg font-black text-slate-800">Unassigned Assets</h3>
             <p className="text-xs text-slate-500 font-medium mt-1">No faculty-subject linkages detected for this section.</p>
          </div>
        ) : (
          <div id="timetable-grid" className="card-clean border-slate-200 shadow-sm overflow-hidden bg-white/60 p-1">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="w-20 px-1 py-2 text-center">
                      <FiClock className="mx-auto text-slate-400 mb-0.5" size={14} />
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Timeline</span>
                    </th>
                    {days.map((d) => (
                      <th key={d} className="min-w-[140px] px-2 py-2 text-center bg-slate-50/50 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{d}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => (
                    <tr key={time}>
                      {/* Time Column */}
                      <td className="px-1 py-1">
                        <div className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-xl h-full py-3 px-1 shadow-sm">
                          <span className="text-[10px] font-black text-slate-800">{time.split("-")[0]}</span>
                          <div className="w-3 h-[1px] bg-slate-200 my-0.5" />
                          <span className="text-[10px] font-black text-slate-800">{time.split("-")[1]}</span>
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
                            className={`h-24 align-top transition-all duration-300 ${isLunch ? "opacity-40" : ""}`}
                          >
                            {isLunch ? (
                              <div className="h-full flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/30">
                                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.6em] rotate-90">Lunch</span>
                              </div>
                            ) : slot ? (
                              (() => {
                                const subjectName = typeof slot.subjectId === 'object' ? (slot.subjectId as any).name : "Unknown";
                                const teacherName = typeof slot.teacherId === 'object' ? (slot.teacherId as any).name : "Unknown";
                                const color = getSubjectColor(subjectName);

                                return (
                                  <div
                                    draggable
                                    onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, slot); }}
                                    className={`group relative h-full flex flex-col justify-between p-2.5 rounded-xl border-l-[4px] border border-slate-200 transition-all duration-300 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-lg hover:-translate-y-0.5 bg-white hover:bg-slate-50 ${color.leftBorder}`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${color.badgeBg} ${color.text}`}>
                                        Subject
                                      </div>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); deleteSlot(slot); }}
                                        className="text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 rounded-lg"
                                      >
                                        <FiTrash2 size={12} />
                                      </button>
                                    </div>

                                    <h4 className="text-[11px] font-black text-slate-800 leading-tight mt-1 line-clamp-2">
                                      {subjectName}
                                    </h4>

                                    <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-slate-100">
                                      <div className={`w-4 h-4 rounded-md flex items-center justify-center font-black text-[8px] ${color.badgeBg} ${color.text}`}>
                                        {teacherName.charAt(0)}
                                      </div>
                                      <p className="text-[8px] font-black text-slate-400 truncate uppercase tracking-widest">
                                        {teacherName}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="group h-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white/30 hover:bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300 cursor-pointer">
                                <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-indigo-100">
                                  <FiPlus size={14} />
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-all">Add</span>
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
      </div>

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
