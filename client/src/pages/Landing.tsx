import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  CheckCircle2,
  ChevronDown,
  Check,
  Database,
  Eye,
  Server,
  LockKeyhole,
  FileCheck
} from "lucide-react";
import { BookDemoModal } from "../components/landing/BookDemoModal";
import { CookieNotice } from "../components/landing/CookieNotice";
import { PublicHeader, PublicFooter } from "../components/landing/PublicLayoutElements";
import { LoginPortalModal } from "../components/landing/LoginPortalModal";

export default function Landing() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["faq", "pricing", "how", "features"];
      const scrollPos = window.scrollY + 200;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const erpModules = [
    {
      num: "01",
      title: "Admissions CRM",
      desc: "Enquiries, follow-ups, online registration forms and document verification until enrolled."
    },
    {
      num: "02",
      title: "Students & Certificates",
      desc: "Complete student profiles, siblings linking, ID card generator, TC and bonafide certificates."
    },
    {
      num: "03",
      title: "Smart Attendance",
      desc: "Biometric and RFID support, 30-sec teacher app entry, instant SMS/WhatsApp alerts to parents."
    },
    {
      num: "04",
      title: "Timetable & Substitutions",
      desc: "Clash-free class schedules, periods management, and automatic same-day teacher substitution."
    },
    {
      num: "05",
      title: "Homework & Syllabus",
      desc: "Daily digital diary for parents, syllabus milestones, and lesson plan monitoring."
    },
    {
      num: "06",
      title: "Exams & Report Cards",
      desc: "CBSE & RBSE grading engines, encrypted marks lock, and one-click bulk report card printing."
    },
    {
      num: "07",
      title: "Fees & Online Payments",
      desc: "Installment plans, sibling concessions, late fine calculation, instant UPI QR receipts."
    },
    {
      num: "08",
      title: "Accounts & Tally Export",
      desc: "Day book, multi-head vouchers, expense tracker, bank reconciliation, and XML export for Tally."
    },
    {
      num: "09",
      title: "Staff, HR & Payroll",
      desc: "Biometric staff attendance, leave approval hierarchy, salary with PF/ESI/TDS and payslips."
    },
    {
      num: "10",
      title: "Transport & Hostel",
      desc: "Bus routes, stops, vehicle fitness alerts, hostel rooms, bed allotment, and night outpasses."
    },
    {
      num: "11",
      title: "Library & Inventory",
      desc: "Barcode book circulation, overdue fines, departmental asset management, and stock alerts."
    },
    {
      num: "12",
      title: "Parent Communication",
      desc: "Multi-channel notices, 2-way teacher chat, PTM slot scheduling, and parent grievance tickets."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      tagline: "For single schools getting started with core operations.",
      badge: null,
      isPopular: false,
      features: [
        "Students & Admissions CRM",
        "Attendance with instant parent alerts",
        "Fee counter, receipts & online UPI payments",
        "Notice board & Parent mobile app",
        "Essential admin reports & export"
      ]
    },
    {
      name: "Standard",
      tagline: "For modern schools managing academics, exams & staff in one unified flow.",
      badge: "Recommended",
      isPopular: true,
      features: [
        "Everything included in Starter",
        "Timetable & daily teacher substitutions",
        "Exams engine & CBSE/RBSE report cards",
        "HR, biometric leave & staff payroll",
        "Day book accounts & Tally integration",
        "ID Card & Transfer Certificate generation"
      ]
    },
    {
      name: "Premium",
      tagline: "For progressive institutions, large schools & multi-branch groups.",
      badge: null,
      isPopular: false,
      features: [
        "Everything included in Standard",
        "Transport GPS, Hostel & Library barcode",
        "Multi-branch group centralized analytics",
        "WhatsApp API automated notifications",
        "Dedicated onboarding manager & priority 24/7 support",
        "Custom report card & fee voucher formats"
      ]
    }
  ];

  const faqs = [
    {
      q: "We currently use paper registers or Excel sheets. Can we migrate our existing data?",
      a: "Yes, completely! You can import all your students, parent contacts, staff profiles, and opening fee balances straight from Excel. Our support team verifies your data and assists with sample uploads during your free trial so you don't face any downtime."
    },
    {
      q: "Does guruConnect support coaching institutes as well as K-12 schools?",
      a: "Yes. During onboarding or initial setup, you can switch between 'School' and 'Coaching Institute' mode. In coaching mode, the system automatically tailors itself for batches, courses, installment fees, and test series rather than classes and sections."
    },
    {
      q: "Which academic boards and grading schemes are supported?",
      a: "We provide out-of-the-box support for CBSE, RBSE, ICSE, and custom State Boards. Grading scales, co-scholastic rubrics, grace marks, and multi-term weightages are fully configurable to match your institution's specific requirements."
    },
    {
      q: "Can teachers mark attendance without an active internet connection?",
      a: "Yes. The teacher mobile app caches class rosters locally. Teachers can mark attendance inside classrooms even with weak or zero signal, and records sync automatically as soon as the device reconnects to Wi-Fi or mobile data."
    },
    {
      q: "How safe is student data and who has access to it?",
      a: "Data privacy is strictly protected. In compliance with India's DPDP Act 2023, student records and sensitive details are encrypted at rest and in transit. Role-based access ensures teachers only view their assigned classes and parents see solely their own children. Even our support team can only view data upon explicit, time-bounded admin permission."
    },
    {
      q: "What happens if our school decides to cancel or transition later?",
      a: "Your school retains 100% ownership of its data. You can download comprehensive data exports in Excel/CSV formats at any time without any exit penalty or vendor lock-in."
    }
  ];

  return (
    <div className="min-h-screen bg-page text-ink font-sans selection:bg-gold selection:text-nav-bg">

      {/* ================= TOP NAVIGATION ================= */}
      <PublicHeader 
        activeSection={activeSection}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenDemoModal={() => setShowDemoModal(true)}
      />

      {/* ================= HERO SECTION ================= */}
      <section id="top" className="pt-12 sm:pt-16 pb-16 px-4 sm:px-6 bg-gradient-to-b from-primary-tint/70 via-primary-row to-surface-subtle border-b border-line relative overflow-hidden">
        {/* Subtle decorative background ambient glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-tint/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-14 relative z-10">
          
          {/* Left Text Column */}
          <div className="flex-1 flex flex-col items-start gap-5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary-dark bg-primary-tint border border-primary-soft/40 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              For schools and coaching institutes · CBSE and RBSE ready
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold leading-[1.12] tracking-tight text-ink">
              Run your whole school from one place.
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-primary-dark leading-snug font-sans">
              प्रवेश से परिणाम तक — पूरा स्कूल एक जगह।
            </p>

            <p className="text-base sm:text-lg text-ink-body2 leading-relaxed">
              Admissions, attendance, fees, exams, staff, and parent communication in one integrated system. Office staff work on the web, teachers and parents on their phones, in English or Hindi.
            </p>

            {/* Exact Action Buttons from Requirement */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <Link
                to="/auth/register"
                className="w-full sm:w-auto px-7 py-3.5 bg-primary hover:bg-primary-dark text-white text-[15px] font-semibold rounded-control shadow-sm transition-all active:scale-[0.98] text-center"
              >
                Start free trial
              </Link>

              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full sm:w-auto px-7 py-3.5 bg-gold border border-line-input hover:border-primary hover:bg-gold-hover text-ink text-[15px] font-medium rounded-control shadow-2xs transition-all text-center"
              >
                Book a demo
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-ink-secondary pt-1">
              <ShieldCheck className="w-4 h-4 text-success-text shrink-0" />
              <span>No card needed for the trial · Data stored in India · Setup help included</span>
            </div>
          </div>

          {/* Right Live Dashboard Preview Showcase */}
          <div className="flex-1 w-full max-w-[660px]">
            <div className="bg-white border border-line rounded-[16px] shadow-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
              
              {/* Browser Header Bar */}
              <div className="h-9 bg-surface-head border-b border-line px-3.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-line-input" />
                  <span className="w-2.5 h-2.5 rounded-full bg-line-input" />
                  <span className="w-2.5 h-2.5 rounded-full bg-line-input" />
                </div>
                <div className="text-[11px] font-mono text-ink-secondary bg-white px-3 py-0.5 rounded-md border border-line">
                  app.guruconnect.in/admin
                </div>
                <div className="w-10" />
              </div>

              {/* Exact High-Resolution Dashboard Mockup */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-page">
                <img 
                  src="/images/dashboard-preview.png" 
                  alt="guruConnect School Management System Dashboard Showcase" 
                  className="w-full h-full object-cover object-left-top"
                  loading="eager"
                />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================= 4 PERSONA VALUE PROPOSITIONS ================= */}
      <section className="py-16 bg-white border-b border-line px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Tailored for Every Stakeholder</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Built for everyone who makes a school run
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex flex-col gap-2.5 hover:border-primary-soft hover:bg-white transition-all shadow-2xs hover:shadow-md">
              <span className="text-xs font-bold tracking-wider uppercase text-primary">School office</span>
              <h3 className="text-lg font-bold text-ink leading-snug">No more registers at the counter</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Admissions, fee collection, instant receipts, certificates and visitors handled from one clean screen.
              </p>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex flex-col gap-2.5 hover:border-primary-soft hover:bg-white transition-all shadow-2xs hover:shadow-md">
              <span className="text-xs font-bold tracking-wider uppercase text-primary">Principal & Management</span>
              <h3 className="text-lg font-bold text-ink leading-snug">The whole school on one dashboard</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Attendance, fees collected, defaulter lists, and approvals waiting for you, updated live every minute.
              </p>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex flex-col gap-2.5 hover:border-primary-soft hover:bg-white transition-all shadow-2xs hover:shadow-md">
              <span className="text-xs font-bold tracking-wider uppercase text-primary">Teachers</span>
              <h3 className="text-lg font-bold text-ink leading-snug">Attendance in 30 seconds</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Mark attendance offline, post evening homework, enter exam marks and see the day's timetable on phone.
              </p>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex flex-col gap-2.5 hover:border-primary-soft hover:bg-white transition-all shadow-2xs hover:shadow-md">
              <span className="text-xs font-bold tracking-wider uppercase text-primary">Parents & Students</span>
              <h3 className="text-lg font-bold text-ink leading-snug">Everything in one mobile app</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Absence alerts, homework, fees by UPI, report cards and circulars, in English or Hindi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 12 CONNECTED MODULES GRID ================= */}
      <section id="features" className="py-20 bg-white border-y border-line px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Complete ERP System</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
              Everything a school runs on, already connected
            </h2>
            <p className="text-base text-ink-body2 leading-relaxed">
              Data is entered once. A fee paid in the parent app shows on the receipt, the student ledger, the accounts day book, and the principal's dashboard at the same exact moment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-line rounded-card-m overflow-hidden border border-line shadow-sm">
            {erpModules.map((module) => (
              <div key={module.num} className="bg-white p-6 flex flex-col gap-2 hover:bg-page transition-colors">
                <span className="font-mono text-xs font-bold text-primary">{module.num}</span>
                <h3 className="text-base font-bold text-ink">{module.title}</h3>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">{module.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= PARENT MOBILE APP SHOWCASE (DARK EMERALD THEME) ================= */}
      <section id="parent-app" className="py-20 bg-nav-bg text-nav-text px-4 sm:px-6 overflow-hidden">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-14">
          
          {/* Left App Details */}
          <div className="flex-1 space-y-6">
            <span className="inline-block text-xs font-bold text-nav-bg bg-gold px-3.5 py-1.5 rounded-full">
              Parent App for iOS & Android
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Parents see the day as it happens — and pay fees in two taps
            </h2>

            <ul className="space-y-4 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 mt-1.5" />
                <span>
                  <strong className="text-white">Instant Absent Alerts: </strong>
                  Notification within minutes if a student is marked absent during morning roll call.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 mt-1.5" />
                <span>
                  <strong className="text-white">2-Tap UPI Fee Payment: </strong>
                  Direct payment via Google Pay, PhonePe, Paytm or Net Banking with immediate digital receipt.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 mt-1.5" />
                <span>
                  <strong className="text-white">Daily Homework Diary: </strong>
                  Subject-wise homework, attachments, and tomorrow's timetable right on their smartphone.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 mt-1.5" />
                <span>
                  <strong className="text-white">Report Cards & Results: </strong>
                  Instant access to digital report cards as soon as published by the school.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 mt-1.5" />
                <span>
                  <strong className="text-white">Single Login for Siblings: </strong>
                  Switch seamlessly between children attending different classes without logging out.
                </span>
              </li>
            </ul>

            <div className="pt-2 text-xs sm:text-sm text-nav-muted">
              Android and iOS · One login for all siblings · Available in English and Hindi
            </div>
          </div>

          {/* Right Mobile Phone Device Mockup */}
          <div className="flex-1 flex justify-center w-full">
            <div className="w-[300px] sm:w-[320px] bg-black p-3 rounded-[40px] shadow-2xl border-4 border-nav-divider">
              
              {/* Phone Screen Container */}
              <div className="w-full bg-page rounded-[30px] overflow-hidden flex flex-col text-ink border border-line">
                
                {/* Phone Top Header */}
                <div className="bg-nav-bg text-white p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[11px] text-nav-muted">Namaste, Rohit</div>
                      <div className="text-sm font-bold">Shiksha Public School</div>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-nav-active flex items-center justify-center text-xs text-gold font-bold">
                      2
                    </span>
                  </div>

                  {/* Sibling Switcher Tabs */}
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 px-2 bg-nav-active border-2 border-gold rounded-control text-left">
                      <div className="text-xs font-bold text-white">Aarav</div>
                      <div className="text-[10px] text-nav-muted">Class 5-A</div>
                    </button>
                    <button className="flex-1 py-1.5 px-2 bg-transparent border border-nav-dot rounded-control text-left opacity-75">
                      <div className="text-xs font-bold text-white">Saanvi</div>
                      <div className="text-[10px] text-nav-muted">Class 2-B</div>
                    </button>
                  </div>
                </div>

                {/* Phone Scroll Content */}
                <div className="p-3.5 space-y-3 text-xs">
                  
                  {/* Today Attendance + Fee Card */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2.5 rounded-control border border-line shadow-xs">
                      <span className="text-[10px] text-ink-secondary">Today</span>
                      <div className="text-sm font-bold text-success-text">Present</div>
                      <span className="text-[9px] text-ink-secondary">Marked 8:52 am</span>
                    </div>

                    <div className="bg-warning-bg p-2.5 rounded-control border border-warning-border shadow-xs">
                      <span className="text-[10px] text-warning-text font-medium">Due 15 Nov</span>
                      <div className="text-sm font-mono font-bold text-warning-strong">₹17,100</div>
                      <span className="text-[10px] font-bold text-warning-accent flex items-center">
                        Pay now ›
                      </span>
                    </div>
                  </div>

                  {/* Homework Widget */}
                  <div className="bg-white p-3 rounded-control border border-line shadow-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-ink text-[11px]">Homework for tomorrow</span>
                      <span className="text-[10px] text-ink-secondary">3 subjects</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex gap-2">
                        <span className="font-semibold text-primary w-12 shrink-0">Maths:</span>
                        <span className="text-ink-secondary">Ex 4.2 Q 1-8 in notebook</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-primary w-12 shrink-0">English:</span>
                        <span className="text-ink-secondary">Read Ch. 6, 5 new words</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-semibold text-primary w-12 shrink-0">Hindi:</span>
                        <span className="text-ink-secondary">पाठ 5 का सुलेख, एक पृष्ठ</span>
                      </div>
                    </div>
                  </div>

                  {/* School Notice */}
                  <div className="bg-white p-3 rounded-control border border-line shadow-xs space-y-1">
                    <span className="text-[9px] font-bold uppercase text-primary tracking-wider">
                      Circular · 2 hrs ago
                    </span>
                    <div className="text-xs font-bold text-ink">School closed 20-24 Oct for Diwali</div>
                    <div className="text-[10px] text-ink-secondary">Classes resume Monday, 26 October.</div>
                  </div>

                  {/* Bus Tracking */}
                  <div className="bg-white p-3 rounded-control border border-line shadow-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-ink text-xs">Bus Route 4 · Drop</div>
                      <div className="text-[10px] text-ink-secondary">Gopalpura Bypass ~ 2:35 pm</div>
                    </div>
                    <span className="text-[10px] font-bold bg-primary-tint text-primary-dark px-2 py-0.5 rounded-full">
                      On Time
                    </span>
                  </div>

                </div>

                {/* Phone Bottom Nav */}
                <div className="mt-auto bg-white border-t border-line py-2 px-4 flex justify-between text-[10px] text-ink-secondary font-medium">
                  <span className="text-primary font-bold">Home</span>
                  <span>Fees</span>
                  <span>Results</span>
                  <span>Messages</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3-STEP ONBOARDING ("LIVE IN DAYS, NOT MONTHS") ================= */}
      <section id="how" className="py-20 bg-white border-b border-line px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Effortless Setup</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
              Live in days, not months
            </h2>
            <p className="text-base text-ink-body2 leading-relaxed">
              We make sure transition doesn't disrupt your ongoing classes or fee collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-surface-subtle border border-line rounded-card-m p-7 space-y-4 shadow-2xs hover:bg-white hover:border-primary-soft hover:shadow-md transition-all group">
              <span className="w-10 h-10 rounded-full bg-primary text-white font-mono font-bold text-base flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                1
              </span>
              <h3 className="text-lg font-bold text-ink">Create your school account</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Sign up with your mobile number, verify OTP, and activate your 30-day free trial. Takes about five minutes.
              </p>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-7 space-y-4 shadow-2xs hover:bg-white hover:border-primary-soft hover:shadow-md transition-all group">
              <span className="w-10 h-10 rounded-full bg-primary text-white font-mono font-bold text-base flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                2
              </span>
              <h3 className="text-lg font-bold text-ink">Set up classes, fees & staff</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Use our guided step-by-step setup wizard, or send us your existing Excel files and we import students, staff, and opening balances for you.
              </p>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-7 space-y-4 shadow-2xs hover:bg-white hover:border-primary-soft hover:shadow-md transition-all group">
              <span className="w-10 h-10 rounded-full bg-primary text-white font-mono font-bold text-base flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                3
              </span>
              <h3 className="text-lg font-bold text-ink">Go live seamlessly</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Teachers start marking attendance immediately, parents install the app, and the office collects fees from day one.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= DPDP ACT & DATA SECURITY COMPLIANCE ================= */}
      <section className="py-20 bg-surface-subtle border-b border-line px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto bg-white border border-primary-tint/80 rounded-hero p-8 sm:p-12 shadow-sm flex flex-col lg:flex-row gap-10">
          
          <div className="lg:w-1/3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Compliance & Trust</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Children's data, treated with care
            </h2>
            <p className="text-sm sm:text-base text-ink-body2 leading-relaxed">
              Architected specifically for India's <strong>Digital Personal Data Protection Act, 2023 (DPDP)</strong>. Your school owns 100% of its data; we only process it securely on your behalf.
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            
            <div className="bg-primary-row/60 border border-primary-tint/50 rounded-card p-4 space-y-1.5 hover:border-primary-soft transition-all shadow-2xs">
              <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <Server className="w-4 h-4 text-primary shrink-0" />
                Data Stored in India
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                All production servers and daily encrypted backups reside in Indian tier-4 data centres.
              </p>
            </div>

            <div className="bg-primary-row/60 border border-primary-tint/50 rounded-card p-4 space-y-1.5 hover:border-primary-soft transition-all shadow-2xs">
              <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                Parental Consent Built-in
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Consent is recorded during admission as required by DPDP regulations for minors.
              </p>
            </div>

            <div className="bg-primary-row/60 border border-primary-tint/50 rounded-card p-4 space-y-1.5 hover:border-primary-soft transition-all shadow-2xs">
              <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-primary shrink-0" />
                Strict Role Isolation
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Teachers only view assigned classes; parents access only their own children.
              </p>
            </div>

            <div className="bg-primary-row/60 border border-primary-tint/50 rounded-card p-4 space-y-1.5 hover:border-primary-soft transition-all shadow-2xs">
              <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-primary shrink-0" />
                Complete Audit Trail
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Every marks change, fee cancellation, and TC generation maintains a tamper-proof log.
              </p>
            </div>

            <div className="bg-primary-row/60 border border-primary-tint/50 rounded-card p-4 space-y-1.5 hover:border-primary-soft transition-all shadow-2xs">
              <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <LockKeyhole className="w-4 h-4 text-primary shrink-0" />
                Sensitive Info Masked
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Student Aadhaar, staff PAN, and bank accounts are encrypted with masking.
              </p>
            </div>

            <div className="bg-primary-row/60 border border-primary-tint/50 rounded-card p-4 space-y-1.5 hover:border-primary-soft transition-all shadow-2xs">
              <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <Database className="w-4 h-4 text-primary shrink-0" />
                Daily Automated Backups
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Point-in-time recovery with regular disaster recovery and restore drills.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section id="pricing" className="py-20 bg-page border-b border-line px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Transparent Investment</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
              Simple pricing per student
            </h2>
            <p className="text-base text-ink-body2 leading-relaxed">
              Every plan starts with a free 30-day trial. Pay only for active students; add optional modules whenever your institution expands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-hero p-8 flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? "bg-primary-row border-2 border-primary shadow-lg relative"
                    : "bg-white border border-line shadow-xs"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
                    {plan.badge && (
                      <span className="text-xs font-bold bg-primary text-white px-3 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-ink-secondary mb-6 leading-relaxed">
                    {plan.tagline}
                  </p>

                  <div className="mb-6 flex items-baseline gap-2">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-ink">Custom Quote</span>
                    <span className="text-xs text-ink-secondary">/ student / year</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs sm:text-sm">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-ink">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    to="/auth/register"
                    className={`w-full py-3 rounded-control text-sm font-semibold flex items-center justify-center transition-all ${
                      plan.isPopular
                        ? "bg-primary hover:bg-primary-dark text-white shadow-md"
                        : "bg-white hover:bg-page border border-line-input text-ink"
                    }`}
                  >
                    Start free trial
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs sm:text-sm text-ink-secondary text-center">
            Prices exclude applicable GST. SMS & WhatsApp notification credits billed on actuals. Multi-school trusts:{" "}
            <button
              onClick={() => setShowDemoModal(true)}
              className="text-primary font-semibold hover:underline"
            >
              Talk to our team
            </button>
            .
          </div>

        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section id="faq" className="py-20 bg-white border-b border-line px-4 sm:px-6">
        <div className="max-w-[840px] mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Clear Answers</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Questions schools ask us
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-surface-subtle border border-line rounded-card overflow-hidden transition-all shadow-2xs hover:border-primary-soft"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-page transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-ink leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-ink-secondary shrink-0 transition-transform ${
                      activeFaq === idx ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink-body2 leading-relaxed border-t border-line/60 bg-white animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <section className="py-20 bg-surface-subtle px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto bg-primary rounded-hero p-8 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Set up your school this week
            </h2>
            <p className="text-sm sm:text-base text-primary-tint/90 leading-relaxed">
              Create an account in five minutes. Our onboarding engineering team will assist in importing all students, teachers, and opening fee ledgers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Mustard CTA in Banner */}
            <Link
              to="/auth/register"
              className="px-7 py-3.5 bg-gold hover:bg-gold-hover text-nav-bg font-bold rounded-control text-sm sm:text-base shadow-md transition-all active:scale-[0.98] text-center"
            >
              Start free trial
            </Link>

            <button
              onClick={() => setShowDemoModal(true)}
              className="px-6 py-3.5 bg-transparent hover:bg-white/10 border border-primary-soft text-white font-semibold rounded-control text-sm sm:text-base transition-all text-center"
            >
              Book a demo
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <PublicFooter onOpenDemoModal={() => setShowDemoModal(true)} />

      {/* Cookie Notice Bar */}
      <CookieNotice />

      {/* ================= LOGIN PORTAL MODAL ================= */}
      <LoginPortalModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* ================= BOOK A DEMO MODAL ================= */}
      <BookDemoModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onStartTrial={() => {}}
      />

    </div>
  );
}
