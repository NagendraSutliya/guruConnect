import { useEffect, useState } from "react";
import { MdArrowForward, MdCheckCircle, MdPlayArrow, MdSchool, MdStar } from "react-icons/md";
import api from "../api/axiosInstance";

const Typewriter = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts]);

  return (
    <span className="text-indigo-400">
      {texts[index].substring(0, subIndex)}
      <span className="animate-pulse ml-1 text-themeText">|</span>
    </span>
  );
};

const SchoolLanding = () => {
  const [fetching, setFetching] = useState(true);
  const [heroData, setHeroData] = useState({
    title: "Empowering Minds, Shaping Tomorrow's Leaders",
    subtitle: "At Gyansthali Enlightening, we blend traditional values with cutting-edge digital innovation to provide a holistic learning experience that prepares students for the challenges of a global future.",
    button1: "Apply for 2026-27",
    button2: "Explore Campus",
    announcement: "Now Enrolling: Academic Session 2026-27",
    backgroundImage: "/images/redesign/hero.png"
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/hero');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          const cleanData: any = {};
          Object.keys(incoming).forEach(key => {
            if (incoming[key] && incoming[key] !== "") {
              cleanData[key] = incoming[key];
            }
          });
          setHeroData(prev => ({ ...prev, ...cleanData }));
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchHeroData();
  }, []);

  return (
    <div className="relative overflow-x-hidden bg-themeBg text-themeText transition-colors duration-500">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroData.backgroundImage || "/images/redesign/hero.png"} 
            alt="School Hero" 
            className="w-full h-full object-cover opacity-20 scale-105 animate-slowZoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-themeBgSec via-transparent to-themeBg opacity-80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            {fetching ? (
              <div className="space-y-8 animate-pulse">
                <div className="h-8 bg-white/5 rounded-full w-48" />
                <div className="space-y-4">
                  <div className="h-16 bg-white/5 rounded-2xl w-full" />
                  <div className="h-16 bg-white/5 rounded-2xl w-3/4" />
                </div>
                <div className="h-24 bg-white/5 rounded-2xl w-full" />
                <div className="flex gap-4">
                  <div className="h-12 bg-white/5 rounded-xl w-32" />
                  <div className="h-12 bg-white/5 rounded-xl w-40" />
                </div>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-themeCard border border-themeBorder text-xs font-black uppercase tracking-[0.2em] text-indigo-300 animate-slideDown">
                  <MdStar className="text-amber-400 animate-spin-slow" size={14} />
                  {heroData.announcement}
                </div>
                <h2 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter animate-fadeIn">
                  {heroData.title} <br />
                  <Typewriter texts={["Leaders.", "Innovators.", "Thinkers."]} />
                </h2>
                <p className="text-base md:text-lg text-themeTextSec font-medium leading-relaxed max-w-lg animate-fadeInDelay">
                  {heroData.subtitle}
                </p>
                <div className="flex flex-wrap gap-4 pt-4 animate-slideUp">
                  <button className="group flex items-center gap-3 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                    {heroData.button1}
                    <MdArrowForward size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="flex items-center gap-3 px-8 py-3.5 bg-themeCard text-themeText backdrop-blur-xl border border-themeBorder rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-themeBgSec transition-all active:scale-95">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      <MdPlayArrow size={16} />
                    </div>
                    {heroData.button2}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="hidden lg:block relative animate-float">
             <div className="absolute -inset-10 bg-indigo-500/10 blur-[80px] rounded-full" />
             <div className="relative rounded-[2.5rem] overflow-hidden border border-themeBorder shadow-2xl">
                <img src="/images/redesign/classroom.png" alt="Modern Classroom" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-themeBgSec to-transparent opacity-60" />
             </div>
             {/* Floating Info Card */}
             <div className="absolute -bottom-6 -left-6 p-6 bg-themeBgSec backdrop-blur-2xl border border-themeBorder rounded-3xl shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                      <MdSchool size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-themeTextSec uppercase tracking-widest leading-none mb-1">Global Ranking</p>
                      <p className="text-xl font-black">Top 1% in India</p>
                   </div>
                </div>
                <div className="h-1 w-full bg-themeBorder rounded-full overflow-hidden">
                   <div className="h-full w-[85%] bg-indigo-500" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-themeBgSec border-y border-themeBorder">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Success Rate', val: '99%', sub: 'University Placements' },
              { label: 'Expert Faculty', val: '25+', sub: 'Certified Educators' },
              { label: 'Modern Labs', val: '10+', sub: 'World-class Facilities' },
              { label: 'Established', val: '2020', sub: 'Mahesh Nagar, Jaipur' },
            ].map((stat, i) => (
              <div key={i} className="text-left space-y-2 border-l border-themeBorder pl-8">
                <p className="text-4xl md:text-5xl font-black text-themeText tracking-tighter leading-none">{stat.val}</p>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-[10px] font-bold text-themeTextSec uppercase tracking-[0.2em]">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <h5 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Our DNA</h5>
            <h2 className="text-4xl font-black text-themeText tracking-tight leading-tight">An Ecosystem for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Human Excellence</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: "Smart Learning", 
                desc: "Digitally equipped classrooms with interactive boards and AI-assisted learning tools.",
                icon: "/images/redesign/speed.png",
                tag: "Technology"
              },
              { 
                title: "Holistic Growth", 
                desc: "Special focus on sports, arts, and cultural activities alongside academic rigor.",
                icon: "/images/redesign/stats.png",
                tag: "Values"
              },
              { 
                title: "Safe Campus", 
                desc: "24/7 surveillance and specialized security staff to ensure a secure environment.",
                icon: "/images/redesign/security.png",
                tag: "Security"
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-themeCard p-10 rounded-[3rem] border border-themeBorder hover:bg-themeBgSec transition-all duration-500 hover:-translate-y-2 shadow-2xl">
                <div className="w-full h-36 bg-themeBgSec rounded-2xl mb-10 overflow-hidden border border-themeBorder relative">
                   <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-themeBgSec to-transparent opacity-60" />
                </div>
                <div className="space-y-4">
                  <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">{feature.tag}</span>
                  <h4 className="text-2xl font-black text-themeText tracking-tight leading-tight">{feature.title}</h4>
                  <p className="text-themeTextSec text-sm font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight">Why Choose Gyansthali?</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto font-medium">We provide more than just education; we provide an experience that lasts a lifetime.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Digital-First Pedagogy",
              "Personalized Mentorship",
              "World-Class Infrastructure",
              "Holistic Development",
              "Global Exposure",
              "Values-Based Learning"
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-8 py-5 rounded-2xl border border-white/10">
                <MdCheckCircle className="text-indigo-200 text-xl shrink-0" />
                <span className="font-black text-xs uppercase tracking-widest text-white">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes slowZoom {
            from { transform: scale(1.05); }
            to { transform: scale(1.15); }
          }
          .animate-slowZoom {
            animation: slowZoom 30s linear infinite alternate;
          }
          .animate-slideDown {
            animation: slideDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-fadeInDelay {
            animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
            opacity: 0;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUp {
            animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
            opacity: 0;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(1deg); }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 12s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default SchoolLanding;
