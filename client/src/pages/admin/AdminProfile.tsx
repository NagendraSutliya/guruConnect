import { useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaUserShield,
  FaClock,
  FaCamera,
} from "react-icons/fa";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "John Admin",
    email: "admin@guruconnect.com",
    phone: "+91 9876543210",
    role: "Administrator",
    lastLogin: "10 Mar 2026, 09:30 AM",
    profileImage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Profile:", admin);
    alert("Profile updated successfully! (Dummy)");
  };

  const avatarLetter = admin?.name?.charAt(0)?.toUpperCase();

  return (
    <div className="max-w-full bg-white shadow-lg rounded-lg mx-auto px-12 py-6">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Profile</h2>

      <div className="grid md:grid-cols-3 border rounded-lg shadow-md">
        {/* Profile Card */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center">
          {admin.profileImage ? (
            <img
              src={admin.profileImage}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-purple-600 text-white flex items-center justify-center text-4xl font-bold">
              {avatarLetter}
            </div>
          )}

          <button className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <FaCamera />
            Change Photo
          </button>

          <h3 className="mt-4 text-lg font-semibold">{admin.name}</h3>
          <p className="text-gray-500 text-sm">{admin.email}</p>

          <span className="mt-2 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
            Active
          </span>
        </div>

        {/* Profile Form */}
        <div className="bg-white shadow rounded-xl p-6 md:col-span-2">
          {/* Name */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Full Name</label>
            <div className="flex items-center border rounded px-3 py-2 mt-1">
              <FaUserCircle className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                value={admin.name}
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>
            <div className="flex items-center border rounded px-3 py-2 mt-1">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={admin.email}
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Phone</label>
            <div className="flex items-center border rounded px-3 py-2 mt-1">
              <FaPhone className="text-gray-400 mr-2" />
              <input
                type="text"
                name="phone"
                value={admin.phone}
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Role</label>
            <div className="flex items-center border rounded px-3 py-2 mt-1 bg-gray-50">
              <FaUserShield className="text-gray-400 mr-2" />
              <input
                type="text"
                value={admin.role}
                disabled
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Last Login */}
          <div className="mb-6">
            <label className="text-sm text-gray-600">Last Login</label>
            <div className="flex items-center border rounded px-3 py-2 mt-1 bg-gray-50">
              <FaClock className="text-gray-400 mr-2" />
              <input
                type="text"
                value={admin.lastLogin}
                disabled
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FaSave />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
