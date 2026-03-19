import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash, FiX, FiSearch } from "react-icons/fi";
import api from "../../../api/axiosInstance";

const ExamSubjectPanel = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    subjectId: "",
    date: "",
    startTime: "",
    endTime: "",
    maxMarks: 100,
  });

  const [editData, setEditData] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [subRes, allSubRes] = await Promise.all([
        api.get(`/exam-subjects/${examId}`),
        api.get("/subjects"),
      ]);

      setSubjects(subRes.data.data || []);
      setAllSubjects(allSubRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examId) fetchData();
  }, [examId]);

  const handleAdd = async () => {
    if (!form.subjectId || !form.date) {
      return alert("Subject & Date required");
    }

    try {
      await api.post("/exam-subjects", {
        examId,
        ...form,
      });

      setForm({
        subjectId: "",
        date: "",
        startTime: "",
        endTime: "",
        maxMarks: 100,
      });

      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this subject?")) return;

    try {
      await api.delete(`/exam-subjects/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/exam-subjects/${editData._id}`, editData);
      setEditData(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = subjects.filter((s) =>
    s.subjectId?.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (date: string, start: string, end: string) => {
    const now = new Date();

    const examDate = new Date(date);

    // Create full datetime for start & end
    const [startH, startM] = start.split(":");
    const [endH, endM] = end.split(":");

    const startDateTime = new Date(examDate);
    startDateTime.setHours(Number(startH), Number(startM));

    const endDateTime = new Date(examDate);
    endDateTime.setHours(Number(endH), Number(endM));

    if (now < startDateTime) return "upcoming";
    if (now >= startDateTime && now <= endDateTime) return "ongoing";
    return "completed";
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* 🔙 Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exam Subjects</h2>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
      </div>

      {/* ➕ Form */}
      <div className="bg-white p-5 rounded-xl shadow grid md:grid-cols-6 gap-3">
        <select
          value={form.subjectId}
          onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Subject</option>
          {allSubjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="time"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="time"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="number"
          value={form.maxMarks}
          onChange={(e) =>
            setForm({ ...form, maxMarks: Number(e.target.value) })
          }
          className="border p-2 rounded"
        />

        <button
          onClick={handleAdd}
          className="w-28 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4"
        >
          Add
        </button>
      </div>

      {/* 🔍 Search */}
      <div className="flex justify-end">
        <div className="flex items-center bg-white px-3 py-2 rounded shadow w-72">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            placeholder="Search subject..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Marks</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-5">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-5 text-gray-400">
                  No data
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{s.subjectId?.name}</td>

                  <td className="p-3 text-center">
                    {new Date(s.date).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-center">
                    {s.startTime} - {s.endTime}
                  </td>

                  <td className="p-3 text-center">
                    {(() => {
                      const status = getStatus(s.date, s.startTime, s.endTime);
                      return (
                        <span
                          className={`px-2 py-1 rounded text-sm ${statusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      );
                    })()}
                  </td>

                  <td className="p-3 text-center">{s.maxMarks}</td>

                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => setEditData(s)}
                      className="text-green-600"
                    >
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-600"
                    >
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✏️ Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">Edit Subject</h3>
              <FiX onClick={() => setEditData(null)} />
            </div>

            <input
              value={editData.startTime}
              onChange={(e) =>
                setEditData({ ...editData, startTime: e.target.value })
              }
              className="border p-2 w-full rounded"
            />

            <input
              value={editData.endTime}
              onChange={(e) =>
                setEditData({ ...editData, endTime: e.target.value })
              }
              className="border p-2 w-full rounded"
            />

            <input
              type="number"
              value={editData.maxMarks}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  maxMarks: Number(e.target.value),
                })
              }
              className="border p-2 w-full rounded"
            />

            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSubjectPanel;
