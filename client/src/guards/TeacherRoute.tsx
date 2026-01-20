import { Navigate } from "react-router-dom";

export default function TeacherRoute({ children }: any) {
  const token = localStorage.getItem("teacherToken");
  return token ? children : <Navigate to="/teacher/login" />;
}
