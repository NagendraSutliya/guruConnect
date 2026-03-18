import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Toast from "../../../components/Toast";
import type { AcademicYear } from "../../../types/admin/academicYear";
import type { Class } from "../../../types/admin/class";
import type { Section } from "../../../types/admin/section";

const ClassesPanel = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [academicYearId, setAcademicYearId] = useState("");
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load academic years
  useEffect(() => {
    api
      .get("/academic/academic-year")
      .then((res) => {
        setYears(res.data.data);
        const activeYear = res.data.data.find((y: any) => y.isActive);
        if (activeYear) setAcademicYearId(activeYear._id);
      })
      .catch((err) => console.log(err.response?.data));
  }, []);

  // Load classes
  const loadClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Load sections
  const loadSections = async () => {
    try {
      const res = await api.get("/sections");
      setSections(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadClasses();
    loadSections();
  }, []);

  // Create or update class
  const handleSubmit = async () => {
    if (!name || !academicYearId) {
      setToast({ message: "All fields required", type: "warn" });
      return;
    }

    try {
      if (editId) {
        await api.put(`/classes/${editId}`, { name, academicYearId });
        setToast({ message: "Class updated successfully", type: "success" });
      } else {
        await api.post("/classes", { name, academicYearId });
        setToast({ message: "Class created successfully", type: "success" });
      }

      setName("");
      setEditId(null);
      loadClasses();
      loadSections();
    } catch (err: any) {
      console.log(err.response?.data);
      setToast({ message: "Operation failed", type: "error" });
    }
  };

  // Delete class
  const deleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await api.delete(`/classes/${id}`);
      setToast({ message: "Class deleted", type: "success" });
      loadClasses();
      loadSections();
    } catch {
      setToast({ message: "Failed to delete class", type: "error" });
    }
  };

  // Edit class
  const editClass = (cls: Class) => {
    setName(cls.name);
    setAcademicYearId(cls.academicYearId?._id || "");
    setEditId(cls._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter classes by search
  const filteredClasses = useMemo(() => {
    return classes.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.academicYearId?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [classes, search]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredClasses.slice(start, end);
  }, [filteredClasses, currentPage, itemsPerPage]);

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          onClose={() => setToast(null)}
        />
      )}

      <h2 className="text-2xl font-bold text-gray-800">Classes</h2>

      {/* Form */}
      <div className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Academic Year
          </label>
          <select
            value={academicYearId}
            onChange={(e) => setAcademicYearId(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select academic year</option>
            {years.map((y) => (
              <option key={y._id} value={y._id}>
                {y.name} {y.isActive ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Class Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter class name"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="md:self-end">
          <button
            onClick={handleSubmit}
            className="w-28 bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {editId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Classes</h3>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="w-64 px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead className="bg-green-100 text-xs font-semibold text-gray-700 uppercase">
              <tr>
                <th className="p-3 text-left">Academic Year</th>
                <th className="p-3 text-left">Class Name</th>
                <th className="p-3 text-center">Sections</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClasses.length > 0 ? (
                paginatedClasses.map((c) => {
                  const classSections = sections.filter(
                    (s) => s.classId?._id === c._id
                  );

                  return (
                    <tr key={c._id} className="border-t hover:bg-gray-50">
                      {/* Academic Year */}
                      <td className="p-3">{c.academicYearId?.name}</td>

                      {/* Class Name */}
                      <td className="p-3">{c.name}</td>

                      {/* Sections */}
                      <td className="p-3">
                        {classSections.length > 0 ? (
                          <div className="flex flex-wrap justify-center gap-1 w-full">
                            {classSections.map((s) => (
                              <span
                                key={s._id}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="text-gray-400 text-sm">
                              No sections
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 flex justify-end gap-2">
                        <button
                          onClick={() => editClass(c)}
                          className="text-yellow-600 hover:underline flex items-center gap-1"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteClass(c._id)}
                          className="text-red-600 hover:underline flex items-center gap-1"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    No classes found
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

export default ClassesPanel;
