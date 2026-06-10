import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Mail, 
  Lock, 
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import PortalSlider from "../../components/PortalSlider";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
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
      const res = await api.post("/auth/login", { email, password });
      const data = res.data.data;

      localStorage.setItem("role", "admin");
      localStorage.setItem("adminToken", data.token);

      const adminUser = {
        _id: data._id,
        instituteName: data.instituteName,
        email: data.email,
      };
      
      localStorage.setItem("admin", JSON.stringify(adminUser));
      setUser(adminUser);

      nav("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* ================= LEFT SIDE: VISUAL ANCHOR ================= */}
      <div className="hidden md:flex md:w-[45%] lg:w-1/2 bg-slate-950 relative items-center justify-center p-0 overflow-hidden">
        {/* Deep Field Image */}
        <img 
          src="/images/admin_login.png" 
          alt="Admin Command Center" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 blur-[2px]"
        />
        
        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-8 lg:px-12 xl:px-20 mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest mb-6">
             <ShieldCheck size={12} /> Institutional Command
          </div>
          
          <h2 className="text-3xl lg:text-5xl xl:text-6xl font-black text-white mb-4 lg:mb-6 leading-[1.1] lg:leading-[1.05] tracking-tighter">
            The Master Hub for Your <br className="hidden xl:block" /><span className="text-orange-500">Institute.</span>
          </h2>
          
          <p className="text-slate-300 text-sm lg:text-lg mb-8 lg:mb-10 leading-relaxed font-medium max-w-md">
            Take total control of your academic ecosystem. Manage staff, oversee students, and drive institutional growth with precision.
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 relative z-10">System Status</p>
              <p className="text-xl font-bold text-white tracking-tight relative z-10">99.9% Operational</p>
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all" />
            </div>
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-5 border border-white/10 relative overflow-hidden group">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 relative z-10">Security Sync</p>
              <p className="text-xl font-bold text-white tracking-tight relative z-10">Encrypted Nodes</p>
              <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ================= RIGHT SIDE: FORM ================= */}
      <div className="w-full md:w-[55%] lg:w-1/2 flex flex-col items-center min-h-screen bg-white relative overflow-y-auto custom-scrollbar px-6 lg:px-12">
        
        {/* PORTAL SLIDER HEADER */}
        <PortalSlider activePortal="admin" />

        <div className="w-full max-w-lg py-10 flex-1 flex flex-col justify-start pt-16">
          <div className="flex justify-end w-full mb-4 lg:mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all group font-bold text-[10px] uppercase tracking-widest z-10">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Portal
            </Link>
          </div>
          {/* Slider removed from here */}
          
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 font-medium text-lg">Manage your institute efficiently.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-2xl text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={login} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Official Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  type="email"
                  placeholder="admin@institute.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-orange-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded-2xl font-black text-base hover:bg-orange-700 transition-all flex items-center justify-center gap-3 mt-6 active:scale-[0.98] disabled:opacity-70 shadow-2xl shadow-orange-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-8 border-t border-slate-100">
            <p className="text-center text-slate-500 font-medium text-sm">
              New Institute?{" "}
              <Link to="/auth/register" className="text-orange-600 hover:underline font-black ml-1">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
