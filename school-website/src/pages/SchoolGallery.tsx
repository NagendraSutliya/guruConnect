import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import SchoolPageHeader from "../components/SchoolPageHeader";
import { MdImage, MdPhotoLibrary } from "react-icons/md";

const SchoolGallery = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [fetching, setFetching] = useState(true);
  const [galleryData, setGalleryData] = useState({
    title: "Visual Journey",
    subtitle: "Explore the vibrant life at Gyansthali through our lens—from infrastructure to historic achievements.",
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

  const categories = ["All", "Campus", "Events", "Sports", "Toppers"];
  const items = galleryData?.items || [];
  const filteredItems = activeTab === "All" ? items : items.filter(item => item.category === activeTab);

  return (
    <div className="bg-[#020617] text-white overflow-hidden">
      <SchoolPageHeader 
        title="Visual Journey" 
        subtitle="Explore the vibrant life at Gyansthali through our lens—from infrastructure to historic achievements."
        bgImage="/images/redesign/about_banner.png"
      />

      <section className="py-24 max-w-7xl mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border-b border-white/5 pb-8">
           <div className="flex items-center gap-3 text-indigo-400">
              <MdPhotoLibrary size={24} />
              <h2 className="text-2xl font-black text-white tracking-tight">Media Hub</h2>
           </div>

           <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === cat 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white"
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
              className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 animate-fadeIn"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">{item.category}</span>
                <h4 className="text-sm font-black text-white tracking-tight mt-1">{item.title}</h4>
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                 <MdImage className="text-white" size={20} />
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-40 text-center space-y-4">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700">
                <MdImage size={40} />
             </div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No images found in this category</p>
          </div>
        )}
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
           <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Every Frame Tells a <br />Success Story</h2>
           <p className="text-indigo-100 font-medium leading-relaxed">
             Our gallery is more than just photos; it's a testament to the vibrant culture, academic rigor, and creative freedom that defines the Gyansthali experience.
           </p>
           <div className="flex justify-center gap-12 pt-8">
              {[
                { val: "500+", label: "Memories" },
                { val: "50+", label: "Annual Events" },
                { val: "25+", label: "Years Legacy" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                   <p className="text-3xl font-black text-white mb-1">{stat.val}</p>
                   <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolGallery;
