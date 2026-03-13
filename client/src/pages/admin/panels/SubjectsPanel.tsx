import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiTrash2, FiEdit } from "react-icons/fi";
import type { Subject } from "../../../types/subject";
import type { Section } from "../../../types/section";
import type { Class } from "../../../types/class";
import Toast from "../../../components/Toast";

// --- SubjectsPanel ---
const SubjectsPanel = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );

  // --- Load classes and subjects ---
  const loadData = async () => {
    try {
      const cRes = await api.get("/classes");
      setClasses(cRes.data.data);

      const sRes = await api.get("/subjects");
      setSubjects(sRes.data.data);
    } catch (err: any) {
      setToast({
        message: err.response?.data || "Failed to load data",
        type: "error",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Load sections when class changes ---
  useEffect(() => {
    const loadSections = async () => {
      if (!selectedClass) {
        setSections([]);
        setSelectedSection("");
        return;
      }
      try {
        const res = await api.get(`/sections/class/${selectedClass}`);
        setSections(res.data.data);
        setSelectedSection("");
      } catch {
        setSections([]);
      }
    };
    loadSections();
  }, [selectedClass]);

  const generateCode = (subjectName: string, className: string) => {
    // Take first 4 letters of subject, uppercase, remove spaces
    const sub = subjectName
      .trim()
      .substring(0, 4)
      .toUpperCase()
      .replace(/\s+/g, "");

    // Take digits from class name (e.g., "Grade 10" -> 10)
    const grade = className.match(/\d+/)?.[0] || "";

    return sub + grade; // e.g., "MATH10"
  };

  // --- Create or Update Subject ---
  const saveSubject = async () => {
    if (!name.trim() || !selectedClass) {
      setToast({
        message: "Subject name and class are required",
        type: "warn",
      });
      return;
    }

    try {
      // Find selected class object
      const selectedClassObj = classes.find((c) => c._id === selectedClass);
      if (!selectedClassObj) throw new Error("Class not found");

      // Auto-generate code for new subject
      const generatedCode = editId
        ? subjects.find((s) => s._id === editId)?.code || ""
        : generateCode(name, selectedClassObj.name);

      const payload = {
        name,
        code: generatedCode,
        classId: selectedClass,
        sectionId: selectedSection || undefined,
      };

      if (editId) {
        await api.put(`/subjects/${editId}`, payload);
        setToast({ message: "Subject updated successfully", type: "success" });
        setEditId(null);
      } else {
        await api.post("/subjects", payload);
        setToast({
          message: `Subject created with code ${generatedCode}`,
          type: "success",
        });
      }

      setName("");
      setSelectedClass("");
      setSelectedSection("");
      loadData();
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || "Operation failed",
        type: "error",
      });
    }
  };

  // --- Edit subject ---
  const editSubject = (s: Subject) => {
    setName(s.name);
    setSelectedClass(s.classId._id);
    setSelectedSection(s.sectionId?._id || "");
    setEditId(s._id);
  };

  // --- Delete subject ---
  const deleteSubject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      setToast({ message: "Subject deleted", type: "success" });
      loadData();
    } catch {
      setToast({ message: "Failed to delete subject", type: "error" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-2xl font-bold text-gray-800">Subjects</h2>

      {/* Form */}
      <div className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Section (Optional)
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedClass}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Sections</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Subject Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter subject name"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="md:self-end">
          <button
            onClick={saveSubject}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            {editId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200 text-center">
          <thead className="bg-green-50">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-700">#</th>
              <th className="p-3 text-sm font-medium text-gray-700">Class</th>
              <th className="p-3 text-sm font-medium text-gray-700">Section</th>
              <th className="p-3 text-sm font-medium text-gray-700">Code</th>
              <th className="p-3 text-sm font-medium text-gray-700">
                Subject Name
              </th>
              <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subjects.length > 0 ? (
              subjects.map((s, idx) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{s.classId.name}</td>
                  <td className="p-3">{s.sectionId?.name || "All"}</td>
                  <td className="p-3">{s.code}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => editSubject(s)}
                      className="text-yellow-600 flex items-center gap-1"
                    >
                      <FiEdit size={16} />
                      {/* Edit */}
                    </button>
                    <button
                      onClick={() => deleteSubject(s._id)}
                      className="text-red-600 flex items-center gap-1"
                    >
                      <FiTrash2 size={16} />
                      {/* Delete */}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No subjects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectsPanel;
