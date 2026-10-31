import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  MdSearch,
  MdHelpOutline,
  MdMenuBook,
  MdPhone,
  MdEmail,
  MdSend,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdFileDownload,
  MdSupportAgent,
  MdSchool,
} from "react-icons/md";

interface HelpGuide {
  id: string;
  category: "attendance" | "marks" | "homework" | "leave";
  title: string;
  badge: string;
  description: string;
  steps: string[];
}

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const GUIDES: HelpGuide[] = [
  {
    id: "g1",
    category: "attendance",
    title: "How to take morning attendance & submit absentees",
    badge: "Attendance Register",
    description: "Guidelines for recording daily classroom roll call and sending automatic SMS alerts to guardians.",
    steps: [
      "Navigate to Attendance from the sidebar navigation or press 'My Class (8-B)'.",
      "Verify the date (defaults to Today). All 38 enrolled students default to 'Present'.",
      "Tap or click on any absent student's status pill to switch to 'Absent' (Red) or 'Leave' (Amber).",
      "Ensure roll call is finalized prior to the 08:30 AM morning cutoff time.",
      "Click 'Submit Class Attendance' to log the record and automatically trigger guardian SMS notifications.",
    ],
  },
  {
    id: "g2",
    category: "marks",
    title: "Submitting Periodic Test (PT) & Half-Yearly marks",
    badge: "Marks & Remarks",
    description: "Step-by-step entry for PT (10), Notebook (5), Subject Enrichment (5), and Half-Yearly (80) scores.",
    steps: [
      "Open Marks & Remarks Gradebook from the sidebar.",
      "Select your assigned section (e.g. Class 8-B · Science) from the top-left section dropdown.",
      "Enter student scores directly into the grid. PT max is 10, Notebook is 5, SE is 5, and Half-Yearly is 80.",
      "Marks exceeding the maximum ceiling will highlight in red with validation alerts to prevent typos.",
      "Switch to the 'Class Teacher Remarks' tab to add co-scholastic grades (Art, PE, Discipline) and qualitative remarks.",
      "Click 'Save Marks' to save drafts or 'Export CSV' to archive scores locally.",
    ],
  },
  {
    id: "g3",
    category: "homework",
    title: "Assigning daily homework & syllabus tracking",
    badge: "Homework & Syllabus",
    description: "Publish homework tasks with due dates, attachments, and track syllabus milestone percentages.",
    steps: [
      "Open Homework & Syllabus from the sidebar.",
      "Select 'Requirement UI' or 'Advanced Tracker' depending on your preferred workspace.",
      "Click 'Add Homework' and choose the subject, target class, and submission deadline.",
      "Provide instructions and attach PDF study material or textbook exercise reference.",
      "Students and parents will receive instant app notifications on their portals.",
    ],
  },
  {
    id: "g4",
    category: "leave",
    title: "Applying for Casual, Duty or Medical Leave",
    badge: "Leave Management",
    description: "Apply for leaves, view balance quotas (CL, DL, ML), and review assigned substitution educators.",
    steps: [
      "Open Leave & Payslips from the sidebar menu.",
      "Click 'Apply Leave' to open the leave application drawer.",
      "Select leave category: Casual Leave (CL), Duty Leave (DL), or Medical Leave (ML).",
      "Specify single day, multiple days, or half-day options, and enter reason.",
      "Attach doctor's prescription for medical leaves exceeding 2 consecutive days.",
      "Submit for Principal approval. The timetable in-charge will automatically assign classroom substitution.",
    ],
  },
];

const FAQS: FaqItem[] = [
  {
    question: "What if I accidentally marked a present student as absent?",
    answer: "You can modify attendance on the same day before 02:00 PM by clicking 'Edit Attendance' on the register. If past the school day, request an attendance rectification from the Principal office.",
    category: "attendance",
  },
  {
    question: "Can I enter 'AB' for students who missed the Half-Yearly exam?",
    answer: "Yes. Type 'AB' directly into the marks input cell. The system recognizes 'AB' as official absentee status without counting it as 0 in total grade conversions.",
    category: "marks",
  },
  {
    question: "How do I download my monthly salary payslip or Form 16?",
    answer: "Go to Leave & Payslips › 'Salary Slips & Form 16' tab. You will see itemized monthly records (Basic, DA, HRA, EPF, TDS). Click 'Download Slip' for a signed PDF.",
    category: "leave",
  },
  {
    question: "What should I do if the biometric punch machine fails in the morning?",
    answer: "Report immediately to Er. Rajesh Meena (IT Admin) in the administrative block. Your campus in-time will be verified via CCTV and manually authorized in the HR biometric punch log.",
    category: "general",
  },
];

