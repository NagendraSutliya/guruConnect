import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const TeacherFeedback = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("/teacher/feedback/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("teacherToken"),
        },
      })
      .then((res) => setData(res.data));
  });

  const badge = (m: any) =>
    m === "positive" ? "green" : m === "negative" ? "red" : "yellow";

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">All Feedback</h2>

      <table className="w-full text-xm">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Message</th>
            <th>Mood</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((f: any) => (
            <tr key={f._id} className="border-b hover:bg-gray-50">
              <td>{f.teacherName}</td>
              <td>{f.classOrBatch}</td>
              <td className="max-w-xs truncate">{f.message}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs bg-${badge(
                    f.mood
                  )}-100 text-${badge(f.mood)}-600`}
                >
                  {f.mood}
                </span>
              </td>
              <td>{new Date(f.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherFeedback;
