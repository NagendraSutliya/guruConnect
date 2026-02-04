import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const StudentPanel = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const load = async () => {
    const res = await api.get("/students");
    setStudents(res.data.data);
  };

  const create = async () => {
    await api.post("/students", { name, classId, sectionId });
    setName("");
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Students</h2>

      {/* Add */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Section ID"
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
        />
        <button
          onClick={create}
          className="bg-purple-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Class</th>
              <th className="p-3">Section</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.classId?.name}</td>
                <td className="p-3">{s.sectionId?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPanel;
