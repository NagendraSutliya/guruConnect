import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import Papa from "papaparse";
import { 
  FiChevronDown, 
  FiSearch, 
  FiTrash2, 
  FiArrowLeft, 
  FiUpload, 
  FiDownload, 
  FiSave, 
  FiActivity,
  FiBookOpen,
  FiTarget,
  FiAward,
  FiEdit,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { useTeacher } from "../../../context/TeacherContext";
import type {
  UploadMarksStudent,
  UploadMarksClassAssignment,
} from "../../../types/teacher/types";

const UploadMarksPage = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<UploadMarksClassAssignment[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const navigate = useNavigate();
  const [maxMarks, setMaxMarks] = useState(100);

  const { 
    selectedClassId, setSelectedClassId, 
    selectedSectionId, setSelectedSectionId,
    selectedSubjectId, setSelectedSubjectId,
    selectedExamId, setSelectedExamId,
    draftStudents: students, setDraftStudents: setStudents,
    setResultStudents
  } = useTeacher();

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterMode, setFilterMode] = useState<"CHIPS" | "LIST">(() => (localStorage.getItem("guru_teacher_filter_mode") as any) || "CHIPS");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleBack = () => navigate("/teacher/results");

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await api.get("/teacher/attendance/my");
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

  const classes = Array.from(new Map(assignments.filter(a => a.classId?._id).map((a) => [a.classId!._id, a.classId])).values());
  const sections = Array.from(new Map(assignments.filter((a) => a.classId?._id === selectedClassId && a.sectionId?._id).map((a) => [a.sectionId!._id, a.sectionId])).values());
  const subjects = Array.from(new Map(assignments.filter((a) => a.classId?._id === selectedClassId && a.sectionId?._id === selectedSectionId && a.subjectId?._id).map((a) => [a.subjectId!._id, a.subjectId])).values());

  // Remove auto-clear to allow context persistence
  useEffect(() => {
    if (!selectedClassId) {
      setStudents([]);
      setSelectedSectionId("");
      setSelectedSubjectId("");
      setSelectedExamId("");
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedClassId) return;
    const loadExams = async () => {
      try {
        const res = await api.get("/teacher/exams", { params: { classId: selectedClassId } });
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
      }));

      if (selectedExamId && selectedSubjectId) {
        const marksRes = await api.get("/teacher/results", {
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
      const res = await api.post("/teacher/results", {
        examId: selectedExamId,
        examSubjectId: selectedSubjectId,
        records: payload,
      });
      if (res.data.success) {
        showToast("Marks saved successfully!", "success");
        setEditingId(null);
        // Sync draft to published state for Result Panel
        setResultStudents([...students]);
      } else {
        showToast("Failed to save marks", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while saving marks.", "error");
    } finally {
      setSaving(false);
    }
  };

  const clearMarkLocal = (studentId: string) => {
    setStudents((prev) => prev.map((s) => (s._id === studentId ? { ...s, marks: undefined } : s)));
  };


  const filteredStudents = useMemo(() => {
    return students.filter((s) => `${s.name} ${s.rollNo}`.toLowerCase().includes(search.toLowerCase()));
  }, [students, search]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-2">
      
      {/* Header - Synced Aura Style */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 mb-2 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack} 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
          >
             <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Registry Authoring</h1>
            <p className="text-xs text-slate-500 font-medium">Synchronize examination performance records and publish results.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">View Option</span>
            <div className="relative bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center w-40 h-9 overflow-hidden shadow-inner">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-md bg-gradient-to-r from-orange-500 to-rose-500 ${
                  filterMode === 'CHIPS' ? 'left-1' : 'left-[calc(50%+1px)]'
                }`}
              />
              <button 
                onClick={() => { setFilterMode("CHIPS"); localStorage.setItem("guru_teacher_filter_mode", "CHIPS"); }}
                className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'CHIPS' ? 'text-white' : 'text-slate-400'}`}
              >CHIPS</button>
              <button 
                onClick={() => { setFilterMode("LIST"); localStorage.setItem("guru_teacher_filter_mode", "LIST"); }}
                className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'LIST' ? 'text-white' : 'text-slate-400'}`}
              >LIST</button>
            </div>
          </div>
         
        </div>
      </div>

      {/* Modern High-Density Filter Vault */}
      <div className="card-clean px-6 py-2 bg-white/50 backdrop-blur-sm border-slate-300 mb-2">
        <div className="min-h-[50px] flex items-center">
          {filterMode === "CHIPS" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full animate-fade-in divide-x divide-slate-100">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiTarget className="text-indigo-600 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Class</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
                  {classes.map((c) => (
                    <button
                      key={c?._id}
                      onClick={() => { setSelectedClassId(c?._id || ""); setSelectedSectionId(""); setSelectedExamId(""); setSelectedSubjectId(""); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedClassId === c?._id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                      }`}
                    >{c?.name}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 px-4">
                <div className="flex items-center gap-2">
                  <FiActivity className="text-emerald-500 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sections</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
                  {selectedClassId ? sections.map((s) => (
                    <button
                      key={s?._id}
                      onClick={() => { setSelectedSectionId(s?._id || ""); setSelectedExamId(""); setSelectedSubjectId(""); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSectionId === s?._id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-emerald-300'
                      }`}
                    >{s?.name}</button>
                  )) : <p className="text-[10px] font-bold text-slate-300 italic">Select class first</p>}
                </div>
              </div>

              <div className="space-y-3 px-4">
                <div className="flex items-center gap-2">
                  <FiAward className="text-amber-500 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exams</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
                  {selectedSectionId ? exams.map((e) => (
                    <button
                      key={e._id}
                      onClick={() => { setSelectedExamId(e._id); setSelectedSubjectId(""); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedExamId === e._id ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-amber-300'
                      }`}
                    >{e.name}</button>
                  )) : <p className="text-[10px] font-bold text-slate-300 italic">Select section first</p>}
                </div>
              </div>

              <div className="space-y-3 px-4">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="text-rose-500 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subjects</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
                  {selectedExamId ? subjects.map((sub) => (
                    <button
                      key={sub?._id}
                      onClick={() => setSelectedSubjectId(sub?._id || "")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSubjectId === sub?._id ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-rose-300'
                      }`}
                    >{sub?.name}</button>
                  )) : <p className="text-[10px] font-bold text-slate-300 italic">Select exam first</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-fade-in px-2">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Class</label>
                <div className="relative">
                  <select
                    value={selectedClassId}
                    onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSectionId(""); setSelectedExamId(""); setSelectedSubjectId(""); }}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => <option key={c?._id} value={c?._id}>{c?.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Section</label>
                <div className="relative">
                  <select
                    value={selectedSectionId}
                    onChange={(e) => { setSelectedSectionId(e.target.value); setSelectedExamId(""); setSelectedSubjectId(""); }}
                    disabled={!selectedClassId}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => <option key={s?._id} value={s?._id}>{s?.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Exam Series</label>
                <div className="relative">
                  <select
                    value={selectedExamId}
                    onChange={(e) => { setSelectedExamId(e.target.value); setSelectedSubjectId(""); }}
                    disabled={!selectedSectionId}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    <option value="">Select Exam</option>
                    {exams.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Subject</label>
                <div className="relative">
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    disabled={!selectedExamId}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => <option key={s?._id} value={s?._id}>{s?.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maximum Marks</span>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="w-16 bg-white border border-slate-200 rounded-lg py-1 text-center text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
          </div>
          
          <button
            onClick={loadStudents}
            disabled={!selectedClassId || !selectedSectionId || !selectedExamId || !selectedSubjectId || loadingStudents}
            className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all disabled:opacity-30 shadow-lg shadow-slate-100 flex items-center gap-2 group"
          >
            {loadingStudents ? "Syncing..." : "Load Students"}
          </button>
        </div>
      </div>

     

      {/* Main Table Card */}
      <div className="card-clean relative overflow-hidden border-slate-300 flex flex-col">
        {/* Integrated Search & Actions Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between bg-slate-50/80 backdrop-blur-md gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={downloadTemplate}
              disabled={students.length === 0 || loadingStudents}
              className="px-4 py-2 text-[10px] font-black text-white bg-emerald-600 border border-emerald-500 rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest group"
            >
              <FiDownload size={14} /> 
              Export CSV
            </button>
            <div className="relative group">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                disabled={students.length === 0 || loadingStudents}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 uppercase tracking-widest group disabled:opacity-30"
              >
                <FiUpload size={14} />
                Import CSV
              </button>
            </div>
             {students.length > 0 && (
            <button 
              onClick={saveMarks}
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 uppercase tracking-widest disabled:opacity-50"
            >
              <FiSave className={saving ? "animate-spin" : ""} />
              <span>{saving ? "Publishing..." : "Publish Marks"}</span>
            </button>
          )}
          </div>

          
          <div className="relative w-full max-w-xs">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by student name or roll..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-1 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        {loadingStudents ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing Records...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <FiBookOpen size={64} className="text-slate-300 mb-4" />
            <p className="text-sm font-bold text-slate-600">
              {selectedClassId && selectedSectionId && selectedExamId && selectedSubjectId
                ? "No student records found in this scope"
                : "Configure academic scope to author registry"}
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto h-[calc(100vh-410px)] no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-green-50 shadow-sm">
                <tr className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3 text-center">Score / {maxMarks}</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.map((s) => (
                  <tr key={s._id} className="group hover:bg-indigo-50/20 transition-all">
                    <td className="px-6 py-2">
                      <span className="text-xs font-black text-slate-400 group-hover:text-indigo-600 transition-colors">{s.rollNo}</span>
                    </td>
                    <td className="px-6 py-2">
                      <p className="text-sm font-bold text-slate-700 tracking-tight">{s.name}</p>
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex justify-center">
                        {editingId === s._id ? (
                          <input
                            type="number"
                            min={0}
                            max={maxMarks}
                            value={s.marks ?? ""}
                            autoFocus
                            onChange={(e) => updateMark(s._id, e.target.value === "" ? undefined : Number(e.target.value))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setEditingId(null);
                              }
                            }}
                            className="w-16 bg-white border-2 border-indigo-500 rounded-lg px-2 py-1 text-center text-xs font-black text-slate-800 outline-none shadow-sm animate-pulse-subtle"
                            placeholder="0"
                          />
                        ) : (
                          <div className={`px-4 py-1 rounded-full text-[10px] font-black min-w-[3.5rem] text-center transition-all ${
                            s.marks !== undefined 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-slate-50 text-slate-300 border border-slate-100"
                          }`}>
                            {s.marks !== undefined ? s.marks : "—"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(editingId === s._id ? null : s._id)}
                          className={`p-2 rounded-lg transition-all ${
                            editingId === s._id 
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                              : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          }`}
                          title="Edit Score"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button 
                          onClick={() => clearMarkLocal(s._id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Clear Score"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loadingStudents && filteredStudents.length > 0 && (
          <div className="px-6 py-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 shrink-0">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Show</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                >
                  {[5, 10, 25, 50].map(val => (
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
      </div>
    </div>
  );
};

export default UploadMarksPage;
