import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const TeacherPanel = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loadTeachers = async () => {
    try {
      const res = await api.get("/admin/teachers");
      setTeachers(res.data);
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

  return (
    <div className="space-y-6">
      {/* ===== Header Section ===== */}
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

      {/* ===== Main Container ===== */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-6">
        {/* Teacher Count */}
        <div className="flex items-center justify-start gap-2">
          <p className="text-lg font-bold text-gray-700">Total Teachers</p>
          <span className="text-blue-700 px-3 text-xl font-bold">
            {teachers.length}
          </span>
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
              {teachers.map((teacher: any) => {
                const initials = teacher?.name?.charAt(0)?.toUpperCase() ?? "?";

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
                    <div>
                      <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition">
                        View
                      </button>
                      <button className="px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition">
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Add Teacher Form */}
        {showForm && (
          <div className="pt-6 border-t space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Add New Teacher
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={addTeacher}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Save Teacher
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPanel;
