import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosInstance";

type Teacher = {
  _id: string;
  name: string;
};

const FeedbackForm = () => {
  const { code } = useParams<{ code: string }>();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [mood, setMood] = useState<"happy" | "neutral" | "sad">("happy");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code) return;

    api
      .get(`/public/teachers/${code}`)
      .then((res) => setTeachers(res.data))
      .catch(() => setError("Invalid or expired link"));
  }, [code]);

  const handleSubmit = async () => {
    setError("");

    if (!teacherId || !message.trim()) {
      setError("Please select a teacher and write feedback.");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/public/feedback/${code}`, {
        teacherId,
        studentName,
        mood,
        message,
      });
      setSubmitted(true);
    } catch {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Thank You 🙏</h2>
          <p>Your feedback has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Student Feedback</h1>
          <p className="text-gray-600 mt-2">
            Your feedback helps us improve teaching quality.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Teacher & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Teacher <span className="text-red-500">*</span>
              </label>
              <select
                className="border p-3 w-full rounded"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Your Name (optional)
              </label>
              <input
                className="border p-3 w-full rounded"
                placeholder="e.g. John Doe"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium mb-3">
              How was your experience?
            </label>
            <div className="flex gap-4">
              {(["happy", "neutral", "sad"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`flex-1 py-3 rounded font-medium transition ${
                    mood === m
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              className="border p-3 w-full rounded resize-none"
              rows={5}
              placeholder="Write your feedback..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          {/* Submit */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !teacherId || !message.trim()}
              className="w-full md:w-auto px-10 py-3 bg-black text-white rounded disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
