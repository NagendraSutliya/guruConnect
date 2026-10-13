import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  Menu, 
  X, 
  ChevronRight
} from "lucide-react";
import { LoginPortalModal } from "./LoginPortalModal";

interface PublicNavbarProps {
  onOpenLoginModal?: () => void;
  onOpenDemoModal?: () => void;
  activeSection?: string;
}

export const PublicHeader: React.FC<PublicNavbarProps> = ({ 
  onOpenLoginModal, 
  onOpenDemoModal,
  activeSection: propActiveSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalLoginModalOpen, setInternalLoginModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>(propActiveSection || "");
  const location = useLocation();

  useEffect(() => {
    if (propActiveSection) {
      setCurrentSection(propActiveSection);
      return;
    }
    if (location.pathname !== "/") {
      setCurrentSection("");
      return;
    }
    const handleScroll = () => {
      const sectionIds = ["faq", "pricing", "how", "features"];
      const scrollPos = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setCurrentSection(id);
          return;
        }
      }
      setCurrentSection("");
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [propActiveSection, location.pathname]);

  const handleSignInClick = () => {
    if (onOpenLoginModal) {
      onOpenLoginModal();
    } else {
      setInternalLoginModalOpen(true);
    }
  };

  const navItems = [
    { label: "Features", to: "/#features", section: "features" },
    { label: "How it works", to: "/#how", section: "how" },
    { label: "Pricing", to: "/#pricing", section: "pricing" },
    { label: "FAQ", to: "/#faq", section: "faq" },
    { label: "About", to: "/about", section: "" },
    { label: "Contact", to: "/contact", section: "" },
  ];

  const isLinkActive = (path: string, section?: string) => {
    if (location.pathname === "/about" && path === "/about") return true;
    if (location.pathname === "/contact" && path === "/contact") return true;
    if (location.pathname === "/" && section) {
      return currentSection === section || location.hash === `#${section}`;
    }
    return false;
  };

  const getLinkClasses = (path: string, section?: string) => {
    const active = isLinkActive(path, section);
    if (active) {
      return "px-3.5 py-2 font-bold text-primary bg-primary-tint/60 rounded-control shadow-2xs border border-primary-soft/40 transition-all";
    }
    return "px-3.5 py-2 font-medium text-ink-secondary hover:text-primary rounded-control hover:bg-page transition-colors";
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-line">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo with Official Image */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/guruconnect-logo.png" 
              alt="guruConnect Logo" 
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-[19px] leading-tight tracking-tight text-ink group-hover:text-primary transition-colors">
                guru<span className="text-primary font-black">Connect</span>
              </span>
              <span className="text-[10px] text-ink-secondary font-medium tracking-wide">
                School ERP & LMS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav aria-label="Main" className="hidden lg:flex items-center gap-1.5 text-sm">
            {navItems.map((item) => {
              if (location.pathname === "/" && item.section) {
                return (
                  <a
                    key={item.label}
                    href={`#${item.section}`}
                    className={getLinkClasses(item.to, item.section)}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={getLinkClasses(item.to, item.section)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs - Exactly matching Landing Page */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSignInClick}
              className="px-4 sm:px-5 py-2.5 text-sm font-bold text-ink hover:text-brand-orange bg-white border border-slate-200 hover:border-brand-orange/40 rounded-xl transition-all duration-200 active:scale-95 shadow-xs flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-brand-orange" />
              <span>Sign In</span>
            </button>

            {/* Get Started Button */}
            <Link
              to="/auth/register"
              className="px-5 sm:px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center font-sans tracking-wide"
            >
              <span>Get Started</span>
            </Link>

            {/* Mobile Hamburger Button (< 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-ink hover:bg-page rounded-control border border-line"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-y-0 right-0 w-full max-w-[340px] bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div>
              <div className="p-4 border-b border-line flex items-center justify-between">
                <div className="flex items-center">
                  <img src="/guruconnect-logo.png" alt="guruConnect" className="h-10 w-auto object-contain" />
                  <span className="font-extrabold text-ink text-lg">guru<span className="text-primary font-black">Connect</span></span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-ink-secondary hover:text-ink hover:bg-page rounded-full"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="p-2 flex flex-col divide-y divide-line/60">
                {navItems.map((item) => {
                  const active = isLinkActive(item.to, item.section);
                  const linkClass = `px-4 py-3.5 flex items-center justify-between text-[15px] rounded-control transition-colors ${
                    active
                      ? "font-bold text-primary bg-primary-tint/50"
                      : "font-semibold text-ink hover:bg-page"
                  }`;

                  if (location.pathname === "/" && item.section) {
                    return (
                      <a
                        key={item.label}
                        href={`#${item.section}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={linkClass}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-ink-secondary" />
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={linkClass}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-ink-secondary" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-5 border-t border-line space-y-3 bg-surface-subtle">
              <Link
                to="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-xl shadow-md flex items-center justify-center transition-all"
              >
                Get Started
              </Link>
              {onOpenDemoModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDemoModal();
                  }}
                  className="w-full py-3 bg-white border border-line-input hover:border-primary text-ink text-sm font-semibold rounded-control shadow-2xs transition-colors"
                >
                  Book a demo
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignInClick();
                }}
                className="w-full py-2.5 text-center text-sm font-bold text-ink hover:text-brand-orange bg-white border border-slate-200 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-brand-orange" />
                <span>Sign In</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Internal Login Modal if caller did not supply external modal */}
      {!onOpenLoginModal && (
        <LoginPortalModal 
          isOpen={internalLoginModalOpen} 
          onClose={() => setInternalLoginModalOpen(false)} 
        />
      )}
    </>
  );
};

export const PublicFooter: React.FC<{ onOpenDemoModal?: () => void }> = ({ onOpenDemoModal }) => {
  return (
    <footer className="bg-nav-bg text-nav-text pt-16 pb-12 px-4 sm:px-6 border-t border-nav-divider">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center">
              <img 
                src="/guruconnect-logo.png" 
                alt="guruConnect Logo" 
                className="h-16 w-auto object-contain"
              />
              <span className="font-extrabold text-white text-xl tracking-tight">
                guru<span className="text-gold">Connect</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-nav-muted max-w-sm leading-relaxed">
              Modern School & Coaching Management Software built for Indian schools, institutes, and academic institutions. CBSE & State Board ready.
            </p>
            <div className="text-xs text-nav-muted pt-1 flex flex-col gap-1">
              <span>Direct Support: <a href="mailto:support@guruconnect.in" className="text-gold hover:underline">support@guruconnect.in</a></span>
              <span>Sales: <span className="text-white">+91 98765 43210</span></span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Product</span>
            <ul className="space-y-2 text-xs sm:text-sm text-nav-muted">
              <li><Link to="/#features" className="hover:text-white transition-colors">ERP Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
              <li><Link to="/#parent-app" className="hover:text-white transition-colors">Parent App</Link></li>
              <li><Link to="/#how" className="hover:text-white transition-colors">How it works</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Company</span>
            <ul className="space-y-2 text-xs sm:text-sm text-nav-muted">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              {onOpenDemoModal ? (
                <li>
                  <button onClick={onOpenDemoModal} className="hover:text-white transition-colors text-left">
                    Book a demo
                  </button>
                </li>
              ) : (
                <li><Link to="/contact" className="hover:text-white transition-colors">Book a demo</Link></li>
              )}
              <li><Link to="/auth/login" className="hover:text-white transition-colors">Portal Login</Link></li>
              <li><Link to="/auth/register" className="hover:text-white transition-colors">Start Free Trial</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Security & Legal</span>
            <ul className="space-y-2 text-xs sm:text-sm text-nav-muted">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link to="/dpa" className="hover:text-white transition-colors">Data Processing Agreement</Link></li>
              <li><Link to="/privacy#privacy-5" className="hover:text-white transition-colors">DPDP Act 2023 Compliance</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-nav-divider flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-nav-muted">
          <span>© {new Date().getFullYear()} guruConnect Technologies Private Limited. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>🇮🇳 Hosted securely in Indian Data Centres</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
