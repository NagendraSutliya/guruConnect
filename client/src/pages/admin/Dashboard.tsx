import { useRef, useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import StatsCards from "../../components/admin/StatsCards";
import { useAuth } from "../../context/AuthContext";
import DashboardHero from "../../components/admin/DashboardHero";
import RecentActivity from "../../components/admin/RecentActivity";
import UpcomingEvents from "../../components/admin/UpcomingEvents";
import AiInsights from "../../components/admin/AiInsights";
import AnalyticsChart from "../../components/admin/AnalyticsChart";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState("7days");
  const analyticsRef = useRef<HTMLDivElement>(null);

  const fetchStats = (range: string) => {
    // Only show full page loader on initial load
    if (!stats) setLoading(true);
    
    api.get(`/admin/stats?range=${range}`)
      .then(res => {
        setStats(res.data.data);
      })
      .catch(err => console.error("Stats fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats(selectedRange);
  }, [selectedRange]);

  const handleCardClick = (category: string) => {
    setActiveCategory(category);
    requestAnimationFrame(() => {
      setTimeout(() => {
        analyticsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    });
  };

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
  };

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return <p className="text-slate-400 text-center py-20 text-xs font-bold uppercase tracking-widest">Unauthorized Access</p>;

  return (
    <div className="pb-12 space-y-6 animate-fadeIn">
      {/* 1. Compact Hero Header */}
      <DashboardHero instituteName={user.instituteName || "Administrator"} />

      {/* 2. Stats Grid */}
      <StatsCards stats={stats} onCardClick={handleCardClick} />

      {/* 3. Middle Section: AI & Activity (Above Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Left Column: AI & Activity */}
        <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    AI Insights
                </h2>
                <AiInsights />
            </div>

            <div className="space-y-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    Activity Stream
                </h2>
                <RecentActivity />
            </div>
        </div>

        {/* Right Column: Events */}
        <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                Upcoming Milestones
            </h2>
            <UpcomingEvents />
        </div>
      </div>

      {/* 4. Bottom Analytics Section */}
    <div ref={analyticsRef} className="pt-4 w-full min-w-0">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            Statistical Analysis
        </h2>
        <div className="w-full min-w-0">
        <AnalyticsChart 
          stats={stats} 
          activeCategory={activeCategory} 
          selectedRange={selectedRange}
          onRangeChange={handleRangeChange}
        /></div>
      </div>
    </div>
  );
}
