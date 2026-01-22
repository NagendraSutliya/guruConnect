import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "../api/axiosInstance";
import {
  FaUser,
  FaChalkboardTeacher,
  FaComments,
  FaStar,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  onClick?: () => void;
};

const StatCard = ({ title, value, icon, onClick }: StatCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow flex items-center gap-4 transition cursor-pointer hover:shadow-lg ${
        onClick ? "hover:bg-gray-50" : ""
      }`}
    >
      {icon && <div className="text-green-600 text-3xl">{icon}</div>}
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold">{value || 0}</h2>
      </div>
    </div>
  );
};

const StatsCards = () => {
  const [stats, setStats] = useState<any>({});
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"line" | "pie" | "bar">("line");

  useEffect(() => {
    api
      .get("/admin/stats", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("adminToken"),
        },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  const COLORS = ["#4ade80", "#22d3ee"]; // colors for PieChart

  // Only define chart data for cards where a chart is meaningful
  const chartDataMap: Record<string, { date: string; value: number }[]> = {
    teachers: [
      { date: "Total Teachers", value: stats.teachers || 0 },
      { date: "New Today", value: stats.newTeachersToday || 0 },
    ],
    feedback: [
      { date: "Total Feedback", value: stats.totalFeedback || 0 },
      { date: "Today", value: stats.feedbackToday || 0 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {/* Cards with charts */}
        <StatCard
          title="Total Teachers"
          value={stats.teachers}
          icon={<FaChalkboardTeacher />}
          onClick={() => setActiveChart("teachers")}
        />
        <StatCard
          title="Total Feedback"
          value={stats.totalFeedback}
          icon={<FaComments />}
          onClick={() => setActiveChart("feedback")}
        />

        {/* Cards without charts */}
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={<FaUsers />}
        />
        <StatCard
          title="Feedback Today"
          value={stats.feedbackToday}
          icon={<FaComments />}
        />
        <StatCard
          title="Average Rating"
          value={stats.avgRating?.toFixed(1) || "0"}
          icon={<FaStar />}
        />
        <StatCard
          title="New Teachers Today"
          value={stats.newTeachersToday}
          icon={<FaUser />}
        />
        <StatCard title="Plan" value={stats.plan} icon={<FaChartLine />} />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
        {!activeChart && <p>Click on a card with a chart to view data here.</p>}
        {activeChart && chartDataMap[activeChart]?.length > 0 ? (
          <>
            {/* Chart type selector UI */}
            {/* Chart Type Selector */}
            <div className="mb-4 flex justify-start gap-4">
              {(["line", "pie", "bar"] as const).map((type) => (
                <button
                  key={type}
                  className={`px-3 py-1 rounded ${
                    chartType === type
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setChartType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <h3 className="mb-4 text-lg font-semibold">
              {activeChart === "teachers"
                ? "Teachers Trend"
                : activeChart === "feedback"
                ? "Feedback Trend"
                : activeChart.charAt(0).toUpperCase() +
                  activeChart.slice(1) +
                  " Trend"}
            </h3>
            {/* // Render chart dynamically based on selected type */}
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "line" && (
                <LineChart data={chartDataMap[activeChart]}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4ade80" />
                </LineChart>
              )}

              {chartType === "pie" && (
                <PieChart>
                  <Pie
                    data={chartDataMap[activeChart]}
                    dataKey="value"
                    nameKey="date"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#4ade80"
                    label
                  >
                    {chartDataMap[activeChart].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}

              {chartType === "bar" && (
                <BarChart data={chartDataMap[activeChart]}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4ade80" />
                </BarChart>
              )}
            </ResponsiveContainer>
            ;
            {/* <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartDataMap[activeChart]}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4ade80" />
              </LineChart>
            </ResponsiveContainer> */}
          </>
        ) : (
          activeChart && <p>No chart available for this card.</p>
        )}
      </div>
    </div>
  );
};

export default StatsCards;
