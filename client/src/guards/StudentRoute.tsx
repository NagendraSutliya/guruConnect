import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const StudentRoute = ({ children }: { children: ReactNode }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("studentToken");

  if (!token || role !== "student")
    return <Navigate to="/student/login" replace />;

  return children;
};

export default StudentRoute;
