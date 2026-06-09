import { useState } from "react";
import api from "../../../api/axiosInstance";
import { FiEye, FiEyeOff, FiShield,  FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

const StudentChangePasswordPanel = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(newPassword);
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"][strength - 1] || "Too Weak";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setIsError(true);
      return setMessage("All fields are required.");
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      return setMessage("New passwords do not match.");
    }

    if (newPassword.length < 6) {
      setIsError(true);
      return setMessage("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);
      const res = await api.post("/student/change-password", {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      setIsError(false);
      setMessage(res.data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 pb-12 animate-fade-in">
      
      {/* 1. SIMPLE STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-xl rounded-xl -mx-6 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 shadow-sm">
        <div>
           <h1 className="text-xl font-black text-blue-700 tracking-tight leading-none">Security Settings</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-widest">Manage your account password</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-white shadow-xl shadow-slate-200 flex items-center gap-4">
              <div className="text-right border-r border-white/10 pr-4">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Status</p>
                 <h4 className="text-sm font-black text-emerald-400 leading-none mt-1">SECURE</h4>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-200 uppercase leading-none">Type</p>
                 <h4 className="text-sm font-black text-white leading-none mt-1">STUDENT</h4>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Main Form */}
        <div className="lg:col-span-2">
           <div className="card-clean p-8 bg-white border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-sm" />
                 <h3 className="bg-blue-500 rounded-full px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">Update Password</h3>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-slide-up border ${
                  isError ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                }`}>
                  {isError ? <FiAlertTriangle size={18} /> : <FiCheckCircle size={18} />}
                  <p className="text-xs font-black uppercase tracking-tight">{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Current Password */}
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          placeholder="Enter your current password"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>
                   </div>

                   {/* New Password */}
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          placeholder="Enter new password"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>
                      
                      {/* Strength Indicator */}
                      {newPassword && (
                        <div className="flex items-center justify-between px-1 mt-1">
                           <div className="flex gap-1 flex-1 max-w-[100px]">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full ${strength >= i ? (strength >= 3 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-100'}`} />
                              ))}
                           </div>
                           <span className={`text-[9px] font-black uppercase ${strength >= 3 ? 'text-emerald-500' : 'text-amber-500'}`}>{strengthLabel}</span>
                        </div>
                      )}
                   </div>

                   {/* Confirm Password */}
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter new password"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>

                      {/* Match Status */}
                      {confirmPassword && (
                        <div className="flex items-center gap-1.5 px-1 mt-1">
                           <div className={`w-1.5 h-1.5 rounded-full ${confirmPassword === newPassword ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                           <span className={`text-[9px] font-black uppercase ${confirmPassword === newPassword ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {confirmPassword === newPassword ? "Passwords Match" : "Passwords Mismatch"}
                           </span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                   <p className="text-[10px] font-bold text-slate-400 max-w-xs leading-relaxed uppercase">
                      Please use a strong password with at least 6 characters, including numbers and symbols.
                   </p>
                   <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                           setCurrentPassword("");
                           setNewPassword("");
                           setConfirmPassword("");
                           setMessage("");
                        }}
                        className="px-6 py-3 border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                   </div>
                </div>
              </form>
           </div>
        </div>

        {/* Security Tips */}
        <div className="lg:col-span-1">
           <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden h-full group shadow-xl">
              <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/30">
                    <FiShield size={24} />
                 </div>
                 <h4 className="text-lg font-black tracking-tight uppercase leading-tight">Security Best Practices</h4>
                 <div className="space-y-4 mt-8">
                    {[
                      "Change your password every few months.",
                      "Never share your login credentials.",
                      "Use a mix of letters, numbers, and symbols.",
                      "Always logout from public computers."
                    ].map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3">
                         <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-indigo-400 text-[10px] font-black shrink-0">{sIdx + 1}</div>
                         <p className="text-slate-400 text-[11px] font-medium leading-relaxed">{step}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChangePasswordPanel;
