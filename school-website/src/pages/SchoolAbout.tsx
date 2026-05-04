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

const SchoolAbout = () => {
  return (
    <div className="bg-[#020617] text-white overflow-hidden">
      {/* Banner Section */}
      <SchoolPageHeader 
        title="Our Legacy of Excellence" 
        subtitle="A journey of nurturing minds, fostering innovation, and building a foundation for a brighter tomorrow."
        bgImage="/images/redesign/about_banner.png"
      />

      {/* Institute Detail Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                <h5 className="text-xs font-black text-indigo-500 uppercase tracking-[0.4em]">Established 2020</h5>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                  Where Tradition Meets <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Digital Innovation.</span>
                </h2>
              </div>
              <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
                Gyansthali Edu was founded with a singular purpose: to bridge the gap between traditional educational values and the rapidly evolving digital landscape. For over 25 years, we have been at the forefront of pedagogical innovation.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-3xl font-black text-white mb-1">2,500+</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Alumni</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white mb-1">150+</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expert Educators</p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-indigo-600/20 blur-[60px] rounded-full group-hover:bg-indigo-600/30 transition-all duration-700" />
              <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src="/images/redesign/about_insight.png" alt="Institute View" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Director's Message */}
      <section className="py-24 bg-slate-950/50 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-2xl rounded-[4rem] p-12 md:p-20 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-indigo-500/10 pointer-events-none">
              <MdFormatQuote size={200} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
              <div className="lg:col-span-4">
                <div className="relative">
                  <div className="absolute -inset-4 bg-indigo-500/20 blur-[40px] rounded-full" />
                  <div className="relative aspect-square rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-2xl">
                    <img src="/images/redesign/director.png" alt="Director" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-8 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white tracking-tight">From the Director's Desk</h3>
                  <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">Dr. Ananya Sharma, Founder & Director</p>
                </div>
                <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed italic">
                  "At Gyansthali, we don't just teach subjects; we cultivate curiosity. Our mission is to prepare students not just for exams, but for a life of purpose, leadership, and continuous growth in an ever-changing world."
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div className="w-12 h-0.5 bg-indigo-500" />
                  <p className="text-xs font-black text-white uppercase tracking-widest">Leading with Vision since 2020</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Insights Grid */}
      <section className="py-24 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">The Pillars of Gyansthali</h5>
            <h2 className="text-4xl font-black text-white tracking-tight">Our Core Philosophy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: <MdHistory />, 
                title: "Rich Heritage", 
                desc: "Over two decades of excellence, blending deep-rooted values with progressive educational frameworks." 
              },
              { 
                icon: <MdVisibility />, 
                title: "Future Ready", 
                desc: "Equipping students with critical thinking and technical skills essential for the AI-driven era." 
              },
              { 
                icon: <MdFlag />, 
                title: "Leadership", 
                desc: "Nurturing the leaders of tomorrow through discipline, ethics, and a global perspective." 
              },
              { 
                icon: <MdPsychology />, 
                title: "Holistic Growth", 
                desc: "Balanced focus on mental agility, physical fitness, and emotional intelligence." 
              },
              { 
                icon: <MdExplore />, 
                title: "Campus Culture", 
                desc: "A vibrant environment that encourages exploration, creativity, and collaboration." 
              },
              { 
                icon: <MdGroups />, 
                title: "Community", 
                desc: "A tight-knit ecosystem of parents, teachers, and students working towards a common goal." 
              },
            ].map((item, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-3xl text-indigo-400 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl shadow-indigo-500/5">
                  {item.icon}
                </div>
                <h4 className="text-xl font-black text-white tracking-tight mb-4">{item.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}


      {/* Milestones Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4">Our Journey</h5>
            <h2 className="text-4xl font-black text-white tracking-tight">Major Milestones</h2>
          </div>

          <div className="space-y-12 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent hidden md:block" />
            
            {[
              { year: "2020", title: "The Foundation", desc: "Started with 50 students and a vision to redefine elementary education." },
              { year: "2022", title: "Secondary Wing", desc: "Inaugurated our state-of-the-art secondary wing and science laboratories." },
              { year: "2024", title: "Digital Transformation", desc: "First school in the region to adopt fully interactive smart boards." },
              { year: "2026", title: "Global Recognition", desc: "Awarded 'Best Innovation in Education' at the International Edu Summit." },
              { year: "2027", title: "AI-First Campus", desc: "Integrating AI-assisted learning and personalized growth tracking." },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 flex justify-center">
                  <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-xl relative group hover:bg-white/[0.08] transition-all w-full">
                    <div className="text-3xl font-black text-indigo-500 mb-2">{item.year}</div>
                    <h4 className="text-xl font-black text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <div className="hidden md:flex w-10 h-10 rounded-full bg-slate-900 border-4 border-indigo-600/50 items-center justify-center relative z-10">
                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                </div>
                <div className="md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolAbout;
