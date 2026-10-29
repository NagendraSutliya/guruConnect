import { useState, useEffect } from "react";
import { 
  MdSave, 
  MdImage, 
  MdLayers, 
  MdPlayArrow,
  MdBarChart, 
  MdInfo, 
  MdList, 
  MdGroup, 
  MdMessage, 
  MdHelp,
  MdVisibility
} from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "../../../context/ToastContext";

export default function HomeCMS() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");

  const [homeData, setHomeData] = useState({
    hero: {
      title: "Empowering Minds, Shaping Tomorrow's Leaders",
      subtitle: "At Gyansthali Enlightening, we blend traditional values with cutting-edge digital innovation...",
      button1: "Apply for 2026-27",
      button2: "Explore Campus",
      announcement: "Now Enrolling: Academic Session 2026-27",
      backgroundImage: "/images/redesign/hero.png"
    },
    stats: [
      { label: 'Success Rate', val: '99%', sub: 'University Placements' },
      { label: 'Expert Faculty', val: '25+', sub: 'Certified Educators' },
      { label: 'Modern Labs', val: '10+', sub: 'World-class Facilities' },
      { label: 'Established', val: '2020', sub: 'Mahesh Nagar, Jaipur' }
    ],
    welcome: {
      title: "Nurturing Excellence in Education",
      subtitle: "Welcome to Gyansthali",
      p1: "Established with a vision to create responsible and capable citizens...",
      p2: "Our mission is simple: to empower students with knowledge...",
      button: "Read Our Story",
      image: "/images/redesign/campus_hero.png"
    },
    features: {
      title: "An Ecosystem for Human Excellence",
      subtitle: "Our DNA",
      items: [
        { title: "Smart Learning", desc: "Digitally equipped classrooms...", tag: "Technology", icon: "/images/redesign/speed.png" },
        { title: "Holistic Growth", desc: "Special focus on sports...", tag: "Values", icon: "/images/redesign/stats.png" },
        { title: "Safe Campus", desc: "24/7 surveillance...", tag: "Security", icon: "/images/redesign/security.png" }
      ]
    },
    whyChoose: {
      title: "Why Choose Gyansthali?",
      subtitle: "We provide more than just education...",
      points: [
        "Digital-First Pedagogy", "Personalized Mentorship", "World-Class Infrastructure",
        "Holistic Development", "Global Exposure", "Values-Based Learning"
      ]
    },
    news: {
      title: "Latest News & Resources",
      subtitle: "Happenings",
      items: [
        { date: "May 9, 2026", title: "17th Annual Inter-School Sports Trophy", img: "/images/redesign/gallery1.png" },
        { date: "May 2, 2026", title: "Mosaic Art & Cultural Fest 2026", img: "/images/redesign/gallery2.png" },
        { date: "Apr 15, 2026", title: "National Science Olympiad Winners", img: "/images/redesign/gallery3.png" }
      ]
    },
    leadership: {
      inspiration: { 
        title: "The Inspiration", 
        quote: "We proudly honor the visionaries...", 
        author: "Gyansthali Education Trust", 
        role: "Founding Board" 
      },
      principal: { 
        title: "Principal's Desk", 
        quote: "At Gyansthali, we believe that the true goal...", 
        author: "Mrs. Khushboo Soni", 
        role: "Principal" 
      }
    },
    alumni: {
      title: "Alumni Spotlight",
      subtitle: "Our Legacy",
      items: [
        { name: "Sankalp Sharma", role: "III RD OFFICER", year: "2013" },
        { name: "Deeksha Singh", role: "CORPORATE LAWYER", year: "2009" },
        { name: "Ankit Olla", role: "FIGHTER PILOT, IAF", year: "2015" },
        { name: "Pranjal Rajawat", role: "MARKETING MANAGER", year: "2013" }
      ]
    },
    testimonials: {
      title: "What Parents Say",
      subtitle: "Voices of Trust",
      items: [
        { quote: "Such an interactive and enthusiastic session...", parent: "Rashmi D", child: "Arohi, Grade 5" },
        { quote: "Aarush was very shy and scared to speak his mind...", parent: "Sonu J", child: "Aaryush, Grade 3" },
        { quote: "We're extremely thankful for the efforts made...", parent: "Ashok S", child: "Aryansh, Grade 8" }
      ]
    },
    faqs: {
      title: "Frequently Asked Questions",
      subtitle: "Clear Your Doubts",
      items: [
        { q: "Is Gyansthali affiliated with CBSE?", a: "Yes, we are a fully CBSE-affiliated school..." },
        { q: "Does the school provide transportation facilities?", a: "Yes, we provide safe and efficient transportation..." },
        { q: "What are the key co-curricular activities?", a: "Our framework includes sports, music..." },
        { q: "How can I apply for admission?", a: "Admissions can be initiated through our online portal..." }
      ]
    }
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/home');
        if (response.data.success && response.data.data) {
          setHomeData(prev => ({
            ...prev,
            ...response.data.data,
            hero: { ...prev.hero, ...(response.data.data.hero || {}) },
            welcome: { ...prev.welcome, ...(response.data.data.welcome || {}) },
            features: { ...prev.features, ...(response.data.data.features || {}) },
            news: { ...prev.news, ...(response.data.data.news || {}) },
            leadership: { ...prev.leadership, ...(response.data.data.leadership || {}) },
            alumni: { ...prev.alumni, ...(response.data.data.alumni || {}) },
            testimonials: { ...prev.testimonials, ...(response.data.data.testimonials || {}) },
            faqs: { ...prev.faqs, ...(response.data.data.faqs || {}) },
          }));
        } else {
          const heroRes = await api.get('/cms/hero');
          if (heroRes.data.success && heroRes.data.data) {
            setHomeData(prev => ({ ...prev, hero: { ...prev.hero, ...heroRes.data.data } }));
          }
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post('/cms/update', {
        section: 'home',
        content: homeData
      });
      if (response.data.success) {
        showToast("Home content published successfully!", "success");
      } else {
        showToast("Failed to update home content", "error");
      }
    } catch (error) {
      showToast("Failed to update content. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: <MdImage size={16} /> },
    { id: 'stats', label: 'Statistics', icon: <MdBarChart size={16} /> },
    { id: 'welcome', label: 'Welcome / About', icon: <MdInfo size={16} /> },
    { id: 'features', label: 'Features (DNA)', icon: <MdLayers size={16} /> },
    { id: 'whyChoose', label: 'Why Choose Us', icon: <MdList size={16} /> },
    { id: 'news', label: 'News & Events', icon: <MdList size={16} /> },
    { id: 'leadership', label: 'Leadership', icon: <MdGroup size={16} /> },
    { id: 'alumni', label: 'Alumni Spotlight', icon: <MdGroup size={16} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MdMessage size={16} /> },
    { id: 'faqs', label: 'FAQs', icon: <MdHelp size={16} /> },
  ];

  const updateNestedData = (section: string, field: string, value: any) => {
    setHomeData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArrayItem = (section: string, index: number, field: string, value: string) => {
    setHomeData((prev: any) => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const updateNestedArrayItem = (section: string, arrayField: string, index: number, field: string, value: string) => {
    setHomeData((prev: any) => {
      const newArray = [...prev[section][arrayField]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { 
        ...prev, 
        [section]: {
          ...prev[section],
          [arrayField]: newArray
        }
      };
    });
  };

  const updateStringArrayItem = (section: string, arrayField: string, index: number, value: string) => {
    setHomeData((prev: any) => {
      const newArray = [...prev[section][arrayField]];
      newArray[index] = value;
      return { 
        ...prev, 
        [section]: {
          ...prev[section],
          [arrayField]: newArray
        }
      };
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
            <span className="text-ink">Home Page</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Home Page CMS
          </h1>
          <div className="text-[13px] text-ink-secondary">
            Manage the school landing page content, banner, features, and testimonials.
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a 
            href={import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'}
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
          <div className="bg-white rounded-card border border-line p-3 space-y-1 sticky top-6">
            <div className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider px-3 py-1.5">
              Sections
            </div>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-control text-xs font-medium transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary text-white font-semibold shadow-sm" 
                    : "text-ink-secondary hover:text-ink hover:bg-slate-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-5">
          {fetching ? (
            <div className="h-96 bg-white border border-line rounded-card animate-pulse" />
          ) : (
            <>
              {/* HERO TAB */}
              {activeTab === 'hero' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Hero Banner Configuration</h3>
                    <p className="text-xs text-ink-secondary">Set top announcement, main hero title, subtitle, buttons, and background banner image.</p>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Announcement Badge</label>
                      <input 
                        value={homeData.hero.announcement}
                        onChange={(e) => updateNestedData('hero', 'announcement', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Main Title</label>
                      <textarea 
                        value={homeData.hero.title}
                        onChange={(e) => updateNestedData('hero', 'title', e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:outline-none transition-colors font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Subtitle Description</label>
                      <textarea 
                        value={homeData.hero.subtitle}
                        onChange={(e) => updateNestedData('hero', 'subtitle', e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink placeholder:text-ink-secondary/60 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-ink-secondary mb-1.5">Primary Button Text</label>
                        <input 
                          value={homeData.hero.button1}
                          onChange={(e) => updateNestedData('hero', 'button1', e.target.value)}
                          className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-secondary mb-1.5">Secondary Button Text</label>
                        <input 
                          value={homeData.hero.button2}
                          onChange={(e) => updateNestedData('hero', 'button2', e.target.value)}
                          className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <ImageUploadField
                        label="Background Image URL"
                        value={homeData.hero.backgroundImage}
                        onChange={(url) => updateNestedData('hero', 'backgroundImage', url)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STATS TAB */}
              {activeTab === 'stats' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Quick Statistics (4 Items)</h3>
                    <p className="text-xs text-ink-secondary">Prominent numbers and highlights displayed across the landing page.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {homeData.stats.map((stat, i) => (
                      <div key={i} className="p-4 bg-slate-50/70 rounded-card border border-line space-y-3">
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Main Value (e.g. 99%, 25+)</label>
                          <input 
                            value={stat.val}
                            onChange={(e) => updateArrayItem('stats', i, 'val', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-sm font-bold text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Label</label>
                          <input 
                            value={stat.label}
                            onChange={(e) => updateArrayItem('stats', i, 'label', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Subtext</label>
                          <input 
                            value={stat.sub}
                            onChange={(e) => updateArrayItem('stats', i, 'sub', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WELCOME TAB */}
              {activeTab === 'welcome' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Welcome / About Section</h3>
                    <p className="text-xs text-ink-secondary">Introduction to the school ethos, leadership welcome, and campus highlights.</p>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-ink-secondary mb-1.5">Small Heading</label>
                        <input 
                          value={homeData.welcome.subtitle}
                          onChange={(e) => updateNestedData('welcome', 'subtitle', e.target.value)}
                          className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-secondary mb-1.5">Main Title</label>
                        <input 
                          value={homeData.welcome.title}
                          onChange={(e) => updateNestedData('welcome', 'title', e.target.value)}
                          className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Paragraph 1</label>
                      <textarea 
                        value={homeData.welcome.p1}
                        onChange={(e) => updateNestedData('welcome', 'p1', e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Paragraph 2</label>
                      <textarea 
                        value={homeData.welcome.p2}
                        onChange={(e) => updateNestedData('welcome', 'p2', e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-ink-secondary mb-1.5">Button Text</label>
                        <input 
                          value={homeData.welcome.button}
                          onChange={(e) => updateNestedData('welcome', 'button', e.target.value)}
                          className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <ImageUploadField
                          label="Campus Image URL"
                          value={homeData.welcome.image}
                          onChange={(url) => updateNestedData('welcome', 'image', url)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FEATURES TAB */}
              {activeTab === 'features' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Features (Our DNA)</h3>
                    <p className="text-xs text-ink-secondary">Key distinctive pillars of the school ecosystem.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Small Heading</label>
                      <input 
                        value={homeData.features.subtitle}
                        onChange={(e) => updateNestedData('features', 'subtitle', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Main Title</label>
                      <input 
                        value={homeData.features.title}
                        onChange={(e) => updateNestedData('features', 'title', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    {homeData.features.items.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50/70 rounded-card border border-line space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">Feature Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateNestedArrayItem('features', 'items', i, 'title', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">Tag / Category</label>
                            <input 
                              value={item.tag}
                              onChange={(e) => updateNestedArrayItem('features', 'items', i, 'tag', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <ImageUploadField
                            label="Icon URL"
                            value={item.icon}
                            onChange={(url) => updateNestedArrayItem('features', 'items', i, 'icon', url)}
                            isSmall
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Description</label>
                          <textarea 
                            value={item.desc}
                            onChange={(e) => updateNestedArrayItem('features', 'items', i, 'desc', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WHY CHOOSE TAB */}
              {activeTab === 'whyChoose' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Why Choose Gyansthali?</h3>
                    <p className="text-xs text-ink-secondary">Strategic reasons families select your institution.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Main Title</label>
                      <input 
                        value={homeData.whyChoose.title}
                        onChange={(e) => updateNestedData('whyChoose', 'title', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Subtitle Description</label>
                      <input 
                        value={homeData.whyChoose.subtitle}
                        onChange={(e) => updateNestedData('whyChoose', 'subtitle', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-medium text-ink-secondary">6 Key Points</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {homeData.whyChoose.points.map((point, i) => (
                        <input 
                          key={i}
                          value={point}
                          onChange={(e) => updateStringArrayItem('whyChoose', 'points', i, e.target.value)}
                          className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* NEWS TAB */}
              {activeTab === 'news' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Latest News & Resources</h3>
                    <p className="text-xs text-ink-secondary">Highlights of upcoming events, recent competitions, and achievements.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Small Heading</label>
                      <input 
                        value={homeData.news.subtitle}
                        onChange={(e) => updateNestedData('news', 'subtitle', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Main Title</label>
                      <input 
                        value={homeData.news.title}
                        onChange={(e) => updateNestedData('news', 'title', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    {homeData.news.items.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50/70 rounded-card border border-line space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">Date</label>
                            <input 
                              value={item.date}
                              onChange={(e) => updateNestedArrayItem('news', 'items', i, 'date', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateNestedArrayItem('news', 'items', i, 'title', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <ImageUploadField
                            label="News Image URL"
                            value={item.img}
                            onChange={(url) => updateNestedArrayItem('news', 'items', i, 'img', url)}
                            isSmall
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LEADERSHIP TAB */}
              {activeTab === 'leadership' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Leadership Messages</h3>
                    <p className="text-xs text-ink-secondary">Inspirational notes from the Founding Board and the Principal's Desk.</p>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    {['inspiration', 'principal'].map((type) => {
                      const data = homeData.leadership[type as 'inspiration'|'principal'];
                      return (
                        <div key={type} className="p-4 bg-slate-50/70 rounded-card border border-line space-y-3">
                          <h4 className="text-xs font-semibold text-ink capitalize">{type} Desk</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-medium text-ink-secondary mb-1">Title</label>
                              <input 
                                value={data.title}
                                onChange={(e) => updateNestedData('leadership', type, { ...data, title: e.target.value })}
                                className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-ink-secondary mb-1">Author</label>
                              <input 
                                value={data.author}
                                onChange={(e) => updateNestedData('leadership', type, { ...data, author: e.target.value })}
                                className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-ink-secondary mb-1">Role</label>
                              <input 
                                value={data.role}
                                onChange={(e) => updateNestedData('leadership', type, { ...data, role: e.target.value })}
                                className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">Quote / Message</label>
                            <textarea 
                              value={data.quote}
                              onChange={(e) => updateNestedData('leadership', type, { ...data, quote: e.target.value })}
                              rows={3}
                              className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ALUMNI TAB */}
              {activeTab === 'alumni' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Alumni Spotlight</h3>
                    <p className="text-xs text-ink-secondary">Prominent graduates and their achievements.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Small Heading</label>
                      <input 
                        value={homeData.alumni.subtitle}
                        onChange={(e) => updateNestedData('alumni', 'subtitle', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Main Title</label>
                      <input 
                        value={homeData.alumni.title}
                        onChange={(e) => updateNestedData('alumni', 'title', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    {homeData.alumni.items.map((item, i) => (
                      <div key={i} className="p-3 bg-slate-50/70 rounded-card border border-line grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Name</label>
                          <input 
                            value={item.name}
                            onChange={(e) => updateNestedArrayItem('alumni', 'items', i, 'name', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Role / Designation</label>
                          <input 
                            value={item.role}
                            onChange={(e) => updateNestedArrayItem('alumni', 'items', i, 'role', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Graduation Year</label>
                          <input 
                            value={item.year}
                            onChange={(e) => updateNestedArrayItem('alumni', 'items', i, 'year', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TESTIMONIALS TAB */}
              {activeTab === 'testimonials' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Parent Testimonials</h3>
                    <p className="text-xs text-ink-secondary">Feedback and experiences shared by parents and guardians.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Small Heading</label>
                      <input 
                        value={homeData.testimonials.subtitle}
                        onChange={(e) => updateNestedData('testimonials', 'subtitle', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Main Title</label>
                      <input 
                        value={homeData.testimonials.title}
                        onChange={(e) => updateNestedData('testimonials', 'title', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    {homeData.testimonials.items.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50/70 rounded-card border border-line space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">Parent Name</label>
                            <input 
                              value={item.parent}
                              onChange={(e) => updateNestedArrayItem('testimonials', 'items', i, 'parent', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">Child Details</label>
                            <input 
                              value={item.child}
                              onChange={(e) => updateNestedArrayItem('testimonials', 'items', i, 'child', e.target.value)}
                              className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Quote</label>
                          <textarea 
                            value={item.quote}
                            onChange={(e) => updateNestedArrayItem('testimonials', 'items', i, 'quote', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQS TAB */}
              {activeTab === 'faqs' && (
                <div className="bg-white rounded-card border border-line p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">Frequently Asked Questions</h3>
                    <p className="text-xs text-ink-secondary">Common questions displayed in the accordion on the homepage.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Small Heading</label>
                      <input 
                        value={homeData.faqs.subtitle}
                        onChange={(e) => updateNestedData('faqs', 'subtitle', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink-secondary mb-1.5">Main Title</label>
                      <input 
                        value={homeData.faqs.title}
                        onChange={(e) => updateNestedData('faqs', 'title', e.target.value)}
                        className="w-full bg-white border border-line-input rounded-control px-3 py-2 text-xs font-medium text-ink focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    {homeData.faqs.items.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50/70 rounded-card border border-line space-y-3">
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Question</label>
                          <input 
                            value={item.q}
                            onChange={(e) => updateNestedArrayItem('faqs', 'items', i, 'q', e.target.value)}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-ink-secondary mb-1">Answer</label>
                          <textarea 
                            value={item.a}
                            onChange={(e) => updateNestedArrayItem('faqs', 'items', i, 'a', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-line-input rounded-control px-2.5 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Quick Preview Card */}
          <div className="bg-white rounded-card border border-line p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold text-ink">Public Website Preview</h4>
              <p className="text-[11px] text-ink-secondary">Verify how your published changes appear on the live home page.</p>
            </div>
            <a 
              href={import.meta.env.VITE_SCHOOL_WEBSITE_URL || 'http://localhost:5174'} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-control border border-line text-xs font-semibold text-ink hover:bg-slate-50 transition-colors"
            >
              <MdPlayArrow size={14} /> Open Live Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
