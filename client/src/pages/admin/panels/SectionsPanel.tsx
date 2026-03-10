import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiTrash2, FiEdit } from "react-icons/fi";
import type { Section } from "../../../types/section";
import type { Class } from "../../../types/class";
import Toast from "../../../components/admin/Toast";

const SectionsPanel = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null); // Track section being edited

  // --- Load Sections & Classes ---
  const load = async () => {
    try {
      const [s, c] = await Promise.all([
        api.get("/sections"),
        api.get("/classes"),
      ]);
      setSections(s.data.data);
      setClasses(c.data.data);
    } catch {
      setToast({ message: "Failed to load data", type: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  // --- Create / Update Section ---
  const saveSection = async () => {
    if (!name || !classId) {
      setToast({
        message: "Class and Section name are required",
        type: "warn",
      });
      return;
    }

    try {
      if (editingId) {
        // Update section
        await api.put(`/sections/${editingId}`, { name, classId });
        setToast({ message: "Section updated", type: "success" });
      } else {
        // Create section
        await api.post("/sections", { name, classId });
        setToast({ message: "Section created", type: "success" });
      }
      setName("");
      setClassId("");
      setEditingId(null);
      load();
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || "Failed to save section",
        type: "error",
      });
    }
  };

  // --- Edit Section ---
  const editSection = (section: Section) => {
    setName(section.name);
    setClassId(section.classId?._id || "");
    setEditingId(section._id);
  };

  // --- Delete Section ---
  const deleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await api.delete(`/sections/${id}`);
      setToast({ message: "Section deleted", type: "success" });
      if (editingId === id) {
        setEditingId(null);
        setName("");
        setClassId("");
      }
      load();
    } catch {
      setToast({ message: "Failed to delete section", type: "error" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-2xl font-bold text-gray-800">Sections</h2>

      {/* Form */}
      <div className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Class
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
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
            Section Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter section name"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="md:self-end">
          <button
            onClick={saveSection}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Sections Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-700">Class</th>
              <th className="p-3 text-sm font-medium text-gray-700">Section</th>
              <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sections.length > 0 ? (
              sections.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="p-3">{s.classId?.name || "N/A"}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => editSection(s)}
                      className="text-yellow-600 hover:underline flex items-center gap-1"
                    >
                      <FiEdit size={16} />
                      {/* Edit */}
                    </button>
                    <button
                      onClick={() => deleteSection(s._id)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                    >
                      <FiTrash2 size={16} />
                      {/* Delete */}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-3 text-center text-gray-500">
                  No sections found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionsPanel;
