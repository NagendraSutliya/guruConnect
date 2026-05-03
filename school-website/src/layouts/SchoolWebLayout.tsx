import { 
  MdSchool, 
  MdMenu, 
  MdClose,
  MdLocationOn,
  MdPhone,
  MdEmail
} from "react-icons/md";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function SchoolWebLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    { name: 'Admissions', path: '/admissions' },
    { name: 'Academics', path: '/academics' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const IMS_URL = "http://localhost:5173"; // Assuming IMS runs on 5173

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/90 backdrop-blur-xl shadow-lg py-3" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg transition-transform hover:rotate-12 ${isScrolled ? "scale-90" : ""}`}>
              <MdSchool size={24} />
            </div>
            <div>
              <h1 className={`text-xl font-black tracking-tighter transition-colors ${isScrolled || location.pathname !== '/' ? "text-slate-900" : "text-white"}`}>
                Gyansthali <span className="text-indigo-500">Enterprises</span>
              </h1>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 ${isScrolled || location.pathname !== '/' ? "text-slate-500" : "text-indigo-200"}`}>
                Nurturing Excellence
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-sm font-bold tracking-wide transition-all hover:text-indigo-500 ${
                  location.pathname === item.path 
                    ? "text-indigo-500" 
                    : (isScrolled || location.pathname !== '/' ? "text-slate-600" : "text-white/80")
                }`}
              >
                {item.name}
              </Link>
            ))}
            <a 
              href={`${IMS_URL}/auth/login`}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 ${
                isScrolled || location.pathname !== '/'
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700" 
                : "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-indigo-900"
              }`}
            >
              IMS Portal
            </a>
          </div>

          <button 
            className={`lg:hidden p-2 rounded-lg ${isScrolled || location.pathname !== '/' ? "text-slate-900" : "text-white"}`}
            onClick={() => setMobileMenuOpen(true)}
          >
            <MdMenu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] bg-slate-950 transition-all duration-500 lg:hidden ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-white font-black text-xl tracking-tighter">Gyansthali <span className="text-indigo-500">Edu</span></h1>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
              <MdClose size={32} />
            </button>
          </div>
          <div className="space-y-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="block text-3xl font-black text-white/40 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a 
              href={`${IMS_URL}/auth/login`}
              className="block text-3xl font-black text-indigo-500 pt-6 border-t border-white/5"
            >
              IMS Portal
            </a>
          </div>
        </div>
      </div>

      <main>
        <Outlet />
      </main>

      <footer className="bg-slate-950 pt-24 pb-12 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <MdSchool size={24} />
                </div>
                <h1 className="text-xl font-black tracking-tighter">
                  Gyansthali <span className="text-indigo-400">Enterprises</span>
                </h1>
              </div>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                Leading the way in innovative education and nurturing the potential of every child since 1999.
              </p>
            </div>

            <div className="space-y-6">
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-white/60">Explore</h5>
              <ul className="space-y-4 text-sm font-bold text-white/40">
                {navLinks.map(link => (
                  <li key={link.name}><Link to={link.path} className="hover:text-indigo-400 transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-white/60">Contact Us</h5>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-sm font-medium text-white/40">
                  <MdLocationOn className="text-indigo-500 mt-1 shrink-0" />
                  123 Educational Square, Knowledge City, IN
                </li>
                <li className="flex items-center gap-4 text-sm font-medium text-white/40">
                  <MdPhone className="text-indigo-500 shrink-0" />
                  +91 (800) 123-4567
                </li>
                <li className="flex items-center gap-4 text-sm font-medium text-white/40">
                  <MdEmail className="text-indigo-500 shrink-0" />
                  info@gyansthali.edu
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="font-black text-xs uppercase tracking-[0.2em] text-white/60">Newsletter</h5>
              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <input 
                  placeholder="Enter your email"
                  className="bg-transparent border-none outline-none flex-1 px-4 text-sm font-medium"
                />
                <button className="bg-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
              © 2024 Gyansthali Enterprises. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-indigo-400 transition-colors">Facebook</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
