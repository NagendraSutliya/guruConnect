import { useEffect, useState, useMemo } from "react";
import api from "../../../api/axiosInstance";
import Papa from "papaparse";
import { FiChevronDown, FiEdit, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Toast from "../../../components/Toast";
import type {
  UploadMarksStudent,
  UploadMarksClassAssignment,
} from "../../../types/teacher/types";

// interface Student {
//   _id: string;
//   name: string;
//   rollNo: string;
//   marks?: number;
//   isEditing?: boolean;
// }

// interface Assignment {
//   classId?: { _id: string; name: string };
//   sectionId?: { _id: string; name: string };
//   subjectId?: { _id: string; name: string };
// }

const UploadMarksPage = () => {
  const [assignments, setAssignments] = useState<UploadMarksClassAssignment[]>(
    []
  );
  const [students, setStudents] = useState<UploadMarksStudent[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const navigate = useNavigate();
  const [maxMarks, setMaxMarks] = useState(100);
  const [toast, setToast] = useState<any>(null);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const showToast = (message: string, type = "info") =>
    setToast({ message, type });

  const handleBack = () => {
    navigate("/teacher/results");
  };

  /* ================= LOAD ASSIGNMENTS ================= */
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const res = await api.get("/teacher-assign/my");
        const clean = (res.data.data || []).filter(
          (a: UploadMarksClassAssignment) =>
            a.classId?._id && a.sectionId?._id && a.subjectId?._id
        );
        setAssignments(clean);
      } catch {
        showToast("Failed to load assignments", "error");
      }
    };
    loadAssignments();
  }, []);

  /* ================= DERIVED FILTERS ================= */
  const classes = Array.from(
    new Map(assignments.map((a) => [a.classId!._id, a.classId])).values()
  );
  const sections = Array.from(
    new Map(
      assignments
        .filter((a) => a.classId?._id === selectedClassId)
        .map((a) => [a.sectionId!._id, a.sectionId])
    ).values()
  );
  const subjects = Array.from(
    new Map(
      assignments
        .filter(
          (a) =>
            a.classId?._id === selectedClassId &&
            a.sectionId?._id === selectedSectionId
        )
        .map((a) => [a.subjectId!._id, a.subjectId])
    ).values()
  );

  /* ================= RESET ON CLASS CHANGE ================= */
  useEffect(() => {
    setStudents([]);
    setSelectedSectionId("");
    setSelectedSubjectId("");
    setSelectedExamId("");
  }, [selectedClassId]);

  /* ================= LOAD EXAMS ================= */
  useEffect(() => {
    if (!selectedClassId) return;

    const loadExams = async () => {
      try {
        const res = await api.get("/exams", {
          params: { classId: selectedClassId },
        });
        setExams(res.data.data || []);
      } catch {
        showToast("Failed to load exams", "error");
      }
    };

    loadExams();
  }, [selectedClassId]);

  /* ================= LOAD STUDENTS ================= */
  const loadStudents = async () => {
    if (!selectedClassId || !selectedSectionId) {
      return showToast("Select class & section", "error");
    }

    try {
      setLoadingStudents(true);

      // 1. Load students
      const studentRes = await api.get("/student/by-class", {
        params: {
          classId: selectedClassId,
          sectionId: selectedSectionId,
        },
      });

      let studentList: UploadMarksStudent[] = studentRes.data.data.map(
        (s: any) => ({
          _id: s._id,
          name: s.name,
          rollNo: s.rollNo,
          marks: undefined,
          isEditing: false,
        })
      );

      // 2. Load existing marks (IMPORTANT)
      if (selectedExamId && selectedSubjectId) {
        const marksRes = await api.get("/results", {
          params: {
            examId: selectedExamId,
            examSubjectId: selectedSubjectId,
          },
        });

        const marksList: any[] = marksRes.data.data || [];

        // 3. Merge marks into students
        studentList = studentList.map((s) => {
          const existing = marksList.find((m) => m.studentId?._id === s._id);

          return {
            ...s,
            marks: existing?.marks ?? undefined,
          };
        });
      }

      setStudents(studentList);
    } catch (err) {
      console.error(err);
      showToast("Failed to load students or marks", "error");
    } finally {
      setLoadingStudents(false);
    }
  };

  /* ================= UPDATE MARK ================= */
  const updateMark = (id: string, value: number | undefined) => {
    if (value !== undefined && (value < 0 || value > maxMarks)) return;
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, marks: value } : s))
    );
  };

  /* ================= CSV UPLOAD ================= */
  const handleCSVUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (res: any) => {
        const updated = students.map((s) => ({ ...s }));
        res.data.forEach((row: any) => {
          const student = updated.find(
            (s) => String(s.rollNo) === String(row.rollNo)
          );
          if (student) {
            const marks = Number(row.marks);
            if (!isNaN(marks) && marks <= maxMarks) {
              student.marks = marks;
            }
          }
        });
        setStudents(updated);
        e.target.value = ""; // allow re-upload
      },
    });
  };

  const downloadTemplate = () => {
    if (!students || students.length === 0) {
      return showToast("No student data available to download", "error");
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
      s.marks !== undefined ? (s.marks >= maxMarks / 2 ? "Pass" : "Fail") : "",
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

  /* ================= SAVE ================= */
  const saveMarks = async () => {
    try {
      if (!selectedClassId || !selectedSectionId) {
        return showToast(
          "Please select Class and Section before saving marks.",
          "error"
        );
      }
      if (!selectedExamId || !selectedSubjectId) {
        return showToast(
          "Please select Exam and Subject before saving marks.",
          "error"
        );
      }

      const payload = students
        .filter((s) => s.marks !== undefined && s.marks !== null)
        .map((s) => ({
          studentId: s._id,
          marks: s.marks,
          examId: selectedExamId,
          examSubjectId: selectedSubjectId,
          classId: selectedClassId,
          sectionId: selectedSectionId,
        }));

      if (!payload.length) return showToast("No marks to save.", "error");

      setSaving(true);
      const res = await api.post("/results", {
        examId: selectedExamId,
        examSubjectId: selectedSubjectId,
        records: payload,
      });

      if (res.data.success) showToast("Marks saved successfully!", "success");
      else
        showToast(
          "Failed to save marks: " + (res.data.message || "Unknown error"),
          "error"
        );
    } catch (err) {
      console.error(err);
      showToast("An error occurred while saving marks.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteMark = async (studentId: string) => {
    try {
      if (!selectedExamId || !selectedSubjectId) {
        return showToast("Select exam and subject first", "error");
      }

      await api.delete("/results", {
        data: {
          studentId,
          examId: selectedExamId,
          examSubjectId: selectedSubjectId,
        },
      });

      // remove from UI immediately
      setStudents((prev) =>
        prev.map((s) => (s._id === studentId ? { ...s, marks: undefined } : s))
      );
      showToast("Mark deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete mark", "error");
    }
  };

  /* ================= FILTERED + PAGINATED STUDENTS ================= */
  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      `${s.name} ${s.rollNo}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Upload Marks</h2>

          <div className="mt-4">
            <button
              onClick={handleBack}
              className="bg-gray-300 px-4 py-1 font-semibold rounded-lg hover:bg-gray-500"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="bg-white p-4 rounded-xl shadow my-4">
        <div className="grid md:grid-cols-4 gap-3 mb-3">
          <div className="flex flex-col">
            <label className="block mb-1 font-semibold text-gray-600">
              Class
            </label>
            <div className="relative">
              <select
                className="border p-2 rounded-lg shadow w-full appearance-none"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c?._id} value={c?._id}>
                    {c?.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block mb-1 font-semibold text-gray-600">
              Section:
            </label>
            <div className="relative">
              <select
                className="border p-2 rounded-lg shadow w-full appearance-none"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
              >
                <option value="">Section</option>
                {sections.map((s) => (
                  <option key={s?._id} value={s?._id}>
                    {s?.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block mb-1 font-semibold text-gray-600">
              Exam
            </label>
            <div className="relative">
              <select
                className="border p-2 rounded-lg shadow w-full appearance-none"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                <option value="">Exam</option>
                {exams.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block mb-1 font-semibold text-gray-600">
              Subject
            </label>
            <div className="relative">
              <select
                className="border p-2 rounded-lg shadow w-full appearance-none"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                <option value="">Subject</option>
                {subjects.map((s) => (
                  <option key={s?._id} value={s?._id}>
                    {s?.name}
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
              className="w-20 border px-2 py-1 text-center rounded-lg shadow-md"
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loadingStudents ? "Loading..." : "Load Students"}
          </button>
        </div>
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 pt-4 space-y-3">
        {/* Header */}
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

        {/* Info Bar */}

        {/* CSV */}
        {students.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <label className="font-medium text-gray-700">Bulk Upload:</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="p-1 cursor-pointer hover:border-gray-400"
              />
            </div>
            <div>
              <button
                onClick={downloadTemplate}
                className="bg-gray-200 px-3 py-2 rounded-lg mr-2"
              >
                Download CSV
              </button>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-indigo-100 text-left">
              <tr>
                <th className="p-3">Roll No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Exam</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Marks</th>
                <th className="py-3 pr-8 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-10">
                    {loadingStudents
                      ? "Loading students..."
                      : "No students found. Please load students or adjust filters."}
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{s.rollNo}</td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3">
                      {exams.find((e) => e._id === selectedExamId)?.name || "-"}
                    </td>
                    <td className="p-3">
                      {subjects.find((sub) => sub?._id === selectedSubjectId)
                        ?.name || "-"}
                    </td>
                    <td className="p-3">
                      <div className="w-20">
                        {s.isEditing ? (
                          <input
                            type="number"
                            min={0}
                            max={maxMarks}
                            value={s.marks ?? ""}
                            onChange={(e) =>
                              updateMark(
                                s._id,
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            className="w-16 border rounded-lg px-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        ) : s.marks !== undefined ? (
                          <div className="w-12 text-center font-semibold text-green-600">
                            {s.marks}
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            Not Uploaded
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-8 text-right">
                      <button
                        onClick={() =>
                          setStudents((prev) =>
                            prev.map((stu) =>
                              stu._id === s._id
                                ? { ...stu, isEditing: !stu.isEditing }
                                : stu
                            )
                          )
                        }
                        className="text-yellow-600 p-1 rounded hover:bg-yellow-50"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => deleteMark(s._id)}
                        disabled={saving}
                        className="text-red-600 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        {saving ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <FiTrash2 />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* SAVE BUTTON */}
        {students.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={saveMarks}
              disabled={saving}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Marks"}
            </button>
          </div>
        )}

        {/* PAGINATION */}
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
export default UploadMarksPage;
