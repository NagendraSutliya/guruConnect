import { Link } from "react-router-dom";
import { FaUserPlus, FaMoneyBillWave, FaBullhorn, FaCalendarAlt } from "react-icons/fa";

type DashboardHeroProps = {
  instituteName: string;
};

export default function DashboardHero({ instituteName }: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-hero bg-primary -mx-6 px-8 py-6 shadow-sm mb-8">
      {/* Subtle Background Mesh */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-dark/20 blur-[80px] -mr-20 -mt-20" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h1 className="text-[26px] font-semibold text-white tracking-tight">
            Welcome to <span className="text-gold">{instituteName}</span>
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-primary-soft text-micro font-medium uppercase tracking-[0.2em]">Management Portal v2.0</p>
            <span className="text-primary-soft text-[10px]">•</span>
            <p className="text-primary-soft text-micro font-medium uppercase tracking-[0.2em]">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-control bg-white/5 border border-white/10 text-micro font-semibold uppercase tracking-widest text-primary-tint w-fit">
            <div className="w-1.5 h-1.5 bg-success-text rounded-full animate-pulse" />
            System Status: Healthy
          </div>
        </div>
      </div>
    </div>
  );
}