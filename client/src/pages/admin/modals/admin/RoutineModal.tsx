import { useEffect, useState } from "react";
import type { Assignment } from "../../../../types/admin/teacherassignment";
import type { Routine } from "../../../../types/admin/routine";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (form: Routine) => void;
  subjects: Assignment[];
  initialData: Routine | null;
}

const RoutineModal = ({
  open,
  onClose,
  onSave,
  subjects,
  initialData,
}: Props) => {
  const [form, setForm] = useState<Routine>({
    classId: "",
    sectionId: "",
    subjectId: "",
    teacherId: "",
    day: "Monday",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleSubjectChange = (subjectId: string) => {
    const assign = subjects.find((s) => s.subjectId._id === subjectId);

    setForm((prev) => ({
      ...prev,
      subjectId,
      teacherId: assign?.teacherId._id || "",
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-fit space-y-3">
        <h3 className="font-semibold">
          {form._id ? "Edit Slot" : "Add Slot"} ({form.day})
        </h3>

        <select
          className="border p-2 w-full"
          value={form.subjectId}
          onChange={(e) => handleSubjectChange(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.subjectId._id} value={s.subjectId._id}>
              {s.subjectId.name}
            </option>
          ))}
        </select>

        <input
          type="time"
          className="border p-2 w-full"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
        />

        <input
          type="time"
          className="border p-2 w-full"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
        />

        <div className="flex justify-between gap-2 pt-6">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-6 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="bg-blue-600 text-white font-semibold px-4 py-1 rounded w-auto hover:bg-blue-700 transition disabled:opacity-50"
          >
            {form._id ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutineModal;
