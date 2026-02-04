import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

export default function MyAssignmentsPanel() {
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await api.get("/teacher-assign/my");
    setList(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">My Assignments</h2>

      {list.length === 0 && <p className="text-gray-500">No assignments yet</p>}

      {list.map((a: any) => (
        <div key={a._id} className="border rounded p-4 mb-3 shadow-sm">
          <p>
            <strong>Class:</strong> {a.classId?.name}
          </p>
          <p>
            <strong>Section:</strong> {a.sectionId?.name}
          </p>
          <p>
            <strong>Subject:</strong> {a.subjectId?.name}
          </p>
        </div>
      ))}
    </div>
  );
}
