import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const AttendancePanel = () => {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    api.get("/attendance").then((res) => setRecords(res.data.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Attendance</h2>

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3">{r.studentId?.name}</td>
                <td className="p-3">{r.date.slice(0, 10)}</td>
                <td className="p-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePanel;
