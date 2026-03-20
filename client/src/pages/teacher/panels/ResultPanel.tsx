import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import Toast from "../../../components/Toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Student {
  _id: string;
  name: string;
  rollNo: string;
  currentMarks?: number;
  marks: number | "";
  isEditing?: boolean;
}

interface ClassAssignment {
  _id: string;
  classId: { _id: string; name: string };
  sectionId: { _id: string; name: string };
  subjectId: { _id: string; name: string };
}

const ResultPanel = () => {
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [exams, setExams] = useState<any[]>([]);
  const [maxMarks, setMaxMarks] = useState(100);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string, type = "info") =>
    setToast({ message: msg, type });

  /* ================= LOAD TEACHER ASSIGNMENTS ================= */
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await api.get("/teacher-assign/my");
        setAssignments(res.data.data || []);
      } catch (err) {
        showToast("Failed to load assignments", "error");
      }
    };
    loadAssignments();
  }, []);

  /* ================= LOAD EXAMS ================= */
  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) {
      setExams([]);
      return;
    }

    const loadExams = async () => {
      try {
        let res = await api.get("/exams", {
          params: { classId: selectedClassId, sectionId: selectedSectionId },
        });

        let examList = res.data.data || [];

        // fallback without section
        if (examList.length === 0) {
          const fallbackRes = await api.get("/exams", {
            params: { classId: selectedClassId },
          });
          examList = fallbackRes.data.data || [];
        }

        setExams(examList);
      } catch (err) {
        console.error(err);
        showToast("Failed to load exams", "error");
      }
    };

    loadExams();
  }, [selectedClassId, selectedSectionId]);

  /* ================= LOAD STUDENTS ================= */
  const loadStudents = async () => {
    if (!selectedClassId || !selectedSectionId) {
      showToast("Please select class and section", "error");
      return;
    }

    setLoading(true);

    try {
      const studentRes = await api.get("/student/by-class", {
        params: { classId: selectedClassId, sectionId: selectedSectionId },
      });

      const studentList = studentRes.data.data.map((s: any) => ({
        _id: s._id,
        name: s.name,
        rollNo: s.rollNo,
        currentMarks: undefined,
        marks: "",
        isEditing: false,
      }));

      setStudents(studentList);
      setStatus(`✔ ${studentList.length} students loaded`);
    } catch (err) {
      showToast("Failed to load students", "error");
    }

    setLoading(false);
  };

  /* ================= UPDATE MARK ================= */
  const updateMark = (id: string, value: number) => {
    if (value > maxMarks) {
      showToast(`Marks cannot exceed ${maxMarks}`, "error");
      return;
    }

    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, marks: value } : s))
    );
  };

  /* ================= EDIT / DELETE MARK ================= */
  const editMark = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, isEditing: true } : s))
    );
  };

  const deleteMark = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id
          ? { ...s, marks: "", currentMarks: undefined, isEditing: false }
          : s
      )
    );
  };

  /* ================= SAVE MARKS ================= */
  const saveMarks = async () => {
    if (!selectedExamId || !selectedSubjectId) {
      showToast("Select exam and subject first", "error");
      return;
    }

    try {
      const payload = students
        .filter((s) => s.marks !== "")
        .map((s) => ({
          studentId: s._id,
          marks: s.marks,
          maxMarks,
          examId: selectedExamId, // Use examId directly
          subjectId: selectedSubjectId, // Include subjectId
          classId: selectedClassId,
          sectionId: selectedSectionId,
        }));

      console.log("Saving payload:", payload);

      await api.post("/results", payload);

      setStatus("✔ Marks saved successfully");
      showToast("Marks saved successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save marks", "error");
    }
  };

  /* ================= FILTERS ================= */
  const classes = Array.from(
    new Map(
      assignments
        .filter((a) => a.classId)
        .map((a) => [a.classId._id, a.classId])
    ).values()
  );

  const sections = Array.from(
    new Map(
      assignments
        .filter(
          (a) =>
            a.classId._id && a.sectionId && a.classId._id === selectedClassId
        )
        .map((a) => [a.sectionId._id, a.sectionId])
    ).values()
  );

  const subjects = Array.from(
    new Map(
      assignments
        .filter(
          (a) =>
            a.classId._id &&
            a.sectionId &&
            a.subjectId &&
            a.classId._id === selectedClassId &&
            a.sectionId._id === selectedSectionId
        )
        .map((a) => [a.subjectId._id, a.subjectId])
    ).values()
  );

  /* ================= RESET STUDENTS ON FILTER CHANGE ================= */
  useEffect(() => {
    setStudents([]);
    setStatus("");
  }, [selectedClassId, selectedSectionId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Student Results</h2>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded shadow mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="border p-2 rounded"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
          >
            <option value="">Select Section</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            <option value="">Select Exam</option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Max Marks :
            </span>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="border p-2 rounded w-24"
            />
          </div>

          <button
            onClick={loadStudents}
            disabled={!selectedClassId || !selectedSectionId}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load Students"}
          </button>
        </div>
      </div>

      {status && (
        <div className="mb-3 text-sm text-indigo-600 font-medium">{status}</div>
      )}

      {/* TABLE */}
      <div className="bg-white border shadow rounded-lg">
        <div className="mb-4 text-gray-700 px-6 py-3 border-b">
          <span className="font-medium">Class:</span>{" "}
          {classes.find((c) => c._id === selectedClassId)?.name}
          {" | "}
          <span className="font-medium">Section:</span>{" "}
          {sections.find((s) => s._id === selectedSectionId)?.name}
          {" | "}
          <span className="font-medium">Exam:</span>{" "}
          {exams.find((e) => e._id === selectedExamId)?.name}
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          {students.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Select filters and click "Load Results"
            </div>
          ) : (
            <table className="w-full text-sm text-center">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Exam</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Marks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="p-3">{s.rollNo}</td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">
                      {exams.find((e) => e._id === selectedExamId)?.name}
                    </td>
                    <td>
                      {
                        subjects.find((sub) => sub._id === selectedSubjectId)
                          ?.name
                      }
                    </td>
                    <td className="p-3 w-32">
                      {s.isEditing ? (
                        <input
                          type="number"
                          value={s.marks}
                          min={0}
                          max={maxMarks}
                          onChange={(e) =>
                            updateMark(s._id, Number(e.target.value))
                          }
                          className="border p-1 rounded w-20 text-center"
                        />
                      ) : s.currentMarks !== undefined ? (
                        <span className="font-semibold text-green-600">
                          {s.currentMarks}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not Uploaded</span>
                      )}
                    </td>
                    <td className="p-3 flex gap-3 justify-center">
                      <button
                        onClick={() => editMark(s._id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <FiEdit size={16} />
                      </button>

                      {s.currentMarks !== undefined && (
                        <button
                          onClick={() => deleteMark(s._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* SAVE BUTTON */}
      {students.length > 0 && (
        <div className="flex justify-end mt-5">
          <button
            onClick={saveMarks}
            disabled={!selectedExamId || !selectedSubjectId}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Save Marks
          </button>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ResultPanel;
