import { useState, useMemo, useEffect } from "react";
import { FaChartLine, FaChartBar, FaChartPie, FaChartArea } from "react-icons/fa";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

type AnalyticsChartProps = {
  stats: any;
  activeCategory: string | null;
};

export default function AnalyticsChart({ stats, activeCategory }: AnalyticsChartProps) {
  const [chartType, setChartType] = useState<"line" | "pie" | "bar">("line");
  const [isReady, setIsReady] = useState(false);

  // ✅ FIX: Wait for layout + animations to settle
  useEffect(() => {
    if (!activeCategory) return;

    setIsReady(false);

    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 300); // delay ensures DOM/layout is stable

    return () => clearTimeout(timeout);
  }, [activeCategory]);

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899"];

  const chartData = useMemo(() => {
    if (!stats || !activeCategory) return [];

    if (activeCategory === "teachers") {
      return [
        { name: "Total Teachers", value: stats.teachers || 0 },
        { name: "New Today", value: stats.newTeachersToday || 0 },
      ];
    }

    if (activeCategory === "feedback") {
      return [
        { name: "Total Feedback", value: stats.totalFeedback || 0 },
        { name: "Today", value: stats.feedbackToday || 0 },
      ];
    }

    return [];
  }, [stats, activeCategory]);

  // Placeholder
  if (!activeCategory) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 border border-slate-100 shadow-sm mt-8 text-center animate-fadeIn">
        <div className="max-w-xs mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
            <FaChartArea size={32} />
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            Select a metric card above to view analytics
          </p>
          <p className="text-slate-300 text-[10px] font-medium uppercase tracking-wider">
            Detailed growth comparison will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-slate-100 shadow-sm mt-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            {chartType === "line" && <FaChartLine size={20} />}
            {chartType === "bar" && <FaChartBar size={20} />}
            {chartType === "pie" && <FaChartPie size={20} />}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">
              {activeCategory} Overview
            </h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
              Total vs Daily comparison
            </p>
          </div>
        </div>

        {/* Switch */}
        <div className="flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200/50">
          {(["line", "pie", "bar"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-5 py-2 text-[11px] font-black rounded-lg transition-all capitalize ${
                chartType === type
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ BULLETPROOF CHART CONTAINER */}
      <div className="w-full">
        {isReady ? (
          <ResponsiveContainer width="100%" height={350}>
            
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={5}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>

            ) : chartType === "bar" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} />
              </BarChart>

            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} />
              </LineChart>
            )}

          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}