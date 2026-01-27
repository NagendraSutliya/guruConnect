import React from "react";

interface AddTeacherModalProps {
  form: any;
  setForm: (form: any) => void;
  onSave: () => void;
  onClose: () => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  form,
  setForm,
  onSave,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Add New Teacher</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password *"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Phone Number */}
          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Teacher ID */}
          <input
            type="text"
            placeholder="Teacher ID"
            value={form.teacherId || ""}
            onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Department */}
          <input
            type="text"
            placeholder="Department"
            value={form.department || ""}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Subjects Assigned */}
          <input
            type="text"
            placeholder="Subjects Assigned (comma separated)"
            value={form.subjects || ""}
            onChange={(e) => setForm({ ...form, subjects: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Joining Date */}
          <input
            type="date"
            placeholder="Joining Date"
            value={form.joiningDate || ""}
            onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Save Teacher
          </button>

          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeacherModal;
