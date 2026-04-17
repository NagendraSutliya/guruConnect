import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import ViewTeacherModal from "../../../components/admin/ViewTeacherModal";
import AddTeacherModal from "../../modals/admin/AddTeacherModal";
import Toast from "../../../components/Toast";
import {
  FiEdit,
  FiEye,
  FiSearch,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const TeacherPanel = () => {
  /** --------------------- State Variables --------------------- **/
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warn";
  } | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >(() => (localStorage.getItem("teacherFilter") as any) || "all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  /** --------------------- Helper Functions --------------------- **/
  const showToast = (message: string, type: any = "info") => {
    setToast({ message, type });
  };

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/teachers");
      setTeachers(res.data.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load teachers ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  const addTeacher = async () => {
    if (!form.name || !form.email || (!editingTeacher && !form.password)) {
      return showToast("All required fields must be filled", "warn");
    }

    try {
      setActionLoading("save");

      if (editingTeacher) {
        await api.put(`/admin/teachers/${editingTeacher._id}`, form);
        showToast("Teacher updated ✏️", "success");
      } else {
        await api.post("/admin/teachers", form);
        showToast("Teacher added successfully ✅", "success");
      }

      setForm({ name: "", email: "", password: "" });
      setEditingTeacher(null);
      setShowForm(false);
      loadTeachers();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Operation failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteTeacher = async (teacher: any) => {
    const confirmDelete = window.confirm(
      `Delete ${teacher.name}? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      setActionLoading(teacher._id);
      await api.delete(`/admin/teachers/${teacher._id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== teacher._id));
      showToast("Teacher deleted 🗑️", "success");
    } catch (err) {
      showToast("Delete failed ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleTeacher = async (teacher: any) => {
    try {
      setActionLoading(teacher._id);

      if (teacher.status === "active") {
        await api.patch(`/admin/teachers/${teacher._id}/deactivate`);
        showToast("Teacher deactivated", "info");
      } else {
        await api.patch(`/admin/teachers/${teacher._id}/activate`);
        showToast("Teacher activated", "success");
      }

      loadTeachers();
    } catch (err) {
      showToast("Failed to update status ❌", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const viewTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const editTeacher = (teacher: any) => {
    setEditingTeacher(teacher);
    setForm({ name: teacher.name, email: teacher.email, password: "" });
    setShowForm(true);
  };

  const closeAddTeacher = () => {
    setForm({ name: "", email: "", password: "" });
    setEditingTeacher(null);
    setShowForm(false);
  };

  /** --------------------- Effects --------------------- **/
  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    localStorage.setItem("teacherFilter", statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, statusFilter, searchTerm]);

  /** --------------------- Filtered & Paginated Data --------------------- **/
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesStatus =
      statusFilter === "all" || teacher.status === statusFilter;
    const matchesSearch =
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: teachers.length,
    active: teachers.filter((t) => t.status === "active").length,
    inactive: teachers.filter((t) => t.status === "inactive").length,
  };

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /** --------------------- Render --------------------- **/
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
      <div className="sticky top-0 z-20 bg-gray-100 py-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 py-2">Teachers</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold shadow hover:bg-blue-700 transition"
            >
              + Add Teacher
            </button>
          )}
        </div>
      </div>

      {/* Container */}
      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
          {/* Count */}
          <div className="flex items-center justify-start gap-2">
            <p className="text-lg font-bold text-gray-700">Total Teachers :</p>
            <span className="text-blue-700 px-1 text-xl font-bold">
              {teachers.length}
            </span>
          </div>

          {/* Search + Filter */}
          <div className="flex justify-between items-center mb-4">
            <div className="bg-white flex items-center border rounded-lg overflow-hidden shadow">
              <FiSearch className="text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 text-sm outline-none"
              />
              <FiX
                className={`text-gray-400 cursor-pointer mr-2 ${
                  searchTerm ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setSearchTerm("")}
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

          {/* Teacher Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-green-100 text-sm font-semibold text-gray-700 uppercase text-left">
                <tr>
                  <th className="p-3">Teacher</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Status</th>
                  <th className="pr-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      Loading teachers...
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      No teachers found
                    </td>
                  </tr>
                ) : (
                  paginatedTeachers.map((teacher: any) => {
                    const initials =
                      teacher?.name?.charAt(0)?.toUpperCase() ?? "?";
                    const isLoading = actionLoading === teacher._id;

                    return (
                      <tr
                        key={teacher._id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        {/* Teacher */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {teacher.name || "Unnamed"}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {teacher._id?.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-3 text-sm text-gray-600 truncate">
                          {teacher.email}
                        </td>

                        {/* Joined */}
                        <td className="p-3 text-sm text-gray-600">
                          {teacher.createdAt
                            ? new Date(teacher.createdAt).toLocaleDateString(
                                "en-GB"
                              )
                            : "-"}
                        </td>

                        {/* Status */}
                        <td className="p-3 text-left">
                          <span
                            className={`px-2 py-1 rounded text-sm font-semibold ${
                              teacher.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {teacher.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-1 h-full">
                            <button
                              onClick={() => viewTeacher(teacher)}
                              className="text-blue-600 p-1 rounded hover:bg-blue-50"
                              title="View"
                            >
                              <FiEye />
                            </button>

                            <button
                              onClick={() => toggleTeacher(teacher)}
                              disabled={isLoading}
                              className={`p-1 rounded transition ${
                                teacher.status === "active"
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                teacher.status === "active"
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              {isLoading ? (
                                <span className="text-xs">...</span>
                              ) : teacher.status === "active" ? (
                                <FiToggleLeft />
                              ) : (
                                <FiToggleRight />
                              )}
                            </button>

                            <button
                              onClick={() => editTeacher(teacher)}
                              className="text-yellow-600 p-1 rounded hover:bg-yellow-50"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>

                            <button
                              onClick={() => deleteTeacher(teacher)}
                              disabled={isLoading}
                              className="text-red-600 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              {isLoading ? (
                                <span className="text-xs">...</span>
                              ) : (
                                <FiTrash2 />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>{" "}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            {/* Items per page selector */}
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
      </div>

      {/* Modals */}
      {showForm && (
        <AddTeacherModal
          form={form}
          setForm={setForm}
          onSave={addTeacher}
          onClose={closeAddTeacher}
          loading={actionLoading === "save"}
          isEdit={!!editingTeacher}
        />
      )}

      {showViewModal && selectedTeacher && (
        <ViewTeacherModal
          teacher={selectedTeacher}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default TeacherPanel;
