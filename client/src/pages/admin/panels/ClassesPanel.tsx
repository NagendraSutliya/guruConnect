import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Toast from "../../../components/Toast";
import type { AcademicYear } from "../../../types/academicYear";
import type { Class } from "../../../types/class";
import type { Section } from "../../../types/section";

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

  // Load sections (populate classId)
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

  // Create or Update class
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
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            {editId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Classes table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50 text-center">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-700">
                Academic Year
              </th>
              <th className="p-3 text-sm font-medium text-gray-700">
                Class Name
              </th>
              <th className="p-3 text-sm font-medium text-gray-700">
                Sections
              </th>
              <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center">
            {classes.length > 0 ? (
              classes.map((c) => {
                const classSections = sections.filter(
                  (s) => s.classId?._id === c._id
                );
                // .map((s) => s.name);

                return (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="p-3">{c.academicYearId?.name}</td>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">
                      {classSections.length > 0 ? (
                        <div className="flex justify-center flex-wrap gap-1">
                          {classSections.map((s) => (
                            <span
                              key={s._id} // use unique _id
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No sections
                        </span>
                      )}
                    </td>
                    <td className="p-3 flex justify-center space-x-2">
                      <button
                        onClick={() => editClass(c)}
                        className="text-yellow-600 hover:underline flex items-center gap-1"
                      >
                        <FiEdit size={16} />
                        {/* Edit */}
                      </button>
                      <button
                        onClick={() => deleteClass(c._id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <FiTrash2 size={16} />
                        {/* Delete */}
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
    </div>
  );
};

export default ClassesPanel;
