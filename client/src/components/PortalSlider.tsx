import { Link } from "react-router-dom";

interface PortalSliderProps {
  activePortal: "admin" | "teacher" | "student";
}

const portals = [
  { id: "admin", name: "Admin", path: "/auth/login", color: "text-orange-600", pill: "bg-orange-600" },
  { id: "teacher", name: "Teacher", path: "/teacher/login", color: "text-blue-600", pill: "bg-blue-600" },
  { id: "student", name: "Student", path: "/student/login", color: "text-purple-600", pill: "bg-purple-600" },
];

export default function PortalSlider({ activePortal }: PortalSliderProps) {
  const currentIndex = Math.max(0, portals.findIndex(p => p.id === activePortal));
  const activeData = portals[currentIndex] || portals[0];

  return (
    <div className="w-full bg-slate-50/50 border-b border-slate-100 p-4 sticky top-0 z-20 backdrop-blur-md">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-100 p-1 rounded-xl flex relative overflow-hidden">
          {portals.map((portal) => {
            const isActive = portal.id === activePortal;
            return (
              <Link
                key={portal.id}
                to={portal.path}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-center transition-all duration-300 relative z-10 ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {portal.name}
              </Link>
            );
          })}
          {/* Sliding Pill with Dynamic Color */}
          <div 
            className={`absolute top-1 bottom-1 left-1 w-[calc(33.33%-2px)] rounded-lg shadow-md transition-all duration-300 ease-out ${activeData.pill}`}
            style={{ transform: `translateX(${currentIndex * 100}%)` }}
          />
        </div>
      </div>
    </div>
  );
}
