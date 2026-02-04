import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const AttendancePanel = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);

  // Load teacher assignments
  useEffect(() => {
    api.get("/teacher-assign/my").then((res) => {
      setAssignments(res.data.data);
    });
  }, []);

  // Load students when assignment selected
  useEffect(() => {
    if (!selected) return;

    api
      .get(
        `/students/by-class?classId=${selected.classId._id}&sectionId=${selected.sectionId._id}`
      )
      .then((res) => {
        const list = res.data.data.map((s: any) => ({
          ...s,
          present: true,
        }));
        setStudents(list);
      });
  }, [selected]);

  const toggle = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, present: !s.present } : s))
    );
  };

  const saveAttendance = async () => {
    await api.post("/attendance", {
      date,
      assignmentId: selected._id,
      records: students.map((s) => ({
        studentId: s._id,
        present: s.present,
      })),
    });

    alert("Attendance saved");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Attendance</h2>

      {/* Assignment selector */}
      {!selected && (
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

      {/* Selected class */}
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

          {/* Student list */}
          <div className="bg-white rounded shadow divide-y">
            {students.map((s) => (
              <div
                key={s._id}
                className="flex justify-between items-center p-3"
              >
                <p>{s.name}</p>

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
              </div>
            ))}
          </div>

          {/* Save */}
          <button
            onClick={saveAttendance}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded"
          >
            Save Attendance
          </button>
        </>
      )}
    </div>
  );
};

export default AttendancePanel;