const TeacherHelp: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const instituteName = user?.instituteName || "Shiksha Public School";

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>("g1");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Portal Access & Login");
  const [ticketUrgency, setTicketUrgency] = useState("Normal");
  const [ticketDetails, setTicketDetails] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Filtered guides
  const filteredGuides = GUIDES.filter((guide) => {
    const matchesCategory =
      selectedCategory === "all" || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered FAQs
  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory || faq.category === "general";
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadManual = () => {
    showToast("Downloading Teacher Portal User Guide 2026-27 (PDF)...", "info");
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketSubject.trim() || !ticketDetails.trim()) {
      showToast("Please provide both a ticket subject and problem description.", "warn");
      return;
    }

    setIsSubmittingTicket(true);
    setTimeout(() => {
      setIsSubmittingTicket(false);
      setTicketSubject("");
      setTicketDetails("");
      showToast(
        "Support request successfully logged! Ticket #TKT-" +
          Math.floor(1000 + Math.random() * 9000) +
          " dispatched to Campus IT Helpdesk.",
        "success"
      );
    }, 700);
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
            <span className="text-ink shrink-0">Help & Support</span>
            <span>›</span>
            <span className="text-primary font-semibold truncate">Faculty Knowledge Base</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              Teacher Help & Support
            </h1>
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Step-by-step faculty guides, CBSE assessment rules & institutional IT support contacts
          </div>
        </div>

        {/* Top-Right Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadManual}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink transition-colors cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5"
            title="Download PDF User Manual"
          >
            <MdFileDownload size={16} className="text-primary" />
            <span>Teacher Manual (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("support-ticket-card");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MdSupportAgent size={16} />
            <span>Contact IT Desk</span>
          </button>
        </div>
      </div>

      {/* ================= SEARCH & CATEGORY FILTER BAR ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-card border border-line shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, attendance rules, marks entry, payslips..."
            className="w-full min-h-[38px] pl-9 pr-3.5 rounded-control border border-line-input bg-surface-subtle text-xs sm:text-[13px] text-ink placeholder:text-ink-secondary focus:bg-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Guides" },
            { id: "attendance", label: "Attendance" },
            { id: "marks", label: "Marks & Remarks" },
            { id: "homework", label: "Homework" },
            { id: "leave", label: "Leaves & Salary" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-white shadow-2xs"
                  : "bg-surface-subtle text-ink-secondary border border-line hover:text-ink hover:bg-surface"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= MAIN CONTENT LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols): Step-by-Step Guides & FAQs */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Section 1: Step-by-Step Guides */}
          <section className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-line-row">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
                  <MdMenuBook size={18} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-ink m-0">Teacher Workflow Guides</h2>
                  <p className="text-xs text-ink-secondary m-0">
                    Comprehensive walk-throughs for routine academic operations
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-ink-secondary">
                {filteredGuides.length} {filteredGuides.length === 1 ? "Guide" : "Guides"}
              </span>
            </div>

            {filteredGuides.length === 0 ? (
              <div className="py-8 text-center text-xs text-ink-secondary">
                No guides matching "<span className="font-semibold">{searchQuery}</span>". Try another search term.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGuides.map((guide) => {
                  const isExpanded = expandedGuideId === guide.id;
                  return (
                    <div
                      key={guide.id}
                      className="border border-line rounded-control bg-white overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                        className="w-full p-3.5 flex items-start justify-between gap-3 text-left hover:bg-surface-subtle transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-tint text-primary-dark border border-primary/20">
                              {guide.badge}
                            </span>
                            <h3 className="text-xs sm:text-[13.5px] font-bold text-ink leading-tight m-0">
                              {guide.title}
                            </h3>
                          </div>
                          <p className="text-xs text-ink-secondary m-0 leading-relaxed">
                            {guide.description}
                          </p>
                        </div>
                        <div className="text-ink-secondary shrink-0 mt-1">
                          {isExpanded ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 bg-surface-subtle/50 border-t border-line-row">
                          <div className="text-xs font-semibold text-ink mb-2 uppercase tracking-wider text-[11px]">
                            Recommended Procedure:
                          </div>
                          <ol className="space-y-2 list-none p-0 m-0">
                            {guide.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs text-ink leading-relaxed">
                                <span className="w-5 h-5 rounded-full bg-primary-tint text-primary font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Section 2: Frequently Asked Questions (FAQs) */}
          <section className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-line-row">
              <div className="w-8 h-8 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center">
                <MdHelpOutline size={18} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-ink m-0">Frequently Asked Questions</h2>
                <p className="text-xs text-ink-secondary m-0">
                  Quick answers to common faculty questions & portal policies
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-line rounded-control bg-surface-subtle/40 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                      className="w-full p-3 flex items-center justify-between gap-3 text-left hover:bg-surface-subtle transition-colors cursor-pointer"
                    >
                      <span className="text-xs sm:text-[13px] font-semibold text-ink">
                        {faq.question}
                      </span>
                      <span className="text-ink-secondary shrink-0">
                        {isOpen ? <MdKeyboardArrowUp size={18} /> : <MdKeyboardArrowDown size={18} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-xs text-ink-secondary leading-relaxed border-t border-line-row bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Direct Contacts & Support Ticket Form */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Card 1: School IT Support Contacts */}
          <section className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-line-row">
              <div className="w-7 h-7 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
                <MdSchool size={16} />
              </div>
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider m-0">
                {instituteName} · Support
              </h3>
            </div>

            <div className="space-y-3">
              {/* Contact 1: IT Admin */}
              <div className="p-3 rounded-control bg-surface-subtle border border-line flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">Er. Rajesh Meena</span>
                  <span className="text-[10px] font-bold text-primary bg-primary-tint px-2 py-0.5 rounded-full">
                    IT & ERP Admin
                  </span>
                </div>
                <p className="text-[11px] text-ink-secondary m-0">
                  Password reset, attendance errors & hardware issues
                </p>
                <div className="pt-1.5 flex items-center justify-between text-xs text-ink font-semibold border-t border-line-row">
                  <span className="flex items-center gap-1 text-primary">
                    <MdPhone size={14} /> Ext. 104
                  </span>
                  <span className="text-ink-secondary font-mono text-[11px]">+91 98290 88776</span>
                </div>
              </div>

              {/* Contact 2: Examination Cell */}
              <div className="p-3 rounded-control bg-surface-subtle border border-line flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">Smt. Anuradha Sen</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                    Exam Cell In-Charge
                  </span>
                </div>
                <p className="text-[11px] text-ink-secondary m-0">
                  Gradebook unlock, Half-Yearly marks review & report cards
                </p>
                <div className="pt-1.5 flex items-center justify-between text-xs text-ink font-semibold border-t border-line-row">
                  <span className="flex items-center gap-1 text-primary">
                    <MdPhone size={14} /> Ext. 108
                  </span>
                  <span className="text-ink-secondary text-[11px]">Room 12 · Academic Block</span>
                </div>
              </div>

              {/* Contact 3: HR & Principal Office */}
              <div className="p-3 rounded-control bg-surface-subtle border border-line flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">Principal Desk</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Main Office
                  </span>
                </div>
                <p className="text-[11px] text-ink-secondary m-0">
                  Duty leaves, emergency permissions & policy matters
                </p>
                <div className="pt-1.5 flex items-center justify-between text-xs text-ink font-semibold border-t border-line-row">
                  <span className="flex items-center gap-1 text-primary">
                    <MdEmail size={14} /> principal@school.edu
                  </span>
                  <span className="text-ink-secondary text-[11px]">Ext. 101</span>
                </div>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-ink-secondary flex items-center justify-between">
              <span>Campus IT Helpdesk Hours:</span>
              <strong className="text-ink">07:30 AM – 04:30 PM</strong>
            </div>
          </section>

          {/* Card 2: Interactive Support Request Form */}
          <section
            id="support-ticket-card"
            className="bg-white border border-line rounded-card p-5 shadow-xs flex flex-col gap-3.5 scroll-mt-20"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-line-row">
              <div className="w-7 h-7 rounded-control bg-primary-tint text-primary-dark flex items-center justify-center">
                <MdSend size={16} />
              </div>
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider m-0">Submit IT Support Ticket</h3>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink">Issue Subject</label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Unable to submit Class 8-B Science marks"
                  className="min-h-[38px] px-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink focus:bg-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-ink">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="min-h-[38px] px-2.5 rounded-control border border-line-input bg-surface-subtle text-xs text-ink focus:bg-white focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="Attendance">Attendance Error</option>
                    <option value="Marks & Remarks">Marks Lock/Ceiling</option>
                    <option value="Biometric Punch">Biometric Machine</option>
                    <option value="Leave & Payroll">Leave/Payslip</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-ink">Urgency</label>
                  <select
                    value={ticketUrgency}
                    onChange={(e) => setTicketUrgency(e.target.value)}
                    className="min-h-[38px] px-2.5 rounded-control border border-line-input bg-surface-subtle text-xs text-ink focus:bg-white focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High (Deadlines)</option>
                    <option value="Critical">Critical (Immediate)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-ink">Problem Details</label>
                <textarea
                  rows={3}
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  placeholder="Describe what occurred, student roll number if applicable, or error notice..."
                  className="p-2.5 rounded-control border border-line-input bg-surface-subtle text-xs text-ink focus:bg-white focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="w-full min-h-[38px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                <MdSend size={15} />
                <span>{isSubmittingTicket ? "Submitting Request..." : "Send Request to IT Desk"}</span>
              </button>
            </form>
          </section>

          {/* System Status Pill */}
          <div className="p-3 rounded-card border border-line bg-surface-subtle flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-ink">Campus ERP & Portal Status</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100% Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHelp;
