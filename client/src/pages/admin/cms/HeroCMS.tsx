import { useState, useEffect } from "react";
import { 
  MdWeb, 
  MdSave, 
  MdImage, 
  MdTextFields, 
  MdPlayArrow,
  MdLayers
} from "react-icons/md";
import { useToast } from "../../../context/ToastContext";
import api from "../../../api/axiosInstance";

export default function HeroCMS() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [heroData, setHeroData] = useState({
    title: "Empowering Tomorrow's Leaders",
    subtitle: "At Gyansthali, we blend traditional values with cutting-edge education technology.",
    button1: "Apply Online",
    button2: "Take a Virtual Tour",
    announcement: "Now Enrolling for 2024-25"
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await api.get('/cms/hero');
        if (response.data.success) {
          setHeroData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchHeroData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post('/cms/update', {
        section: 'hero',
        content: heroData
      });
      if (response.data.success) {
        showToast("Hero content published successfully!", "success");
      }
    } catch (error) {
      showToast("Failed to update content", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn relative">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdWeb className="text-indigo-600" />
            Hero Banner CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage the main landing section of your school website.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
        >
          <MdSave size={20} />
          {loading ? "Updating..." : "Publish Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdTextFields size={16} className="text-indigo-500" />
              Content Configuration
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Main Headline</label>
                <textarea 
                  value={heroData.title}
                  onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Description Subtext</label>
                <textarea 
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Primary Button</label>
                  <input 
                    value={heroData.button1}
                    onChange={(e) => setHeroData({...heroData, button1: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Secondary Button</label>
                  <input 
                    value={heroData.button2}
                    onChange={(e) => setHeroData({...heroData, button2: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Announcement Badge</label>
                <input 
                  value={heroData.announcement}
                  onChange={(e) => setHeroData({...heroData, announcement: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdImage size={16} className="text-indigo-500" />
              Hero Media
            </div>
            
            <div className="relative group cursor-pointer aspect-video rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-300">
              <img 
                src="/school_hero_bg_1777796364606.png" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                alt="Current Hero"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <MdImage size={32} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Replace Image</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-3 mb-2">
                <MdLayers className="text-indigo-600" size={18} />
                <span className="text-xs font-black text-indigo-900 uppercase">Layer Settings</span>
              </div>
              <p className="text-[10px] text-indigo-400 font-medium leading-relaxed">
                Background image should be high-resolution (min 1920x1080) for the best cinematic effect.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-lg mb-2">Live Preview</h4>
            <p className="text-slate-400 text-xs mb-6">See how your changes look in real-time on the public site.</p>
            <a 
              href="http://localhost:5174" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
            >
              <MdPlayArrow size={24} />
              <span className="font-bold text-sm">Open Website</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
