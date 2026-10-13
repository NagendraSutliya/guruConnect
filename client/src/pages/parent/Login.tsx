import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Phone, 
  Lock, 
  ArrowRight,
  ArrowLeft,
  Loader2,
  HeartHandshake,
  Eye,
  EyeOff,
  Sparkles,
  Receipt,
  BellRing
} from "lucide-react";
import PortalSlider from "../../components/PortalSlider";

export default function ParentLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const nav = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/parent/login", { 
        identifier: identifier.trim(), 
        password 
      });
      const data = res.data.data;

      localStorage.setItem("role", "parent");
      localStorage.setItem("parentToken", data.token);

      const parentUser = {
        _id: data.activeStudent?._id,
        name: data.parentName || "Parent",
        phone: data.parentPhone,
        email: data.parentEmail,
        children: data.children || [],
        instituteId: data.instituteId,
      };

      localStorage.setItem("parent", JSON.stringify(parentUser));
      setUser(parentUser);

      // Navigate to student dashboard (or parent overview)
      nav("/student/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        "Parent login failed. Please verify your registered guardian phone or email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full min-h-screen bg-page flex overflow-hidden font-sans text-ink">
      
      {/* ================= LEFT SIDE: VISUAL ANCHOR ================= */}
      <div className="hidden md:flex md:w-[45%] lg:w-1/2 bg-nav-bg relative items-center justify-center p-0 overflow-hidden select-none">
        {/* Background Visual */}
        <img 
          src="/images/parent_login.png" 
          alt="Parent Portal Dashboard" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
        />
        
        {/* Deep Gradient Overlays matching design tokens */}
        <div className="absolute inset-0 bg-gradient-to-t from-nav-bg via-nav-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-nav-bg/90 via-nav-bg/40 to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 w-full px-8 lg:px-12 xl:px-16 flex flex-col justify-between h-full py-12">
          
          {/* Top Brand Logo */}
          <Link to="/" className="flex items-center gap-3 self-start group">
            <img 
              src="/guruconnect-logo.png" 
              alt="guruConnect Logo" 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-white tracking-tight">
                guru<span className="text-gold">Connect</span>
              </span>
              <span className="text-[10px] text-nav-muted font-medium tracking-wide">
                Parent & Guardian Portal
              </span>
            </div>
          </Link>

          {/* Central Pitch */}
          <div className="my-auto max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider mb-5">
              <HeartHandshake className="w-3.5 h-3.5 text-gold" />
              <span>Parent & Guardian Workspace</span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4 leading-[1.15] tracking-tight">
              Stay Close to Your <span className="text-gold">Child's Journey</span>.
            </h2>
            
            <p className="text-nav-text text-sm lg:text-base mb-8 leading-relaxed font-normal">
              Track real-time attendance, download official fee receipts, review examination marksheets, and switch between siblings with a single login.
            </p>
            
            {/* Real-time badges */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider">Fee Payments</span>
                <span className="text-lg font-bold text-white mt-1">Instant Receipts</span>
                <span className="text-[11px] text-nav-muted mt-0.5">UPI, NetBanking & Card statements</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Live Attendance</span>
                <span className="text-lg font-bold text-white mt-1">Daily Alerts</span>
                <span className="text-[11px] text-nav-muted mt-0.5">Automated period bell updates</span>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="text-xs text-nav-muted flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>DPDP 2023 Compliant · Single login for all siblings</span>
          </div>

        </div>
      </div>

      {/* ================= RIGHT SIDE: LOGIN FORM ================= */}
      <div className="w-full md:w-[55%] lg:w-1/2 flex flex-col min-h-screen bg-white relative overflow-y-auto custom-scrollbar">
        
        {/* Sticky Portal Selector */}
        <PortalSlider activePortal="parent" />

        <div className="w-full max-w-md mx-auto px-6 sm:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
          
          {/* Back Link */}
          <div className="flex justify-between items-center mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-secondary hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>

            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-tint text-primary border border-primary-soft/40">
              Parent Portal
            </span>
          </div>

          {/* Title Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight m-0">
              Parent Sign In
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1.5 mb-0 leading-relaxed">
              Enter your registered guardian credentials to access your child's portal.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold animate-fadeIn">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={login} className="space-y-4 text-xs sm:text-sm">
            
            {/* Mobile / Email Field */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Registered Mobile or Email
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  type="text"
                  required
                  placeholder="9876543210 or parent@institute.edu"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-surface border border-line rounded-xl py-3 pl-10 pr-4 text-ink text-xs sm:text-sm font-medium outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-ink-muted"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-ink">Account Password</label>
                <a 
                  href="#help" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    alert("Please contact the school front office to reset your registered parent password or request an OTP."); 
                  }} 
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-line rounded-xl py-3 pl-10 pr-11 text-ink text-xs sm:text-sm font-medium outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-ink-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Parent Portal...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Parent Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Switch Portal Note */}
          <div className="mt-8 pt-6 border-t border-line text-center text-xs text-ink-secondary">
            Are you a student accessing classwork?{" "}
            <Link to="/student/login" className="text-primary font-bold hover:underline ml-1">
              Switch to Student Portal
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
