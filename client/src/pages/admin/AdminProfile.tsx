import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  MdSecurity,
  MdLock,
  MdDevices,
  MdNotificationsActive,
  MdCheckCircle,
  MdClose,
  MdKey,
} from "react-icons/md";

interface AlertPref {
  id: string;
  label: string;
  app: boolean;
  email: boolean;
  sms: boolean;
}

const DEFAULT_ALERTS: AlertPref[] = [
  { id: "approvals", label: "Approvals waiting for me", app: true, email: true, sms: false },
  { id: "attendance", label: "Attendance not marked by cut-off", app: true, email: false, sms: false },
  { id: "fee_summary", label: "Daily fee collection summary", app: false, email: true, sms: false },
  { id: "support_req", label: "Support access request", app: true, email: true, sms: true },
  { id: "new_device", label: "Sign-in from a new device", app: true, email: true, sms: true },
];

export default function AdminProfile() {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "Meera Kumawat",
    email: "meera.k@shikshapublic.edu.in",
    mobile: "98290 61122",
    instituteName: "Shiksha Public School",
    role: "School Admin",
    language: "English",
  });

  // Modal dialog states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [showTrustedDevicesModal, setShowTrustedDevicesModal] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [alerts, setAlerts] = useState<AlertPref[]>(DEFAULT_ALERTS);

  // Active Sessions
  const [sessions, setSessions] = useState([
    { id: "s1", device: "Chrome on Windows · office PC", location: "Jaipur · now", isCurrent: true },
    { id: "s2", device: "Android app · Samsung", location: "Jaipur · 2 h ago", isCurrent: false },
    { id: "s3", device: "Chrome on Mac", location: "Jaipur · 6 Oct", isCurrent: false },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("admin");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile((prev) => ({
          ...prev,
          name: parsed.ownerName || parsed.name || prev.name,
          email: parsed.email || user?.email || prev.email,
          mobile: parsed.phone || prev.mobile,
          instituteName: parsed.instituteName || prev.instituteName,
        }));
      } catch (err) {
        console.error(err);
      }
    }

    api
      .get("/admin/profile")
      .then((res) => {
        if (res.data?.data) {
          const d = res.data.data;
          setProfile((prev) => ({
            ...prev,
            name: d.ownerName || d.name || prev.name,
            email: d.email || prev.email,
            mobile: d.phone || prev.mobile,
            instituteName: d.instituteName || prev.instituteName,
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote profile:", err);
      });
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch("/admin/profile", {
        name: profile.name,
        phone: profile.mobile,
      });

      const saved = localStorage.getItem("admin");
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.ownerName = profile.name;
        parsed.phone = profile.mobile;
        localStorage.setItem("admin", JSON.stringify(parsed));
      }
      window.dispatchEvent(new Event("storage"));
      showToast("Profile details updated successfully!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.patch("/admin/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      showToast("Password changed successfully!", "success");
      setShowPasswordModal(false);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showToast(err.response?.data?.message || "Password update error", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSignoutOtherDevices = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    showToast("Signed out of all 2 other active devices successfully.", "success");
  };

  const toggleAlert = (id: string, channel: "app" | "email" | "sms") => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [channel]: !a[channel] } : a))
    );
    showToast("Alert preference updated.", "info");
  };

  // Initials
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F5F6F3] font-sans text-[#17201D] p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto space-y-5">
        {/* Header matching Screen 44 */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#17201D]">My account</h1>
          <p className="text-sm text-[#4F5B57] mt-0.5">
            Your own profile, sign-in security and alerts.
          </p>
        </div>

        {/* 4 Sections Grid matching Screen 44 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* SECTION 1: PROFILE */}
          <section className="bg-white border border-[#DDE2DE] rounded-xl p-5 flex flex-col gap-3 shadow-xs">
            <h2 className="text-base font-semibold text-[#17201D]">Profile</h2>

            <div className="flex items-center gap-3 pb-2 border-b border-[#EEF1EF]">
              <div className="w-14 h-14 rounded-full bg-[#E3EFEF] text-[#08393F] flex items-center justify-center font-bold text-base flex-none">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-[#17201D]">{profile.name}</span>
                <span className="text-xs text-[#4F5B57]">
                  {profile.role} · {profile.instituteName}
                </span>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-3">
              <label className="flex flex-col gap-1.5 text-xs font-medium text-[#17201D]">
                Full name
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="h-11 px-3 border border-[#C9D1CD] rounded-lg bg-white text-sm text-[#17201D] focus:outline-none focus:border-[#0E5A63]"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-medium text-[#17201D]">
                Mobile
                <input
                  type="text"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  className="h-11 px-3 border border-[#C9D1CD] rounded-lg bg-white text-sm font-mono text-[#17201D] focus:outline-none focus:border-[#0E5A63]"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-medium text-[#17201D]">
                Email
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="h-11 px-3 border border-[#C9D1CD] rounded-lg bg-[#F9FAF8] text-sm text-[#4F5B57]"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-medium text-[#17201D]">
                Language
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className="h-11 px-3 border border-[#C9D1CD] rounded-lg bg-white text-sm text-[#17201D]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-10 px-4 rounded-lg bg-[#0E5A63] hover:bg-[#08393F] text-white text-xs font-semibold transition disabled:opacity-60 shadow-xs"
              >
                {loading ? "Saving..." : "Save profile"}
              </button>
            </form>
          </section>

          {/* SECTION 2: SIGN-IN SECURITY */}
          <section className="bg-white border border-[#DDE2DE] rounded-xl p-5 flex flex-col gap-3 shadow-xs">
            <h2 className="text-base font-semibold text-[#17201D]">Sign-in security</h2>

            <div className="flex justify-between items-center text-sm py-2.5 border-t border-[#EEF1EF]">
              <span className="font-medium text-[#17201D]">Password</span>
              <span className="text-xs text-[#4F5B57]">
                Changed 12 Aug ·{" "}
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="text-[#0E5A63] hover:underline font-semibold"
                >
                  Change
                </button>
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-2.5 border-t border-[#EEF1EF]">
              <span className="font-medium text-[#17201D]">Two-step verification</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E4F1E8] text-[#1E5A33]">
                On · authenticator app
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-2.5 border-t border-[#EEF1EF]">
              <span className="font-medium text-[#17201D]">Backup codes</span>
              <span className="text-xs text-[#4F5B57]">
                7 of 10 left ·{" "}
                <button
                  type="button"
                  onClick={() => setShowBackupCodesModal(true)}
                  className="text-[#0E5A63] hover:underline font-semibold"
                >
                  View new codes
                </button>
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-2.5 border-t border-[#EEF1EF]">
              <span className="font-medium text-[#17201D]">Trusted devices</span>
              <span className="text-xs text-[#4F5B57]">
                2 ·{" "}
                <button
                  type="button"
                  onClick={() => setShowTrustedDevicesModal(true)}
                  className="text-[#0E5A63] hover:underline font-semibold"
                >
                  Manage
                </button>
              </span>
            </div>
          </section>

          {/* SECTION 3: WHERE YOU'RE SIGNED IN */}
          <section className="bg-white border border-[#DDE2DE] rounded-xl p-5 flex flex-col gap-2 shadow-xs">
            <div className="flex justify-between items-center pb-2 flex-wrap gap-2">
              <h2 className="text-base font-semibold text-[#17201D]">Where you're signed in</h2>
              <button
                type="button"
                onClick={handleSignoutOtherDevices}
                className="h-[38px] px-3.5 border border-[#C9D1CD] rounded-lg bg-white hover:bg-[#F9FAF8] text-xs font-medium text-[#17201D] transition"
              >
                Sign out of all other devices
              </button>
            </div>

            <div className="divide-y divide-[#EEF1EF]">
              {sessions.map((s) => (
                <div key={s.id} className="flex justify-between items-center py-2.5 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-xs text-[#17201D]">{s.device}</span>
                    <span className="text-[11px] text-[#4F5B57]">{s.location}</span>
                  </div>
                  {s.isCurrent ? (
                    <span className="text-xs font-semibold text-[#1E5A33]">This device</span>
                  ) : (
                    <span className="text-xs font-semibold text-[#4F5B57]">Active</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: ALERTS I RECEIVE */}
          <section className="bg-white border border-[#DDE2DE] rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#EEF1EF]">
              <h2 className="text-base font-semibold text-[#17201D]">Alerts I receive</h2>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2F4F2] text-[#17201D] border-b border-[#DDE2DE]">
                  <th className="py-2.5 px-4 font-semibold">Alert</th>
                  <th className="py-2.5 px-3 font-semibold text-center">App</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Email</th>
                  <th className="py-2.5 px-3 font-semibold text-center">SMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1EF]">
                {alerts.map((alt) => (
                  <tr key={alt.id} className="hover:bg-[#F9FAF8] transition">
                    <td className="py-2 px-4 font-medium text-[#17201D]">{alt.label}</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={alt.app}
                        onChange={() => toggleAlert(alt.id, "app")}
                        className="w-4 h-4 rounded text-[#0E5A63] focus:ring-[#0E5A63] cursor-pointer"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={alt.email}
                        onChange={() => toggleAlert(alt.id, "email")}
                        className="w-4 h-4 rounded text-[#0E5A63] focus:ring-[#0E5A63] cursor-pointer"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={alt.sms}
                        onChange={() => toggleAlert(alt.id, "sms")}
                        className="w-4 h-4 rounded text-[#0E5A63] focus:ring-[#0E5A63] cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      {/* =========================================================================
          MODAL: CHANGE PASSWORD
         ========================================================================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DDE2DE] max-w-sm w-full p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EEF1EF] pb-2">
              <h3 className="font-semibold text-sm text-[#17201D]">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-[#4F5B57] hover:text-[#17201D]"
              >
                <MdClose size={18} />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#4F5B57] font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full h-10 px-3 bg-[#F9FAF8] border border-[#C9D1CD] rounded-lg focus:outline-none focus:border-[#0E5A63]"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="h-9 px-3 border border-[#C9D1CD] rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="h-9 px-4 rounded-lg bg-[#0E5A63] text-white text-xs font-semibold"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BACKUP CODES
         ========================================================================= */}
      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DDE2DE] max-w-sm w-full p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EEF1EF] pb-2">
              <h3 className="font-semibold text-sm text-[#17201D]">Emergency Backup Codes</h3>
              <button
                onClick={() => setShowBackupCodesModal(false)}
                className="text-[#4F5B57] hover:text-[#17201D]"
              >
                <MdClose size={18} />
              </button>
            </div>
            <p className="text-xs text-[#4F5B57]">
              Each code can be used once if you lose access to your authenticator app. Store them securely.
            </p>
            <div className="grid grid-cols-2 gap-2 bg-[#F9FAF8] p-3 rounded-lg border border-[#DDE2DE] font-mono text-xs text-[#17201D] text-center font-bold">
              <span>9481-2290</span>
              <span>1842-9901</span>
              <span>5521-0082</span>
              <span>7719-3381</span>
              <span>3201-8842</span>
              <span>6110-4491</span>
              <span>8042-1176</span>
              <span className="text-[#9AA8A3] line-through">4420-1923</span>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  showToast("Backup codes copied to clipboard", "success");
                  setShowBackupCodesModal(false);
                }}
                className="h-9 px-4 rounded-lg bg-[#0E5A63] text-white text-xs font-semibold"
              >
                Copy & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: TRUSTED DEVICES
         ========================================================================= */}
      {showTrustedDevicesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DDE2DE] max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EEF1EF] pb-2">
              <h3 className="font-semibold text-sm text-[#17201D]">Trusted Devices</h3>
              <button
                onClick={() => setShowTrustedDevicesModal(false)}
                className="text-[#4F5B57] hover:text-[#17201D]"
              >
                <MdClose size={18} />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 border border-[#DDE2DE] rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#17201D]">Office PC (Chrome / Windows)</div>
                  <div className="text-[11px] text-[#4F5B57]">Added 12 Aug · Mansarovar Campus</div>
                </div>
                <span className="text-[11px] font-bold text-[#1E5A33]">Verified</span>
              </div>
              <div className="p-3 border border-[#DDE2DE] rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#17201D]">Samsung Galaxy S23 (Admin App)</div>
                  <div className="text-[11px] text-[#4F5B57]">Added 1 Sep · Biometric Face ID</div>
                </div>
                <span className="text-[11px] font-bold text-[#1E5A33]">Verified</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowTrustedDevicesModal(false)}
                className="h-9 px-4 rounded-lg border border-[#C9D1CD] text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
