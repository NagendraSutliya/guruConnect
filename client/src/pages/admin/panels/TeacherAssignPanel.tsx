import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const TeacherAssignPanel = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
  });

  // Load teachers, classes, subjects, assignments
  const load = async () => {
    try {
      const [tRes, cRes, subRes, aRes] = await Promise.all([
        api.get("/admin/teachers"),
        api.get("/classes"),
        api.get("/subjects"),
        api.get("/teacher-assign"),
      ]);

      setTeachers(tRes.data.data);
      setClasses(cRes.data.data);
      setSubjects(subRes.data.data);
      setAssignments(aRes.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Load sections dynamically for selected class
  useEffect(() => {
    if (!form.classId) {
      setSections([]);
      setForm({ ...form, sectionId: "" });
      return;
    }

    const loadSections = async () => {
      try {
        const res = await api.get(`/sections/class/${form.classId}`);
        setSections(res.data.data);
        // Reset section selection if none
        setForm((prev) => ({ ...prev, sectionId: "" }));
      } catch (err) {
        setSections([]);
        setForm((prev) => ({ ...prev, sectionId: "" }));
        console.log(err);
      }
    };

    loadSections();
  }, [form.classId]);

  // Assign teacher
  const assign = async () => {
    // Required fields check
    if (!form.teacherId || !form.classId || !form.subjectId) {
      alert("Teacher, Class, and Subject are required");
      return;
    }

    try {
      setLoading(true);

      // Only include sectionId if it is truthy
      const payload: any = {
        teacherId: form.teacherId,
        classId: form.classId,
        subjectId: form.subjectId,
      };
      if (form.sectionId) payload.sectionId = form.sectionId;

      await api.post("/teacher-assign", payload);

      setForm({ teacherId: "", classId: "", sectionId: "", subjectId: "" });
      load();
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove assignment
  const removeAssignment = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;

    try {
      await api.delete(`/teacher-assign/${id}`);
      load();
    } catch (err: any) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Failed to delete assignment. Make sure the assignment exists."
      );
    }
  };

  // Helper to display names
  const getName = (field: any) => {
    if (!field) return "-";
    if (typeof field === "string") return field;
    return field.name || "-";
  };

  // Filtered assignments by teacher name
  const filteredAssignments = assignments.filter((a: any) =>
    getName(a.teacherId).toLowerCase().includes(search.toLowerCase())
  );

  const isValid = form.teacherId && form.classId && form.subjectId;

  return (
    <div className="space-y-8">
      {/* ASSIGN FORM */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Assign Teacher</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-600">Teacher</label>
            <select
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Class</label>
            <select
              value={form.classId}
              onChange={(e) => setForm({ ...form, classId: e.target.value })}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Section (Optional)</label>
            <select
              value={form.sectionId}
              onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">All / No Section</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Subject</label>
            <select
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            disabled={!isValid || loading}
            onClick={assign}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign Teacher"}
          </button>
        </div>
      </div>

      {/* ASSIGNMENT TABLE */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Teacher Assignments</h3>
          <input
            placeholder="Search teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Teacher</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Section</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No assignments found
                  </td>
                </tr>
              )}

              {filteredAssignments.map((a: any) => (
                <tr key={a._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{getName(a.teacherId)}</td>
                  <td className="p-3">{getName(a.classId)}</td>
                  <td className="p-3">
                    {getName(a.sectionId) || "All / No Section"}
                  </td>
                  <td className="p-3">{getName(a.subjectId)}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setForm({
                            teacherId: a.teacherId?._id,
                            classId: a.classId?._id,
                            sectionId: a.sectionId?._id || "",
                            subjectId: a.subjectId?._id,
                          })
                        }
                        className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
                      >
                        <FiEdit size={14} />
                      </button>

                      <button
                        onClick={() => removeAssignment(a._id)}
                        className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignPanel;
