import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

interface Student {
  _id: string;
  name: string;
  rollNo: number;
  present: boolean;
}

interface Assignment {
  _id: string;
  classId: { _id: string; name: string };
  sectionId: { _id: string; name: string };
  subjectId: { _id: string; name: string };
}

const AttendancePanel = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  /* -------------------- Load Teacher Assignments -------------------- */
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setLoadingAssignments(true);

        const res = await api.get("/teacher-assign/my");

        setAssignments(res.data.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load assignments");
      } finally {
        setLoadingAssignments(false);
      }
    };

    loadAssignments();
  }, []);

  /* -------------------- Load Students -------------------- */
  useEffect(() => {
    if (!selected) return;

    const loadStudents = async () => {
      try {
        setLoadingStudents(true);

        const res = await api.get(
          `/students/by-class?classId=${selected.classId._id}&sectionId=${selected.sectionId._id}`
        );

        const list: Student[] = res.data.data.map((s: any) => ({
          _id: s._id,
          name: s.name,
          rollNo: s.rollNo,
          present: true,
        }));

        setStudents(list);
      } catch (err) {
        console.error(err);
        alert("Failed to load students");
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, [selected]);

  /* -------------------- Toggle Attendance -------------------- */
  const toggle = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, present: !s.present } : s))
    );
  };

  /* -------------------- Mark All -------------------- */
  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, present: true })));
  };

  const markAllAbsent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, present: false })));
  };

  /* -------------------- Save Attendance -------------------- */
  const saveAttendance = async () => {
    if (!selected || students.length === 0) return;

    try {
      setSaving(true);

      await api.post("/attendance", {
        date,
        assignmentId: selected._id,
        records: students.map((s) => ({
          studentId: s._id,
          present: s.present,
        })),
      });

      alert("Attendance saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------- Reset Class -------------------- */
  const changeClass = () => {
    setSelected(null);
    setStudents([]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Attendance</h2>

      {/* Assignment Selector */}
      {!selected && (
        <>
          {loadingAssignments ? (
            <p>Loading classes...</p>
          ) : (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {assignments.map((a) => (
                <button
                  key={a._id}
                  onClick={() => setSelected(a)}
                  className="bg-white border p-4 rounded shadow hover:bg-purple-50"
                >
                  <p className="font-semibold">{a.classId?.name}</p>
                  <p>{a.sectionId?.name}</p>
                  <p className="text-sm text-gray-500">{a.subjectId?.name}</p>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Change Class */}
      {selected && (
        <button onClick={changeClass} className="text-sm text-purple-600 mb-4">
          ← Change Class
        </button>
      )}

      {/* Selected Class */}
      {selected && (
        <>
          <div className="bg-white p-4 rounded shadow mb-4 flex gap-4 items-center">
            <div>
              <p className="font-semibold">
                {selected.classId.name} — {selected.sectionId.name}
              </p>
              <p className="text-sm text-gray-500">{selected.subjectId.name}</p>
            </div>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Mark All Buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={markAllPresent}
              className="px-3 py-1 bg-green-100 text-green-700 rounded"
            >
              Mark All Present
            </button>

            <button
              onClick={markAllAbsent}
              className="px-3 py-1 bg-red-100 text-red-700 rounded"
            >
              Mark All Absent
            </button>
          </div>

          {/* Student List */}
          <div className="bg-white rounded shadow">
            {loadingStudents ? (
              <p className="p-4">Loading students...</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Roll</th>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s) => (
                    <tr
                      key={s._id}
                      className={`border-t ${!s.present ? "bg-red-50" : ""}`}
                    >
                      <td className="p-3">{s.rollNo}</td>

                      <td className="p-3">{s.name}</td>

                      <td className="p-3">
                        <button
                          onClick={() => toggle(s._id)}
                          className={`px-3 py-1 rounded text-sm font-semibold
                          ${
                            s.present
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {s.present ? "Present" : "Absent"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Save */}
          <button
            disabled={saving || students.length === 0}
            onClick={saveAttendance}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </>
      )}
    </div>
  );
};

export default AttendancePanel;
