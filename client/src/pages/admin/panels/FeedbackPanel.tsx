import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import type { Feedback } from "../../../types/admin/feedback";
import { FiTrash2, FiSearch, FiFilter, FiSmile, FiMeh, FiFrown, FiCalendar, FiUser } from "react-icons/fi";

const MOOD_CONFIG: Record<
  Feedback["mood"],
  { emoji: string; color: string; bg: string; icon: any }
> = {
  happy: { emoji: "😊", color: "text-emerald-600", bg: "bg-emerald-50", icon: <FiSmile /> },
  neutral: { emoji: "😐", color: "text-amber-600", bg: "bg-amber-50", icon: <FiMeh /> },
  sad: { emoji: "😞", color: "text-rose-600", bg: "bg-rose-50", icon: <FiFrown /> },
};

const FeedbackPanel = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedMood, setSelectedMood] = useState<"" | Feedback["mood"]>("");

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
  };

  useEffect(() => {
    api
      .get("/admin/feedback", { headers })
      .then((res) => setFeedback(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const teachers = useMemo(() => {
    const set = new Set<string>();
    feedback.forEach((f) => {
      const name = f.teacherName || f.teacherId?.name;
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [feedback]);

  const filteredFeedback = useMemo(() => {
    return feedback.filter((f) => {
      const teacherName = f.teacherName || f.teacherId?.name || "";
      if (selectedTeacher && teacherName !== selectedTeacher) return false;
      if (selectedMood && f.mood !== selectedMood) return false;
      return true;
    });
  }, [feedback, selectedTeacher, selectedMood]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feedback?")) return;
    await api.delete(`/admin/feedback/${id}`, { headers });
    setFeedback((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-100 via-white to-indigo-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Voice of Students</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Monitor teacher performance through real-time student feedback.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              api.get("/admin/feedback", { headers }).then(res => setFeedback(res.data.data)).finally(() => setLoading(false));
            }}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-sm"
          >
            <FiMeh />
            <span>Sync Feedback</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
           <div className="flex flex-col gap-1.5 w-full sm:w-64">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter by Teacher</label>
              <div className="relative">
                 <select
                   className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
                   value={selectedTeacher}
                   onChange={(e) => setSelectedTeacher(e.target.value)}
                 >
                   <option value="">All Teachers</option>
                   {teachers.map((t) => <option key={t} value={t}>{t}</option>)}
                 </select>
                 <FiFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
           </div>

           <div className="flex flex-col gap-1.5 w-full sm:w-48">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filter by Sentiment</label>
              <div className="relative">
                 <select
                   className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none appearance-none cursor-pointer"
                   value={selectedMood}
                   onChange={(e) => setSelectedMood(e.target.value as Feedback["mood"] | "")}
                 >
                   <option value="">All Moods</option>
                   <option value="happy">Happy Only</option>
                   <option value="neutral">Neutral Only</option>
                   <option value="sad">Critical Only</option>
                 </select>
                 <FiSmile className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
           </div>
        </div>

        <div className="px-8 py-4 bg-indigo-50 border border-indigo-100 rounded-3xl text-center w-full lg:w-auto">
           <p className="text-3xl font-black text-indigo-600 tracking-tight">{filteredFeedback.length}</p>
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">Responses Filtered</p>
        </div>
      </div>

      {/* Grid of Feedback */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
           <p className="text-sm font-black uppercase tracking-widest">Collecting Student Voices...</p>
        </div>
      ) : filteredFeedback.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-[3rem] py-32 text-center">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-slate-300">📭</div>
           <h3 className="text-lg font-black text-slate-800">No Feedback Captured</h3>
           <p className="text-slate-500 font-medium mt-2">Adjust your filters or wait for students to submit more responses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredFeedback.map((item) => {
            const moodUI = MOOD_CONFIG[item.mood];
            const studentName = item.studentName || item.studentId?.name || "Anonymous";
            const teacherName = item.teacherName || item.teacherId?.name || "Unknown Teacher";
            const initialsS = studentName.charAt(0).toUpperCase();
            const initialsT = teacherName.charAt(0).toUpperCase();

            return (
              <div
                key={item._id}
                className={`group relative rounded-[2.5rem] bg-white/70 backdrop-blur-md border border-white/20 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden`}
              >
                {/* Decorative Sentiment Indicator */}
                <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none flex items-center justify-center text-8xl ${moodUI.color}`}>
                   {moodUI.icon}
                </div>

                <div className="relative z-10">
                  {/* Identity Header */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg shadow-slate-200">
                          {initialsS}
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Feedback From</p>
                           <p className="text-sm font-black text-slate-800">{studentName}</p>
                        </div>
                     </div>

                     <div className="hidden sm:block text-slate-300 font-black tracking-tighter">━━━━▶</div>

                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                          {initialsT}
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Regarding Teacher</p>
                           <p className="text-sm font-black text-indigo-600">{teacherName}</p>
                        </div>
                     </div>
                  </div>

                  {/* Sentiment Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-6 border ${moodUI.bg} ${moodUI.color} border-current/10`}>
                     <span className="text-lg">{moodUI.emoji}</span>
                     <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.mood} Sentiment</span>
                  </div>

                  {/* Message Body */}
                  <div className="bg-slate-50/50 rounded-3xl p-6 mb-8 border border-slate-100 group-hover:bg-white group-hover:shadow-inner transition-all duration-500">
                     <p className="text-slate-700 font-medium leading-relaxed italic">
                       "{item.message}"
                     </p>
                  </div>

                  {/* Metadata Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                     <div className="flex items-center gap-4 text-[11px] font-black text-slate-600 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-lg">
                           <FiCalendar className="w-3 h-3" />
                           {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        {item.classOrBatch && (
                           <div className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-lg">
                              <FiUser className="w-3 h-3" />
                              {item.classOrBatch}
                           </div>
                        )}
                     </div>
                     <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all shadow-sm active:scale-90"
                        title="Delete Feedback"
                      >
                        <FiTrash2 size={16} />
                      </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FeedbackPanel;
