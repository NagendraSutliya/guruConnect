import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import {
  FiBookOpen,
  FiEdit,
  FiSearch,
  FiX,
  FiTrash2,
  FiChevronDown,
  FiUser,
  FiAward,
  FiBarChart2,
} from "react-icons/fi";
import type { Exam } from "../../../types/admin/exam";
import type { Class } from "../../../types/admin/class";
import type { Section } from "../../../types/admin/section";
import EditExamModal from "../../modals/admin/UpdateExamModal";
import Toast from "../../../components/Toast";

const Card = ({ title, value, color, icon }: any) => (
  <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4 flex-1">
    <div
      className={`p-3 rounded-full bg-${color}-100 text-${color}-600 text-xl flex items-center justify-center`}
    >
      {icon}
    </div>
    <div className="flex flex-col">
      <p className="text-gray-500 font-medium">{title}</p>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </div>
  </div>
);

const ExamPanel = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    classId: "",
    sectionId: "",
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warn";
  } | null>(null);

  const [editExam, setEditExam] = useState<Exam | null>(null);

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadData = async () => {
    try {
      setLoading(true);

      const [examsRes, classRes, sectionRes, examSubRes] = await Promise.all([
        api.get("/exams"),
        api.get("/classes"),
        api.get("/sections"),
        api.get("/exam-subjects"),
      ]);

      const examData = examsRes.data.data;
      const examSubjects = examSubRes.data.data;

      const examsWithSubjects = examData.map((exam: any) => {
        const subjects = examSubjects.filter(
          (es: any) => es.examId?._id === exam._id
        );
        return { ...exam, subjects };
      });

      setExams(examsWithSubjects);
      setClasses(classRes.data.data);
      setSections(sectionRes.data.data);
    } catch (err) {
      console.error("Loading error", err);
      setToast({ message: "Failed to load data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      await api.post("/exams", form);
      setToast({ message: "Exam created successfully", type: "success" });

      setForm({ name: "", classId: "", sectionId: "" });
      setCurrentPage(1);
      loadData();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to create exam", type: "error" });
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete exam?")) return;

    try {
      await api.delete(`/exams/${id}`);
      setToast({ message: "Exam deleted successfully", type: "success" });
      loadData();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to delete exam", type: "error" });
    }
  };

  const updateExam = async () => {
    if (!editExam) return;

    try {
      await api.put(`/exams/${editExam._id}`, editExam);
      setToast({ message: "Exam updated successfully", type: "success" });

      setEditExam(null);
      loadData();
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update exam", type: "error" });
    }
  };

  const examsubject = (exam: any) => {
    navigate(`/admin/exam-subjects/${exam._id}`, {
      state: { classId: exam.classId?._id || exam.classId },
    });
  };
  const getExamStatus = (subjects: any[] = []) => {
    if (!subjects.length) return "upcoming";

    const now = new Date();
    let hasOngoing = false;
    let allCompleted = true;

    for (let sub of subjects) {
      const examDate = new Date(sub.date);
      const [sh, sm] = sub.startTime.split(":");
      const [eh, em] = sub.endTime.split(":");

      const start = new Date(examDate);
      start.setHours(Number(sh), Number(sm));

      const end = new Date(examDate);
      end.setHours(Number(eh), Number(em));

      if (now >= start && now <= end) hasOngoing = true;
      if (now < end) allCompleted = false;
    }

    if (hasOngoing) return "active";
    if (allCompleted) return "completed";
    return "upcoming";
  };

  const statusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // --- Filter + Pagination ---
  const filteredExams = useMemo(() => {
    return exams.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [exams, search]);

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExams.slice(start, start + itemsPerPage);
  }, [filteredExams, currentPage, itemsPerPage]);

  const filteredSections = useMemo(() => {
    if (!form.classId) return [];

    return sections.filter(
      (s: any) => s.classId === form.classId || s.classId?._id === form.classId
    );
  }, [sections, form.classId]);

  return (
    <div className="space-y-4 pb-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          onClose={() => setToast(null)}
        />
      )}
      <div className="sticky flex justify-between items-center top-0 z-20 bg-gray-100 py-1 mb-4">
        <h2 className="text-2xl font-semibold">Exam Management</h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Card
          title="Total Exams"
          value={exams.length}
          color="blue"
          icon={<FiBookOpen />}
        />
        <Card
          title="Total Classes"
          value={classes.length}
          color="purple"
          icon={<FiUser />}
        />
        <Card
          title="Total Sections"
          value={sections.length}
          color="yellow"
          icon={<FiAward />}
        />
        <Card
          title="Active Exams"
          value={
            exams.filter((e) => getExamStatus(e.subjects || []) === "active")
              .length
          }
          color="green"
          icon={<FiBarChart2 />}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Exam Name
          </label>
          <input
            type="text"
            placeholder="Exam Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-md shadow px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Class
          </label>
          <div className="relative">
            <select
              value={form.classId}
              onChange={(e) =>
                setForm({ ...form, classId: e.target.value, sectionId: "" })
              }
              required
              className="w-full border rounded-md px-4 py-2 pr-8 appearance-none shadow 
              focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Section
          </label>
          <div className="relative">
            <select
              value={form.sectionId}
              onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
              className="w-full border rounded-md px-4 py-2 pr-8 appearance-none shadow 
              focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
            >
              <option value="">Select Section</option>
              {filteredSections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <button
          onClick={submit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4 py-2"
        >
          {loading ? "loading..." : "Create Exam"}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Exams</h3>

          <div className="flex items-center border rounded-lg overflow-hidden">
            <FiSearch className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search exam..."
              className="flex-grow px-2 py-1 outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FiX
              className={`text-gray-400 cursor-pointer mr-2 ${
                search ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSearch("")}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-visible">
          <table className="w-full table-fixed">
            <thead className="bg-green-100 text-xs font-semibold text-gray-700 uppercase">
              <tr>
                <th className="p-3 text-left">Exam</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Section</th>
                <th className="p-3 text-center">Subjects</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    Loading exams...
                  </td>
                </tr>
              ) : paginatedExams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No exams found
                  </td>
                </tr>
              ) : (
                paginatedExams.map((exam) => (
                  <tr key={exam._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{exam.name}</td>
                    <td className="p-3">
                      {exam.classId?.name ? (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">
                          {exam.classId.name}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="p-3">{exam.sectionId?.name || "-"}</td>
                    <td className="p-1 text-center">
                      {exam.subjects?.length ? (
                        <div className="relative group inline-block">
                          {exam.subjects?.some(
                            (s: any) => s.subjectId?.name
                          ) ? (
                            <span className="flex bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm cursor-pointer">
                              {exam.subjects
                                .slice(0, 2)
                                .map((s: any) => s.subjectId?.name)
                                .filter(Boolean)
                                .join(", ")}
                              {exam.subjects.length > 2 &&
                                ` +${exam.subjects.length - 2}`}
                            </span>
                          ) : (
                            <span>-</span>
                          )}

                          <div
                            className="absolute z-50 hidden group-hover:block bg-gray-800 
                                        text-white text-xs rounded px-3 py-2 mt-2 w-max max-w-xs 
                                        left-1/2 -translate-x-1/2 shadow-lg whitespace-nowrap"
                          >
                            {exam.subjects
                              .map((s: any) => s.subjectId?.name)
                              .join(", ")}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No subjects</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-sm ${statusBadge(
                          getExamStatus(exam.subjects || [])
                        )}`}
                      >
                        {getExamStatus(exam.subjects || [])}
                      </span>
                    </td>
                    <td className="p-3 flex items-center justify-center gap-1">
                      <button
                        onClick={() => examsubject(exam)}
                        className="text-blue-600 p-1 rounded"
                      >
                        <FiBookOpen />
                      </button>

                      <button
                        onClick={() => setEditExam(exam)}
                        className="text-yellow-600 p-1 rounded hover:bg-yellow-50"
                      >
                        <FiEdit />
                      </button>

                      <button
                        onClick={() => remove(exam._id)}
                        className="text-red-600"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
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

      {/* Edit Exam Modal */}
      <EditExamModal
        editExam={editExam}
        setEditExam={setEditExam}
        updateExam={updateExam}
      />
    </div>
  );
};

export default ExamPanel;
