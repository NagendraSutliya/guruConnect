import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // const [form, setForm] = useState({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      console.log("Login response:", res.data); // <-- ADD THIS

      localStorage.setItem("adminToken", res.data.data.token);
      localStorage.setItem("role", "admin");

      // DEBUG: check if token is stored
      console.log("Stored token:", localStorage.getItem("adminToken"));

      nav("/admin/dashboard");
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

export default Login;
