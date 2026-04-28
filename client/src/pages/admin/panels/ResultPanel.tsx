import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiAward,
  FiBarChart2,
  FiChevronDown,
  FiSearch,
  FiStar,
  FiUsers,
  FiX,
} from "react-icons/fi";

const ResultCard = ({ title, value, color, icon }: any) => (
  <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4 flex-1">
    <div
      className={`p-3 rounded-full bg-${color}-100 text-${color}-600 text-xl flex items-center justify-center`}
    >
      {icon}
    </div>
    <div className="flex flex-col">
      <p className="text-gray-500 font-medium">{title}</p>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </div>
  </div>
);

const AdminResultPanel = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setSectionId(""); // ✅ reset section when class changes
  }, [classId]);

  // Load filters
  const load = async () => {
    try {
      const [e, c, s] = await Promise.all([
        api.get("/admin/exams"),
        api.get("/admin/classes"),
        api.get("/admin/sections"),
      ]);
      setExams(e.data.data || []);
      setClasses(c.data.data || []);
      setSections(s.data.data || []);
    } catch (err) {
      console.error("Failed loading filters");
    }
  };

  // Load results
  const loadResults = async () => {
    try {
      // Only fetch if all three filters are selected
      if (!examId || !classId || !sectionId) {
        setResults([]);
        setSummary(null);
        return; // Skip API call
      }

      setLoading(true);
      const params: any = {
        examId,
        classId,
        sectionId,
      };

      const res = await api.get("/admin/results", { params });
      setResults(res.data.data || []);
      setSummary(res.data.summary || null);
    } catch (err) {
      console.error("Failed loading results", err);
      setResults([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFilters = async () => await load();
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchResults = async () => await loadResults();
    fetchResults();
  }, [examId, classId, sectionId]);

  // useEffect(() => {
  //   console.log("API Results:", results);
  // }, [results]);

  const selectedExamName = useMemo(() => {
    return exams.find((e) => e._id === examId)?.name || "-";
  }, [examId, exams]);

  // ✅ Consolidated results
  const consolidatedResults = useMemo(() => {
    const map: Record<string, any> = {};

    results.forEach((r) => {
      if (!r?.studentId?._id) return;

      const key = r.studentId._id;

      if (!map[key]) {
        map[key] = {
          studentName: r.studentId.name || "N/A",
          examName: r.examSubjectId?.examId?.name || "N/A",
          totalMarks: 0,
          maxMarks: 0,
          subjects: [],
        };
      }

      const marks = Number(r.marks ?? 0);
      const maxMarks = Number(r.maxMarks ?? 100);

      map[key].totalMarks += marks;
      map[key].maxMarks += maxMarks;

      map[key].subjects.push({
        name: r.examSubjectId?.subjectId?.name || "N/A",
        marks,
      });
    });

    return Object.values(map).map((item: any) => {
      const percent = item.maxMarks
        ? (item.totalMarks / item.maxMarks) * 100
        : 0;

      return {
        ...item,
        percentage: percent.toFixed(1),
        status: percent >= 40 ? "Pass" : "Fail",
      };
    });
  }, [results]);

  const passPercentage = useMemo(() => {
    if (!consolidatedResults.length) return 0;

    const passed = consolidatedResults.filter(
      (r: any) => r.status === "Pass"
    ).length;

    return ((passed / consolidatedResults.length) * 100).toFixed(1);
  }, [consolidatedResults]);

  // ✅ Search
  const filteredResults = useMemo(() => {
    return consolidatedResults.filter((r: any) =>
      r.studentName.toLowerCase().includes(search.toLowerCase())
    );
  }, [consolidatedResults, search]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredResults.slice(start, start + itemsPerPage);
  }, [filteredResults, currentPage, itemsPerPage]);

  // ✅ Export CSV
  const exportCSV = () => {
    const rows = filteredResults.map((r: any) => ({
      Student: r.studentName,
      Exam: r.examName,
      Subjects: r.subjects.map((s: any) => `${s.name}: ${s.marks}`).join(" | "),
      Total: r.totalMarks,
      Percentage: r.percentage + "%",
      Status: r.status,
    }));

    const csv =
      "Student,Exam,Subjects,Total,Percentage,Status\n" +
      rows
        .map(
          (r: any) =>
            `${r.Student},${r.Exam},${r.Subjects},${r.Total},${r.Percentage},${r.Status}`
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
    <div className="space-y-4 pb-8">
      <div className="sticky flex justify-between items-center top-0 z-20 bg-gray-100 py-1 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Result Dashboard</h2>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Exam
          </label>
          <div className="relative">
            <select
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full border rounded-md px-4 py-2 pr-8 appearance-none shadow 
              focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
            >
              <option value="">All Exams</option>
              {exams.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Class
          </label>
          <div className="relative">
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full border rounded-md px-4 py-2 pr-8 appearance-none shadow 
              focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Section
          </label>
          <div className="relative">
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              disabled={!classId}
              className="w-full border rounded-md px-4 py-2 pr-8 appearance-none shadow 
              focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-500"
            >
              <option value="">
                {classId ? "Select Section" : "Select Class First"}
              </option>
              {sections
                .filter(
                  (s) => s.classId?._id === classId || s.classId === classId
                )
                .map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Summary */}

      <div className="flex flex-col sm:flex-row justify-between gap-8">
        <ResultCard
          title="Total Students"
          value={summary?.total || 0}
          color="blue"
          icon={<FiUsers />}
        />
        <ResultCard
          title="Result %"
          value={`${passPercentage}%`}
          color="green"
          icon={<FiBarChart2 />}
        />
        <ResultCard
          title="Topper"
          value={summary?.topper || "-"}
          color="yellow"
          icon={<FiAward />}
        />
        <ResultCard
          title="Average Marks"
          value={summary?.average || 0}
          color="purple"
          icon={<FiStar />}
        />
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Results</h3>

          <div className="flex gap-4">
            <button
              onClick={exportCSV}
              title="Download the results in CSV"
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
            >
              Export CSV
            </button>

            <div className="flex items-center border rounded-lg overflow-hidden">
              <FiSearch className="text-gray-400 ml-2" />
              <input
                placeholder="Search student..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-64 px-3 py-1.5 text-sm outline-none"
              />
              <FiX
                className={`text-gray-400 cursor-pointer mr-2 ${
                  search ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setSearch("")}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-100 text-xs font-semibold text-gray-700 uppercase">
              <tr>
                <th className="p-3 text-left">Student Name</th>
                <th className="p-3">Exam</th>
                {/* <th className="p-3">Subjects</th> */}
                <th className="p-3">Total Marks</th>
                <th className="p-3">Percentage %</th>
                <th className="p-3">Result</th>
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

              {!loading && paginatedResults.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedResults.map((r: any, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 text-center"
                  >
                    <td className="p-3 text-left">{r.studentName}</td>
                    <td className="p-3 text-sm">{selectedExamName}</td>
                    {/* <td className="p-3 text-center text-xs">
                      {r.subjects
                        .map((s: any) => `${s.name}: ${s.marks}`)
                        .join(", ")}
                    </td> */}
                    <td className="p-3">{r.totalMarks}</td>
                    <td className="p-3">{r.percentage}%</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${
                          r.status === "Pass"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <div>
            <label className="mr-2 text-sm">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border px-2 py-1 text-sm"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="items-center text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

export default AdminResultPanel;
