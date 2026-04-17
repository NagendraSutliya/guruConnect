import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  X,
  BookOpen,
  Layers,
  Table2,
  LayoutGrid,
  RefreshCcw,
  Layers2,
} from "lucide-react";
import Toast, { type ToastProps } from "../../../components/Toast";
import { FiSearch, FiX } from "react-icons/fi";

const Card = ({ title, value, color, icon }: any) => (
  <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4 flex-1">
    <div className={`p-3 text-${color}-600 flex items-center justify-center`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <p className="text-gray-500 font-medium">{title}</p>
      <p className={`text-xl font-bold text-${color}-600`}>{value}</p>
    </div>
  </div>
);

export default function MyAssignmentsPanel() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Omit<ToastProps, "onClose"> | null>(null);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [view, setView] = useState<"table" | "card">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const stats = useMemo(() => {
    return {
      total: list.length,
      classes: new Set(list.map((i) => i.classId?.name)).size,
      subjects: new Set(list.map((i) => i.subjectId?.name)).size,
    };
  }, [list]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  return (
    <div className="space-y-4 pb-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            📚 My Assignments
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all your assigned classes in one place
          </p>
        </div>

        <div className="flex gap-2 items-center mt-10">
          {/* REFRESH */}
          <button
            onClick={load}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-1 rounded-lg shadow transition
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
          <div className="bg-white flex items-center border rounded-lg overflow-hidden shadow">
            <FiSearch className="text-gray-400 ml-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search class, subject..."
              className="flex-grow px-2 py-1 outline-none"
            />
            <FiX
              className={`text-gray-400 cursor-pointer mr-2 ${
                search ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSearch("")}
            />
          </div>

          {/* VIEW SWITCH */}
          <div className="flex bg-white border rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1 flex items-center gap-2 text-sm ${
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
              className={`px-3 py-1 flex items-center gap-2 text-sm ${
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
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <Card
          title="Total"
          value={stats.total}
          color="blue"
          icon={<BookOpen />}
        />
        <Card
          title="Classes"
          value={stats.classes}
          color="purple"
          icon={<Layers />}
        />
        <Card
          title="Subjects"
          value={stats.subjects}
          color="yellow"
          icon={<Layers2 />}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-4 animate-pulse h-40" />
      )}

      {/* TABLE VIEW */}
      {!loading && view === "table" && (
        <div className="bg-white border rounded-2xl shadow-sm px-6 pt-4 pb-2 space-y-2 ">
          <h3 className="text-lg font-semibold">Assignments</h3>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-green-100 text-sm font-semibold text-gray-700 uppercase">
                <tr>
                  <th className="p-3">Class</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 p-8">
                      {search
                        ? "No assignments match your search."
                        : "No assignments available."}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((a) => (
                    <tr
                      key={a._id}
                      className="border-b hover:bg-gray-50 text-center"
                    >
                      <td className="p-3">{a.classId?.name}</td>
                      <td className="p-3">{a.sectionId?.name}</td>
                      <td className="p-3">{a.subjectId?.name}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelected(a)}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CARD VIEW */}
      {!loading && view === "card" && paginatedData.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedData.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Class: {a.classId?.name}
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

      {/* EMPTY */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">No assignments found</p>
        </div>
      )}

      {/* PAGINATION (SHARED) */}
      {!loading && filtered.length > 0 && (
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
              className="border rounded-md px-2 py-1 text-sm"
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
