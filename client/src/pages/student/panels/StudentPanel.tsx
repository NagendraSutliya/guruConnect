import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";

const StudentPanel = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------------- LOAD DATA ---------------- */

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students");
      setStudents(res.data.data);
    } catch {
      // alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    const res = await api.get("/classes");
    setClasses(res.data.data);
  };

  const loadSections = async (cid: string) => {
    if (!cid) return setSections([]);
    const res = await api.get(`/sections/class/${cid}`);
    setSections(res.data.data);
  };

  /* ---------------- CREATE ---------------- */

  const create = async () => {
    if (!name || !email || !classId || !sectionId) {
      return showToast("Fill all fields", "error");
    }

    try {
      setSaving(true);

      const res = await api.post("/admin/students", {
        name,
        email,
        classId,
        sectionId,
      });

      const creds = res.data.data;

      showToast(
        `Student Created ✅ | Email: ${creds.email} | Password: ${creds.password}`,
        "success"
      );

      setName("");
      setEmail("");
      setClassId("");
      setSectionId("");

      loadStudents();
    } catch {
      showToast("Failed to create student", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- STATUS TOGGLE ---------------- */

  const toggleStatus = async (id: string, active: boolean) => {
    try {
      if (active) {
        await api.patch(`/student/${id}/deactivate`);
      } else {
        await api.patch(`/student/${id}/activate`);
      }

      loadStudents();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  useEffect(() => {
    loadSections(classId);
  }, [classId]);

  /* ---------------- UI ---------------- */

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Students</h2>

      {/* Create Form */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-5 gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          <option value="">Select class</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
        >
          <option value="">Select section</option>
          {sections.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <button
          onClick={create}
          disabled={saving}
          className="bg-purple-600 text-white rounded font-semibold disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add Student"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-6 text-gray-500">No students found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Roll</th>
                <th className="p-3">Class</th>
                <th className="p-3">Section</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3 font-semibold">{s.rollNo}</td>
                  <td className="p-3">{s.classId?.name}</td>
                  <td className="p-3">{s.sectionId?.name}</td>

                  <td className="p-3">
                    {s.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleStatus(s._id, s.isActive)}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        s.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {s.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentPanel;
