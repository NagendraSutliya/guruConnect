import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { User, Mail, Phone, Lock, Save, Loader2, ShieldCheck, Building2, ExternalLink } from "lucide-react";

export default function AdminProfile() {
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    instituteName: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Initial populate from context or localStorage
    const saved = localStorage.getItem("admin");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile({
          name: parsed.ownerName || parsed.name || "",
          email: parsed.email || user?.email || "",
          phone: parsed.phone || "",
          instituteName: parsed.instituteName || "",
        });
      } catch (err) {
        console.error("Error reading cached admin data:", err);
      }
    }

    api.get("/admin/profile")
      .then((res) => {
        if (res.data?.data) {
          const d = res.data.data;
          setProfile({
            name: d.ownerName || "",
            email: d.email || "",
            phone: d.phone || "",
            instituteName: d.instituteName || "",
          });
        }
      })
      .catch((err) => {
        console.warn("Could not load profile:", err);
      });
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.patch("/admin/profile", {
        name: profile.name,
        phone: profile.phone,
      });
      
      // Update local storage so navbar and layouts reflect the new personal name immediately
      const saved = localStorage.getItem("admin");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          parsed.ownerName = profile.name;
          parsed.phone = profile.phone;
          localStorage.setItem("admin", JSON.stringify(parsed));
        } catch (e) {
          console.error(e);
        }
      }
      
      // Trigger a storage event so AdminLayout / AdminNavbar update reactively
      window.dispatchEvent(new Event("storage"));
      
      showToast(res.data?.message || "Profile updated successfully", "success");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!passwords.currentPassword) {
      showToast("Current password is required", "error");
      return;
    }
    if (!passwords.newPassword) {
      showToast("New password is required", "error");
      return;
    }
    if (passwords.newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.patch("/admin/profile/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      showToast(res.data?.message || "Password updated successfully", "success");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      showToast(error.response?.data?.message || "Failed to update password", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const profileInitials = profile.name.trim()
    ? profile.name.trim().split(" ").filter(Boolean).map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "AD";

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans max-w-6xl">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-title font-semibold tracking-tight text-ink">My Profile</h1>
        <p className="m-0 text-body text-ink-secondary">Your own profile, sign-in security and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card & Institution Context */}
        <div className="md:col-span-1 flex flex-col gap-5">
          <div className="bg-surface rounded-card border border-line p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary-tint text-primary-dark flex items-center justify-center text-2xl font-semibold border-2 border-primary-soft/30 mb-3.5">
              {profileInitials}
            </div>
            <h2 className="text-[17px] font-semibold text-ink m-0 truncate max-w-full" title={profile.name || "School Administrator"}>
              {profile.name || "School Administrator"}
            </h2>
            <p className="text-small text-ink-secondary mt-0.5 mb-3">School Admin</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-success-bg text-success-text rounded-full text-caption font-semibold">
              <ShieldCheck size={13} /> Active Account
            </div>
          </div>

          {/* School Context Card */}
          {profile.instituteName && (
            <div className="bg-surface-subtle rounded-card border border-line p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-ink-secondary">
                <Building2 size={15} />
                <span className="text-micro font-bold uppercase tracking-wider">Institution</span>
              </div>
              <p className="text-body font-semibold text-ink m-0 leading-snug truncate" title={profile.instituteName}>
                {profile.instituteName}
              </p>
              <p className="text-caption text-ink-secondary m-0 mt-0.5 leading-relaxed">
                To edit school name, logo, or address, visit{" "}
                <Link to="/admin/settings/institute" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
                  Institute Settings <ExternalLink size={12} />
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Personal Details Form */}
          <div className="bg-surface rounded-card border border-line p-6 flex flex-col gap-5">
            <h2 className="text-h2 font-semibold text-ink m-0 border-b border-line pb-3">Personal Information</h2>
            
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                Full Name (Personal)
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                    <User size={16} />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    value={profile.name}
                    placeholder="Enter your personal name (e.g. Nagendra Sutliya)"
                    onChange={handleProfileChange}
                    className="w-full min-h-[44px] pl-10 pr-3 border border-line-input rounded-control bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body text-ink placeholder:text-ink-secondary/50"
                  />
                </div>
                <span className="text-micro text-ink-secondary font-normal">
                  Your personal administrator name, not the school/institute name.
                </span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Email Address
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                      <Mail size={16} />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={profile.email}
                      disabled
                      className="w-full min-h-[44px] pl-10 pr-3 border border-line-input rounded-control bg-surface-subtle text-ink-secondary cursor-not-allowed text-body"
                    />
                  </div>
                </label>
                
                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Phone Number
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                      <Phone size={16} />
                    </div>
                    <input 
                      type="tel" 
                      name="phone"
                      value={profile.phone}
                      placeholder="e.g. 9425847076"
                      onChange={handleProfileChange}
                      className="w-full min-h-[44px] pl-10 pr-3 border border-line-input rounded-control bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body text-ink placeholder:text-ink-secondary/50"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={saveProfile}
                disabled={loading}
                className="inline-flex items-center gap-2 min-h-[42px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-body font-semibold transition-colors disabled:opacity-70 cursor-pointer"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Password Form */}
          <div className="bg-surface rounded-card border border-line p-6 flex flex-col gap-5">
            <h2 className="text-h2 font-semibold text-ink m-0 border-b border-line pb-3">Change Password</h2>
            
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                Current Password
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    name="currentPassword"
                    value={passwords.currentPassword}
                    placeholder="Enter your current password"
                    onChange={handlePasswordChange}
                    className="w-full min-h-[44px] pl-10 pr-3 border border-line-input rounded-control bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body text-ink"
                  />
                </div>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  New Password
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                      <Lock size={16} />
                    </div>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={passwords.newPassword}
                      placeholder="Minimum 6 characters"
                      onChange={handlePasswordChange}
                      className="w-full min-h-[44px] pl-10 pr-3 border border-line-input rounded-control bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body text-ink"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Confirm Password
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                      <Lock size={16} />
                    </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      placeholder="Confirm new password"
                      onChange={handlePasswordChange}
                      className="w-full min-h-[44px] pl-10 pr-3 border border-line-input rounded-control bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body text-ink"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={updatePassword}
                disabled={passwordLoading || !passwords.currentPassword || !passwords.newPassword}
                className="inline-flex items-center gap-2 min-h-[42px] px-5 rounded-control bg-surface border border-line hover:bg-surface-subtle text-ink text-body font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                Update Password
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
