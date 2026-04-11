import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  X,
  BookOpen,
  Layers,
  Users,
  Table2,
  LayoutGrid,
  RefreshCcw,
} from "lucide-react";

export default function MyAssignmentsPanel() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [view, setView] = useState<"table" | "card">("table");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/teacher-assign/my");
      setList(res.data.data || []);
    } catch (e) {
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return list.filter((a) =>
      `${a.classId?.name} ${a.sectionId?.name} ${a.subjectId?.name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [list, search]);

  const stats = useMemo(() => {
    return {
      total: list.length,
      classes: new Set(list.map((i) => i.classId?.name)).size,
      subjects: new Set(list.map((i) => i.subjectId?.name)).size,
    };
  }, [list]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            📚 My Assignments
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all your assigned classes in one place
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {/* 🔄 REFRESH BUTTON (NEW) */}
          <button
            onClick={load}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow transition
              ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search class, subject..."
            className="px-4 py-2 border rounded-xl w-full md:w-80 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
          />

          {/* VIEW SWITCH */}
          <div className="flex bg-white border rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-2 flex items-center gap-2 text-sm ${
                view === "table"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Table2 size={16} />
              Table
            </button>

            <button
              onClick={() => setView("card")}
              className={`px-3 py-2 flex items-center gap-2 text-sm ${
                view === "card" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              <LayoutGrid size={16} />
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
          <BookOpen className="text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
          <Layers className="text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Classes</p>
            <p className="text-xl font-bold">{stats.classes}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow flex items-center gap-3">
          <Users className="text-purple-500" />
          <div>
            <p className="text-gray-500 text-sm">Subjects</p>
            <p className="text-xl font-bold">{stats.subjects}</p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-4 animate-pulse h-40" />
      )}

      {/* TABLE VIEW */}
      {!loading && view === "table" && filtered.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-3">Class</th>
                <th className="p-3">Section</th>
                <th className="p-3">Subject</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{a.classId?.name}</td>
                  <td className="p-3">{a.sectionId?.name}</td>
                  <td className="p-3">{a.subjectId?.name}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelected(a)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CARD VIEW */}
      {!loading && view === "card" && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {a.classId?.name}
              </h3>

              <p className="text-sm text-gray-600">
                Section: {a.sectionId?.name}
              </p>

              <p className="text-sm text-gray-600 mb-4">
                Subject: {a.subjectId?.name}
              </p>

              <button
                onClick={() => setSelected(a)}
                className="text-blue-600 text-sm hover:underline"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">No assignments found</p>
        </div>
      )}

      {/* DRAWER */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-end">
          <div className="w-full md:w-[400px] bg-white h-full p-5 shadow-lg relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">Assignment Details</h2>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Class:</strong> {selected.classId?.name}
              </p>
              <p>
                <strong>Section:</strong> {selected.sectionId?.name}
              </p>
              <p>
                <strong>Subject:</strong> {selected.subjectId?.name}
              </p>
              <p>
                <strong>ID:</strong> {selected._id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
