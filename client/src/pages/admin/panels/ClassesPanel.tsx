import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const ClassesPanel = () => {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await api.get("/classes");
    setClasses(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await api.post("/classes", { name });
    setName("");
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Classes</h2>

      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Class name"
          className="border p-2"
        />
        <button
          onClick={create}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {classes.map((c: any) => (
        <div key={c._id} className="border p-2 mb-2">
          {c.name}
        </div>
      ))}
    </div>
  );
};

export default ClassesPanel;
