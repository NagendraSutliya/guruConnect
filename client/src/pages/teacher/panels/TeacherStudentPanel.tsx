import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiChevronDown, 
  FiMoreVertical,
  FiMail,
  FiPhone,
  FiMapPin,
  FiActivity
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

const TeacherStudentPanel = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/teacher/assignments/my").then(res => {
      const assignments = res.data.data || [];
      const classMap = new Map();
      assignments.forEach((a: any) => {
        if (a.classId) classMap.set(a.classId._id, a.classId);
      });
      setClasses(Array.from(classMap.values()));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      api.get("/teacher/assignments/my").then(res => {
        const assignments = res.data.data || [];
        const sectionMap = new Map();
        assignments.forEach((a: any) => {
          if (a.classId?._id === selectedClassId && a.sectionId) {
            sectionMap.set(a.sectionId._id, a.sectionId);
          }
        });
        setSections(Array.from(sectionMap.values()));
      }).catch(console.error);
    } else {
      setSections([]);
    }
  }, [selectedClassId]);

  const loadStudents = async () => {
    if (!selectedClassId || !selectedSectionId) return;
    setLoading(true);
    try {
      const res = await api.get("/student/by-class", {
        params: { classId: selectedClassId, sectionId: selectedSectionId }
      });
      setStudents(res.data.data || []);
    } catch (err) {
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedClassId, selectedSectionId]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo?.toString().includes(search)
    );
  }, [students, search]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Directory</h1>
          <p className="text-sm text-slate-500 font-medium">Access and manage students in your assigned classes.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Cohort</span>
           <span className="text-sm font-bold text-slate-800">{filteredStudents.length} Students</span>
        </div>
      </div>

      {/* Professional Filters */}
      <div className="card-clean p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSectionId(""); }}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Class</option>
              {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              disabled={!selectedClassId}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-[var(--primary)] transition-all appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="">Select Section</option>
              {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="w-full md:w-80 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:border-[var(--primary)] transition-all outline-none"
          />
        </div>
      </div>

      {/* Compact Student Cards */}
      <div className="relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fetching Records...</p>
          </div>
        )}

        {filteredStudents.length === 0 ? (
          <div className="card-clean p-20 text-center flex flex-col items-center border-dashed">
             <FiUsers size={48} className="text-slate-200 mb-4" />
             <p className="text-sm font-bold text-slate-400">Select class and section to view students</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStudents.map((student) => (
              <div key={student._id} className="card-clean p-4 hover:border-[var(--primary)]/30 transition-all group relative">
                <div className="flex items-start justify-between mb-4">
                   <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200 shadow-sm group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                      {student.name.substring(0, 2).toUpperCase()}
                   </div>
                   <button className="p-1 hover:bg-slate-50 rounded text-slate-400">
                      <FiMoreVertical size={14} />
                   </button>
                </div>

                <div className="space-y-1">
                   <h3 className="text-sm font-bold text-slate-800 truncate">{student.name}</h3>
                   <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">Roll: #{student.rollNo}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                      <FiMail className="shrink-0" size={12} />
                      <span className="truncate">{student.email || "No email"}</span>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                      <FiPhone className="shrink-0" size={12} />
                      <span>{student.phone || "No phone"}</span>
                   </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                   <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Active</span>
                   <button className="text-[10px] font-bold text-slate-400 hover:text-[var(--primary)] transition-colors uppercase tracking-widest">View Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudentPanel;
