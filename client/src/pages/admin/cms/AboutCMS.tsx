import { useState, useEffect } from "react";
import { 
  MdWeb, 
  MdSave, 
  MdImage, 
  MdHistory,
  MdPlayArrow,
  MdFlag,
  MdGroups,
  MdInfo
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";

export default function AboutCMS() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("banner");

  const [aboutData, setAboutData] = useState({
    bannerTitle: "About Our Institute",
    bannerSubtitle: "Nurturing innovation, fostering character, and building leaders.",
    establishedYear: "ESTABLISHED 2020",
    mainTitle: "Where Tradition Meets Digital Innovation",
    description: "Gyansthali Enlightening was founded in 2020 with a singular purpose: to bridge the gap between traditional educational values and the rapidly evolving digital landscape. We have grown into a premier institution known for our pedagogical excellence, state-of-the-art infrastructure, and commitment to holistic student development.",
    stats: [
      { label: "Successful Students", value: "500+" },
      { label: "Expert Educators", value: "25+" }
    ],
    mission: "To empower students with the knowledge, skills, and values required to thrive in a rapidly changing world.",
    vision: "To be a global leader in innovative education, fostering a community of lifelong learners and responsible citizens.",
    directorMessage: {
      name: "Mr. Prashant Singh",
      designation: "Founder & Director",
      quote: "At Gyansthali, we don't just teach subjects; we cultivate curiosity. Our mission is to prepare students not just for exams, but for a life of purpose, leadership, and continuous growth in an ever-changing world."
    },
    bannerImage: "/images/redesign/about_banner.png",
    directorImage: "/images/redesign/director.png",
    staff: [
      { name: "Mr. Rajeev Sharma", role: "Principal", image: "https://ui-avatars.com/api/?name=Rajeev+Sharma&background=e0e7ff&color=4f46e5" },
      { name: "Ms. Anjali Verma", role: "Head of Academics", image: "https://ui-avatars.com/api/?name=Anjali+Verma&background=e0e7ff&color=4f46e5" },
      { name: "Mr. Vikram Singh", role: "Sports Director", image: "https://ui-avatars.com/api/?name=Vikram+Singh&background=e0e7ff&color=4f46e5" },
      { name: "Mrs. Meera Reddy", role: "Chief Counselor", image: "https://ui-avatars.com/api/?name=Meera+Reddy&background=e0e7ff&color=4f46e5" }
    ]
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
              } else if (key === 'staff' && Array.isArray(incoming[key])) {
                next.staff = incoming[key];
              } else if (key === 'stats' && Array.isArray(incoming[key])) {
                next.stats = incoming[key];
              } else if (incoming[key] !== undefined && incoming[key] !== null) {
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

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage /> },
    { id: 'main', label: 'Main Introduction', icon: <MdInfo /> },
    { id: 'mission', label: 'Mission & Vision', icon: <MdFlag /> },
    { id: 'director', label: 'Director Message', icon: <MdHistory /> },
    { id: 'staff', label: 'Core Team (Staff)', icon: <MdGroups /> },
  ];

  return (
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdHistory className="text-indigo-600" />
            About Us CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage the legacy, mission, and leadership story of your school.</p>
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
            
            {/* Live Preview Button */}
            <a 
              href={`\${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/about`}
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
                    
                    <div className="pt-4 border-t border-slate-100">
                      <ImageUploadField
                        label="Banner Background Image"
                        value={aboutData.bannerImage}
                        onChange={(url) => setAboutData({...aboutData, bannerImage: url})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MAIN INTRO TAB */}
              {activeTab === 'main' && (
                <div className="space-y-8">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Main Introduction</h3>

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
                          rows={6}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats Sub-section */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Growth Metrics</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {(aboutData.stats || []).map((stat, index) => (
                        <div key={index} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Metric Value</label>
                            <input 
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...aboutData.stats];
                                newStats[index].value = e.target.value;
                                setAboutData({...aboutData, stats: newStats});
                              }}
                              placeholder="e.g. 500+"
                              className="w-full bg-white border border-slate-100 rounded-xl py-2.5 px-4 font-black text-indigo-600 text-lg outline-none focus:border-indigo-500 transition-all"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Metric Label</label>
                            <input 
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...aboutData.stats];
                                newStats[index].label = e.target.value;
                                setAboutData({...aboutData, stats: newStats});
                              }}
                              placeholder="e.g. Successful Students"
                              className="w-full bg-white border border-slate-100 rounded-xl py-2.5 px-4 font-black text-slate-800 text-xs outline-none focus:border-indigo-500 transition-all"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MISSION & VISION TAB */}
              {activeTab === 'mission' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Mission & Vision</h3>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest flex items-center gap-2"><MdFlag /> Our Mission</label>
                      <textarea 
                        value={aboutData.mission}
                        onChange={(e) => setAboutData({...aboutData, mission: e.target.value})}
                        rows={4}
                        className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl py-4 px-6 font-bold text-emerald-900 outline-none focus:bg-emerald-100 focus:border-emerald-300 transition-all text-sm leading-relaxed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest flex items-center gap-2"><MdWeb /> Our Vision</label>
                      <textarea 
                        value={aboutData.vision}
                        onChange={(e) => setAboutData({...aboutData, vision: e.target.value})}
                        rows={4}
                        className="w-full bg-blue-50 border border-blue-100 rounded-2xl py-4 px-6 font-bold text-blue-900 outline-none focus:bg-blue-100 focus:border-blue-300 transition-all text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DIRECTOR MESSAGE TAB */}
              {activeTab === 'director' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Director's Message</h3>

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
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Quote / Message</label>
                      <textarea 
                        value={aboutData.directorMessage.quote}
                        onChange={(e) => setAboutData({...aboutData, directorMessage: {...aboutData.directorMessage, quote: e.target.value}})}
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all text-sm leading-relaxed italic"
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <ImageUploadField
                        label="Director Portrait Image"
                        value={aboutData.directorImage}
                        onChange={(url) => setAboutData({...aboutData, directorImage: url})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STAFF TAB */}
              {activeTab === 'staff' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800">Core Team (Staff)</h3>
                    <button 
                      onClick={() => setAboutData(prev => ({...prev, staff: [...prev.staff, { name: "New Member", role: "Role", image: "" }]}))}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      + Add Member
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aboutData.staff.map((member, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                        <button 
                          onClick={() => {
                            const newStaff = aboutData.staff.filter((_, index) => index !== i);
                            setAboutData({...aboutData, staff: newStaff});
                          }}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-md hover:bg-red-500 hover:text-white"
                        >
                          ×
                        </button>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                            <input 
                              value={member.name}
                              onChange={(e) => {
                                const newStaff = [...aboutData.staff];
                                newStaff[i].name = e.target.value;
                                setAboutData({...aboutData, staff: newStaff});
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                            <input 
                              value={member.role}
                              onChange={(e) => {
                                const newStaff = [...aboutData.staff];
                                newStaff[i].role = e.target.value;
                                setAboutData({...aboutData, staff: newStaff});
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-700 text-sm outline-none mt-1"
                            />
                          </div>
                        </div>
                        <ImageUploadField
                          label="Member Photo"
                          value={member.image}
                          onChange={(url) => {
                            const newStaff = [...aboutData.staff];
                            newStaff[i].image = url;
                            setAboutData({...aboutData, staff: newStaff});
                          }}
                          isSmall
                        />
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
