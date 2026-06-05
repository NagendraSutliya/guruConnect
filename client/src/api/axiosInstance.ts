import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const role = localStorage.getItem("role");

  let token = null;

  if (role === "admin") token = localStorage.getItem("adminToken");
  if (role === "teacher") token = localStorage.getItem("teacherToken");
  if (role === "student") token = localStorage.getItem("studentToken");

  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

export default axiosInstance;
