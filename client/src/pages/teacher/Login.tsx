import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  GraduationCap,
  Users
} from "lucide-react";
import PortalSlider from "../../components/PortalSlider";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { setUser } = useAuth();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/teacher/login", { email, password });
      const data = res.data.data;

      localStorage.setItem("role", "teacher");
      localStorage.setItem("teacherToken", data.token);

      const teacherUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
      };

      localStorage.setItem("teacher", JSON.stringify(teacherUser));
      setUser(teacherUser);

      nav("/teacher/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid teacher credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* ================= LEFT SIDE: ILLUSTRATION ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-950 relative items-center justify-center p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full px-12 xl:px-20">
          <h2 className="text-3xl font-black text-white mb-4 leading-[1.1] tracking-tight">
            Empower Your <span className="text-blue-500">Teaching</span> Journey.
          </h2>
          
          <p className="text-slate-400 text-lg mb-6 leading-relaxed font-medium">
            Join your digital classroom. Manage attendance, grade assignments, and communicate effortlessly.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 text-blue-500">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Educator Hub</p>
                <p className="text-slate-400 text-xs">Empowering teachers with smart tools.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 relative flex items-center justify-center h-[350px]">
            {/* Abstract Educator Hub Illustration */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central Glowing Orb */}
              <div className="absolute w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] animate-pulse" />
              
              <div className="relative z-10 w-64 h-80 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden flex flex-col justify-between group transition-transform hover:scale-105 duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                  </div>
                  <div className="w-32 h-2 bg-white/10 rounded-full" />
                  <div className="pt-4 space-y-3">
                    <div className="h-10 bg-white/5 rounded-xl border border-white/5 flex items-center px-3 gap-2">
                       <div className="w-4 h-4 rounded bg-blue-500/30" />
                       <div className="w-16 h-1.5 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-10 bg-white/5 rounded-xl border border-white/5 flex items-center px-3 gap-2">
                       <div className="w-4 h-4 rounded bg-indigo-500/30" />
                       <div className="w-20 h-1.5 bg-white/10 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-2 bg-white/20 rounded-full" />
                    <div className="w-16 h-2 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating Classroom Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-indigo-500/10 backdrop-blur-xl border border-white/5 rounded-3xl animate-float shadow-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-indigo-400 opacity-50" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 backdrop-blur-xl border border-white/5 rounded-3xl animate-float-slow shadow-2xl flex items-center justify-center" style={{ animationDelay: '1.5s' }}>
                <Mail className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
              
              {/* Radial Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col items-center min-h-screen bg-white relative overflow-y-auto">
        
        {/* PORTAL SLIDER HEADER */}
        <PortalSlider activePortal="teacher" />

        {/* Top Right Navigation (Shifted below slider) */}
        <Link to="/" className="absolute top-24 right-8 inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all group font-bold text-[10px] uppercase tracking-widest z-10">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </Link>

        <div className="w-full max-w-lg py-10 flex-1 flex flex-col justify-start pt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Teacher Portal</h1>
            <p className="text-slate-500 font-medium text-lg">Welcome back, Educator!</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-2xl text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={login} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Work Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  placeholder="teacher@institute.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-base"
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
              Difficulty logging in?{" "}
              <a href="#" className="text-blue-600 hover:underline font-black ml-1">
                Contact Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
