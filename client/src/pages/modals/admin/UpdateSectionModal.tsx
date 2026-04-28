import { useState } from "react";
import { FiX } from "react-icons/fi";
import Toast from "../../../components/Toast";
import type { Section } from "../../../types/admin/section";
import type { Class } from "../../../types/admin/class";
import api from "../../../api/axiosInstance";

type Props = {
  section: Section;
  classes: Class[];
  onClose: () => void;
  onUpdated?: () => void;
};

const UpdateSectionModal = ({
  section,
  classes,
  onClose,
  onUpdated,
}: Props) => {
  const [name, setName] = useState(section.name);
  const [classId, setClassId] = useState(section.classId?._id || "");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );

  // ✅ SAME helper as your class modal
  const showToast = (message: string, type: string = "info") =>
    setToast({ message, type });

  const handleSave = async () => {
    if (!name || !classId) {
      showToast("All fields required", "warn");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/admin/sections/${section._id}`, { name, classId });

      showToast("Section updated successfully", "success");

      onUpdated?.(); // refresh parent
      onClose(); // close modal
    } catch (err: any) {
      console.log(err);
      showToast("Failed to update section", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-auto space-y-4">
        {/* ✅ SAME Toast placement */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type as any}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Edit Section</h3>
          <FiX className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Section Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter section name"
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
            className="bg-blue-600 text-white font-semibold px-4 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSectionModal;
