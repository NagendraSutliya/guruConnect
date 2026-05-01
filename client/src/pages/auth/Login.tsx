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
  Settings,
} from "lucide-react";

import PortalSlider from "../../components/PortalSlider";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      {/* ================= LEFT SIDE: ILLUSTRATION ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative items-center justify-center p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full px-12 xl:px-20">
          <h2 className="text-3xl font-black text-white mb-4 leading-[1.1] tracking-tight">
            The Master Hub for Your <span className="text-orange-500">Institute.</span>
          </h2>
          
          <p className="text-slate-400 text-lg mb-6 leading-relaxed font-medium">
            Take total control of your academic ecosystem. Manage staff, oversee students, and drive growth.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 text-orange-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Secure Administration</p>
                <p className="text-slate-400 text-xs">Enterprise-grade control for your institute.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 relative flex items-center justify-center h-[350px]">
            {/* Abstract Command Center Illustration */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central Glowing Shield */}
              <div className="absolute w-48 h-48 bg-orange-500/20 rounded-full blur-[60px] animate-pulse" />
              <div className="relative z-10 w-64 h-80 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden flex flex-col justify-between group transition-transform hover:scale-105 duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
                <div className="space-y-4">
                  <div className="w-12 h-2 bg-white/10 rounded-full" />
                  <div className="w-20 h-2 bg-white/10 rounded-full" />
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div className="h-16 bg-white/5 rounded-2xl border border-white/5" />
                    <div className="h-16 bg-white/5 rounded-2xl border border-white/5" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/50">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-2 bg-white/20 rounded-full" />
                    <div className="w-16 h-2 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-0 right-10 w-24 h-24 bg-blue-500/10 backdrop-blur-xl border border-white/5 rounded-3xl animate-float shadow-2xl flex items-center justify-center" style={{ animationDelay: '1s' }}>
                <Settings className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
              <div className="absolute bottom-10 left-10 w-20 h-20 bg-orange-500/10 backdrop-blur-xl border border-white/5 rounded-3xl animate-float-slow shadow-2xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-orange-400 opacity-50" />
              </div>
              
              {/* Connection Lines (CSS) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full opacity-20 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/5 rounded-full opacity-10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col items-center min-h-screen bg-white relative overflow-y-auto">
        
        {/* PORTAL SLIDER HEADER */}
        <PortalSlider activePortal="admin" />

        {/* Top Right Navigation (Shifted below slider) */}
        <Link to="/" className="absolute top-24 right-8 inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all group font-bold text-[10px] uppercase tracking-widest z-10">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </Link>

        <div className="w-full max-w-lg py-10 flex-1 flex flex-col justify-start pt-16">
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
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-orange-600 focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-base"
                  required
                />
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
