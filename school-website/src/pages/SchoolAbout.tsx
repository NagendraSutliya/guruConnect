import { useEffect, useState } from "react";
import SchoolPageHeader from "../components/SchoolPageHeader";
import { 
  MdFlag, 
  MdVisibility,
  MdFormatQuote, 
  MdGroups,
} from "react-icons/md";
import api from "../api/axiosInstance";

const getInitials = (name: string) => {
  if (!name) return "";
  // Remove common titles
  const cleanedName = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Mr|Mrs|Ms|Dr|Prof)\s+/i, '');
  return cleanedName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
};

const SchoolAbout = () => {
  const [fetching, setFetching] = useState(true);
  const [aboutData, setAboutData] = useState({
    bannerTitle: "About Our Institute",
    bannerSubtitle: "Nurturing innovation, fostering character, and building leaders.",
    establishedYear: "ESTABLISHED 2020",
    mainTitle: "Where Tradition Meets Digital Innovation",
    description: "Gyansthali Enlightening was founded in 2020 with a singular purpose: to bridge the gap between traditional educational values and the rapidly evolving digital landscape. We have grown into a premier institution known for our pedagogical excellence, state-of-the-art infrastructure, and commitment to holistic student development.",
    directorMessage: {
      name: "Mr. Prashant Singh",
      designation: "Founder & Director",
      quote: "At Gyansthali, we don't just teach subjects; we cultivate curiosity. Our mission is to prepare students not just for exams, but for a life of purpose, leadership, and continuous growth in an ever-changing world."
    },
    bannerImage: "/images/redesign/about_banner.png",
    directorImage: "/images/redesign/director.png",
    stats: [
      { label: "Successful Students", value: "500+" },
      { label: "Expert Educators", value: "25+" }
    ],
    mission: "To empower students with the knowledge, skills, and values required to thrive in a rapidly changing world.",
    vision: "To be a global leader in innovative education, fostering a community of lifelong learners and responsible citizens.",
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
    <div className="text-themeText min-h-screen transition-colors duration-500 pb-16 bg-themeBg">
      <SchoolPageHeader 
        title="Our Journey of Excellence"
        subtitle="A dedicated journey of nurturing innovation, fostering character, and building a foundation for the next generation of leaders."
        bgImage={aboutData.bannerImage || "/images/redesign/about_banner.png"}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 space-y-16">
        
        {/* Intro Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          <div className="md:col-span-7 space-y-5">
            <span className="text-[10px] font-bold text-green-500 dark:text-indigo-400 uppercase tracking-wider">
              {aboutData.establishedYear}
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-themeText leading-[1.1] tracking-tight">
              {aboutData.mainTitle}
            </h2>
            <p className="text-themeTextSec text-base md:text-lg leading-relaxed font-medium">
              {aboutData.description}
            </p>
            <div className="flex flex-wrap gap-8 md:gap-12 pt-4 md:pt-6">
              {(aboutData.stats || []).map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-black text-green-500 dark:text-indigo-400 mb-1">{stat.value}</div>
                  <div className="text-[10px] font-semibold text-themeTextSec uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-5 relative rounded-[2rem] overflow-hidden aspect-[4/3] border border-themeBorder/50 shadow-xl">
             <img src="/images/redesign/about_insight.png" alt="Institute" className="w-full h-full object-cover" />
          </div>
        </div>

        <hr className="border-themeBorder/50 my-16" />

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Mission Card */}
          <div className="relative group rounded-[2rem] p-6 md:p-10 border border-themeBorder bg-themeCard hover:border-emerald-500/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1">
             {/* Dynamic background glow */}
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
             
             <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="flex items-center gap-4 md:block mb-4 md:mb-0">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500/10 rounded-2xl flex shrink-0 items-center justify-center group-hover:-translate-y-1 transition-transform duration-500 md:mb-6">
                   <MdFlag className="text-emerald-500 text-2xl md:text-3xl" />
                 </div>
                 <h3 className="text-xl font-black text-themeText tracking-tight md:hidden">Our Mission</h3>
               </div>
               <div>
                 <h3 className="hidden md:block text-2xl font-black text-themeText mb-3 tracking-tight">Our Mission</h3>
                 <p className="text-sm md:text-base text-themeTextSec leading-relaxed font-medium">{aboutData.mission}</p>
               </div>
             </div>
          </div>

          {/* Vision Card */}
          <div className="relative group rounded-[2rem] p-6 md:p-10 border border-themeBorder bg-themeCard hover:border-blue-500/30 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1">
             {/* Dynamic background glow */}
             <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
             
             <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="flex items-center gap-4 md:block mb-4 md:mb-0">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-500/10 rounded-2xl flex shrink-0 items-center justify-center group-hover:-translate-y-1 transition-transform duration-500 md:mb-6">
                   <MdVisibility className="text-blue-500 text-2xl md:text-3xl" />
                 </div>
                 <h3 className="text-xl font-black text-themeText tracking-tight md:hidden">Our Vision</h3>
               </div>
               <div>
                 <h3 className="hidden md:block text-2xl font-black text-themeText mb-3 tracking-tight">Our Vision</h3>
                 <p className="text-sm md:text-base text-themeTextSec leading-relaxed font-medium">{aboutData.vision}</p>
               </div>
             </div>
          </div>
        </div>

        <hr className="border-themeBorder/50 my-16" />

        {/* Director Message */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-center">
           <div className="flex justify-center md:justify-end">
              <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[2rem] md:rounded-full border border-themeBorder/50 overflow-hidden bg-themeBgSec">
                 <img src={aboutData.directorImage || "/images/redesign/director.png"} alt="Director" className="w-full h-full object-cover" />
              </div>
           </div>
           <div className="space-y-5 text-center md:text-left relative">
              {/* <MdFormatQuote className="absolute -top-16 -left-4 md:-left-12 text-themeBorder/30 text-2xl md:text-5xl -z-10" /> */}
              <p className="text-base md:text-lg lg:text-xl font-semibold leading-relaxed text-themeText italic">
                "{aboutData.directorMessage.quote}"
              </p>
              <div>
                <h4 className="font-bold text-lg text-themeText">{aboutData.directorMessage.name}</h4>
                <p className="text-green-500 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">{aboutData.directorMessage.designation}</p>
              </div>
           </div>
        </div>

        <hr className="border-themeBorder/50 my-16" />

        {/* Staff Section */}
        <div>
           <div className="flex flex-col items-center justify-center gap-3 mb-12 text-center">
              <div className="w-12 h-12 bg-green-500/10 dark:bg-indigo-500/10 rounded-full flex items-center justify-center">
                 <MdGroups className="text-green-500 dark:text-indigo-400 text-2xl" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-themeText">Our Core Team</h3>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {aboutData.staff.map((member, i) => (
                <div key={i} className="text-center group">
                   <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full mb-4 overflow-hidden border border-themeBorder/50 bg-themeBgSec group-hover:border-green-500 dark:group-hover:border-indigo-400 transition-colors flex items-center justify-center">
                     {member.image ? (
                       <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <span className="text-3xl md:text-4xl font-bold text-themeTextSec group-hover:text-green-500 dark:group-hover:text-indigo-400 transition-colors">
                         {getInitials(member.name)}
                       </span>
                     )}
                   </div>
                   <h5 className="text-base font-bold text-themeText mb-1">{member.name}</h5>
                   <p className="text-[10px] text-themeTextSec font-semibold uppercase tracking-wider">{member.role}</p>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default SchoolAbout;
