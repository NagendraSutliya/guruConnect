import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

const StudentProfile = ({ close }: any) => {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/student/dashboard");
      setStudent(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!student) return null;

  const avatarLetter = student.name?.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          onClick={close}
          className="absolute right-4 top-3 text-gray-500 text-lg"
        >
          ✕
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          {student.profileImage ? (
            <img
              src={student.profileImage}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-semibold">
              {avatarLetter}
            </div>
          )}

          <h2 className="mt-3 text-xl font-semibold">{student.name}</h2>
          <p className="text-gray-500 text-sm">{student.email}</p>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Class:</strong> {student.classId?.name}
          </p>
          <p>
            <strong>Section:</strong> {student.sectionId?.name}
          </p>
          <p>
            <strong>Roll No:</strong> {student.rollNo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
