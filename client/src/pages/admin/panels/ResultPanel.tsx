import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const AdminResultPanel = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");

  const load = async () => {
    const e = await api.get("/exams");
    const c = await api.get("/classes");

    setExams(e.data.data);
    setClasses(c.data.data);
  };

  const loadResults = async () => {
    const res = await api.get(
      `/results/admin?examId=${examId}&classId=${classId}`
    );
    setResults(res.data.data);
    setSummary(res.data.summary);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadResults();
  }, [examId, classId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Result Dashboard</h2>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Exams</option>
          {exams.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>

        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Average Marks</p>
            <p className="text-2xl font-bold">{summary.average}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Topper</p>
            <p className="text-xl font-bold">{summary.topper}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Total Students</p>
            <p className="text-2xl font-bold">{summary.total}</p>
          </div>
        </div>
      )}

      {/* Result table */}
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
                <td className="p-3 font-semibold">{r.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminResultPanel;
