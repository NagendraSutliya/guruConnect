import React from "react";

interface Props {
  teacher: any;
  onClose: () => void;
}

const ViewTeacherModal: React.FC<Props> = ({ teacher, onClose }) => {
  if (!teacher) return null;

  const initials = teacher.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition text-lg font-bold"
        >
          ×
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-3">
          {teacher.profilePic ? (
            <img
              src={teacher.profilePic}
              alt={teacher.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold">
              {initials}
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-800">{teacher.name}</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              teacher.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {teacher.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Info Section */}
        <div className="space-y-2 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <p>
              <strong>Email:</strong> {teacher.email}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p>
              <strong>Joined:</strong>{" "}
              {teacher.createdAt
                ? new Date(teacher.createdAt).toLocaleDateString("en-GB")
                : "—"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p>
              <strong>Department:</strong> {teacher.department || "—"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p>
              <strong>Subjects:</strong>{" "}
              {teacher.subjects?.length > 0 ? teacher.subjects.join(", ") : "—"}
            </p>
          </div>

          {teacher.bio && (
            <p className="mt-2 text-gray-600">
              <strong>Bio:</strong> {teacher.bio}
            </p>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTeacherModal;
