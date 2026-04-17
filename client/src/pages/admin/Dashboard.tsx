import StatsCards from "../../components/admin/StatsCards";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No admin found</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome 👋 Mr. {user.instituteName} <br />
      </h1>
      <StatsCards />
    </div>
  );
}
