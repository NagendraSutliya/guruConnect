import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiMessageSquare, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

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
      .then((res) => setData(res.data.data));
  }, []);

  const MetricCard = ({ title, value, icon: Icon, gradient }: any) => (
    <div className={`relative overflow-hidden bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110`} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-800">{value || 0}</h3>
            {title === "Positive Responses" && (
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <FiTrendingUp size={10} /> +12%
              </span>
            )}
          </div>
        </div>
        
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard 
        title="Total Feedback" 
        value={data.total} 
        icon={FiMessageSquare}
        gradient="from-blue-500 to-indigo-600"
      />
      <MetricCard 
        title="Positive Responses" 
        value={data.positive} 
        icon={FiCheckCircle}
        gradient="from-emerald-400 to-teal-600"
      />
      <MetricCard 
        title="Today's Feedback" 
        value={data.today} 
        icon={FiTrendingUp}
        gradient="from-amber-400 to-orange-600"
      />
    </div>
  );
};

export default TeacherOverview;
