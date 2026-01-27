import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";

type Feedback = {
  _id: string;
  message: string;
  mood: "happy" | "neutral" | "sad";
  teacherName?: string;
  teacherId?: { name: string; _id?: string };
  studentName?: string;
  studentId?: { name: string };
  classOrBatch?: string;
  createdAt: string;
};

const MOOD_CONFIG: Record<
  Feedback["mood"],
  { emoji: string; color: string; bg: string }
> = {
  happy: { emoji: "😊", color: "text-green-600", bg: "bg-green-50" },
  neutral: { emoji: "😐", color: "text-yellow-600", bg: "bg-yellow-50" },
  sad: { emoji: "😞", color: "text-red-600", bg: "bg-red-50" },
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
      .then((res) => setFeedback(res.data))
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        Fetching student feedback…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-100 py-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Student Feedback
        </h2>

        {/* Filters */}
        <div className="bg-white border rounded-xl p-4 shadow-sm space-y-4">
          <p className="text-lg md:text-xl font-bold text-gray-600">
            {filteredFeedback.length} Responses
          </p>

          <div className="flex flex-wrap gap-4">
            <select
              className="border px-3 py-2 rounded w-56"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">All Teachers</option>
              {teachers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              className="border px-3 py-2 rounded w-40"
              value={selectedMood}
              onChange={(e) =>
                setSelectedMood(e.target.value as Feedback["mood"] | "")
              }
            >
              <option value="">All Moods</option>
              <option value="happy">Happy</option>
              <option value="neutral">Neutral</option>
              <option value="sad">Sad</option>
            </select>
          </div>
        </div>
      </div>
      {/* Empty State */}
      {filteredFeedback.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-white border rounded-2xl py-20 text-center text-gray-400">
          <div className="text-4xl mb-4">📭</div>
          No feedback found
        </div>
      )}

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFeedback.map((item) => {
          const moodUI = MOOD_CONFIG[item.mood];

          const studentName = item.studentName || item.studentId?.name || "";
          const teacherName = item.teacherName || item.teacherId?.name || "";

          return (
            <div
              key={item._id}
              className={`relative rounded-2xl border p-6 shadow-sm hover:shadow-lg transition ${moodUI.bg}`}
            >
              {/* Mood Bar */}
              <div
                className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${moodUI.color.replace(
                  "text",
                  "bg"
                )}`}
              />

              {/* From → About */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  {/* Student */}
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-semibold">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="font-medium">{studentName}</p>
                    </div>
                  </div>

                  <span className="text-gray-400 text-lg">➜</span>

                  {/* Teacher */}
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold ring-2 ring-blue-200">
                      {teacherName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">About</p>
                      <p className="font-semibold text-blue-700">
                        {teacherName}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>

              {/* Mood */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-2xl ${moodUI.color}`}>
                  {moodUI.emoji}
                </span>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {item.mood} feedback
                </span>
              </div>

              {/* Message */}
              <p className="text-gray-800 text-lg leading-relaxed mb-6">
                {item.message}
              </p>

              {/* Footer */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t pt-4">
                {item.classOrBatch && <span>🏫 {item.classOrBatch}</span>}
                <span>🕒 {new Date(item.createdAt).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackPanel;
