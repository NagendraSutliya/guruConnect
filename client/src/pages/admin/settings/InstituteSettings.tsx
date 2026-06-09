import { useState, useEffect } from "react";
import { 
  MdSettings, 
  MdSave, 
  MdPhotoCamera, 
  MdBusiness, 
  MdPublic, 
  MdPhone, 
  MdMail 
} from "react-icons/md";
import { useToast } from "../../../context/ToastContext";

export default function InstituteSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    instituteName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    tagline: "",
    academicSession: "2024-25"
  });

  useEffect(() => {
    // Load current institute data from localStorage or API
    const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
    setSettings(prev => ({
      ...prev,
      instituteName: adminData.instituteName || "",
      email: adminData.email || ""
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, we would hit an update endpoint
      // await api.put("/admin/institute/settings", settings);
      
      // Update local storage to reflect changes
      const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
      localStorage.setItem("admin", JSON.stringify({ ...adminData, instituteName: settings.instituteName }));
      
      showToast("Institute settings updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update settings", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn">

      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-blue-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdSettings className="text-slate-700" />
            Institute Setup
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Configure your institution's core identity and branding.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
        >
          <MdSave size={20} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-6 group cursor-pointer">
              <div className="w-32 h-32 rounded-[3rem] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center text-slate-300 overflow-hidden">
                <MdBusiness size={64} />
              </div>
              <div className="absolute inset-0 bg-slate-900/40 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <MdPhotoCamera size={24} />
              </div>
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-1">{settings.instituteName || "Your Institute"}</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{settings.tagline || "Tagline goes here"}</p>
            
            <div className="w-full pt-6 border-t border-slate-50 space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <MdMail size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{settings.email || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MdPublic size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</p>
                  <p className="text-xs font-bold text-slate-700">{settings.website || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Official Institute Name</label>
                <div className="relative group">
                  <MdBusiness className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600" />
                  <input 
                    name="instituteName"
                    value={settings.instituteName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Tagline / Motto</label>
                <input 
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Empowering Excellence"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Contact Phone</label>
                <div className="relative group">
                  <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600" />
                  <input 
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Official Website</label>
                <div className="relative group">
                  <MdPublic className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600" />
                  <input 
                    name="website"
                    value={settings.website}
                    onChange={handleChange}
                    placeholder="www.institute.com"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Physical Address</label>
              <textarea 
                name="address"
                rows={3}
                value={settings.address}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-sm"
              />
            </div>

            <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Current Academic Session</label>
                <select 
                  name="academicSession"
                  value={settings.academicSession}
                  onChange={handleChange as any}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                >
                  <option value="2023-24">2023 - 2024</option>
                  <option value="2024-25">2024 - 2025</option>
                  <option value="2025-26">2025 - 2026</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
