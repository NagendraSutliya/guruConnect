import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  MdSecurity,
  MdLock,
  MdNotifications,
  MdDevices,
  MdCheck,
  MdSave,
  MdPerson,
  MdVisibility,
  MdVisibilityOff,
  MdVpnKey,
  MdTune,
  MdShield,
  MdPhoneIphone,
  MdLaptopMac,
} from "react-icons/md";

const TeacherSettings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Dynamic user details
  const teacherName =
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "") ||
    "Teacher";
  const teacherEmail = user?.email || "teacher@school.edu";
  const teacherDesignation = user?.designation || "TGT Science & Class Teacher 8-B";
  const instituteName = user?.instituteName || "Shiksha Public School";
  const empCode =
    user?.employeeId ||
    (user?._id ? `EMP-${String(user._id).slice(-6).toUpperCase()}` : "EMP-0142");
  const teacherImage =
    user?.profileImage ||
    user?.avatar ||
    user?.photo ||
    user?.image ||
    null;

  const initials = teacherName
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .split(/\s+/)
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TR";

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    attendanceReminder: true,
    parentLeaveAlert: true,
    marksDeadlineAlert: true,
    principalCirculars: true,
    smsEmergencyAlerts: false,
  });

  // Teaching Preferences
  const [portalPrefs, setPortalPrefs] = useState({
    defaultLandingPage: "/teacher/dashboard",
    rosterSortOrder: "roll",
    gradeDisplayMode: "both",
    compactView: false,
  });

  // Security 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle password update
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      showToast("Please enter your current password.", "warn");
      return;
    }

    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters long.", "warn");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("New password and confirm password do not match.", "error");
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated successfully! Next login requires the new password.", "success");
    }, 800);
  };

  // Handle overall preference save
  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Settings and portal preferences saved successfully.", "success");
    }, 600);
  };

  // Terminate other sessions
  const handleTerminateOtherSessions = () => {
    showToast("Signed out of all other active sessions and devices.", "success");
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-fadeIn font-sans pb-12">
      {/* ================= HEADER SECTION (SINGLE LINE ON LAPTOP) ================= */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex flex-col gap-0.5 min-w-0">
          {/* Breadcrumb */}
          <div className="text-xs sm:text-[13px] text-ink-secondary flex items-center gap-1.5 mb-0.5 truncate">
            <Link to="/teacher/dashboard" className="hover:text-primary transition-colors shrink-0">
              Teacher Panel
            </Link>
            <span>›</span>
            <span className="text-ink shrink-0">Settings</span>
            <span>›</span>
            <span className="text-primary font-semibold truncate">Account & Preferences</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              Settings & Preferences
            </h1>
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Manage your login security, 2-factor authentication, academic alerts & portal display options
          </div>
        </div>

        {/* Top-Right Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MdSave size={16} />
            <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols): Primary Settings & Controls */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Card 1: Change Password & Credentials */}
          <section className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-line-row">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
                  <MdLock size={18} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-ink m-0">Change Password</h2>
                  <p className="text-xs text-ink-secondary m-0">
                    Update your teacher portal password regularly to safeguard student records
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-ink-secondary px-2 py-0.5 rounded bg-surface-subtle border border-line hidden sm:inline-block">
                TLS Encrypted
              </span>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink flex items-center justify-between">
                  <span>Current Password</span>
                  <span className="text-[11px] text-ink-secondary font-normal">Required for verification</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current account password"
                    className="w-full min-h-[40px] px-3.5 pr-10 rounded-control border border-line-input bg-surface-subtle text-xs sm:text-[13px] text-ink focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-ink">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full min-h-[40px] px-3.5 pr-10 rounded-control border border-line-input bg-surface-subtle text-xs sm:text-[13px] text-ink focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink transition-colors cursor-pointer"
                    >
                      {showNewPassword ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-ink">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full min-h-[40px] px-3.5 rounded-control border border-line-input bg-surface-subtle text-xs sm:text-[13px] text-ink focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Footer CTA */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line-row">
                <span className="text-[11px] text-ink-secondary">
                  Password must include letters & numbers for institutional compliance.
                </span>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="min-h-[38px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-1.5 self-start sm:self-auto"
                >
                  <MdVpnKey size={15} />
                  <span>{isUpdatingPassword ? "Updating..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Card 2: Notification & Alert Preferences */}
          <section className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-line-row">
              <div className="w-8 h-8 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center">
                <MdNotifications size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-ink m-0">Notification & Alert Triggers</h2>
                <p className="text-xs text-ink-secondary m-0">
                  Select which school updates and reminders you wish to receive in real-time
                </p>
              </div>
            </div>

            <div className="divide-y divide-line-row">
              {/* Toggle 1: Daily Attendance Reminder */}
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs sm:text-[13.5px] font-semibold text-ink">
                    Daily Morning Attendance Reminder
                  </span>
                  <span className="text-xs text-ink-secondary">
                    Send push notification at 08:15 AM if Class 8-B morning attendance is not submitted.
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.attendanceReminder}
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      attendanceReminder: !notifications.attendanceReminder,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    notifications.attendanceReminder ? "bg-primary" : "bg-line-input"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                      notifications.attendanceReminder ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Parent Leave Applications */}
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs sm:text-[13.5px] font-semibold text-ink">
                    Student Leave Application Alerts
                  </span>
                  <span className="text-xs text-ink-secondary">
                    Notify immediately when a student guardian submits an online leave request for approval.
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.parentLeaveAlert}
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      parentLeaveAlert: !notifications.parentLeaveAlert,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    notifications.parentLeaveAlert ? "bg-primary" : "bg-line-input"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                      notifications.parentLeaveAlert ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Marks & Exam Deadlines */}
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs sm:text-[13.5px] font-semibold text-ink">
                    Gradebook & Marks Lock Deadlines
                  </span>
                  <span className="text-xs text-ink-secondary">
                    Alert 24 hours prior to Half-Yearly / Term assessment gradebook freeze by Exam Cell.
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.marksDeadlineAlert}
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      marksDeadlineAlert: !notifications.marksDeadlineAlert,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    notifications.marksDeadlineAlert ? "bg-primary" : "bg-line-input"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                      notifications.marksDeadlineAlert ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: Principal Circulars & Staff Notices */}
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs sm:text-[13.5px] font-semibold text-ink">
                    Institutional Circulars & Staff Meetings
                  </span>
                  <span className="text-xs text-ink-secondary">
                    Broadcast notices issued by the Principal office or CBSE compliance updates.
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.principalCirculars}
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      principalCirculars: !notifications.principalCirculars,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    notifications.principalCirculars ? "bg-primary" : "bg-line-input"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                      notifications.principalCirculars ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 5: Emergency SMS Dispatch */}
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs sm:text-[13.5px] font-semibold text-ink">
                    Emergency SMS Dispatch
                  </span>
                  <span className="text-xs text-ink-secondary">
                    Receive urgent SMS on registered mobile for unplanned weather holidays or emergency substitution.
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notifications.smsEmergencyAlerts}
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      smsEmergencyAlerts: !notifications.smsEmergencyAlerts,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    notifications.smsEmergencyAlerts ? "bg-primary" : "bg-line-input"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                      notifications.smsEmergencyAlerts ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Card 3: Teaching & Portal Display Preferences */}
          <section className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-line-row">
              <div className="w-8 h-8 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MdTune size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-ink m-0">Teaching & Gradebook Preferences</h2>
                <p className="text-xs text-ink-secondary m-0">
                  Customize your default start screen and classroom assessment sorting order
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Default Start Page */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink">Default Start Page on Login</label>
                <select
                  value={portalPrefs.defaultLandingPage}
                  onChange={(e) =>
                    setPortalPrefs({ ...portalPrefs, defaultLandingPage: e.target.value })
                  }
                  className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-surface-subtle text-xs text-ink focus:bg-white focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="/teacher/dashboard">Today's Dashboard (Overview)</option>
                  <option value="/teacher/routine">My Timetable (Weekly Schedule)</option>
                  <option value="/teacher/students">My Class · 8-B (Roster & Leaves)</option>
                  <option value="/teacher/attendance">Attendance Register</option>
                  <option value="/teacher/results">Marks & Remarks Gradebook</option>
                </select>
              </div>

              {/* Roster Sorting Order */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink">Student Roster Ordering</label>
                <select
                  value={portalPrefs.rosterSortOrder}
                  onChange={(e) =>
                    setPortalPrefs({ ...portalPrefs, rosterSortOrder: e.target.value })
                  }
                  className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-surface-subtle text-xs text-ink focus:bg-white focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="roll">By Roll Number (01 to 38)</option>
                  <option value="name">Alphabetical by First Name (A to Z)</option>
                </select>
              </div>

              {/* Gradebook Display Mode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink">Gradebook Score Format</label>
                <select
                  value={portalPrefs.gradeDisplayMode}
                  onChange={(e) =>
                    setPortalPrefs({ ...portalPrefs, gradeDisplayMode: e.target.value })
                  }
                  className="min-h-[40px] px-3.5 rounded-control border border-line-input bg-surface-subtle text-xs text-ink focus:bg-white focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="both">Numerical Marks + CBSE Grade (e.g. 78/80 · A1)</option>
                  <option value="marks">Raw Marks Only (e.g. 78/80)</option>
                  <option value="grades">Letter Grades Only (e.g. A1)</option>
                </select>
              </div>

              {/* Academic Session Indicator */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink">Active Academic Term</label>
                <div className="min-h-[40px] px-3.5 rounded-control border border-line bg-surface-head flex items-center justify-between text-xs font-semibold text-ink">
                  <span>Session 2026-27 · Term 1</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Profile Snapshot, Security & Session Audit */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Card 1: Teacher Identity Snapshot */}
          <section className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-line-input bg-primary-tint text-primary-dark flex items-center justify-center font-bold text-base shadow-2xs shrink-0 overflow-hidden">
                {teacherImage ? (
                  <img
                    src={teacherImage}
                    alt={teacherName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-ink leading-tight truncate m-0" title={teacherName}>
                  {teacherName}
                </h3>
                <p className="text-xs text-ink-secondary truncate m-0 mt-0.5" title={teacherEmail}>
                  {teacherEmail}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-tint text-primary-dark border border-primary/20">
                  {teacherDesignation}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-line-row space-y-2 text-xs">
              <div className="flex justify-between items-center text-ink-secondary">
                <span>Employee Code:</span>
                <span className="font-mono font-semibold text-ink">{empCode}</span>
              </div>
              <div className="flex justify-between items-center text-ink-secondary">
                <span>Institution:</span>
                <span className="font-semibold text-ink truncate max-w-[170px]" title={instituteName}>
                  {instituteName}
                </span>
              </div>
              <div className="flex justify-between items-center text-ink-secondary">
                <span>Security Clearance:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <MdCheck size={14} /> Faculty Educator
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/teacher/profile"
                className="w-full min-h-[36px] px-3 rounded-control border border-line-input bg-surface hover:bg-slate-50 text-ink text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <MdPerson size={15} className="text-primary" />
                <span>View Full Profile & ID Card</span>
              </Link>
            </div>
          </section>

          {/* Card 2: Two-Factor Authentication (2FA) */}
          <section className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-line-row">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
                  <MdShield size={16} />
                </div>
                <h3 className="text-xs font-bold text-ink uppercase tracking-wider m-0">Two-Factor Authentication</h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  twoFactorEnabled
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-surface-subtle text-ink-secondary border border-line"
                }`}
              >
                {twoFactorEnabled ? "Active" : "Disabled"}
              </span>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed m-0">
              Require an OTP verification code sent to your registered mobile phone before submitting final term marks or downloading confidential salary documents.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const nextState = !twoFactorEnabled;
                  setTwoFactorEnabled(nextState);
                  showToast(
                    nextState
                      ? "Two-Factor Authentication (2FA) enabled for teacher portal."
                      : "Two-Factor Authentication disabled.",
                    nextState ? "success" : "info"
                  );
                }}
                className={`w-full min-h-[36px] px-3.5 rounded-control text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  twoFactorEnabled
                    ? "border border-line-input bg-white hover:bg-slate-50 text-ink"
                    : "bg-primary hover:bg-primary-dark text-white shadow-2xs"
                }`}
              >
                <MdSecurity size={15} />
                <span>{twoFactorEnabled ? "Disable 2FA Protection" : "Enable 2FA Protection"}</span>
              </button>
            </div>
          </section>

          {/* Card 3: Active Devices & Session Audit */}
          <section className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-line-row">
              <div className="w-7 h-7 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
                <MdDevices size={16} />
              </div>
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider m-0">Active Login Sessions</h3>
            </div>

            <div className="space-y-2.5">
              {/* Session 1: Current Device */}
              <div className="p-2.5 rounded-control bg-surface-subtle border border-line flex items-start gap-2.5">
                <MdLaptopMac size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink">Windows PC · Chrome 124</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      Current
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-secondary m-0 mt-0.5">
                    Campus Wi-Fi · Jaipur, Rajasthan · Active now
                  </p>
                </div>
              </div>

              {/* Session 2: Mobile Safari */}
              <div className="p-2.5 rounded-control bg-surface-subtle border border-line flex items-start gap-2.5">
                <MdPhoneIphone size={18} className="text-ink-secondary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-ink">Mobile Safari · iOS 17</span>
                  <p className="text-[11px] text-ink-secondary m-0 mt-0.5">
                    Personal Phone · Yesterday at 07:45 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTerminateOtherSessions}
                className="w-full min-h-[36px] px-3 rounded-control border border-line-input bg-surface hover:bg-slate-50 text-danger text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Sign Out All Other Sessions</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;
