import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosInstance";

const PublicFeedback = () => {
  const { code } = useParams(); // link code
  const [form, setForm] = useState({
    classOrBatch: "",
    teacherName: "",
    mood: "😊",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!form.message) return alert("Please write feedback");

    await api.post("/public/feedback/" + code, form);
    setSent(true);
  };

  if (sent)
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold text-green-600">Thank You! 🎉</h2>
        <p>Your feedback has been submitted.</p>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Give Feedback</h2>

      <input
        placeholder="Class / Batch"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, classOrBatch: e.target.value })}
      />

      <input
        placeholder="Teacher Name"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, mood: e.target.value })}
      >
        <option>😊</option>
        <option>😐</option>
        <option>😞</option>
      </select>

      <textarea
        placeholder="Your feedback..."
        className="border p-2 w-full mb-3"
        rows={4}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <button
        onClick={submit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default PublicFeedback;
