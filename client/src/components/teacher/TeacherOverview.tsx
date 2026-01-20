import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const TeacherOverview = () => {
  const [data, setData] = useState<{
    total?: number;
    positive?: number;
    today?: number;
  }>({});

  useEffect(() => {
    api
      .get("/teacher/overview", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("teacherToken"),
        },
      })
      .then((res) => setData(res.data));
  }, []);

  const Card = ({ title, value, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-600">{title}</p>
      <h2 className={`text-4xl font-bold text-${color || "blue"}-600`}>
        {value || 0}
      </h2>
    </div>
  );

  return (
    <>
      <h1 className="text-2xl font-bold">Welcome 👋</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card title="Total Feedback" value={data.total} />
        <Card title="Positive Responses" value={data.positive} color="green" />
        <Card title="Today's Feedback" value={data.today} color="orange" />
      </div>
    </>
  );
};

export default TeacherOverview;
