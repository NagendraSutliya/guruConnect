import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiShield, FiEdit2, FiSave, FiX, FiCheckCircle, FiUser, FiMail, FiPhone, FiMapPin, FiAward, FiHash } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";

const StudentProfilePanel = () => {
  const { showToast } = useToast();
  const { user, setUser } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [institute, setInstitute] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "+91 98765 43210",
    address: user?.address || "Primary Residence",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/student/dashboard");
      const data = res.data.data;
      setStudent(data);
      setFormData({
        name: data?.name || "",
        phone: data?.phone || "",
        address: data?.address || "",
      });
      if (data?.instituteId) {
        const instRes = await api.get(`/public/institute/${data.instituteId}`);
        setInstitute(instRes.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await api.put("/student/profile", formData);
      if (res.data.success) {
        setStudent(res.data.data);
        setUser({ ...user, ...res.data.data });
        setIsEditing(false);
        showToast("Profile updated successfully", "success");
      }
    } catch (err) {
      showToast("Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 pb-12 animate-fade-in">
      
      {/* 1. SYNCED STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-xl rounded-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 shadow-sm">
        <div>
           <h1 className="text-xl font-black text-blue-700 tracking-tight leading-none">Identity Hub</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">Academic Credentials & Personal Data</p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center gap-2"
            >
              <FiEdit2 size={12} /> Edit Identity
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                <FiX className="inline mr-1" /> Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <FiSave size={12} /> {loading ? "Syncing..." : "Commit Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        
        {/* Left: Identity Node */}
        <div className="lg:col-span-1 space-y-4">
           <div className="card-clean p-8 bg-white border-slate-200 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />
              
              <div className="w-28 h-28 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-4xl font-black mx-auto border-4 border-white shadow-xl shadow-indigo-500/10 group-hover:scale-105 transition-transform duration-500">
                 {student?.name?.substring(0, 1).toUpperCase() || "S"}
              </div>

              <div className="text-center mt-6">
                 <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                    {student?.name}
                 </h3>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mt-3 border border-blue-100">
                    Active Student
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-50">
                 <div className="text-center">
                    <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{student?.rollNo || "00"}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Roll Code</p>
                 </div>
                 <div className="text-center border-l border-slate-50">
                    <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">{student?.classId?.name || "N/A"}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Academic Node</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                       <FiShield size={20} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black tracking-tight uppercase">Compliance Node</h4>
                       <p className="text-emerald-400 text-[9px] font-bold uppercase tracking-widest mt-1">Status: Verified</p>
                    </div>
                 </div>
                 <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
                    Your digital identity is cryptographically synced with the institution's core registry for all academic transactions.
                 </p>
                 <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    <FiCheckCircle size={14} /> Global Sync Active
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
           </div>
        </div>

        {/* Right: Technical Specifications */}
        <div className="lg:col-span-2 space-y-4">
           <div className="card-clean p-6 bg-white border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-2 h-2 rounded-full bg-indigo-600" />
                 <h3 className="bg-blue-500 rounded-full px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">Registry Data</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                    { label: "Legal Designation", val: student?.name, icon: FiUser, editKey: "name" },
                    { label: "Institutional Email", val: student?.email, icon: FiMail, disabled: true },
                    { label: "Contact Vector", val: formData.phone, icon: FiPhone, editKey: "phone" },
                    { label: "Campus Section", val: `Section ${student?.sectionId?.name || "A"}`, icon: FiHash, disabled: true },
                    { label: "Current HQ", val: formData.address, icon: FiMapPin, editKey: "address", full: true },
                    { label: "Institutional Node", val: institute?.instituteName || "Primary Institute", icon: FiAward, disabled: true, full: true },
                 ].map((field, fIdx) => (
                    <div key={fIdx} className={`space-y-1.5 ${field.full ? 'md:col-span-2' : ''}`}>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                          <field.icon size={12} className="text-slate-300" /> {field.label}
                       </label>
                       {isEditing && !field.disabled ? (
                          <input
                             type="text"
                             value={(formData as any)[field.editKey!]}
                             onChange={(e) => setFormData({ ...formData, [field.editKey!]: e.target.value })}
                             className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                          />
                       ) : (
                          <div className={`p-4 rounded-2xl text-sm font-black border transition-all ${field.disabled ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' : 'bg-white border-slate-100 text-slate-700 shadow-sm'}`}>
                             {field.val}
                          </div>
                       )}
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-600/20 transition-all duration-500">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <h3 className="text-xl font-black tracking-tight leading-none uppercase">ID Export Node</h3>
                    <p className="text-indigo-100 text-xs mt-2 font-medium tracking-wide">
                       Generate and download your verified Student Identification Token for physical authentication.
                    </p>
                 </div>
                 <button className="bg-white text-indigo-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95 whitespace-nowrap">
                    Download Smart ID
                 </button>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-all duration-700" />
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePanel;
