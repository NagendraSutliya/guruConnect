import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Toast from "../../../components/Toast";
import type { AcademicYear } from "../../../types/academicYear";

// --- Helper: default session dates ---
const getDefaultSessionDates = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  let startYear, endYear;
  if (month < 7) {
    startYear = year - 1;
    endYear = year;
  } else {
    startYear = year;
    endYear = year + 1;
  }

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // July 1 → month = 6 (0-indexed), April 30 → month = 3
  const startDate = formatLocalDate(new Date(startYear, 6, 1)); // 1 July
  const endDate = formatLocalDate(new Date(endYear, 3, 31)); // 31 March
  const name = `${startYear}-${endYear}`;

  return { startDate, endDate, name };
};

type SortColumn = "name" | "startDate" | "endDate" | "status";
type SortOrder = "asc" | "desc";

const AcademicYearsPanel = () => {
  const defaultDates = getDefaultSessionDates();

  const [years, setYears] = useState<AcademicYear[]>([]);
  const [form, setForm] = useState({
    name: defaultDates.name,
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type?: string;
  } | null>(null);

  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null); // sorting disabled by default
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // --- Toast ---
  const showToast = (
    message: string,
    type: "success" | "error" | "warn" | "info" = "info"
  ) => {
    setToastMessage({ message, type });
  };

  // --- Load Academic Years ---
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/academic/academic-year");
      setYears(res.data.data);
    } catch {
      showToast("Failed to load academic years", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // --- Add/Edit Year ---
  const handleSubmit = async () => {
    if (!form.name || !form.startDate || !form.endDate)
      return showToast("Fill all fields!", "warn");

    setLoading(true);
    try {
      if (editId) {
        await api.put(`/academic/academic-year/${editId}`, form);
        showToast("Academic year updated!", "success");
      } else {
        await api.post("/academic/academic-year", form);
        showToast("Academic year added!", "success");

        // Auto-increment to next session
        const nextStart = new Date(
          new Date(form.startDate).getFullYear() + 1,
          6,
          1
        )
          .toISOString()
          .split("T")[0];
        const nextEnd = new Date(
          new Date(form.endDate).getFullYear() + 1,
          2,
          31
        )
          .toISOString()
          .split("T")[0];
        const nextName = `${new Date(nextStart).getFullYear()}-${new Date(
          nextEnd
        ).getFullYear()}`;
        setForm({ name: nextName, startDate: nextStart, endDate: nextEnd });
      }
      setEditId(null);
      load();
    } catch {
      showToast("Operation failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Activate Year ---
  const activate = async (id: string) => {
    if (!confirm("Activate this academic year? This will deactivate others."))
      return;
    setLoading(true);
    try {
      await api.patch(`/academic/academic-year/${id}/activate`);
      showToast("Activated!", "success");
      load();
    } catch {
      showToast("Failed to activate", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Year ---
  const remove = async (id: string) => {
    if (!confirm("Delete this academic year?")) return;
    setLoading(true);
    try {
      await api.delete(`/academic/academic-year/${id}`);
      showToast("Deleted!", "success");
      load();
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Edit Year ---
  const edit = (year: AcademicYear) => {
    setForm({
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate,
    });
    setEditId(year._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Sorting ---
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedYears = [...years]
    .filter(
      (y) =>
        y.name.toLowerCase().includes(search.toLowerCase()) ||
        (y.isActive ? "active" : "inactive").includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortColumn) return 0; // sorting disabled by default

      let aVal: any, bVal: any;
      switch (sortColumn) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "startDate":
          aVal = new Date(a.startDate).getTime();
          bVal = new Date(b.startDate).getTime();
          break;
        case "endDate":
          aVal = new Date(a.endDate).getTime();
          bVal = new Date(b.endDate).getTime();
          break;
        case "status":
          aVal = a.isActive ? 1 : 0;
          bVal = b.isActive ? 1 : 0;
          break;
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const renderSortArrow = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type as any}
          onClose={() => setToastMessage(null)}
        />
      )}

      <h2 className="text-2xl font-bold text-gray-800">Academic Years</h2>

      {/* Search */}
      <input
        placeholder="Search by name or status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded p-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Form */}
      <div className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-end gap-4 mt-4">
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium text-gray-600">Year</label>
          <input
            placeholder="2026-2027"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">
            Start Date
          </label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">End Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-gray-100 cursor-pointer">
              <tr>
                <th
                  className="text-left p-3"
                  onClick={() => handleSort("name")}
                >
                  Name{renderSortArrow("name")}
                </th>
                <th
                  className="text-left p-3"
                  onClick={() => handleSort("startDate")}
                >
                  Start{renderSortArrow("startDate")}
                </th>
                <th
                  className="text-left p-3"
                  onClick={() => handleSort("endDate")}
                >
                  End{renderSortArrow("endDate")}
                </th>
                <th
                  className="text-left p-3"
                  onClick={() => handleSort("status")}
                >
                  Status{renderSortArrow("status")}
                </th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedYears.map((y) => (
                <tr
                  key={y._id}
                  className={`border-t ${
                    y.isActive
                      ? "bg-green-50 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="p-3">{y.name}</td>
                  <td className="p-3">
                    {new Date(y.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {new Date(y.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        y.isActive
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {y.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 space-x-2 text-right">
                    {!y.isActive && (
                      <button
                        onClick={() => activate(y._id)}
                        className="text-blue-600 hover:underline"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => edit(y)}
                      className="text-yellow-600 hover:underline"
                    >
                      <FiEdit size={14} />
                      {/* Edit */}
                    </button>
                    <button
                      onClick={() => remove(y._id)}
                      className="text-red-600 hover:underline"
                    >
                      <FiTrash2 size={14} />
                      {/* Delete */}
                    </button>
                  </td>
                </tr>
              ))}
              {sortedYears.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    No academic years found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AcademicYearsPanel;
