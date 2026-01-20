import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const TeacherRecent = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    api
      .get("/teacher/overview", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("teacherToken"),
        },
      })
      .then((res) => setList(res.data.recent));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Recent Feedback</h3>

      {list.map((f: any) => (
        <div key={f._id} className="flex justify-between py-3 border-b">
          <div>
            <p className="font-medium">{f.teacherName}</p>
            <p className="text-xs text-gray-400">{f.message}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs capitalize bg-${badgeColor(
              f.mood
            )}-100 text-${badgeColor(f.mood)}-600`}
          >
            {f.mood}
          </span>
        </div>
      ))}
    </div>
  );
};

const badgeColor = (mood: any) =>
  mood === "positive" ? "green" : mood === "negative" ? "red" : "yellow";

export default TeacherRecent;
