import { useState } from "react";
import { FiX } from "react-icons/fi";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";

type Props = {
  editData: any;
  setEditData: (data: any) => void;
  refreshList: () => void; // refresh parent table
};

const UpdateExamSubjectModal = ({
  editData,
  setEditData,
  refreshList,
}: Props) => {
  const { showToast } = useToast();
  const [localData, setLocalData] = useState(editData);
  const [loading, setLoading] = useState(false);

  if (!editData) return null;

  // --- Update function ---
  const handleUpdate = async () => {
    if (!localData.startTime || !localData.endTime || !localData.date) {
      return showToast("Date, start and end time are required", "warn");
    }

    try {
      setLoading(true);
      const payload = {
        date: localData.date,
        startTime: localData.startTime,
        endTime: localData.endTime,
        maxMarks: localData.maxMarks,
      };

      await api.put(`/admin/exam-subjects/${localData._id}`, payload);
      showToast("Exam subject updated successfully", "success");
      setEditData(null);
      refreshList();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setEditData(null)}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-2">
          <h3 className="text-lg font-semibold">Edit Exam Subject</h3>
          <FiX
            className="cursor-pointer text-gray-500 hover:text-black"
            onClick={() => setEditData(null)}
          />
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Subject Name - Display Only */}
          <div className="flex flex-col gap-y-1">
            <label className="text-sm text-gray-600">Subject</label>
            <input
              type="text"
              value={localData.subjectId?.name || ""}
              readOnly
              className="border px-2 py-1 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Editable fields */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-y-1 w-1/2">
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                value={localData.date.split("T")[0]}
                onChange={(e) =>
                  setLocalData({ ...localData, date: e.target.value })
                }
                className="border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className="flex flex-col gap-y-1 w-1/2">
              <label className="text-sm text-gray-600">Max Marks</label>
              <input
                type="number"
                value={localData.maxMarks}
                onChange={(e) =>
                  setLocalData({
                    ...localData,
                    maxMarks: Number(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-y-1 w-1/2">
              <label className="text-sm text-gray-600">Start Time</label>
              <input
                type="time"
                value={localData.startTime}
                onChange={(e) =>
                  setLocalData({ ...localData, startTime: e.target.value })
                }
                className="border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div className="flex flex-col gap-y-1 w-1/2">
              <label className="text-sm text-gray-600">End Time</label>
              <input
                type="time"
                value={localData.endTime}
                onChange={(e) =>
                  setLocalData({ ...localData, endTime: e.target.value })
                }
                className="border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <button
            onClick={() => setEditData(null)}
            className="bg-gray-100 text-gray-700 px-6 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
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

export default UpdateExamSubjectModal;
