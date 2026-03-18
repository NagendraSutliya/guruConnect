import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const AdminResultPanel = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const load = async () => {
    try {
      const [e, c, s, sub] = await Promise.all([
        api.get("/exams"),
        api.get("/classes"),
        api.get("/sections"),
        api.get("/subjects"),
      ]);

      setExams(e.data.data || []);
      setClasses(c.data.data || []);
      setSections(s.data.data || []);
      setSubjects(sub.data.data || []);
    } catch (err) {
      console.error("Failed loading filters");
    }
  };

  const loadResults = async () => {
    try {
      setLoading(true);

      const res = await api.get("/results/admin", {
        params: {
          examId,
          classId,
          sectionId,
          subjectId,
        },
      });

      setResults(res.data.data || []);
      setSummary(res.data.summary || null);
    } catch (err) {
      console.error("Failed loading results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadResults();
  }, [examId, classId, sectionId, subjectId]);

  const filteredResults = results.filter((r) =>
    r.studentId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = filteredResults.map((r) => ({
      Student: r.studentId?.name,
      Exam: r.examId?.name,
      Subject: r.subjectId?.name,
      Marks: r.marks,
      Percentage: ((r.marks / r.maxMarks) * 100).toFixed(2) + "%",
    }));

    const csv =
      "Student,Exam,Subject,Marks,Percentage\n" +
      rows
        .map(
          (r) =>
            `${r.Student},${r.Exam},${r.Subject},${r.Marks},${r.Percentage}`
        )
        .join("\n");

    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "results.csv";
    a.click();
  };

  return (
    <div className="space-y-6 pb-10">
      <h2 className="text-2xl font-bold text-gray-800">Result Dashboard</h2>

      {/* Filters */}

      <div className="grid md:grid-cols-5 gap-3 bg-white p-4 rounded shadow">
        <select
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Exams</option>
          {exams.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>

        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Sections</option>
          {sections.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Summary Cards */}

      {summary && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Average Marks</p>
            <p className="text-2xl font-bold">{summary.average}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Topper</p>
            <p className="text-lg font-bold">{summary.topper}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Total Students</p>
            <p className="text-2xl font-bold">{summary.total}</p>
          </div>

          <div className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Export Data</p>
              <p className="text-sm">Download CSV</p>
            </div>

            <button
              onClick={exportCSV}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Export
            </button>
          </div>
        </div>
      )}

      {/* Result Table */}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3">Exam</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Marks</th>
              <th className="p-3">%</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  Loading results...
                </td>
              </tr>
            )}

            {!loading && filteredResults.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}

            {!loading &&
              filteredResults.map((r) => {
                const marks = Number(r.marks);
                const maxMarks = Number(r.maxMarks) || 100; // default to 100 if not provided
                const percent = ((marks / maxMarks) * 100).toFixed(1);
                const pass = Number(percent) >= 40; // determines pass/fail

                return (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.studentId?.name}</td>

                    <td className="p-3 text-center">{r.examId?.name}</td>

                    <td className="p-3 text-center">{r.subjectId?.name}</td>

                    <td className="p-3 text-center font-semibold">{r.marks}</td>

                    <td className="p-3 text-center">{percent}%</td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          pass
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pass ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminResultPanel;
