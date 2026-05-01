import { useState, useEffect } from "react";
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
} from "react-icons/fi";

const AdminProfile = () => {
  const { user } = useAuth();
  
  const [admin, setAdmin] = useState({
    name: user?.instituteName || "Administrator",
    email: user?.email || "",
    phone: user?.phone || "+91 9876543210",
    role: "Administrator",
    lastLogin: "Active Session",
    profileImage: user?.profileImage || "",
  });

  useEffect(() => {
    if (!user?.email) {
      api.get("/admin/profile")
        .then(res => {
          if (res.data.data) {
            setAdmin(prev => ({
              ...prev,
              name: res.data.data.instituteName,
              email: res.data.data.email
            }));
          }
        })
        .catch(err => console.error("Profile load error:", err));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Profile:", admin);
    alert("Profile changes archived successfully.");
  };

  const avatarLetter = admin?.name?.charAt(0)?.toUpperCase();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md -mx-8 px-8 py-6 border-b border-slate-200/50">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Identity & Security</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage your administrative credentials and institution profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Visual Card */}
        <div className="lg:col-span-1 bg-white/70 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-xl overflow-hidden flex flex-col items-center py-12 px-8 text-center relative">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative group mb-8">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-indigo-200 ring-4 ring-white transition-transform duration-500 group-hover:rotate-6">
              {admin.profileImage ? (
                <img src={admin.profileImage} alt="profile" className="w-full h-full rounded-[2.5rem] object-cover" />
              ) : avatarLetter}
            </div>
            <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-indigo-600 border border-slate-100 hover:scale-110 transition-all active:scale-90">
              <FiCamera size={18} />
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{admin.name}</h3>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mt-1">{admin.role}</p>

          <div className="mt-6 flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
            <FiCheckCircle />
            Verified Authority
          </div>

          <div className="mt-12 w-full pt-8 border-t border-slate-100 flex items-center justify-center gap-8">
             <div className="text-center">
                <p className="text-xl font-black text-slate-800">1.2k</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Students</p>
             </div>
             <div className="w-px h-8 bg-slate-100" />
             <div className="text-center">
                <p className="text-xl font-black text-slate-800">48</p>
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

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;
