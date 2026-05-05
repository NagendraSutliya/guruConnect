import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { 
  FiUsers, 
  FiSearch, 
  FiChevronDown, 
  FiMail,
  FiPhone,
  FiMapPin,
  FiActivity,
  FiUser,
  FiX,
  FiCalendar,
  FiBriefcase,
  FiHash,
  FiTarget,
  FiHeart,
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

const ViewStudentModal = ({ student, onClose }: { student: any, onClose: () => void }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
        {/* Modal Header */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-violet-600 p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
          >
            <FiX size={18} />
          </button>
          <div className="absolute -bottom-10 left-8">
            <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl">
              <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600 text-3xl font-black">
                {student.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="pt-14 p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800">{student.name}</h2>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mt-1">Roll No: #{student.rollNo}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase">Active</span>
              <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-full uppercase">ID: {student.admissionNo || "N/A"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <SectionTitle icon={FiUser} title="Personal Details" />
              <div className="space-y-4">
                <DetailItem label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"} icon={FiCalendar} />
                <DetailItem label="Gender" value={student.gender || "N/A"} icon={FiActivity} />
                <DetailItem label="Blood Group" value={student.bloodGroup || "N/A"} icon={FiHeart} />
                <DetailItem label="Address" value={student.address || "N/A"} icon={FiMapPin} />
              </div>
            </div>

            <div className="space-y-6">
              <SectionTitle icon={FiUsers} title="Guardian Info" />
              <div className="space-y-4">
                <DetailItem label="Parent Name" value={student.parentName || "N/A"} icon={FiBriefcase} />
                <DetailItem label="Parent Phone" value={student.parentPhone || "N/A"} icon={FiPhone} />
                <DetailItem label="Emergency Contact" value={student.phone || "N/A"} icon={FiActivity} />
                <DetailItem label="Email" value={student.email || "N/A"} icon={FiMail} />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
             <button className="px-6 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all">Download Report</button>
             <button className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title }: any) => (
  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
    <Icon className="text-indigo-600" size={14} />
    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
  </div>
);

const DetailItem = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 p-1.5 bg-slate-50 text-slate-400 rounded-md">
      <Icon size={12} />
    </div>
    <div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
      <p className="text-xs font-bold text-slate-700 mt-0.5">{value}</p>
    </div>
  </div>
);

const TeacherStudentPanel = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewStudent, setViewStudent] = useState<any>(null);
  const [filterMode, setFilterMode] = useState<"CHIPS" | "DROPDOWNS">("CHIPS");

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
        const sectionList = Array.from(sectionMap.values());
        setSections(sectionList);
        if (sectionList.length > 0 && !selectedSectionId) {
          setSelectedSectionId(sectionList[0]._id);
        }
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
    <div className="space-y-0">
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-50/90 via-white/80 to-indigo-100/90 backdrop-blur-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100 mb-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Directory</h1>
          <p className="text-sm text-slate-500 font-medium">Access and manage students in your assigned classes.</p>
        </div>
        <div className="flex items-center gap-3">
         
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cohort</span>
             <span className="text-sm font-bold text-indigo-600">{filteredStudents.length} Records</span>
          </div>
        </div>
      </div>

      {/* Modern High-Density Filters */}
      <div className="card-clean p-6 space-y-2 bg-white/50 backdrop-blur-sm border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-50">
           <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Scope</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Viewing records for your assigned assignments</p>
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
               className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'CHIPS' ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}
             >
               CHIPS
             </button>
             <button 
               onClick={() => setFilterMode("DROPDOWNS")}
               className={`relative z-10 flex-1 text-[9px] font-black transition-colors duration-300 ${filterMode === 'DROPDOWNS' ? 'text-white' : 'text-slate-400 hover:text-slate-600'}`}
             >
               LIST
             </button>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 min-h-[50px] items-center">
          {filterMode === "CHIPS" ? (
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Class Selection Chips */}
              <div className="space-y-3 flex-1">
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
                        selectedClassId === c._id 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-100' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Selection Chips */}
              <div className="space-y-3 flex-1 min-h-[60px]">
                {selectedClassId ? (
                  <div className="animate-fade-in space-y-3">
                    <div className="flex items-center gap-2">
                      <FiHash className="text-slate-400" size={14} />
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sections</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sections.map((s) => (
                        <button
                          key={s._id}
                          onClick={() => setSelectedSectionId(s._id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            selectedSectionId === s._id 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-100' 
                            : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                        >
                          Section {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                   <div className="flex flex-col justify-center h-full opacity-30 pt-6">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FiHash size={14} /> Select a class first
                      </p>
                   </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-fade-in">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiTarget className="text-slate-400" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Academic Class</label>
                </div>
                <div className="relative">
                  <select
                    value={selectedClassId}
                    onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSectionId(""); }}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiHash className="text-slate-400" size={14} />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Sections</label>
                </div>
                <div className="relative">
                  <select
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    disabled={!selectedClassId}
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Records Section */}
      <div className="card-clean overflow-hidden min-h-[400px] flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <FiUsers size={14} />
              <span className="text-xs font-bold uppercase tracking-tight">{filteredStudents.length} Results</span>
           </div>
           <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Quick search by name, roll number, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-lg pl-10 pr-4 py-1 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none"
              />
           </div>          
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing Student Vault...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-40">
             <FiUsers size={64} className="text-slate-100 mb-4" />
             <p className="text-sm font-bold text-slate-400">
               {selectedClassId && selectedSectionId 
                ? "No matching student records found" 
                : "Select a cohort to view students"}
             </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-green-50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Roll No</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Student Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Gender</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Contact Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-indigo-600 px-2 py-1 rounded-lg">{student.rollNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{student.gender || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                          <FiMail size={10} />
                          <span>{student.email || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                          <FiPhone size={10} />
                          <span>{student.phone || student.parentPhone || "—"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setViewStudent(student)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-[10px] font-black text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase tracking-widest shadow-sm"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Student Modal */}
      {viewStudent && (
        <ViewStudentModal 
          student={viewStudent} 
          onClose={() => setViewStudent(null)} 
        />
      )}
    </div>
  );
};


export default TeacherStudentPanel;
