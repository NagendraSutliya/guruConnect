import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiAward,
  FiBarChart2,
  FiChevronDown,
  FiSearch,
  FiStar,
  FiUsers,
  FiX,
  FiDownload,
  FiFilter,
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import Pagination from "../../../components/common/Pagination";

const MetricCard = ({ title, value, icon, gradient }: any) => (
  <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-2xl shadow-lg transition-transform duration-500 group-hover:rotate-6`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
    </div>
  </div>
);

const AdminResultPanel = () => {
  const { showToast } = useToast();
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setSectionId("");
  }, [classId]);

  const load = async () => {
    try {
      const [e, c, s] = await Promise.all([
        api.get("/admin/exams"),
        api.get("/admin/classes"),
        api.get("/admin/sections"),
      ]);
      setExams(e.data.data || []);
      setClasses(c.data.data || []);
      setSections(s.data.data || []);
    } catch (err) {
      showToast("Failed to load filter criteria", "error");
    }
  };

  const loadResults = async () => {
    try {
      if (!examId || !classId || !sectionId) {
        setResults([]);
        setSummary(null);
        return;
      }

      setLoading(true);
      const params: any = { examId, classId, sectionId };
      const res = await api.get("/admin/results", { params });
      setResults(res.data.data || []);
      setSummary(res.data.summary || null);
    } catch (err) {
      setResults([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadResults();
  }, [examId, classId, sectionId]);

  const selectedExamName = useMemo(() => {
    return exams.find((e) => e._id === examId)?.name || "-";
  }, [examId, exams]);

  const consolidatedResults = useMemo(() => {
    const map: Record<string, any> = {};
    results.forEach((r) => {
      if (!r?.studentId?._id) return;
      const key = r.studentId._id;
      if (!map[key]) {
        map[key] = {
          studentName: r.studentId.name || "N/A",
          examName: r.examSubjectId?.examId?.name || "N/A",
          totalMarks: 0,
          maxMarks: 0,
          subjects: [],
        };
      }
      const marks = Number(r.marks ?? 0);
      const maxMarks = Number(r.maxMarks ?? 100);
      map[key].totalMarks += marks;
      map[key].maxMarks += maxMarks;
      map[key].subjects.push({ name: r.examSubjectId?.subjectId?.name || "N/A", marks });
    });

    return Object.values(map).map((item: any) => {
      const percent = item.maxMarks ? (item.totalMarks / item.maxMarks) * 100 : 0;
      return { ...item, percentage: percent.toFixed(1), status: percent >= 40 ? "Pass" : "Fail" };
    });
  }, [results]);

  const passPercentage = useMemo(() => {
    if (!consolidatedResults.length) return 0;
    const passed = consolidatedResults.filter((r: any) => r.status === "Pass").length;
    return ((passed / consolidatedResults.length) * 100).toFixed(1);
  }, [consolidatedResults]);

  const filteredResults = useMemo(() => {
    return consolidatedResults.filter((r: any) =>
      r.studentName.toLowerCase().includes(search.toLowerCase())
    );
  }, [consolidatedResults, search]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredResults.slice(start, start + itemsPerPage);
  }, [filteredResults, currentPage, itemsPerPage]);

  const exportCSV = () => {
    const rows = filteredResults.map((r: any) => ({
      Student: r.studentName,
      Exam: r.examName,
      Subjects: r.subjects.map((s: any) => `${s.name}: ${s.marks}`).join(" | "),
      Total: r.totalMarks,
      Percentage: r.percentage + "%",
      Status: r.status,
    }));
    const csv = "Student,Exam,Subjects,Total,Percentage,Status\n" + rows.map((r: any) => `${r.Student},${r.Exam},${r.Subjects},${r.Total},${r.Percentage},${r.Status}`).join("\n");
    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "academic_results.csv";
    a.click();
    showToast("Report exported successfully", "success");
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Academic Analytics</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Review student performance, pass rates, and examination summaries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={filteredResults.length === 0}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm disabled:opacity-50"
          >
            <FiDownload />
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Examination</label>
            <div className="relative">
               <select
                 value={examId}
                 onChange={(e) => setExamId(e.target.value)}
                 className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
               >
                 <option value="">Choose Exam...</option>
                 {exams.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
               </select>
               <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
         </div>

         <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Level</label>
            <div className="relative">
               <select
                 value={classId}
                 onChange={(e) => setClassId(e.target.value)}
                 className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
               >
                 <option value="">All Classes</option>
                 {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
               </select>
               <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
         </div>

         <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section</label>
            <div className="relative">
               <select
                 value={sectionId}
                 onChange={(e) => setSectionId(e.target.value)}
                 disabled={!classId}
                 className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer disabled:opacity-50"
               >
                 <option value="">{classId ? "Select Section" : "Select Class First"}</option>
                 {sections.filter((s) => s.classId?._id === classId || s.classId === classId).map((s) => (
                   <option key={s._id} value={s._id}>{s.name}</option>
                 ))}
               </select>
               <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
         </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Students Assessed" value={summary?.total || 0} icon={<FiUsers />} gradient="from-blue-500 to-blue-600" />
        <MetricCard title="Batch Pass Rate" value={`${passPercentage}%`} icon={<FiBarChart2 />} gradient="from-emerald-500 to-emerald-600" />
        <MetricCard title="Class Topper" value={summary?.topper || "N/A"} icon={<FiAward />} gradient="from-amber-500 to-amber-600" />
        <MetricCard title="Mean Grade Points" value={summary?.average || 0} icon={<FiStar />} gradient="from-purple-500 to-purple-600" />
      </div>

      {/* Results Table Section */}
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/20 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full" />
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Performance Ledger</h3>
           </div>

           <div className="relative w-full lg:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student results..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Student Identity</th>
                <th className="px-8 py-5">Examination</th>
                <th className="px-8 py-5">Aggregate</th>
                <th className="px-8 py-5">Achievement</th>
                <th className="px-8 py-5 text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-50">
                      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-black uppercase tracking-widest">Calculating Analytics...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FiFilter size={24} className="text-slate-300" />
                    </div>
                    <p className="text-lg font-black text-slate-700">No data for selected filters</p>
                    <p className="text-sm font-medium mt-1">Please select an exam, class, and section to view results.</p>
                  </td>
                </tr>
              ) : (
                paginatedResults.map((r: any, index) => (
                  <tr key={index} className="group hover:bg-slate-50/50 transition-colors duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg">
                           {r.studentName.charAt(0)}
                         </div>
                         <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{r.studentName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100/50">
                        {selectedExamName}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-slate-600">{r.totalMarks} <span className="text-[10px] text-slate-400 font-medium">/ {r.maxMarks}</span></td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col gap-1.5 w-32">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                             <span className="text-slate-400">Score</span>
                             <span className="text-indigo-600">{r.percentage}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${r.percentage}%` }} />
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         r.status === "Pass" ? "bg-emerald-100 text-emerald-600 shadow-sm" : "bg-rose-100 text-rose-600 shadow-sm"
                       }`}>
                         {r.status}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {!loading && filteredResults.length > 0 && (
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

export default AdminResultPanel;
