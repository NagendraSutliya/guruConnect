import React, { useEffect, useState, useMemo, useRef } from "react";
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { 
  FiChevronDown, 
  FiMoreVertical, 
  FiSearch, 
  FiCalendar, 
  FiClock, 
  FiFilePlus, 
  FiPenTool, 
  FiTrendingUp, 
  FiInfo, 
  FiCheckCircle, 
  FiUploadCloud, 
  FiBook,
  FiActivity,
  FiTrash2,
  FiBarChart2
} from "react-icons/fi";
import useClickOutside from "../../../hooks/useClickOutside";
import { useToast } from "../../../context/ToastContext";
import ExamPaperStudioModal from "../../../components/teacher/modals/ExamPaperStudioModal";

const TeacherExamPanel = () => {
  const { showToast } = useToast();
  const [exams, setExams] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openExam, setOpenExam] = useState<string | null>(null);

  const [paperModal, setPaperModal] = useState(false);
  const [paperDetails, setPaperDetails] = useState({
    title: "",
    marks: "",
    duration: "",
    instructions: "",
    content: ""
  });
  const [activeExam, setActiveExam] = useState<any>(null);
  const [activeSubject, setActiveSubject] = useState<any>(null);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const menuRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  const navigate = useNavigate();

  const activeMenuRef = useRef<HTMLDivElement | null>(null);

  // Sync the activeMenuRef with the currently open menu
  useEffect(() => {
    activeMenuRef.current = openMenu ? menuRefs.current[openMenu]?.current || null : null;
  }, [openMenu]);

  useClickOutside(activeMenuRef, () => setOpenMenu(null));
  const fetchExams = async () => {
    try {
      const res = await api.get("/teacher/exams/full");
      setExams(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load exams ❌", "error");
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (exams.length && !openExam) setOpenExam(exams[0]._id);
  }, [exams]);

  const goToUploadMarks = (exam: any, subjectId: string) => {
    const classId = exam?.classId?._id || exam?.examClass?._id;
    const sectionId = exam?.sectionId?._id;
    navigate("/teacher/results/upload-marks", { state: { examId: exam._id, subjectId, classId, sectionId } });
  };

  const goToResult = (exam: any, subjectId: string) => {
    const classId = exam?.classId?._id || exam?.examClass?._id;
    const sectionId = exam?.sectionId?._id;
    navigate("/teacher/results", { state: { examId: exam._id, subjectId, classId, sectionId } });
  };

  const uploadFiles = async (examId: string, subjectId: string, files: FileList, type: "question" | "answer") => {
    if (uploading) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("examId", examId);
      formData.append("subjectId", subjectId);
      formData.append("type", type);
      Array.from(files).forEach((file) => formData.append("files", file));
      
      await api.post("/exam-files/upload-multiple", formData);
      showToast("Files uploaded successfully ✅", "success");
      await fetchExams(); // Instantly refresh UI
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Upload failed ❌";
      showToast(errMsg, "error");
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this paper?")) return;
    
    try {
      await api.delete(`/exam-files/${fileId}`);
      showToast("File deleted successfully 🗑️", "success");
      const res = await api.get("/teacher/exams/full");
      setExams(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to delete file ❌", "error");
    }
  };



  const isToday = (date: string) => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  };

  

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ongoing": return "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-100 font-black px-4";
      case "upcoming": return "bg-indigo-500 text-white border-indigo-600 shadow-md shadow-indigo-100 font-black px-4";
      case "completed": return "bg-red-600 text-white border-slate-200 opacity-70 font-bold px-3";
      default: return "bg-slate-50 text-slate-400 border-slate-100 px-3";
    }
  };

  const filteredExams = useMemo(() => {
    const filtered = exams.filter((exam) => {
      const matchesSearch = exam.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    const order: any = { ongoing: 1, upcoming: 2, completed: 3 };
    return [...filtered].sort((a, b) => order[a.status] - order[b.status]);
  }, [exams, search, statusFilter]);

  return (
    <div className="space-y-2">

      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Examination Ledger</h1>
          <p className="text-xs text-slate-500 font-medium">Coordinate schedules, question papers, and result reporting.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{exams.filter(e => e.status === 'ongoing').length} Active Sessions</span>
           </div>
        </div>
      </div>

      {/* Professional Search & Filter */}
      <div className="card-clean p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search exam series..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-[var(--primary)] transition-all outline-none"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Series</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Active</option>
            <option value="completed">Completed</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Series Collection */}
      <div className="space-y-3">
        {filteredExams.map((exam) => (
          <div 
            key={exam._id} 
            className={`card-clean transition-all duration-300 !overflow-visible ${
              openExam === exam._id ? "border-[var(--primary)]/30 ring-4 ring-[var(--primary)]/5" : "hover:border-slate-300"
            }`}
          >
            <div
              className={`p-4 flex items-center justify-between cursor-pointer ${
                openExam === exam._id ? "bg-slate-50/50" : "hover:bg-slate-50/30"
              }`}
              onClick={() => setOpenExam(openExam === exam._id ? null : exam._id)}
            >
              <div className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm shadow-sm transition-colors ${
                   exam.status === 'ongoing' ? 'bg-emerald-600 text-white' : 
                   exam.status === 'upcoming' ? 'bg-indigo-600 text-white' : 
                   'bg-slate-100 text-slate-400'
                 }`}>
                   <FiBook size={18} />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800 text-sm tracking-tight">{exam.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {exam.classId?.name} <span className="mx-2 opacity-30">|</span> {exam.sectionId?.name}
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border ${getStatusStyle(exam.status)}`}>
                  {exam.status}
                </span>
                <FiChevronDown className={`text-slate-300 transition-transform duration-300 ${openExam === exam._id ? "rotate-180" : ""}`} size={16} />
              </div>
            </div>

            {openExam === exam._id && (
              <div className="px-4 pb-4 pt-1 animate-fade-in divide-y divide-slate-50 !overflow-visible">
                {exam.subjects?.map((sub: any) => {
                  if (!menuRefs.current[sub._id]) menuRefs.current[sub._id] = React.createRef();
                  
                  return (
                    <div
                      key={sub._id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                            <FiActivity size={14} />
                         </div>
                         <div>
                            <p className="font-bold text-slate-700 text-xs">{sub.subjectId?.name}</p>
                            <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                               <span className="flex items-center gap-1"><FiCalendar size={10} className="text-[var(--primary)]" /> {new Date(sub.date).toLocaleDateString()}</span>
                               <span className="flex items-center gap-1"><FiClock size={10} className="text-[var(--primary)]" /> {sub.startTime} - {sub.endTime}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap justify-end">
                         {/* Minimal File Buttons */}
                         {sub.files && sub.files.length > 0 && sub.files.map((file: any) => {
                           const isQuestion = file.type === "question" || file.type === "typed";
                           const fileUrl = `http://localhost:5000${file.fileUrl}`;
                           const displayName = file.fileName ? file.fileName.replace(/\.[^/.]+$/, "") : (isQuestion ? 'Q. Paper' : 'Answers');
                           const typeColor = isQuestion ? "text-indigo-600" : "text-emerald-600";
                           const borderColor = isQuestion ? "hover:border-indigo-300" : "hover:border-emerald-300";
                           
                           return (
                             <div key={file._id} className={`flex items-center bg-white border border-slate-200 rounded shadow-sm transition-all ${borderColor} group`}>
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   if (file.fileUrl) {
                                     window.open(fileUrl, "_blank");
                                   } else {
                                     showToast("PDF not yet generated for this file", "warn");
                                   }
                                 }}
                                 title={file.fileName ? `${isQuestion ? 'Question Paper' : 'Answer Sheet'}: ${file.fileName}` : "Uploaded File"}
                                 className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold text-slate-600 hover:bg-slate-50 transition-colors rounded-l"
                               >
                                 {isQuestion ? <FiFilePlus className={typeColor} size={10} /> : <FiUploadCloud className={typeColor} size={10} />}
                                 <span className="uppercase tracking-wide max-w-[120px] truncate flex items-center gap-1">
                                    <span className={typeColor}>{isQuestion ? 'Q:' : 'ANS:'}</span>
                                    {displayName}
                                 </span>
                               </button>
                               <div className="w-px h-3 bg-slate-200 mx-0.5 group-hover:bg-slate-300 transition-colors"></div>
                               <button
                                 onClick={(e) => deleteFile(e, file._id)}
                                 title="Delete Paper"
                                 className="px-2 py-1 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors rounded-r"
                               >
                                 <FiTrash2 size={10} />
                               </button>
                             </div>
                           );
                         })}

                         {isToday(sub.date) && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold uppercase tracking-widest rounded border border-blue-100 whitespace-nowrap">Live Cycle</span>}
                         {sub.isSubmitted && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase tracking-widest rounded border border-emerald-100 whitespace-nowrap">Evaluated</span>}
                         
                         <div ref={menuRefs.current[sub._id]} className="relative ml-2">
                           <button
                             onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === sub._id ? null : sub._id); }}
                             className="p-1.5 hover:bg-slate-100 text-slate-400 rounded transition-colors"
                           >
                             <FiMoreVertical size={14} />
                           </button>

                           {openMenu === sub._id && (
                             <div className="absolute w-64 right-0 bg-white border border-slate-200 rounded-lg shadow-xl z-[100] py-2 animate-fade-in overflow-hidden">
                               <div className="px-4 pb-2 mb-2 border-b border-slate-50">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Subject Operations</p>
                               </div>
                               
                               <label className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-600 transition-colors">
                                 <FiFilePlus className="text-[var(--primary)]" />
                                 <span>Upload Question Paper</span>
                                 <input
                                   type="file"
                                   hidden
                                   multiple
                                   onChange={(e) => {
                                     if (!e.target.files) return;
                                     const subjectIdSafe = sub.subjectId?._id;
                                     if (!subjectIdSafe) return showToast("Subject missing ❌", "error");
                                     uploadFiles(exam._id, subjectIdSafe, e.target.files, "question");
                                     setOpenMenu(null);
                                   }}
                                 />
                               </label>

                               <button
                                 onClick={() => {
                                   setPaperDetails({ title: "", marks: "", duration: "", instructions: "", content: "" });
                                   setActiveExam(exam._id);
                                   setActiveSubject(sub.subjectId?._id);
                                   setPaperModal(true);
                                   setOpenMenu(null);
                                 }}
                                 className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors"
                               >
                                 <FiPenTool className="text-[var(--primary)]" />
                                 <span>Create Question Paper</span>
                               </button>

                               <label className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-600 transition-colors">
                                 <FiUploadCloud className="text-[var(--primary)]" />
                                 <span>Upload Answer Sheet</span>
                                 <input
                                   type="file"
                                   hidden
                                   multiple
                                   onChange={(e) => {
                                     if (!e.target.files) return;
                                     const subjectIdSafe = sub.subjectId?._id;
                                     if (!subjectIdSafe) return alert("Subject missing");
                                     uploadFiles(exam._id, subjectIdSafe, e.target.files, "answer");
                                     setOpenMenu(null);
                                   }}
                                 />
                               </label>
                               <button
                                 onClick={() => goToResult(exam, sub.subjectId?._id)}
                                 className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors rounded-b-xl"
                                >
                                 <FiBarChart2 className="text-[var(--primary)]" />
                                 <span>View Results</span>
                               </button>


                                <button
                                 onClick={() => goToUploadMarks(exam, sub.subjectId?._id)}
                                 className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors"
                               >
                                 <FiTrendingUp className="text-[var(--primary)]" />
                                 <span>Upload Marks</span>
                               </button>
                             </div>
                           )}
                         </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <ExamPaperStudioModal
        isOpen={paperModal}
        onClose={() => setPaperModal(false)}
        initialDetails={paperDetails}
        examId={activeExam}
        subjectId={activeSubject}
        onSuccess={async () => {
          const res = await api.get("/teacher/exams/full");
          setExams(res.data.data || []);
        }}
      />

      {/* Operational Protocol */}
      <div className="bg-slate-900 rounded-xl p-6 text-white flex gap-4">
        <FiInfo className="text-[var(--primary)] shrink-0" size={20} />
        <div>
           <h3 className="font-bold text-sm mb-2">Examination Protocols</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              {[
                "Question scripts must be finalized 48h prior to session.",
                "Batch digitization of answer sheets is mandatory for archival.",
                "Real-time session status indicators are synchronized with registry.",
                "Evaluation input triggers post-session conclusion."
              ].map((text, i) => (
                 <div key={i} className="flex items-center gap-2 text-[11px] text-white/60 font-medium">
                    <FiCheckCircle className="text-[var(--primary)]" size={12} />
                    {text}
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherExamPanel;
