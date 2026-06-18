import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdPlayArrow,
  MdEmojiEvents,
  MdStars,
  MdTrendingUp
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";

export default function AchievementsCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("banner");

  const [achievementsData, setAchievementsData] = useState({
    bannerTitle: "Our Hall of Fame",
    bannerSubtitle: "Celebrating the exceptional milestones of our students.",
    bannerImage: "/images/redesign/achievements_banner.png",
    stats: [
      { label: "Board Results", value: "100%", sub: "Passing Rate", icon: "MdTrendingUp" },
    ],
    toppers: [
      { name: "Rahul Singh", score: "98.8%", class: "Class XII", rank: "Rank 1" },
    ],
    awards: [
      { award: "Best Innovation", body: "Edu Council 2025" },
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/achievements');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          setAchievementsData(prev => {
            const next = { ...prev };
            Object.keys(incoming).forEach(key => {
              if (Array.isArray(incoming[key])) {
                (next as any)[key] = incoming[key];
              } else if (incoming[key] !== undefined && incoming[key] !== null && incoming[key] !== "") {
                (next as any)[key] = incoming[key];
              }
            });
            return next;
          });
        }
      } catch (error) {
        console.error("Error fetching achievements data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
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

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage /> },
    { id: 'stats', label: 'Key Statistics', icon: <MdTrendingUp /> },
    { id: 'toppers', label: 'Board Toppers', icon: <MdStars /> },
    { id: 'awards', label: 'Awards & Honors', icon: <MdEmojiEvents /> },
  ];

  const updateArrayItem = (arrayName: string, index: number, field: string, value: string) => {
    setAchievementsData((prev: any) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  return (
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdEmojiEvents className="text-indigo-600" />
            Achievements CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage school records, top students, and awards.</p>
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
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-1 sticky top-32">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? "bg-indigo-50 text-indigo-700 shadow-inner" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            
            <hr className="border-slate-100 my-4 mx-4" />
            
            <a 
              href={`\${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/achievements`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all w-full"
            >
              <MdPlayArrow size={16} />
              Open Live Page
            </a>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-8">
          {fetching ? (
            <div className="h-[400px] bg-slate-100 rounded-3xl animate-pulse" />
          ) : (
            <>
              {/* BANNER TAB */}
              {activeTab === 'banner' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Banner Configuration</h3>
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
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <ImageUploadField
                        label="Banner Background Image"
                        value={achievementsData.bannerImage}
                        onChange={(url) => setAchievementsData({...achievementsData, bannerImage: url})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STATS TAB */}
              {activeTab === 'stats' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Key Statistics</h3>
                    <button 
                      onClick={() => setAchievementsData(prev => ({...prev, stats: [...prev.stats, { label: "New Stat", value: "100", sub: "Detail", icon: "MdStars" }]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add Stat
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {achievementsData.stats.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group space-y-3">
                        <button 
                          onClick={() => setAchievementsData({...achievementsData, stats: achievementsData.stats.filter((_, idx) => idx !== i)})}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white text-[10px]"
                        >
                          ×
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Label</label>
                            <input 
                              value={item.label}
                              onChange={(e) => updateArrayItem('stats', i, 'label', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-bold text-slate-800 text-xs outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</label>
                            <input 
                              value={item.value}
                              onChange={(e) => updateArrayItem('stats', i, 'value', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-bold text-indigo-600 text-xs outline-none mt-1"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub-text</label>
                            <input 
                              value={item.sub}
                              onChange={(e) => updateArrayItem('stats', i, 'sub', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-medium text-slate-600 text-xs outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon Name</label>
                            <input 
                              value={item.icon}
                              onChange={(e) => updateArrayItem('stats', i, 'icon', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-medium text-slate-600 text-xs outline-none mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TOPPERS TAB */}
              {activeTab === 'toppers' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Board Toppers</h3>
                    <button 
                      onClick={() => setAchievementsData(prev => ({...prev, toppers: [...prev.toppers, { name: "Student Name", score: "99%", class: "Class", rank: "Rank" }]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add Topper
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievementsData.toppers.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group space-y-3">
                        <button 
                          onClick={() => setAchievementsData({...achievementsData, toppers: achievementsData.toppers.filter((_, idx) => idx !== i)})}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white text-[10px]"
                        >
                          ×
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</label>
                            <input 
                              value={item.name}
                              onChange={(e) => updateArrayItem('toppers', i, 'name', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-bold text-slate-800 text-xs outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</label>
                            <input 
                              value={item.score}
                              onChange={(e) => updateArrayItem('toppers', i, 'score', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-black text-indigo-600 text-xs outline-none mt-1"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class/Stream</label>
                            <input 
                              value={item.class}
                              onChange={(e) => updateArrayItem('toppers', i, 'class', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-medium text-slate-600 text-xs outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</label>
                            <input 
                              value={item.rank}
                              onChange={(e) => updateArrayItem('toppers', i, 'rank', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-bold text-amber-600 text-xs outline-none mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AWARDS TAB */}
              {activeTab === 'awards' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Awards & Honors</h3>
                    <button 
                      onClick={() => setAchievementsData(prev => ({...prev, awards: [...prev.awards, { award: "New Award", body: "Awarding Body" }]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add Award
                    </button>
                  </div>
                  <div className="space-y-4">
                    {achievementsData.awards.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group flex items-center gap-4">
                        <button 
                          onClick={() => setAchievementsData({...achievementsData, awards: achievementsData.awards.filter((_, idx) => idx !== i)})}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white text-[10px]"
                        >
                          ×
                        </button>
                        <div className="w-1/2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Award Title</label>
                          <input 
                            value={item.award}
                            onChange={(e) => updateArrayItem('awards', i, 'award', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                          />
                        </div>
                        <div className="w-1/2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awarding Body / Year</label>
                          <input 
                            value={item.body}
                            onChange={(e) => updateArrayItem('awards', i, 'body', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-sm outline-none mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}
