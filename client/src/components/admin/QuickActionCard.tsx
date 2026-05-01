import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  route: string;
  colorClass: string;
};

export default function QuickActionCard({ title, description, icon, route, colorClass }: QuickActionCardProps) {
  return (
    <Link 
      to={route}
      className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 font-medium mt-1">{description}</p>
      </div>
    </Link>
  );
}
