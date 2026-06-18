import { useState, useEffect } from "react";
import { 
  MdWeb, MdSave, MdImage, MdLayers, MdPlayArrow,
  MdBarChart, MdInfo, MdList, MdGroup, MdMessage, MdHelp
} from "react-icons/md";
import api from "../../../api/axiosInstance";
import ImageUploadField from "./ImageUploadField";

export default function HomeCMS() {
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
          // Merge to ensure we don't lose structure if db is missing fields
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
          // Attempt to fetch legacy 'hero' data if 'home' is empty
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
        alert("Home content published successfully!");
      }
    } catch (error) {
      alert("Failed to update content");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero Banner', icon: <MdImage /> },
    { id: 'stats', label: 'Statistics', icon: <MdBarChart /> },
    { id: 'welcome', label: 'Welcome/About', icon: <MdInfo /> },
    { id: 'features', label: 'Features (DNA)', icon: <MdLayers /> },
    { id: 'whyChoose', label: 'Why Choose', icon: <MdList /> },
    { id: 'news', label: 'News & Events', icon: <MdList /> },
    { id: 'leadership', label: 'Leadership', icon: <MdGroup /> },
    { id: 'alumni', label: 'Alumni Spotlight', icon: <MdGroup /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MdMessage /> },
    { id: 'faqs', label: 'FAQs', icon: <MdHelp /> },
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
    <div className="py-6 space-y-8 animate-fadeIn relative text-slate-900">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-slate-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdWeb className="text-indigo-600" />
            Home Page CMS
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage the entire public landing page.</p>
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
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-8">
          {fetching ? (
            <div className="h-[400px] bg-slate-100 rounded-3xl animate-pulse" />
          ) : (
            <>
              {/* HERO TAB */}
              {activeTab === 'hero' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Hero Banner Configuration</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Announcement Badge</label>
                      <input 
                        value={homeData.hero.announcement}
                        onChange={(e) => updateNestedData('hero', 'announcement', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Title</label>
                      <textarea 
                        value={homeData.hero.title}
                        onChange={(e) => updateNestedData('hero', 'title', e.target.value)}
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-lg focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subtitle Description</label>
                      <textarea 
                        value={homeData.hero.subtitle}
                        onChange={(e) => updateNestedData('hero', 'subtitle', e.target.value)}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-medium text-slate-600 text-sm focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Primary Button Text</label>
                        <input 
                          value={homeData.hero.button1}
                          onChange={(e) => updateNestedData('hero', 'button1', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Secondary Button Text</label>
                        <input 
                          value={homeData.hero.button2}
                          onChange={(e) => updateNestedData('hero', 'button2', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
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
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Quick Statistics (4 Items)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {homeData.stats.map((stat, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Value</label>
                          <input 
                            value={stat.val}
                            onChange={(e) => updateArrayItem('stats', i, 'val', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-black text-slate-800 text-xl focus:border-indigo-500 outline-none transition-all mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Label</label>
                          <input 
                            value={stat.label}
                            onChange={(e) => updateArrayItem('stats', i, 'label', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-700 text-xs focus:border-indigo-500 outline-none transition-all mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtext</label>
                          <input 
                            value={stat.sub}
                            onChange={(e) => updateArrayItem('stats', i, 'sub', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-500 text-xs focus:border-indigo-500 outline-none transition-all mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WELCOME TAB */}
              {activeTab === 'welcome' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Welcome / About Section</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Small Heading</label>
                        <input 
                          value={homeData.welcome.subtitle}
                          onChange={(e) => updateNestedData('welcome', 'subtitle', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Title</label>
                        <input 
                          value={homeData.welcome.title}
                          onChange={(e) => updateNestedData('welcome', 'title', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paragraph 1</label>
                      <textarea 
                        value={homeData.welcome.p1}
                        onChange={(e) => updateNestedData('welcome', 'p1', e.target.value)}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-medium text-slate-600 text-sm focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Paragraph 2</label>
                      <textarea 
                        value={homeData.welcome.p2}
                        onChange={(e) => updateNestedData('welcome', 'p2', e.target.value)}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-medium text-slate-600 text-sm focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Button Text</label>
                        <input 
                          value={homeData.welcome.button}
                          onChange={(e) => updateNestedData('welcome', 'button', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                       <div className="space-y-2">
                         <ImageUploadField
                           label="Image URL"
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
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Features (Our DNA)</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Small Heading</label>
                      <input 
                        value={homeData.features.subtitle}
                        onChange={(e) => updateNestedData('features', 'subtitle', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Title</label>
                      <input 
                        value={homeData.features.title}
                        onChange={(e) => updateNestedData('features', 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {homeData.features.items.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateNestedArrayItem('features', 'items', i, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tag</label>
                            <input 
                              value={item.tag}
                              onChange={(e) => updateNestedArrayItem('features', 'items', i, 'tag', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-700 text-xs outline-none mt-1"
                            />
                          </div>
                          <div className="col-span-3">
                            <ImageUploadField
                              label="Icon URL"
                              value={item.icon}
                              onChange={(url) => updateNestedArrayItem('features', 'items', i, 'icon', url)}
                              isSmall
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                          <textarea 
                            value={item.desc}
                            onChange={(e) => updateNestedArrayItem('features', 'items', i, 'desc', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-xs outline-none mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WHY CHOOSE TAB */}
              {activeTab === 'whyChoose' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Why Choose Gyansthali?</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Title</label>
                      <input 
                        value={homeData.whyChoose.title}
                        onChange={(e) => updateNestedData('whyChoose', 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subtitle Description</label>
                      <input 
                        value={homeData.whyChoose.subtitle}
                        onChange={(e) => updateNestedData('whyChoose', 'subtitle', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-700 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">6 Bullet Points</label>
                    <div className="grid grid-cols-2 gap-4">
                      {homeData.whyChoose.points.map((point, i) => (
                        <input 
                          key={i}
                          value={point}
                          onChange={(e) => updateStringArrayItem('whyChoose', 'points', i, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 text-sm outline-none"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* NEWS TAB */}
              {activeTab === 'news' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Latest News & Resources</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Small Heading</label>
                      <input 
                        value={homeData.news.subtitle}
                        onChange={(e) => updateNestedData('news', 'subtitle', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Title</label>
                      <input 
                        value={homeData.news.title}
                        onChange={(e) => updateNestedData('news', 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {homeData.news.items.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                            <input 
                              value={item.date}
                              onChange={(e) => updateNestedArrayItem('news', 'items', i, 'date', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                            <input 
                              value={item.title}
                              onChange={(e) => updateNestedArrayItem('news', 'items', i, 'title', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-700 text-sm outline-none mt-1"
                            />
                          </div>
                        </div>
                        <ImageUploadField
                          label="News Image URL"
                          value={item.img}
                          onChange={(url) => updateNestedArrayItem('news', 'items', i, 'img', url)}
                          isSmall
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LEADERSHIP TAB */}
              {activeTab === 'leadership' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
                  <h3 className="text-lg font-black text-slate-800 mb-4">Leadership Messages</h3>
                  
                  {['inspiration', 'principal'].map((type) => {
                    const data = homeData.leadership[type as 'inspiration'|'principal'];
                    return (
                      <div key={type} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        <h4 className="font-bold text-indigo-800 capitalize">{type} Block</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                            <input 
                              value={data.title}
                              onChange={(e) => updateNestedData('leadership', type, { ...data, title: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-sm mt-1 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Author</label>
                            <input 
                              value={data.author}
                              onChange={(e) => updateNestedData('leadership', type, { ...data, author: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-sm mt-1 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                            <input 
                              value={data.role}
                              onChange={(e) => updateNestedData('leadership', type, { ...data, role: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-sm mt-1 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quote / Message</label>
                          <textarea 
                            value={data.quote}
                            onChange={(e) => updateNestedData('leadership', type, { ...data, quote: e.target.value })}
                            rows={3}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-sm mt-1 outline-none"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ALUMNI TAB */}
              {activeTab === 'alumni' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Alumni Spotlight</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Small Heading</label>
                      <input 
                        value={homeData.alumni.subtitle}
                        onChange={(e) => updateNestedData('alumni', 'subtitle', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Title</label>
                      <input 
                        value={homeData.alumni.title}
                        onChange={(e) => updateNestedData('alumni', 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {homeData.alumni.items.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                          <input 
                            value={item.name}
                            onChange={(e) => updateNestedArrayItem('alumni', 'items', i, 'name', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                          <input 
                            value={item.role}
                            onChange={(e) => updateNestedArrayItem('alumni', 'items', i, 'role', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-700 text-xs outline-none mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Graduation Year</label>
                          <input 
                            value={item.year}
                            onChange={(e) => updateNestedArrayItem('alumni', 'items', i, 'year', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-500 text-xs outline-none mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TESTIMONIALS TAB */}
              {activeTab === 'testimonials' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Parent Testimonials</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Small Heading</label>
                      <input 
                        value={homeData.testimonials.subtitle}
                        onChange={(e) => updateNestedData('testimonials', 'subtitle', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Title</label>
                      <input 
                        value={homeData.testimonials.title}
                        onChange={(e) => updateNestedData('testimonials', 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {homeData.testimonials.items.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Name</label>
                            <input 
                              value={item.parent}
                              onChange={(e) => updateNestedArrayItem('testimonials', 'items', i, 'parent', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Child Details</label>
                            <input 
                              value={item.child}
                              onChange={(e) => updateNestedArrayItem('testimonials', 'items', i, 'child', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-700 text-xs outline-none mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quote</label>
                          <textarea 
                            value={item.quote}
                            onChange={(e) => updateNestedArrayItem('testimonials', 'items', i, 'quote', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-xs outline-none mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQS TAB */}
              {activeTab === 'faqs' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Frequently Asked Questions</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Small Heading</label>
                      <input 
                        value={homeData.faqs.subtitle}
                        onChange={(e) => updateNestedData('faqs', 'subtitle', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-bold text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Title</label>
                      <input 
                        value={homeData.faqs.title}
                        onChange={(e) => updateNestedData('faqs', 'title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 font-black text-slate-800 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {homeData.faqs.items.map((item, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question</label>
                          <input 
                            value={item.q}
                            onChange={(e) => updateNestedArrayItem('faqs', 'items', i, 'q', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-bold text-slate-800 text-sm outline-none mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Answer</label>
                          <textarea 
                            value={item.a}
                            onChange={(e) => updateNestedArrayItem('faqs', 'items', i, 'a', e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 font-medium text-slate-600 text-xs outline-none mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Quick Preview Note */}
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
