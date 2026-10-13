import { Navigate } from "react-router-dom";

export default function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("superAdminToken");
  const role = localStorage.getItem("role");

  if (!token || role !== "superadmin") {
    return <Navigate to="/superadmin/login" replace />;
  }

  return <>{children}</>;
}
