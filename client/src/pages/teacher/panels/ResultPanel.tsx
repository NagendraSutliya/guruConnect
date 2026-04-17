import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import Toast from "../../../components/Toast";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type {
  ResultStudent,
  ResultClassAssignment,
} from "../../../types/teacher/types";

const ResultPanel = () => {
  const [assignments, setAssignments] = useState<ResultClassAssignment[]>([]);
  const [students, setStudents] = useState<ResultStudent[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const showToast = (message: string, type = "info") =>
    setToast({ message, type });

  const handleUploadMarksClick = () => {
    navigate("/teacher/results/upload-marks");
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      `${s.name} ${s.rollNo}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  /* ================= LOAD ASSIGNMENTS ================= */
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
    if (!selectedClassId || !selectedSectionId) return setExams([]);

    const loadExams = async () => {
      try {
        let res = await api.get("/exams", {
          params: { classId: selectedClassId, sectionId: selectedSectionId },
        });
        let examList = res.data.data || [];

        if (examList.length === 0) {
          const fallbackRes = await api.get("/exams", {
            params: { classId: selectedClassId },
          });
          examList = fallbackRes.data.data || [];
        }
        setExams(examList);
      } catch (err) {
        showToast("Failed to load exams", "error");
      }
    };
    loadExams();
  }, [selectedClassId, selectedSectionId]);

  /* ================= FILTER OPTIONS ================= */
  const classes = Array.from(
    new Map(assignments.map((a) => [a.classId._id, a.classId])).values()
  );
  const sections = Array.from(
    new Map(
      assignments
        .filter((a) => a.classId._id === selectedClassId && a.sectionId?._id)
        .map((a) => [a.sectionId!._id, a.sectionId!])
    ).values()
  );
  const subjects = Array.from(
    new Map(
      assignments
        .filter(
          (a) =>
            a.classId._id === selectedClassId &&
            a.sectionId?._id === selectedSectionId &&
            a.subjectId?._id
        )
        .map((a) => [a.subjectId!._id, a.subjectId!])
    ).values()
  );

  /* ================= RESET STUDENTS ON FILTER CHANGE ================= */
  useEffect(() => {
    // Keep previous results! Only reset if teacher wants.
    // setStudents([]); <-- removed to persist
  }, [selectedClassId, selectedSectionId, selectedSubjectId, selectedExamId]);

  /* ================= LOAD STUDENTS + MARKS ================= */
  const loadStudents = async () => {
    if (!selectedClassId || !selectedSectionId)
      return showToast("Select class & section", "error");

    setLoadingStudents(true);
    try {
      const studentRes = await api.get("/student/by-class", {
        params: { classId: selectedClassId, sectionId: selectedSectionId },
      });
      const studentList: ResultStudent[] = studentRes.data.data.map(
        (s: any) => ({
          _id: s._id,
          name: s.name,
          rollNo: s.rollNo,
          marks: undefined,
          isEditing: false,
        })
      );
      setStudents(studentList);

      if (selectedExamId && selectedSubjectId) {
        const marksRes = await api.get("/results", {
          params: { examId: selectedExamId, examSubjectId: selectedSubjectId },
        });
        const marksList: any[] = marksRes.data.data || [];

        const updatedStudents = studentList.map((s) => {
          const m = marksList.find((m) => m.studentId._id === s._id);
          return { ...s, marks: m?.marks };
        });
        setStudents(updatedStudents);
      }
    } catch (err) {
      showToast("Failed to load students or marks", "error");
    }
    setLoadingStudents(false);
  };

  /* ================= UPDATE / EDIT / DELETE ================= */
  const updateMark = (id: string, value: number) => {
    if (value > maxMarks)
      return showToast(`Cannot exceed ${maxMarks}`, "error");
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, marks: value } : s))
    );
  };

  const downloadTemplate = () => {
    if (!students || students.length === 0) {
      return alert("No student data available to download");
    }

    // Use the selected exam and subject names
    const examName = exams.find((e) => e._id === selectedExamId)?.name || "";
    const subjectName =
      subjects.find((sub) => sub?._id === selectedSubjectId)?.name || "";

    // Headers
    const headers = ["Roll No", "Name", "Exam", "Subject", "Marks", "Result"];

    // Rows
    const rows = students.map((s) => [
      s.rollNo,
      s.name,
      examName,
      subjectName,
      s.marks !== undefined ? s.marks : "",
      s.marks !== undefined ? (s.marks >= maxMarks / 3 ? "Pass" : "Fail") : "",
    ]);

    // Build CSV string
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "student_marks.csv";
    a.click();

    URL.revokeObjectURL(url); // clean up
  };

  /* ================= EXAMS PAGINATION ================= */
  const filteredExams = exams;

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  const paginatedExams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExams.slice(start, start + itemsPerPage);
  }, [filteredExams, currentPage, itemsPerPage]);

  return (
    <div className="space-y-4 pb-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="sticky top-0 z-20 bg-gray-100 py-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
          <h2 className="text-2xl font-bold text-gray-800">Student Results</h2>
          <div className="mt-4">
            <button
              onClick={handleUploadMarksClick}
              className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-semibold shadow hover:bg-blue-700 transition"
            >
              Upload Marks
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col">
            <label>Class:</label>
            <div className="relative">
              <select
                className="bg-gray-100 border p-2 rounded-lg shadow-md w-full appearance-none"
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
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <label>Section:</label>
            <div className="relative">
              <select
                className="bg-gray-100 border p-2 rounded-lg shadow-md w-full appearance-none"
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
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <label>Exam:</label>
            <div className="relative">
              <select
                className="bg-gray-100 border p-2 rounded-lg shadow-md w-full appearance-none"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                <option value="">Select Exam</option>
                {paginatedExams.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <label>Subject:</label>
            <div className="relative">
              <select
                className="bg-gray-100 border p-2 rounded-lg shadow-md w-full appearance-none"
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
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Max Marks:
            </span>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="w-24 border p-2 rounded-lg shadow-md"
            />
          </div>
          <button
            onClick={loadStudents}
            disabled={
              !selectedClassId ||
              !selectedSectionId ||
              !selectedExamId ||
              !selectedSubjectId
            }
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loadingStudents ? "Loading..." : "Load Students"}
          </button>
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Results</h3>

          <div className="bg-white flex items-center border rounded-lg overflow-hidden shadow">
            <FiSearch className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search student..."
              className="flex-grow px-2 py-1 outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FiX
              className={`text-gray-400 cursor-pointer mr-2 ${
                search ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSearch("")}
            />
          </div>
        </div>

        <div className="flex justify-between bg-gray-100 rounded-md shadow ">
          <div className="text-gray-700 border-b px-3 py-1">
            <span className="font-medium">Class:</span>{" "}
            {classes.find((c) => c._id === selectedClassId)?.name}
            {" | "}
            <span className="font-medium">Section:</span>{" "}
            {sections.find((s) => s._id === selectedSectionId)?.name}
            {" | "}
            <span className="font-medium">Exam:</span>{" "}
            {exams.find((e) => e._id === selectedExamId)?.name}
            {" | "}
            <span className="font-medium">Subject:</span>{" "}
            {subjects.find((e) => e._id === selectedSubjectId)?.name}
          </div>

          <button
            onClick={downloadTemplate}
            disabled={students.length === 0}
            className="bg-green-200 font-semibold px-3 py-1 rounded-lg mr-2"
          >
            Download CSV
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="p-3">Roll No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Exam</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Marks</th>
                <th className="p-3">Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-600 p-8">
                    {selectedClassId && selectedSectionId
                      ? "No students found for selected filters."
                      : "Select class and section, then click 'Load Students' to see results."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
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
                    <td className="p-3">
                      {s.isEditing ? (
                        <input
                          type="number"
                          min={0}
                          max={maxMarks}
                          value={s.marks ?? ""}
                          onChange={(e) =>
                            updateMark(s._id, Number(e.target.value))
                          }
                          className="border p-1 rounded w-20 text-center"
                        />
                      ) : s.marks !== undefined ? (
                        <span className="font-semibold text-green-600">
                          {s.marks}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not Uploaded</span>
                      )}
                    </td>
                    <td className="p-3">
                      {s.marks !== undefined ? (
                        <span
                          className={`px-2 py-1 rounded-lg font-semibold ${
                            s.marks >= maxMarks / 3
                              ? "bg-green-200"
                              : "bg-red-200"
                          }`}
                        >
                          {s.marks >= maxMarks / 3 ? "Pass" : "Fail"}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center py-4">
          <div>
            <label className="mr-2 text-gray-700 text-sm">
              Items per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
