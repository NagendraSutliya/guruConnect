import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const StudentPanel = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/students");
      setStudents(res.data.data);
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

  const create = async () => {
    if (!name || !email || !classId) {
      setFormError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const payload: any = { name, email, classId };
      if (sectionId) payload.sectionId = sectionId;

      const res = await api.post("/admin/student", payload);

      const creds = res.data.data;

      alert(`Student Created ✅
                Email: ${creds.email}
                Password: ${creds.password}
                ⚠ Save this password now`);

      setName("");
      setEmail("");
      setClassId("");
      setSectionId("");
      setShowModal(false);

      loadStudents();
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: string, active: boolean) => {
    try {
      if (active) {
        await api.patch(`/admin/student/${id}/deactivate`);
      } else {
        await api.patch(`/admin/student/${id}/activate`);
      }

      loadStudents();
    } catch {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  useEffect(() => {
    loadSections(classId);
  }, [classId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Students</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow font-semibold"
        >
          + Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No students found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Roll</th>
                <th className="p-4 text-left">Class</th>
                <th className="p-4 text-left">Section</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4 text-gray-600">{s.email}</td>
                  <td className="p-4 font-semibold">{s.rollNo}</td>
                  <td className="p-4">{s.classId?.name}</td>
                  <td className="p-4">{s.sectionId?.name}</td>

                  <td className="p-4 text-center">
                    {s.isActive ? (
                      <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleStatus(s._id, s.isActive)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold text-white transition ${
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px] space-y-4">
            <h3 className="text-lg font-semibold">Add Student</h3>

            {formError && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md border border-red-200">
                {formError}
              </div>
            )}
            <input
              className="border w-full p-2 rounded"
              placeholder="Student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="border w-full p-2 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <select
              className="border w-full p-2 rounded"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setSectionId("");
              }}
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

            <div className="flex justify-between gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={create}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                {saving ? "Creating..." : "Create Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPanel;
