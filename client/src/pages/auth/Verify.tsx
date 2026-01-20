import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axiosInstance";

const Verify = () => {
  const [params] = useSearchParams();
  const [code, setCode] = useState("");
  const nav = useNavigate();
  const email = params.get("email") || "";
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!code) return alert("Enter verification code");
    try {
      setLoading(true);
      await api.post("/auth/verify", { email, code });
      alert("Email verified seuccessfully");
      nav("/auth/login");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white p-10 rounded-xl shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold mb-6">Enter Verification Code</h2>
        <p className="text-sm text-gray-500 mb-6">
          We sent a verification code to <b>{email}</b>
        </p>
        <input
          value={code}
          placeholder="Enter code"
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full mb-6"
        />
        <button
          onClick={verify}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </div>
    </div>
  );
};

export default Verify;
