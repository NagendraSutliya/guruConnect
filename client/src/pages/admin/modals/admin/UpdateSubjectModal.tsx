import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Toast from "../../../../components/Toast";
import api from "../../../../api/axiosInstance";
import type { Subject } from "../../../../types/admin/subject";
import type { Class } from "../../../../types/admin/class";
import type { Section } from "../../../../types/admin/section";

type Props = {
  subject: Subject;
  classes: Class[];
  sections: Section[];
  onClose: () => void;
  onUpdated?: () => void;
};

const UpdateSubjectModal = ({
  subject,
  classes,
  sections,
  onClose,
  onUpdated,
}: Props) => {
  const [name, setName] = useState(subject.name);
  const [selectedClass, setSelectedClass] = useState(subject.classId._id);
  const [selectedSection, setSelectedSection] = useState(
    subject.sectionId?._id || ""
  );
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );

  const showToast = (message: string, type: string = "info") =>
    setToast({ message, type });

  // Load sections for selected class
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  useEffect(() => {
    const filteredSections = sections.filter(
      (s) => s.classId?._id === selectedClass
    );
    setAvailableSections(filteredSections);
    if (!filteredSections.find((s) => s._id === selectedSection))
      setSelectedSection("");
  }, [selectedClass, sections]);

  const handleSave = async () => {
    if (!name.trim() || !selectedClass) {
      showToast("Subject name and class are required", "warn");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/subjects/${subject._id}`, {
        name,
        classId: selectedClass,
        sectionId: selectedSection || undefined,
        code: subject.code, // keep existing code
      });

      showToast("Subject updated successfully", "success");
      onUpdated?.();
      onClose();
    } catch (err: any) {
      console.log(err);
      showToast("Failed to update subject", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-auto space-y-4">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type as any}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Edit Subject</h3>
          <FiX className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
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
            <label className="text-sm text-gray-600">Section (Optional)</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedClass}
              className="border p-2 rounded"
            >
              <option value="">All Sections</option>
              {availableSections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Subject Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subject name"
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-2 mt-4">
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

export default UpdateSubjectModal;
