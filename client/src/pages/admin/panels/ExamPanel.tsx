import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const ExamPanel = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/exams");
    setExams(res.data.data || []);
    setLoading(false);
  };

  const create = async () => {
    if (!name || !date) return alert("Fill all fields");
    await api.post("/exams", { name, date });
    setName("");
    setDate("");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this exam?")) return;
    await api.delete(`/exams/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <h2 className="text-2xl font-bold text-gray-800">Exam Management</h2>

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
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Exam</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Loading exams...
                </td>
              </tr>
            )}

            {!loading && exams.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No exams yet
                </td>
              </tr>
            )}

            {exams.map((exam) => {
              const isPast = new Date(exam.date) < new Date();

              return (
                <tr key={exam._id} className="border-t">
                  <td className="p-3 font-medium">{exam.name}</td>
                  <td className="p-3">
                    {new Date(exam.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        isPast
                          ? "bg-gray-200 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isPast ? "Completed" : "Upcoming"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => remove(exam._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamPanel;
