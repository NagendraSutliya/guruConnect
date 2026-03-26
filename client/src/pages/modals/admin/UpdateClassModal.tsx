import { useState } from "react";
import { FiX } from "react-icons/fi";
import Toast from "../../../components/Toast";
import type { Class } from "../../../types/admin/class";
import type { AcademicYear } from "../../../types/admin/academicYear";
import api from "../../../api/axiosInstance";

type Props = {
  cls: Class;
  years: AcademicYear[];
  onClose: () => void;
  onUpdated?: () => void; // Optional callback to refresh parent data
};

const UpdateClassModal = ({ cls, years, onClose, onUpdated }: Props) => {
  const [name, setName] = useState(cls.name);
  const [academicYearId, setAcademicYearId] = useState(
    cls.academicYearId?._id || ""
  );
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );

  const showToast = (message: string, type: string = "info") =>
    setToast({ message, type });

  const handleSave = async () => {
    if (!name || !academicYearId) {
      showToast("All fields required", "warn");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/classes/${cls._id}`, { name, academicYearId });
      showToast("Class updated successfully", "success");
      onUpdated?.(); // refresh parent data if callback provided
      onClose(); // close modal
    } catch (err: any) {
      console.log(err);
      showToast("Failed to update class", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-auto space-y-4">
        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type as any}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Edit Class</h3>
          <FiX className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Academic Year</label>
            <select
              value={academicYearId}
              onChange={(e) => setAcademicYearId(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select academic year</option>
              {years.map((y) => (
                <option key={y._id} value={y._id}>
                  {y.name} {y.isActive ? "(Active)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Class Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter class name"
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-100 text-gray-700 px-6 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-4 py-1 rounded w-auto hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateClassModal;
