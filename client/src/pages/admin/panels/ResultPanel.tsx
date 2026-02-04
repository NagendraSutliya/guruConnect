import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const ResultPanel = () => {
  const [results, setResults] = useState<any[]>([]);
  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");
  const [marks, setMarks] = useState("");

  const load = async () => {
    const res = await api.get("/results");
    setResults(res.data.data);
  };

  const create = async () => {
    await api.post("/results", { studentId, examId, marks });
    setStudentId("");
    setExamId("");
    setMarks("");
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Results</h2>

      {/* Add Result */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Exam ID"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />
        <button
          onClick={create}
          className="bg-purple-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Exam</th>
              <th className="p-3">Marks</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3">{r.studentId?.name}</td>
                <td className="p-3">{r.examId?.name}</td>
                <td className="p-3">{r.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultPanel;
