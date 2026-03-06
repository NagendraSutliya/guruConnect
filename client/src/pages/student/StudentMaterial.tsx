import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const StudentMaterial = () => {
  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      const res = await api.get("/teacher/material/student");
      setMaterials(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Study Materials</h1>

      <div className="grid grid-cols-3 gap-4">
        {materials.length === 0 && (
          <p className="text-gray-500">No materials uploaded</p>
        )}

        {materials.map((m, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="font-semibold">{m.title}</h3>

            <p className="text-sm text-gray-500 mt-1">Subject: {m.subject}</p>

            <a
              href={m.fileUrl}
              target="_blank"
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentMaterial;
