import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/teacher/login", { email, password });
      localStorage.setItem("teacherToken", res.data.token);
      localStorage.setItem("role", "teacher");
      nav("/teacher/dashboard");
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Teacher Login</h2>
      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login} className="bg-black text-white px-4 py-2">
        Teacher Login
      </button>
    </div>
  );
};

export default TeacherLogin;
