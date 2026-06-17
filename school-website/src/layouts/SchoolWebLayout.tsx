import { 
  MdSchool, 
  MdMenu, 
  MdClose,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdVerifiedUser,
  MdPublic,
  MdArrowForward,
  MdWbSunny,
  MdNightsStay,
  MdStarOutline
} from "react-icons/md";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden transition-colors duration-500">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-white/95 dark:bg-[#020617]/90 backdrop-blur-xl border-b border-emerald-500/20 dark:border-indigo-500/20 shadow-sm ${
        isScrolled ? "py-3 md:py-4" : "py-5 md:py-6"
      }`}>
        <div className="w-full px-6 md:px-12 xl:px-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/images/redesign/gyansthali_logo.png" alt="Gyansthali Logo" className="w-12 h-12 object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-sm" />
            <div className="text-left">
              <h1 className="text-xl font-black tracking-tighter dark:text-white leading-none">
                Gyansthali <span className="text-indigo-400">Enlightening</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mt-0.5">
                Step Towards Success...
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 ml-auto mr-4">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-xs font-black uppercase tracking-[0.15em] transition-all hover:text-emerald-600 dark:hover:text-indigo-400 ${
                  location.pathname === item.path 
                    ? "text-emerald-500 dark:text-indigo-400" 
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-indigo-600 transition-all shadow-sm dark:shadow-xl"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <MdWbSunny size={18} /> : <MdNightsStay size={18} />}
            </button>
            <button 
              className="lg:hidden p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10 transition-colors"
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
               <img src="/images/redesign/gyansthali_logo.png" alt="Gyansthali Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-1" />
               <h1 className="text-themeText font-black text-lg tracking-tighter">Gyansthali <span className="text-indigo-500">Enlightening</span></h1>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-themeText p-1 bg-themeCard">
              <MdClose size={20} />
            </button>
          </div>
          <div className="space-y-3">
            {navLinks.map((link, i) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="block text-xl font-black text-green-500 dark:text-white/30 hover:text-green-700 dark:hover:text-indigo-500 transition-all hover:translate-x-3"
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
          
          <div className="mt-auto pt-8 border-t dark:border-white/5">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 dark:text-white/30 mb-2">Connect with us</p>
             <div className="flex gap-2">
                 {[
                   { Icon: FaInstagram, link: "https://www.instagram.com/gyansthali_2020" },
                   { Icon: FaTwitter, link: "#" },
                   { Icon: FaFacebook, link: "#" }
                 ].map(({ Icon, link }, i) => (
                   <a 
                     href={link} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     key={i} 
                     className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-black/50 dark:text-white/50 hover:bg-indigo-600 hover:text-white transition-all"
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
      <footer className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-slate-950 pt-12 md:pt-16 pb-8 text-slate-300 border-t border-indigo-500/20 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-8 mb-8 md:mb-12">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3">
                <img src="/images/redesign/gyansthali_logo.png" alt="Gyansthali Logo" className="w-10 h-10 object-contain bg-white rounded-lg p-1 shadow-[0_0_20px_rgba(79,70,229,0.3)]" />
                <div>
                  <h1 className="text-lg font-black tracking-tighter text-white">
                    Gyansthali <span className="text-indigo-400">Enlightening</span>
                  </h1>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500">Since 2020</p>
                </div>
              </div>
             
              <div className="flex gap-2 mt-auto pt-6">
                 {[
                   { Icon: FaInstagram, link: "https://www.instagram.com/gyansthali_2020" },
                   { Icon: MdPublic, link: "#" },
                   { Icon: MdVerifiedUser, link: "#" }
                 ].map(({ Icon, link }, i) => (
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      key={i} 
                      className="w-8 h-8 bg-white/5 rounded-md flex items-center justify-center hover:bg-indigo-600 transition-colors cursor-pointer text-slate-500 hover:text-white"
                    >
                       <Icon size={14} />
                    </a>
                 ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-white">Quick Links</h5>
                <div className="flex-1 flex items-center">
                  <div className="w-8 h-0.5 bg-green-500 dark:bg-amber-500 rounded-l-full" />
                  <div className="flex-1 h-[1px] bg-white/20 rounded-r-full" />
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-bold text-slate-500">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="hover:text-white transition-all flex items-center gap-2 group">
                      <MdStarOutline className="text-green-500 dark:text-amber-500 text-sm group-hover:scale-110 transition-transform" />
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-white">Reach Us</h5>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs font-medium text-slate-500 group">
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                    <MdLocationOn size={14} />
                  </div>
                  <span className="pt-0.5">80 Feet Road, Mahesh Nagar, Jaipur, Rajasthan</span>
                </li>
                <li className="flex items-center gap-2 text-xs font-medium text-slate-500 group">
                   <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                    <MdPhone size={14} />
                  </div>
                  <span>+91 9425847076 | +91 9782994277</span>
                </li>
                <li className="flex items-center gap-2 text-xs font-medium text-slate-500 group">
                   <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                    <MdEmail size={14} />
                  </div>
                  <span>info@gyansthali.edu</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-white">Newsletter</h5>
              <p className="text-slate-400 text-[10px] font-medium">Get the latest updates from our campus.</p>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 group focus-within:border-indigo-500/50 transition-all">
                <input 
                  placeholder="Enter your email"
                  className="bg-transparent border-none outline-none flex-1 px-3 text-xs font-medium text-white placeholder:text-slate-400"
                />
                <button className="bg-green-500 dark:bg-indigo-600 text-black dark:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 group/btn">
                  Join
                  <MdArrowForward size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] text-center md:text-left leading-relaxed">
              © 2026 Gyansthali Education Group. <span className="text-slate-800 block md:inline md:ml-2 mt-1 md:mt-0">Built with Excellence.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  Live Campus
               </div>
               <div className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</div>
               <div className="hover:text-slate-400 transition-colors cursor-pointer">Terms</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolWebLayout;
