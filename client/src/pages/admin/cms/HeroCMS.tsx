import { useState, useEffect } from "react";
import { 
  MdWeb, 
  MdSave, 
  MdImage, 
  MdTextFields, 
  MdNotificationsActive,
  MdLayers,
  MdPlayArrow
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import type { HeroData } from "../../../types/admin/cms";

export default function HeroCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [heroData, setHeroData] = useState<HeroData>({
    title: "Empowering Minds, Shaping Tomorrow's Leaders",
    subtitle: "At Gyansthali Edu, we blend traditional values with cutting-edge digital innovation to provide a holistic learning experience that prepares students for the challenges of a global future.",
    button1: "Apply Online",
    button2: "Explore Campus",
    announcement: "Now Enrolling for 2026-27",
    backgroundImage: "/images/redesign/hero.png"
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/hero');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          const cleanData: any = {};
          Object.keys(incoming).forEach(key => {
            if (incoming[key] && incoming[key] !== "") {
              cleanData[key] = incoming[key];
            }
          });
          setHeroData(prev => ({ ...prev, ...cleanData }));
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setFetching(false);
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
        alert("Hero content published successfully!");
      }
    } catch (error) {
      alert("Failed to update content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdWeb className="text-indigo-600" />
            Hero Banner CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage the first impression of your school website.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading || fetching}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
        >
          <MdSave size={20} />
          {loading ? "Updating..." : "Publish Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Announcement Configuration */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdNotificationsActive size={16} className="text-indigo-500" />
              Announcement Badge
            </div>

            {fetching ? (
              <div className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Headline Text</label>
                <input 
                  value={heroData.announcement}
                  onChange={(e) => setHeroData({...heroData, announcement: e.target.value})}
                  placeholder="e.g. Now Enrolling for 2026-27"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-indigo-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            )}
          </div>

          {/* Core Content Configuration */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdTextFields size={16} className="text-indigo-500" />
              Main Content
            </div>

            {fetching ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-20 bg-slate-100 rounded-2xl w-full" />
                <div className="h-32 bg-slate-100 rounded-2xl w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Main Headline</label>
                  <textarea 
                    value={heroData.title}
                    onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-2xl leading-tight"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Sub-headline Description</label>
                  <textarea 
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Button Configuration */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdLayers size={16} className="text-indigo-500" />
              Primary Actions
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Button 01 Text</label>
                <input 
                  value={heroData.button1}
                  onChange={(e) => setHeroData({...heroData, button1: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Button 02 Text</label>
                <input 
                  value={heroData.button2}
                  onChange={(e) => setHeroData({...heroData, button2: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-xs"
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
              Hero Background
            </div>
            
            <div className="relative group aspect-[4/3] rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-300">
              <img 
                src={heroData.backgroundImage || "/images/redesign/hero.png"} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                alt="Current Hero"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
                <MdImage size={32} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Change Image URL Below</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image Source URL</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={heroData.backgroundImage || ""}
                  onChange={(e) => setHeroData({...heroData, backgroundImage: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-700 text-xs focus:bg-white focus:border-indigo-500 transition-all outline-none"
                />
                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                  Browse
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-3 mb-2">
                <MdLayers className="text-indigo-600" size={18} />
                <span className="text-xs font-black text-indigo-900 uppercase">Guidelines</span>
              </div>
              <p className="text-[10px] text-indigo-400 font-medium leading-relaxed">
                Use a high-resolution wide-angle shot. Supports JPG, PNG, WEBP. Ideal size: 1920x1080px.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-lg mb-2">Live Preview</h4>
            <p className="text-slate-400 text-xs mb-6">Verify your changes on the public landing page.</p>
            <a 
              href={import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
            >
              <MdPlayArrow size={24} />
              <span className="font-bold text-sm">Open Website Home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
