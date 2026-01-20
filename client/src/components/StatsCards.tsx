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
  FaBook,
} from "react-icons/fa";

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
};

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow flex items-center gap-4 hover:shadow-lg transition cursor-pointer">
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

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Teachers"
          value={stats.teachers}
          icon={<FaChalkboardTeacher />}
        />
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
          title="Pending Feedback"
          value={stats.pendingFeedback}
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
        <StatCard
          title="Courses Created"
          value={stats.totalCourses}
          icon={<FaBook />}
        />
        <StatCard
          title="Plan"
          value={stats.plan || "Free"}
          icon={<FaChartLine />}
        />
      </div>

      {/* Placeholder for future charts */}
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
        Click on a card to see interactive charts here.
      </div>
    </div>
  );
};

export default StatsCards;
