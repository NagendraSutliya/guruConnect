import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, GraduationCap, HeartHandshake, ChevronRight, X } from "lucide-react";

interface LoginPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginPortalModal: React.FC<LoginPortalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-line flex flex-col md:flex-row">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ink-secondary hover:text-ink hover:bg-page rounded-full z-10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left side modal banner */}
        <div className="w-full md:w-5/12 bg-nav-bg text-nav-text p-7 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/guruconnect-logo.png" 
                alt="guruConnect Logo" 
                className="h-11 w-auto object-contain brightness-0 invert opacity-95"
              />
              <span className="font-extrabold text-white text-xl tracking-tight">
                guru<span className="text-gold">Connect</span>
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Welcome Back!</h3>
            <p className="text-sm text-nav-muted leading-relaxed">
              Select your role to access your designated institution portal.
            </p>
          </div>

          <div className="text-xs text-nav-muted pt-8 border-t border-nav-divider">
            New school?{" "}
            <Link
              to="/auth/register"
              onClick={onClose}
              className="text-gold font-semibold hover:underline"
            >
              Start free trial
            </Link>
          </div>
        </div>

        {/* Right side role cards */}
        <div className="w-full md:w-7/12 p-6 md:p-8 bg-surface space-y-3 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Choose Your Portal</span>

          {[
            {
              role: "School Administrator / Principal",
              desc: "Complete campus control, finance & admissions",
              link: "/auth/login",
              icon: <ShieldCheck className="w-5 h-5 text-primary" />
            },
            {
              role: "Teacher / Faculty",
              desc: "Attendance, marks entry, timetable & diary",
              link: "/teacher/login",
              icon: <Users className="w-5 h-5 text-primary" />
            },
            {
              role: "Parent Portal",
              desc: "Child attendance, online fee receipts & report card",
              link: "/parent/login",
              icon: <HeartHandshake className="w-5 h-5 text-primary" />
            },
            {
              role: "Student Learning Hub",
              desc: "Timetable, homework, tests & study materials",
              link: "/student/login",
              icon: <GraduationCap className="w-5 h-5 text-primary" />
            }
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              onClick={onClose}
              className="p-4 sm:p-4.5 rounded-xl border border-line hover:border-primary bg-white hover:bg-primary-tint/30 flex items-center justify-between gap-4 transition-all group shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-primary-tint flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[15px] font-bold text-ink group-hover:text-primary transition-colors">
                    {item.role}
                  </div>
                  <div className="text-xs sm:text-[13px] text-ink-secondary">{item.desc}</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-transform group-hover:translate-x-1 shrink-0" />
            </Link>
          ))}

          <div className="pt-3 text-center">
            <Link
              to="/superadmin/login"
              onClick={onClose}
              className="text-xs text-ink-secondary hover:text-primary font-medium"
            >
              Super Admin Panel Login →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
