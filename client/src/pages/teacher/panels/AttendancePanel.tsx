import { useEffect, useState, useCallback } from "react";
import api from "../../../api/axiosInstance";
import Toast from "../../../components/Toast";
import type { ToastProps } from "../../../components/Toast";

interface Student {
  _id: string;
  name: string;
  rollNo: string;
  status: "pending" | "present" | "absent";
}

interface ClassAssignment {
  _id: string;
  classId: { _id: string; name: string };
  sectionId: { _id: string; name: string };
}

const AttendancePanel = () => {
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | "">("");
  const [selectedSectionId, setSelectedSectionId] = useState<string | "">("");
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

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

  // Load teacher class assignments
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

  // Load students
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

        const list: Student[] = res.data.data.map((s: any) => ({
          _id: s._id,
          name: s.name,
          rollNo: s.rollNo,
          status: attendanceMap[s._id] || "pending",
        }));

        setStudents(list);
        // Track initial attendance for change detection
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

  // Toggle attendance
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

  // Mark all
  const markAll = useCallback((status: "present" | "absent") => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  }, []);

  // Save attendance
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
    new Map(assignments.map((a) => [a.classId._id, a.classId])).values()
  );

  const sections = Array.from(
    new Map(
      assignments
        .filter((a) => a.classId._id === selectedClassId)
        .map((a) => [a.sectionId._id, a.sectionId])
    ).values()
  );

  const hasChanges = students.some(
    (s) => s.status !== initialAttendance[s._id]
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>

        {students.length > 0 && (
          <span className="bg-white shadow rounded-md p-2 text-sm font-semibold text-gray-500">
            Total Students: {students.length}
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg shadow-sm p-5 grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Class */}
        <div>
          <label className="block mb-1 font-semibold text-gray-600">
            Class
          </label>

          {loadingAssignments ? (
            <div className="text-sm text-gray-500 py-2">Loading classes...</div>
          ) : (
            <select
              className="border border-gray-300 focus:ring-2 focus:ring-green-400 p-2 rounded-md w-full"
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedSectionId("");
              }}
            >
              <option value="">Select Class</option>

              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Section */}
        <div>
          <label className="block mb-1 font-semibold text-gray-600">
            Section
          </label>

          <select
            className="border border-gray-300 focus:ring-2 focus:ring-green-400 p-2 rounded-md w-full"
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            disabled={!selectedClassId}
          >
            <option value="">Select Section</option>

            {sections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-semibold text-gray-600">Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 focus:ring-2 focus:ring-green-400 p-2 rounded-md w-full"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {loadingStudents ? (
          <div className="p-8 text-center text-gray-500">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm">Select class and section to load students</p>
          </div>
        ) : (
          <table className="w-full text-sm text-center border-collapse">
            <thead className="bg-green-50">
              <tr>
                <th className="p-4 pl-8 font-semibold text-gray-600 w-1/4">
                  Roll No
                </th>

                <th className="p-4 font-semibold text-gray-600 w-1/2">Name</th>

                <th className="p-4 pr-8 font-semibold text-gray-600 w-1/4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr
                  key={s._id}
                  className={`border-t hover:bg-gray-50 ${
                    s.status === "absent" ? "bg-red-50/40" : ""
                  }`}
                >
                  <td className="p-3 pl-8">{s.rollNo}</td>

                  <td className="p-3 font-medium text-gray-700">{s.name}</td>

                  <td className="p-3 pr-8">
                    <div className="flex items-center justify-center gap-3">
                      {/* Toggle */}
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Buttons */}
      {students.length > 0 && (
        <div className="flex flex-wrap justify-end gap-3 mt-5">
          <button
            onClick={() => markAll("present")}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            ✓ Mark All Present
          </button>

          <button
            onClick={() => markAll("absent")}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            ✕ Mark All Absent
          </button>

          <button
            onClick={saveAttendance}
            disabled={saving || !hasChanges}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "💾 Save Attendance"}
          </button>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AttendancePanel;
