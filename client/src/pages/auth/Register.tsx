import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  CheckCircle2
} from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    instituteName: "",
    instituteType: "school",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        instituteName: form.instituteName,
        instituteType: form.instituteType,
        email: form.email,
        password: form.password,
      });
      nav("/auth/verify?email=" + form.email);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* ================= LEFT SIDE: ILLUSTRATION ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative items-center justify-center p-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-black text-white mb-4 leading-[1.1] tracking-tight">
            Launch Your Smart <span className="text-orange-500">Institute</span> Today.
          </h2>
          
          <p className="text-slate-400 text-base mb-6 leading-relaxed font-medium">
            Join the future of education management. Set up in minutes.
          </p>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <h3 className="text-white font-bold text-base mb-3">What you get:</h3>
            <div className="space-y-2">
              {[
                "Master Administration",
                "Advanced Staff Management",
                "Lifecycle Tracking",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <span className="font-medium text-xs">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <img 
              src="/images/register.png" 
              alt="Register Illustration" 
              className="max-h-[150px] w-auto mx-auto drop-shadow-2xl animate-float opacity-80"
            />
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 overflow-y-auto bg-slate-50/50">
        <div className="w-full max-w-md py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all mb-6 group font-bold text-[10px] uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="mb-6">
            <div className="flex items-center mb-3">
              <img 
                src="/guruconnect-logo.png" 
                alt="guruConnect Logo" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-base font-black tracking-tighter ml-2">
                <span className="text-orange-600">guru</span>
                <span className="text-blue-600">Connect</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Register Institute</h1>
            <p className="text-slate-500 font-medium text-sm">Start your digital transformation.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-2xl text-[10px] font-bold animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">Institute Name</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  name="instituteName"
                  type="text"
                  placeholder="e.g. Green Valley High"
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">Institution Type</label>
              <select
                name="instituteType"
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 cursor-pointer text-sm"
              >
                <option value="school">School / College</option>
                <option value="tuition">Coaching / Tuition Center</option>
                <option value="other">Other Educational Center</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                <input
                  name="email"
                  type="email"
                  placeholder="admin@institute.com"
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 ml-1 uppercase tracking-wider">Confirm</label>
                <input
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-400 text-sm"
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-black text-sm hover:bg-orange-700 transition-all flex items-center justify-center gap-3 mt-4 active:scale-[0.98] disabled:opacity-70 shadow-2xl shadow-orange-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Register Now
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-center text-slate-500 font-medium text-xs">
              Already registered?{" "}
              <Link to="/auth/login" className="text-orange-600 hover:underline font-black ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
