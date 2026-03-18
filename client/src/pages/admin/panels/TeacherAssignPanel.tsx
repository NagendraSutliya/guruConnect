import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const TeacherAssignPanel = () => {
  /** --------------------- State Variables --------------------- **/
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

  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  /** --------------------- Load Data --------------------- **/
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

  /** --------------------- Dynamic Sections --------------------- **/
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
        setForm((prev) => ({ ...prev, sectionId: "" }));
      } catch (err) {
        console.log(err);
        setSections([]);
        setForm((prev) => ({ ...prev, sectionId: "" }));
      }
    };

    loadSections();
  }, [form.classId]);

  /** --------------------- Assign Teacher --------------------- **/
  const assign = async () => {
    if (!form.teacherId || !form.classId || !form.subjectId) {
      alert("Teacher, Class, and Subject are required");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        teacherId: form.teacherId,
        classId: form.classId,
        subjectId: form.subjectId,
      };
      if (form.sectionId) payload.sectionId = form.sectionId;

      // await api.post("/teacher-assign", payload);
      if (editingAssignment) {
        await api.put(`/teacher-assign/${editingAssignment._id}`, payload);
        setEditingAssignment(null); // reset after update
      } else {
        await api.post("/teacher-assign", payload);
      }

      setForm({ teacherId: "", classId: "", sectionId: "", subjectId: "" });
      load();
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** --------------------- Remove Assignment --------------------- **/
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

  /** --------------------- Helper Functions --------------------- **/
  const getName = (field: any) => {
    if (!field) return "-";
    if (typeof field === "string") return field;
    return field.name || "-";
  };

  /** --------------------- Filtered & Paginated Assignments --------------------- **/
  const filteredAssignments = assignments.filter((a: any) =>
    getName(a.teacherId).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /** Reset page when search or itemsPerPage changes **/
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const isValid = form.teacherId && form.classId && form.subjectId;

  /** --------------------- Render --------------------- **/
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 py-2">
          Assign Teacher
        </h2>
      </div>
      {/* ASSIGN FORM */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Teacher */}
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

          {/* Class */}
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

          {/* Section */}
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

          {/* Subject */}
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
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign Teacher"}
          </button>
        </div>
      </div>

      {/* ASSIGNMENT TABLE */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Teacher Assignments</h3>
          <input
            placeholder="Search teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded p-2 text-sm"
          />
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm border">
            <thead className="bg-green-100 text-xs font-semibold text-gray-700 uppercase text-left">
              <tr>
                <th className="p-3">Teacher</th>
                <th className="p-3">Class</th>
                <th className="p-3">Section</th>
                <th className="p-3">Subject</th>
                <th className="pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssignments.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    No assignments found
                  </td>
                </tr>
              )}

              {paginatedAssignments.map((a: any) => (
                <tr key={a._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{getName(a.teacherId)}</td>
                  <td className="p-3">{getName(a.classId)}</td>
                  <td className="p-3">
                    {getName(a.sectionId) || "All / No Section"}
                  </td>
                  <td className="p-3">{getName(a.subjectId)}</td>
                  <td className="p-3 mr-4 flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setForm({
                          teacherId: a.teacherId?._id,
                          classId: a.classId?._id,
                          sectionId: a.sectionId?._id || "",
                          subjectId: a.subjectId?._id,
                        }),
                          setEditingAssignment(a); // <-- track the assignment being edited
                      }}
                      className="text-yellow-600 p-1 rounded hover:bg-yellow-50"
                    >
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => removeAssignment(a._id)}
                      className="text-red-600 p-1 rounded hover:bg-red-50"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-2">
          <div>
            <label className="mr-2 text-gray-700 text-sm">
              Items per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
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

export default TeacherAssignPanel;
