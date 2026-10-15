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
  Phone,
  User,
  MapPin,
  Check,
  ShieldCheck,
  School,
  GraduationCap,
  Eye,
  EyeOff
} from "lucide-react";

const Register = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [form, setForm] = useState({
    instituteType: "school",
    instituteName: "",
    city: "",
    state: "Rajasthan",
    board: "CBSE",
    studentCount: "500–1,000",
    ownerName: "",
    role: "Principal",
    email: "",
    phone: "",
    otp: "",
    selectedPlan: "standard",
    password: "",
    confirm: "",
    agreedTerms: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const steps = [
    { num: 1, title: "Organisation", subtitle: "School details" },
    { num: 2, title: "Verify", subtitle: "Mobile & email" },
    { num: 3, title: "Choose Plan", subtitle: "30-day trial" },
    { num: 4, title: "Ready", subtitle: "Set password" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!form.instituteName.trim()) return setError("Please enter your institute/school name");
      if (!form.city.trim()) return setError("Please enter your city");
      if (!form.ownerName.trim()) return setError("Please enter contact person name");
      if (!form.phone.trim()) return setError("Please enter mobile number");
      if (!form.email.trim()) return setError("Please enter work email");
    } else if (currentStep === 2) {
      // In real scenario OTP is checked, here user can click proceed
    } else if (currentStep === 3) {
      // Plan selected
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      return setError("Passwords do not match");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        instituteName: form.instituteName,
        instituteType: form.instituteType,
        ownerName: form.ownerName,
        city: form.city,
        board: form.instituteType === "school" ? form.board : undefined,
        studentCount: form.studentCount ? parseInt(form.studentCount.replace(/[^0-9]/g, '')) || 500 : 500,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      nav("/auth/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex overflow-hidden font-sans text-ink">
      
      {/* ================= LEFT SIDE: VISUAL ANCHOR (IMAGE RETAINED) ================= */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[38%] bg-nav-bg relative items-center justify-center p-0 overflow-hidden h-screen border-r border-nav-divider shrink-0">
        <img 
          src="/images/register_bg.png" 
          alt="Institute Onboarding" 
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105"
        />
        
        {/* Deep Field Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-nav-bg via-nav-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-nav-bg/80 via-transparent to-transparent" />

        <div className="relative z-10 w-full px-8 xl:px-12 flex flex-col justify-between h-full py-12">
          {/* Logo on Image */}
          <Link to="/" className="inline-flex items-center group">
            <img 
              src="/guruconnect-logo.png" 
              alt="guruConnect Logo" 
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
            <span className="font-extrabold text-white text-xl tracking-tight">
              guru<span className="text-gold">Connect</span>
            </span>
          </Link>

          {/* Value Proposition Box */}
          <div className="space-y-6">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Register your school or institute.
            </h2>
            
            <p className="text-nav-muted text-sm leading-relaxed max-w-sm">
              Free trial, no payment card needed. You become the first administrator and can add your team after setup.
            </p>
            
            <div className="space-y-3 max-w-sm">
              {[
                { label: "Data stored in India", desc: "Tier-4 data centres, DPDP Act 2023 compliant." },
                { label: "CBSE & State Board Ready", desc: "Report cards, grade engines & syllabus tracker." },
                { label: "Assisted Migration", desc: "Free student & fee excel data import help." }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md rounded-xl p-3.5 border border-white/10 flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/40 text-gold flex items-center justify-center shrink-0 border border-gold/20">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[11px] text-nav-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-nav-muted">
            Prefer a guided walkthrough first?{" "}
            <Link to="/" className="text-gold font-semibold hover:underline">
              Book a demo
            </Link>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: PROGRESS BAR AT TOP (FIXED) + SCROLLABLE FORM ================= */}
      <div className="flex-1 flex flex-col bg-surface h-screen overflow-hidden">
        
        {/* Fixed Top Header with Back Link & Progress Bar */}
        <div className="sticky top-0 z-30 bg-surface shrink-0">
          {/* Top Header with Back Link */}
          <div className="px-6 sm:px-10 pt-5 pb-3.5 border-b border-line flex items-center justify-between bg-white">
            <Link to="/" className="inline-flex items-center gap-2 text-ink-secondary hover:text-primary text-xs font-bold uppercase tracking-wider transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
            
            <div className="text-xs text-ink-secondary">
              Already registered?{" "}
              <Link to="/auth/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>

          {/* ================= 4-STEP PROGRESS BAR (FIXED TOP) ================= */}
          <div className="px-6 sm:px-10 py-4 bg-page border-b border-line shadow-2xs">
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
                {steps.map((s) => {
                  const isCompleted = currentStep > s.num;
                  const isCurrent = currentStep === s.num;

                  return (
                    <div key={s.num} className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-2 mb-1.5 w-full">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all mx-auto shrink-0 shadow-xs ${
                            isCompleted
                              ? "bg-primary text-white"
                              : isCurrent
                              ? "bg-brand-orange text-white ring-4 ring-brand-orange-light"
                              : "bg-white border border-line-input text-ink-secondary"
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isCurrent ? "text-ink" : "text-ink-secondary"}`}>
                        {s.title}
                      </span>
                      <span className="text-[10px] text-ink-secondary hidden sm:inline-block">
                        {s.subtitle}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Visual Track Bar */}
              <div className="w-full bg-line rounded-full h-1.5 mt-3 overflow-hidden">
                <div 
                  className="bg-brand-orange h-full transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SCROLLABLE STEP CONTENT AREA ================= */}
        <div className="flex-1 px-6 sm:px-10 py-8 max-w-2xl w-full mx-auto overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-xs font-bold animate-shake">
              {error}
            </div>
          )}

          {/* STEP 1: ORGANISATION DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 1 of 4</span>
                <h2 className="text-2xl font-bold text-ink mt-1">Tell us about your organisation</h2>
                <p className="text-xs text-ink-secondary mt-0.5">Choose type and enter basic campus parameters.</p>
              </div>

              {/* Organisation Type Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, instituteType: "school" })}
                  className={`p-3.5 rounded-card border text-left flex flex-col gap-1 transition-all ${
                    form.instituteType === "school"
                      ? "border-primary bg-primary-row ring-1 ring-primary"
                      : "border-line-input bg-white hover:bg-page"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <School className={`w-4 h-4 ${form.instituteType === "school" ? "text-primary" : "text-ink-secondary"}`} />
                    <span className="text-sm font-bold text-ink">School</span>
                  </div>
                  <span className="text-xs text-ink-secondary">Classes, sections & academic board</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, instituteType: "tuition" })}
                  className={`p-3.5 rounded-card border text-left flex flex-col gap-1 transition-all ${
                    form.instituteType === "tuition"
                      ? "border-primary bg-primary-row ring-1 ring-primary"
                      : "border-line-input bg-white hover:bg-page"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className={`w-4 h-4 ${form.instituteType === "tuition" ? "text-primary" : "text-ink-secondary"}`} />
                    <span className="text-sm font-bold text-ink">Coaching / Institute</span>
                  </div>
                  <span className="text-xs text-ink-secondary">Courses, batches & test series</span>
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-ink mb-1">
                    {form.instituteType === "school" ? "School Name *" : "Institute / Coaching Name *"}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      name="instituteName"
                      type="text"
                      placeholder="e.g. Shiksha Public School"
                      value={form.instituteName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">City *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      name="city"
                      type="text"
                      placeholder="e.g. Jaipur"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">State *</label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-line-input rounded-control text-ink text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    <option>Rajasthan</option>
                    <option>Madhya Pradesh</option>
                    <option>Uttar Pradesh</option>
                    <option>Gujarat</option>
                    <option>Delhi NCR</option>
                    <option>Maharashtra</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Board / Affiliation</label>
                  <select
                    name="board"
                    value={form.board}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-line-input rounded-control text-ink text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    <option>CBSE</option>
                    <option>RBSE</option>
                    <option>ICSE</option>
                    <option>State Board</option>
                    <option>Other / Autonomous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Approx. Student Count</label>
                  <select
                    name="studentCount"
                    value={form.studentCount}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-line-input rounded-control text-ink text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    <option>Under 300</option>
                    <option>300–500</option>
                    <option>500–1,000</option>
                    <option>1,000–3,000</option>
                    <option>Over 3,000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Your Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      name="ownerName"
                      type="text"
                      placeholder="e.g. Rajendra Agarwal"
                      value={form.ownerName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Your Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-line-input rounded-control text-ink text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    <option>School Owner / Director</option>
                    <option>Principal</option>
                    <option>Administrator / Manager</option>
                    <option>Accountant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="10-digit mobile"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-line-input rounded-control text-ink text-sm font-mono focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Work Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      name="email"
                      type="email"
                      placeholder="principal@school.edu.in"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-ink-secondary leading-relaxed pt-2">
                <input
                  type="checkbox"
                  checked={form.agreedTerms}
                  onChange={(e) => setForm({ ...form, agreedTerms: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-line-input text-primary focus:ring-primary"
                />
                <span>
                  I agree to the Terms of Service and Data Processing Agreement under DPDP Act 2023 on behalf of my institution.
                </span>
              </label>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-7 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-control transition-all flex items-center gap-2 shadow-sm"
                >
                  Continue to Verification
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VERIFICATION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 2 of 4</span>
                <h2 className="text-2xl font-bold text-ink mt-1">Verify Mobile Number</h2>
                <p className="text-xs text-ink-secondary mt-0.5">
                  We sent an authentication code to <strong>+91 {form.phone || "98290XXXXX"}</strong>
                </p>
              </div>

              <div className="p-6 bg-page border border-line rounded-card space-y-4 max-w-md">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-ink">Enter 6-Digit Verification Code</label>
                    <span className="text-[11px] font-mono font-bold text-primary bg-primary-tint px-2 py-0.5 rounded">
                      Demo Code: 123456
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={form.otp || "123456"}
                    onChange={(e) => setForm({ ...form, otp: e.target.value })}
                    className="w-full py-3 px-4 border border-line-input rounded-control text-center text-xl font-mono tracking-widest text-ink bg-white focus:outline-none focus:border-primary"
                  />
                  <div className="flex justify-between items-center text-xs text-ink-secondary mt-2">
                    <span>SMS Gateway: Development Sandbox</span>
                    <button 
                      type="button" 
                      onClick={() => setForm({ ...form, otp: "123456" })}
                      className="text-primary font-bold hover:underline"
                    >
                      Auto-fill OTP
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-success-bg text-success-text text-xs rounded-control flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Sandbox active: Kisi bhi testing number par OTP bypass / pre-filled hai.</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2.5 border border-line-input text-ink text-sm font-semibold rounded-control hover:bg-page"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-7 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-control transition-all flex items-center gap-2 shadow-sm"
                >
                  Verify & Select Plan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE PLAN (FREE TRIAL) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 3 of 4</span>
                <h2 className="text-2xl font-bold text-ink mt-1">Activate Your 30-Day Free Trial</h2>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Pick your initial setup tier. No credit card required. You can upgrade anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {[
                  {
                    id: "starter",
                    name: "Starter Edition",
                    desc: "Admissions CRM, student directory, attendance alerts & online fee payments.",
                    recommended: false
                  },
                  {
                    id: "standard",
                    name: "Standard Edition",
                    desc: "Everything in Starter + Timetable, CBSE/RBSE Exams, Teacher Payroll & Accounts.",
                    recommended: true
                  },
                  {
                    id: "premium",
                    name: "Premium Multi-Branch",
                    desc: "Full ERP suite + Transport tracking, Library barcodes & Multi-school dashboard.",
                    recommended: false
                  }
                ].map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setForm({ ...form, selectedPlan: plan.id })}
                    className={`p-4 rounded-card border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      form.selectedPlan === plan.id
                        ? "border-primary bg-primary-row ring-1 ring-primary"
                        : "border-line-input bg-white hover:bg-page"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-ink">{plan.name}</span>
                        {plan.recommended && (
                          <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-secondary mt-1">{plan.desc}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-xs font-bold text-success-text block">Free for 30 Days</span>
                      <span className="text-[10px] text-ink-secondary">₹0 due today</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2.5 border border-line-input text-ink text-sm font-semibold rounded-control hover:bg-page"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-7 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-control transition-all flex items-center gap-2 shadow-sm"
                >
                  Continue to Credentials
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SET PASSWORD & FINALIZE */}
          {currentStep === 4 && (
            <form onSubmit={submit} className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 4 of 4</span>
                <h2 className="text-2xl font-bold text-ink mt-1">Set Administrator Password</h2>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Create master credentials for <strong>{form.email || "your account"}</strong>.
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Create Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-11 py-2.5 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-ink transition-colors p-0.5"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={form.confirm}
                      onChange={handleChange}
                      className="w-full pl-10 pr-11 py-2.5 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-ink transition-colors p-0.5"
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-page border border-line rounded-control text-xs text-ink-secondary">
                  ✓ After account creation, you will access the interactive <strong>Trial Getting Started Dashboard</strong> with step-by-step setup guides.
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-2.5 border border-line-input text-ink text-sm font-semibold rounded-control hover:bg-page"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-control transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Institute...
                    </>
                  ) : (
                    <>
                      Complete Setup & Launch Trial
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};

export default Register;
