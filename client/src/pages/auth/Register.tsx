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
  CheckCircle2,
  Phone
} from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    instituteName: "",
    instituteType: "school",
    email: "",
    phone: "",
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
        phone: form.phone,
        password: form.password,
      });
      // alert("Registration successful! (OTP bypassed for testing) Please log in.");
      nav("/auth/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* ================= LEFT SIDE: VISUAL ANCHOR (40%) ================= */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-slate-950 relative items-center justify-center p-0 overflow-hidden h-full border-r border-white/5">
        {/* Onboarding Visual */}
        <img 
          src="/images/register_bg.png" 
          alt="Institute Onboarding" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 blur-[1px]"
        />
        
        {/* Deep Field Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-8 lg:px-12 xl:px-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest mb-8">
             <CheckCircle2 size={12} /> Institutional Launch
          </div>
          
          <h2 className="text-3xl lg:text-5xl xl:text-6xl font-black text-white mb-4 lg:mb-6 leading-[1.1] lg:leading-[1.05] tracking-tighter">
            Launch Your Smart <br className="hidden xl:block" /><span className="text-orange-500">Institute</span> Today.
          </h2>
          
          <p className="text-slate-300 text-sm lg:text-lg mb-8 lg:mb-10 leading-relaxed font-medium max-w-sm">
            Join the future of education management. Establish your digital presence with precision.
          </p>
          
          <div className="space-y-3 max-w-sm">
            {[
              { label: "Master Administration", desc: "Full control over academic assets." },
              { label: "Advanced Analytics", desc: "Deep insights into performance." },
              { label: "Secure Data Nodes", desc: "Enterprise-grade encryption." }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-all cursor-default">
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wide">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Particle Glow */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* ================= RIGHT SIDE: FORM (60%) ================= */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col items-center bg-slate-50/50 h-full overflow-y-auto custom-scrollbar px-6 lg:px-12">
        <div className="w-full max-w-2xl py-10 flex-1 flex flex-col justify-start">
          
        <div className="flex justify-end w-full mb-4 lg:mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all group font-bold text-[10px] uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Register Institute</h1>
              <p className="text-slate-500 font-medium text-base">Start your digital transformation today.</p>
            </div>
          
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-2xl text-[11px] font-black uppercase tracking-wider animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Institute Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                  <input
                    name="instituteName"
                    type="text"
                    placeholder="e.g. Green Valley High"
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-300 text-sm shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Institution Type</label>
                <select
                  name="instituteType"
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 px-5 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 cursor-pointer text-sm shadow-sm"
                >
                  <option value="school">School / College</option>
                  <option value="tuition">Coaching / Tuition Center</option>
                  <option value="other">Other Educational Center</option>
                </select>
              </div>
            </div>

            {/* Row 2: Contact Info */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Work Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    placeholder="admin@institute.com"
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-300 text-sm shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-300 text-sm shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-300 text-sm shadow-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-widest">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors opacity-30" />
                  <input
                    name="confirm"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-50 transition-all font-semibold text-slate-900 placeholder:text-slate-300 text-sm shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-orange-700 transition-all flex items-center justify-center gap-3 mt-4 active:scale-[0.98] disabled:opacity-70 shadow-2xl shadow-orange-200 uppercase tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finalizing Registration...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-200/60">
            <p className="text-center text-slate-500 font-medium text-sm">
              Already have an institute registered?{" "}
              <Link to="/auth/login" className="text-orange-600 hover:underline font-black ml-1 uppercase tracking-tighter">
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
