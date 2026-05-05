import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdTextFields, 
  MdStars,
  MdPlayArrow,
  MdTrendingUp,
  MdEmojiEvents
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import type { AchievementData } from "../../../types/admin/cms";

export default function AchievementsCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [achievementsData, setAchievementsData] = useState<AchievementData>({
    bannerTitle: "Our Hall of Fame",
    bannerSubtitle: "Celebrating the exceptional milestones of our students and the institution's commitment to excellence.",
    stats: [
      { label: "Board Results", value: "100%", sub: "Passing Rate" },
      { label: "State Toppers", value: "25+", sub: "In Last 5 Years" },
      { label: "Sports Trophies", value: "150+", sub: "Inter-School Wins" },
      { label: "Global Alumni", value: "2.5k+", sub: "In Elite Universities" }
    ],
    toppers: [
      { name: "Rahul Singh", score: "98.8%", class: "Class XII - Science", rank: "District Rank 1" },
      { name: "Sanya Malhotra", score: "98.2%", class: "Class XII - Commerce", rank: "District Rank 3" },
      { name: "Aryan Verma", score: "97.5%", class: "Class X", rank: "City Rank 1" }
    ],
    awards: [
      { award: "Best Innovation in STEM", body: "National Edu Council 2025" },
      { award: "Cleanest Campus Award", body: "City Municipal Board 2024" },
      { award: "Excellence in Digital Learning", body: "Global Tech Summit 2026" },
    ],
    bannerImage: "/images/redesign/achievements_banner.png"
  });

  useEffect(() => {
    const fetchAchievementsData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/achievements');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          const cleanData: any = {};
          
          Object.keys(incoming).forEach(key => {
            const val = incoming[key];
            if (Array.isArray(val)) {
              const cleanArray = val.filter(item => {
                if (typeof item === 'object') {
                  return Object.values(item).some(v => v !== "" && v !== null);
                }
                return item !== "" && item !== null;
              });
              if (cleanArray.length > 0) cleanData[key] = cleanArray;
            } else if (val && val !== "") {
              cleanData[key] = val;
            }
          });
          
          setAchievementsData(prev => ({ ...prev, ...cleanData }));
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
              {(achievementsData?.stats || []).map((stat, index) => (
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

          {/* Academic Toppers */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdStars size={16} className="text-indigo-500" />
              Academic Toppers (Hall of Fame)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(achievementsData.toppers || []).map((topper, index) => (
                <div key={index} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xl font-black text-indigo-500 mx-auto">
                    {topper.name?.charAt(0)}
                  </div>
                  <div className="space-y-3">
                    <input 
                      value={topper.name}
                      onChange={(e) => {
                        const newToppers = [...achievementsData.toppers];
                        newToppers[index].name = e.target.value;
                        setAchievementsData({...achievementsData, toppers: newToppers});
                      }}
                      placeholder="Student Name"
                      className="w-full bg-transparent border-none outline-none font-black text-slate-800 text-sm text-center"
                    />
                    <input 
                      value={topper.score}
                      onChange={(e) => {
                        const newToppers = [...achievementsData.toppers];
                        newToppers[index].score = e.target.value;
                        setAchievementsData({...achievementsData, toppers: newToppers});
                      }}
                      placeholder="Score (e.g. 98%)"
                      className="w-full bg-transparent border-none outline-none font-black text-indigo-600 text-lg text-center"
                    />
                    <div className="space-y-1">
                      <input 
                        value={topper.class}
                        onChange={(e) => {
                          const newToppers = [...achievementsData.toppers];
                          newToppers[index].class = e.target.value;
                          setAchievementsData({...achievementsData, toppers: newToppers});
                        }}
                        placeholder="Class/Stream"
                        className="w-full bg-transparent border-none outline-none font-bold text-slate-500 text-[9px] uppercase tracking-widest text-center"
                      />
                      <input 
                        value={topper.rank}
                        onChange={(e) => {
                          const newToppers = [...achievementsData.toppers];
                          newToppers[index].rank = e.target.value;
                          setAchievementsData({...achievementsData, toppers: newToppers});
                        }}
                        placeholder="Rank info"
                        className="w-full bg-transparent border-none outline-none font-black text-indigo-400 text-[8px] uppercase tracking-widest text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Awards */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdEmojiEvents size={16} className="text-indigo-500" />
              Institutional Recognition
            </div>

            <div className="space-y-4">
              {(achievementsData.awards || []).map((award, index) => (
                <div key={index} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group">
                  <MdEmojiEvents className="text-indigo-500 text-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <input 
                      value={award.award}
                      onChange={(e) => {
                        const newAwards = [...achievementsData.awards];
                        newAwards[index].award = e.target.value;
                        setAchievementsData({...achievementsData, awards: newAwards});
                      }}
                      placeholder="Award Name"
                      className="w-full bg-transparent border-none outline-none font-black text-slate-800 text-xs"
                    />
                    <input 
                      value={award.body}
                      onChange={(e) => {
                        const newAwards = [...achievementsData.awards];
                        newAwards[index].body = e.target.value;
                        setAchievementsData({...achievementsData, awards: newAwards});
                      }}
                      placeholder="Awarding Body/Year"
                      className="w-full bg-transparent border-none outline-none font-bold text-slate-500 text-[10px]"
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
