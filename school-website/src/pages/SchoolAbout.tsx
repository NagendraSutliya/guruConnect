import { useEffect, useState } from "react";
import SchoolPageHeader from "../components/SchoolPageHeader";
import { 
  MdSchool, 
  MdHistory, 
  MdVisibility, 
  MdFlag, 
  MdFormatQuote, 
  MdCheckCircle,
  MdExplore,
  MdGroups,
  MdPsychology
} from "react-icons/md";
import api from "../api/axiosInstance";

const SchoolAbout = () => {
  const [fetching, setFetching] = useState(true);
  const [aboutData, setAboutData] = useState({
    bannerTitle: "Our Journey of Excellence",
    bannerSubtitle: "A dedicated journey of nurturing innovation, fostering character, and building a foundation for the next generation of leaders.",
    establishedYear: "ESTABLISHED 2020",
    mainTitle: "Where Tradition Meets Digital Innovation.",
    description: "Gyansthali Enlightening was founded in 2020 with a singular purpose: to bridge the gap between traditional educational values and the rapidly evolving digital landscape. We have grown into a premier institution known for our pedagogical excellence, state-of-the-art infrastructure, and commitment to holistic student development.",
    directorMessage: {
      name: "Mrs. Khushbu Soni",
      designation: "Founder & Director",
      quote: "At Gyansthali, we don't just teach subjects; we cultivate curiosity. Our mission is to prepare students not just for exams, but for a life of purpose, leadership, and continuous growth in an ever-changing world."
    },
    bannerImage: "/images/redesign/about_banner.png",
    directorImage: "/images/redesign/director.png",
    stats: [
      { label: "Successful Students", value: "500+" },
      { label: "Expert Educators", value: "25+" }
    ]
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/about');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          
          // Deep merge non-empty values
          setAboutData(prev => {
            const next = { ...prev };
            
            // Top level
            (Object.keys(incoming) as Array<keyof typeof incoming>).forEach(key => {
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

  return (
    <div className="bg-themeBg text-themeText overflow-hidden transition-colors duration-500">
      {/* Banner Section */}
      <SchoolPageHeader 
        title={aboutData.bannerTitle} 
        subtitle={aboutData.bannerSubtitle}
        bgImage={aboutData.bannerImage || "/images/redesign/about_banner.png"}
      />

      {/* Institute Detail Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <h5 className="text-xs font-black text-indigo-500 uppercase tracking-[0.4em]">
                  {aboutData.establishedYear}
                </h5>
                <h2 className="text-4xl md:text-5xl font-black text-themeText tracking-tighter leading-tight">
                  {aboutData.mainTitle}
                </h2>
              </div>
              <p className="text-themeTextSec text-base md:text-lg font-medium leading-relaxed">
                {aboutData.description}
              </p>
              <div className="grid grid-cols-2 gap-8">
                {(aboutData.stats || []).map((stat, i) => (
                  <div key={i}>
                    <h4 className="text-3xl font-black text-themeText mb-1">{stat.value}</h4>
                    <p className="text-[10px] font-black text-themeTextSec uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-indigo-600/20 blur-[60px] rounded-full group-hover:bg-indigo-600/30 transition-all duration-700" />
              <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-themeBorder shadow-2xl">
                <img src="/images/redesign/about_insight.png" alt="Institute View" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-themeBgSec via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Director's Message */}
      <section className="py-24 bg-themeBgSec border-y border-themeBorder relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-themeCard backdrop-blur-2xl rounded-[4rem] p-12 md:p-20 border border-themeBorder relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-indigo-500/10 pointer-events-none">
              <MdFormatQuote size={200} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
              <div className="lg:col-span-4">
                <div className="relative">
                  <div className="absolute -inset-4 bg-indigo-500/20 blur-[40px] rounded-full" />
                  <div className="relative aspect-square rounded-[3rem] overflow-hidden border-4 border-themeBorder shadow-2xl">
                    <img src={aboutData.directorImage || "/images/redesign/director.png"} alt="Director" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-themeText tracking-tight">From the Director's Desk</h3>
                  <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">{aboutData.directorMessage.name}, {aboutData.directorMessage.designation}</p>
                </div>
                <p className="text-themeTextSec text-lg md:text-xl font-medium leading-relaxed italic">
                  "{aboutData.directorMessage.quote}"
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div className="w-12 h-0.5 bg-indigo-500" />
                  <p className="text-xs font-black text-themeText uppercase tracking-widest">Leading with Vision since 2020</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Insights Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Our Philosophy</h5>
            <h2 className="text-4xl font-black text-themeText tracking-tight">Built on Three Core Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Inquiry Driven", 
                desc: "We encourage students to ask 'Why' before 'What', fostering a deep-rooted curiosity.", 
                icon: <MdExplore />,
                color: "indigo"
              },
              { 
                title: "Value Based", 
                desc: "Success without values is incomplete. We integrate ethical learning in every lesson.", 
                icon: <MdFlag />,
                color: "emerald"
              },
              { 
                title: "Future Ready", 
                desc: "Equipping students with AI literacy and digital fluency for the 21st century.", 
                icon: <MdPsychology />,
                color: "rose"
              }
            ].map((pillar, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-themeCard border border-themeBorder hover:bg-themeBgSec transition-all duration-500 text-center space-y-6">
                <div className={`w-20 h-20 rounded-3xl bg-${pillar.color}-500/10 flex items-center justify-center text-3xl text-${pillar.color}-400 mx-auto group-hover:scale-110 transition-transform`}>
                  {pillar.icon}
                </div>
                <h4 className="text-2xl font-black text-themeText">{pillar.title}</h4>
                <p className="text-sm text-themeTextSec font-medium leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolAbout;
