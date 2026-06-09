import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axiosInstance";
import { 
  ShieldCheck, 
  ArrowLeft,
  Loader2,
  Smartphone
} from "lucide-react";

const Verify = () => {
  const [params] = useSearchParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const phone = params.get("phone") || "";

  const verify = async () => {
    if (!code) return setError("Please enter your verification code");
    setError("");
    try {
      setLoading(true);
      await api.post("/auth/verify", { phone, code });
      nav("/auth/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md">
        <Link to="/auth/register" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all mb-8 group font-bold text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Registration
        </Link>

        <div className="bg-white p-10 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-[30px] flex items-center justify-center mb-8 shadow-xl shadow-orange-100">
              <Smartphone className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Verify Your Phone</h2>
            <p className="text-slate-500 font-medium leading-relaxed px-4">
              We've sent a 6-digit verification code to <br />
              <span className="text-slate-900 font-bold">{phone}</span>
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-2xl text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Verification Code</label>
              <input
                value={code}
                placeholder="000 000"
                maxLength={6}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 text-center text-3xl font-black text-slate-900 outline-none focus:border-orange-600 focus:bg-white focus:ring-8 focus:ring-orange-50 transition-all placeholder:text-slate-200 tracking-[0.5em]"
              />
            </div>

            <button
              onClick={verify}
              disabled={loading}
              className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-orange-200 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ShieldCheck className="w-6 h-6" />
                </>
              )}
            </button>

            <p className="text-center text-slate-500 font-medium pt-4">
              Didn't receive the code?{" "}
              <button className="text-orange-600 font-black hover:underline ml-1">
                Resend SMS
              </button>
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <img 
              src="/guruconnect-logo.png" 
              alt="guruConnect Logo" 
              className="h-8 w-auto opacity-50 grayscale"
            />
            <span className="text-slate-300 font-bold tracking-tighter text-sm uppercase">guruConnect Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
