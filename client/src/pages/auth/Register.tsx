import { useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    instituteName: "",
    instituteType: "school",
    email: "",
    password: "",
    confirm: "",
  });
  const nav = useNavigate();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirm) return alert("Password not match");

    try {
      await api.post("/auth/register", {
        instituteName: form.instituteName,
        instituteType: form.instituteType,
        email: form.email,
        password: form.password,
      });
      nav("/auth/verify?email=" + form.email);
    } catch (err: any) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center gap-3">
      <div className="bg-shite p-10 rounded-xl shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold mb-6">Create Institute Account</h2>
        <input
          name="instituteName"
          placeholder="Institute Name"
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />
        <select
          name="instituteType"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="school">School</option>
          <option value="tuition">Tuition</option>
        </select>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />
        <input
          name="confirm"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="border p-2 w-full mb-6"
          required
        />
        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
