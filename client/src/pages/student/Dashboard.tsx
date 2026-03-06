import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import {
  FaClipboardCheck,
  FaBook,
  FaChartBar,
  FaFileAlt,
} from "react-icons/fa";

const StudentDashboard = () => {
  const [data, setData] = useState<any>({
    attendancePercent: 0,
    materials: 0,
    upcomingTests: 0,
    latestResult: null,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/student/dashboard-summary");
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Student Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <FaClipboardCheck className="text-green-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Attendance</p>
            <h2 className="text-xl font-semibold">{data.attendancePercent}%</h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <FaBook className="text-blue-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Study Materials</p>
            <h2 className="text-xl font-semibold">{data.materials}</h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <FaFileAlt className="text-purple-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Upcoming Tests</p>
            <h2 className="text-xl font-semibold">{data.upcomingTests}</h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <FaChartBar className="text-orange-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Latest Result</p>
            <h2 className="text-xl font-semibold">
              {data.latestResult?.percentage || "--"}%
            </h2>
          </div>
        </div>
      </div>

      {/* Latest Result */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-lg mb-4">Latest Exam Result</h2>

        {!data.latestResult ? (
          <p className="text-gray-500">No results available</p>
        ) : (
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{data.latestResult.examName}</p>
              <p className="text-gray-500 text-sm">
                Score: {data.latestResult.totalMarks}
              </p>
            </div>

            <div className="text-lg font-semibold text-blue-600">
              {data.latestResult.percentage}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
