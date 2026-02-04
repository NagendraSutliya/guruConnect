import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const ExamPanel = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const load = async () => {
    const res = await api.get("/exams");
    setExams(res.data.data);
  };

  const create = async () => {
    await api.post("/exams", { name, date });
    setName("");
    setDate("");
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Exams</h2>

      {/* Add Exam */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Exam name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
              <th className="p-3">Exam Name</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam._id} className="border-t">
                <td className="p-3">{exam.name}</td>
                <td className="p-3">{exam.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamPanel;
