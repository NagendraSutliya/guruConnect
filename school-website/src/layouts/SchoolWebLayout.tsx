import { 
  MdSchool, 
  MdMenu, 
  MdClose,
  MdLocationOn,
  MdPhone,
  MdEmail
} from "react-icons/md";
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Sun,
  Moon
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const SchoolWebLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Academics', path: '/academics' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const IMS_URL = "http://localhost:5173"; 

  return (
    <div className="min-h-screen bg-themeBg font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden transition-colors duration-500">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? "bg-themeBgSec backdrop-blur-2xl border-b border-themeBorder py-2 shadow-2xl" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110`}>
              <MdSchool size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black tracking-tighter text-themeText leading-none">
                Gyansthali <span className="text-indigo-500">Enlightening</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mt-0.5">
                Step Towards Success...
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-xs font-black uppercase tracking-[0.15em] transition-all hover:text-indigo-400 ${
                  location.pathname === item.path 
                    ? "text-indigo-400" 
                    : "text-themeTextSec hover:text-themeText"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-themeCard border border-themeBorder text-themeText hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="lg:hidden p-2.5 bg-themeCard border border-themeBorder rounded-lg text-themeText hover:bg-themeBgSec transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MdMenu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] bg-themeBgSec backdrop-blur-2xl transition-all duration-700 lg:hidden ${
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <MdSchool size={22} />
               </div>
               <h1 className="text-themeText font-black text-lg tracking-tighter">Gyansthali <span className="text-indigo-500">Enlightening</span></h1>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-themeText p-2.5 bg-themeCard border border-themeBorder rounded-full">
              <MdClose size={24} />
            </button>
          </div>
          <div className="space-y-3">
            {navLinks.map((link, i) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="block text-3xl font-black text-white/20 hover:text-indigo-500 transition-all hover:translate-x-3"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {link.name}
              </Link>
            ))}
            {/* <a 
              href={`${IMS_URL}/auth/login`}
              className="block text-3xl font-black text-indigo-500 pt-6 mt-6 border-t border-white/5"
            >
              IMS Portal
            </a> */}
          </div>
          
          <div className="mt-auto pt-8 border-t border-white/5">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-4">Connect with us</p>
             <div className="flex gap-5">
                 {[
                   { Icon: Instagram, link: "https://www.instagram.com/gyansthali_2020" },
                   { Icon: Twitter, link: "#" },
                   { Icon: Facebook, link: "#" }
                 ].map(({ Icon, link }, i) => (
                   <a 
                     href={link} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     key={i} 
                     className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:bg-indigo-600 hover:text-white transition-all"
                   >
                     <Icon size={20} />
                   </a>
                 ))}
             </div>
          </div>
        </div>
      </div>

      <main className="relative z-10">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="bg-themeBg pt-20 pb-12 text-themeText border-t border-themeBorder relative overflow-hidden transition-colors duration-500">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                  <MdSchool size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tighter">
                    Gyansthali <span className="text-indigo-400">Enlightening</span>
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Since 2020</p>
                </div>
              </div>
              <p className="text-themeTextSec text-xs font-medium leading-relaxed max-w-xs">
                Empowering the next generation of leaders through quality education, character building, and holistic development.
              </p>
              <div className="flex gap-3">
                 {[
                   { Icon: Instagram, link: "https://www.instagram.com/gyansthali_2020" },
                   { Icon: Globe, link: "#" },
                   { Icon: ShieldCheck, link: "#" }
                 ].map(({ Icon, link }, i) => (
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      key={i} 
                      className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer text-slate-500 hover:text-white"
                    >
                       <Icon size={16} />
                    </a>
                 ))}
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-themeText">Quick Links</h5>
              <ul className="grid grid-cols-1 gap-3 text-xs font-bold text-themeTextSec">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="hover:text-indigo-400 transition-all flex items-center gap-2 group">
                      <div className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-themeText">Reach Us</h5>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-xs font-medium text-slate-500 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                    <MdLocationOn size={18} />
                  </div>
                  <span className="pt-1.5">80 Feet Road, Mahesh Nagar, Jaipur, Rajasthan</span>
                </li>
                <li className="flex items-center gap-3 text-xs font-medium text-slate-500 group">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                    <MdPhone size={18} />
                  </div>
                  <span>+91 9425847076 | +91 9782994277</span>
                </li>
                <li className="flex items-center gap-3 text-xs font-medium text-slate-500 group">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                    <Mail size={18} />
                  </div>
                  <span>info@gyansthali.edu</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-themeText">Newsletter</h5>
              <p className="text-themeTextSec text-xs font-medium">Get the latest updates from our campus.</p>
              <div className="flex bg-themeCard p-1.5 rounded-xl border border-themeBorder group focus-within:border-indigo-500/50 transition-all">
                <input 
                  placeholder="Enter your email"
                  className="bg-transparent border-none outline-none flex-1 px-3 text-xs font-medium text-themeText placeholder:text-themeTextSec"
                />
                <button className="bg-indigo-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 group/btn">
                  Join
                  <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
              © 2026 Gyansthali Education Group. <span className="text-slate-800 ml-2">Built with Excellence.</span>
            </p>
            <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  Live Campus
               </div>
               <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
               <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolWebLayout;
