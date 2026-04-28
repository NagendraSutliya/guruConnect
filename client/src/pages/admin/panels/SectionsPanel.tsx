import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { FiTrash2, FiEdit, FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import Toast from "../../../components/Toast";
import type { Section } from "../../../types/admin/section";
import type { Class } from "../../../types/admin/class";
import UpdateSectionModal from "../../modals/admin/UpdateSectionModal";

const SectionsPanel = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [toastMessage, setToastMessage] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  // Create new section
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Edit modal
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const showToast = (message: string, type: string = "info") =>
    setToastMessage({ message, type });

  // Load sections and classes
  const load = async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        api.get("/admin/sections"),
        api.get("/admin/classes"),
      ]);
      setSections(s.data.data);
      setClasses(c.data.data);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddSection = async () => {
    if (!name || !classId) {
      showToast("Class and Section name are required", "warn");
      return;
    }

    try {
      await api.post("/admin/sections", { name, classId });
      showToast("Section created successfully", "success");
      setName("");
      setClassId("");
      load();
    } catch {
      showToast("Failed to create section", "error");
    }
  };

  // Delete section
  const deleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await api.delete(`/admin/sections/${id}`);
      showToast("Section deleted", "success");
      load();
    } catch {
      showToast("Failed to delete section", "error");
    }
  };

  // Edit handler
  const editSection = (section: Section) => setEditingSection(section);

  // Filter & paginate
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
    <div className="space-y-4 pb-8">
      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type as any}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="sticky flex justify-between items-center top-0 z-20 bg-gray-100 py-1 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Sections</h2>
      </div>

      {/* Add Section Form */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Class
          </label>
          <div className="relative">
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full border rounded-md px-4 py-2 pr-8 appearance-none shadow 
              focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Section Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter section name"
            className="w-full border rounded-md shadow px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="md:self-end">
          <button
            onClick={handleAddSection}
            className="w-fit bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Loading..." : "Add Section"}
          </button>
        </div>
      </div>

      {/* Sections Table */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Sections</h3>
          <div className="bg-white flex items-center border rounded-lg overflow-hidden shadow">
            <FiSearch className="text-gray-400 ml-2" />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm outline-none"
            />
            <FiX
              className={`text-gray-400 cursor-pointer mr-2 ${
                search ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSearch("")}
            />
          </div>
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
                  <td colSpan={3} className="p-6 text-center text-gray-500">
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

      {/* Edit Section Modal */}
      {editingSection && (
        <UpdateSectionModal
          section={editingSection}
          classes={classes}
          onClose={() => setEditingSection(null)}
          onUpdated={load} // reload sections & classes
        />
      )}
    </div>
  );
};

export default SectionsPanel;
