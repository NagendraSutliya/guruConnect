import { FiX } from "react-icons/fi";
// import type { Teacher, Class, Section, Subject, Assignment }
import type {
  Teacher,
  Assignment,
} from "../../../../types/admin/teacherassignment";
import type { Class } from "../../../../types/admin/class";
import type { Section } from "../../../../types/admin/section";
import type { Subject } from "../../../../types/admin/subject";

type Props = {
  assignment: Assignment;
  teachers: Teacher[];
  classes: Class[];
  sections: Section[];
  subjects: Subject[];
  loading: boolean;
  onClose: () => void;
  onUpdate: (updated: Assignment) => void;
  updateAssignment: () => void;
};

const UpdateTeacherAssignmentModal = ({
  assignment,
  teachers,
  classes,
  sections,
  subjects,
  loading,
  onClose,
  onUpdate,
  updateAssignment,
}: Props) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-auto space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Edit Assignment</h3>
          <FiX className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Teacher */}
          <select
            value={assignment.teacherId?._id || ""}
            onChange={(e) =>
              onUpdate({
                ...assignment,
                teacherId:
                  teachers.find((t) => t._id === e.target.value) ||
                  assignment.teacherId,
              })
            }
            className="border p-2 rounded"
          >
            <option value="">Select teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Class */}
          <select
            value={assignment.classId?._id || ""}
            onChange={(e) =>
              onUpdate({
                ...assignment,
                classId:
                  classes.find((c) => c._id === e.target.value) ||
                  assignment.classId,
                sectionId: null,
              })
            }
            className="border p-2 rounded"
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Section */}
          <select
            value={assignment.sectionId?._id || ""}
            onChange={(e) =>
              onUpdate({
                ...assignment,
                sectionId:
                  sections.find((s) => s._id === e.target.value) || null,
              })
            }
            className="border p-2 rounded"
          >
            <option value="">All / No Section</option>
            {sections
              .filter((s) => s.classId?._id === assignment.classId?._id)
              .map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
          </select>

          {/* Subject */}
          <select
            value={assignment.subjectId?._id || ""}
            onChange={(e) =>
              onUpdate({
                ...assignment,
                subjectId:
                  subjects.find((s) => s._id === e.target.value) ||
                  assignment.subjectId,
              })
            }
            className="border p-2 rounded"
          >
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={updateAssignment}
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded w-auto"
          >
            {loading ? "Updating..." : "Update Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTeacherAssignmentModal;
