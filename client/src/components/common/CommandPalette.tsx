import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight, FiCommand, FiSettings, FiUsers, FiCreditCard, FiCheckCircle } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";

// Mock data for commands. In a real app, you can dynamically build this 
// from user permissions and available modules.
const COMMANDS = [
  { id: "dashboard", title: "Go to Dashboard", path: "/admin/dashboard", icon: <MdOutlineDashboard />, category: "Navigation" },
  { id: "approvals", title: "Approvals Inbox", path: "/admin/approvals", icon: <FiCheckCircle />, category: "Navigation" },
  { id: "students", title: "View Students", path: "/admin/students", icon: <FiUsers />, category: "Academic" },
  { id: "student_import", title: "Excel Student Import", path: "/admin/student-import", icon: <FiUsers />, category: "Academic" },
  { id: "promotion", title: "Academic Promotion Workflow", path: "/admin/promotion", icon: <FiUsers />, category: "Academic" },
  { id: "admissions", title: "Admissions CRM Pipeline", path: "/admin/admissions/pipeline", icon: <FiUsers />, category: "Academic" },
  { id: "admissions_records", title: "Admissions Registry & Records", path: "/admin/admissions/records", icon: <FiUsers />, category: "Academic" },
  { id: "attendance", title: "Student Attendance", path: "/admin/attendance", icon: <FiUsers />, category: "Academic" },
  { id: "routine", title: "Timetable & Routine", path: "/admin/routine", icon: <MdOutlineDashboard />, category: "Academic" },
  { id: "collect_fees", title: "Collect Fees (Desk)", path: "/admin/collect-fees", icon: <FiCreditCard />, category: "Finance" },
  { id: "fee_structure", title: "Fee Structure Masters", path: "/admin/fee-structure", icon: <FiCreditCard />, category: "Finance" },
  { id: "defaulters", title: "Defaulters & Dues Register", path: "/admin/defaulters", icon: <FiCreditCard />, category: "Finance" },
  { id: "cash_closing", title: "Day-End Cash Closing", path: "/admin/cash-closing", icon: <FiCreditCard />, category: "Finance" },
  { id: "accounts", title: "Accounts Day Book & Vouchers", path: "/admin/accounts", icon: <FiCreditCard />, category: "Finance" },
  { id: "staff", title: "Staff & Faculty Directory", path: "/admin/staff", icon: <FiUsers />, category: "Staff & Leave" },
  { id: "staff_attendance", title: "Staff Biometric Attendance", path: "/admin/staff/attendance", icon: <FiUsers />, category: "Staff & Leave" },
  { id: "leaves", title: "Leave Management & Approvals", path: "/admin/staff/leave", icon: <FiUsers />, category: "Staff & Leave" },
  { id: "payroll", title: "Payroll Runs & Salary Slips", path: "/admin/payroll", icon: <FiCreditCard />, category: "Payroll" },
  { id: "transport", title: "Transport Routes & Vehicles", path: "/admin/transport", icon: <MdOutlineDashboard />, category: "Operations" },
  { id: "hostel", title: "Hostel & Room Allotment", path: "/admin/hostel", icon: <MdOutlineDashboard />, category: "Operations" },
  { id: "library", title: "Library Circulation Desk", path: "/admin/library", icon: <MdOutlineDashboard />, category: "Operations" },
  { id: "inventory", title: "Inventory & Assets", path: "/admin/inventory", icon: <MdOutlineDashboard />, category: "Operations" },
  { id: "front_office", title: "Front Office, Visitors & Gate Pass", path: "/admin/front-office", icon: <FiUsers />, category: "Operations" },
  { id: "communication", title: "Notices & Broadcast", path: "/admin/communication", icon: <MdOutlineDashboard />, category: "Communication" },
  { id: "reports", title: "Reports & Efficiency Analytics", path: "/admin/reports", icon: <MdOutlineDashboard />, category: "Reports" },
  { id: "users_audit", title: "Users & Immutable Audit Log", path: "/admin/users", icon: <FiSettings />, category: "Settings" },
  { id: "settings", title: "Institute Settings", path: "/admin/settings/institute", icon: <FiSettings />, category: "Settings" },
  { id: "roles", title: "Roles & Permissions", path: "/admin/settings/roles", icon: <FiSettings />, category: "Settings" },
  { id: "plan_billing", title: "Plan & Billing", path: "/admin/plan-billing", icon: <FiCreditCard />, category: "Plan & Help" },
  { id: "help_support", title: "Help & Technical Support", path: "/admin/help-support", icon: <FiSettings />, category: "Plan & Help" },
  { id: "profile", title: "My Profile", path: "/admin/profile", icon: <FiSettings />, category: "Settings" },
];

export default function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Filter commands based on query
  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) || 
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof COMMANDS>);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && filteredCommands.length > 0) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  const executeCommand = (cmd: typeof COMMANDS[0]) => {
    navigate(cmd.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Palette Container */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col transform transition-all animate-slideDown"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <FiSearch className="text-slate-400 mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-lg font-medium"
            placeholder="Search for students, teachers, or actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-500">
            <span>ESC</span>
          </div>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-14 text-center px-4">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiSearch className="text-slate-300" size={24} />
              </div>
              <p className="text-slate-500 font-medium">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Dashboard" or "Fees"</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {category}
                </div>
                <div className="space-y-0.5">
                  {cmds.map((cmd) => {
                    const index = filteredCommands.findIndex(c => c.id === cmd.id);
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                          isSelected ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                            {cmd.icon}
                          </div>
                          <span className={`font-semibold ${isSelected ? "text-indigo-700" : "text-slate-700"}`}>
                            {cmd.title}
                          </span>
                        </div>
                        {isSelected && (
                          <FiArrowRight className="text-indigo-500 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 flex justify-between items-center text-xs font-medium text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">↑</kbd>
              <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm font-sans flex items-center"><FiCommand className="mr-0.5" /> K</kbd>
              to open
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">↵</kbd>
            to select
          </span>
        </div>
      </div>
    </div>
  );
}
