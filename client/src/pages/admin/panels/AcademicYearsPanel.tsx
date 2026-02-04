import { useEffect, useState } from "react";
import api from "../../../api/axiosInstance";

const AcademicYearsPanel = () => {
  const [years, setYears] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const load = async () => {
    const res = await api.get("/academic/academic-year");
    setYears(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.name || !form.startDate || !form.endDate) return;

    await api.post("/academic/academic-year", form);
    setForm({ name: "", startDate: "", endDate: "" });
    load();
  };

  const activate = async (id: string) => {
    await api.patch(`/academic/academic-year/${id}/activate`);
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Academic Years</h2>

      {/* FORM */}
      <div className="flex gap-2">
        <input
          placeholder="Year"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2"
        />
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="border p-2"
        />
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="border p-2"
        />
        <button
          onClick={create}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {years.map((y) => (
            <tr key={y._id} className="border-t">
              <td>{y.name}</td>
              <td>{new Date(y.startDate).toLocaleDateString()}</td>
              <td>{new Date(y.endDate).toLocaleDateString()}</td>
              <td>{y.isActive ? "Active" : "Inactive"}</td>
              <td>
                {!y.isActive && (
                  <button
                    onClick={() => activate(y._id)}
                    className="text-blue-600"
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicYearsPanel;
