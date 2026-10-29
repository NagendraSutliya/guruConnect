import {
  FaChalkboardTeacher,
  FaComments,
  FaStar,
  FaUsers,
  FaChartLine,
  FaUserShield,
  FaClock,
} from "react-icons/fa";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  color: string;
  onClick?: () => void;
};

const StatCard = ({ title, value, icon, trend, color, onClick }: StatCardProps) => {
  // Map old semantic colors to Patshala tokens
  const colorMap: Record<string, string> = {
    indigo: "bg-primary-tint text-primary",
    purple: "bg-primary-tint text-primary-dark",
    blue: "bg-warning-bg text-gold",
    emerald: "bg-success-bg text-success-text"
  };
  
  const iconColors = colorMap[color] || "bg-primary-tint text-primary";

  return (
    <div 
      onClick={onClick}
      className={`bg-surface rounded-card p-5 border border-line hover:border-primary-soft transition-all hover:shadow-sm group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-control flex items-center justify-center text-xl ${iconColors} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-control text-micro font-semibold tracking-tight ${
            trend.positive ? "bg-success-bg text-success-text" : "bg-warning-bg text-warning-text"
          }`}>
            {trend.positive ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-micro font-semibold text-ink-secondary uppercase tracking-[0.15em] mb-1">{title}</p>
        <h2 className="text-kpi font-semibold text-ink tracking-tight">
          {value ?? 0}
        </h2>
      </div>
    </div>
  );
};

const FaArrowUp = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
);
const FaArrowDown = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
);

export default function StatsCards({ stats, onCardClick }: { stats: any, onCardClick?: (category: string) => void }) {
  const safeStats = stats || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Faculty"
        value={safeStats.teachers}
        icon={<FaChalkboardTeacher />}
        trend={{ value: "Live", positive: true }}
        color="indigo"
        onClick={() => onCardClick?.("teachers")}
      />
      <StatCard
        title="Total Feedback"
        value={safeStats.totalFeedback}
        icon={<FaComments />}
        trend={{ value: "Latest", positive: true }}
        color="purple"
        onClick={() => onCardClick?.("feedback")}
      />
      <StatCard
        title="Total Students"
        value={safeStats.students}
        icon={<FaUsers />}
        trend={{ value: "Active", positive: true }}
        color="blue"
        onClick={() => onCardClick?.("students")}
      />
       <StatCard
        title="Avg Rating"
        value={(safeStats.avgRating || 0).toFixed(1)}
        icon={<FaStar />}
        color="rose"
        onClick={() => onCardClick?.("rating")}
      />
      <StatCard
        title="Feedback Today"
        value={safeStats.feedbackToday}
        icon={<FaClock />}
        color="emerald"
        onClick={() => onCardClick?.("feedback")}
      />
      <StatCard
        title="Joined Today"
        value={safeStats.newTeachersToday}
        icon={<FaUserShield />}
        color="orange"
        onClick={() => onCardClick?.("teachers")}
      />
      <StatCard
        title="Active Plan"
        value={safeStats.plan}
        icon={<FaChartLine />}
        color="cyan"
        onClick={() => onCardClick?.("plan")}
      />
    </div>
  );
}
