import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import { 
  FiChevronDown, 
  FiSearch, 
  FiBarChart2, 
  FiUpload, 
  FiDownload, 
  FiAward, 
  FiActivity, 
  FiLayers, 
  FiBookOpen,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type {
  ResultStudent,
  ResultClassAssignment,
} from "../../../types/teacher/types";

const ResultPanel = () => {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<ResultClassAssignment[]>([]);
  const [students, setStudents] = useState<ResultStudent[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleUploadMarksClick = () => navigate("/teacher/results/upload-marks");

  const filteredStudents = useMemo(() => {
    return students.filter((s) => `${s.name} ${s.rollNo}`.toLowerCase().includes(search.toLowerCase()));
  }, [students, search]);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await api.get("/teacher/results");
        setAssignments(res.data.data || []);
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
        const updatedStudents = studentList.map((s) => {
          const m = marksList.find((m) => m.studentId._id === s._id);
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
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Performance Ledger</h1>
          <p className="text-sm text-slate-500 font-medium">Review academic outcomes and synchronize examination results.</p>
        </div>
        <div className="flex items-center gap-3">
           <button
              onClick={downloadTemplate}
              disabled={students.length === 0}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <FiDownload /> Export CSV
            </button>
           <button
            onClick={handleUploadMarksClick}
            className="btn-primary flex items-center gap-2"
          >
            <FiUpload />
            Upload Marks
          </button>
        </div>
      </div>

      {/* Professional Filters */}
      <div className="card-clean p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Class</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 bottom-2.5 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Section</label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Section</option>
            {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 bottom-2.5 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Exam Series</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Exam</option>
            {paginatedExams.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 bottom-2.5 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Subject Focus</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 bottom-2.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scaling Factor</span>
                <input
                   type="number"
                   value={maxMarks}
                   onChange={(e) => setMaxMarks(Number(e.target.value))}
                   className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 outline-none focus:border-[var(--primary)]"
                />
             </div>
             <button
                onClick={loadStudents}
                disabled={!selectedClassId || !selectedSectionId || !selectedExamId || !selectedSubjectId}
                className="px-4 py-1.5 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-700 transition-all disabled:opacity-30"
             >
                {loadingStudents ? "Syncing..." : "Initiate Load"}
             </button>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{students.filter(s => s.marks !== undefined && s.marks >= maxMarks / 3).length} Pass</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{students.filter(s => s.marks !== undefined && s.marks < maxMarks / 3).length} Fail</span>
             </div>
          </div>
      </div>

      {/* Main Ledger Table */}
      <div className="card-clean min-h-[400px] relative">
        {loadingStudents && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aggregating Scores...</p>
          </div>
        )}

        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:bg-white focus:border-[var(--primary)] transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 py-4 w-24">Roll No</th>
                <th className="px-6 py-4">Student Identity</th>
                <th className="px-6 py-4">Series & Focus</th>
                <th className="px-6 py-4 text-center">Outcome</th>
                <th className="px-6 py-4 text-right">Raw Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center flex flex-col items-center">
                    <FiAward size={48} className="text-slate-200 mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Apply filters to view outcomes</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-400">#{s.rollNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold border border-slate-200">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-slate-700">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-tight">
                            {exams.find(e => e._id === selectedExamId)?.name || "N/A"}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400">
                            {subjects.find(sub => sub._id === selectedSubjectId)?.name || "N/A"}
                          </p>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {s.marks !== undefined ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          s.marks >= maxMarks / 3 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-500 border border-rose-100"
                        }`}>
                          {s.marks >= maxMarks / 3 ? <FiCheckCircle /> : <FiAlertCircle />}
                          {s.marks >= maxMarks / 3 ? "Promoted" : "Retake"}
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Evaluation Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <p className="text-sm font-bold text-slate-800">
                         {s.marks !== undefined ? `${s.marks} / ${maxMarks}` : "—"}
                       </p>
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

export default ResultPanel;
