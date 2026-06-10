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
  Eye,
  EyeOff
} from "lucide-react";
import PortalSlider from "../../components/PortalSlider";

const TeacherLogin = () => {
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
      const res = await api.post("/auth/teacher/login", { email, password });
      const data = res.data.data;

      localStorage.setItem("role", "teacher");
      localStorage.setItem("teacherToken", data.token);

      const teacherUser = {
        _id: data.id || data._id,
        name: data.name,
        email: data.email,
        instituteId: data.instituteId,
        profileImage: data.profileImage,
        phone: data.phone,
        address: data.address,
        designation: data.designation,
        qualification: data.qualification,
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
      {/* ================= LEFT SIDE: VISUAL ANCHOR ================= */}
      <div className="hidden md:flex md:w-[45%] lg:w-1/2 bg-blue-950 relative items-center justify-center p-0 overflow-hidden">
        {/* Educator Focus Image */}
        <img 
          src="/images/teacher_login.png" 
          alt="Teacher Dashboard" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 blur-[1px]"
        />
        
        {/* Atmospheric Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-8 lg:px-12 xl:px-20 mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
             <GraduationCap size={12} /> Educator Hub
          </div>
          
          <h2 className="text-3xl lg:text-5xl xl:text-6xl font-black text-white mb-4 lg:mb-6 leading-[1.1] lg:leading-[1.05] tracking-tighter">
            Empower Your <br className="hidden xl:block" /><span className="text-blue-500">Teaching</span> Journey.
          </h2>
          
          <p className="text-slate-300 text-sm lg:text-lg mb-8 lg:mb-10 leading-relaxed font-medium max-w-md">
            Join your digital classroom. Manage attendance, grade assignments, and communicate with students effortlessly.
          </p>
          
          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 flex-1">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Live Classes</p>
              <p className="text-xl font-bold text-white tracking-tight">Active Now</p>
            </div>
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 flex-1">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Student Sync</p>
              <p className="text-xl font-bold text-white tracking-tight">Real-time</p>
            </div>
          </div>
        </div>

        {/* Decorative Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* ================= RIGHT SIDE: FORM ================= */}
      <div className="w-full md:w-[55%] lg:w-1/2 flex flex-col items-center min-h-screen bg-white relative overflow-y-auto custom-scrollbar px-6 lg:px-12">
        
        {/* PORTAL SLIDER HEADER */}
        <PortalSlider activePortal="teacher" />

        <div className="w-full max-w-lg py-10 flex-1 flex flex-col justify-start pt-16">
          <div className="flex justify-end w-full mb-4 lg:mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all group font-bold text-[10px] uppercase tracking-widest z-10">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Portal
            </Link>
          </div>
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
