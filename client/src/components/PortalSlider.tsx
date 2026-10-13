import { Link } from "react-router-dom";
import { ShieldCheck, Users, GraduationCap, HeartHandshake } from "lucide-react";

interface PortalSliderProps {
  activePortal: "admin" | "teacher" | "student" | "parent";
}

const portals = [
  { id: "admin", name: "Admin Portal", path: "/auth/login", icon: ShieldCheck },
  { id: "teacher", name: "Teacher Portal", path: "/teacher/login", icon: Users },
  { id: "parent", name: "Parent Portal", path: "/parent/login", icon: HeartHandshake },
  { id: "student", name: "Student Portal", path: "/student/login", icon: GraduationCap },
];

export default function PortalSlider({ activePortal }: PortalSliderProps) {
  return (
    <div className="w-full bg-white/90 border-b border-line px-3 sm:px-4 py-2.5 sm:py-3 sticky top-0 z-20 backdrop-blur-md">
      <div className="max-w-xl mx-auto">
        <div className="bg-surface p-1 rounded-2xl border border-line flex gap-1 shadow-2xs overflow-x-auto scrollbar-none">
          {portals.map((portal) => {
            const isActive = portal.id === activePortal;
            const Icon = portal.icon;
            return (
              <Link
                key={portal.id}
                to={portal.path}
                className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-nav-bg text-white shadow-xs"
                    : "text-ink-secondary hover:text-ink hover:bg-white/70"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-gold" : "text-ink-muted"}`} />
                <span>{portal.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
