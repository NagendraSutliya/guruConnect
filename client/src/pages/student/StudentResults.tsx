import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const StudentResults = () => {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const res = await api.get("/results/student");
      setResults(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">My Results</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Exam</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Marks</th>
              <th className="p-3 text-left">Grade</th>
            </tr>
          </thead>

          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No results available
                </td>
              </tr>
            ) : (
              results.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{r.exam}</td>
                  <td className="p-3">{r.subject}</td>
                  <td className="p-3">{r.marks}</td>
                  <td className="p-3 font-medium text-blue-600">{r.grade}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentResults;
