import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const StudentAttendance = () => {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/student");
      setRecords(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">My Attendance</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">
                  No attendance records
                </td>
              </tr>
            ) : (
              records.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{item.date}</td>
                  <td className="p-3">{item.subject}</td>
                  <td
                    className={`p-3 font-medium ${
                      item.status === "Present"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendance;
