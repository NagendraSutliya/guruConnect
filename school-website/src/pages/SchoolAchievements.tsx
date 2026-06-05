import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import SchoolPageHeader from "../components/SchoolPageHeader";
import { 
  MdEmojiEvents, 
  MdStars, 
  MdTrendingUp, 
  MdGroups,
  MdLocationOn,
  MdFormatQuote,
  MdArrowForward
} from "react-icons/md";

const SchoolAchievements = () => {
  const [fetching, setFetching] = useState(true);
  const [achievementsData, setAchievementsData] = useState({
    bannerTitle: "Our Hall of Fame",
    bannerSubtitle: "Celebrating the exceptional milestones of our students and the institution's commitment to excellence.",
    bannerImage: "/images/redesign/achievements_banner.png",
    stats: [
      { label: "Board Results", value: "100%", sub: "Passing Rate", icon: "MdTrendingUp" },
      { label: "State Toppers", value: "25+", sub: "In Last 5 Years", icon: "MdEmojiEvents" },
      { label: "Sports Trophies", value: "150+", sub: "Inter-School Wins", icon: "MdStars" },
      { label: "Global Alumni", value: "500+", sub: "In Elite Universities", icon: "MdGroups" },
    ],
    toppers: [
      { name: "Rahul Singh", score: "98.8%", class: "Class XII - Science", rank: "District Rank 1" },
      { name: "Sanya Malhotra", score: "98.2%", class: "Class XII - Commerce", rank: "District Rank 3" },
      { name: "Aryan Verma", score: "97.5%", class: "Class X", rank: "City Rank 1" },
    ],
    awards: [
      { award: "Best Innovation in STEM", body: "National Edu Council 2025" },
      { award: "Cleanest Campus Award", body: "City Municipal Board 2024" },
      { award: "Excellence in Digital Learning", body: "Global Tech Summit 2026" },
    ]
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
              // Filter out empty objects in arrays
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

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'MdTrendingUp': return <MdTrendingUp />;
      case 'MdEmojiEvents': return <MdEmojiEvents />;
      case 'MdStars': return <MdStars />;
      case 'MdGroups': return <MdGroups />;
      default: return <MdEmojiEvents />;
    }
  };
  return (
    <div className="bg-themeBg text-themeText overflow-hidden transition-colors duration-500">
      <SchoolPageHeader 
        title={achievementsData.bannerTitle} 
        subtitle={achievementsData.bannerSubtitle}
        bgImage={achievementsData.bannerImage || "/images/redesign/achievements_banner.png"}
      />

      {/* Stats Summary Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(achievementsData.stats || []).map((stat, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-themeCard border border-themeBorder text-center group hover:bg-themeBgSec hover:border-indigo-500/30 transition-all duration-500 animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center text-3xl mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-xl">
                  {getIcon(stat.icon)}
                </div>
                <h3 className="text-4xl font-black text-themeText mb-2 tracking-tighter group-hover:text-indigo-400 transition-colors">{stat.value}</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-[8px] font-bold text-themeTextSec uppercase tracking-widest">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Toppers Grid */}
      <section className="py-24 bg-themeBgSec border-y border-themeBorder">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Academic Stars</h5>
             <h2 className="text-4xl font-black text-themeText tracking-tight">Board Exam Toppers 2026</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {(achievementsData.toppers || []).map((topper, i) => (
              <div key={i} className="relative group animate-fadeIn" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition-all duration-700" />
                <div className="relative p-10 rounded-[3.5rem] bg-themeCard border border-themeBorder group-hover:border-indigo-500/30 transition-all duration-500 space-y-8 text-center overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-indigo-500/5 pointer-events-none group-hover:text-indigo-500/10 transition-colors">
                    <MdStars size={80} />
                  </div>
                  
                  <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-600/10 border-2 border-indigo-600/20 mx-auto flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:border-indigo-500 transition-all duration-700 shadow-2xl relative z-10">
                     <div className="text-5xl font-black text-indigo-400 group-hover:text-themeText transition-colors">{topper.name.charAt(0)}</div>
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    <h4 className="text-2xl font-black text-themeText tracking-tight">{topper.name}</h4>
                    <p className="text-[11px] font-black text-themeTextSec uppercase tracking-[0.2em]">{topper.class}</p>
                    <div className="pt-6 mt-6 border-t border-themeBorder space-y-1">
                       <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{topper.score}</p>
                       <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">{topper.rank}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Awards */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Recognition</h5>
              <h2 className="text-4xl font-black text-themeText tracking-tight leading-tight">National & Global <br />Accolades</h2>
              <p className="text-themeTextSec font-medium leading-relaxed">
                Gyansthali Enlightening has been consistently recognized as one of the most innovative and value-driven institutions in the region.
              </p>
            </div>

            <div className="space-y-4">
              {achievementsData.awards?.map((award, i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-themeCard border border-themeBorder hover:bg-themeBgSec transition-all group">
                   <MdEmojiEvents className="text-indigo-500 text-3xl group-hover:scale-125 transition-transform" />
                   <div>
                      <h5 className="text-sm font-black text-themeText uppercase tracking-tight">{award.award}</h5>
                      <p className="text-[10px] text-themeTextSec font-bold">{award.body}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-10 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative bg-themeCard backdrop-blur-2xl p-12 rounded-[4rem] border border-themeBorder shadow-2xl space-y-8">
               <MdFormatQuote size={48} className="text-indigo-500/20" />
               <p className="text-lg md:text-xl font-medium text-themeTextSec leading-relaxed italic">
                 "Our achievements are a testament to the hard work of our students, the dedication of our faculty, and the unwavering support of our parent community."
               </p>
               <div className="flex items-center gap-4 pt-6 border-t border-themeBorder">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white">GS</div>
                  <div>
                    <p className="text-sm font-black text-themeText">Institutional Council</p>
                    <p className="text-[8px] font-black text-themeTextSec uppercase tracking-widest">Gyansthali Education Group</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-12 md:p-20 rounded-[4rem] bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
             <div className="relative z-10 space-y-4 max-w-xl">
                <h2 className="text-4xl font-black tracking-tight leading-tight">Be part of our next success story.</h2>
                <p className="text-indigo-100 font-medium">Join an institution where your potential is nurtured into excellence.</p>
             </div>
             <button className="relative z-10 flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 shrink-0">
                Start Your Journey
                <MdArrowForward size={20} />
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolAchievements;
