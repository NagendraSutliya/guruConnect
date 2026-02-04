import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const TeacherAssignPanel = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
  });

  const load = async () => {
    const t = await api.get("/teacher");
    const c = await api.get("/classes");
    const s = await api.get("/sections");
    const sub = await api.get("/subjects");

    setTeachers(t.data.data);
    setClasses(c.data.data);
    setSections(s.data.data);
    setSubjects(sub.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const assign = async () => {
    await api.post("/teacher-assign", form);
    alert("Assigned!");
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
    </div>
  );
};

export default TeacherAssignPanel;
