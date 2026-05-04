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
  return (
    <div className="bg-[#020617] text-white overflow-hidden">
      <SchoolPageHeader 
        title="Our Hall of Fame" 
        subtitle="Celebrating the exceptional milestones of our students and the institution's commitment to excellence."
        bgImage="/images/redesign/achievements_banner.png"
      />

      {/* Stats Summary Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Board Results", val: "100%", sub: "Passing Rate", icon: <MdTrendingUp /> },
              { label: "State Toppers", val: "25+", sub: "In Last 5 Years", icon: <MdEmojiEvents /> },
              { label: "Sports Trophies", val: "150+", sub: "Inter-School Wins", icon: <MdStars /> },
              { label: "Global Alumni", val: "2.5k+", sub: "In Elite Universities", icon: <MdGroups /> },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 text-center group hover:bg-white/[0.08] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center text-2xl mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.val}</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Toppers Grid */}
      <section className="py-24 bg-slate-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Academic Stars</h5>
             <h2 className="text-4xl font-black text-white tracking-tight">Board Exam Toppers 2026</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Rahul Singh", score: "98.8%", class: "Class XII - Science", rank: "District Rank 1" },
              { name: "Sanya Malhotra", score: "98.2%", class: "Class XII - Commerce", rank: "District Rank 3" },
              { name: "Aryan Verma", score: "97.5%", class: "Class X", rank: "City Rank 1" },
            ].map((topper, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition-all" />
                <div className="relative p-10 rounded-[3rem] bg-slate-900 border border-white/5 space-y-6">
                  <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/5 mx-auto flex items-center justify-center overflow-hidden">
                     <div className="text-4xl font-black text-indigo-500">{topper.name.charAt(0)}</div>
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-black text-white tracking-tight">{topper.name}</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{topper.class}</p>
                    <div className="pt-4 border-t border-white/5">
                       <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{topper.score}</p>
                       <p className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em]">{topper.rank}</p>
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
              <h2 className="text-4xl font-black text-white tracking-tight leading-tight">National & Global <br />Accolades</h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                Gyansthali Edu has been consistently recognized as one of the most innovative and value-driven institutions in the region.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { award: "Best Innovation in STEM", body: "National Edu Council 2025" },
                { award: "Cleanest Campus Award", body: "City Municipal Board 2024" },
                { award: "Excellence in Digital Learning", body: "Global Tech Summit 2026" },
              ].map((award, i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                   <MdEmojiEvents className="text-indigo-500 text-3xl group-hover:scale-125 transition-transform" />
                   <div>
                      <h5 className="text-sm font-black text-white uppercase tracking-tight">{award.award}</h5>
                      <p className="text-[10px] text-slate-500 font-bold">{award.body}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-10 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative bg-white/5 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-8">
               <MdFormatQuote size={48} className="text-indigo-500/20" />
               <p className="text-lg md:text-xl font-medium text-slate-300 leading-relaxed italic">
                 "Our achievements are a testament to the hard work of our students, the dedication of our faculty, and the unwavering support of our parent community."
               </p>
               <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-black">GS</div>
                  <div>
                    <p className="text-sm font-black text-white">Institutional Council</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Gyansthali Education Group</p>
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
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
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
