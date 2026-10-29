import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdHistory,
  MdFlag,
  MdGroups,
  MdInfo,
  MdVisibility,
  MdAdd,
  MdClose
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "../../../context/ToastContext";

export default function AboutCMS() {
  const { showToast } = useToast();
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
        showToast("About Us content published successfully!", "success");
      }
    } catch (error) {
      showToast("Failed to update content", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'banner', label: 'Page Banner', icon: <MdImage size={16} /> },
    { id: 'main', label: 'Main Introduction', icon: <MdInfo size={16} /> },
    { id: 'mission', label: 'Mission & Vision', icon: <MdFlag size={16} /> },
    { id: 'director', label: 'Director Message', icon: <MdHistory size={16} /> },
    { id: 'staff', label: 'Core Team (Staff)', icon: <MdGroups size={16} /> },
  ];

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary flex items-center gap-1.5">
            <Link to="/admin/cms" className="hover:text-primary transition-colors">Website CMS</Link>
            <span>›</span>
            <span className="text-ink">About Us</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            About Us CMS
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Manage the history, mission, vision, and leadership story of your school.
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a 
            href={`${import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}/about`}
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
                    <p className="text-xs text-ink-secondary">Top hero section of the About Us page</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Title</label>
                      <input 
                        value={aboutData.bannerTitle}
                        onChange={(e) => setAboutData({...aboutData, bannerTitle: e.target.value})}
                        className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Banner Subtitle</label>
                      <textarea 
                        value={aboutData.bannerSubtitle}
                        onChange={(e) => setAboutData({...aboutData, bannerSubtitle: e.target.value})}
                        rows={2}
                        className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    
                    <div className="pt-2 border-t border-line-row">
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
                <div className="space-y-5">
                  <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                    <div className="pb-1 border-b border-line-row">
                      <h2 className="text-base font-semibold text-ink">Main Introduction</h2>
                      <p className="text-xs text-ink-secondary">Narrative overview and heritage</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-secondary mb-1">Established Year Label</label>
                        <input 
                          value={aboutData.establishedYear}
                          onChange={(e) => setAboutData({...aboutData, establishedYear: e.target.value})}
                          placeholder="e.g. Established 2020"
                          className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-secondary mb-1">Main Headline</label>
                        <input 
                          value={aboutData.mainTitle}
                          onChange={(e) => setAboutData({...aboutData, mainTitle: e.target.value})}
                          className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink font-semibold outline-none focus:bg-white focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-secondary mb-1">Detailed Description</label>
                        <textarea 
                          value={aboutData.description}
                          onChange={(e) => setAboutData({...aboutData, description: e.target.value})}
                          rows={6}
                          className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats Sub-section */}
                  <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                    <div className="pb-1 border-b border-line-row">
                      <h2 className="text-base font-semibold text-ink">Growth Metrics</h2>
                      <p className="text-xs text-ink-secondary">Key milestone statistics displayed on the page</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(aboutData.stats || []).map((stat, index) => (
                        <div key={index} className="p-4 rounded-control bg-surface-subtle border border-line-row space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Metric Value</label>
                            <input 
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...aboutData.stats];
                                newStats[index].value = e.target.value;
                                setAboutData({...aboutData, stats: newStats});
                              }}
                              placeholder="e.g. 500+"
                              className="w-full bg-white border border-line-input rounded-control h-10 px-3 font-mono font-bold text-primary text-base outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Metric Label</label>
                            <input 
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...aboutData.stats];
                                newStats[index].label = e.target.value;
                                setAboutData({...aboutData, stats: newStats});
                              }}
                              placeholder="e.g. Successful Students"
                              className="w-full bg-white border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:border-primary transition-colors"
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
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="pb-1 border-b border-line-row">
                    <h2 className="text-base font-semibold text-ink">Mission & Vision</h2>
                    <p className="text-xs text-ink-secondary">Guiding philosophy and institutional goals</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1 flex items-center gap-1.5">
                        <MdFlag className="text-primary" /> <span>Our Mission</span>
                      </label>
                      <textarea 
                        value={aboutData.mission}
                        onChange={(e) => setAboutData({...aboutData, mission: e.target.value})}
                        rows={4}
                        className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1 flex items-center gap-1.5">
                        <MdInfo className="text-primary" /> <span>Our Vision</span>
                      </label>
                      <textarea 
                        value={aboutData.vision}
                        onChange={(e) => setAboutData({...aboutData, vision: e.target.value})}
                        rows={4}
                        className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DIRECTOR MESSAGE TAB */}
              {activeTab === 'director' && (
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="pb-1 border-b border-line-row">
                    <h2 className="text-base font-semibold text-ink">Director's Message</h2>
                    <p className="text-xs text-ink-secondary">Leadership quote and portrait</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-secondary mb-1">Director Name</label>
                        <input 
                          value={aboutData.directorMessage.name}
                          onChange={(e) => setAboutData({...aboutData, directorMessage: {...aboutData.directorMessage, name: e.target.value}})}
                          className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-secondary mb-1">Designation</label>
                        <input 
                          value={aboutData.directorMessage.designation}
                          onChange={(e) => setAboutData({...aboutData, directorMessage: {...aboutData.directorMessage, designation: e.target.value}})}
                          className="w-full bg-surface-subtle border border-line-input rounded-control h-10 px-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1">Quote / Message</label>
                      <textarea 
                        value={aboutData.directorMessage.quote}
                        onChange={(e) => setAboutData({...aboutData, directorMessage: {...aboutData.directorMessage, quote: e.target.value}})}
                        rows={4}
                        className="w-full bg-surface-subtle border border-line-input rounded-control p-3 text-xs text-ink outline-none focus:bg-white focus:border-primary transition-colors leading-relaxed italic"
                      />
                    </div>
                    
                    <div className="pt-2 border-t border-line-row">
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
                <div className="bg-white rounded-card p-5 sm:p-6 border border-line shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-1 border-b border-line-row flex-wrap gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-ink">Core Team (Staff)</h2>
                      <p className="text-xs text-ink-secondary">Manage key leadership profiles displayed on the website</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setAboutData(prev => ({...prev, staff: [...prev.staff, { name: "New Member", role: "Role", image: "" }]}))}
                      className="min-h-[36px] px-3.5 rounded-control bg-primary-tint hover:bg-primary-tint/80 border border-primary/20 text-primary-dark font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <MdAdd size={16} />
                      <span>Add Member</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aboutData.staff.map((member, i) => (
                      <div key={i} className="p-4 bg-surface-subtle rounded-control border border-line-row space-y-3 relative group">
                        <button 
                          type="button"
                          onClick={() => {
                            const newStaff = aboutData.staff.filter((_, index) => index !== i);
                            setAboutData({...aboutData, staff: newStaff});
                          }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white hover:bg-danger-bg text-ink-secondary hover:text-danger border border-line-input rounded-control flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Remove member"
                        >
                          <MdClose size={15} />
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3 pr-8">
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Name</label>
                            <input 
                              value={member.name}
                              onChange={(e) => {
                                const newStaff = [...aboutData.staff];
                                newStaff[i].name = e.target.value;
                                setAboutData({...aboutData, staff: newStaff});
                              }}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink-secondary mb-1">Role</label>
                            <input 
                              value={member.role}
                              onChange={(e) => {
                                const newStaff = [...aboutData.staff];
                                newStaff[i].role = e.target.value;
                                setAboutData({...aboutData, staff: newStaff});
                              }}
                              className="w-full bg-white border border-line-input rounded-control h-9 px-2.5 text-xs text-ink font-medium outline-none focus:border-primary transition-colors"
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
