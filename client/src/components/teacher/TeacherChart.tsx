import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { BarChart, Bar, XAxis, Tooltip } from "recharts";

type FeedbackData = {
  name: string;
  value: number;
};

const TeacherChart = () => {
  const [data, setData] = useState<FeedbackData[]>([]);

  useEffect(() => {
    api
      .get("/teacher/overview", {
        headers: {
          Authorization: "Bearer  " + localStorage.getItem("teacherToken"),
        },
      })
      .then((res) => {
        setData([
          { name: "Positive", value: res.data.positive },
          { name: "Neutral", value: res.data.neutral },
          { name: "Negative", value: res.data.negative },
        ]);
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow col-span-2">
      <h3 className="font-semibold mb-4">Feedback Overview</h3>

      <BarChart width={500} height={260} data={data}>
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
      </BarChart>
    </div>
  );
};

export default TeacherChart;
