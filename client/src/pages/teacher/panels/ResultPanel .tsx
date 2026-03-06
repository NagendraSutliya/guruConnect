import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const ResultPanel = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [results, setResults] = useState<Record<string, string>>({});

  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");

  /* ===== LOAD DATA ===== */

  const loadExams = async () => {
    const res = await api.get("/exams");
    setExams(res.data.data);
  };

  const loadClasses = async () => {
    const res = await api.get("/classes");
    setClasses(res.data.data);
  };

  const loadStudents = async () => {
    if (!classId) return;
    const res = await api.get(`/students?classId=${classId}`);
    setStudents(res.data.data);
  };

  useEffect(() => {
    loadExams();
    loadClasses();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [classId]);

  /* ===== MARKS ===== */

  const updateMarks = (studentId: string, value: string) => {
    setResults((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const saveResults = async () => {
    const payload = Object.entries(results).map(([studentId, marks]) => ({
      studentId,
      examId,
      marks,
    }));

    await api.post("/results/bulk", payload);
    alert("Results saved");
  };

  /* ===== UI ===== */

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Result Entry</h2>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Select Exam</option>
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
          <option>Select Class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={saveResults}
          className="bg-purple-600 text-white px-4 rounded"
        >
          Save Results
        </button>
      </div>

      {/* Marks table */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={results[s._id] || ""}
                    onChange={(e) => updateMarks(s._id, e.target.value)}
                    className="border p-1 rounded w-20"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultPanel;
