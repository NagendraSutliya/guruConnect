import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import {  FiShield, FiEdit2, FiSave, FiX, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const StudentProfile = () => {
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
      setStudent(res.data.data);
      if (res.data.data?.instituteId) {
        const instRes = await api.get(`/public/institute/${res.data.data.instituteId}`);
        setInstitute(instRes.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      // Assuming a similar endpoint exists or will be added
      const res = await api.put("/student/profile", formData);
      if (res.data.success) {
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
    <div className="space-y-6 pb-8 animate-fade-in">

      {/* Neat Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Student Profile</h2>
          <p className="text-xs text-slate-500 font-medium">Manage your academic identity and personal credentials.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <FiEdit2 size={14} /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                <FiX className="inline mr-1" /> Cancel
              </button>
              <button 
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <FiSave size={14} /> {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Identity Hub */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-clean p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-2 bg-indigo-600" />
            
            <div className="w-24 h-24 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl font-bold mx-auto border-4 border-white shadow-sm mb-6">
              {student?.name?.substring(0, 1).toUpperCase() || "S"}
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{student?.name}</h3>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
              Active Student Hub
            </p>
            
            <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
               <div>
                  <p className="text-base font-bold text-slate-800">{student?.rollNo || "00"}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Roll Number</p>
               </div>
               <div>
                  <p className="text-base font-bold text-slate-800">{student?.classId?.name || "N/A"}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Grade Node</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
                   <FiShield size={16} />
                </div>
                <h4 className="text-sm font-bold tracking-tight">Institutional Compliance</h4>
                <p className="text-slate-400 text-[11px] mt-2 leading-relaxed font-medium">
                   Your student account is verified and synced with the central institutional repository.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                   <FiCheckCircle size={12} /> Sync Active
                </div>
             </div>
          </div>
        </div>

        {/* Right: Technical Specs */}
        <div className="lg:col-span-2 space-y-6">
           <div className="card-clean p-8">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Academic Specifications
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500/30 transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">{student?.name}</div>
                    )}
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Registered Email</label>
                    <div className="p-3 bg-slate-100/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed">
                       {student?.email}
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Institutional Node</label>
                    <div className="p-3 bg-indigo-50/30 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-600 uppercase tracking-widest">
                       {institute?.instituteName || "Nexus Institute"}
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Section</label>
                    <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 uppercase tracking-widest">
                       Section {student?.sectionId?.name || "A"}
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Vector</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500/30 transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">{formData.phone}</div>
                    )}
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Primary HQ</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500/30 transition-all"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">{formData.address}</div>
                    )}
                 </div>
              </div>
           </div>

           <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <h3 className="text-lg font-bold tracking-tight">Identity Verification</h3>
                    <p className="text-indigo-100 text-xs mt-1 font-medium">Your profile is currently synced with the institutional database.</p>
                 </div>
                 <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 whitespace-nowrap">
                    Download Student ID
                 </button>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-all" />
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
