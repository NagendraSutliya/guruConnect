import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const TeacherStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
  });

  useEffect(() => {
    api
      .get("/teacher/stats", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("teacherToken"),
        },
      })
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Total Feedback */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <p className="text-gray-500">Total Feedback</p>
        <h2 className="text-4xl font-bold text-blue-600 mt-2">{stats.total}</h2>
      </div>

      {/* Today's Feedback */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <p className="text-gray-500">Today</p>
        <h2 className="text-4xl font-bold text-green-600 mt-2">
          {stats.today}
        </h2>
      </div>
    </div>
  );
};

export default TeacherStats;
