import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const AssignmentSelector = ({ onSelect }: any) => {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    api.get("/teacher-assign/my").then((res) => setList(res.data.data));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {list.map((a) => (
        <button
          key={a._id}
          onClick={() => onSelect(a)}
          className="bg-white border p-4 rounded shadow hover:bg-purple-50"
        >
          <p className="font-semibold">{a.classId?.name}</p>
          <p>{a.sectionId?.name}</p>
          <p className="text-sm text-gray-500">{a.subjectId?.name}</p>
        </button>
      ))}
    </div>
  );
};

export default AssignmentSelector;
