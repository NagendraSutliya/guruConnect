import { useEffect, useState, useCallback } from "react";
import api from "../../../api/axiosInstance";
import Toast from "../../../components/Toast";
import type { ToastProps } from "../../../components/Toast";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import type {
  AttendanceStudent,
  AttendanceClassAssignment,
} from "../../../types/teacher/types";

const AttendancePanel = () => {
  const [assignments, setAssignments] = useState<AttendanceClassAssignment[]>(
    []
  );
  const [selectedClassId, setSelectedClassId] = useState<string | "">("");
  const [selectedSectionId, setSelectedSectionId] = useState<string | "">("");
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialAttendance, setInitialAttendance] = useState<
    Record<string, "pending" | "present" | "absent">
  >({});

  const [toast, setToast] = useState<Omit<ToastProps, "onClose"> | null>(null);

  const showToast = (message: string, type: ToastProps["type"] = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setLoadingAssignments(true);
        const res = await api.get("/teacher-assign/my");
        setAssignments(res.data.data || []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load classes", "error");
      } finally {
        setLoadingAssignments(false);
      }
    };

    loadAssignments();
  }, []);

  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) {
      setStudents([]);
      return;
    }

    const loadStudents = async () => {
      try {
        setLoadingStudents(true);

        const res = await api.get("/student/by-class", {
          params: { classId: selectedClassId, sectionId: selectedSectionId },
        });

        const attendanceRes = await api.get("/attendance", {
          params: {
            classId: selectedClassId,
            sectionId: selectedSectionId,
            date,
          },
        });

        const attendanceMap: Record<string, "present" | "absent"> = {};
        attendanceRes.data.data.forEach((a: any) => {
          attendanceMap[a.studentId._id] = a.status;
        });

        const list: AttendanceStudent[] = res.data.data.map((s: any) => ({
          _id: s._id,
          name: s.name,
          rollNo: s.rollNo,
          status: attendanceMap[s._id] || "pending",
        }));

        setStudents(list);

        const initialMap: Record<string, "pending" | "present" | "absent"> = {};
        list.forEach((s) => {
          initialMap[s._id] = s.status;
        });
        setInitialAttendance(initialMap);
      } catch (err) {
        console.error(err);
        showToast("Failed to load students", "error");
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, [selectedClassId, selectedSectionId, date]);

  const toggleAttendance = useCallback((id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s._id !== id) return s;
        if (s.status === "pending") return { ...s, status: "present" };
        if (s.status === "present") return { ...s, status: "absent" };
        return { ...s, status: "present" };
      })
    );
  }, []);

  const markAll = useCallback((status: "present" | "absent") => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  }, []);

  const saveAttendance = async () => {
    if (!selectedClassId || !selectedSectionId || students.length === 0) return;

    try {
      setSaving(true);

      await api.post("/attendance", {
        classId: selectedClassId,
        sectionId: selectedSectionId,
        date,
        records: students.map((s) => ({
          studentId: s._id,
          status: s.status,
        })),
      });

      showToast("Attendance saved successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  const classes = Array.from(
    new Map(
      assignments
        .filter((a) => a.classId && a.classId._id)
        .map((a) => [a.classId._id, a.classId])
    ).values()
  );

  const sections = Array.from(
    new Map(
      assignments
        .filter(
          (a) => a.classId && a.sectionId && a.classId._id === selectedClassId
        )
        .map((a) => [a.sectionId._id, a.sectionId])
    ).values()
  );

  const hasChanges = students.some(
    (s) => s.status !== initialAttendance[s._id]
  );

  const filteredStudents = students.filter(
    (s) =>
      (s.rollNo ?? "")
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (s.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-100 py-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
          <h2 className="text-2xl font-bold mb-4">Attendance</h2>

          <div className="mt-4">
            <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-lg font-medium shadow-sm">
              Total Students: {students.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Class
          </label>
          {loadingAssignments ? (
            <div className="text-gray-500 py-2">Loading classes...</div>
          ) : (
            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedSectionId("");
                }}
                className="border p-2 rounded-lg shadow-md w-full appearance-none"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Section */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Section
          </label>
          <div className="relative">
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              disabled={!selectedClassId}
              className="border p-2 rounded-lg shadow-md w-full appearance-none"
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-2 py-1.5 rounded-lg shadow-md w-full appearance-none"
          />
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 pt-4 space-y-4">
        {/* Header and Search */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Results</h3>

          <div className="bg-white flex items-center border rounded-lg overflow-hidden shadow">
            <FiSearch className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search student..."
              className="flex-grow px-2 py-1 outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FiX
              className={`text-gray-400 cursor-pointer mr-2 ${
                search ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSearch("")}
            />
          </div>
        </div>

        {/* Table */}
        {/* Students Table */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          {loadingStudents ? (
            <div className="p-10 text-center text-gray-500">
              Loading students...
            </div>
          ) : (
            <table className="w-full text-sm text-center border-collapse">
              <thead className="bg-green-50">
                <tr>
                  <th className="p-4 pl-8 font-semibold text-gray-600 w-1/4">
                    Roll No
                  </th>
                  <th className="p-4 font-semibold text-gray-600 w-1/2">
                    Name
                  </th>
                  <th className="p-4 pr-8 font-semibold text-gray-600 w-1/4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {!selectedClassId || !selectedSectionId ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-gray-500">
                      Select class and section to load students
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-gray-500">
                      No students found for this class and section
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => (
                    <tr
                      key={s._id}
                      className={`border-t hover:bg-gray-50 ${
                        s.status === "absent" ? "bg-red-50/40" : ""
                      }`}
                    >
                      <td className="p-3 pl-8">{s.rollNo}</td>
                      <td className="p-3 font-medium text-gray-700">
                        {s.name}
                      </td>
                      <td className="p-3 pr-8">
                        <div className="flex items-center justify-center gap-3">
                          <div
                            onClick={() => toggleAttendance(s._id)}
                            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors
              ${
                s.status === "present"
                  ? "bg-green-500"
                  : s.status === "absent"
                  ? "bg-red-400"
                  : "bg-gray-300"
              }`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all
                ${s.status === "present" ? "right-1" : "left-1"}`}
                            ></span>
                          </div>
                          <span
                            className={`text-sm font-semibold
              ${
                s.status === "present"
                  ? "text-green-600"
                  : s.status === "absent"
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
                          >
                            {s.status === "present"
                              ? "Present"
                              : s.status === "absent"
                              ? "Absent"
                              : "Not Marked"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-4 flex-wrap gap-2">
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
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
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
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {students.length > 0 && (
        <div className="flex flex-wrap justify-end gap-3 mt-5">
          <button
            onClick={() => markAll("present")}
            className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            ✓ Mark All Present
          </button>
          <button
            onClick={() => markAll("absent")}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            ✕ Mark All Absent
          </button>
          <button
            onClick={saveAttendance}
            disabled={saving || !hasChanges}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "💾 Save Attendance"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendancePanel;
