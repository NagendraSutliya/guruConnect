import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { Clock, MapPin, CalendarDays } from "lucide-react";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  color: string;
};

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/admin/exams");
        const exams = (res.data.data || []).slice(0, 3).map((exam: any) => {
            // Extract date from first subject if available, otherwise use creation date
            const targetDate = exam.subjects?.[0]?.date || exam.createdAt;
            const dateObj = new Date(targetDate);
            const isValid = !isNaN(dateObj.getTime());
            
            return {
                id: exam._id,
                title: exam.name,
                date: isValid ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "N/A",
                time: exam.subjects?.[0]?.startTime || "09:00 AM",
                location: "Exam Hall",
                color: "emerald"
            };
        });
        setEvents(exams);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="p-6 text-xs text-slate-400 font-black uppercase animate-pulse">Synchronizing milestones...</div>;

  return (
    <div className="space-y-5">
      {events.map((event) => {
        const dateParts = event.date !== "N/A" ? event.date.split(' ') : ["-", "-"];
        
        return (
          <div key={event.id} className="bg-white/70 backdrop-blur-md rounded-[1.5rem] p-5 border border-slate-100 hover:shadow-lg transition-all group">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl bg-${event.color}-600 text-white flex flex-col items-center justify-center shrink-0 shadow-lg shadow-${event.color}-100 group-hover:scale-110 transition-transform`}>
                <span className="text-[9px] font-black uppercase tracking-tighter opacity-80">{dateParts[0]}</span>
                <span className="text-lg font-black leading-none">{dateParts[1]}</span>
              </div>
              
              <div className="flex-1 space-y-1">
                <h4 className="text-[13px] font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={12} className="text-indigo-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={12} className="text-purple-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <CalendarDays size={32} className="text-slate-300 mb-2" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Milestones</p>
        </div>
      )}
    </div>
  );
}
