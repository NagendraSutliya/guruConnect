import { Navigate } from "react-router-dom";

const TeacherRoute = ({ children }: any) => {
  const token = localStorage.getItem("teacherToken");
  return token ? children : <Navigate to="/teacher/login" />;
};

export default TeacherRoute;
