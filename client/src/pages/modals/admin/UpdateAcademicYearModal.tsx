import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import Toast from "../../../components/Toast";
import type { AcademicYear } from "../../../types/admin/academicYear";

interface UpdateAcademicYearModalProps {
  year: AcademicYear;
  onClose: () => void;
  onUpdated: () => void; // callback to refresh parent data
}

const UpdateAcademicYearModal: React.FC<UpdateAcademicYearModalProps> = ({
  year,
  onClose,
  onUpdated,
}) => {
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<any>(null);

  const showToast = (message: string, type = "info") =>
    setToastMessage({ message, type });

  useEffect(() => {
    if (year) {
      setForm({
        name: year.name,
        startDate: year.startDate.split("T")[0], // ensure yyyy-MM-dd format
        endDate: year.endDate.split("T")[0],
      });
    }
  }, [year]);

  const handleUpdate = async () => {
    if (!form.name || !form.startDate || !form.endDate)
      return showToast("Fill all fields", "warn");

    setLoading(true);
    try {
      console.log("Updating AcademicYear ID:", year._id, "with form:", form);
      await api.put(`/academic/academic-year/${year._id}`, form);
      showToast("Updated successfully", "success");
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="bg-white rounded-lg p-6 w-fit">
        <h2 className="text-xl font-semibold mb-4">Update Academic Year</h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Year</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded w-full"
              placeholder="e.g. 2025-2026"
            />
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-600">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="border px-2 py-1 rounded w-full"
              />
            </div>
          </div>

          <div className="flex justify-between gap-2 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-6 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white font-semibold px-4 py-1 rounded w-auto hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAcademicYearModal;
