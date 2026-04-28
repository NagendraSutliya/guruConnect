import { FiX } from "react-icons/fi";
import type { Exam } from "../../../types/admin/exam";

type Props = {
  editExam: Exam | null;
  setEditExam: (exam: Exam | null) => void;
  updateExam: () => void;
};

const EditExamModal = ({ editExam, setEditExam, updateExam }: Props) => {
  if (!editExam) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Edit Exam</h3>
          <FiX className="cursor-pointer" onClick={() => setEditExam(null)} />
        </div>

        <input
          value={editExam.name}
          onChange={(e) => setEditExam({ ...editExam, name: e.target.value })}
          className="border p-2 rounded w-full"
        />

        <div className="flex items-center justify-between">
          <button
            onClick={() => setEditExam(null)}
            className="bg-gray-100 text-gray-700 px-6 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={updateExam}
            className="bg-blue-600 text-white font-semibold px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExamModal;
