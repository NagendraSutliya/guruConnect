import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Users, 
  GraduationCap, 
  CheckCircle2,
  X,
  ArrowRight,
  LayoutDashboard
} from "lucide-react";

const Landing = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("adminToken") || 
                  localStorage.getItem("teacherToken") || 
                  localStorage.getItem("studentToken");
    
    if (role && token) {
      setUserRole(role);
    }
    setCheckingSession(false);
  }, []);

  const [heroData] = useState({
    title: "Empowering Tomorrow's Leaders",
    subtitle: "At Gyansthali, we blend traditional values with cutting-edge education technology.",
    button1: "Apply Online",
    button2: "Take a Virtual Tour",
    announcement: "Now Enrolling for 2026-27"
  });

  const getDashboardLink = () => {
    switch (userRole) {
      case "admin": return "/admin/dashboard";
      case "teacher": return "/teacher/dashboard";
      case "student": return "/student/dashboard";
      default: return "#";
    }
  };

  return (
    <div className={`min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 transition-all ${showLoginModal ? 'overflow-hidden' : ''}`}>
      
      {/* ================= LOGIN MODAL ================= */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLoginModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] md:max-h-full rounded-3xl md:rounded-[40px] shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-2 right-4 p-3 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Left Side: Branding */}
              <div className="w-full md:w-1/3 bg-orange-600 p-6 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                      <GraduationCap className="text-orange-600 w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">guruConnect</span>
                  </div>
                  <h3 className="text-3xl font-extrabold mb-4 leading-tight">Welcome Back!</h3>
                  <p className="text-orange-100 font-medium">Select your portal to continue your journey.</p>
                </div>
                <div className="text-sm text-orange-200 mt-6 md:mt-0">
                  Need help? <a href="#" className="underline font-bold text-white">Contact Support</a>
                </div>
              </div>

              {/* Right Side: Role Selector */}
              <div className="w-full md:w-2/3 p-6 md:p-12 bg-slate-50">
                <div className="grid gap-4">
                  {[
                    { 
                      role: "Administrator", 
                      desc: "Full institute control & insights", 
                      icon: <ShieldCheck className="w-6 h-6" />, 
                      link: "/auth/login",
                      color: "text-blue-600",
                      bg: "bg-blue-50"
                    },
                    { 
                      role: "Teacher", 
                      desc: "Assignments, attendance & marks", 
                      icon: <Users className="w-6 h-6" />, 
                      link: "/teacher/login",
                      color: "text-indigo-600",
                      bg: "bg-indigo-50"
                    },
                    { 
                      role: "Student", 
                      desc: "Learning, results & schedule", 
                      icon: <GraduationCap className="w-6 h-6" />, 
                      link: "/student/login",
                      color: "text-orange-600",
                      bg: "bg-orange-50"
                    }
                  ].map((item, i) => (
                    <Link 
                      key={i} 
                      to={item.link}
                      className="group flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300"
                    >
                      <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 ${item.bg} ${item.color} rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{item.role}</h4>
                        <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ================= NAVIGATION ================= */}
      <nav className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/guruconnect-logo.png" 
              alt="guruConnect Logo" 
              className="h-10 sm:h-14 w-auto object-contain"
            />
            <div className="hidden sm:flex flex-col justify-center">
              <span className="text-xl font-black tracking-tighter leading-none">
                <span className="text-orange-600">guru</span>
                <span className="text-blue-600">Connect</span>
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Workflows</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {!checkingSession && (
              userRole ? (
                <Link to={getDashboardLink()}>
                  <button className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 text-sm sm:text-base">
                    <LayoutDashboard className="w-4 h-4 text-orange-500" />
                    <span className="hidden sm:inline">Go to Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                  </button>
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all border border-slate-100 text-sm sm:text-base"
                  >
                    <Users className="hidden sm:block w-4 h-4 text-orange-500" />
                    <span className="text-xs sm:text-base whitespace-nowrap">Sign In</span>
                  </button>
                  <Link to="/auth/register">
                    <button className="bg-orange-600 text-white px-3 sm:px-7 py-2 sm:py-2 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 active:scale-95 text-xs sm:text-base whitespace-nowrap">
                      Get Started
                    </button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-10 pb-10 md:pt-12 md:pb-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            {heroData.announcement && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-8">
                <Zap className="text-orange-600 w-4 h-4 fill-orange-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">{heroData.announcement}</span>
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl md:font-extrabold tracking-tight text-slate-900 leading-[1.05]">
              {heroData.title}
            </h1>

            <p className="mt-8 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {heroData.subtitle}
            </p>

             <div className="flex mt-8 items-center justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                    500+
                  </div>
                </div>
                <span className="ml-4 text-xs sm:text-sm font-medium text-slate-500">Trusted by 500+ Schools</span>
              </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              {!checkingSession && (
                userRole ? (
                  <Link to={getDashboardLink()} className="w-full sm:w-auto">
                    <button className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 group">
                      Back to My Dashboard
                      <LayoutDashboard className="w-6 h-6 text-orange-500 group-hover:rotate-12 transition-transform" />
                    </button>
                  </Link>
                ) : (
                  <div className="flex flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                    <Link to="/auth/register" className="flex-1 sm:w-auto">
                      <button className="w-full bg-orange-600 text-white px-3 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-base md:text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-2 sm:gap-3 group whitespace-nowrap">
                        {heroData.button1}
                        <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform shrink-0" />
                      </button>
                    </Link>
                    <button className="flex-1 sm:w-auto w-full bg-white text-slate-900 border border-slate-200 px-3 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-base md:text-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
                      {heroData.button2}
                    </button>
                  </div>
                )
              )}
             
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
              <img
                src="/images/hero.png"
                alt="guruConnect Platform"
                className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Schools Choose GuruConnect
            </h2>
            <p className="text-lg text-slate-600">
              Built with cutting-edge technology to handle everything from complex academic structures to simple daily tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Safe and Confidential",
                desc: "Enterprise-grade security ensuring all data and feedback remain anonymous and protected.",
                icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
                img: "/images/safe.png"
              },
              {
                title: "Easy and Accessible",
                desc: "Intuitive interfaces for students, teachers, and admins on any device, anywhere.",
                icon: <Zap className="w-8 h-8 text-amber-500" />,
                img: "/images/easy.png"
              },
              {
                title: "Actionable Insights",
                desc: "Powerful AI analytics to uncover trends, identify issues, and drive institutional growth.",
                icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
                img: "/images/insights.png"
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-100"
              >
                <div className="w-full h-48 bg-slate-50 rounded-2xl mb-8 overflow-hidden">
                  <img src={feature.img} alt={feature.title} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ROLE SELECTOR ================= */}
      <section id="portals" className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">
            Tailored Experience for Every User
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { role: "Admin", icon: <ShieldCheck />, link: "/auth/login", color: "bg-blue-600" },
              { role: "Teacher", icon: <Users />, link: "/teacher/login", color: "bg-indigo-600" },
              { role: "Student", icon: <GraduationCap />, link: "/student/login", color: "bg-slate-900" }
            ].map((item, i) => (
              <Link 
                to={item.link} 
                key={i}
                className="group relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-10 text-left transition-all hover:-translate-y-2 border border-slate-100 hover:border-transparent"
              >
                <div className={`absolute inset-0 ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 flex items-center md:block gap-4 md:gap-0">
                  <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center md:mb-6 transition-colors ${item.color} text-white group-hover:bg-white group-hover:text-slate-900`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 group-hover:text-white transition-colors">{item.role} Portal</h3>
                    <p className="text-sm md:text-base text-slate-500 group-hover:text-white/80 transition-colors">Access your dedicated workspace and tools.</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-12 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/10 rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple 3-Step Integration</h2>
            <p className="text-slate-400 text-lg">Getting your institute online has never been easier.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Registration", desc: "Admins register the institute and define the academic structure." },
              { step: "02", title: "Onboarding", desc: "Teachers and students are onboarded via bulk upload or unique codes." },
              { step: "03", title: "Launch", desc: "Start managing attendance, exams, results, and materials instantly." }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-black text-white/5 absolute -top-10 -left-6">{item.step}</div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <CheckCircle2 className="text-blue-500 w-6 h-6" />
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">guruConnect</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 GuruConnect AI. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
