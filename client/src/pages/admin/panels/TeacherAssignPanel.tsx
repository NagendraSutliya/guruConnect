import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const TeacherAssignPanel = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
  });

  const load = async () => {
    const t = await api.get("/admin/teachers");
    const c = await api.get("/classes");
    const s = await api.get("/sections");
    const sub = await api.get("/subjects");
    const a = await api.get("/teacher-assign");

    setTeachers(t.data.data);
    setClasses(c.data.data);
    setSections(s.data.data);
    setSubjects(sub.data.data);
    setAssignments(a.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const assign = async () => {
    await api.post("/teacher-assign", form);
    alert("Assigned!");
    load();
  };

  const getName = (field: any) => {
    if (!field) return "-";
    if (typeof field === "string") return field;
    return field.name || "-";
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Teacher Assignment</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
        >
          <option>Select teacher</option>
          {teachers.map((t: any) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <select onChange={(e) => setForm({ ...form, classId: e.target.value })}>
          <option>Select class</option>
          {classes.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
        >
          <option>Select section</option>
          {sections.map((s: any) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
        >
          <option>Select subject</option>
          {subjects.map((s: any) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={assign}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Assign Teacher
      </button>

      <h3 className="text-lg font-semibold mt-8 mb-2">Assigned Teachers</h3>

      <table className="w-full border rounded">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Teacher</th>
            <th className="p-2">Class</th>
            <th className="p-2">Section</th>
            <th className="p-2">Subject</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a: any) => (
            <tr key={a._id} className="border-t">
              <td className="p-2">{getName(a.teacherId)}</td>
              <td className="p-2">{getName(a.classId)}</td>
              <td className="p-2">{getName(a.sectionId)}</td>
              <td className="p-2">{getName(a.subjectId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherAssignPanel;
