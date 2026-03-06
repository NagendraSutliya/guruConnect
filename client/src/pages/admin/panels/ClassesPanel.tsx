import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const ClassesPanel = () => {
  const [classes, setClasses] = useState([]);
  const [academicYearId, setAcademicYearId] = useState("");
  const [name, setName] = useState("");

  const [years, setYears] = useState([]);

  useEffect(() => {
    api
      .get("/academic/academic-year")
      .then((res) => setYears(res.data.data))
      .catch((err) => console.log(err.response?.data));
  }, []);

  const load = async () => {
    const res = await api.get("/classes");
    setClasses(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name || !academicYearId) {
      alert("All fields required");
      return;
    }

    try {
      await api.post("/classes", { name, academicYearId });
      setName("");
      load();
    } catch (err: any) {
      console.log(err.response?.data);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Classes</h2>

      <div className="flex gap-2 mb-6">
        <select
          value={academicYearId}
          onChange={(e) => setAcademicYearId(e.target.value)}
          className="border p-2"
        >
          <option value="">Select academic year</option>
          {years.map((y: any) => (
            <option key={y._id} value={y._id}>
              {y.name}
            </option>
          ))}
        </select>

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
