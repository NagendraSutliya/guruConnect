import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const { setUser } = useAuth();

  const login = async () => {
    try {
      const res = await api.post("/auth/teacher/login", { email, password });

      const data = res.data.data;
      console.log("Login response:", data); // <-- ADD THIS

      localStorage.setItem("role", "teacher");
      localStorage.setItem("teacherToken", data.token);

      const teacherUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
      };

      localStorage.setItem("teacher", JSON.stringify(teacherUser));
      setUser(teacherUser);

      // DEBUG: check if token is stored
      console.log("Stored token:", localStorage.getItem("teacherToken"));

      setTimeout(() => {
        nav("/teacher/dashboard");
      }, 0);
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center">
      <div className="h-screen flex items-center -mt-16">
        <div className="bg-white p-10 rounded-xl shadow-xl w-[400px]">
          <h2 className="flex justify-center text-2xl font-bold mb-6">
            Teacher Login
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

export default TeacherLogin;
