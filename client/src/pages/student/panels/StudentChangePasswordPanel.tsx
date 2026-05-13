import { useState } from "react";
import api from "../../../api/axiosInstance";
import { FiEye, FiEyeOff } from "react-icons/fi";

const StudentChangePasswordPanel = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const getPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getPasswordStrength(newPassword);
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"][strength - 1] || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setIsError(true);
      return setMessage("All fields are required.");
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      return setMessage("New passwords do not match.");
    }

    if (newPassword.length < 6) {
      setIsError(true);
      return setMessage("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);

      const res = await api.post("/student/change-password", {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      setIsError(false);
      setMessage(res.data.message || "Password updated successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Change Password
      </h2>

      {message && (
        <div
          className={`mb-4 text-sm text-center ${
            isError ? "text-red-500" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Current Password */}
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Current Password"
            className="border p-2 rounded w-full"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showCurrent ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="New Password"
            className="border p-2 rounded w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showNew ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Password Strength */}
        {newPassword && (
          <div className="text-xs">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded ${
                    strength >= i ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            <span className="text-gray-500">
              Strength: {strengthLabel || "Too weak"}
            </span>
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm New Password"
            className="border p-2 rounded w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Password Match */}
        {confirmPassword && (
          <p
            className={`text-xs ${
              confirmPassword === newPassword
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {confirmPassword === newPassword
              ? "Passwords match"
              : "Passwords do not match"}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-between gap-3 mt-4">
          <button
            type="button"
            onClick={() => {
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setMessage("");
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentChangePasswordPanel;
