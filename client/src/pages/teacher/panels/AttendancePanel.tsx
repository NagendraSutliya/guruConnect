import { useEffect, useState, useCallback, useMemo } from "react";
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
  FiChevronDown,
  FiUsers,
  FiRefreshCw
} from "react-icons/fi";
import { useTeacher } from "../../../context/TeacherContext";
import type {
  AttendanceStudent,
  AttendanceClassAssignment,
} from "../../../types/teacher/types";

const AttendancePanel = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<AttendanceClassAssignment[]>([]);
  const { 
    selectedClassId, setSelectedClassId, 
    selectedSectionId, setSelectedSectionId,
    attendanceStudents: students, setAttendanceStudents: setStudents,
    resetFilters
  } = useTeacher();
  
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"CHIPS" | "LIST">("CHIPS");

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialAttendance, setInitialAttendance] = useState<Record<string, "pending" | "present" | "absent">>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleReset = () => {
    resetFilters();
    setSearch("");
    setDate(new Date().toISOString().slice(0, 10));
  };

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
    setStudents((prev: AttendanceStudent[]) =>
      prev.map((s: AttendanceStudent) => {
        if (s._id !== id) return s;
        if (s.status === "pending") return { ...s, status: "present" };
        if (s.status === "present") return { ...s, status: "absent" };
        return { ...s, status: "present" };
      })
    );
  }, [setStudents]);

  const markAll = useCallback((status: "present" | "absent") => {
    setStudents((prev: AttendanceStudent[]) => prev.map((s: AttendanceStudent) => ({ ...s, status })));
  }, [setStudents]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClassId, selectedSectionId, date]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="space-y-2">
      
      {/* Sticky Header - Synced with Student Panel */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Attendance Ledger</h1>
          <p className="text-xs text-slate-500 font-medium">Record and commit daily student attendance records.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-rose-300 hover:text-rose-500 transition-all shadow-sm active:scale-95"
          >
            <FiRefreshCw /> Reset Filters
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">View Mode</span>
            {/* Premium Sliding Toggle */}
            <div className="relative bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center w-36 h-9 overflow-hidden shadow-inner">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-md bg-gradient-to-r from-indigo-600 to-indigo-800 ${
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
        </div>
      </div>

      {/* Modern High-Density Filters */}
      <div className="card-clean px-6 py-4 bg-white/50 backdrop-blur-sm border-slate-300 mb-2">

        <div className="flex flex-col md:flex-row gap-8 min-h-[50px] items-center">
          {filterMode === "CHIPS" ? (
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <FiTarget className="text-indigo-600" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Class</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classes.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => { setSelectedClassId(c._id); setSelectedSectionId(""); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedClassId === c._id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >{c.name}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <FiHash className="text-emerald-500" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sections</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedClassId ? sections.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => setSelectedSectionId(s._id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSectionId === s._id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 border-slate-100 text-slate-500'
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
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setDate(newDate);
                    localStorage.setItem("guru_attendance_date", newDate);
                  }}
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
      <div className="card-clean bg-white/70 backdrop-blur-sm border-slate-300 relative">
       <div className="px-4 py-2 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
               <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm items-center gap-3">
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">P: {stats.present}</span>
                     <div className="w-px h-2.5 bg-slate-200" />
                     <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">A: {stats.absent}</span>
                  </div>
                  <button 
                    onClick={saveAttendance}
                    disabled={saving || !hasChanges}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 disabled:opacity-30 transition-all uppercase tracking-widest shadow-md shadow-indigo-100"
                  >
                    <FiSave className={saving ? "animate-spin" : ""} size={12} />
                    {saving ? "SAVING..." : "COMMIT"}
                  </button>
               </div>
               
               <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <div className="flex gap-1.5">
                    <button onClick={() => markAll("present")} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100">All Present</button>
                    <button onClick={() => markAll("absent")} className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 transition-all border border-rose-100">All Absent</button>
                  </div>
                  <div className="relative w-full max-w-[180px]">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    <input 
                      type="text" 
                      placeholder="Search students..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
               </div>
            </div>
        {loadingStudents ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing Registry...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
             <FiUsers size={64} className="text-slate-300 mb-4" />
             <p className="text-sm font-bold text-slate-600">
               {selectedClassId && selectedSectionId 
                ? "No student records found" 
                : "Select a cohort to record attendance"}
             </p>
          </div>
        ) : (
          <>
          <div className="overflow-y-auto h-[calc(100vh-350px)] no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-green-50 shadow-sm">
                <tr className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3 text-center">Current Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center">
                      <p className="text-xs font-bold text-slate-300 italic">No students match your search</p>
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-2">
                      <span className="text-xs font-black text-indigo-600 px-2 py-1 rounded-lg">{s.rollNo}</span>
                    </td>
                    <td className="px-6 py-2">
                      <span className="text-sm font-bold text-slate-800">{s.name}</span>
                    </td>
                    <td className="px-6 py-2 text-center">
                       <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         s.status === 'present' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                         s.status === 'absent' ? 'bg-rose-50 text-rose-500 border border-rose-100' :
                         'bg-slate-100 text-slate-400 border-slate-200'
                       }`}>
                         {s.status === 'pending' ? 'Not Marked' : s.status}
                       </span>
                    </td>
                    <td className="px-6 py-2">
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

        {/* Pagination Controls */}
        {!loadingStudents && filteredStudents.length > 0 && (
          <div className="px-6 py-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 shrink-0">
            <div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Show</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {[5, 10, 15, 20, 50].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                        currentPage === pageNum 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
              Next
              </button>
            </div>
          </div>
        )}
      </>
    )}
      </div>
    </div>
  );
};

export default AttendancePanel;
