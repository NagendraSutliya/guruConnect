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
  GraduationCap,
  Eye,
  EyeOff
} from "lucide-react";
import PortalSlider from "../../components/PortalSlider";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { setUser } = useAuth();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/student/login", { email, password });
      const data = res.data.data;

      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("role", "student");

      const studentUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
      };

      localStorage.setItem("student", JSON.stringify(studentUser));
      setUser(studentUser);
      
      nav("/student/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Student login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* ================= LEFT SIDE: VISUAL ANCHOR ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-0 overflow-hidden">
        {/* Student Focus Image */}
        <img 
          src="/images/student_login.png" 
          alt="Student Hub" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 blur-[1px]"
        />
        
        {/* Energetic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-12 xl:px-20 mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-6">
             <GraduationCap size={12} /> Student Workspace
          </div>
          
          <h2 className="text-5xl font-black text-white mb-6 leading-[1.05] tracking-tighter">
            Unlock Your <span className="text-blue-500">Academic</span> Potential.
          </h2>
          
          <p className="text-slate-300 text-lg mb-10 leading-relaxed font-medium max-w-md">
            Your journey to excellence starts here. Access your personalized dashboard, track progress, and stay synchronized with your institute.
          </p>
          
          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 flex-1">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Performance</p>
              <p className="text-xl font-bold text-white tracking-tight">Level Up</p>
            </div>
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 flex-1">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Resources</p>
              <p className="text-xl font-bold text-white tracking-tight">Active Feed</p>
            </div>
          </div>
        </div>

        {/* Dynamic Light Beam */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* ================= RIGHT SIDE: FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col items-center min-h-screen bg-white relative overflow-y-auto">
        
        {/* PORTAL SLIDER HEADER */}
        <PortalSlider activePortal="student" />

        {/* Top Right Navigation (Shifted below slider) */}
        <Link to="/" className="absolute top-24 right-8 inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all group font-bold text-[10px] uppercase tracking-widest z-10">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </Link>

        <div className="w-full max-w-lg py-10 flex-1 flex flex-col justify-start pt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Student Portal</h1>
            <p className="text-slate-500 font-medium text-lg">Ready to continue your learning?</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-2xl text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={login} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Student Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  placeholder="student@institute.com"
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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
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
                  Logging in...
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
              Having trouble?{" "}
              <a href="#" className="text-blue-600 hover:underline font-black ml-1">
                Contact Teacher
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
