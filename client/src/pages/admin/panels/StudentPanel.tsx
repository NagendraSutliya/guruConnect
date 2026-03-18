import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import Toast from "../../../components/Toast";
import { FiEdit, FiToggleLeft, FiToggleRight, FiTrash } from "react-icons/fi";

const StudentPanel = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    classId: "",
    sectionId: "",
  });

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warn";
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >(() => (localStorage.getItem("studentFilter") as any) || "all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Toast helper
  const showToast = (message: string, type: any = "info") => {
    setToast({ message, type });
  };

  // Load students
  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load students ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load classes and sections
  const loadClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  // Dynamic sections based on class
  useEffect(() => {
    if (!form.classId) {
      setSections([]);
      setForm({ ...form, sectionId: "" });
      return;
    }

    const loadSections = async () => {
      try {
        const res = await api.get(`/sections/class/${form.classId}`);
        setSections(res.data.data || []);
        setForm((prev) => ({ ...prev, sectionId: "" }));
      } catch (err) {
        setSections([]);
        setForm((prev) => ({ ...prev, sectionId: "" }));
        console.log(err);
      }
    };

    loadSections();
  }, [form.classId]);

  // Add or edit student
  const saveStudent = async () => {
    if (!form.name || !form.email || !form.classId) {
      return showToast("Please fill all required fields ⚠️", "warn");
    }

    try {
      setActionLoading("save");

      if (editingStudent) {
        await api.put(`/admin/student/${editingStudent._id}`, form);
        showToast("Student updated ✏️", "success");
      } else {
        const res = await api.post("/admin/student", form);
        const creds = res.data.data;
        showToast(
          `Student created ✅ Email: ${creds.email}, Password: ${creds.password}`,
          "success"
        );
      }

      setForm({ name: "", email: "", classId: "", sectionId: "" });
      setEditingStudent(null);
      setShowForm(false);
      loadStudents();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Operation failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete student
  const deleteStudent = async (student: any) => {
    if (!confirm(`Delete ${student.name}? This cannot be undone.`)) return;

    try {
      setActionLoading(student._id);
      await api.delete(`/admin/student/${student._id}`);
      setStudents((prev) => prev.filter((s) => s._id !== student._id));
      showToast("Student deleted 🗑️", "success");
    } catch (err) {
      showToast("Delete failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle active/inactive
  const toggleStudent = async (student: any) => {
    try {
      setActionLoading(student._id);

      if (student.isActive) {
        await api.patch(`/admin/student/${student._id}/deactivate`);
        showToast("Student deactivated", "info");
      } else {
        await api.patch(`/admin/student/${student._id}/activate`);
        showToast("Student activated", "success");
      }

      loadStudents();
    } catch (err) {
      showToast("Failed to update status ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const editStudent = (student: any) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      email: student.email,
      classId: student.classId?._id || "",
      sectionId: student.sectionId?._id || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setForm({ name: "", email: "", classId: "", sectionId: "" });
    setEditingStudent(null);
    setShowForm(false);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesStatus =
      statusFilter === "all" || s.isActive === (statusFilter === "active");
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: students.length,
    active: students.filter((s) => s.isActive).length,
    inactive: students.filter((s) => !s.isActive).length,
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    localStorage.setItem("studentFilter", statusFilter);
    setCurrentPage(1);
  }, [statusFilter, searchTerm, itemsPerPage]);

  return (
    <div className="space-y-1 pb-8">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 py-2">Students</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold shadow hover:bg-blue-700 transition"
          >
            + Add Student
          </button>
        )}
      </div>

      {/* Container */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
        {/* Count */}
        <div className="flex items-center justify-start gap-2">
          <p className="text-lg font-bold text-gray-700">Total Students</p>
          <span className="text-blue-700 px-3 text-xl font-bold">
            {students.length}
          </span>
        </div>

        {/* Search + Filter */}
        <div className="flex justify-between items-center mb-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filters */}
          <div className="inline-flex bg-gray-100 rounded-full">
            {(["all", "active", "inactive"] as const).map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
                    isActive
                      ? "bg-green-600 text-white shadow"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status} ({counts[status]})
                </button>
              );
            })}
          </div>
        </div>

        {/* Student Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-400">
            Loading students...
          </div>
        ) : paginatedStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No students found
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-green-100 text-xs font-semibold text-gray-700 uppercase text-left">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Status</th>
                  <th className="pr-10 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedStudents.map((s) => {
                  const isLoading = actionLoading === s._id;

                  return (
                    <tr
                      key={s._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-800">
                            {s.name || "Unnamed"}
                          </p>
                        </div>
                      </td>

                      <td className="p-3 text-sm text-gray-600">{s.email}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {s.classId?.name}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {s.sectionId?.name || "-"}
                      </td>

                      <td className="px-3 text-left">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            s.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {s.isActive ? "active" : "inactive"}
                        </span>
                      </td>

                      <td className="p-3 flex justify-end gap-1">
                        <button
                          onClick={() => editStudent(s)}
                          className="text-yellow-600 p-1 rounded hover:bg-yellow-50"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>

                        <button
                          onClick={() => toggleStudent(s)}
                          disabled={isLoading}
                          className={`p-1 rounded transition ${
                            s.isActive
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={s.isActive ? "Deactivate" : "Activate"}
                        >
                          {isLoading ? (
                            <span className="text-xs">...</span>
                          ) : s.isActive ? (
                            <FiToggleLeft />
                          ) : (
                            <FiToggleRight />
                          )}
                        </button>

                        <button
                          onClick={() => deleteStudent(s)}
                          disabled={isLoading}
                          className="text-red-600 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          {isLoading ? (
                            <span className="text-xs">...</span>
                          ) : (
                            <FiTrash />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          {/* Items per page selector */}
          <div>
            <label className="mr-2 text-gray-700 text-sm">
              Items per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Page navigation */}
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

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px] space-y-4">
            <h3 className="text-lg font-semibold">
              {editingStudent ? "Edit Student" : "Add Student"}
            </h3>

            <input
              className="border w-full p-2 rounded"
              placeholder="Student name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="border w-full p-2 rounded"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <select
              className="border w-full p-2 rounded"
              value={form.classId}
              onChange={(e) =>
                setForm({ ...form, classId: e.target.value, sectionId: "" })
              }
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="border w-full p-2 rounded"
              value={form.sectionId}
              onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
            >
              <option value="">Select section</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="flex justify-between gap-3 pt-2">
              <button
                onClick={closeForm}
                className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={saveStudent}
                disabled={actionLoading === "save"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                {actionLoading === "save"
                  ? editingStudent
                    ? "Updating..."
                    : "Creating..."
                  : editingStudent
                  ? "Update Student"
                  : "Create Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPanel;
