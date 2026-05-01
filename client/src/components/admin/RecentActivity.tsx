import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { UserPlus, MessageSquare } from "lucide-react";

type Activity = {
  id: string;
  type: "teacher" | "feedback";
  content: string;
  time: string;
  color: string;
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [feedbackRes, teacherRes] = await Promise.all([
          api.get("/admin/feedback"),
          api.get("/admin/teachers")
        ]);

        const feedbacks = (feedbackRes.data.data || []).slice(0, 2).map((f: any) => ({
          id: f._id,
          type: "feedback",
          content: `New feedback received from student.`,
          time: new Date(f.createdAt).toLocaleDateString(),
          color: "purple"
        }));

        const teachers = (teacherRes.data.data || []).slice(0, 2).map((t: any) => ({
          id: t._id,
          type: "teacher",
          content: `New faculty registered: ${t.name}`,
          time: new Date(t.createdAt).toLocaleDateString(),
          color: "blue"
        }));

        setActivities([...feedbacks, ...teachers].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()));
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div className="p-4 text-[10px] text-slate-400 font-bold uppercase animate-pulse">Syncing...</div>;

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="space-y-5">
        {activities.map((activity, idx) => (
          <div key={activity.id} className="relative flex items-start gap-4 group">
            {idx !== activities.length - 1 && (
              <div className="absolute top-10 left-4 w-px h-6 bg-slate-100" />
            )}
            
            <div className={`w-8 h-8 rounded-lg bg-${activity.color}-50 flex items-center justify-center text-sm shrink-0 text-${activity.color}-600`}>
              {activity.type === "teacher" ? <UserPlus size={14} /> : <MessageSquare size={14} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-[11px] font-bold text-slate-700 truncate">{activity.content}</h4>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && <p className="text-slate-400 text-center py-2 text-[10px] italic">No activity logs.</p>}
      </div>
    </div>
  );
}
