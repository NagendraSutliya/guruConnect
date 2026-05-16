import { useState, useEffect, useRef } from "react";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiClock,
  FiCamera,
  FiSave,
  FiCheckCircle,
  FiLoader,
  FiTrash2,
} from "react-icons/fi";
import { useToast } from "../../context/ToastContext";

const AdminProfile = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [admin, setAdmin] = useState({
    name: user?.instituteName || "Administrator",
    email: user?.email || "",
    phone: "",
    role: "Administrator",
    lastLogin: "Active Session",
    profileImage: "",
    studentCount: 0,
    teacherCount: 0,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/admin/profile")
      .then(res => {
        const data = res.data.data;
        if (data) {
          setAdmin(prev => ({
            ...prev,
            name: data.instituteName,
            email: data.email,
            phone: data.phone || "+91 9876543210",
            profileImage: data.logoUrl || "",
            studentCount: data.studentCount || 0,
            teacherCount: data.teacherCount || 0,
          }));
        }
      })
      .catch(err => console.error("Profile load error:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const imageUrl = res.data.data.url;

      // Update in DB
      await api.patch("/admin/profile/logo", { logoUrl: imageUrl });

      setAdmin(prev => ({ ...prev, profileImage: imageUrl }));
      
      // Update Navbar sync
      const saved = localStorage.getItem("admin");
      const currentUser = saved ? JSON.parse(saved) : {};
      localStorage.setItem("admin", JSON.stringify({ ...currentUser, logoUrl: imageUrl }));

      showToast("Profile image updated successfully", "success");
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploading(true);
      await api.patch("/admin/profile/logo", { logoUrl: "" });
      
      setAdmin(prev => ({ ...prev, profileImage: "" }));

      // Update Navbar sync
      const saved = localStorage.getItem("admin");
      const currentUser = saved ? JSON.parse(saved) : {};
      localStorage.setItem("admin", JSON.stringify({ ...currentUser, logoUrl: "" }));

      showToast("Profile image removed", "success");
    } catch (err) {
      console.error("Remove error:", err);
      showToast("Failed to remove image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      await api.patch("/admin/profile", {
        name: admin.name,
        phone: admin.phone
      });

      // Update local storage so navbar/sidebar names update
      const saved = localStorage.getItem("admin");
      const currentUser = saved ? JSON.parse(saved) : {};
      localStorage.setItem("admin", JSON.stringify({ 
        ...currentUser, 
        instituteName: admin.name 
      }));

      showToast("Profile updated successfully", "success");
    } catch (err) {
      console.error("Save error:", err);
      showToast("Failed to save changes", "error");
    } finally {
      setUploading(false);
    }
  };

  const avatarLetter = admin?.name?.charAt(0)?.toUpperCase();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
        {/* Profile Visual Card */}
        <div className="lg:col-span-1 bg-white/70 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-xl overflow-hidden flex flex-col items-center py-12 px-8 text-center relative">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative group mb-8">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-indigo-200 ring-4 ring-white transition-transform duration-500 group-hover:rotate-6 overflow-hidden relative">
              {admin.profileImage ? (
                <img src={admin.profileImage} alt="profile" className="w-full h-full object-cover" />
              ) : avatarLetter}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2.5 bg-white/20 hover:bg-white/40 rounded-xl text-white transition-colors"
                  title="Change Photo"
                >
                  <FiCamera size={20} />
                </button>
                {admin.profileImage && (
                  <button 
                    onClick={handleRemoveImage}
                    disabled={uploading}
                    className="p-2.5 bg-rose-500/20 hover:bg-rose-500/40 rounded-xl text-rose-200 transition-colors"
                    title="Remove Photo"
                  >
                    <FiTrash2 size={20} />
                  </button>
                )}
              </div>

              {uploading && (
                <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center backdrop-blur-sm z-20">
                  <FiLoader className="text-white animate-spin" size={32} />
                </div>
              )}
            </div>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{admin.name}</h3>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mt-1">{admin.role}</p>

          <div className="mt-6 flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
            <FiCheckCircle />
            Verified Authority
          </div>

          <div className="mt-12 w-full pt-8 border-t border-slate-100 flex items-center justify-center gap-8">
             <div className="text-center">
                <p className="text-xl font-black text-slate-800">{admin.studentCount}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Students</p>
             </div>
             <div className="w-px h-8 bg-slate-100" />
             <div className="text-center">
                <p className="text-xl font-black text-slate-800">{admin.teacherCount}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Faculty</p>
             </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-xl p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <FiShield size={120} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institute Branding</label>
              <div className="relative group">
                <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={admin.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrative Email</label>
              <div className="relative group opacity-60">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={admin.email}
                  disabled
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Direct Contact</label>
              <div className="relative group">
                <FiPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  name="phone"
                  value={admin.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Privilege</label>
              <div className="relative group opacity-60">
                <FiShield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={admin.role}
                  disabled
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-[2rem] flex items-center justify-between text-white shadow-xl shadow-slate-200">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400">
                  <FiClock />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Connectivity</p>
                   <p className="text-xs font-bold">{admin.lastLogin}</p>
                </div>
             </div>
             <div className="px-4 py-1.5 bg-indigo-500 rounded-xl text-[9px] font-black uppercase tracking-widest">
                System Online
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
              <FiSave />
              Update Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
