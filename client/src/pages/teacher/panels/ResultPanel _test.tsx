import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const ExamSelectTest = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState("");

  const loadExams = async () => {
    try {
      const res = await api.get("/exams");

      console.log("EXAMS API RESPONSE =>", res.data); // 🔥 debug

      setExams(res.data.data || []);
    } catch (err) {
      console.error("Failed to load exams", err);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Select Exam (Test Page)</h2>

      <select
        value={selectedExam}
        onChange={(e) => setSelectedExam(e.target.value)}
        className="border p-2 rounded w-64"
      >
        <option value="">Select Exam</option>

        {exams.map((exam) => (
          <option key={exam._id} value={exam._id}>
            {exam.name}
          </option>
        ))}
      </select>

      {/* Debug output */}
      <div className="mt-4 text-sm text-gray-600">
        Selected Exam ID: {selectedExam || "None"}
      </div>
    </div>
  );
};

export default ExamSelectTest;
