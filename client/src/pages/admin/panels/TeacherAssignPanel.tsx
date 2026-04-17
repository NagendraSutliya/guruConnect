import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiChevronDown, FiEdit, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import type {
  Teacher,
  Assignment,
  FormState,
} from "../../../types/admin/teacherassignment";
import type { Class } from "../../../types/admin/class";
import type { Section } from "../../../types/admin/section";
import type { Subject } from "../../../types/admin/subject";
import UpdateTeacherAssignmentModal from "../../modals/admin/UpdateTeacherAssignmentModal";
import Toast from "../../../components/Toast";

const TeacherAssignPanel = () => {
  /** --------------------- State Variables --------------------- **/
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warn";
  } | null>(null);
  const [form, setForm] = useState<FormState>({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
  });
  const [subjectsForClass, setSubjectsForClass] = useState<Subject[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const showToast = (message: string, type: any = "info") => {
    setToast({ message, type });
  };

  /** --------------------- Load Data --------------------- **/
  const load = async () => {
    try {
      const [tRes, cRes, subRes, aRes] = await Promise.all([
        api.get("/admin/teachers?status=active"),
        api.get("/classes"),
        api.get("/subjects"),
        api.get("/admin/teacher-assign"),
      ]);

      setTeachers(tRes.data.data);
      setClasses(cRes.data.data);
      setSubjects(subRes.data.data);
      setAssignments(aRes.data.data);
    } catch (err) {
      console.log(err);
      showToast("Failed to load data ❌", "error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeTeachers = teachers.filter((t) => t.status === "active");

  /** --------------------- Dynamic Sections --------------------- **/
  useEffect(() => {
    if (!form.classId) {
      setSections([]);
      setSubjectsForClass([]);
      setForm((prev) => ({ ...prev, sectionId: "", subjectId: "" }));
      return;
    }

    const loadSectionsAndSubjects = async () => {
      try {
        // Sections
        const secRes = await api.get(`/sections/class/${form.classId}`);
        setSections(secRes.data.data);

        // Subkect for this class
        const subRes = await api.get(`/subjects/class/${form.classId}`);
        setSubjectsForClass(subRes.data.data);
        setForm((prev) => ({ ...prev, sectionId: "", subjectId: "" }));
      } catch (err) {
        console.log(err);
        setSubjectsForClass([]);
        setForm((prev) => ({ ...prev, sectionId: "", subjectId: "" }));
      }
    };

    loadSectionsAndSubjects();
  }, [form.classId]);

  /** --------------------- Assign Teacher --------------------- **/
  const assign = async () => {
    if (!form.teacherId || !form.classId || !form.subjectId) {
      showToast("Teacher, Class, and Subject are required", "warn");
      return;
    }

    try {
      setLoading(true);

      const payload: Partial<Assignment> = {
        teacherId: teachers.find((t) => t._id === form.teacherId),
        classId: classes.find((c) => c._id === form.classId),
        subjectId: subjects.find((s) => s._id === form.subjectId),
      };

      if (form.sectionId) {
        payload.sectionId =
          sections.find((s) => s._id === form.sectionId) || null;
      }

      if (editingAssignment) {
        await api.put(`/teacher-assign/${editingAssignment._id}`, payload);
        showToast("Assignment updated ✏️", "success");
        setEditingAssignment(null);
      } else {
        await api.post("/teacher-assign", payload);
        showToast("Teacher assigned successfully ✅", "success");
      }

      setForm({ teacherId: "", classId: "", sectionId: "", subjectId: "" });
      load();
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      showToast("Assignment failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  /** --------------------- Remove Assignment --------------------- **/
  const removeAssignment = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;

    try {
      await api.delete(`/teacher-assign/${id}`);
      showToast("Assignment deleted 🗑️", "success");
      load();
    } catch (err: any) {
      console.log(err);
      showToast(
        err.response?.data?.message || "Failed to delete assignment ❌",
        "error"
      );
    }
  };

  /** --------------------- Helper Functions --------------------- **/
  const getName = (
    field: Teacher | Class | Section | Subject | null | undefined
  ) => {
    if (!field) return "-";
    return field.name || "-";
  };

  /** --------------------- Filtered & Paginated Assignments --------------------- **/
  const filteredAssignments = assignments.filter((a) =>
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

  /** --------------------- Update Assignment --------------------- **/
  const updateAssignment = async () => {
    if (!editingAssignment) return;

    try {
      setLoading(true);

      const payload: Partial<Assignment> = {
        teacherId: teachers.find(
          (t) => t._id === editingAssignment.teacherId?._id
        ),
        classId: classes.find((c) => c._id === editingAssignment.classId?._id),
        subjectId: subjects.find(
          (s) => s._id === editingAssignment.subjectId?._id
        ),
      };

      if (editingAssignment.sectionId) {
        payload.sectionId =
          sections.find((s) => s._id === editingAssignment.sectionId?._id) ||
          null;
      }

      await api.put(`/teacher-assign/${editingAssignment._id}`, payload);
      showToast("Assignment updated ✏️", "success");
      setEditingAssignment(null);
      load();
    } catch (err) {
      console.log(err);
      showToast("Update failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  /** --------------------- Render --------------------- **/
  return (
    <div className="space-y-4 pb-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="sticky flex justify-between items-center top-0 z-20 bg-gray-100 py-1 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 py-2">
          Assign Teacher
        </h2>
      </div>

      {/* ASSIGN FORM */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="grid md:grid-cols-5 gap-4 items-end">
          {/* Teacher */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Teacher
            </label>
            <div className="relative">
              <select
                value={form.teacherId}
                onChange={(e) =>
                  setForm({ ...form, teacherId: e.target.value })
                }
                className="w-full border rounded-md p-2 pr-8 appearance-none shadow 
                        focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
              >
                <option value="">Select teacher</option>
                {activeTeachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Class */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Class
            </label>
            <div className="relative">
              <select
                value={form.classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                className="w-full border rounded-md p-2 pr-8 appearance-none shadow 
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

          {/* Section */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Section (Optional)
            </label>
            <div className="relative">
              <select
                value={form.sectionId}
                onChange={(e) =>
                  setForm({ ...form, sectionId: e.target.value })
                }
                className="w-full border rounded-md p-2 pr-8 appearance-none shadow 
                        focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
              >
                <option value="">All / No Section</option>
                {sections.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Subject
            </label>
            <div className="relative">
              <select
                value={form.subjectId}
                onChange={(e) =>
                  setForm({ ...form, subjectId: e.target.value })
                }
                className="w-full border rounded-md p-2 pr-8 appearance-none shadow 
                        focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
              >
                <option value="">Select subject</option>
                {subjectsForClass.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Button */}
          <div className="flex">
            <button
              disabled={!isValid || loading}
              onClick={assign}
              className="w-full bg-blue-600 text-sm lg:text-base text-white font-semibold px-3 py-1 lg:px-4 lg:py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Assign Teacher"}
            </button>
          </div>
        </div>
      </div>

      {/* ASSIGNMENT TABLE */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Teacher Assignments</h3>
          <div className="bg-white flex items-center border rounded-lg overflow-hidden shadow-sm">
            <FiSearch className="text-gray-400 ml-2" />
            <input
              placeholder="Search teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full border">
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
              {paginatedAssignments.map((a) => (
                <tr key={a._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{getName(a.teacherId)}</td>
                  <td className="p-3">{getName(a.classId)}</td>
                  <td className="p-3">
                    {getName(a.sectionId) || "All / No Section"}
                  </td>
                  <td className="p-3">{getName(a.subjectId)}</td>
                  <td className="p-3 flex justify-end gap-1">
                    <button
                      onClick={() => setEditingAssignment(a)}
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

      {/* EDIT MODAL */}
      {editingAssignment && (
        <UpdateTeacherAssignmentModal
          assignment={editingAssignment}
          teachers={teachers}
          classes={classes}
          sections={sections}
          subjects={subjects}
          loading={loading}
          onClose={() => setEditingAssignment(null)}
          onUpdate={setEditingAssignment} // updates state
          updateAssignment={updateAssignment} // pass API function
        />
      )}
    </div>
  );
};

export default TeacherAssignPanel;
