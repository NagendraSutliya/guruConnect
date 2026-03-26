import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import api from "../../../api/axiosInstance";
import Toast from "../../../components/Toast";
import UpdateExamSubjectModal from "../../modals/admin/UpdateExamSubjectModal";

const ExamSubjectPanel = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<any>(null);

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [form, setForm] = useState({
    subjectId: "",
    date: "",
    startTime: "",
    endTime: "",
    maxMarks: 100,
  });

  const [editData, setEditData] = useState<any>(null);

  // --- Toast helper ---
  const showToast = (toast: {
    message: string;
    type?: "success" | "error" | "info" | "warn";
  }) => setToastMessage(toast);

  // --- Fetch subjects for exam and all subjects ---
  const fetchData = async () => {
    if (!examId) return;

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
      showToast({ message: "Failed to fetch data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  // --- Add new exam subject ---
  const handleAdd = async () => {
    if (!form.subjectId || !form.date) {
      return showToast({
        message: "Subject & Date are required",
        type: "warn",
      });
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
      showToast({
        message: "Exam subject added successfully",
        type: "success",
      });
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Failed to add exam subject",
        type: "error",
      });
    }
  };

  // --- Delete exam subject ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this subject?")) return;

    try {
      await api.delete(`/exam-subjects/${id}`);
      fetchData();
      showToast({ message: "Exam subject deleted", type: "success" });
    } catch (err) {
      console.error(err);
      showToast({ message: "Failed to delete", type: "error" });
    }
  };

  // --- Calculate status for a subject ---
  const getStatus = (date: string, start: string, end: string) => {
    const now = new Date();
    const examDate = new Date(date);

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

  // --- Filtered subjects for search ---
  const filtered = subjects.filter((s) =>
    s.subjectId?.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- Pagination logic ---
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exam Subjects</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
      </div>

      {/* Add Form */}
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
          {loading ? "loading..." : "Add Exam"}
        </button>
      </div>

      {/* Search & Table */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Exams</h3>
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

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-100">
              <tr>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Time</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Max Marks</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-5">
                    Loading...
                  </td>
                </tr>
              ) : paginatedExams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-5 text-gray-400">
                    No data
                  </td>
                </tr>
              ) : (
                paginatedExams.map((s) => {
                  const status = getStatus(s.date, s.startTime, s.endTime);
                  return (
                    <tr key={s._id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{s.subjectId?.name}</td>
                      <td className="p-3 text-center">
                        {new Date(s.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-center">
                        {s.startTime} - {s.endTime}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-sm ${statusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3 text-center">{s.maxMarks}</td>
                      <td className="p-3 flex justify-center gap-1">
                        <button
                          onClick={() => setEditData(s)}
                          disabled={status !== "upcoming"}
                          className={`text-yellow-600 p-1 rounded hover:bg-yellow-50 ${
                            status !== "upcoming"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <label className="mr-2 text-gray-700 text-sm">
              Items per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Edit Modal */}
      {editData && (
        <UpdateExamSubjectModal
          editData={editData}
          setEditData={setEditData}
          refreshList={fetchData}
          setToast={showToast}
        />
      )}
    </div>
  );
};

export default ExamSubjectPanel;
