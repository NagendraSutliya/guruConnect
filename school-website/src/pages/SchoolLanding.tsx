import { useState, useEffect } from "react";
import { MdArrowForward, MdPlayArrow, MdStar, MdSchool, MdLocationOn } from "react-icons/md";
import api from "../api/axiosInstance";

export default function SchoolLanding() {
  const [heroData, setHeroData] = useState({
    title: "Empowering Tomorrow's Leaders",
    subtitle: "At Gyansthali, we blend traditional values with cutting-edge education technology.",
    button1: "Apply Online",
    button2: "Take a Virtual Tour",
    announcement: "Now Enrolling for 2024-25"
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await api.get('/cms/hero');
        if (response.data.success) {
          setHeroData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };
    fetchHeroData();
  }, []);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop" 
          alt="School Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-110 animate-slowZoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] animate-slideDown">
              <MdStar size={14} className="text-amber-400" />
              {heroData.announcement}
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter animate-fadeIn">
              {heroData.title}
            </h2>
            <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed max-w-2xl animate-fadeInDelay">
              {heroData.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 pt-4 animate-slideUp">
              <button className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-black text-sm hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95">
                {heroData.button1}
                <MdArrowForward size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-3 px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full font-black text-sm hover:bg-white hover:text-slate-900 transition-all active:scale-95">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <MdPlayArrow size={16} />
                </div>
                {heroData.button2}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 hidden md:block animate-fadeInSlow">
          <div className="grid grid-cols-4 gap-8 p-8 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10">
            {[
              { label: 'Success Rate', val: '99%' },
              { label: 'Expert Faculty', val: '150+' },
              { label: 'Modern Labs', val: '12+' },
              { label: 'Years Legacy', val: '25+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-white mb-1">{stat.val}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Why Choose Us</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">An Ecosystem for <span className="text-indigo-600 italic">Excellence</span></h2>
            <p className="text-slate-500 font-medium mt-4">We provide more than just textbooks. We provide a platform for growth, creativity, and discovery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Smart Learning", 
                desc: "Digitally equipped classrooms with interactive boards and AI-assisted learning tools.",
                icon: <MdSchool />,
                color: "indigo"
              },
              { 
                title: "Holistic Growth", 
                desc: "Special focus on sports, arts, and cultural activities alongside academic rigor.",
                icon: <MdStar />,
                color: "purple"
              },
              { 
                title: "Safe Campus", 
                desc: "24/7 surveillance and specialized security staff to ensure a secure environment.",
                icon: <MdLocationOn />,
                color: "emerald"
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 transition-all duration-500">
                <div className={`w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes slowZoom {
            from { transform: scale(1.1); }
            to { transform: scale(1.2); }
          }
          .animate-slowZoom {
            animation: slowZoom 20s linear infinite alternate;
          }
          .animate-slideDown {
            animation: slideDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-fadeInDelay {
            animation: fadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-fadeInSlow {
            animation: fadeIn 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-slideUp {
            animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
