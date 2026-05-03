import { useEffect, useState, useCallback } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import { 
  FiChevronDown, 
  FiSearch, 
  FiX, 
  FiCheck, 
  FiSave, 
  FiFilter, 
  FiActivity,
  FiCalendar
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialAttendance, setInitialAttendance] = useState<Record<string, "pending" | "present" | "absent">>({});

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setLoadingAssignments(true);
        const res = await api.get("/teacher/attendance/my");
        setAssignments(res.data.data || []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load classes", "error");
      } finally {
        setLoadingAssignments(false);
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
      await api.post("/attendance", {
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
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = {
    present: students.filter(s => s.status === "present").length,
    absent: students.filter(s => s.status === "absent").length,
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Attendance Ledger</h1>
          <p className="text-sm text-slate-500 font-medium">Record and update daily student attendance records.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-4 text-xs font-bold">
             <span className="text-emerald-600 uppercase tracking-tighter">Present: {stats.present}</span>
             <div className="w-px h-3 bg-slate-200" />
             <span className="text-rose-500 uppercase tracking-tighter">Absent: {stats.absent}</span>
          </div>
          <button 
            onClick={saveAttendance}
            disabled={saving || !hasChanges}
            className="btn-primary flex items-center gap-2"
          >
            <FiSave className={saving ? "animate-spin" : ""} />
            {saving ? "SAVING..." : "COMMIT CHANGES"}
          </button>
        </div>
      </div>

      {/* Professional Filters */}
      <div className="card-clean p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Target Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSectionId(""); }}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Class</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 bottom-2.5 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Target Section</label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            disabled={!selectedClassId}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="">Select Section</option>
            {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 bottom-2.5 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Operational Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all"
          />
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="card-clean min-h-[400px] relative">
        {loadingStudents && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accessing Registry...</p>
          </div>
        )}

        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Filter by name or roll..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:bg-white focus:border-[var(--primary)] transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => markAll("present")} className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100">All Present</button>
            <button onClick={() => markAll("absent")} className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100">All Absent</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 py-4 w-24">Roll No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4 text-center">Current Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <p className="text-xs font-bold text-slate-400">Select filters to load student list</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-400 tracking-tight">#{s.rollNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold border border-slate-200">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-slate-700">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
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
                           className={`relative w-12 h-6 rounded-full cursor-pointer transition-all p-1 ${
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

        {/* Professional Pagination */}
        {filteredStudents.length > 0 && (
          <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Page <span className="text-slate-800">{currentPage}</span> of {totalPages || 1}
             </p>
             <div className="flex gap-2">
               <button 
                 onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                 disabled={currentPage === 1}
                 className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
               >
                 <FiChevronDown className="rotate-90" size={14} />
               </button>
               <button 
                 onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                 disabled={currentPage === totalPages || totalPages === 0}
                 className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all"
               >
                 <FiChevronDown className="-rotate-90" size={14} />
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePanel;
