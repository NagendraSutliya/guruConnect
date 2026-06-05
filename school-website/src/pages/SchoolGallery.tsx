import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import SchoolPageHeader from "../components/SchoolPageHeader";
import { MdImage, MdPhotoLibrary } from "react-icons/md";

const SchoolGallery = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [fetching, setFetching] = useState(true);
  const [galleryData, setGalleryData] = useState({
    bannerTitle: "Visual Journey",
    bannerSubtitle: "Explore the vibrant life at Gyansthali through our lens—from infrastructure to historic achievements.",
    bannerImage: "/images/redesign/about_banner.png",
    items: [
      { title: "Modern Science Lab", category: "Campus", img: "/images/redesign/academics_lab.png" },
      { title: "Annual Day 2026 Celebration", category: "Events", img: "/images/redesign/gallery_event.png" },
      { title: "Inter-School Basketball Finals", category: "Sports", img: "/images/redesign/gallery_sports.png" },
      { title: "Academic Board Toppers 2026", category: "Toppers", img: "/images/redesign/achievements_banner.png" },
      { title: "Majestic Campus Entrance", category: "Campus", img: "/images/redesign/about_banner.png" },
      { title: "Digital Research Library", category: "Campus", img: "/images/redesign/about_insight.png" },
      { title: "Parent Counseling Center", category: "Campus", img: "/images/redesign/admissions_banner.png" },
      { title: "Smart Classroom 4.0", category: "Campus", img: "/images/redesign/classroom.png" },
    ]
  });

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/gallery');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          const cleanData: any = {};
          Object.keys(incoming).forEach(key => {
            if (Array.isArray(incoming[key])) {
              if (incoming[key].length > 0) cleanData[key] = incoming[key];
            } else if (incoming[key] && incoming[key] !== "") {
              cleanData[key] = incoming[key];
            }
          });
          setGalleryData(prev => ({ ...prev, ...cleanData }));
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchGalleryData();
  }, []);

  const items = galleryData?.items || [];
  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];
  const filteredItems = activeTab === "All" ? items : items.filter(item => item.category === activeTab);

  return (
    <div className="bg-themeBg text-themeText overflow-hidden transition-colors duration-500">
      <SchoolPageHeader 
        title={galleryData.bannerTitle} 
        subtitle={galleryData.bannerSubtitle}
        bgImage={galleryData.bannerImage || "/images/redesign/about_banner.png"}
      />

      <section className="py-24 max-w-7xl mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border-b border-themeBorder pb-8">
           <div className="flex items-center gap-3 text-indigo-400">
              <MdPhotoLibrary size={24} />
              <h2 className="text-2xl font-black text-themeText tracking-tight">Media Hub</h2>
           </div>

           <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                    activeTab === cat 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-themeCard text-themeTextSec hover:bg-themeBgSec hover:text-themeText border border-themeBorder"
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, i) => (
            <div 
              key={i} 
              className="group relative aspect-square rounded-[2.5rem] overflow-hidden border border-themeBorder bg-themeCard animate-fadeIn shadow-2xl"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-themeBgSec via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                <span className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">
                   {item.category}
                </span>
                <h4 className="text-sm font-black text-themeText tracking-tight mt-3 leading-snug">{item.title}</h4>
              </div>

              <div className="absolute top-6 right-6 w-12 h-12 rounded-[1.2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 duration-500">
                 <MdImage className="text-white" size={24} />
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-40 text-center space-y-6">
             <div className="w-24 h-24 bg-themeCard border border-themeBorder rounded-full flex items-center justify-center mx-auto text-themeTextSec animate-pulse">
                <MdImage size={48} />
             </div>
             <p className="text-themeTextSec font-black uppercase tracking-[0.3em] text-[10px]">No memories found in this category</p>
          </div>
        )}
      </section>

      {/* Experience Section */}
      <section className="py-32 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-10">
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">Every Frame Tells a <br />Success Story</h2>
           <p className="text-indigo-100 font-bold leading-relaxed max-w-2xl mx-auto opacity-80">
             Our gallery is more than just photos; it's a testament to the vibrant culture, academic rigor, and creative freedom that defines the Gyansthali experience.
           </p>
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-10 border-t border-white/20">
              {[
                { val: "500+", label: "Memories" },
                { val: "50+", label: "Annual Events" },
                { val: "25+", label: "Years Legacy" }
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                   <p className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-500">{stat.val}</p>
                   <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest opacity-60">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolGallery;
