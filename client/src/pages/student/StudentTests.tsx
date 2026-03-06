import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const StudentTests = () => {
  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const res = await api.get("/exams/student");
      setTests(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Upcoming Tests</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Test</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">
                  No upcoming tests
                </td>
              </tr>
            ) : (
              tests.map((t, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{t.name}</td>
                  <td className="p-3">{t.subject}</td>
                  <td className="p-3">{t.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTests;
