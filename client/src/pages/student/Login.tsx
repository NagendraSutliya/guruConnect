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
  GraduationCap
} from "lucide-react";
import PortalSlider from "../../components/PortalSlider";

const StudentLogin = () => {
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
      {/* ================= LEFT SIDE: ILLUSTRATION ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full px-12 xl:px-20">
          <h2 className="text-3xl font-black text-white mb-4 leading-[1.1] tracking-tight">
            Unlock Your <span className="text-blue-500">Academic</span> Potential.
          </h2>
          
          <p className="text-slate-400 text-lg mb-6 leading-relaxed font-medium">
            Your journey to success starts here. Access your courses and stay connected with your educators.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 text-blue-500">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Student Portal</p>
                <p className="text-slate-400 text-xs">Your digital workspace for success.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 relative flex items-center justify-center h-[350px]">
            {/* Abstract Learning Journey Illustration */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central Glowing Aurora */}
              <div className="absolute w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] animate-pulse" />
              
              <div className="relative z-10 w-64 h-80 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden flex flex-col justify-between group transition-transform hover:scale-105 duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                <div className="space-y-6">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-2 bg-white/10 rounded-full" />
                    <div className="w-3/4 h-2 bg-white/10 rounded-full" />
                    <div className="w-1/2 h-2 bg-white/10 rounded-full" />
                  </div>
                  <div className="pt-4">
                    <div className="w-full h-24 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 flex items-center justify-center">
                       <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                         <div className="w-6 h-6 bg-purple-500/20 rounded-full animate-ping" />
                       </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/50">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-2 bg-white/20 rounded-full" />
                    <div className="w-16 h-2 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating Academic Elements */}
              <div className="absolute top-0 left-10 w-16 h-16 bg-blue-500/10 backdrop-blur-xl border border-white/5 rounded-2xl animate-float shadow-2xl flex items-center justify-center">
                <div className="w-8 h-8 rounded bg-blue-400/20 flex items-center justify-center">
                  <div className="w-4 h-4 text-blue-400">★</div>
                </div>
              </div>
              <div className="absolute bottom-10 right-10 w-20 h-20 bg-purple-500/10 backdrop-blur-xl border border-white/5 rounded-3xl animate-float-slow shadow-2xl flex items-center justify-center" style={{ animationDelay: '2s' }}>
                <div className="w-10 h-10 rounded-full bg-purple-400/20 flex items-center justify-center">
                  <div className="w-5 h-5 text-purple-400">✧</div>
                </div>
              </div>
              
              {/* Particle Field (CSS) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
                 <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                 <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>
        </div>
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
