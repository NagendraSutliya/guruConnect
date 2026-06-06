import { useState, useEffect } from "react";
import { 
  MdWeb, 
  MdSave, 
  MdImage, 
  MdTextFields, 
  MdHistory,
  MdPlayArrow
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import type { AboutData } from "../../../types/admin/cms";

export default function AboutCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [aboutData, setAboutData] = useState<AboutData>({
    bannerTitle: "Our Legacy of Excellence",
    bannerSubtitle: "A 25-year journey of nurturing innovation, fostering character, and building a foundation for the next generation of global citizens.",
    establishedYear: "ESTABLISHED 2020",
    mainTitle: "Where Tradition Meets Digital Innovation.",
    mainSubtitle: "A holistic approach to education.",
    description: "Gyansthali Edu was founded with a singular purpose: to bridge the gap between traditional educational values and the rapidly evolving digital landscape. What started as a small experimental school in 2000 has now grown into a premier institution known for its pedagogical excellence.",
    stats: [
      { label: "Global Alumni", value: "2,500+" },
      { label: "Expert Educators", value: "150+" }
    ],
    directorMessage: {
      name: "Dr. Ananya Sharma",
      designation: "Founder & Director",
      quote: "At Gyansthali, we don't just teach subjects; we cultivate curiosity. Our mission is to prepare students not just for exams, but for a life of purpose, leadership, and continuous growth."
    },
    bannerImage: "/images/redesign/about_banner.png",
    directorImage: "/images/redesign/director.png"
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/about');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          
          setAboutData(prev => {
            const next = { ...prev };
            (Object.keys(incoming) as any).forEach((key: string) => {
              if (key === 'directorMessage' && incoming[key]) {
                const dm = incoming[key] as any;
                Object.keys(dm).forEach(subKey => {
                  if (dm[subKey]) (next.directorMessage as any)[subKey] = dm[subKey];
                });
              } else if (incoming[key] && incoming[key] !== "") {
                (next as any)[key] = incoming[key];
              }
            });
            return next;
          });
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchAboutData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post('/cms/update', {
        section: 'about',
        content: aboutData
      });
      if (response.data.success) {
        alert("About Us content published successfully!");
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
            <MdHistory className="text-indigo-600" />
            About Us CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage the legacy and leadership story of your school.</p>
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

            {fetching ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-12 bg-slate-100 rounded-2xl w-full" />
                <div className="h-24 bg-slate-100 rounded-2xl w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Banner Title</label>
                  <input 
                    value={aboutData.bannerTitle}
                    onChange={(e) => setAboutData({...aboutData, bannerTitle: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Banner Subtitle</label>
                  <textarea 
                    value={aboutData.bannerSubtitle}
                    onChange={(e) => setAboutData({...aboutData, bannerSubtitle: e.target.value})}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Main Content Configuration */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdWeb size={16} className="text-indigo-500" />
              Main Context
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Established Year Label</label>
                <input 
                  value={aboutData.establishedYear}
                  onChange={(e) => setAboutData({...aboutData, establishedYear: e.target.value})}
                  placeholder="e.g. Established 2020"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-bold text-indigo-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Main Headline</label>
                <input 
                  value={aboutData.mainTitle}
                  onChange={(e) => setAboutData({...aboutData, mainTitle: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-black text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all text-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Detail Description</label>
                <textarea 
                  value={aboutData.description}
                  onChange={(e) => setAboutData({...aboutData, description: e.target.value})}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Growth Metrics Configuration */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdWeb size={16} className="text-indigo-500" />
              Growth Metrics
            </div>

            <div className="grid grid-cols-2 gap-6">
              {(aboutData.stats || []).map((stat, index) => (
                <div key={index} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Metric Label</label>
                    <input 
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...aboutData.stats];
                        newStats[index].label = e.target.value;
                        setAboutData({...aboutData, stats: newStats});
                      }}
                      placeholder="e.g. Global Alumni"
                      className="w-full bg-white border border-slate-100 rounded-xl py-2.5 px-4 font-black text-slate-800 text-xs outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Metric Value</label>
                    <input 
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...aboutData.stats];
                        newStats[index].value = e.target.value;
                        setAboutData({...aboutData, stats: newStats});
                      }}
                      placeholder="e.g. 2,500+"
                      className="w-full bg-white border border-slate-100 rounded-xl py-2.5 px-4 font-black text-indigo-600 text-lg outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Director's Message Configuration */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdImage size={16} className="text-indigo-500" />
              Director's Message
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Director Name</label>
                  <input 
                    value={aboutData.directorMessage.name}
                    onChange={(e) => setAboutData({...aboutData, directorMessage: {...aboutData.directorMessage, name: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Designation</label>
                  <input 
                    value={aboutData.directorMessage.designation}
                    onChange={(e) => setAboutData({...aboutData, directorMessage: {...aboutData.directorMessage, designation: e.target.value}})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-6 font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Quote Message</label>
                <textarea 
                  value={aboutData.directorMessage?.quote || ""}
                  onChange={(e) => setAboutData({...aboutData, directorMessage: {...aboutData.directorMessage, quote: e.target.value}})}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed italic"
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
              Media Assets
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative group aspect-video rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-300">
                  <img 
                    src={aboutData.bannerImage || "/images/redesign/about_banner.png"} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    alt="Current Banner"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
                    <MdImage size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Change Banner URL Below</span>
                  </div>
                </div>
                <input 
                  type="text"
                  value={aboutData.bannerImage || ""}
                  onChange={(e) => setAboutData({...aboutData, bannerImage: e.target.value})}
                  placeholder="Banner Image URL..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 font-bold text-slate-700 text-[10px] outline-none focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-4">
                <div className="relative group aspect-square rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-300">
                  <img 
                    src={aboutData.directorImage || "/images/redesign/director.png"} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                    alt="Director"
                  />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
                    <MdImage size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Change Portrait URL Below</span>
                  </div>
                </div>
                <input 
                  type="text"
                  value={aboutData.directorImage || ""}
                  onChange={(e) => setAboutData({...aboutData, directorImage: e.target.value})}
                  placeholder="Director Portrait URL..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 font-bold text-slate-700 text-[10px] outline-none focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-lg mb-2">Live Preview</h4>
            <p className="text-slate-400 text-xs mb-6">Verify your changes on the public about page.</p>
            <a 
              href={`${import.meta.env.VITE_SCHOOL_WEBSITE_URL || "http://localhost:5174"}/about`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all"
            >
              <MdPlayArrow size={24} />
              <span className="font-bold text-sm">Open About Page</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
