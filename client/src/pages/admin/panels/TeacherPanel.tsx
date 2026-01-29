import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import ViewTeacherModal from "../../../components/admin/ViewTeacherModal";
import AddTeacherModal from "../../../components/admin/AddTeacherModal";

const TeacherPanel = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >(() => {
    return (localStorage.getItem("teacherFilter") as any) || "all";
  });

  const loadTeachers = async () => {
    try {
      const res = await api.get("/admin/teachers");
      setTeachers(res.data.data);
    } catch (err) {
      console.error("Failed to load teachers", err);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const addTeacher = async () => {
    if (!form.name || !form.email || !form.password) {
      return alert("All fields are required");
    }

    try {
      await api.post("/admin/teacher", form);
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      loadTeachers();
    } catch (err) {
      console.error("Failed to add teacher", err);
    }
  };

  const closeAddTeacher = () => {
    setForm({ name: "", email: "", password: "" });
    setShowForm(false);
  };

  useEffect(() => {
    localStorage.setItem("teacherFilter", statusFilter);
  }, [statusFilter]);

  const viewTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const removeTeacher = async (id: string) => {
    const confirmDeactivate = window.confirm(
      "Are you seure you wamt to remove the teacher?"
    );

    if (!confirmDeactivate) return;

    try {
      await api.patch(`/admin/teacher/${id}/deactivate`);
      // Update UI instantly (no full reload)
      setTeachers((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: "inactive" } : t))
      );
      loadTeachers();
    } catch (err) {
      console.error("Failed to remove teacher", err);
      alert("Failed to remove teacher");
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    if (statusFilter === "all") return true;
    return teacher.status === statusFilter;
  });

  const counts = {
    all: teachers.length,
    active: teachers.filter((t) => t.status === "active").length,
    inactive: teachers.filter((t) => t.status === "inactive").length,
  };

  return (
    <div className="space-y-1 pb-8">
      {/* ===== Header Section ===== */}
      <div className="sticky top-0 z-20 bg-gray-100 py-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 py-2">Teachers</h2>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold shadow hover:bg-blue-700 hover:shadow-md transition"
            >
              + Add Teacher
            </button>
          )}
        </div>
      </div>

      {/* ===== Main Container ===== */}
      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
          {/* Teacher Count */}
          <div className="flex items-center justify-start gap-2">
            <p className="text-lg font-bold text-gray-700">Total Teachers</p>
            <span className="text-blue-700 px-3 text-xl font-bold">
              {teachers.length}
            </span>
          </div>

          <div className="flex justify-end">
            <div className="inline-flex bg-gray-100 rounded-full">
              {(["all", "active", "inactive"] as const).map((status) => {
                const isActive = statusFilter === status;

                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1 rounded-full text-sm font-semibold transition
          ${
            isActive
              ? "bg-green-600 text-white shadow"
              : "text-gray-600 hover:bg-gray-200"
          }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                    <span
                      className={`${
                        isActive ? "text-white/90" : "text-gray-400"
                      }`}
                    >
                      ({counts[status]})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teacher List */}
          {teachers.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-lg font-medium">No teachers added yet</p>
              <p className="text-sm mt-1">Click “Add Teacher” to get started</p>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 rounded-lg text-xs font-semibold text-gray-500 uppercase">
                <span>Teacher</span>
                <span>Email</span>
                <span>Joined</span>
                <span>Status</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Rows */}
              <ul className="divide-y border rounded-xl overflow-hidden mt-2">
                {filteredTeachers.map((teacher: any) => {
                  const initials =
                    teacher?.name?.charAt(0)?.toUpperCase() ?? "?";

                  return (
                    <li
                      key={teacher._id}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition"
                    >
                      {/* Teacher */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
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

                      {/* Email */}
                      <div className="text-sm text-gray-600 truncate">
                        {teacher.email}
                      </div>

                      {/* Joined */}
                      <div className="text-sm text-gray-600">
                        {teacher.createdAt
                          ? new Date(teacher.createdAt).toLocaleDateString(
                              "en-GB"
                            )
                          : "—"}
                      </div>

                      {/* Status */}
                      <span
                        className={`w-fit inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          teacher.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {teacher.status === "active" ? "Active" : "Inactive"}
                      </span>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => viewTeacher(teacher)}
                          className="px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                        >
                          View
                        </button>
                        <button
                          disabled={teacher.status === "inactive"}
                          onClick={() => removeTeacher(teacher._id)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                            teacher.status === "inactive"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Add Teacher Form */}
      {showForm && (
        <AddTeacherModal
          form={form}
          setForm={setForm}
          onSave={addTeacher}
          onClose={closeAddTeacher}
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
