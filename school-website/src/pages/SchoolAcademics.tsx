import SchoolPageHeader from "../components/SchoolPageHeader";
import { 
  MdLibraryBooks, 
  MdNaturePeople, 
  MdLightbulb, 
  MdLanguage,
  MdAutoGraph,
  MdPsychology,
  MdScience,
  MdComputer,
  MdBrush,
  MdMenuBook
} from "react-icons/md";

import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const SchoolAcademics = () => {
  const [fetching, setFetching] = useState(true);
  const [academicsData, setAcademicsData] = useState({
    bannerTitle: "A Future-Ready Curriculum",
    bannerSubtitle: "We follow a research-backed instructional model that evolves with the student, from sensory-based discovery to advanced analytical specialization.",
    bannerImage: "/images/redesign/academics_banner.png",
    phases: [
      { phase: "Phase 01", title: "The Foundation", years: "Nursery - KG", desc: "Focus on sensory exploration, motor skills, and social development through play-based immersion.", color: "emerald" },
      { phase: "Phase 02", title: "Discovery & Grit", years: "Grade 1 - 5", desc: "Building strong foundations in literacy, numeracy, and environmental awareness with hands-on projects.", color: "amber" },
      { phase: "Phase 03", title: "Analytical Minds", years: "Grade 6 - 8", desc: "Introduction to specialized sciences, logic, and critical thinking to bridge the gap to higher studies.", color: "indigo" },
      { phase: "Phase 04", title: "Global Readiness", years: "Grade 9 - 12", desc: "Career-oriented focus with advanced science, commerce, and humanities pathways for university prep.", color: "rose" }
    ],
    infrastructureTitle: "Beyond the Textbook",
    infrastructureDesc: "Learning at Gyansthali isn't confined to four walls. We provide an ecosystem where students apply theoretical knowledge in world-class facilities.",
    infrastructureItems: [
      { title: "Smart Labs", desc: "Equipped with the latest STEM kits and AI tools.", icon: "MdComputer" },
      { title: "Digital Library", desc: "Access to 10k+ e-books and international journals.", icon: "MdMenuBook" },
      { title: "Creative Studios", desc: "Dedicated spaces for performing and visual arts.", icon: "MdBrush" },
      { title: "Linguistic Lab", desc: "Enhancing communication skills through digital aid.", icon: "MdLanguage" },
    ],
    labImage: "/images/redesign/academics_lab.png",
    departments: [
      { name: "STEM Research" },
      { name: "Linguistic Arts" },
      { name: "Performing Arts" },
      { name: "Athletic Excellence" }
    ]
  });

  useEffect(() => {
    const fetchAcademicsData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/academics');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          const cleanData: any = {};
          
          Object.keys(incoming).forEach(key => {
            const val = incoming[key];
            if (Array.isArray(val)) {
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
          
          setAcademicsData(prev => ({ ...prev, ...cleanData }));
        }
      } catch (error) {
        console.error("Error fetching academics data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchAcademicsData();
  }, []);

  return (
    <div className="bg-themeBg text-themeText overflow-hidden transition-colors duration-500">
      <SchoolPageHeader 
        title={academicsData.bannerTitle} 
        subtitle={academicsData.bannerSubtitle}
        bgImage={academicsData.bannerImage || "/images/redesign/academics_banner.png"}
      />

      {/* Curriculum Narrative Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">The Pedagogy</h5>
          <h2 className="text-4xl font-black text-themeText tracking-tight leading-tight">
            Our Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Continuous Growth</span>
          </h2>
          <p className="text-themeTextSec max-w-2xl mx-auto font-medium">
            We follow a balanced instructional model that evolves with the student, from sensory-based play to advanced analytical specialization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(academicsData.phases || []).map((step, i) => (
            <div key={i} className="group p-8 rounded-[3rem] bg-themeCard border border-themeBorder hover:bg-themeBgSec hover:border-indigo-500/30 transition-all duration-700 relative overflow-hidden animate-fadeIn" style={{ animationDelay: `${i * 150}ms` }}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${step.color || 'indigo'}-500/5 blur-3xl rounded-full transition-all group-hover:scale-150`} />
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                   <div className={`w-16 h-16 rounded-2xl bg-${step.color || 'indigo'}-500/10 flex items-center justify-center text-3xl text-${step.color || 'indigo'}-400 group-hover:bg-${step.color || 'indigo'}-500 group-hover:text-white transition-all duration-500 shadow-2xl`}>
                      <MdLightbulb />
                   </div>
                   <span className="text-[10px] font-black text-themeTextSec uppercase tracking-widest">{step.phase}</span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-themeText tracking-tight group-hover:text-indigo-400 transition-colors">{step.title}</h4>
                  <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">{step.years}</p>
                  <p className="text-xs text-themeTextSec font-bold leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beyond the Classroom */}
      <section className="py-24 bg-themeBgSec border-y border-themeBorder relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-10 bg-indigo-500/10 blur-[80px] rounded-full" />
              <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-themeBorder shadow-2xl">
                 <img src="/images/redesign/academics_lab.png" alt="Science Lab" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-themeBgSec to-transparent opacity-60" />
              </div>
              <div className="absolute -bottom-6 -left-6 p-6 bg-themeCard border border-themeBorder rounded-3xl shadow-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center"><MdScience size={20} /></div>
                    <p className="text-xs font-black uppercase tracking-widest">Innovation Hub</p>
                 </div>
              </div>
            </div>

            <div className="space-y-10 order-1 lg:order-2">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">{academicsData.infrastructureTitle ? 'The Infrastructure' : ''}</h5>
                <h2 className="text-4xl md:text-5xl font-black text-themeText tracking-tighter leading-tight">{academicsData.infrastructureTitle || "Beyond the Textbook"}</h2>
                <p className="text-themeTextSec font-bold leading-relaxed text-sm opacity-80">
                  {academicsData.infrastructureDesc || "Learning at Gyansthali isn't confined to four walls. We provide an ecosystem where students apply theoretical knowledge in world-class facilities."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(academicsData.infrastructureItems || []).map((item, i) => (
                  <div key={i} className="flex gap-5 p-6 rounded-[2rem] bg-themeBg border border-themeBorder hover:bg-themeCard hover:border-indigo-500/30 transition-all duration-500 group">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                      {item.icon === "MdComputer" && <MdComputer size={24} />}
                      {item.icon === "MdMenuBook" && <MdMenuBook size={24} />}
                      {item.icon === "MdBrush" && <MdBrush size={24} />}
                      {item.icon === "MdLanguage" && <MdLanguage size={24} />}
                      {!["MdComputer", "MdMenuBook", "MdBrush", "MdLanguage"].includes(item.icon) && <MdScience size={24} />}
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-black text-sm uppercase tracking-wider text-themeText">{item.title}</h5>
                      <p className="text-[11px] text-themeTextSec font-bold leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pedagogical Excellence */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 relative overflow-hidden text-center md:text-left">
           <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl space-y-6">
                 <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Methodology That Works</h2>
                 <p className="text-indigo-100 font-medium leading-relaxed">
                   Our 'Inquiry-Based Learning' model encourages students to ask 'Why' before 'What'. This fosters a deep-rooted curiosity that stays with them long after they leave our campus.
                 </p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {["Practical focus", "AI Integration", "Value Based", "Global Standards"].map((tag, i) => (
                      <span key={i} className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">{tag}</span>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 shrink-0">
                 <div className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/10 text-center">
                    <p className="text-3xl font-black text-white">1:25</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-200">Teacher-Student Ratio</p>
                 </div>
                 <div className="p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/10 text-center">
                    <p className="text-3xl font-black text-white">100%</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-200">Digital Literacy</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Specialized Departments */}
      <section className="py-24 border-t border-themeBorder">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl font-black text-themeText tracking-tight">Specialized Departments</h2>
             <p className="text-themeTextSec text-sm font-medium">Expertise across diverse academic and creative domains.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(academicsData.departments || []).map((dept, i) => (
              <div key={i} className="group p-6 rounded-3xl bg-themeCard border border-themeBorder hover:border-indigo-500/50 hover:bg-themeBgSec transition-all duration-500 text-center space-y-4 animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-indigo-400 text-2xl mx-auto group-hover:scale-125 transition-transform duration-500">
                   {dept.name.toLowerCase().includes('stem') && <MdComputer />}
                   {dept.name.toLowerCase().includes('linguistic') && <MdLanguage />}
                   {dept.name.toLowerCase().includes('arts') && <MdBrush />}
                   {dept.name.toLowerCase().includes('athletic') && <MdNaturePeople />}
                   {!['stem', 'linguistic', 'arts', 'athletic'].some(k => dept.name.toLowerCase().includes(k)) && <MdLibraryBooks />}
                </div>
                <p className="font-black text-themeTextSec text-[10px] uppercase tracking-[0.2em] group-hover:text-themeText transition-colors">{dept.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolAcademics;
