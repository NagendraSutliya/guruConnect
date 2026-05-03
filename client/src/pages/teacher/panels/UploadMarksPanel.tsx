import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import Papa from "papaparse";
import { 
  FiChevronDown, 
  FiEdit, 
  FiSearch, 
  FiTrash2, 
  FiArrowLeft, 
  FiUpload, 
  FiDownload, 
  FiSave, 
  FiFilter, 
  FiActivity,
  FiBookOpen,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import type {
  UploadMarksStudent,
  UploadMarksClassAssignment,
} from "../../../types/teacher/types";

const UploadMarksPage = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<UploadMarksClassAssignment[]>([]);
  const [students, setStudents] = useState<UploadMarksStudent[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const navigate = useNavigate();
  const [maxMarks, setMaxMarks] = useState(100);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleBack = () => navigate("/teacher/results");

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await api.get("/teacher-assign/my");
        const clean = (res.data.data || []).filter(
          (a: UploadMarksClassAssignment) => a.classId?._id && a.sectionId?._id && a.subjectId?._id
        );
        setAssignments(clean);
      } catch {
        showToast("Failed to load assignments", "error");
      }
    };
    loadAssignments();
  }, []);

  const classes = Array.from(new Map(assignments.map((a) => [a.classId!._id, a.classId])).values());
  const sections = Array.from(new Map(assignments.filter((a) => a.classId?._id === selectedClassId).map((a) => [a.sectionId!._id, a.sectionId])).values());
  const subjects = Array.from(new Map(assignments.filter((a) => a.classId?._id === selectedClassId && a.sectionId?._id === selectedSectionId).map((a) => [a.subjectId!._id, a.subjectId])).values());

  useEffect(() => {
    setStudents([]);
    setSelectedSectionId("");
    setSelectedSubjectId("");
    setSelectedExamId("");
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedClassId) return;
    const loadExams = async () => {
      try {
        const res = await api.get("/exams", { params: { classId: selectedClassId } });
        setExams(res.data.data || []);
      } catch {
        showToast("Failed to load exams", "error");
      }
    };
    loadExams();
  }, [selectedClassId]);

  const loadStudents = async () => {
    if (!selectedClassId || !selectedSectionId) return showToast("Select class & section", "error");
    try {
      setLoadingStudents(true);
      const studentRes = await api.get("/student/by-class", {
        params: { classId: selectedClassId, sectionId: selectedSectionId },
      });

      let studentList: UploadMarksStudent[] = studentRes.data.data.map((s: any) => ({
        _id: s._id,
        name: s.name,
        rollNo: s.rollNo,
        marks: undefined,
        isEditing: false,
      }));

      if (selectedExamId && selectedSubjectId) {
        const marksRes = await api.get("/results", {
          params: { examId: selectedExamId, examSubjectId: selectedSubjectId },
        });
        const marksList: any[] = marksRes.data.data || [];
        studentList = studentList.map((s) => {
          const existing = marksList.find((m) => m.studentId?._id === s._id);
          return { ...s, marks: existing?.marks ?? undefined };
        });
      }
      setStudents(studentList);
    } catch (err) {
      console.error(err);
      showToast("Failed to load students or marks", "error");
    } finally {
      setLoadingStudents(false);
    }
  };

  const updateMark = (id: string, value: number | undefined) => {
    if (value !== undefined && (value < 0 || value > maxMarks)) return;
    setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, marks: value } : s)));
  };

  const handleCSVUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (res: any) => {
        const updated = students.map((s) => ({ ...s }));
        res.data.forEach((row: any) => {
          const student = updated.find((s) => String(s.rollNo) === String(row.rollNo));
          if (student) {
            const marks = Number(row.marks);
            if (!isNaN(marks) && marks <= maxMarks) student.marks = marks;
          }
        });
        setStudents(updated);
        e.target.value = "";
      },
    });
  };

  const downloadTemplate = () => {
    if (!students || students.length === 0) return showToast("No student data available", "error");
    const examName = exams.find((e) => e._id === selectedExamId)?.name || "";
    const subjectName = subjects.find((sub) => sub?._id === selectedSubjectId)?.name || "";
    const headers = ["Roll No", "Name", "Exam", "Subject", "Marks", "Result"];
    const rows = students.map((s) => [s.rollNo, s.name, examName, subjectName, s.marks !== undefined ? s.marks : "", s.marks !== undefined ? (s.marks >= maxMarks / 2 ? "Pass" : "Fail") : ""]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_marks.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveMarks = async () => {
    try {
      if (!selectedClassId || !selectedSectionId || !selectedExamId || !selectedSubjectId) {
        return showToast("Please select all filters before saving.", "error");
      }
      const payload = students
        .filter((s) => s.marks !== undefined && s.marks !== null)
        .map((s) => ({
          studentId: s._id,
          marks: s.marks,
          examId: selectedExamId,
          examSubjectId: selectedSubjectId,
          classId: selectedClassId,
          sectionId: selectedSectionId,
        }));
      if (!payload.length) return showToast("No marks to save.", "error");
      setSaving(true);
      const res = await api.post("/results", {
        examId: selectedExamId,
        examSubjectId: selectedSubjectId,
        records: payload,
      });
      if (res.data.success) showToast("Marks saved successfully!", "success");
      else showToast("Failed to save marks", "error");
    } catch (err) {
      console.error(err);
      showToast("An error occurred while saving marks.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteMark = async (studentId: string) => {
    try {
      if (!selectedExamId || !selectedSubjectId) return showToast("Select exam and subject first", "error");
      await api.delete("/results", {
        data: { studentId, examId: selectedExamId, examSubjectId: selectedSubjectId },
      });
      setStudents((prev) => prev.map((s) => (s._id === studentId ? { ...s, marks: undefined } : s)));
      showToast("Mark deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete mark", "error");
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => `${s.name} ${s.rollNo}`.toLowerCase().includes(search.toLowerCase()));
  }, [students, search]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4 pb-8 animate-fade-in">

      {/* Neat Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-all">
             <FiArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Upload Marks</h2>
            <p className="text-xs text-slate-500 font-medium">Manage examination performance records</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {students.length > 0 && (
            <button 
              onClick={saveMarks}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <FiSave className={saving ? "animate-spin" : ""} />
              <span>{saving ? "Saving..." : "Publish Marks"}</span>
            </button>
          )}
        </div>
      </div>

      {/* High-Density Filters */}
      <div className="card-clean p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Class</label>
            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 appearance-none cursor-pointer"
              >
                <option value="">Select Class</option>
                {classes.map((c) => <option key={c?._id} value={c?._id}>{c?.name}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Section</label>
            <div className="relative">
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 appearance-none cursor-pointer"
              >
                <option value="">Section</option>
                {sections.map((s) => <option key={s?._id} value={s?._id}>{s?.name}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Exam</label>
            <div className="relative">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 appearance-none cursor-pointer"
              >
                <option value="">Exam</option>
                {exams.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
            <div className="relative">
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 appearance-none cursor-pointer"
              >
                <option value="">Subject</option>
                {subjects.map((s) => <option key={s?._id} value={s?._id}>{s?.name}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Marks</span>
                <input
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  className="w-16 bg-slate-50 border border-slate-200 rounded-lg py-1 text-center text-xs font-bold text-slate-700 outline-none focus:border-indigo-500/30"
                />
              </div>
              <button
                onClick={loadStudents}
                disabled={!selectedClassId || !selectedSectionId || !selectedExamId || !selectedSubjectId}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-30 transition-all"
              >
                {loadingStudents ? "Syncing..." : "Load Students"}
              </button>
           </div>

           {students.length > 0 && (
            <div className="flex items-center gap-2">
               <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <button className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-colors">
                    <FiUpload /> Bulk Upload
                  </button>
               </div>
               <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-amber-100 hover:bg-amber-100 transition-colors"
                >
                  <FiDownload /> Template
                </button>
            </div>
          )}
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="card-clean overflow-hidden flex flex-col min-h-[400px] relative">
        {loadingStudents && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Compiling Roster...</p>
          </div>
        )}

        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Filter by name or roll..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none"
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {filteredStudents.length} Records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-3">Roll No</th>
                <th className="px-6 py-3">Student Identity</th>
                <th className="px-6 py-3">Subject Feed</th>
                <th className="px-6 py-3 text-center">Score / {maxMarks}</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FiBookOpen size={32} className="text-slate-200" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No student data loaded</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <span className="text-xs font-bold text-slate-500">#{s.rollNo}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-xs font-bold text-slate-700">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest truncate max-w-[120px]">
                            {exams.find(e => e._id === selectedExamId)?.name || "Pending"}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400">
                            {subjects.find(sub => sub?._id === selectedSubjectId)?.name || "General"}
                          </p>
                       </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center">
                        {s.isEditing ? (
                          <input
                            type="number"
                            min={0}
                            max={maxMarks}
                            value={s.marks ?? ""}
                            autoFocus
                            onChange={(e) => updateMark(s._id, e.target.value === "" ? undefined : Number(e.target.value))}
                            className="w-16 bg-white border border-indigo-500 rounded px-2 py-0.5 text-center text-xs font-bold text-slate-800 outline-none"
                          />
                        ) : (
                          <div className={`px-3 py-0.5 rounded text-xs font-bold min-w-[3rem] text-center ${s.marks !== undefined ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>
                            {s.marks !== undefined ? s.marks : "—"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setStudents(prev => prev.map(stu => stu._id === s._id ? { ...stu, isEditing: !stu.isEditing } : stu))}
                          className={`p-1.5 rounded transition-all ${s.isEditing ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-indigo-600 hover:bg-white"}`}
                        >
                          {s.isEditing ? <FiSave size={14} /> : <FiEdit size={14} />}
                        </button>
                        <button
                          onClick={() => deleteMark(s._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white transition-all"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Minimalist Pagination */}
        {!loadingStudents && filteredStudents.length > 0 && (
          <div className="mt-auto p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rows</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded px-1.5 py-0.5 outline-none"
                >
                  {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
             </div>
             
             <div className="flex items-center gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Page {currentPage} / {totalPages || 1}
                </p>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                    disabled={currentPage === 1}
                    className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-30 transition-all"
                  >
                    <FiChevronLeft size={14} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-30 transition-all"
                  >
                    <FiChevronRight size={14} />
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMarksPage;
