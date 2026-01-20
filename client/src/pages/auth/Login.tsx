import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const nav = useNavigate();

  const login = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      // localStorage.setItem("adminToken", res.data.token);
      // localStorage.setItem("role", res.data.role);
      // localStorage.setItem("institute", res.data.institute);
      // localStorage.setItem("instituteCode", res.data.instituteCode);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("role", "admin");

      nav("/admin/dashboard");
    } catch (err: any) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-10 rounded-xl shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-6"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
