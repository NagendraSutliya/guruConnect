import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const nav = useNavigate();

  const login = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      const data = res.data.data;
      console.log("Login response:", data); // <-- ADD THIS

      localStorage.setItem("role", "admin");
      localStorage.setItem("adminToken", data.token);

      // ✅ THIS IS YOUR REAL ADMIN USER
      const adminUser = {
        _id: data._id,
        instituteName: data.instituteName,
        email: data.email,
      };
      localStorage.setItem("admin", JSON.stringify(adminUser));
      setUser(adminUser);
      // DEBUG: check if token is stored
      console.log("Stored token:", localStorage.getItem("adminToken"));

      setTimeout(() => {
        nav("/admin/dashboard");
      }, 0);
    } catch (err: any) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center">
      <div className="h-screen flex items-center -mt-16">
        <div className="bg-white p-10 rounded-xl shadow-xl w-[400px]">
          <h2 className="flex justify-center text-2xl font-bold mb-6">
            Admin Login
          </h2>
          <input
            className="border p-2 w-full mb-3"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-6"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
