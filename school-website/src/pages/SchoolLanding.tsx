import { useEffect, useState } from "react";
import { MdArrowForward, MdCheckCircle, MdPlayArrow, MdSchool, MdStar, MdOutlineKeyboardArrowDown } from "react-icons/md";
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
    <span className="text-emerald-600 dark:text-indigo-400">
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
      <section className="relative min-h-[80vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
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
                <div className="h-8 bg-slate-200 dark:bg-white/5 rounded-full w-48" />
                <div className="space-y-4">
                  <div className="h-16 bg-slate-200 dark:bg-white/5 rounded-2xl w-full" />
                  <div className="h-16 bg-slate-200 dark:bg-white/5 rounded-2xl w-3/4" />
                </div>
                <div className="h-24 bg-slate-200 dark:bg-white/5 rounded-2xl w-full" />
                <div className="flex gap-4">
                  <div className="h-12 bg-slate-200 dark:bg-white/5 rounded-xl w-32" />
                  <div className="h-12 bg-slate-200 dark:bg-white/5 rounded-xl w-40" />
                </div>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-themeCard border border-themeBorder text-xs font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-indigo-300 animate-slideDown">
                  <MdStar className="text-amber-400 animate-spin-slow" size={14} />
                  {heroData.announcement}
                </div>
                <h2 className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tighter animate-fadeIn">
                  Empowering Minds, Shaping Tomorrow's <br />
                  <Typewriter texts={["Leaders.", "Innovators.", "Thinkers."]} />
                </h2>
                <p className="text-base md:text-lg text-themeTextSec font-medium leading-relaxed max-w-lg animate-fadeInDelay">
                  {heroData.subtitle}
                </p>
                <div className="flex flex-wrap gap-4 pt-4 animate-slideUp">
                  <button className="group flex items-center gap-3 px-8 py-3 bg-green-600 dark:bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest dark:hover:bg-indigo-800 hover:bg-green-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                    {heroData.button1}
                    <MdArrowForward size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="flex items-center gap-3 px-8 py-3 bg-themeCard text-themeText backdrop-blur-xl border border-themeBorder rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-themeBgSec transition-all active:scale-95">
                    <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-indigo-500 flex items-center justify-center text-white">
                      <MdPlayArrow size={16} />
                    </div>
                    {heroData.button2}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="hidden lg:block relative animate-float mt-10 w-[90%] max-w-[750px] ml-auto">
             <div className="absolute -inset-10 bg-indigo-500/10 blur-[80px] rounded-full" />
             <div className="relative rounded-[2.5rem] overflow-hidden border border-themeBorder shadow-2xl aspect-[4/3]">
                <img src="/images/redesign/classroom.png" alt="Modern Classroom" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-themeBgSec to-transparent opacity-20 dark:opacity-60" />
             </div>
              
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 bg-themeBgSec border-y border-themeBorder">
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
                  <p className="text-[11px] font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-[10px] font-bold text-themeTextSec uppercase tracking-[0.2em]">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

         {/* Welcome / About Introduction */}
      <section className="py-16 bg-themeBg">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
           <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-themeBorder shadow-2xl">
             <img src="/images/redesign/campus_hero.png" alt="Campus Overview" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            <h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">Welcome to Gyansthali</h5>
            <h2 className="text-4xl font-black text-themeText tracking-tight leading-tight">Nurturing Excellence in Education</h2>
            <p className="text-themeTextSec leading-relaxed">
              Established with a vision to create responsible and capable citizens, Gyansthali has grown to become a premier institution. We offer a comprehensive curriculum that emphasizes conceptual clarity, critical thinking, and holistic development.
            </p>
            <p className="text-themeTextSec leading-relaxed">
              Our mission is simple: to empower students with knowledge, confidence, and compassion. Backed by experienced educators and modern infrastructure, we stand out as a top choice for a balanced, future-ready education.
            </p>
            <button className="px-8 py-3 bg-green-600/10 text-green-600 dark:text-indigo-400 font-bold rounded-xl border border-green-500/20 dark:border-indigo-500/20 hover:bg-green-600 dark:hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest text-xs">
              Read Our Story
            </button>
          </div>
         
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-themeBg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
            <h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">Our DNA</h5>
            <h2 className="text-3xl md:text-4xl font-black text-themeText tracking-tight leading-tight">An Ecosystem for 
              <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-indigo-400 dark:from-indigo-400 dark:to-purple-400">Human Excellence</span></h2>
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
                <div className="w-full h-36 bg-themeBgSec rounded-2xl mb-6 overflow-hidden border border-themeBorder relative">
                   <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-themeBgSec to-transparent opacity-60" />
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">{feature.tag}</span>
                  <h4 className="text-2xl font-black text-themeText tracking-tight leading-tight">{feature.title}</h4>
                  <p className="text-themeTextSec text-sm font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


  {/* Why Choose */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-indigo-400 dark:from-blue-600 dark:to-indigo-400 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-indigo-800 dark:text-white tracking-tight">Why Choose Gyansthali?</h2>
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

   

      {/* Latest News & Updates */}
      <section className="py-16 bg-themeBgSec border-y border-themeBorder">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">Happenings</h5>
              <h2 className="text-4xl font-black text-themeText tracking-tight">Latest News & Resources</h2>
            </div>
            <button className="shrink-0 px-6 py-2.5 bg-themeCard border border-themeBorder rounded-xl font-bold text-xs uppercase tracking-widest text-themeText 
                          hover:bg-green-500 hover:text-white hover:border-green-400 dark:hover:bg-indigo-600 dark:hover:text-white dark:hover:border-indigo-600 
                            transition-all">
              View All News
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { date: "May 9, 2026", title: "17th Annual Inter-School Sports Trophy", img: "/images/redesign/gallery1.png" },
              { date: "May 2, 2026", title: "Mosaic Art & Cultural Fest 2026", img: "/images/redesign/gallery2.png" },
              { date: "Apr 15, 2026", title: "National Science Olympiad Winners", img: "/images/redesign/gallery3.png" },
            ].map((news, i) => (
              <div key={i} className="group bg-themeCard rounded-[2rem] border border-themeBorder overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-xl flex flex-col">
                <div className="aspect-[4/3] bg-themeBgSec overflow-hidden relative">
                  <img src={news.img} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{news.date}</p>
                  <h4 className="text-xl font-black text-themeText leading-tight flex-1">{news.title}</h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-themeTextSec group-hover:text-indigo-400 transition-colors uppercase tracking-widest mt-4">
                    Read More <MdArrowForward />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Messages */}
      <section className="py-16 bg-themeBg">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-12 rounded-[3rem] border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full" />
            <div className="relative z-10 space-y-8 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-white tracking-tight">The Inspiration</h3>
                <p className="text-indigo-100/80 leading-relaxed font-medium text-lg">
                  "We proudly honor the visionaries who dedicated their efforts to bringing an international standard of education. The driving force behind our school is a dream, initiative, and unwavering commitment to a learning environment that seamlessly blends modern education with rich Indian culture."
                </p>
              </div>
              <div className="pt-8 border-t border-white/10">
                <p className="text-white font-black uppercase tracking-widest text-sm">Founding Board</p>
                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-1">Gyansthali Education Trust</p>
              </div>
            </div>
          </div>
          <div className="bg-themeCard p-12 rounded-[3rem] border border-themeBorder shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-8 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-themeText tracking-tight">Principal's Desk</h3>
                <p className="text-themeTextSec leading-relaxed font-medium text-lg italic">
                  "At Gyansthali, we believe that the true goal of education is to build knowledge as well as character of our students by enabling them to think intensively and critically. We prepare them not just for exams, but for life."
                </p>
              </div>
              <div className="flex items-center gap-4 pt-8 border-t border-themeBorder">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <MdSchool className="text-indigo-600" size={24} />
                </div>
                <div>
                  <p className="text-themeText font-black uppercase tracking-widest text-sm">Mrs. Khushboo Soni</p>
                  <p className="text-themeTextSec text-xs font-bold uppercase tracking-widest mt-1">Principal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Spotlight */}
      <section className="py-16 bg-themeBgSec border-y border-themeBorder overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
            <h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">Our Legacy</h5>
            <h2 className="text-4xl font-black text-themeText tracking-tight">Alumni Spotlight</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sankalp Sharma", role: "III RD OFFICER", year: "2013" },
              { name: "Deeksha Singh", role: "CORPORATE LAWYER", year: "2009" },
              { name: "Ankit Olla", role: "FIGHTER PILOT, IAF", year: "2015" },
              { name: "Pranjal Rajawat", role: "MARKETING MANAGER", year: "2013" }
            ].map((alumni, i) => (
              <div key={i} className="bg-themeBg p-8 rounded-[2rem] border border-themeBorder hover:border-indigo-500/30 transition-all text-center space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 border-4 border-themeBgSec flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${alumni.name.replace(' ', '+')}&background=e0e7ff&color=4f46e5&size=128&font-size=0.33`} alt={alumni.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-themeText tracking-tight">{alumni.name}</h4>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">{alumni.role}</p>
                </div>
                <div className="pt-4 border-t border-themeBorder">
                  <p className="text-[10px] font-black text-themeTextSec uppercase tracking-widest">Class of {alumni.year}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-green-500 dark:bg-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-green-500/20 dark:shadow-indigo-500/20 hover:bg-green-700 dark:hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">
              Join Alumni Community
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-themeBg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
            <h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">Voices of Trust</h5>
            <h2 className="text-4xl font-black text-themeText tracking-tight">What Parents Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "Such an interactive and enthusiastic session! So happy that my child is in such wonderful hands. More power to teachers like you.", parent: "Rashmi D", child: "Arohi, Grade 5" },
              { quote: "Aarush was very shy and scared to speak his mind. But the way the teachers communicate with him, he is improving rapidly. I see a lot of change.", parent: "Sonu J", child: "Aaryush, Grade 3" },
              { quote: "We're extremely thankful for the efforts made by the teachers and the way they are dealing with the children. The digital integration is flawless.", parent: "Ashok S", child: "Aryansh, Grade 8" },
            ].map((testimonial, i) => (
              <div key={i} className="bg-themeCard p-10 rounded-[2.5rem] border border-themeBorder relative group hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="text-indigo-500/10 dark:text-indigo-100/30 absolute top-8 right-8 text-6xl font-serif group-hover:text-indigo-500/20 dark:group-hover:text-indigo-100/50 transition-colors">"</div>
                  <p className="text-themeTextSec font-medium leading-relaxed mb-8 relative z-10 italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-themeBorder">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                    {testimonial.parent.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-themeText">{testimonial.parent}</p>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Parent of {testimonial.child}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-themeBgSec border-t border-themeBorder">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12 space-y-4">
            <h5 className="text-xs font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">Clear Your Doubts</h5>
            <h2 className="text-4xl font-black text-themeText tracking-tight">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Is Gyansthali affiliated with CBSE?", a: "Yes, we are a fully CBSE-affiliated school offering education from primary to senior secondary levels." },
              { q: "Does the school provide transportation facilities?", a: "Yes, we provide safe and efficient transportation through GPS-enabled buses covering major routes." },
              { q: "What are the key co-curricular activities?", a: "Our framework includes sports, music, dance, coding clubs, robotics, and elocution." },
              { q: "How can I apply for admission?", a: "Admissions can be initiated through our online portal by clicking 'Apply Now' or visiting the campus." }
            ].map((faq, i) => (
              <details key={i} className="group bg-themeBg border border-themeBorder rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-black text-themeText select-none outline-none">
                  {faq.q}
                  <span className="transition duration-300 group-open:rotate-180 text-green-500 dark:text-indigo-400">
                    <MdOutlineKeyboardArrowDown size={24} />
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-themeTextSec font-medium leading-relaxed">
                  <div className="pt-4 border-t border-themeBorder/50">
                    {faq.a}
                  </div>
                </div>
              </details>
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
