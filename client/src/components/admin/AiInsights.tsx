import { Sparkles, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AiInsights() {
  const { user } = useAuth();
  
  const insights = [
    {
      id: 1,
      title: "Strategic Growth",
      desc: `Your ${user?.plan || "free"} plan has capacity for 20% more student growth this month.`,
      color: "emerald"
    },
    {
      id: 2,
      title: "Space Optimization",
      desc: "Routine analysis suggests room for 15% better classroom utilization.",
      color: "amber"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {insights.map((insight) => (
        <div key={insight.id} className="relative group bg-white/70 backdrop-blur-md rounded-[1.5rem] p-5 border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-lg">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl bg-${insight.color}-50 flex items-center justify-center shrink-0`}>
                {insight.color === "emerald" ? <Sparkles size={18} className="text-emerald-500" /> : <AlertTriangle size={18} className="text-amber-500" />}
            </div>
            <div className="space-y-1">
              <h4 className="text-[13px] font-black text-slate-800 tracking-tight">{insight.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{insight.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
