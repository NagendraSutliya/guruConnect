import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdEmojiEvents,
  MdStars,
  MdTrendingUp,
  MdVisibility,
  MdAdd,
  MdClose
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "../../../context/ToastContext";

export default function AchievementsCMS() {
  const { showToast } = useToast();
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
        showToast("Achievements content published successfully!", "success");
      }
    } catch (error) {
      showToast("Failed to update content", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage size={16} /> },
    { id: 'stats', label: 'Key Statistics', icon: <MdTrendingUp size={16} /> },
    { id: 'toppers', label: 'Board Toppers', icon: <MdStars size={16} /> },
    { id: 'awards', label: 'Awards & Honors', icon: <MdEmojiEvents size={16} /> },
  ];

  const updateArrayItem = (arrayName: string, index: number, field: string, value: string) => {
    setAchievementsData((prev: any) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary flex items-center gap-1.5">
            <Link to="/admin/cms" className="hover:text-primary transition-colors">Website CMS</Link>
            <span>›</span>
            <span className="text-ink">Achievements</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Achievements CMS
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Manage academic records, board toppers, awards, and institutional laurels.
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a 
            href={`${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/achievements`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <MdVisibility size={16} className="text-primary" />
            <span>Live preview</span>
          </a>
          <button 
            type="button"
            onClick={handleSave}
            disabled={loading || fetching}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-70 flex items-center gap-2"
          >
            <MdSave size={18} />
            <span>{loading ? "Publishing..." : "Publish changes"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-card p-3 border border-line shadow-xs space-y-1 sticky top-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-control text-xs font-semibold transition-colors cursor-pointer text-left ${
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-xs" 
                    : "text-ink-secondary hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                <span className={activeTab === tab.id ? "text-white" : "text-ink-secondary"}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-5">
          {fetching ? (
            <div className="h-[360px] bg-white border border-line rounded-card animate-pulse" />
          ) : (
            <>
              {/* BANNER TAB */}
              {activeTab === 'banner' && (
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="pb-1 border-b border-line-row">
                    <h2 className="text-base font-semibold text-ink">Banner Configuration</h2>
                    <p className="text-xs text-ink-secondary">Header section of the Achievements page</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Title</label>
                      <input 
                        value={achievementsData.bannerTitle}
                        onChange={(e) => setAchievementsData({...achievementsData, bannerTitle: e.target.value})}
                        className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Subtitle</label>
                      <textarea 
                        value={achievementsData.bannerSubtitle}
                        onChange={(e) => setAchievementsData({...achievementsData, bannerSubtitle: e.target.value})}
                        rows={3}
                        className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    <div className="pt-2 border-t border-line-row">
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
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-1 border-b border-line-row flex-wrap gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-ink">Key Statistics</h2>
                      <p className="text-xs text-ink-secondary">High-level quantitative proof points</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setAchievementsData(prev => ({...prev, stats: [...prev.stats, { label: "New Stat", value: "100", sub: "Detail", icon: "MdStars" }]}))}
                      className="min-h-[36px] px-3.5 rounded-control bg-primary-tint hover:bg-primary-tint/80 border border-primary/20 text-primary-dark font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <MdAdd size={16} />
                      <span>Add Stat</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievementsData.stats.map((item, i) => (
                      <div key={i} className="p-4 bg-surface-subtle border border-line-row rounded-control relative group space-y-3">
                        <button 
                          type="button"
                          onClick={() => setAchievementsData({...achievementsData, stats: achievementsData.stats.filter((_, idx) => idx !== i)})}
                          className="absolute top-2 right-2 w-7 h-7 bg-white hover:bg-danger-bg text-ink-secondary hover:text-danger border border-line-input rounded-control flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Remove stat"
                        >
                          <MdClose size={15} />
                        </button>
                        <div className="grid grid-cols-2 gap-3 pr-8">
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Label</label>
                            <input 
                              value={item.label}
                              onChange={(e) => updateArrayItem('stats', i, 'label', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Value</label>
                            <input 
                              value={item.value}
                              onChange={(e) => updateArrayItem('stats', i, 'value', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 font-mono font-bold text-primary text-sm outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Subtitle</label>
                            <input 
                              value={item.sub}
                              onChange={(e) => updateArrayItem('stats', i, 'sub', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Icon Name</label>
                            <input 
                              value={item.icon}
                              onChange={(e) => updateArrayItem('stats', i, 'icon', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-mono outline-none focus:border-primary transition-colors"
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
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-1 border-b border-line-row flex-wrap gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-ink">Board Toppers</h2>
                      <p className="text-xs text-ink-secondary">Merit rankers in Class X & XII board examinations</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setAchievementsData(prev => ({...prev, toppers: [...prev.toppers, { name: "Student Name", score: "99%", class: "Class", rank: "Rank" }]}))}
                      className="min-h-[36px] px-3.5 rounded-control bg-primary-tint hover:bg-primary-tint/80 border border-primary/20 text-primary-dark font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <MdAdd size={16} />
                      <span>Add Topper</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievementsData.toppers.map((item, i) => (
                      <div key={i} className="p-4 bg-surface-subtle border border-line-row rounded-control relative group space-y-3">
                        <button 
                          type="button"
                          onClick={() => setAchievementsData({...achievementsData, toppers: achievementsData.toppers.filter((_, idx) => idx !== i)})}
                          className="absolute top-2 right-2 w-7 h-7 bg-white hover:bg-danger-bg text-ink-secondary hover:text-danger border border-line-input rounded-control flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Remove topper"
                        >
                          <MdClose size={15} />
                        </button>
                        <div className="grid grid-cols-2 gap-3 pr-8">
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Student Name</label>
                            <input 
                              value={item.name}
                              onChange={(e) => updateArrayItem('toppers', i, 'name', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Score / Percent</label>
                            <input 
                              value={item.score}
                              onChange={(e) => updateArrayItem('toppers', i, 'score', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 font-mono font-bold text-primary text-xs outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Class / Stream</label>
                            <input 
                              value={item.class}
                              onChange={(e) => updateArrayItem('toppers', i, 'class', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Rank / Distinction</label>
                            <input 
                              value={item.rank}
                              onChange={(e) => updateArrayItem('toppers', i, 'rank', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-amber-700 font-semibold outline-none focus:border-primary transition-colors"
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
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-1 border-b border-line-row flex-wrap gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-ink">Awards & Honors</h2>
                      <p className="text-xs text-ink-secondary">Trophies, accreditations, and state/national felicitations</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setAchievementsData(prev => ({...prev, awards: [...prev.awards, { award: "New Award", body: "Awarding Body" }]}))}
                      className="min-h-[36px] px-3.5 rounded-control bg-primary-tint hover:bg-primary-tint/80 border border-primary/20 text-primary-dark font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <MdAdd size={16} />
                      <span>Add Award</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {achievementsData.awards.map((item, i) => (
                      <div key={i} className="p-3.5 bg-surface-subtle border border-line-row rounded-control relative group flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => setAchievementsData({...achievementsData, awards: achievementsData.awards.filter((_, idx) => idx !== i)})}
                          className="absolute top-2 right-2 sm:static sm:order-last w-7 h-7 bg-white hover:bg-danger-bg text-ink-secondary hover:text-danger border border-line-input rounded-control flex items-center justify-center transition-colors cursor-pointer shadow-xs shrink-0"
                          title="Remove award"
                        >
                          <MdClose size={15} />
                        </button>
                        <div className="flex-1 pr-7 sm:pr-0">
                          <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Award Title</label>
                          <input 
                            value={item.award}
                            onChange={(e) => updateArrayItem('awards', i, 'award', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 font-semibold text-ink text-xs outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Awarding Body / Year</label>
                          <input 
                            value={item.body}
                            onChange={(e) => updateArrayItem('awards', i, 'body', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink-secondary outline-none focus:border-primary transition-colors"
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
