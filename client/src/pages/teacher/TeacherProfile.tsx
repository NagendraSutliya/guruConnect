import { useAuth } from "../../context/AuthContext";
import { FiEdit2, FiSave, FiTrash2, FiCamera } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useToast } from "../../context/ToastContext";

const TeacherProfile = () => {
  const { showToast } = useToast();
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    designation: user?.designation || "",
    qualification: user?.qualification || "",
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/teacher/profile");
        if (res.data.success) {
          const profileData = res.data.data;
          const updatedUser = { ...user, ...profileData };
          setUser(updatedUser);
          localStorage.setItem("teacher", JSON.stringify(updatedUser));
          
          setFormData({
            name: profileData.name || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
            designation: profileData.designation || "",
            qualification: profileData.qualification || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    
    if (user?._id) {
      fetchProfile();
    }
  }, [user?._id]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await api.put("/teacher/profile", formData);
      if (res.data.success) {
        const updatedUser = { ...user, ...res.data.data };
        setUser(updatedUser);
        localStorage.setItem("teacher", JSON.stringify(updatedUser));
        setIsEditing(false);
        showToast("Profile credentials updated!", "success");
      }
    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append("file", file);

      const uploadRes = await api.post("/upload/single", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (uploadRes.data.success) {
        const imageUrl = uploadRes.data.data.url;
        const res = await api.patch("/teacher/profile/image", { image: imageUrl });
        if (res.data.success) {
          const updatedUser = { ...user, profileImage: imageUrl };
          setUser(updatedUser);
          localStorage.setItem("teacher", JSON.stringify(updatedUser));
          showToast("Profile image synchronized!", "success");
        }
      }
    } catch (err) {
      showToast("Sync failed: Image upload error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("Remove profile image? This cannot be undone.")) return;
    try {
      setLoading(true);
      const res = await api.patch("/teacher/profile/image", { image: "" });
      if (res.data.success) {
        const updatedUser = { ...user, profileImage: "" };
        setUser(updatedUser);
        localStorage.setItem("teacher", JSON.stringify(updatedUser));
        showToast("Profile image removed", "success");
      }
    } catch (err) {
      showToast("Failed to remove image", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-4 animate-fade-in">

      {/* Header Section */}
      <div className="bg-gradient-to-r from-sky-300/95 to-sky-100/95 backdrop-blur-md border-b border-sky-200 rounded-2xl p-4 -mx-4 shadow-sm flex items-center">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-2 h-6 bg-sky-600 rounded-full shadow-sm" />
             Faculty Profile
          </h2>
      </div>
       
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4">
        
        {/* Profile Identity (Left) */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div className="bg-white rounded-[2rem] p-10 text-center relative overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 group h-full flex flex-col justify-center">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 to-indigo-500" />
            
            {/* Professional Image Section */}
            <div className="relative w-36 h-36 mx-auto mb-6">
               <div className="w-full h-full rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-4xl font-black text-slate-400 border-4 border-white shadow-2xl overflow-hidden relative group/image ring-8 ring-slate-50">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110" />
                  ) : (
                    <span>{user?.name?.substring(0, 2).toUpperCase()}</span>
                  )}

                  {/* High-End Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover/image:opacity-100 transition-all duration-300">
                     <button 
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        className="w-10 h-10 rounded-full bg-white text-sky-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all"
                        title="Change Photo"
                     >
                        <FiCamera size={18} />
                     </button>
                     {user?.profileImage && (
                        <button 
                           onClick={handleRemoveImage}
                           className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all"
                           title="Remove Photo"
                        >
                           <FiTrash2 size={18} />
                        </button>
                     )}
                  </div>

                  {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                       <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
               </div>
               
               <input 
                  type="file" 
                  id="avatar-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
               />
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h3>
            <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em] mt-1 mb-4">
              {user?.designation || "Senior Faculty Member"}
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xl font-black text-slate-800 leading-none">
                     {new Date(user?.createdAt || Date.now()).getFullYear()}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Joined Year</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xl font-black text-emerald-500 leading-none capitalize">
                     {user?.status || "Active"}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Account Status</p>
               </div>
            </div>
          </div>

        </div>

        {/* Professional Specs (Right) */}
        <div className="lg:col-span-8 flex flex-col h-full">
           <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 h-full flex flex-col justify-center">
              <div className="flex justify-end items-center mb-6">
                 <div className="flex items-center gap-3">
                    {!isEditing ? (
                       <button 
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-2 bg-sky-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 group border border-transparent"
                       >
                          <FiEdit2 size={14} className="group-hover:rotate-12 transition-transform" />
                          Modify Profile
                       </button>
                    ) : (
                       <div className="flex items-center gap-3 animate-slide-in-right">
                          <button 
                             onClick={() => setIsEditing(false)}
                             className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
                          >
                             Discard
                          </button>
                          <button 
                             onClick={handleUpdate}
                             disabled={loading}
                             className="px-6 py-2 bg-sky-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-700 transition-all shadow-xl shadow-sky-200 flex items-center gap-2 border border-transparent"
                          >
                             {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={14} />}
                             Commit Changes
                          </button>
                       </div>
                    )}
                 </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" /> 
                    Credential Matrix
                 </h3>
                 <div className="text-[10px] font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-full uppercase tracking-widest border border-sky-100">
                    ID: {user?._id?.substring(0, 8).toUpperCase() || "TEMP_NODE"}
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                       Name
                       {isEditing && <div className="w-1 h-1 rounded-full bg-sky-500" />}
                    </label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-700 outline-none focus:border-sky-500/30 focus:bg-white transition-all shadow-inner"
                      />
                    ) : (
                      <div className="w-full h-12 flex items-center px-5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 group-hover:bg-white group-hover:shadow-lg transition-all">{user?.name}</div>
                    )}
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Mail</label>
                    <div className="w-full h-12 flex items-center px-5 bg-slate-100/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed">
                       {user?.email}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        placeholder="e.g. Senior Mathematics Faculty"
                        value={formData.designation}
                        onChange={(e) => setFormData({...formData, designation: e.target.value})}
                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-700 outline-none focus:border-sky-500/30 focus:bg-white transition-all shadow-inner"
                      />
                    ) : (
                      <div className="w-full h-12 flex items-center px-5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 group-hover:bg-white group-hover:shadow-lg transition-all">{user?.designation || "Not Specified"}</div>
                    )}
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qualifications</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        placeholder="e.g. M.Sc, PhD"
                        value={formData.qualification}
                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-700 outline-none focus:border-sky-500/30 focus:bg-white transition-all shadow-inner"
                      />
                    ) : (
                      <div className="w-full h-12 flex items-center px-5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 group-hover:bg-white group-hover:shadow-lg transition-all">{user?.qualification || "Pending Verification"}</div>
                    )}
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Vector</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-700 outline-none focus:border-sky-500/30 focus:bg-white transition-all shadow-inner"
                      />
                    ) : (
                      <div className="w-full h-12 flex items-center px-5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 group-hover:bg-white group-hover:shadow-lg transition-all">{user?.phone || "+91 XXXXX XXXXX"}</div>
                    )}
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary HQ / Address</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full h-12 bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-700 outline-none focus:border-sky-500/30 focus:bg-white transition-all shadow-inner"
                      />
                    ) : (
                      <div className="w-full h-12 flex items-center px-5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 group-hover:bg-white group-hover:shadow-lg transition-all">{user?.address || "Gyansthali Main Campus"}</div>
                    )}
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default TeacherProfile;
