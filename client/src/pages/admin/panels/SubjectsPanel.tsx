import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const SubjectsPanel = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await api.get("/subjects");
    setSubjects(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await api.post("/subjects", { name });
    setName("");
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Subjects</h2>

      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Subject name"
          className="border p-2"
        />
        <button
          onClick={create}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {subjects.map((s: any) => (
        <div key={s._id} className="border p-2 mb-2">
          {s.name}
        </div>
      ))}
    </div>
  );
};

export default SubjectsPanel;
