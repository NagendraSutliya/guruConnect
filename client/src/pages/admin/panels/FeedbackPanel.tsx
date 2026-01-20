import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const FeedbackPanel = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    api
      .get("/admin/feedback", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("adminToken"),
        },
      })
      .then((r) => setList(r.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Feedback</h2>
      {list.length === 0 && (
        <div className="bg-white border rounded-xl shadow-sm text-center text-gray-400 py-10">
          No feedback received yet
        </div>
      )}
      {list.map((f: any) => (
        <div key={f._id} className="border p-3 mb-2">
          <p>{f.message}</p>
          <small>Teacher: {f.teacherId?.name || "General"}</small>
        </div>
      ))}
    </div>
  );
};

export default FeedbackPanel;
