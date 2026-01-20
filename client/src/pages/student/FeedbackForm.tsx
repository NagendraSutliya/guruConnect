import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosInstance";

const FeedbackForm = () => {
  const { code } = useParams(); // auto detect institute from URL

  const [form, setForm] = useState({
    code: code || "",
    classOrBatch: "",
    teacherName: "",
    category: "",
    mood: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/feedback", form);
      setSubmitted(true);
    } catch (err) {
      alert("Failed to submit feedback");
    }
  };

  if (submitted)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-green-600">
          ✅ Thank you for your anonymous feedback!
        </h2>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Submit Anonymous Feedback
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="classOrBatch"
          placeholder="Class / Batch"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="teacherName"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Teacher</option>
          <option value="All">All Teachers</option>
          <option value="Math">Math Teacher</option>
          <option value="Science">Science Teacher</option>
        </select>

        <select
          name="category"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Teaching">Teaching</option>
          <option value="Behavior">Behavior</option>
          <option value="Stress">Stress</option>
          <option value="Infrastructure">Infrastructure</option>
        </select>

        <select
          name="mood"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Mood</option>
          <option value="🙂">🙂 Happy</option>
          <option value="😐">😐 Neutral</option>
          <option value="😟">😟 Sad</option>
        </select>

        <textarea
          name="message"
          placeholder="Write your feedback..."
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded font-semibold"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
