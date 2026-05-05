import { useEffect, useState, useCallback } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import {  
  FiSearch, 
  FiX, 
  FiCheck, 
  FiSave, 
  FiCalendar,
  FiTarget,
  FiHash,
  FiChevronDown
} from "react-icons/fi";
import type {
  AttendanceStudent,
  AttendanceClassAssignment,
} from "../../../types/teacher/types";

const AttendancePanel = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<AttendanceClassAssignment[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | "">("");
  const [selectedSectionId, setSelectedSectionId] = useState<string | "">("");
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"CHIPS" | "LIST">("CHIPS");

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialAttendance, setInitialAttendance] = useState<Record<string, "pending" | "present" | "absent">>({});

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await api.get("/teacher/attendance/my");
        setAssignments(res.data.data || []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load classes", "error");
      }
    };
    loadAssignments();
  }, []);

  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) {
      setStudents([]);
      return;
    }

    const loadStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await api.get("/teacher/attendance/by-class", {
          params: { classId: selectedClassId, sectionId: selectedSectionId },
        });

        const attendanceRes = await api.get("/teacher/attendance", {
          params: { classId: selectedClassId, sectionId: selectedSectionId, date },
        });

        const attendanceMap: Record<string, "present" | "absent"> = {};
        attendanceRes.data.data.forEach((a: any) => {
          attendanceMap[a.studentId._id] = a.status;
        });

        const list: AttendanceStudent[] = res.data.data.map((s: any) => ({
          _id: s._id,
          name: s.name,
          rollNo: s.rollNo,
          status: attendanceMap[s._id] || "pending",
        }));

        setStudents(list);
        const initialMap: Record<string, "pending" | "present" | "absent"> = {};
        list.forEach((s) => { initialMap[s._id] = s.status; });
        setInitialAttendance(initialMap);
      } catch (err) {
        console.error(err);
        showToast("Failed to load students", "error");
      } finally {
        setLoadingStudents(false);
      }
    };
    loadStudents();
  }, [selectedClassId, selectedSectionId, date]);

  const toggleAttendance = useCallback((id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s._id !== id) return s;
        if (s.status === "pending") return { ...s, status: "present" };
        if (s.status === "present") return { ...s, status: "absent" };
        return { ...s, status: "present" };
      })
    );
  }, []);

  const markAll = useCallback((status: "present" | "absent") => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  }, []);

  const saveAttendance = async () => {
    if (!selectedClassId || !selectedSectionId || students.length === 0) return;
    try {
      setSaving(true);
      await api.post("/teacher/attendance", {
        classId: selectedClassId,
        sectionId: selectedSectionId,
        date,
        records: students.map((s) => ({
          studentId: s._id,
          status: s.status,
        })),
      });
      showToast("Attendance saved successfully", "success");
      const savedMap: Record<string, "pending" | "present" | "absent"> = {};
      students.forEach(s => savedMap[s._id] = s.status);
      setInitialAttendance(savedMap);
    } catch (err) {
      console.error(err);
      showToast("Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  const classes = Array.from(new Map(assignments.filter((a) => a.classId && a.classId._id).map((a) => [a.classId._id, a.classId])).values());
  const sections = Array.from(new Map(assignments.filter((a) => a.classId && a.sectionId && a.classId._id === selectedClassId).map((a) => [a.sectionId._id, a.sectionId])).values());
  const hasChanges = students.some((s) => s.status !== initialAttendance[s._id]);
  const filteredStudents = students.filter((s) => (s.rollNo ?? "").toString().toLowerCase().includes(search.toLowerCase()) || (s.name ?? "").toLowerCase().includes(search.toLowerCase()));

  const stats = {
    present: students.filter(s => s.status === "present").length,
    absent: students.filter(s => s.status === "absent").length,
  };

  return (
    <div className="space-y-0 pb-8 animate-fade-in">
      
      {/* Sticky Header - Synced with Student Panel */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 mb-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Attendance Ledger</h1>
          <p className="text-sm text-slate-500 font-medium">Record and commit daily student attendance records.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/80 px-4 py-2 rounded-xl border border-indigo-100 shadow-sm flex items-center gap-4 text-[10px] font-black">
             <span className="text-emerald-600 uppercase tracking-widest">Present: {stats.present}</span>
             <div className="w-px h-3 bg-indigo-100" />
             <span className="text-rose-500 uppercase tracking-widest">Absent: {stats.absent}</span>
          </div>
          <button 
            onClick={saveAttendance}
            disabled={saving || !hasChanges}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 disabled:opacity-30 transition-all uppercase tracking-widest shadow-lg shadow-slate-200"
          >
            <FiSave className={saving ? "animate-spin" : ""} />
            {saving ? "SAVING..." : "COMMIT CHANGES"}
          </button>
        </div>
      </div>

      {/* Modern High-Density Filters */}
      <div className="card-clean p-6 space-y-2 bg-white/50 backdrop-blur-sm border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-50">
           <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Scope</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Configure attendance registry parameters</p>
           </div>
           
           {/* Premium Sliding Toggle */}
           <div className="relative bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center w-40 h-9 overflow-hidden shadow-inner">
             <div 
               className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-md bg-gradient-to-r from-orange-500 to-rose-500 ${
                 filterMode === 'CHIPS' ? 'left-1' : 'left-[calc(50%+1px)]'
               }`}
             />
             <button 
               onClick={() => setFilterMode("CHIPS")}
               className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'CHIPS' ? 'text-white' : 'text-slate-400'}`}
             >CHIPS</button>
             <button 
               onClick={() => setFilterMode("LIST")}
               className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'LIST' ? 'text-white' : 'text-slate-400'}`}
             >LIST</button>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 min-h-[50px] items-center">
          {filterMode === "CHIPS" ? (
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <FiTarget className="text-slate-400" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Class</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classes.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => { setSelectedClassId(c._id); setSelectedSectionId(""); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedClassId === c._id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >{c.name}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <FiHash className="text-slate-400" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sections</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedClassId ? sections.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => setSelectedSectionId(s._id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSectionId === s._id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500'
                      }`}
                    >{s.name}</button>
                  )) : <p className="text-[10px] font-bold text-slate-300 italic">Select a class first</p>}
                </div>
              </div>

              <div className="space-y-2 flex-1 max-w-xs">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-slate-400" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Date</label>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-fade-in">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSectionId(""); }}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none"
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Section</label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  disabled={!selectedClassId}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none disabled:opacity-50"
                >
                  <option value="">Select Section</option>
                  {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="card-clean bg-white/70 backdrop-blur-sm border-slate-100 relative min-h-[300px]">
        {loadingStudents && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Registry...</p>
          </div>
        )}
        <div className="p-4 border-b border-slate-50 flex items-center justify-between gap-4">
           <div className="relative w-full max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Quick search by name or roll..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-1 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
              />
           </div>
           <div className="flex gap-2">
              <button onClick={() => markAll("present")} className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-200">Mark All Present</button>
              <button onClick={() => markAll("absent")} className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-all border border-rose-200">Mark All Absent</button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Roll No</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Student Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Current Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <p className="text-xs font-bold text-slate-300 italic">No records found for current selection</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-indigo-600 px-2 py-1 rounded-lg">{s.rollNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         s.status === 'present' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                         s.status === 'absent' ? 'bg-rose-50 text-rose-500 border border-rose-100' :
                         'bg-slate-100 text-slate-400 border-slate-200'
                       }`}>
                         {s.status === 'pending' ? 'Not Marked' : s.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex justify-end">
                         <div 
                           onClick={() => toggleAttendance(s._id)}
                           className={`relative w-12 h-6 rounded-full cursor-pointer transition-all p-1 shadow-inner ${
                             s.status === 'present' ? 'bg-emerald-500' :
                             s.status === 'absent' ? 'bg-rose-500' :
                             'bg-slate-200'
                           }`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${
                              s.status === 'present' ? 'translate-x-6' :
                              s.status === 'absent' ? 'translate-x-0' : 'translate-x-3'
                            } flex items-center justify-center`}>
                               {s.status === 'present' && <FiCheck className="text-emerald-600" size={10} />}
                               {s.status === 'absent' && <FiX className="text-rose-500" size={10} />}
                            </div>
                         </div>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
  

export default AttendancePanel;
