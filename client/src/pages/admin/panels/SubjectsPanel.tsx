import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import { FiTrash2, FiEdit, FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import type { Subject } from "../../../types/admin/subject";
import type { Section } from "../../../types/admin/section";
import type { Class } from "../../../types/admin/class";
import Toast from "../../../components/Toast";
import UpdateSubjectModal from "../../modals/admin/UpdateSubjectModal";

const SubjectsPanel = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warn";
  } | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // --- Load classes and subjects ---
  const loadData = async () => {
    try {
      const cRes = await api.get("/admin/classes");
      setClasses(cRes.data.data);

      const sRes = await api.get("/admin/subjects");
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
        const res = await api.get(`/admin/sections/class/${selectedClass}`);
        setSections(res.data.data);
        setSelectedSection("");
      } catch {
        setSections([]);
      }
    };
    loadSections();
  }, [selectedClass]);

  const generateCode = (subjectName: string, className: string) => {
    const sub = subjectName
      .trim()
      .substring(0, 4)
      .toUpperCase()
      .replace(/\s+/g, "");
    const grade = className.match(/\d+/)?.[0] || "";
    return sub + grade;
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
      const selectedClassObj = classes.find((c) => c._id === selectedClass);
      if (!selectedClassObj) throw new Error("Class not found");

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
        await api.put(`/admin/subjects/${editId}`, payload);
        setToast({ message: "Subject updated successfully", type: "success" });
        setEditId(null);
      } else {
        await api.post("/admin/subjects", payload);
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

  // const editSubject = (s: Subject) => {
  //   setName(s.name);
  //   setSelectedClass(s.classId._id);
  //   setSelectedSection(s.sectionId?._id || "");
  //   setEditId(s._id);
  // };

  const editSubject = (s: Subject) => {
    setEditingSubject(s);
  };

  const deleteSubject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await api.delete(`/admin/subjects/${id}`);
      setToast({ message: "Subject deleted", type: "success" });
      loadData();
    } catch {
      setToast({ message: "Failed to delete subject", type: "error" });
    }
  };

  // --- Filtered and Paginated subjects ---
  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.classId?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.sectionId?.name || "All")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [subjects, search]);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubjects.slice(start, start + itemsPerPage);
  }, [filteredSubjects, currentPage, itemsPerPage]);

  return (
    <div className="space-y-4 pb-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type as any}
          onClose={() => setToast(null)}
        />
      )}
      <div className="sticky flex justify-between items-center top-0 z-20 bg-gray-100 py-1 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Subjects</h2>
      </div>

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Class
          </label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
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
            Section (Optional)
          </label>
          <div className="relative">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClass}
              className="w-full border rounded-md px-4 py-2 pr-8 appearance-none shadow 
              focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
            >
              <option value="">All Sections</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Subject Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter subject name"
            className="w-full border rounded-md shadow px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="md:self-end">
          <button
            onClick={saveSubject}
            className="w-fit bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editId ? "Loading..." : "Add Subject"}
          </button>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Subjects</h3>
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
                <th className="p-3 text-sm font-medium text-gray-700">#</th>
                <th className="p-3 text-sm font-medium text-gray-700">Class</th>
                <th className="p-3 text-sm font-medium text-gray-700">
                  Section
                </th>
                <th className="p-3 text-sm font-medium text-gray-700">Code</th>
                <th className="p-3 text-sm font-medium text-gray-700">
                  Subject Name
                </th>
                <th className="p-3 text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedSubjects.length > 0 ? (
                paginatedSubjects.map((s, idx) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="p-3 text-sm">{s.classId?.name || "N/A"}</td>
                    <td className="p-3 text-sm">
                      {s.sectionId?.name || "All"}
                    </td>
                    <td className="p-3 text-sm">{s.code}</td>
                    <td className="p-3 text-sm">{s.name}</td>
                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => editSubject(s)}
                        className="text-yellow-600 flex items-center gap-1"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => deleteSubject(s._id)}
                        className="text-red-600 flex items-center gap-1"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No subjects found
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
      {editingSubject && (
        <UpdateSubjectModal
          subject={editingSubject}
          classes={classes}
          sections={sections}
          onClose={() => setEditingSubject(null)}
          onUpdated={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default SubjectsPanel;
