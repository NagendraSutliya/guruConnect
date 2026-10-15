import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("superadmin@guruconnect.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/superadmin/login", { email, password });
      const data = res.data.data;

      localStorage.setItem("role", "superadmin");
      localStorage.setItem("superAdminToken", data.token);
      localStorage.setItem("superadmin", JSON.stringify(data.superadmin));

      nav("/superadmin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Super Admin Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nav-bg font-sans text-ink p-6 select-none">
      <div className="w-full max-w-[420px] flex flex-col gap-5">
        {/* Platform Admin Header */}
        <div className="flex items-center justify-center text-white">
          <img 
            src="/guruconnect-logo.png" 
            alt="guruConnect Logo" 
            className="h-32 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-white tracking-tight">
              guru<span className="text-gold">Connect</span>
            </span>
            <span className="text-[11px] font-bold tracking-wider text-gold uppercase">
              PLATFORM ADMIN
            </span>
          </div>
        </div>

        {/* Login Card */}
        <section className="bg-white rounded-2xl p-7 flex flex-col gap-5 shadow-2xl border border-line">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink m-0 tracking-tight">
              Sign in to the platform
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-1 mb-0 leading-relaxed">
              For company staff only. School users sign in at their institutional login portal.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs text-center font-semibold animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={login} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-xs sm:text-sm font-semibold text-ink">
              Work Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="min-h-[46px] px-3.5 rounded-xl bg-surface border border-line focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-colors text-ink text-sm font-medium"
                placeholder="superadmin@guruconnect.com"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs sm:text-sm font-semibold text-ink">
              Passkey
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="min-h-[46px] px-3.5 rounded-xl bg-surface border border-line focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-colors text-ink text-sm font-medium"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 min-h-[48px] rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} className="text-gold" />
                  <span>Continue</span>
                </>
              )}
            </button>

            <span className="text-[11.5px] text-ink-muted text-center leading-normal">
              Sessions end after 15 minutes without activity. All sign-ins are recorded in the audit trail.
            </span>
          </form>
        </section>

        {/* Footer Note */}
        <span className="text-xs text-nav-muted text-center font-mono">
          admin.guruconnect.in · access limited to approved networks
        </span>
      </div>
    </div>
  );
}
