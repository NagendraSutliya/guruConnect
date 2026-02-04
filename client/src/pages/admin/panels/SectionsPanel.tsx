import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const SectionsPanel = () => {
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");

  const load = async () => {
    const s = await api.get("/sections");
    const c = await api.get("/classes");
    setSections(s.data.data);
    setClasses(c.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await api.post("/sections", { name, classId });
    setName("");
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sections</h2>

      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Section name"
          className="border p-2"
        />
        <select
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2"
        >
          <option>Select class</option>
          {classes.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={create}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {sections.map((s: any) => (
        <div key={s._id} className="border p-2 mb-2">
          {s.name} - {s.classId?.name}
        </div>
      ))}
    </div>
  );
};

export default SectionsPanel;
