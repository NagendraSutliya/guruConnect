import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") return <Navigate to="/auth/login" replace />;
  return children;
};

export default AdminRoute;
