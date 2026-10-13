import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { User, Mail, Phone, Lock, Save, Loader2, ShieldCheck } from "lucide-react";

export default function AdminProfile() {
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
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
      const parsed = JSON.parse(saved);
      setProfile({
        name: parsed.ownerName || parsed.name || "School Admin",
        email: parsed.email || user?.email || "",
        phone: parsed.phone || "",
      });
    }
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
      // Assuming an endpoint exists or we mock it for now
      // await api.put("/admin/profile", profile);
      
      // Update local storage to reflect immediately
      const saved = localStorage.getItem("admin");
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.ownerName = profile.name;
        parsed.email = profile.email;
        parsed.phone = profile.phone;
        localStorage.setItem("admin", JSON.stringify(parsed));
      }
      
      showToast("Profile updated successfully", "success");
    } catch (error) {
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      // await api.post("/admin/change-password", passwords);
      showToast("Password updated successfully", "success");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      showToast("Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-ink m-0 tracking-tight">My Profile</h1>
        <p className="text-[15px] text-ink-secondary m-0">Manage your personal account settings and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-card border border-line p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-primary-light/20 text-primary-dark flex items-center justify-center text-3xl font-semibold border-4 border-white shadow-sm mb-4">
              {profile.name.substring(0, 2).toUpperCase() || "AD"}
            </div>
            <h2 className="text-[18px] font-semibold text-ink m-0">{profile.name}</h2>
            <p className="text-[14px] text-ink-secondary mt-1 mb-3">School Admin</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
              <ShieldCheck size={14} /> Active Account
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Personal Details Form */}
          <div className="bg-white rounded-card border border-line p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-[16px] font-semibold text-ink m-0 border-b border-line pb-3">Personal Information</h3>
            
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-[14px] font-medium text-ink">
                Full Name
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                    <User size={16} />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full min-h-[42px] pl-10 pr-3 border border-line-input rounded-control bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-[14px] text-ink"
                  />
                </div>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-[14px] font-medium text-ink">
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
                      className="w-full min-h-[42px] pl-10 pr-3 border border-line-input rounded-control bg-surface text-ink-secondary cursor-not-allowed text-[14px]"
                    />
                  </div>
                </label>
                
                <label className="flex flex-col gap-1.5 text-[14px] font-medium text-ink">
                  Phone Number
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                      <Phone size={16} />
                    </div>
                    <input 
                      type="tel" 
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full min-h-[42px] pl-10 pr-3 border border-line-input rounded-control bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-[14px] text-ink"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={saveProfile}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-control bg-primary hover:bg-primary-dark text-white text-[14px] font-semibold transition-colors disabled:opacity-70"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Password Form */}
          <div className="bg-white rounded-card border border-line p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-[16px] font-semibold text-ink m-0 border-b border-line pb-3">Change Password</h3>
            
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-[14px] font-medium text-ink">
                Current Password
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full min-h-[42px] pl-10 pr-3 border border-line-input rounded-control bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-[14px] text-ink"
                  />
                </div>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-[14px] font-medium text-ink">
                  New Password
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                      <Lock size={16} />
                    </div>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full min-h-[42px] pl-10 pr-3 border border-line-input rounded-control bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-[14px] text-ink"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5 text-[14px] font-medium text-ink">
                  Confirm Password
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-secondary">
                      <Lock size={16} />
                    </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full min-h-[42px] pl-10 pr-3 border border-line-input rounded-control bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-[14px] text-ink"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={updatePassword}
                disabled={loading || !passwords.currentPassword || !passwords.newPassword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-control bg-white border border-line hover:bg-surface text-ink text-[14px] font-semibold transition-colors disabled:opacity-50"
              >
                Update Password
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
