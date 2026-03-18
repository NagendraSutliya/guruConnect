import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { FiTrash2, FiEdit } from "react-icons/fi";
import type { Section } from "../../../types/admin/section";
import type { Class } from "../../../types/admin/class";
import Toast from "../../../components/Toast";

const SectionsPanel = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
        await api.put(`/sections/${editingId}`, { name, classId });
        setToast({ message: "Section updated", type: "success" });
      } else {
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

  // --- Filtered and Paginated Sections ---
  const filteredSections = useMemo(() => {
    return sections.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.classId?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [sections, search]);

  const totalPages = Math.ceil(filteredSections.length / itemsPerPage);
  const paginatedSections = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSections.slice(start, start + itemsPerPage);
  }, [filteredSections, currentPage, itemsPerPage]);

  return (
    <div className="p-6 space-y-6">
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
            className="w-28 bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Sections Table */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Sections</h3>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-64 px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-green-100">
              <tr>
                <th className="p-3 text-sm font-medium text-gray-700">Class</th>
                <th className="p-3 text-sm font-medium text-gray-700">
                  Section
                </th>
                <th className="p-3 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedSections.length > 0 ? (
                paginatedSections.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="p-3">{s.classId?.name || "N/A"}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => editSection(s)}
                        className="text-yellow-600 hover:underline flex items-center gap-1"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => deleteSection(s._id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <FiTrash2 size={16} />
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
    </div>
  );
};

export default SectionsPanel;
