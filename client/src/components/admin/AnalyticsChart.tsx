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
  selectedRange: string;
  onRangeChange: (range: string) => void;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl animate-fadeIn">
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <p className="text-sm font-bold text-white">
            {payload[0].value} <span className="text-white/40 font-medium">Units</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ stats, activeCategory, selectedRange, onRangeChange }) => {
  const [chartType, setChartType] = useState<"line" | "pie" | "bar">("line");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!activeCategory) return;
    setIsReady(false);
    const timeout = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timeout);
  }, [activeCategory, selectedRange]);

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  const chartData = useMemo(() => {
    if (!stats || !activeCategory) return [];

    const trendKey = activeCategory === "teachers" ? "teachers" : 
                     activeCategory === "students" ? "students" :
                     activeCategory === "feedback" ? "feedback" : null;

    if (trendKey && stats.trends?.[trendKey]) {
      const timeline = [];
      const backendTrends = stats.trends[trendKey] || [];
      
      if (selectedRange === "1year") {
        for (let i = 11; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const monthStr = d.toISOString().split('-').slice(0, 2).join('-');
          const formattedName = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          const match = backendTrends.find((item: any) => item._id === monthStr);
          timeline.push({ name: formattedName, value: match ? match.count : 0 });
        }
      } else {
        const days = selectedRange === "30days" ? 29 : 6;
        for (let i = days; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const match = backendTrends.find((item: any) => item._id === dateStr);
          timeline.push({ name: formattedDate, value: match ? match.count : 0 });
        }
      }
      return timeline;
    }

    if (activeCategory === "rating") {
      return [
        { name: "Global Avg", value: 4.2 },
        { name: "Your Rating", value: stats.avgRating || 0 },
        { name: "Benchmark", value: 4.5 },
        { name: "Target", value: 5.0 },
      ];
    }

    if (activeCategory === "plan") {
      const isPremium = stats.plan === "premium";
      return [
        { name: "Student Limit", value: isPremium ? 100 : 20 },
        { name: "Storage GB", value: isPremium ? 50 : 5 },
        { name: "Support Rank", value: isPremium ? 90 : 30 },
        { name: "AI Features", value: isPremium ? 100 : 10 },
      ];
    }

    if (activeCategory === "teachers") {
        return [
          { name: "Faculty Capacity", value: Math.max((stats.teachers || 0) + 10, 50) },
          { name: "Total Faculty", value: stats.teachers || 0 },
          { name: "Joined Today", value: stats.newTeachersToday || 0 },
          { name: "Active Now", value: Math.floor((stats.teachers || 0) * 0.9) },
        ];
    }

    if (activeCategory === "feedback") {
      return [
        { name: "Archive", value: Math.floor((stats.totalFeedback || 0) * 0.8) },
        { name: "Total Feedback", value: stats.totalFeedback || 0 },
        { name: "Feedback Today", value: stats.feedbackToday || 0 },
        { name: "Unresolved", value: Math.floor((stats.totalFeedback || 0) * 0.1) },
      ];
    }

    if (activeCategory === "students") {
      return [
        { name: "School Goal", value: Math.max((stats.students || 0) + 100, 500) },
        { name: "Total Students", value: stats.students || 0 },
        { name: "Active Now", value: stats.students || 0 },
        { name: "New Admissions", value: Math.floor((stats.students || 0) * 0.05) },
      ];
    }

    return [];
  }, [stats, activeCategory, selectedRange]);

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
            Growth metrics and trends will appear here
          </p>
        </div>
      </div>
    );
  }

  const axisStyle = {
    fontSize: '10px',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
    fill: '#94a3b8',
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-slate-100 shadow-sm mt-8 animate-fadeIn overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
            {chartType === "line" && <FaChartLine size={20} />}
            {chartType === "bar" && <FaChartBar size={20} />}
            {chartType === "pie" && <FaChartPie size={20} />}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight uppercase">
              {activeCategory} Intelligence
            </h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
              Range: {selectedRange === '7days' ? 'Last Week' : selectedRange === '30days' ? 'Last Month' : 'Last Year'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/50">
            {(["line", "pie", "bar"] as const).map((type) => (
                <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-6 py-2 text-[10px] font-black rounded-lg transition-all capitalize tracking-widest ${
                    chartType === type
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                >
                {type}
                </button>
            ))}
            </div>

             <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/50">
            {[
                { label: "7D", value: "7days" },
                { label: "30D", value: "30days" },
                { label: "1Y", value: "1year" },
            ].map((r) => (
                <button
                key={r.value}
                onClick={() => onRangeChange(r.value)}
                className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all tracking-tighter ${
                    selectedRange === r.value
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                >
                {r.label}
                </button>
            ))}
            </div>
        </div>
      </div>

      <div className="w-full">
        {isReady ? (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={8}
                  stroke="none"
                >
                  {chartData.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : chartType === "bar" ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisStyle} dy={15} label={{ value: 'Time Period', position: 'insideBottom', offset: -20, fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={axisStyle} dx={-10} label={{ value: 'Entries', angle: -90, position: 'insideLeft', offset: 15, fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="url(#barGradient)" radius={[10, 10, 0, 0]} barSize={selectedRange === '30days' ? 12 : 45} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisStyle} dy={15} label={{ value: 'Time Period', position: 'insideBottom', offset: -20, fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={axisStyle} dx={-10} label={{ value: 'Entries', angle: -90, position: 'insideLeft', offset: 15, fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} dot={{ fill: '#6366f1', strokeWidth: 2, r: selectedRange === '30days' ? 3 : 6, stroke: '#fff' }} activeDot={{ r: 9, strokeWidth: 0 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;
