import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";
import {
  FiEdit,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiSearch,
  FiX,
} from "react-icons/fi";
import Toast from "../../../components/Toast";
import type { AcademicYear } from "../../../types/admin/academicYear";
import UpdateAcademicYearModal from "../../modals/admin/UpdateAcademicYearModal";

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
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return {
    startDate: formatLocalDate(new Date(startYear, 6, 1)),
    endDate: formatLocalDate(new Date(endYear, 3, 31)),
    name: `${startYear}-${endYear}`,
  };
};

// --- Date Format MM-DD-YYYY for display ---
const formatDate = (date: string) => {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};

const AcademicYearsPanel = () => {
  const defaultDates = getDefaultSessionDates();

  const [years, setYears] = useState<AcademicYear[]>([]);
  const [form, setForm] = useState(defaultDates);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<any>(null);

  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const showToast = (message: string, type = "info") =>
    setToastMessage({ message, type });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/academic/academic-year");
      setYears(res.data.data);
    } catch {
      showToast("Failed to load", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.startDate || !form.endDate)
      return showToast("Fill all fields", "warn");

    setLoading(true);
    try {
      await api.post("/academic/academic-year", form);
      showToast("Added", "success");
      setForm(defaultDates);
      load();
    } catch {
      showToast("Error", "error");
    } finally {
      setLoading(false);
    }
  };

  const activate = async (id: string) => {
    await api.patch(`/academic/academic-year/${id}/activate`);
    load();
  };

  const deactivate = async (id: string) => {
    await api.patch(`/academic/academic-year/${id}/deactivate`);
    load();
  };

  const remove = async (id: string) => {
    await api.delete(`/academic/academic-year/${id}`);
    load();
  };

  const edit = (y: AcademicYear) => {
    setEditingYear(y);
  };

  // Filter + paginate
  const filtered = years.filter(
    (y) =>
      y.name.toLowerCase().includes(search.toLowerCase()) ||
      (y.isActive ? "active" : "inactive").includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 pb-8">
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="sticky flex justify-between items-center top-0 z-20 bg-gray-100 py-1 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Academic Years</h2>
      </div>

      {/* Add New Year Form */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Year</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-md shadow px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Year (e.g. 2025-2026)"
          />
        </div>
        <div className="flex-grow flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">
            Session Start
          </label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border rounded-md shadow px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex-grow flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">
            Session End
          </label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="border rounded-md shadow px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex-1 flex items-end">
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow whitespace-nowrap"
          >
            {loading ? "Loading..." : "Add Session"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Years</h3>
          <div className="bg-white flex items-center border rounded-lg overflow-hidden shadow">
            <FiSearch className="text-gray-400 ml-2" />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm outline-none"
            />
            <FiX
              className={`text-gray-400 cursor-pointer mr-2 ${
                search ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSearch("")}
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-green-100 text-xs font-semibold text-gray-700 uppercase text-left">
              <tr>
                <th className="p-3 ">Name</th>
                <th className="p-3 ">Start</th>
                <th className="p-3 ">End</th>
                <th className="p-3 ">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Loading academic years...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No academic years found
                  </td>
                </tr>
              ) : (
                paginated.map((y) => (
                  <tr key={y._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{y.name}</td>
                    <td className="p-3 text-sm">{formatDate(y.startDate)}</td>
                    <td className="p-3 text-sm">{formatDate(y.endDate)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          y.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {y.isActive ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="p-3 flex justify-end gap-1">
                      <button
                        onClick={() =>
                          y.isActive ? deactivate(y._id) : activate(y._id)
                        }
                        className={`p-1 rounded ${
                          y.isActive
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={y.isActive ? "Deactivate" : "Activate"}
                      >
                        {y.isActive ? <FiToggleLeft /> : <FiToggleRight />}
                      </button>

                      <button
                        onClick={() => edit(y)}
                        className="text-yellow-600 p-1 rounded hover:bg-yellow-50"
                      >
                        <FiEdit />
                      </button>

                      <button
                        onClick={() => remove(y._id)}
                        className="text-red-600 p-1 rounded hover:bg-red-50"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
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

      {/* Modal */}
      {editingYear && (
        <UpdateAcademicYearModal
          year={editingYear}
          onClose={() => setEditingYear(null)}
          onUpdated={load} // refresh table after update
        />
      )}
    </div>
  );
};

export default AcademicYearsPanel;
