import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import { 
  FiChevronDown, 
  FiSearch, 
  FiUpload, 
  FiDownload, 
  FiAward, 
  FiActivity, 
  FiLayers, 
  FiBookOpen,
  FiCheckCircle,
  FiAlertCircle,
  FiHash,
  FiTarget
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useTeacher } from "../../../context/TeacherContext";
import type {
  ResultStudent,
  ResultClassAssignment,
} from "../../../types/teacher/types";
import Pagination from "../../../components/common/Pagination";

const ResultPanel = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<ResultClassAssignment[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { 
    selectedClassId, setSelectedClassId, 
    selectedSectionId, setSelectedSectionId,
    selectedSubjectId, setSelectedSubjectId,
    selectedExamId, setSelectedExamId,
    resultStudents: students, setResultStudents: setStudents
  } = useTeacher();

  useEffect(() => {
    if (location.state) {
      const { classId, sectionId, examId, subjectId } = location.state as any;
      if (classId) setSelectedClassId(classId);
      if (sectionId) setSelectedSectionId(sectionId);
      if (examId) setSelectedExamId(examId);
      if (subjectId) setSelectedSubjectId(subjectId);
      
      // Clear location state to prevent infinite loops if we go back/forward
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setSelectedClassId, setSelectedSectionId, setSelectedExamId, setSelectedSubjectId]);

  const [maxMarks, setMaxMarks] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterMode, setFilterMode] = useState<'CHIPS' | 'LIST'>(() => (localStorage.getItem("guru_teacher_filter_mode") as any) || 'CHIPS');

  const handleUploadMarksClick = () => navigate("/teacher/results/upload-marks");

  const filteredStudents = useMemo(() => {
    return students.filter((s) => `${s.name} ${s.rollNo}`.toLowerCase().includes(search.toLowerCase()));
  }, [students, search]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClassId, selectedSectionId, selectedExamId, selectedSubjectId]);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await api.get("/teacher/attendance/my");
        const data: ResultClassAssignment[] = res.data.data || [];
        setAssignments(data);
      } catch (err) {
        showToast("Failed to load assignments", "error");
      }
    };
    loadAssignments();
  }, []);

  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) return setExams([]);
    const loadExams = async () => {
      try {
        let res = await api.get("/teacher/exams", {
          params: { classId: selectedClassId, sectionId: selectedSectionId },
        });
        let examList = res.data.data || [];
        if (examList.length === 0) {
          const fallbackRes = await api.get("/teacher/exams", { params: { classId: selectedClassId } });
          examList = fallbackRes.data.data || [];
        }
        setExams(examList);
      } catch (err) {
        showToast("Failed to load exams", "error");
      }
    };
    loadExams();
  }, [selectedClassId, selectedSectionId]);

  const classes = Array.from(new Map(assignments.filter((a) => a.classId?._id).map((a) => [a.classId._id, a.classId])).values());
  const sections = Array.from(new Map(assignments.filter((a) => a.classId?._id === selectedClassId && a.sectionId?._id).map((a) => [a.sectionId._id, a.sectionId])).values());
  const subjects = Array.from(new Map(assignments.filter((a) => a.classId?._id === selectedClassId && a.sectionId?._id === selectedSectionId && a.subjectId?._id).map((a) => [a.subjectId._id, a.subjectId])).values());

  const loadStudents = async () => {
    if (!selectedClassId || !selectedSectionId) return showToast("Select class & section", "error");
    setLoadingStudents(true);
    try {
      const studentRes = await api.get("/student/by-class", {
        params: { classId: selectedClassId, sectionId: selectedSectionId },
      });
      const studentList: ResultStudent[] = studentRes.data.data.map((s: any) => ({
        _id: s._id,
        name: s.name,
        rollNo: s.rollNo,
        marks: undefined,
        isEditing: false,
      }));
      setStudents(studentList);
      if (selectedExamId && selectedSubjectId) {
        const marksRes = await api.get("/teacher/results", {
          params: { examId: selectedExamId, examSubjectId: selectedSubjectId },
        });
        const marksList: any[] = marksRes.data.data || [];
        const updatedStudents = studentList.map((s: ResultStudent) => {
          const m = marksList.find((m: any) => m.studentId._id === s._id);
          return { ...s, marks: m?.marks };
        });
        setStudents(updatedStudents);
      }
    } catch (err) {
      showToast("Failed to load students or marks", "error");
    }
    setLoadingStudents(false);
  };

  const downloadTemplate = () => {
    if (!students || students.length === 0) return alert("No student data available");
    const examName = exams.find((e) => e._id === selectedExamId)?.name || "";
    const subjectName = subjects.find((sub) => sub?._id === selectedSubjectId)?.name || "";
    const headers = ["Roll No", "Name", "Exam", "Subject", "Marks", "Result"];
    const rows = students.map((s) => [s.rollNo, s.name, examName, subjectName, s.marks !== undefined ? s.marks : "", s.marks !== undefined ? (s.marks >= maxMarks / 3 ? "Pass" : "Fail") : ""]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_marks.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredExams = exams;
  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExams.slice(start, start + itemsPerPage);
  }, [filteredExams, currentPage, itemsPerPage]);

  return (
  <div className="space-y-2">
      
      {/* Sticky Header - Synced Aura Style */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Performance Ledger</h1>
          <p className="text-xs text-slate-500 font-medium">Review academic outcomes and synchronize examination results.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">View Option</span>
          <div className="relative bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center w-40 h-9 overflow-hidden shadow-inner">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-md bg-gradient-to-r from-orange-500 to-rose-500 ${
                filterMode === 'CHIPS' ? 'left-1' : 'left-[calc(50%+1px)]'
              }`}
            />
            <button 
              onClick={() => {
                setFilterMode("CHIPS");
                localStorage.setItem("guru_teacher_filter_mode", "CHIPS");
              }}
              className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'CHIPS' ? 'text-white' : 'text-slate-400'}`}
            >CHIPS</button>
            <button 
              onClick={() => {
                setFilterMode("LIST");
                localStorage.setItem("guru_teacher_filter_mode", "LIST");
              }}
              className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'LIST' ? 'text-white' : 'text-slate-400'}`}
            >LIST</button>
          </div>
        </div>
      </div>

      {/* Modern High-Density Filter Vault */}
      <div className="card-clean px-6 py-2 bg-white/50 backdrop-blur-sm border-slate-300 mb-2">
        <div className="min-h-[50px] flex items-center">
          {filterMode === "CHIPS" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full animate-fade-in divide-x divide-slate-100">
              {/* Academic Class Chips */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiTarget className="text-indigo-600 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Class</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
                  {classes.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => { setSelectedClassId(c._id); setSelectedSectionId(""); setSelectedExamId(""); setSelectedSubjectId(""); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedClassId === c._id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                      }`}
                    >{c.name}</button>
                  ))}
                  {classes.length === 0 && <span className="text-[10px] text-slate-300 font-bold uppercase italic">No assignments</span>}
                </div>
              </div>

              {/* Section Chips */}
              <div className="space-y-3 px-4">
                <div className="flex items-center gap-2">
                  <FiHash className="text-emerald-500 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sections</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
                  {selectedClassId ? sections.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => { setSelectedSectionId(s._id); setSelectedExamId(""); setSelectedSubjectId(""); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSectionId === s._id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-emerald-300'
                      }`}
                    >{s.name}</button>
                  )) : <p className="text-[10px] font-bold text-slate-300 italic">Select class first</p>}
                </div>
              </div>

              {/* Exam Series Chips */}
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

              {/* Subject Focus Chips */}
              <div className="space-y-3 px-4">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="text-rose-500 shrink-0" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subjects</label>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
                  {selectedExamId ? subjects.map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() => setSelectedSubjectId(sub._id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedSubjectId === sub._id ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-rose-300'
                      }`}
                    >{sub.name}</button>
                  )) : <p className="text-[10px] font-bold text-slate-300 italic">Select exam first</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full animate-fade-in px-2">
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  <FiLayers className="text-indigo-600" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Class</label>
                </div>
                <div className="relative">
                  <select
                    value={selectedClassId}
                    onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSectionId(""); setSelectedExamId(""); setSelectedSubjectId(""); }}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  <FiActivity className="text-emerald-500" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Section</label>
                </div>
                <div className="relative">
                  <select
                    value={selectedSectionId}
                    onChange={(e) => { setSelectedSectionId(e.target.value); setSelectedExamId(""); setSelectedSubjectId(""); }}
                    disabled={!selectedClassId}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  <FiAward className="text-amber-500" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Exam</label>
                </div>
                <div className="relative">
                  <select
                    value={selectedExamId}
                    onChange={(e) => { setSelectedExamId(e.target.value); setSelectedSubjectId(""); }}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">Select Exam</option>
                    {paginatedExams.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="text-rose-500" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Subject</label>
                </div>
                <div className="relative">
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 appearance-none shadow-sm cursor-pointer"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>            
          )}
        </div>

        

        <div className="mt-4 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Side: Scaling Factor */}
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
            disabled={!selectedClassId || !selectedSectionId || !selectedExamId || !selectedSubjectId}
            className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all disabled:opacity-30 shadow-lg shadow-slate-100 flex items-center gap-2 group"
          >
           {loadingStudents ? "Syncing..." : "Load Students"}
          </button>
        </div>
      </div>


      {/* Premium Metrics Dashboard */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
          {/* Average Performance Card */}
          <div className="card-clean p-4 bg-gradient-to-br from-blue-50 to-white border-blue-300 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <FiActivity size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest">Average Score</p>
              <h4 className="text-xl font-bold text-slate-800 leading-tight">
                {students.length > 0 
                  ? (students.reduce((acc, s) => acc + (s.marks || 0), 0) / students.length).toFixed(1) 
                  : "0.0"}
                <span className="text-[10px] text-slate-400 ml-1">avg</span>
              </h4>
            </div>
          </div>

          {/* Pass Velocity Card */}
          <div className="card-clean p-4 bg-gradient-to-br from-emerald-50 to-white border-emerald-300 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <FiCheckCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Pass Outcome</p>
              <h4 className="text-xl font-bold text-slate-800 leading-tight">
                {students.filter(s => s.marks !== undefined && s.marks >= maxMarks / 3).length}
                <span className="text-[10px] text-slate-400 ml-1">students</span>
              </h4>
            </div>
          </div>

          {/* Fail Registry Card */}
          <div className="card-clean p-4 bg-gradient-to-br from-rose-50 to-white border-rose-300 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <FiAlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-rose-600/60 uppercase tracking-widest">Fail Registry</p>
              <h4 className="text-xl font-bold text-slate-800 leading-tight">
                {students.filter(s => s.marks !== undefined && s.marks < maxMarks / 3).length}
                <span className="text-[10px] text-slate-400 ml-1">students</span>
              </h4>
            </div>
          </div>

          {/* Cohort Strength Card */}
          <div className="card-clean p-4 bg-gradient-to-br from-indigo-50 to-white border-indigo-300 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <FiLayers size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest">Cohort Strength</p>
              <h4 className="text-xl font-bold text-slate-800 leading-tight">
                {students.length}
                <span className="text-[10px] text-slate-400 ml-1">total</span>
              </h4>
            </div>
          </div>
        </div>
      )}
      {/* Main Ledger Table */}
      <div className="card-clean relative overflow-hidden border-slate-300 flex flex-col">

        {/* Integrated Search & Actions Bar - Sticky Top */}
        <div className="px-4 py-3 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between bg-slate-50/80 backdrop-blur-md gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={downloadTemplate}
              disabled={students.length === 0 || loadingStudents}
              className="px-4 py-2 text-[10px] font-black text-white bg-emerald-600 border border-emerald-500 rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest group"
            >
              <FiDownload className="text-white group-hover:scale-110 transition-transform" size={14} /> 
              Export CSV
            </button>
            <button
              onClick={handleUploadMarksClick}
              className="px-4 py-2 bg-blue-500 text-white text-[10px] font-black rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-100 uppercase tracking-widest group"
            >
              <FiUpload className="group-hover:scale-110 transition-transform" size={14} />
              Upload Marks
            </button>
          </div>
          <div className="relative  w-full max-w-xs">
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
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing Student Vault...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-40">
              <FiAward size={64} className="text-slate-300 mb-4" />
              <p className="text-sm font-bold text-slate-600">
                {selectedClassId && selectedSectionId && selectedExamId && selectedSubjectId
                  ? "No performance records found for this scope"
                  : "Select full academic scope to view outcomes"}
              </p>
            </div>
          ) : (
             <div className="overflow-y-auto h-[calc(100vh-500px)] no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-green-50 shadow-sm">
                <tr className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-3">Roll No</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Exam</th>
                  <th className="px-6 py-3 text-center">Result</th>
                  <th className="px-6 py-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedStudents.map((s) => (
                  <tr key={s._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                    <td className="px-6 py-2">
                      <span className="text-xs font-black text-slate-400 group-hover:text-indigo-600 transition-colors">{s.rollNo}</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-slate-700 tracking-tight">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-2">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                            {exams.find(e => e._id === selectedExamId)?.name || "N/A"}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {subjects.find(sub => sub._id === selectedSubjectId)?.name || "N/A"}
                          </p>
                       </div>
                    </td>
                    <td className="px-6 py-2 text-center">
                      {s.marks !== undefined ? (
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                          s.marks >= maxMarks / 3 
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-100" 
                            : "bg-rose-500 text-white border-rose-600 shadow-rose-100"
                        }`}>
                          {s.marks >= maxMarks / 3 ? <FiCheckCircle /> : <FiAlertCircle />}
                          {s.marks >= maxMarks / 3 ? "Promoted" : "Retake"}
                        </span>
                      ) : (
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Evaluation Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-2">
                        <div className="flex flex-col items-end gap-1">
                          {s.isEditing ? (
                            <input
                              type="number"
                              min={0}
                              max={maxMarks}
                              value={s.marks ?? ""}
                              autoFocus
                              className="w-16 bg-white border-2 border-indigo-500 rounded-lg px-2 py-1 text-center text-xs font-black text-slate-800 outline-none shadow-sm"
                              placeholder="0"
                            />
                          ) : (
                            <>
                              <p className="text-sm font-black text-slate-800 tracking-tight">
                                {s.marks !== undefined ? `${s.marks} / ${maxMarks}` : "—"}
                              </p>
                              {s.marks !== undefined && (
                                <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-1000 ${s.marks >= maxMarks/3 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                      style={{ width: `${(s.marks / maxMarks) * 100}%` }}
                                    />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer - Synced Style */}
        {filteredStudents.length > 0 && !loadingStudents && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ResultPanel;
