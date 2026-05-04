import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdTextFields, 
  MdStars,
  MdPlayArrow,
  MdTrendingUp
} from "react-icons/md";
import api from "../../../api/axiosInstance";

export default function AchievementsCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [achievementsData, setAchievementsData] = useState({
    bannerTitle: "",
    bannerSubtitle: "",
    stats: [
      { label: "", value: "", sub: "" },
      { label: "", value: "", sub: "" },
      { label: "", value: "", sub: "" },
      { label: "", value: "", sub: "" }
    ],
    toppers: [
      { name: "", score: "", class: "", rank: "" },
      { name: "", score: "", class: "", rank: "" },
      { name: "", score: "", class: "", rank: "" }
    ]
  });

  useEffect(() => {
    const fetchAchievementsData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/achievements');
        if (response.data.success) {
          setAchievementsData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching achievements data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchAchievementsData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post('/cms/update', {
        section: 'achievements',
        content: achievementsData
      });
      if (response.data.success) {
        alert("Achievements content published successfully!");
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
            <MdStars className="text-indigo-600" />
            Hall of Fame CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage student achievements and success metrics.</p>
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
          
          {/* Banner Configuration */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdTextFields size={16} className="text-indigo-500" />
              Banner Configuration
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Banner Title</label>
                <input 
                  value={achievementsData.bannerTitle}
                  onChange={(e) => setAchievementsData({...achievementsData, bannerTitle: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Banner Subtitle</label>
                <textarea 
                  value={achievementsData.bannerSubtitle}
                  onChange={(e) => setAchievementsData({...achievementsData, bannerSubtitle: e.target.value})}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Success Stats */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdTrendingUp size={16} className="text-indigo-500" />
              Success Metrics
            </div>

            <div className="grid grid-cols-2 gap-6">
              {achievementsData.stats.map((stat, index) => (
                <div key={index} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <input 
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...achievementsData.stats];
                      newStats[index].value = e.target.value;
                      setAchievementsData({...achievementsData, stats: newStats});
                    }}
                    placeholder="e.g. 100%"
                    className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 font-black text-indigo-600 text-lg outline-none focus:border-indigo-500"
                  />
                  <div className="space-y-2">
                    <input 
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...achievementsData.stats];
                        newStats[index].label = e.target.value;
                        setAchievementsData({...achievementsData, stats: newStats});
                      }}
                      placeholder="Label"
                      className="w-full bg-transparent border-none outline-none font-bold text-slate-800 text-[10px] uppercase tracking-widest"
                    />
                    <input 
                      value={stat.sub}
                      onChange={(e) => {
                        const newStats = [...achievementsData.stats];
                        newStats[index].sub = e.target.value;
                        setAchievementsData({...achievementsData, stats: newStats});
                      }}
                      placeholder="Subtext"
                      className="w-full bg-transparent border-none outline-none font-medium text-slate-500 text-[9px] uppercase tracking-widest"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Media & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdImage size={16} className="text-indigo-500" />
              Achievement Assets
            </div>
            
            <div className="space-y-6">
              <div className="relative group cursor-pointer aspect-video rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-300">
                <img 
                  src="/images/redesign/achievements_banner.png" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <MdImage size={32} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Replace Banner</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-lg mb-2">Live Preview</h4>
            <p className="text-slate-400 text-xs mb-6">Verify your changes on the public achievements page.</p>
            <a 
              href="http://localhost:5174/achievements" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
            >
              <MdPlayArrow size={24} />
              <span className="font-bold text-sm">Open Hall of Fame</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
